import {
  Bell,
  Languages,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUi } from "@/app/ui-context";
import { useAuth } from "@/app/providers/auth-provider";
import { useTenant } from "@/app/providers/tenant-provider";
import { BusinessSwitcher } from "@/components/layout/business-switcher";
import { cn } from "@/lib/utils";

export function TopNav({ title }: { title?: string }) {
  const { toggleTheme, toggleLocale, theme, locale, setMobileNavOpen, setSearchOpen, sidebarCollapsed } =
    useUi();
  const { user, signOut } = useAuth();
  const { membershipRole } = useTenant();
  const navigate = useNavigate();
  const displayName = user?.displayName ?? user?.email ?? "User";
  const roleLabel = membershipRole ?? "member";

  async function handleSignOut() {
    try {
      await signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/80 bg-card/80 px-4 backdrop-blur-xl md:px-6"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 flex-1 md:block">
        <p className="truncate text-sm font-medium text-muted-foreground">{title ?? "Workspace"}</p>
      </div>

      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-2xl border border-border bg-background px-3 text-sm text-muted-foreground transition hover:border-emerald-300 hover:text-foreground md:min-w-[240px]"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search customers, invoices, pages…</span>
        <span className="ms-auto hidden rounded-lg border border-border px-1.5 py-0.5 text-[10px] md:inline">
          ⌘K
        </span>
      </button>

      <Button className="hidden sm:inline-flex" size="sm">
        <Plus className="h-4 w-4" />
        Quick Create
      </Button>

      <div className="hidden lg:block">
        <BusinessSwitcher />
      </div>

      <Button variant="ghost" size="icon" aria-label="Toggle language" onClick={toggleLocale}>
        <Languages className="h-4 w-4" />
      </Button>
      <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
        {locale.toUpperCase()}
      </span>

      <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
      </Button>

      <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => void handleSignOut()}>
        <LogOut className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 ps-1">
        <Avatar name={displayName} src={user?.photoURL ?? undefined} className="h-9 w-9" />
        {!sidebarCollapsed ? null : null}
        <div className="hidden xl:block">
          <p className="text-sm font-medium leading-none">{displayName}</p>
          <Badge variant="success" className="mt-1 capitalize">
            {roleLabel}
          </Badge>
        </div>
      </div>
    </header>
  );
}
