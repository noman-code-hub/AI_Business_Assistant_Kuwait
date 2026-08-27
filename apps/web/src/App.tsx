import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PERMISSIONS } from "@aba/shared";
import { UiProvider } from "@/app/ui-context";
import { AuthProvider } from "@/app/providers/auth-provider";
import { TenantProvider } from "@/app/providers/tenant-provider";
import { PermissionsProvider } from "@/app/providers/permissions-provider";
import { GuestOnly, RequireVerifiedEmail } from "@/components/auth/require-auth";
import { RequirePermission } from "@/components/auth/require-permission";
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
import OnboardingPage from "@/pages/onboarding";

import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import VerifyEmailPage from "@/pages/auth/verify-email";
import AuthActionPage from "@/pages/auth/auth-action";

import NotFoundPage from "@/pages/errors/not-found";
import ServerErrorPage from "@/pages/errors/server-error";
import OfflinePage from "@/pages/errors/offline";

export default function App() {
  return (
    <UiProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <LoginPage />
                </GuestOnly>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnly>
                  <RegisterPage />
                </GuestOnly>
              }
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/auth/action" element={<AuthActionPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/offline" element={<OfflinePage />} />

            <Route
              path="/onboarding"
              element={
                <RequireVerifiedEmail>
                  <TenantProvider>
                    <OnboardingPage />
                  </TenantProvider>
                </RequireVerifiedEmail>
              }
            />

            <Route
              path="/app"
              element={
                <RequireVerifiedEmail>
                  <TenantProvider>
                    <PermissionsProvider>
                      <AppLayout />
                    </PermissionsProvider>
                  </TenantProvider>
                </RequireVerifiedEmail>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="conversations" element={<ConversationsPage />} />
              <Route path="ai-chat" element={<AiChatPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route
                path="customers"
                element={
                  <RequirePermission permission={PERMISSIONS.CUSTOMERS_READ}>
                    <CustomersPage />
                  </RequirePermission>
                }
              />
              <Route path="crm" element={<CrmPage />} />
              <Route
                path="invoices"
                element={
                  <RequirePermission permission={PERMISSIONS.INVOICES_READ}>
                    <InvoicesPage />
                  </RequirePermission>
                }
              />
              <Route path="quotations" element={<QuotationsPage />} />
              <Route
                path="products"
                element={
                  <RequirePermission permission={PERMISSIONS.PRODUCTS_READ}>
                    <ProductsPage />
                  </RequirePermission>
                }
              />
              <Route
                path="services"
                element={
                  <RequirePermission permission={PERMISSIONS.SERVICES_READ}>
                    <ServicesPage />
                  </RequirePermission>
                }
              />
              <Route path="marketing" element={<MarketingPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="whatsapp" element={<WhatsappPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route
                path="reports"
                element={
                  <RequirePermission permission={PERMISSIONS.REPORTS_READ}>
                    <ReportsPage />
                  </RequirePermission>
                }
              />
              <Route path="tasks" element={<TasksPage />} />
              <Route
                path="team"
                element={
                  <RequirePermission permission={PERMISSIONS.TEAM_READ}>
                    <TeamPage />
                  </RequirePermission>
                }
              />
              <Route path="automation" element={<AutomationPage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route
                path="settings"
                element={
                  <RequirePermission
                    anyOf={[PERMISSIONS.SETTINGS_READ, PERMISSIONS.SETTINGS_MANAGE]}
                  >
                    <SettingsPage />
                  </RequirePermission>
                }
              />
              <Route path="help" element={<HelpPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route
                path="subscription"
                element={
                  <RequirePermission permission={PERMISSIONS.SUBSCRIPTION_READ}>
                    <SubscriptionPage />
                  </RequirePermission>
                }
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </UiProvider>
  );
}
