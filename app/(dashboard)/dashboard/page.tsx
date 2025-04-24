import type React from "react"
import { Card } from "@/components/ui/card"
import { ShoppingCart, DollarSign, Users, Package, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value="$1,245.89"
          icon={<DollarSign className="h-8 w-8 text-green-500" />}
          trend="up"
          percentage="12.5%"
        />
        <StatCard
          title="Transactions"
          value="48"
          icon={<ShoppingCart className="h-8 w-8 text-blue-500" />}
          trend="up"
          percentage="8.2%"
        />
        <StatCard
          title="Customers"
          value="12"
          icon={<Users className="h-8 w-8 text-purple-500" />}
          trend="down"
          percentage="3.1%"
        />
        <StatCard
          title="Products Sold"
          value="124"
          icon={<Package className="h-8 w-8 text-orange-500" />}
          trend="up"
          percentage="24.3%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50  rounded-lg">
                <div>
                  <p className="font-medium">Order #{1000 + i}</p>
                  <p className="text-sm text-gray-500 ">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(Math.random() * 100).toFixed(2)}</p>
                  <p className="text-sm text-green-500">Completed</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-500 text-sm font-medium">View All Transactions</button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50  rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200  rounded-md mr-3"></div>
                  <div>
                    <p className="font-medium">Product {i}</p>
                    <p className="text-sm text-gray-500 ">SKU: PRD-{1000 + i}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(Math.random() * 50 + 10).toFixed(2)}</p>
                  <p className="text-sm text-gray-500 ">{Math.floor(Math.random() * 50 + 5)} sold</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-500 text-sm font-medium">View All Products</button>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  trend,
  percentage,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend: "up" | "down"
  percentage: string
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 ">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{percentage}</span>
            <span className="text-gray-500  text-xs ml-1">vs last week</span>
          </div>
        </div>
        <div className="p-2 bg-gray-100 h-12  rounded-full">{icon}</div>
      </div>
    </Card>
  )
}
