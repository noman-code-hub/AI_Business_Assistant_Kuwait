import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Grid3X3,
  LayoutList,
  Package,
  Plus,
  Search,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import { products } from "@/data/dummy";
import { formatKwd } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [...new Set(products.map((p) => p.category))];

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 20).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog, inventory, and pricing."
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={String(products.length)} change="+2 this month" icon={Package} />
        <StatCard label="Inventory Value" value={formatKwd(totalValue)} change="+8.4% vs last month" icon={ShoppingBag} />
        <StatCard label="Categories" value={String(categories.length)} icon={Grid3X3} />
        <StatCard label="Low Stock" value={String(lowStock)} change={lowStock > 0 ? "Needs attention" : undefined} icon={AlertTriangle} />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5">
              {["All", ...categories].map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <div className="flex rounded-2xl border border-border p-1">
              <Button
                variant={view === "grid" ? "accent" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-xl"
                onClick={() => setView("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "accent" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-xl"
                onClick={() => setView("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group overflow-hidden hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl dark:bg-emerald-950">
                      {product.image}
                    </div>
                    <Badge variant={product.stock < 20 ? "warning" : "success"}>
                      {product.stock} in stock
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{product.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {product.category}
                  </Badge>
                </CardHeader>
                <CardFooter className="justify-between border-t border-border/60 pt-4">
                  <span className="text-lg font-semibold text-emerald-600">{formatKwd(product.price)}</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-border">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl dark:bg-emerald-950">
                    {product.image}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                  <Badge variant={product.stock < 20 ? "warning" : "success"}>{product.stock} units</Badge>
                  <span className="font-semibold text-emerald-600">{formatKwd(product.price)}</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
          No products match your filters.
        </div>
      ) : null}
    </div>
  );
}
