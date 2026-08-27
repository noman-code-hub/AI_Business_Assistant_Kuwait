import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Vertical,
  VERTICAL_LABELS,
  KUWAIT_GOVERNORATES,
  WEEKDAYS,
  defaultWorkingHours,
  createBusinessOnboardingSchema,
  type CreateBusinessOnboardingInput,
  type Weekday,
} from "@aba/shared";
import { useAuth } from "@/app/providers/auth-provider";
import { useTenant } from "@/app/providers/tenant-provider";
import { createBusiness } from "@/services/api/tenants.api";
import { prepareLocalLogo } from "@/services/storage/logo-upload";
import { ApiClientError, setStoredActiveTenantId } from "@/services/api/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/feedback/spinner";
import { cn } from "@/lib/utils";

/**
 * Onboarding wizard temporary client storage (NOT the source of truth):
 * - localStorage `aba:onboarding:draft` — form draft so refresh doesn't lose progress
 * - sessionStorage `aba:onboarding:idempotency` — one Create Business key per tab session
 * Real business data is created only via POST /api/v1/tenants → Firestore (Admin SDK).
 */
const DRAFT_KEY = "aba:onboarding:draft";
const IDEMPOTENCY_KEY = "aba:onboarding:idempotency";

const STEPS = [
  "Business info",
  "Business type",
  "Location",
  "Working hours",
  "Services",
  "Review",
] as const;

type DraftService = {
  id: string;
  name: string;
  description: string;
  price: string;
  durationMinutes: string;
};

type DraftState = {
  name: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  address: string;
  governorate: string;
  country: string;
  currency: string;
  timezone: string;
  vertical: string;
  customVerticalLabel: string;
  workingHours: CreateBusinessOnboardingInput["workingHours"];
  services: DraftService[];
};

function emptyDraft(): DraftState {
  return {
    name: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    logoUrl: "",
    address: "",
    governorate: "Hawalli",
    country: "Kuwait",
    currency: "KWD",
    timezone: "Asia/Kuwait",
    vertical: Vertical.SALON,
    customVerticalLabel: "",
    workingHours: defaultWorkingHours(),
    services: [],
  };
}

function loadDraft(): DraftState {
  try {
    // Temporary onboarding form only — cleared after successful Create Business
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft();
    return { ...emptyDraft(), ...JSON.parse(raw) };
  } catch {
    return emptyDraft();
  }
}

function getOrCreateIdempotencyKey(): string {
  try {
    // sessionStorage: survives refresh in this tab, not a permanent business id
    const existing = sessionStorage.getItem(IDEMPOTENCY_KEY);
    if (existing) return existing;
    const key = crypto.randomUUID();
    sessionStorage.setItem(IDEMPOTENCY_KEY, key);
    return key;
  } catch {
    return crypto.randomUUID();
  }
}

