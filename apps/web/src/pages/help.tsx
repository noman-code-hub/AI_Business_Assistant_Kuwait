import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Headphones,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  PlayCircle,
  Send,
  Ticket,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/primitives";
import { faq } from "@/data/dummy";
import { cn } from "@/lib/utils";

const tutorials = [
  { title: "Getting started in 5 minutes", duration: "5:24", views: "1.2k" },
  { title: "WhatsApp setup walkthrough", duration: "8:12", views: "890" },
  { title: "Building your first automation", duration: "6:45", views: "654" },
];

const tickets = [
  { id: "TK-1042", subject: "Calendar sync issue", status: "Open", date: "20 Jul" },
  { id: "TK-1038", subject: "Invoice PDF formatting", status: "Resolved", date: "15 Jul" },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="relative space-y-8 pb-24">
      <PageHeader
        title="Help & Support"
        description="Find answers, watch tutorials, or contact our team."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-600" />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {faq.map((item, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-border/80">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-muted/50"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", openFaq === idx && "rotate-180")} />
                </button>
                {openFaq === idx && (
                  <p className="border-t border-border/80 px-4 py-3 text-sm text-muted-foreground">{item.a}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Quick start guide", "API documentation", "Release notes"].map((doc) => (
              <button
                key={doc}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-border/80 p-3 text-left text-sm transition-colors hover:bg-muted/50"
              >
                {doc}
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-emerald-600" />
            Video tutorials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {tutorials.map((t) => (
              <div key={t.title} className="group cursor-pointer overflow-hidden rounded-2xl border border-border/80">
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900">
                  <PlayCircle className="h-12 w-12 text-emerald-600 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-4">
                  <p className="font-medium">{t.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.duration} · {t.views} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-emerald-600" />
              Support tickets
            </CardTitle>
            <CardDescription>Your recent requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-2xl border border-border/80 p-4">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.id} · {t.date}
                  </p>
                </div>
                <Badge variant={t.status === "Open" ? "warning" : "success"}>{t.status}</Badge>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full">
              New ticket
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-emerald-600" />
              Contact support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Describe your issue..." />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button">
                <Send className="h-4 w-4" />
                Send message
              </Button>
              <Button type="button" variant="outline">
                <Mail className="h-4 w-4" />
                support@aba.kw
              </Button>
              <Button type="button" variant="outline">
                <Phone className="h-4 w-4" />
                +965 2222 0000
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live chat widget UI */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-4 w-80 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_8px_40px_rgba(15,23,42,0.12)] sm:w-96"
          >
            <div className="bg-emerald-600 px-4 py-3 text-white">
              <p className="font-semibold">Live chat</p>
              <p className="text-xs text-emerald-100">We typically reply in a few minutes</p>
            </div>
            <div className="h-48 space-y-3 overflow-y-auto p-4">
              <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
                Hi! How can we help you today?
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-600 px-3 py-2 text-sm text-white">
                I need help connecting WhatsApp
              </div>
            </div>
            <div className="flex gap-2 border-t border-border/80 p-3">
              <Input placeholder="Type a message..." className="h-9" />
              <Button type="button" size="icon" className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
        <Button
          type="button"
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
