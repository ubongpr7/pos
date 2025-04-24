"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Search, Filter, Plus, Edit, Trash2, BarChart2 } from "lucide-react"

// Types
interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

// Mock data
const products: Product[] = [
  {
    id: "1",
    name: "Burger",
    sku: "FOOD-001",
    category: "Food",
    price: 5.99,
    stock: 50,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Pizza",
    sku: "FOOD-002",
    category: "Food",
    price: 8.99,
    stock: 30,
    status: "In Stock",
  },
  {
    id: "3",
    name: "Coca Cola",
    sku: "BEV-001",
    category: "Beverages",
    price: 1.99,
    stock: 100,
    status: "In Stock",
  },
  {
    id: "4",
    name: "Headphones",
    sku: "ELEC-001",
    category: "Electronics",
    price: 29.99,
    stock: 5,
    status: "Low Stock",
  },
  {
    id: "5",
    name: "T-Shirt",
    sku: "CLOTH-001",
    category: "Clothing",
    price: 15.99,
    stock: 0,
    status: "Out of Stock",
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={18} className="mr-2" />
          Add Product
        </button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-100 "
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
            <button className="px-4 py-2 border rounded-lg flex items-center hover:bg-gray-100 ">
              <BarChart2 size={18} className="mr-2" />
              Reports
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-100  rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Category</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  ">
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Status</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  ">
                <option value="">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Price Range</label>
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
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 ">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 text-right">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-center w-24 ${
                        product.status === "In Stock"
                          ? "bg-green-100 text-green-800  "
                          : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800  "
                            : "bg-red-100 text-red-800  "
                      }`}
                    >
                      {product.status}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">No products found matching your search criteria.</div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
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
