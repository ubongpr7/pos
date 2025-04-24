"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Search, Filter, Download, Eye, CreditCard, Banknote, Wallet } from "lucide-react"

// Types
interface Transaction {
  id: string
  orderNumber: string
  customer: string
  date: string
  amount: number
  paymentMethod: "Cash" | "Credit Card" | "Mobile Payment"
  status: "Completed" | "Refunded" | "Voided"
}

// Mock data
const transactions: Transaction[] = [
  {
    id: "1",
    orderNumber: "ORD-1001",
    customer: "John Doe",
    date: "2023-04-15 14:30:25",
    amount: 45.99,
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: "2",
    orderNumber: "ORD-1002",
    customer: "Jane Smith",
    date: "2023-04-15 15:45:12",
    amount: 32.5,
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "3",
    orderNumber: "ORD-1003",
    customer: "Bob Johnson",
    date: "2023-04-14 11:20:45",
    amount: 78.25,
    paymentMethod: "Mobile Payment",
    status: "Completed",
  },
  {
    id: "4",
    orderNumber: "ORD-1004",
    customer: "Alice Williams",
    date: "2023-04-14 09:15:30",
    amount: 25.99,
    paymentMethod: "Credit Card",
    status: "Refunded",
  },
  {
    id: "5",
    orderNumber: "ORD-1005",
    customer: "Charlie Brown",
    date: "2023-04-13 16:40:22",
    amount: 54.75,
    paymentMethod: "Cash",
    status: "Voided",
  },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Download size={18} className="mr-2" />
          Export
        </button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number or customer..."
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
              <label className="block mb-2 text-sm font-medium">Date Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
                />
                <span>to</span>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Payment Method</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  ">
                <option value="">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Mobile Payment">Mobile Payment</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Status</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  ">
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Refunded">Refunded</option>
                <option value="Voided">Voided</option>
              </select>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 ">
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Payment Method</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 ">
                  <td className="px-4 py-3 font-medium">{transaction.orderNumber}</td>
                  <td className="px-4 py-3">{transaction.customer}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(transaction.date).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium">${transaction.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      {transaction.paymentMethod === "Credit Card" && <CreditCard size={16} className="mr-1" />}
                      {transaction.paymentMethod === "Cash" && <Banknote size={16} className="mr-1" />}
                      {transaction.paymentMethod === "Mobile Payment" && <Wallet size={16} className="mr-1" />}
                      <span>{transaction.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "Completed"
                          ? "bg-green-100 text-green-800  "
                          : transaction.status === "Refunded"
                            ? "bg-yellow-100 text-yellow-800  "
                            : "bg-red-100 text-red-800  "
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button className="p-1 text-blue-500 hover:text-blue-700">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">No transactions found matching your search criteria.</div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredTransactions.length} of {transactions.length} transactions
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
