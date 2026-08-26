export const business = {
  name: "Noor Wellness Kuwait",
  owner: "Sara Al-Mutairi",
  vertical: "Clinic & Spa",
  city: "Kuwait City",
};

export const customers = [
  { id: "c1", name: "Fatima Al-Ahmad", phone: "+965 5123 4567", email: "fatima@email.com", business: "Personal", status: "Active", tags: ["VIP", "Clinic"], lastVisit: "Today" },
  { id: "c2", name: "Omar Hassan", phone: "+965 9988 1122", email: "omar.h@email.com", business: "Al Hassan Trading", status: "Active", tags: ["Lead"], lastVisit: "Yesterday" },
  { id: "c3", name: "Noura Saleh", phone: "+965 6001 3344", email: "noura@email.com", business: "Personal", status: "Inactive", tags: ["Spa"], lastVisit: "12 Jul" },
  { id: "c4", name: "Khalid Al-Sabah", phone: "+965 5555 0199", email: "khalid@corp.kw", business: "Sabah Group", status: "Active", tags: ["VIP", "Corporate"], lastVisit: "2 days ago" },
  { id: "c5", name: "Maryam Dashti", phone: "+965 6777 2200", email: "maryam.d@email.com", business: "Personal", status: "Active", tags: ["New"], lastVisit: "Today" },
  { id: "c6", name: "Yousef Al-Rashid", phone: "+965 9444 8811", email: "yousef@email.com", business: "Rashid Motors", status: "Active", tags: ["Fleet"], lastVisit: "5 Jul" },
];

export const appointments = [
  { id: "a1", customer: "Fatima Al-Ahmad", service: "Dermatology Consult", staff: "Dr. Layla", time: "09:00", date: "Today", status: "Confirmed" },
  { id: "a2", customer: "Omar Hassan", service: "Deep Tissue Massage", staff: "Amina", time: "11:30", date: "Today", status: "Scheduled" },
  { id: "a3", customer: "Khalid Al-Sabah", service: "Executive Health Check", staff: "Dr. Nasser", time: "14:00", date: "Today", status: "Confirmed" },
  { id: "a4", customer: "Maryam Dashti", service: "Facial Glow Package", staff: "Huda", time: "16:30", date: "Today", status: "Pending" },
  { id: "a5", customer: "Noura Saleh", service: "Nutrition Follow-up", staff: "Dr. Layla", time: "10:00", date: "Tomorrow", status: "Scheduled" },
];

export const conversations = [
  { id: "m1", name: "Fatima Al-Ahmad", preview: "Can I reschedule to Thursday?", time: "2m", unread: 2, pinned: true, channel: "WhatsApp" },
  { id: "m2", name: "Omar Hassan", preview: "Thanks for the quotation!", time: "18m", unread: 0, pinned: true, channel: "WhatsApp" },
  { id: "m3", name: "Maryam Dashti", preview: "Is parking available near the clinic?", time: "1h", unread: 1, pinned: false, channel: "AI Chat" },
  { id: "m4", name: "Khalid Al-Sabah", preview: "Please send the invoice PDF.", time: "3h", unread: 0, pinned: false, channel: "WhatsApp" },
  { id: "m5", name: "Yousef Al-Rashid", preview: "Fleet checkup for 4 cars next week.", time: "Yesterday", unread: 0, pinned: false, channel: "WhatsApp" },
];

export const messages = [
  { id: 1, from: "customer", text: "Hi, I need to change my appointment.", time: "10:02" },
  { id: 2, from: "agent", text: "Of course, Fatima. Which day works better for you?", time: "10:03" },
  { id: 3, from: "customer", text: "Can I reschedule to Thursday afternoon?", time: "10:05" },
  { id: 4, from: "ai", text: "Suggested reply: Thursday 3:30 PM with Dr. Layla is available. Shall I confirm?", time: "10:05" },
  { id: 5, from: "agent", text: "Thursday at 3:30 PM with Dr. Layla is free. I can book that for you.", time: "10:06" },
];

