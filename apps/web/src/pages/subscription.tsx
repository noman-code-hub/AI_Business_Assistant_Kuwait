import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    monthly: 9,
    yearly: 90,
    desc: "For solo practitioners",
    features: ["1 user", "500 conversations/mo", "WhatsApp inbox", "Basic AI replies"],
    popular: false,
  },
  {
    name: "Professional",
    monthly: 29,
    yearly: 290,
    desc: "Growing clinics & spas",
    features: ["5 users", "Unlimited conversations", "Automations", "Knowledge base", "Invoicing"],
    popular: true,
  },
  {
    name: "Business",
    monthly: 59,
    yearly: 590,
    desc: "Multi-location teams",
    features: ["15 users", "Priority support", "Advanced analytics", "API access", "Custom branding"],
    popular: false,
  },
  {
    name: "Enterprise",
    monthly: null,
    yearly: null,
    desc: "Custom deployment",
    features: ["Unlimited users", "Dedicated success manager", "SLA", "SSO", "On-premise option"],
    popular: false,
  },
];

const comparison = [
  { feature: "Users", starter: "1", pro: "5", business: "15", enterprise: "Unlimited" },
  { feature: "WhatsApp inbox", starter: true, pro: true, business: true, enterprise: true },
  { feature: "AI assistant", starter: "Basic", pro: "Advanced", business: "Advanced", enterprise: "Custom" },
  { feature: "Automations", starter: false, pro: true, business: true, enterprise: true },
  { feature: "API access", starter: false, pro: false, business: true, enterprise: true },
  { feature: "Priority support", starter: false, pro: false, business: true, enterprise: true },
];

export default function SubscriptionPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="space-y-12">
      <PageHeader
        title="Subscription"
        description="Choose the plan that fits your business."
        actions={
          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-1.5 shadow-sm">
            <Button
              type="button"
              variant={!yearly ? "default" : "ghost"}
              size="sm"
              onClick={() => setYearly(false)}
            >
              Monthly
            </Button>
            <Button
              type="button"
              variant={yearly ? "default" : "ghost"}
              size="sm"
              onClick={() => setYearly(true)}
            >
              Yearly
              <Badge variant="success" className="ml-1">
                -17%
              </Badge>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
          >
            <Card
              className={cn(
                "relative flex h-full flex-col transition-all hover:-translate-y-1 hover:shadow-lg",
                plan.popular && "border-emerald-300 shadow-md ring-1 ring-emerald-200 dark:border-emerald-800 dark:ring-emerald-900"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.desc}</CardDescription>
                <div className="pt-4">
                  {plan.monthly !== null ? (
                    <>
                      <span className="text-3xl font-bold">
                        {yearly ? plan.yearly : plan.monthly} KWD
                      </span>
                      <span className="text-muted-foreground"> / {yearly ? "year" : "mo"}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">Custom</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button type="button" variant={plan.popular ? "default" : "outline"} className="w-full">
                  {plan.monthly !== null ? "Get started" : "Contact sales"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature comparison</CardTitle>
          <CardDescription>Compare plans side by side</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium">Feature</th>
                <th className="pb-3 text-center font-medium">Starter</th>
                <th className="pb-3 text-center font-medium">Professional</th>
                <th className="pb-3 text-center font-medium">Business</th>
                <th className="pb-3 text-center font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-border/60">
                  <td className="py-3 font-medium">{row.feature}</td>
                  {(["starter", "pro", "business", "enterprise"] as const).map((col) => {
                    const val = row[col];
                    return (
                      <td key={col} className="py-3 text-center">
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-600" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
