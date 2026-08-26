import { motion } from "framer-motion";
import { ExternalLink, Plug, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/primitives";
import { integrations } from "@/data/dummy";

const integrationIcons: Record<string, string> = {
  WhatsApp: "💬",
  "Google Calendar": "📅",
  OpenAI: "✨",
  Stripe: "💳",
  Twilio: "📱",
  Zapier: "⚡",
  Shopify: "🛒",
  WooCommerce: "🏪",
  Meta: "📘",
  Google: "🔍",
  Microsoft: "🪟",
};

export default function IntegrationsPage() {
  const connected = integrations.filter((i) => i.status === "Connected").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Integrations"
        description="Connect your tools to automate workflows and sync data."
        actions={
          <Button type="button" variant="outline">
            <Plug className="h-4 w-4" />
            Browse marketplace
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Badge variant="success">{connected} connected</Badge>
        <Badge variant="secondary">{integrations.length - connected} available</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {integrations.map((integration, idx) => {
          const isConnected = integration.status === "Connected";
          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className="flex h-full flex-col transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl">
                      {integrationIcons[integration.name] ?? "🔗"}
                    </div>
                    <Badge variant={isConnected ? "success" : "outline"}>{integration.status}</Badge>
                  </div>
                  <CardTitle className="mt-4 text-base">{integration.name}</CardTitle>
                  <CardDescription>{integration.desc}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex gap-2 pt-0">
                  {isConnected ? (
                    <>
                      <Button type="button" variant="outline" size="sm" className="flex-1">
                        <Settings2 className="h-3.5 w-3.5" />
                        Configure
                      </Button>
                      <Button type="button" variant="ghost" size="sm">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <Button type="button" size="sm" className="w-full">
                      Connect
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