export const leads = [
  { id: "l1", name: "Reem Al-Enezi", value: 420, stage: "Lead", owner: "Sara" },
  { id: "l2", name: "Bader Co.", value: 1850, stage: "Qualified", owner: "Nasser" },
  { id: "l3", name: "Lina Spa Chain", value: 3200, stage: "Proposal", owner: "Sara" },
  { id: "l4", name: "Gulf Hotels", value: 5400, stage: "Negotiation", owner: "Huda" },
  { id: "l5", name: "Al-Salem Family", value: 280, stage: "Won", owner: "Amina" },
  { id: "l6", name: "QuickFix Home", value: 900, stage: "Lost", owner: "Nasser" },
  { id: "l7", name: "Mona Beauty", value: 650, stage: "Lead", owner: "Huda" },
  { id: "l8", name: "City Gym", value: 2100, stage: "Qualified", owner: "Sara" },
];

export const invoices = [
  { id: "INV-1042", customer: "Sabah Group", amount: 285.5, status: "Paid", date: "18 Jul 2026" },
  { id: "INV-1041", customer: "Fatima Al-Ahmad", amount: 45.0, status: "Sent", date: "17 Jul 2026" },
  { id: "INV-1040", customer: "Rashid Motors", amount: 920.75, status: "Overdue", date: "10 Jul 2026" },
  { id: "INV-1039", customer: "Omar Hassan", amount: 32.25, status: "Draft", date: "09 Jul 2026" },
  { id: "INV-1038", customer: "Al Hassan Trading", amount: 150.0, status: "Paid", date: "05 Jul 2026" },
];

export const quotations = [
  { id: "QT-220", customer: "Gulf Hotels", amount: 5400, status: "Sent", validUntil: "30 Jul 2026" },
  { id: "QT-219", customer: "Lina Spa Chain", amount: 3200, status: "Draft", validUntil: "28 Jul 2026" },
  { id: "QT-218", customer: "City Gym", amount: 2100, status: "Accepted", validUntil: "25 Jul 2026" },
  { id: "QT-217", customer: "Bader Co.", amount: 1850, status: "Declined", validUntil: "20 Jul 2026" },
];

export const products = [
  { id: "p1", name: "Vitamin C Serum", price: 18.5, stock: 42, category: "Skincare", image: "🧴" },
  { id: "p2", name: "Clinic Gift Card", price: 50, stock: 120, category: "Voucher", image: "🎁" },
  { id: "p3", name: "Massage Oil Set", price: 12.75, stock: 28, category: "Wellness", image: "🫧" },
  { id: "p4", name: "Sunscreen SPF50", price: 9.25, stock: 65, category: "Skincare", image: "☀️" },
  { id: "p5", name: "Protein Shake Pack", price: 22.0, stock: 15, category: "Nutrition", image: "🥤" },
  { id: "p6", name: "Aromatherapy Kit", price: 35.5, stock: 9, category: "Wellness", image: "🌿" },
];

export const services = [
  { id: "s1", name: "Dermatology Consult", duration: "30 min", price: 25, category: "Medical", status: "Active" },
  { id: "s2", name: "Deep Tissue Massage", duration: "60 min", price: 35, category: "Spa", status: "Active" },
  { id: "s3", name: "Facial Glow Package", duration: "75 min", price: 45, category: "Beauty", status: "Active" },
  { id: "s4", name: "Executive Health Check", duration: "90 min", price: 120, category: "Medical", status: "Active" },
  { id: "s5", name: "Nutrition Follow-up", duration: "25 min", price: 20, category: "Wellness", status: "Draft" },
];

