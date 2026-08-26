import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Pin,
  Filter,
  MoreHorizontal,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Send,
  Sparkles,
  Languages,
  FileText,
  Wand2,
  Bot,
  ChevronDown,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conversations, messages } from "@/data/dummy";
import { cn } from "@/lib/utils";

const filters = ["All", "Unread", "Pinned", "WhatsApp", "AI Chat"] as const;

const suggestedReplies = [
  "Thursday at 3:30 PM with Dr. Layla is available. Shall I confirm?",
  "Of course! I can move your appointment to Thursday afternoon.",
  "Let me check our calendar and get back to you shortly.",
];

const aiTools = [
  { label: "Translate", icon: Languages, desc: "Arabic ↔ English" },
  { label: "Summarize", icon: FileText, desc: "Key points from thread" },
  { label: "Adjust tone", icon: Wand2, desc: "Professional · Friendly" },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground/50"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function ConversationsPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [search, setSearch] = useState("");

  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Unread" && c.unread > 0) ||
      (activeFilter === "Pinned" && c.pinned) ||
      (activeFilter === "WhatsApp" && c.channel === "WhatsApp") ||
      (activeFilter === "AI Chat" && c.channel === "AI Chat");
    return matchesSearch && matchesFilter;
  });

  const pinned = filtered.filter((c) => c.pinned);
  const rest = filtered.filter((c) => !c.pinned);

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_3px_rgba(15,23,42,0.06)] lg:flex-row">
      {/* Conversation list */}
      <aside className="flex w-full shrink-0 flex-col border-b border-border/80 lg:w-[320px] lg:border-b-0 lg:border-e xl:w-[360px]">
        <div className="space-y-3 border-b border-border/80 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Inbox</h2>
            <Badge variant="success">{conversations.filter((c) => c.unread > 0).length} unread</Badge>
          </div>
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <Button
                key={f}
                variant={activeFilter === f ? "default" : "outline"}
                size="sm"
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => setActiveFilter(f)}
              >
                {f === "Pinned" ? <Pin className="h-3 w-3" /> : null}
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {pinned.length > 0 ? (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pinned
            </p>
          ) : null}
          {pinned.map((c) => (
            <ConversationItem key={c.id} conversation={c} selected={selectedId === c.id} onSelect={setSelectedId} />
          ))}
          {rest.length > 0 && pinned.length > 0 ? (
            <p className="mb-2 mt-4 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Recent
            </p>
          ) : null}
          {rest.map((c) => (
            <ConversationItem key={c.id} conversation={c} selected={selectedId === c.id} onSelect={setSelectedId} />
          ))}
        </div>
      </aside>

      {/* Main chat */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={selected.name} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{selected.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {selected.channel}
                </Badge>
                <span className="text-xs text-emerald-600">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 px-4 py-6 md:px-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn("flex", msg.from === "customer" ? "justify-start" : "justify-end")}
              >
                {msg.from === "ai" ? (
                  <div className="max-w-[85%] rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-800 dark:bg-emerald-950/40 md:max-w-[70%]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      <Bot className="h-3.5 w-3.5" />
                      AI Suggestion
                    </div>
                    <p className="text-sm">{msg.text}</p>
                    <p className="mt-2 text-[10px] text-muted-foreground">{msg.time}</p>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 md:max-w-[70%]",
                      msg.from === "customer"
                        ? "rounded-bl-md bg-card shadow-sm"
                        : "rounded-br-md bg-emerald-600 text-white shadow-sm dark:bg-emerald-700"
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div
                      className={cn(
                        "mt-1 flex items-center justify-end gap-1 text-[10px]",
                        msg.from === "customer" ? "text-muted-foreground" : "text-emerald-100"
                      )}
                    >
                      {msg.time}
                      {msg.from === "agent" ? <CheckCheck className="h-3 w-3" /> : null}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/80 bg-card p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedReplies.slice(0, 2).map((reply) => (
              <button
                key={reply}
                type="button"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-left text-xs text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 dark:hover:bg-emerald-950"
              >
                {reply}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Type a message..."
              className="min-h-[44px] max-h-32 resize-none py-2.5"
              defaultValue=""
            />
            <Button variant="ghost" size="icon" className="shrink-0">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" className="shrink-0 rounded-2xl">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* AI panel */}
      <aside className="hidden w-[300px] shrink-0 flex-col border-s border-border/80 xl:flex">
        <div className="border-b border-border/80 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">AI Assistant</p>
              <p className="text-xs text-muted-foreground">Reply & compose tools</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <Card className="border-emerald-100/80 dark:border-emerald-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Suggested Replies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedReplies.map((reply, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full rounded-2xl border border-border/60 bg-muted/30 p-3 text-left text-xs transition-colors hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
                >
                  {reply}
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Smart Tools</p>
            {aiTools.map((tool) => (
              <button
                key={tool.label}
                type="button"
                className="flex w-full items-center gap-3 rounded-2xl border border-border/60 p-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                  <tool.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
                <ChevronDown className="ms-auto h-4 w-4 -rotate-90 text-muted-foreground" />
              </button>
            ))}
          </div>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Tone preview</p>
              <p className="mt-2 text-sm">
                &ldquo;Hi Fatima! Thursday at 3:30 PM with Dr. Layla works perfectly. I&apos;ve reserved the slot for you.&rdquo;
              </p>
              <div className="mt-3 flex gap-2">
                <Badge variant="success">Professional</Badge>
                <Badge variant="outline">Warm</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}

function ConversationItem({
  conversation: c,
  selected,
  onSelect,
}: {
  conversation: (typeof conversations)[number];
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(c.id)}
      className={cn(
        "mb-1 flex w-full items-start gap-3 rounded-2xl p-3 text-start transition-colors",
        selected ? "bg-emerald-50 dark:bg-emerald-950/40" : "hover:bg-muted/50"
      )}
    >
      <Avatar name={c.name} className="h-10 w-10" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("truncate text-sm font-medium", c.unread > 0 && "text-foreground")}>{c.name}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground">{c.time}</span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.preview}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {c.channel}
          </Badge>
          {c.pinned ? <Pin className="h-3 w-3 text-emerald-600" /> : null}
        </div>
      </div>
      {c.unread > 0 ? (
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-semibold text-white">
          {c.unread}
        </span>
      ) : null}
    </button>
  );
}
