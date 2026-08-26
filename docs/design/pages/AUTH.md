# Authentication Pages

**Layout:** Authentication Layout  
**Chrome:** Logo · Locale · Theme · Auth card · Legal footer

---

## Login

| Field | Spec |
|-------|------|
| **Purpose** | Sign in existing users to their workspace |
| **Layout** | Auth split; form card centered |
| **Sections** | 1) Title “Welcome back” 2) Email/password form 3) Remember + Forgot 4) Social (Google) optional 5) Register link |
| **Cards** | Single glass/elevated auth card |
| **Tables** | — |
| **Forms** | Email, Password (show/hide), Remember me |
| **Filters** | — |
| **Actions** | Submit login; Continue with Google |
| **Buttons** | Primary “Sign in”; Ghost “Forgot password?”; Link “Create account” |
| **Empty State** | — |
| **Loading State** | Primary button spinner; disable fields |
| **Desktop** | Split brand + form |
| **Tablet** | Slim brand banner + form |
| **Mobile** | Full-width form, logo top |

**Errors:** Inline alert for invalid credentials; field-level Zod messages.

---

## Register

| Field | Spec |
|-------|------|
| **Purpose** | Create account + start tenant onboarding |
| **Layout** | Auth |
| **Sections** | Title; Business name; Full name; Email; Phone (+965); Password; Confirm; Terms checkbox; CTA |
| **Cards** | Auth card |
| **Forms** | Multi-field registration |
| **Actions** | Create account → Verify Email |
| **Buttons** | Primary “Create account”; Link “Sign in” |
| **Empty / Loading** | Button loading; success toast then redirect |
| **Responsive** | Same as Login; longer form scrolls on mobile |

---

## Forgot Password

| Field | Spec |
|-------|------|
| **Purpose** | Request password reset email |
| **Sections** | Title; Helper text; Email; Submit; Back to login |
| **Forms** | Email only |
| **Buttons** | Primary “Send reset link”; Ghost “Back” |
| **Empty** | — |
| **Loading** | Button spinner |
| **Success** | Replace form with confirmation empty-success state (“Check your email”) |
| **Responsive** | Single column all breakpoints |

---

## Reset Password

| Field | Spec |
|-------|------|
| **Purpose** | Set new password from email token |
| **Sections** | Title; New password; Confirm; Strength meter; Submit |
| **Forms** | Password + confirm |
| **Buttons** | Primary “Update password” |
| **Empty** | Invalid/expired token → Error card with “Request new link” |
| **Loading** | Button spinner |
| **Responsive** | Auth card |

---

## Verify Email

| Field | Spec |
|-------|------|
| **Purpose** | Confirm email ownership |
| **Sections** | Icon; “Verify your email”; instructions; Resend; Open mail apps hint |
| **Forms** | Optional 6-digit code if using code flow |
| **Buttons** | Primary “I’ve verified”; Secondary “Resend email” |
| **Empty** | — |
| **Loading** | Resend cooldown timer (60s) |
| **Desktop/Tablet/Mobile** | Centered card; no brand panel required |

**States:** Pending · Verified (auto-redirect) · Expired link (error layout variant).
