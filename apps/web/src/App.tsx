import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UiProvider } from "@/app/ui-context";
import { AppLayout } from "@/components/layout/app-layout";

import DashboardPage from "@/pages/dashboard";
import ConversationsPage from "@/pages/conversations";
import AiChatPage from "@/pages/ai-chat";
import AppointmentsPage from "@/pages/appointments";
import CalendarPage from "@/pages/calendar";
import CustomersPage from "@/pages/customers";
import CrmPage from "@/pages/crm";
import InvoicesPage from "@/pages/invoices";
import QuotationsPage from "@/pages/quotations";
import ProductsPage from "@/pages/products";
import ServicesPage from "@/pages/services";
import MarketingPage from "@/pages/marketing";
import CampaignsPage from "@/pages/campaigns";
import WhatsappPage from "@/pages/whatsapp";
import AnalyticsPage from "@/pages/analytics";
import ReportsPage from "@/pages/reports";
import TasksPage from "@/pages/tasks";
import TeamPage from "@/pages/team";
import AutomationPage from "@/pages/automation";
import KnowledgePage from "@/pages/knowledge";
import IntegrationsPage from "@/pages/integrations";
import SettingsPage from "@/pages/settings";
import HelpPage from "@/pages/help";
import ProfilePage from "@/pages/profile";
import NotificationsPage from "@/pages/notifications";
import SubscriptionPage from "@/pages/subscription";

import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import VerifyEmailPage from "@/pages/auth/verify-email";

import NotFoundPage from "@/pages/errors/not-found";
import ServerErrorPage from "@/pages/errors/server-error";
import OfflinePage from "@/pages/errors/offline";

export default function App() {
  return (
    <UiProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/offline" element={<OfflinePage />} />

          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="ai-chat" element={<AiChatPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="crm" element={<CrmPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="marketing" element={<MarketingPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="whatsapp" element={<WhatsappPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="automation" element={<AutomationPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </UiProvider>
  );
}
