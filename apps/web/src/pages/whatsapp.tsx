import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  CheckCheck,
  Image,
  Megaphone,
  MessageCircle,
  Paperclip,
  Pin,
  Play,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { conversations, messages, integrations } from "@/data/dummy";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const templates = [
  { id: "wt1", name: "Appointment Confirmation", preview: "Hi {{name}}, your appointment is confirmed for..." },
  { id: "wt2", name: "Payment Reminder", preview: "Dear {{name}}, this is a friendly reminder about..." },
  { id: "wt3", name: "Promo Offer", preview: "Exclusive offer for our valued clients! Get 20% off..." },
  { id: "wt4", name: "Follow-up After Visit", preview: "Thank you for visiting Noor Wellness. How was your..." },
];

const quickReplies = [
  "Yes, confirmed ✓",
  "I'll check availability",
  "Sending invoice now",
  "Thank you!",
  "Can I call you?",
];

const automations = [
  { id: "a1", name: "Auto-reply after hours", trigger: "Outside business hours", status: "Active" },
  { id: "a2", name: "Appointment reminder", trigger: "24h before booking", status: "Active" },
  { id: "a3", name: "Welcome new contact", trigger: "First message received", status: "Active" },
  { id: "a4", name: "Payment follow-up", trigger: "Invoice overdue 3 days", status: "Paused" },
];

const mediaPlaceholders = ["🖼️ Clinic Tour", "📋 Price List", "🎥 Spa Promo", "📄 Consent Form"];

export default function WhatsAppPage() {
  const [activeChat, setActiveChat] = useState(conversations[0]?.id ?? "");
  const whatsappIntegration = integrations.find((i) => i.name === "WhatsApp");
  const selected = conversations.find((c) => c.id === activeChat);

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp"
        description="Inbox, broadcasts, templates, and automation for WhatsApp Business."
        actions={
          <Button>
            <Megaphone className="h-4 w-4" />
            New Broadcast
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Conversations" value={String(conversations.length)} icon={MessageCircle} />
        <StatCard label="Unread" value={String(conversations.reduce((s, c) => s + c.unread, 0))} icon={Send} />
        <StatCard label="Templates" value={String(templates.length)} icon={Sparkles} />
        <StatCard
          label="API Status"
          value={whatsappIntegration?.status ?? "Unknown"}
          change={whatsappIntegration?.desc}
          icon={Zap}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Conversation list */}
        <Card className="overflow-hidden lg:col-span-1">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Chats</CardTitle>
              <Badge variant={whatsappIntegration?.status === "Connected" ? "success" : "warning"}>
                {whatsappIntegration?.status}
              </Badge>
            </div>
            <Input placeholder="Search conversations..." className="mt-3" />
          </CardHeader>
          <CardContent className="max-h-[420px] overflow-y-auto p-0">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setActiveChat(chat.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-start transition-colors hover:bg-muted/50",
                  activeChat === chat.id && "bg-emerald-50/60 dark:bg-emerald-950/30"
                )}
              >
                <Avatar name={chat.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{chat.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1">
                    {chat.pinned ? <Pin className="h-3 w-3 text-emerald-600" /> : null}
                    <p className="truncate text-sm text-muted-foreground">{chat.preview}</p>
                  </div>
                </div>
                {chat.unread > 0 ? (
                  <Badge className="shrink-0 rounded-full bg-emerald-500 text-white">{chat.unread}</Badge>
                ) : null}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Chat view */}
        <Card className="flex flex-col overflow-hidden lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 border-b border-border/60 pb-4">
            <Avatar name={selected?.name ?? "Guest"} />
            <div className="flex-1">
              <CardTitle className="text-base">{selected?.name ?? "Select a chat"}</CardTitle>
              <CardDescription>{selected?.channel ?? "WhatsApp Business"}</CardDescription>
            </div>
            <Badge variant="success">Online</Badge>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#e5ddd5]/30 p-4 dark:bg-emerald-950/10" style={{ minHeight: 320 }}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                  msg.from === "customer" && "self-start rounded-bl-md bg-white dark:bg-card",
                  msg.from === "agent" && "self-end rounded-br-md bg-emerald-100 dark:bg-emerald-900/40",
                  msg.from === "ai" && "self-end max-w-[90%] rounded-br-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50"
                )}
              >
                {msg.from === "ai" ? (
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <Bot className="h-3 w-3" /> AI Suggestion
                  </div>
                ) : null}
                <p>{msg.text}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                  {msg.time}
                  {msg.from === "agent" ? <CheckCheck className="h-3 w-3 text-sky-500" /> : null}
                </div>
              </motion.div>
            ))}
          </CardContent>
          <div className="border-t border-border/60 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((reply) => (
                <Button key={reply} variant="outline" size="sm" className="h-7 rounded-full text-xs">
                  {reply}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input placeholder="Type a message..." className="flex-1" />
              <Button size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Broadcast section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Broadcast</CardTitle>
              <CardDescription>Send a message to multiple contacts at once</CardDescription>
            </div>
            <Button>
              <Megaphone className="h-4 w-4" />
              Create Broadcast
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-dashed border-border p-4 text-center">
              <p className="text-2xl font-semibold">342</p>
              <p className="text-sm text-muted-foreground">Eligible contacts</p>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-4 text-center">
              <p className="text-2xl font-semibold">4</p>
              <p className="text-sm text-muted-foreground">Approved templates</p>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-4 text-center">
              <p className="text-2xl font-semibold">76%</p>
              <p className="text-sm text-muted-foreground">Avg. read rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Template Messages</CardTitle>
            <CardDescription>Pre-approved WhatsApp templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.preview}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Media gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Media Gallery</CardTitle>
            <CardDescription>Shared files and assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {mediaPlaceholders.map((label) => (
                <div
                  key={label}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-muted/50 text-center text-sm"
                >
                  <Image className="h-6 w-6 text-muted-foreground" />
                  <span className="px-2 text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Automations</CardTitle>
            <CardDescription>WhatsApp workflow rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {automations.map((auto) => (
              <div key={auto.id} className="flex items-start justify-between gap-2 rounded-2xl border border-border/60 p-3">
                <div>
                  <p className="text-sm font-medium">{auto.name}</p>
                  <p className="text-xs text-muted-foreground">{auto.trigger}</p>
                </div>
                <Badge variant={auto.status === "Active" ? "success" : "secondary"}>{auto.status}</Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              <Play className="h-3.5 w-3.5" />
              Manage Automations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
