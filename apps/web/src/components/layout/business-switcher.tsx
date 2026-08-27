import { useMemo, useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/app/providers/tenant-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BusinessSwitcher() {
  const { tenant, businesses, switchBusiness, loading } = useTenant();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const label = tenant?.name ?? "Select business";

  const items = useMemo(() => businesses, [businesses]);

  async function onSelect(id: string) {
    if (id === tenant?.id) {
      setOpen(false);
      return;
    }
    await switchBusiness(id);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="inline-flex max-w-[220px] items-center gap-2"
        disabled={loading || items.length === 0}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {tenant?.logoUrl ? (
          <img src={tenant.logoUrl} alt="" className="h-5 w-5 rounded object-cover" />
        ) : (
          <Building2 className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate">{label}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </Button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close business menu"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            className="absolute end-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
          >
            <ul className="max-h-72 overflow-auto py-1">
              {items.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={b.id === tenant?.id}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted/70",
                      b.id === tenant?.id && "bg-emerald-50"
                    )}
                    onClick={() => void onSelect(b.id)}
                  >
                    {b.logoUrl ? (
                      <img src={b.logoUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate font-medium">{b.name}</span>
                    {b.id === tenant?.id ? <Check className="h-4 w-4 text-emerald-700" /> : null}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                onClick={() => {
                  setOpen(false);
                  navigate("/onboarding");
                }}
              >
                <Plus className="h-4 w-4" />
                Add business
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
