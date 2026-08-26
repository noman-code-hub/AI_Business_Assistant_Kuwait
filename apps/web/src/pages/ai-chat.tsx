import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Zap,
  Cpu,
  Clock,
  ChevronRight,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  BarChart3,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { business } from "@/data/dummy";
import { cn } from "@/lib/utils";

const chatHistory = [
  { id: "h1", title: "July revenue summary", time: "Today", preview: "Breakdown by service category..." },
  { id: "h2", title: "WhatsApp reply templates", time: "Yesterday", preview: "Professional Arabic greetings..." },
  { id: "h3", title: "Appointment no-show policy", time: "2 days ago", preview: "Draft cancellation terms..." },
  { id: "h4", title: "Marketing ideas Q3", time: "5 Jul", preview: "Spa package promotions for summer..." },
  { id: "h5", title: "Staff schedule optimizer", time: "3 Jul", preview: "Peak hours coverage plan..." },
];

const promptSuggestions = [
  "Summarize today's appointments and flag any conflicts",
  "Draft a friendly WhatsApp reminder for tomorrow's bookings",
  "What were our top 3 revenue services this week?",
  "Create FAQ answers for parking and clinic hours",
  "Suggest follow-up messages for overdue invoices",
];

const aiMessages = [
  {
    id: 1,
    role: "user" as const,
    content: "Summarize my business performance this week for Noor Wellness Kuwait.",
    time: "09:12",
  },
  {
    id: 2,
    role: "assistant" as const,
    content: `Here's your weekly snapshot for **${business.name}**:

• **Revenue:** 3,940.000 KWD (+8.4% vs last week)
• **Appointments:** 111 bookings across clinic & spa
• **Conversations:** 380 customer messages handled
• **Highlights:** Thursday was your busiest day (720 KWD revenue, 21 appointments)

**Action items:**
1. Follow up on INV-1040 (Rashid Motors — overdue)
2. Confirm Thursday reschedules for Fatima Al-Ahmad
3. Restock Vitamin C Serum (15 units remaining)`,
    time: "09:12",
  },
  {
    id: 3,
    role: "user" as const,
    content: "Draft a WhatsApp message to remind Khalid about his 2 PM appointment today.",
    time: "09:14",
  },
  {
    id: 4,
    role: "assistant" as const,
    content: `Hi Khalid 👋

This is a friendly reminder about your **Executive Health Check** today at **2:00 PM** with Dr. Nasser at Noor Wellness Kuwait.

Please arrive 10 minutes early. Parking is available in the basement (B1).

Reply if you need to reschedule. See you soon!`,
    time: "09:14",
  },
];

const recentPrompts = [
  "Invoice reminder template",
  "Translate to Arabic",
  "Weekly KPI dashboard",
  "Customer retention ideas",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-border/60 bg-card px-4 py-3 shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">AI is thinking...</span>
    </div>
  );
}

export default function AiChatPage() {
  const [activeHistory, setActiveHistory] = useState(chatHistory[0].id);
  const [input, setInput] = useState("");

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[600px] flex-col gap-4 lg:flex-row lg:gap-6">
      {/* History sidebar */}
      <aside className="flex w-full shrink-0 flex-col rounded-2xl border border-border/80 bg-card shadow-sm lg:w-[280px] xl:w-[300px]">
        <div className="border-b border-border/80 p-4">
          <Button className="w-full justify-start gap-2 rounded-2xl" variant="accent">
            <Plus className="h-4 w-4" />
            New conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            History
          </p>
          {chatHistory.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setActiveHistory(h.id)}
              className={cn(
                "mb-1 flex w-full flex-col rounded-2xl p-3 text-start transition-colors",
                activeHistory === h.id
                  ? "bg-emerald-50 dark:bg-emerald-950/40"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <p className="truncate text-sm font-medium">{h.title}</p>
              </div>
              <p className="mt-1 line-clamp-1 ps-5 text-xs text-muted-foreground">{h.preview}</p>
              <p className="mt-1 ps-5 text-[10px] text-muted-foreground">{h.time}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border/80 bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">AI Business Assistant</h2>
              <p className="text-xs text-muted-foreground">Powered by GPT-4o · {business.vertical}</p>
            </div>
          </div>
          <Badge variant="success" className="hidden sm:flex">
            <span className="me-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready
          </Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 md:px-6">
          {aiMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              {msg.role === "assistant" ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                  <Bot className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <span className="text-xs font-semibold">SA</span>
                </div>
              )}
              <div className={cn("max-w-[85%] md:max-w-[75%]", msg.role === "user" && "text-end")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    msg.role === "user"
                      ? "rounded-br-md bg-emerald-600 text-white dark:bg-emerald-700"
                      : "rounded-bl-md border border-border/60 bg-muted/30"
                  )}
                >
                  <div className="whitespace-pre-wrap">{msg.content.replace(/\*\*(.*?)\*\*/g, "$1")}</div>
                </div>
                <div
                  className={cn(
                    "mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {msg.time}
                  {msg.role === "assistant" ? (
                    <div className="ms-2 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
          <TypingDots />
        </div>

        {/* Prompt suggestions */}
        <div className="border-t border-border/80 px-4 py-3 md:px-6">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Try asking</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {promptSuggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="shrink-0 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs transition-colors hover:border-emerald-200 hover:bg-emerald-50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/80 p-4 md:p-6">
          <div className="flex items-end gap-2 rounded-2xl border border-border/80 bg-muted/20 p-2">
            <Textarea
              placeholder="Ask anything about your business..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[48px] max-h-36 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button size="icon" className="shrink-0 rounded-xl">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            AI responses are for demonstration only. No data is sent to external services.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[260px] xl:w-[280px]">
        {/* Model card */}
        <Card className="border-emerald-100/80 dark:border-emerald-900/40">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Cpu className="h-4 w-4 text-emerald-600" />
              Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-950/40">
              <p className="font-semibold text-emerald-800 dark:text-emerald-200">GPT-4o</p>
              <p className="mt-0.5 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                Optimized for business tasks
              </p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Context</span>
                <span className="font-medium">128K tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-medium">0.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language</span>
                <span className="font-medium">EN / AR</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Layers className="h-3.5 w-3.5" />
              Switch model
            </Button>
          </CardContent>
        </Card>

        {/* Token usage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Token Usage
            </CardTitle>
            <CardDescription className="text-xs">This billing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Used</span>
                <span className="font-medium">42,850 / 100,000</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: "42.85%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-muted/50 p-2.5 text-center">
                <p className="text-lg font-semibold">1,240</p>
                <p className="text-[10px] text-muted-foreground">Today</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-2.5 text-center">
                <p className="text-lg font-semibold">8.2K</p>
                <p className="text-[10px] text-muted-foreground">This week</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-900 dark:bg-amber-950/30">
              <Zap className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-[10px] text-amber-800 dark:text-amber-200">
                57% of monthly quota remaining. Resets 1 Aug.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent prompts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-xs transition-colors hover:bg-muted/50"
              >
                <span className="truncate">{prompt}</span>
                <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
