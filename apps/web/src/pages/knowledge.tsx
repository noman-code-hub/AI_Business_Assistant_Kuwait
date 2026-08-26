import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, FileText, FolderOpen, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/primitives";
import { faq } from "@/data/dummy";
import { abaMotion } from "@/design-system/motion/tokens";
import { cn } from "@/lib/utils";

const categories = ["Getting Started", "Integrations", "Billing", "AI Assistant", "Team & Roles"];
const articles = [
  { title: "Setting up your business profile", category: "Getting Started", readTime: "4 min" },
  { title: "WhatsApp Cloud API guide", category: "Integrations", readTime: "8 min" },
  { title: "Creating invoices & quotations", category: "Billing", readTime: "6 min" },
  { title: "Training your AI knowledge base", category: "AI Assistant", readTime: "5 min" },
  { title: "Managing team permissions", category: "Team & Roles", readTime: "3 min" },
  { title: "Arabic & RTL configuration", category: "Getting Started", readTime: "2 min" },
];

const docs = [
  { title: "API Reference", desc: "REST endpoints for integrations", icon: FileText },
  { title: "Webhook Events", desc: "Real-time event payloads", icon: BookOpen },
  { title: "Migration Guide", desc: "Import from other platforms", icon: FolderOpen },
];

export default function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredArticles = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Base"
        description="Documentation, FAQs, and guides for your team."
        actions={
          <Button type="button" variant="outline">
            <BookOpen className="h-4 w-4" />
            New article
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles and FAQs..."
          className="h-12 pl-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            type="button"
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Articles</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredArticles.map((article, idx) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3">
                      {article.category}
                    </Badge>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{article.readTime} read</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Documentation</h2>
          <div className="space-y-3">
            {docs.map((doc) => (
              <Card key={doc.title} className="transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                    <doc.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently asked questions</CardTitle>
          <CardDescription>Quick answers from the faq dummy data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {faq.map((item, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border border-border/80">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/50"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="font-medium">{item.q}</span>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", openFaq === idx && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: abaMotion.duration.normal }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-border/80 px-4 py-3 text-sm text-muted-foreground">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
