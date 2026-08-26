import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { useUi } from "@/app/ui-context";
import { GlobalSearch } from "@/components/layout/global-search";
import { cn } from "@/lib/utils";

const titles: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/app/conversations": "Conversations",
  "/app/ai-chat": "AI Chat",
  "/app/appointments": "Appointments",
  "/app/customers": "Customers",
  "/app/crm": "CRM Pipeline",
  "/app/invoices": "Invoices",
  "/app/quotations": "Quotations",
  "/app/products": "Products",
  "/app/services": "Services",
  "/app/marketing": "Marketing",
  "/app/campaigns": "Campaigns",
  "/app/whatsapp": "WhatsApp",
  "/app/analytics": "Analytics",
  "/app/reports": "Reports",
  "/app/calendar": "Calendar",
  "/app/tasks": "Tasks",
  "/app/team": "Team",
  "/app/automation": "Automation",
  "/app/knowledge": "Knowledge Base",
  "/app/integrations": "Integrations",
  "/app/settings": "Settings",
  "/app/help": "Help Center",
  "/app/profile": "Profile",
  "/app/notifications": "Notifications",
  "/app/subscription": "Subscription",
};

export function AppLayout() {
  const { sidebarCollapsed, locale } = useUi();
  const location = useLocation();
  const pad = sidebarCollapsed ? "lg:ps-[72px]" : "lg:ps-[264px]";
  const padRtl = sidebarCollapsed ? "lg:pe-[72px]" : "lg:pe-[264px]";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(locale === "ar" ? padRtl : pad, "transition-[padding] duration-200")}>
        <TopNav title={titles[location.pathname] ?? "Workspace"} />
        <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <GlobalSearch />
    </div>
  );
}
