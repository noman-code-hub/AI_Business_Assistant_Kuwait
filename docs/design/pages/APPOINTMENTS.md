# Appointments & Calendar

**Layout:** Dashboard Layout

---

## Appointments — `/app/appointments`

| Field | Spec |
|-------|------|
| **Purpose** | List/manage bookings in table/agenda form |
| **Layout** | List shell with view toggle (List / Calendar link) |
| **Sections** | Header; Filters; Table; Pagination |
| **Cards** | Mobile appointment cards |
| **Tables** | Date/time · Customer · Service · Staff · Location · Status · ⋯ |
| **Forms** | — |
| **Filters** | Date range; Status; Staff; Service; Location; Search customer |
| **Actions** | Confirm; Cancel; Reschedule; Message |
| **Buttons** | Primary “New booking” |
| **Empty State** | “No appointments in this range” + CTA |
| **Loading State** | Table skeleton |
| **Desktop** | Dense table |
| **Tablet** | Hide location column |
| **Mobile** | Cards + status chips |

---

## Calendar — `/app/calendar`

| Field | Spec |
|-------|------|
| **Purpose** | Visual schedule (Salesforce/GHL style) |
| **Layout** | Full-height calendar canvas under header |
| **Sections** | Toolbar (view switcher, today, staff filter); Calendar grid; Event popover |
| **Cards** | Event popover card |
| **Tables** | Agenda subview as list |
| **Forms** | Quick-create in popover |
| **Filters** | Staff multi-select; Location; Service type |
| **Actions** | Create on slot click; Drag resize (affordance) |
| **Buttons** | Today; Month/Week/Day/Agenda; New |
| **Empty State** | Empty day message in agenda |
| **Loading State** | Calendar grid skeleton |
| **Desktop** | Week default; side staff list |
| **Tablet** | Day/Week |
| **Mobile** | Agenda + Day only |

---

## Booking — `/app/appointments/new`

| Field | Spec |
|-------|------|
| **Purpose** | Create appointment |
| **Layout** | Form + live summary card |
| **Sections** | Customer picker; Service; Staff; Date/time; Duration; Location; Notes; Notifications toggles |
| **Cards** | Form card; Summary card (price, duration) |
| **Forms** | Multi-step optional (1 Customer → 2 Service → 3 Time) |
| **Filters** | Available slots filtered by staff |
| **Actions** | Book; Book & charge; Cancel |
| **Buttons** | Primary “Confirm booking”; Accent “Book & WhatsApp confirm” |
| **Empty State** | No slots → suggest other staff/day |
| **Loading State** | Slot skeleton grid |
| **Desktop** | 7/5 split form/summary |
| **Tablet/Mobile** | Stepper wizard full width |

---

## Reschedule — `/app/appointments/:id/reschedule`

| Field | Spec |
|-------|------|
| **Purpose** | Change time/staff without losing history |
| **Layout** | Same as Booking, prefills + “Original time” callout |
| **Sections** | Original appointment banner; New slot picker; Notify customer toggle |
| **Cards** | Comparison card (Before → After) |
| **Forms** | Date, time, staff |
| **Actions** | Save reschedule; Cancel |
| **Buttons** | Primary “Update appointment” |
| **Empty State** | Appointment not found → Error |
| **Loading State** | Form skeleton |
| **Responsive** | Same as Booking |

**Conflict UX:** Warning banner if slot overlaps; force-confirm secondary.
