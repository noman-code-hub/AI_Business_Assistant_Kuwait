import {
  LayoutDashboard,
  MessagesSquare,
  Bot,
  CalendarCheck,
  Users,
  GitBranch,
  Receipt,
  FileText,
  Package,
  Sparkles,
  Megaphone,
  Radio,
  MessageCircle,
  LineChart,
  BarChart3,
  Calendar,
  CheckSquare,
  UsersRound,
  Workflow,
  BookOpen,
  Puzzle,
  Settings,
  CircleHelp,
  UserRound,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Permission } from "@aba/shared";
import { PERMISSIONS } from "@aba/shared";
import { cn } from "@/lib/utils";
import { useUi } from "@/app/ui-context";
import { useAuth } from "@/app/providers/auth-provider";
import { usePermissions } from "@/app/providers/permissions-provider";
import { Button } from "@/components/ui/button";

const groups: {
  label: string;
  items: {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
    permission?: Permission;
  }[];
}[] = [
  {
    label: "Overview",
    items: [
      { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/conversations", label: "Conversations", icon: MessagesSquare },
      { to: "/app/ai-chat", label: "AI Chat", icon: Bot },
      {
        to: "/app/appointments",
        label: "Appointments",
        icon: CalendarCheck,
        permission: PERMISSIONS.APPOINTMENTS_READ,
      },
      { to: "/app/calendar", label: "Calendar", icon: Calendar },
    ],
  },
  {
    label: "CRM & Sales",
    items: [
      {
        to: "/app/customers",
        label: "Customers",
        icon: Users,
        permission: PERMISSIONS.CUSTOMERS_READ,
      },
      { to: "/app/crm", label: "CRM", icon: GitBranch },
      {
        to: "/app/invoices",
        label: "Invoices",
        icon: Receipt,
        permission: PERMISSIONS.INVOICES_READ,
      },
      { to: "/app/quotations", label: "Quotations", icon: FileText },
      {
        to: "/app/products",
        label: "Products",
        icon: Package,
        permission: PERMISSIONS.PRODUCTS_READ,
      },
      {
        to: "/app/services",
        label: "Services",
        icon: Sparkles,
        permission: PERMISSIONS.SERVICES_READ,
      },
    ],
  },
  {
    label: "Growth",
    items: [
      { to: "/app/marketing", label: "Marketing", icon: Megaphone },
      { to: "/app/campaigns", label: "Campaigns", icon: Radio },
      { to: "/app/whatsapp", label: "WhatsApp", icon: MessageCircle },
      { to: "/app/analytics", label: "Analytics", icon: LineChart },
      {
        to: "/app/reports",
        label: "Reports",
        icon: BarChart3,
        permission: PERMISSIONS.REPORTS_READ,
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/app/tasks", label: "Tasks", icon: CheckSquare },
      { to: "/app/team", label: "Team", icon: UsersRound, permission: PERMISSIONS.TEAM_READ },
      { to: "/app/automation", label: "Automation", icon: Workflow },
      { to: "/app/knowledge", label: "Knowledge Base", icon: BookOpen },
      { to: "/app/integrations", label: "Integrations", icon: Puzzle },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/app/settings",
        label: "Settings",
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_READ,
      },
      { to: "/app/help", label: "Help Center", icon: CircleHelp },
      { to: "/app/profile", label: "Profile", icon: UserRound },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, locale, mobileNavOpen, setMobileNavOpen } = useUi();
  const { signOut } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();
  const collapsed = sidebarCollapsed && !mobileNavOpen;

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permission || can(item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  async function handleLogout() {
    setMobileNavOpen(false);
    try {
      await signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <>
      {mobileNavOpen ? (
        <button
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <motion.aside
        animate={{ width: collapsed ? 72 : 264 }}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col border-e border-white/5 bg-sidebar text-sidebar-foreground",
          "max-lg:w-[264px]! max-lg:transition-transform",
          mobileNavOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full rtl:max-lg:translate-x-full",
          "lg:translate-x-0"
        )}
        style={{ [locale === "ar" ? "right" : "left"]: 0 }}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-white">
            AI
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">AI Business Assistant</p>
              <p className="truncate text-[11px] text-slate-400">Kuwait · Premium</p>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {visibleGroups.map((group) => (
            <div key={group.label}>
              {!collapsed ? (
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
              ) : null}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileNavOpen(false)}
                    title={item.label}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "text-slate-300 hover:bg-sidebar-accent hover:text-white"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/5 p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-sidebar-accent hover:text-white"
            onClick={() => void handleLogout()}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed ? <span>Logout</span> : null}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-sidebar-accent hover:text-white"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            )}
            {!collapsed ? <span>Collapse</span> : null}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