function FieldLabel({ children, htmlFor }: { children: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function inputClass(hasError?: boolean) {
  return cn(
    "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-emerald-500/30 focus:ring-2",
    hasError ? "border-destructive" : "border-border"
  );
}

export default function OnboardingPage() {
  const { firebaseUser } = useAuth();
  const { refresh, businesses } = useTenant();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftState>(() => loadDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    try {
      // Persist wizard draft so a page refresh does not lose in-progress answers
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota / privacy errors
    }
  }, [draft]);

  const patch = useCallback((partial: Partial<DraftState>) => {
    setDraft((d) => ({ ...d, ...partial }));
  }, []);

  const progress = ((step + 1) / STEPS.length) * 100;

  function validateStep(index: number): boolean {
    const nextErrors: Record<string, string> = {};
    if (index === 0) {
      if (draft.name.trim().length < 2) nextErrors.name = "Business name is required (min 2 characters)";
      if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
        nextErrors.email = "Enter a valid email";
      }
      if (draft.website) {
        try {
          new URL(draft.website);
        } catch {
          nextErrors.website = "Enter a valid URL (https://…)";
        }
      }
      if (draft.phone && !/^\+?[0-9\s()-]{8,20}$/.test(draft.phone)) {
        nextErrors.phone = "Enter a valid phone number";
      }
    }
    if (index === 1) {
      if (!draft.vertical) nextErrors.vertical = "Select a business type";
      if (draft.vertical === Vertical.OTHER && !draft.customVerticalLabel.trim()) {
        nextErrors.customVerticalLabel = "Describe your business type";
      }
    }
    if (index === 2) {
      if (!draft.country.trim()) nextErrors.country = "Country is required";
      if (!draft.currency.trim()) nextErrors.currency = "Currency is required";
      if (!draft.timezone.trim()) nextErrors.timezone = "Timezone is required";
    }
    if (index === 3) {
      for (const day of WEEKDAYS) {
        const hours = draft.workingHours[day];
        if (!hours.enabled) continue;
        if (!hours.open) nextErrors[`workingHours.${day}.open`] = "Required";
        if (!hours.close) nextErrors[`workingHours.${day}.close`] = "Required";
        if (hours.open && hours.close && hours.close <= hours.open) {
          nextErrors[`workingHours.${day}.close`] = "Must be after open";
        }
      }
    }
    if (index === 4) {
      draft.services.forEach((s, i) => {
        if (!s.name.trim()) nextErrors[`services.${i}.name`] = "Name required";
        const price = Number(s.price);
        if (!Number.isFinite(price) || price < 0) nextErrors[`services.${i}.price`] = "Invalid price";
        const duration = Number(s.durationMinutes);
        if (!Number.isFinite(duration) || duration <= 0) {
          nextErrors[`services.${i}.durationMinutes`] = "Invalid duration";
        }
      });
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (logoUploading) {
      setSubmitError("Logo is still being prepared. Wait, or click Cancel / skip logo, then Next.");
      return;
    }
    if (!validateStep(step)) return;
    setSubmitError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onLogoChange(file: File | null) {
    if (!file || !firebaseUser) return;
    setLogoUploading(true);
    setSubmitError(null);
    try {
      // Local only: resize → data URL → draft (localStorage). No Firebase Storage wait.
      const dataUrl = await prepareLocalLogo(file);
      patch({ logoUrl: dataUrl });
    } catch (err) {
      patch({ logoUrl: "" });
      setSubmitError(err instanceof Error ? err.message : "Logo failed");
    } finally {
      setLogoUploading(false);
    }
  }

  function clearLogo() {
    patch({ logoUrl: "" });
    setLogoUploading(false);
    setSubmitError(null);
  }

  function addService() {
    patch({
      services: [
        ...draft.services,
        {
          id: crypto.randomUUID(),
          name: "",
          description: "",
          price: "0",
          durationMinutes: "30",
        },
      ],
    });
  }

  function updateService(id: string, partial: Partial<DraftService>) {
    patch({
      services: draft.services.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    });
  }

  function removeService(id: string) {
    patch({ services: draft.services.filter((s) => s.id !== id) });
  }

  function setDayHours(day: Weekday, partial: Partial<DraftState["workingHours"][Weekday]>) {
    patch({
      workingHours: {
        ...draft.workingHours,
        [day]: { ...draft.workingHours[day], ...partial },
      },
    });
  }

  const payloadPreview = useMemo(() => draft, [draft]);

  /** Browsers sometimes give `09:00:00` from `<input type="time">`; API expects `HH:mm`. */
  function normalizeTime(value: string | null | undefined): string | null {
    if (!value) return null;
    const match = /^(\d{2}):(\d{2})/.exec(value.trim());
    return match ? `${match[1]}:${match[2]}` : value;
  }

  function normalizeWorkingHours(
    hours: CreateBusinessOnboardingInput["workingHours"]
  ): CreateBusinessOnboardingInput["workingHours"] {
    const next = { ...hours };
    for (const day of WEEKDAYS) {
      const d = next[day];
      next[day] = {
        ...d,
        open: d.enabled ? normalizeTime(d.open) : null,
        close: d.enabled ? normalizeTime(d.close) : null,
      };
    }
    return next;
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    // Never leave the button stuck disabled because of a hung logo upload
    if (logoUploading) {
      setSubmitError("Logo is still being prepared. Wait a second, or click Cancel / skip logo.");
      return;
    }
    for (let i = 0; i < STEPS.length - 1; i++) {
      if (!validateStep(i)) {
        setStep(i);
        setSubmitError(`Please fix the errors in step ${i + 1} (${STEPS[i]}), then continue.`);
        return;
      }
    }

    const body = {
      name: draft.name.trim(),
      description: draft.description.trim() || undefined,
      logoUrl: draft.logoUrl || undefined,
      phone: draft.phone.trim() || undefined,
      email: draft.email.trim() || undefined,
      website: draft.website.trim() || undefined,
      address: draft.address.trim() || undefined,
      governorate: draft.governorate || undefined,
      country: draft.country.trim() || "Kuwait",
      currency: draft.currency.trim() || "KWD",
      timezone: draft.timezone.trim() || "Asia/Kuwait",
      vertical: draft.vertical as CreateBusinessOnboardingInput["vertical"],
      customVerticalLabel: draft.customVerticalLabel.trim() || undefined,
      locale: "en" as const,
      workingHours: normalizeWorkingHours(draft.workingHours),
      services: draft.services.map((s) => ({
        name: s.name.trim(),
        description: s.description.trim() || undefined,
        price: Number(s.price),
        durationMinutes: Number(s.durationMinutes),
      })),
    };

    const parsed = createBusinessOnboardingSchema.safeParse(body);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[issue.path.join(".")] = issue.message;
      }
      setErrors(map);
      const first = parsed.error.issues[0];
      setSubmitError(
        first
          ? `Validation: ${first.path.join(".")} — ${first.message}`
          : "Please fix validation errors before creating the business."
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const idempotencyKey = getOrCreateIdempotencyKey();
      const result = await createBusiness(parsed.data, idempotencyKey);
      // Remember active tenant preference (localStorage) — membership still verified by API
      setStoredActiveTenantId(result.tenantId);
      try {
        // Clear temporary client draft / idempotency keys after Firestore create succeeds
        localStorage.removeItem(DRAFT_KEY);
        sessionStorage.removeItem(IDEMPOTENCY_KEY);
      } catch {
        // ignore
      }
      await refresh();
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(
          err.status === 0 || /fetch|network/i.test(err.message)
            ? "Cannot reach API. Run npm run dev:api and check apps/api/.env."
            : err.message
        );
      } else if (err instanceof TypeError) {
        setSubmitError("Cannot reach API at localhost:8080. Start it with: npm run dev:api");
      } else {
        setSubmitError(err instanceof Error ? err.message : "Failed to create business");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-background to-background px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-700">Business setup</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              {businesses.length ? "Add another business" : "Create your business"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </div>
          {businesses.length > 0 ? (
            <Button type="button" variant="outline" onClick={() => navigate("/app/dashboard")}>
              Back to workspace
            </Button>
          ) : null}
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <form
          onSubmit={(e) => void handleCreate(e)}
          className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur md:p-8"
        >
          {step === 0 ? (
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="name">Business name *</FieldLabel>
                <input
                  id="name"
                  className={inputClass(Boolean(errors.name))}
                  value={draft.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  maxLength={120}
                  autoFocus
                />
                <FieldError message={errors.name} />
              </div>
              <div>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                  id="description"
                  className={cn(inputClass(), "h-24 py-2")}
                  value={draft.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  maxLength={2000}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <input
                    id="phone"
                    className={inputClass(Boolean(errors.phone))}
                    placeholder="+965…"
                    value={draft.phone}
                    onChange={(e) => patch({ phone: e.target.value })}
                  />
                  <FieldError message={errors.phone} />
                </div>
                <div>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <input
                    id="email"
                    type="email"
                    className={inputClass(Boolean(errors.email))}
                    value={draft.email}
                    onChange={(e) => patch({ email: e.target.value })}
                  />
                  <FieldError message={errors.email} />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="website">Website</FieldLabel>
                <input
                  id="website"
                  className={inputClass(Boolean(errors.website))}
                  placeholder="https://"
                  value={draft.website}
                  onChange={(e) => patch({ website: e.target.value })}
                />
                <FieldError message={errors.website} />
              </div>
              <div>
                <FieldLabel htmlFor="logo">Logo (optional)</FieldLabel>
                <p className="mb-2 text-xs text-muted-foreground">
                  Saved in this browser (localStorage) with your onboarding draft — no cloud upload wait.
                </p>
                <input
                  id="logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={logoUploading || !firebaseUser}
                  onChange={(e) => void onLogoChange(e.target.files?.[0] ?? null)}
                />
                {logoUploading ? (
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">Preparing logo…</p>
                    <button
                      type="button"
                      className="text-xs font-medium text-emerald-700 hover:underline"
                      onClick={clearLogo}
                    >
                      Cancel / skip logo
                    </button>
                  </div>
                ) : null}
                {draft.logoUrl ? (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={draft.logoUrl} alt="Logo preview" className="h-16 w-16 rounded-xl object-cover" />
                    <button
                      type="button"
                      className="text-xs font-medium text-muted-foreground hover:underline"
                      onClick={clearLogo}
                    >
                      Remove logo
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Choose the closest match for your business.</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  Vertical.SALON,
                  Vertical.CLINIC,
                  Vertical.RESTAURANT,
                  Vertical.CAR_RENTAL,
                  Vertical.REAL_ESTATE,
                  Vertical.GYM,
                  Vertical.RETAIL,
                  Vertical.EVENTS,
                  Vertical.HOME_SERVICES,
                  Vertical.OTHER,
                ].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => patch({ vertical: v })}
                    className={cn(
                      "rounded-2xl border px-3 py-4 text-left text-sm font-medium transition",
                      draft.vertical === v
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                        : "border-border hover:border-emerald-300"
                    )}
                  >
                    {VERTICAL_LABELS[v]}
                  </button>
                ))}
              </div>
              <FieldError message={errors.vertical} />
              {draft.vertical === Vertical.OTHER ? (
                <div>
                  <FieldLabel htmlFor="customVertical">Custom type *</FieldLabel>
                  <input
                    id="customVertical"
                    className={inputClass(Boolean(errors.customVerticalLabel))}
                    value={draft.customVerticalLabel}
                    onChange={(e) => patch({ customVerticalLabel: e.target.value })}
                  />
                  <FieldError message={errors.customVerticalLabel} />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <input
                  id="address"
                  className={inputClass()}
                  value={draft.address}
                  onChange={(e) => patch({ address: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel htmlFor="governorate">Governorate</FieldLabel>
                <select
                  id="governorate"
                  className={inputClass()}
                  value={draft.governorate}
                  onChange={(e) => patch({ governorate: e.target.value })}
                >
                  <option value="">Select…</option>
                  {KUWAIT_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <input
                    id="country"
                    className={inputClass(Boolean(errors.country))}
                    value={draft.country}
                    onChange={(e) => patch({ country: e.target.value })}
                  />
                  <FieldError message={errors.country} />
                </div>
                <div>
                  <FieldLabel htmlFor="currency">Currency</FieldLabel>
                  <input
                    id="currency"
                    className={inputClass(Boolean(errors.currency))}
                    value={draft.currency}
                    onChange={(e) => patch({ currency: e.target.value.toUpperCase() })}
                    maxLength={3}
                  />
                  <FieldError message={errors.currency} />
                </div>
                <div>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <input
                    id="timezone"
                    className={inputClass(Boolean(errors.timezone))}
                    value={draft.timezone}
                    onChange={(e) => patch({ timezone: e.target.value })}
                  />
                  <FieldError message={errors.timezone} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
              {WEEKDAYS.map((day) => {
                const hours = draft.workingHours[day];
                return (
                  <div
                    key={day}
                    className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-border p-3 md:grid-cols-[140px_80px_1fr_1fr]"
                  >
                    <p className="text-sm font-medium capitalize">{day}</p>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={hours.enabled}
                        onChange={(e) =>
                          setDayHours(day, {
                            enabled: e.target.checked,
                            open: e.target.checked ? hours.open ?? "09:00" : null,
                            close: e.target.checked ? hours.close ?? "22:00" : null,
                          })
                        }
                      />
                      Open
                    </label>
                    <input
                      type="time"
                      disabled={!hours.enabled}
                      className={inputClass(Boolean(errors[`workingHours.${day}.open`]))}
                      value={hours.open ?? ""}
                      onChange={(e) => setDayHours(day, { open: e.target.value })}
                    />
                    <input
                      type="time"
                      disabled={!hours.enabled}
                      className={inputClass(Boolean(errors[`workingHours.${day}.close`]))}
                      value={hours.close ?? ""}
                      onChange={(e) => setDayHours(day, { close: e.target.value })}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Optional — add a few services now. You can manage the full catalog later.
              </p>
              {draft.services.map((s, i) => (
                <div key={s.id} className="space-y-2 rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Service {i + 1}</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeService(s.id)}>
                      Remove
                    </Button>
                  </div>
                  <input
                    className={inputClass(Boolean(errors[`services.${i}.name`]))}
                    placeholder="Name"
                    value={s.name}
                    onChange={(e) => updateService(s.id, { name: e.target.value })}
                  />
                  <textarea
                    className={cn(inputClass(), "h-20 py-2")}
                    placeholder="Description"
                    value={s.description}
                    onChange={(e) => updateService(s.id, { description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className={inputClass(Boolean(errors[`services.${i}.price`]))}
                      placeholder="Price (KWD)"
                      inputMode="decimal"
                      value={s.price}
                      onChange={(e) => updateService(s.id, { price: e.target.value })}
                    />
                    <input
                      className={inputClass(Boolean(errors[`services.${i}.durationMinutes`]))}
                      placeholder="Duration (min)"
                      inputMode="numeric"
                      value={s.durationMinutes}
                      onChange={(e) => updateService(s.id, { durationMinutes: e.target.value })}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addService}>
                Add service
              </Button>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4 text-sm">
              <ReviewBlock title="Business">
                <p className="font-medium">{payloadPreview.name}</p>
                <p className="text-muted-foreground">{payloadPreview.description || "—"}</p>
                <p>{payloadPreview.phone || "No phone"} · {payloadPreview.email || "No email"}</p>
              </ReviewBlock>
              <ReviewBlock title="Type">
                {VERTICAL_LABELS[payloadPreview.vertical as keyof typeof VERTICAL_LABELS] ??
                  payloadPreview.vertical}
                {payloadPreview.customVerticalLabel ? ` — ${payloadPreview.customVerticalLabel}` : ""}
              </ReviewBlock>
              <ReviewBlock title="Location">
                {[payloadPreview.address, payloadPreview.governorate, payloadPreview.country]
                  .filter(Boolean)
                  .join(", ") || "—"}
                <br />
                {payloadPreview.currency} · {payloadPreview.timezone}
              </ReviewBlock>
              <ReviewBlock title="Working hours">
                {WEEKDAYS.map((d) => {
                  const h = payloadPreview.workingHours[d];
                  return (
                    <div key={d} className="flex justify-between capitalize">
                      <span>{d}</span>
                      <span>{h.enabled ? `${h.open} – ${h.close}` : "Closed"}</span>
                    </div>
                  );
                })}
              </ReviewBlock>
              <ReviewBlock title="Services">
                {payloadPreview.services.length === 0
                  ? "None added"
                  : payloadPreview.services.map((s) => (
                      <div key={s.id} className="flex justify-between gap-3">
                        <span>{s.name}</span>
                        <span>
                          {s.price} KWD · {s.durationMinutes} min
                        </span>
                      </div>
                    ))}
              </ReviewBlock>
            </div>
          ) : null}

          {submitError ? (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {submitError}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || submitting}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner /> Creating…
                  </>
                ) : logoUploading ? (
                  "Wait for logo…"
                ) : (
                  "Create Business"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