export const team = [
  { id: "t1", name: "Sara Al-Mutairi", role: "Owner", status: "Online", email: "sara@noor.kw" },
  { id: "t2", name: "Dr. Layla Hassan", role: "Doctor", status: "Online", email: "layla@noor.kw" },
  { id: "t3", name: "Amina Faris", role: "Therapist", status: "Away", email: "amina@noor.kw" },
  { id: "t4", name: "Nasser Ali", role: "Manager", status: "Offline", email: "nasser@noor.kw" },
  { id: "t5", name: "Huda Kamal", role: "Reception", status: "Online", email: "huda@noor.kw" },
];

export const tasks = [
  { id: "k1", title: "Follow up Gulf Hotels quote", priority: "High", due: "Today", status: "Todo" },
  { id: "k2", title: "Restock Vitamin C Serum", priority: "Medium", due: "Tomorrow", status: "Todo" },
  { id: "k3", title: "Prepare July revenue report", priority: "High", due: "24 Jul", status: "In Progress" },
  { id: "k4", title: "Train AI on new FAQ", priority: "Low", due: "25 Jul", status: "In Progress" },
  { id: "k5", title: "Confirm Thursday bookings", priority: "Medium", due: "Today", status: "Done" },
  { id: "k6", title: "WhatsApp broadcast template", priority: "Low", due: "26 Jul", status: "Done" },
];

export const revenueWeekly = [
  { name: "Sat", revenue: 420, conversations: 38, appointments: 12 },
  { name: "Sun", revenue: 380, conversations: 42, appointments: 10 },
  { name: "Mon", revenue: 510, conversations: 55, appointments: 16 },
  { name: "Tue", revenue: 640, conversations: 61, appointments: 18 },
  { name: "Wed", revenue: 590, conversations: 48, appointments: 15 },
  { name: "Thu", revenue: 720, conversations: 70, appointments: 21 },
  { name: "Fri", revenue: 680, conversations: 66, appointments: 19 },
];

export const notifications = [
  { id: "n1", title: "New WhatsApp message", body: "Fatima Al-Ahmad asked to reschedule", time: "2 min ago", category: "Messages", unread: true },
  { id: "n2", title: "Invoice overdue", body: "INV-1040 for Rashid Motors", time: "1 hour ago", category: "Billing", unread: true },
  { id: "n3", title: "Appointment confirmed", body: "Khalid Al-Sabah · 14:00 today", time: "3 hours ago", category: "Appointments", unread: false },
  { id: "n4", title: "AI suggestion ready", body: "3 reply suggestions for Omar Hassan", time: "Yesterday", category: "AI", unread: false },
];

export const integrations = [
  { name: "WhatsApp", status: "Connected", desc: "Cloud API inbox & broadcasts" },
  { name: "Google Calendar", status: "Connected", desc: "Two-way appointment sync" },
  { name: "OpenAI", status: "Connected", desc: "Assistant & reply suggestions" },
  { name: "Stripe", status: "Not connected", desc: "Online payments" },
  { name: "Twilio", status: "Not connected", desc: "SMS campaigns" },
  { name: "Zapier", status: "Not connected", desc: "Workflow automation" },
  { name: "Shopify", status: "Not connected", desc: "Product catalog sync" },
  { name: "WooCommerce", status: "Not connected", desc: "Store orders" },
  { name: "Meta", status: "Connected", desc: "Ads & social inbox" },
  { name: "Google", status: "Connected", desc: "Workspace & analytics" },
  { name: "Microsoft", status: "Not connected", desc: "Outlook calendar" },
];

export const faq = [
  { q: "How do I connect WhatsApp?", a: "Go to Integrations → WhatsApp and follow the Cloud API setup wizard." },
  { q: "Can I switch language to Arabic?", a: "Yes. Use the language switch in the top navigation. The UI supports RTL." },
  { q: "How are invoices numbered?", a: "Invoices auto-increment per business. You can set a prefix in Settings → Branding." },
  { q: "Does AI train on my customer data?", a: "AI uses your Knowledge Base and conversation context within your tenant only." },
];

export const pipelineStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as const;
