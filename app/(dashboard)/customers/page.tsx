"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Search, Filter, Plus, Edit, Trash2, Mail, Phone } from "lucide-react"

// Types
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalSpent: number
  lastPurchase: string
  loyaltyPoints: number
}

// Mock data
const customers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    totalSpent: 1245.67,
    lastPurchase: "2023-04-15",
    loyaltyPoints: 450,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    totalSpent: 876.5,
    lastPurchase: "2023-04-10",
    loyaltyPoints: 320,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+1 (555) 456-7890",
    totalSpent: 2345.2,
    lastPurchase: "2023-04-05",
    loyaltyPoints: 780,
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    phone: "+1 (555) 789-0123",
    totalSpent: 567.8,
    lastPurchase: "2023-03-28",
    loyaltyPoints: 150,
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "+1 (555) 234-5678",
    totalSpent: 1890.45,
    lastPurchase: "2023-03-20",
    loyaltyPoints: 620,
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={18} className="mr-2" />
          Add Customer
        </button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-100 "
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-100  rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Loyalty Status</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  ">
                <option value="">All Statuses</option>
                <option value="bronze">Bronze (0-300 points)</option>
                <option value="silver">Silver (301-600 points)</option>
                <option value="gold">Gold (601+ points)</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Last Purchase</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  ">
                <option value="">Any Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Total Spent</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
                />
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 ">
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-right">Total Spent</th>
                <th className="px-4 py-3 text-center">Last Purchase</th>
                <th className="px-4 py-3 text-center">Loyalty Points</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 ">
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Mail size={14} className="mr-1 text-gray-500" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone size={14} className="mr-1 text-gray-500" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">{new Date(customer.lastPurchase).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        customer.loyaltyPoints >= 600
                          ? "bg-yellow-100 text-yellow-800 "
                          : customer.loyaltyPoints >= 300
                            ? "bg-gray-100 text-gray-800  "
                            : "bg-blue-100 text-blue-800  "
                      }`}
                    >
                      {customer.loyaltyPoints} pts
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button className="p-1 text-blue-500 hover:text-blue-700">
                        <Edit size={18} />
                      </button>
                      <button className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No customers found matching your search criteria.</div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md hover:bg-gray-100 ">Previous</button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">1</button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-100 ">Next</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
