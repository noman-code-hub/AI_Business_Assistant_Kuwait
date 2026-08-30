import { useState, type FormEvent } from "react";
import type { CreateCustomerInput, Customer, CustomerSource, UpdateCustomerInput } from "@aba/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiClientError } from "@/services/api/client";

const SOURCES: { value: CustomerSource; label: string }[] = [
  { value: "manual", label: "Manual" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "booking", label: "Booking" },
  { value: "website", label: "Website" },
  { value: "ai_assistant", label: "AI Assistant" },
  { value: "referral", label: "Referral" },
  { value: "import", label: "Import" },
];

export type CustomerFormValues = {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  notes: string;
  tags: string;
  source: CustomerSource;
};

function customerToForm(c?: Customer | null): CustomerFormValues {
  return {
    name: c?.name || c?.fullName || "",
    phone: c?.phone ?? "",
    whatsapp: c?.whatsapp ?? "",
    email: c?.email ?? "",
    address: c?.address ?? "",
    notes: c?.notes ?? "",
    tags: (c?.tags ?? []).join(", "),
    source: c?.source ?? "manual",
  };
}

function formToPayload(values: CustomerFormValues): CreateCustomerInput | UpdateCustomerInput {
  const tags = values.tags
    .split(/[,|]/)
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    name: values.name.trim(),
    phone: values.phone.trim() || undefined,
    whatsapp: values.whatsapp.trim() || undefined,
    email: values.email.trim() || undefined,
    address: values.address.trim() || undefined,
    notes: values.notes.trim() || undefined,
    tags: tags.length ? tags : undefined,
    source: values.source,
  };
}

type CustomerFormProps = {
  initial?: Customer | null;
  submitLabel?: string;
  onSubmit: (payload: CreateCustomerInput | UpdateCustomerInput) => Promise<void>;
  onCancel?: () => void;
};

export function CustomerForm({
  initial,
  submitLabel = "Save customer",
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>(() => customerToForm(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(formToPayload(values));
    } catch (err) {
      if (err instanceof ApiClientError && err.details?.length) {
        setError(err.details.map((d) => d.message).join("; "));
      } else {
        setError(err instanceof Error ? err.message : "Failed to save customer");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => void handleSubmit(e)}>
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="customer-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="customer-name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          placeholder="Ahmed Al-Ahmad"
          required
          maxLength={120}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="customer-phone" className="text-sm font-medium">
          Phone
        </label>
        <Input
          id="customer-phone"
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          placeholder="+965 5000 0000"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="customer-whatsapp" className="text-sm font-medium">
          WhatsApp
        </label>
        <Input
          id="customer-whatsapp"
          value={values.whatsapp}
          onChange={(e) => setValues((v) => ({ ...v, whatsapp: e.target.value }))}
          placeholder="+965 5000 0000"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="customer-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="customer-email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          placeholder="you@email.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="customer-source" className="text-sm font-medium">
          Source
        </label>
        <select
          id="customer-source"
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
          value={values.source}
          onChange={(e) =>
            setValues((v) => ({ ...v, source: e.target.value as CustomerSource }))
          }
        >
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="customer-address" className="text-sm font-medium">
          Address
        </label>
        <Input
          id="customer-address"
          value={values.address}
          onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
          placeholder="Salmiya, Kuwait"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="customer-tags" className="text-sm font-medium">
          Tags
        </label>
        <Input
          id="customer-tags"
          value={values.tags}
          onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value }))}
          placeholder="VIP, Regular (comma separated)"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <label htmlFor="customer-notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="customer-notes"
          className="min-h-[88px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          placeholder="Internal notes about this customer"
          maxLength={2000}
        />
      </div>
      {error ? <p className="text-sm text-destructive sm:col-span-2">{error}</p> : null}
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function displayCustomerName(c: Customer): string {
  return c.name || c.fullName || "Customer";
}

export function formatCustomerDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-KW", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
