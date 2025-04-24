"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Plus, Minus, Trash2, Tag, User, ShoppingBag, ScanBarcode, Table, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import BarcodeScanner from "@/components/barcode-scanner"
import ProductCustomizer from "@/components/product-customizer"
import PaymentModal from "./payment-modal"

// Types
interface Product {
  id: string
  name: string
  price: number
  image?: string
  category: string
  customizable?: boolean
  variants?: ProductVariant[]
  stock?: number
  taxRate?: number
  discount?: number
}

interface ProductVariant {
  id: string
  name: string
  price: number
  taxRate?: number
  discount?: number
}

interface CartItem extends Product {
  quantity: number
  customizations?: Record<string, string | string[]>
  specialInstructions?: string
  totalPrice?: number
  variantId?: string
}

interface Category {
  id: string
  name: string
}

interface CustomizationGroup {
  id: string
  name: string
  type: "radio" | "checkbox"
  required?: boolean
  options: {
    id: string
    name: string
    price: number
  }[]
}

// Mock data
const categories: Category[] = [
  { id: "1", name: "All" },
  { id: "2", name: "Food" },
  { id: "3", name: "Beverages" },
  { id: "4", name: "Electronics" },
  { id: "5", name: "Clothing" },
  { id: "6", name: "Home" },
]

const products: Product[] = [
  {
    id: "1",
    name: "Burger",
    price: 5.99,
    category: "2",
    customizable: true,
    stock: 50,
    taxRate: 0.05, // 5% tax
    discount: 0,
    variants: [
      { id: "1-1", name: "Classic Burger", price: 5.99, taxRate: 0.05 },
      { id: "1-2", name: "Cheese Burger", price: 6.99, taxRate: 0.05 },
      { id: "1-3", name: "Bacon Burger", price: 7.99, taxRate: 0.05 },
    ],
  },
  {
    id: "2",
    name: "Pizza",
    price: 8.99,
    category: "2",
    customizable: true,
    stock: 30,
    taxRate: 0.05, // 5% tax
    discount: 0,
    variants: [
      { id: "2-1", name: "Margherita", price: 8.99, taxRate: 0.05 },
      { id: "2-2", name: "Pepperoni", price: 9.99, taxRate: 0.05 },
      { id: "2-3", name: "Vegetarian", price: 10.99, taxRate: 0.05 },
    ],
  },
  { id: "3", name: "Coca Cola", price: 1.99, category: "3", stock: 100, taxRate: 0.08, discount: 0 },
  { id: "4", name: "Headphones", price: 29.99, category: "4", stock: 15, taxRate: 0.1, discount: 0 },
  {
    id: "5",
    name: "T-Shirt",
    price: 15.99,
    category: "5",
    customizable: true,
    stock: 25,
    taxRate: 0.08, // 8% tax
    discount: 0.1, // 10% discount
    variants: [
      { id: "5-1", name: "Small", price: 15.99, taxRate: 0.08, discount: 0.1 },
      { id: "5-2", name: "Medium", price: 15.99, taxRate: 0.08, discount: 0.1 },
      { id: "5-3", name: "Large", price: 17.99, taxRate: 0.08, discount: 0.1 },
    ],
  },
  { id: "6", name: "Coffee Mug", price: 4.99, category: "6", stock: 40, taxRate: 0.08, discount: 0 },
  {
    id: "7",
    name: "Salad",
    price: 6.99,
    category: "2",
    customizable: true,
    stock: 20,
    taxRate: 0.05, // 5% tax
    discount: 0,
    variants: [
      { id: "7-1", name: "Caesar Salad", price: 6.99, taxRate: 0.05 },
      { id: "7-2", name: "Greek Salad", price: 7.99, taxRate: 0.05 },
      { id: "7-3", name: "Garden Salad", price: 5.99, taxRate: 0.05 },
    ],
  },
  { id: "8", name: "Water Bottle", price: 0.99, category: "3", stock: 200, taxRate: 0.05, discount: 0 },
  { id: "9", name: "Smartphone", price: 299.99, category: "4", stock: 10, taxRate: 0.1, discount: 0.05 },
  {
    id: "10",
    name: "Jeans",
    price: 39.99,
    category: "5",
    customizable: true,
    stock: 35,
    taxRate: 0.08, // 8% tax
    discount: 0,
    variants: [
      { id: "10-1", name: "Slim Fit", price: 39.99, taxRate: 0.08 },
      { id: "10-2", name: "Regular Fit", price: 39.99, taxRate: 0.08 },
      { id: "10-3", name: "Relaxed Fit", price: 42.99, taxRate: 0.08 },
    ],
  },
  { id: "11", name: "Lamp", price: 24.99, category: "6", stock: 15, taxRate: 0.08, discount: 0 },
  {
    id: "12",
    name: "Sandwich",
    price: 4.99,
    category: "2",
    customizable: true,
    stock: 45,
    taxRate: 0.05, // 5% tax
    discount: 0,
    variants: [
      { id: "12-1", name: "Turkey", price: 4.99, taxRate: 0.05 },
      { id: "12-2", name: "Ham & Cheese", price: 5.49, taxRate: 0.05 },
      { id: "12-3", name: "Vegetarian", price: 4.49, taxRate: 0.05 },
    ],
  },
]

// Mock customization options for products
const productCustomizations: Record<string, CustomizationGroup[]> = {
  "1": [
    // Burger
    {
      id: "burger-size",
      name: "Size",
      type: "radio",
      required: true,
      options: [
        { id: "small", name: "Small", price: 0 },
        { id: "medium", name: "Medium", price: 1.5 },
        { id: "large", name: "Large", price: 3 },
      ],
    },
    {
      id: "burger-toppings",
      name: "Toppings",
      type: "checkbox",
      options: [
        { id: "cheese", name: "Extra Cheese", price: 1 },
        { id: "bacon", name: "Bacon", price: 1.5 },
        { id: "avocado", name: "Avocado", price: 1 },
        { id: "egg", name: "Fried Egg", price: 1 },
      ],
    },
    {
      id: "burger-preparation",
      name: "Preparation",
      type: "checkbox",
      options: [
        { id: "no-onions", name: "No Onions", price: 0 },
        { id: "no-tomato", name: "No Tomato", price: 0 },
        { id: "no-lettuce", name: "No Lettuce", price: 0 },
        { id: "no-pickle", name: "No Pickle", price: 0 },
      ],
    },
  ],
  "12": [
    // Sandwich
    {
      id: "sandwich-size",
      name: "Size",
      type: "radio",
      required: true,
      options: [
        { id: "small", name: "Small", price: 0 },
        { id: "medium", name: "Medium", price: 1 },
        { id: "large", name: "Large", price: 2 },
      ],
    },
    {
      id: "sandwich-extras",
      name: "Extras",
      type: "checkbox",
      options: [
        { id: "cheese", name: "Extra Cheese", price: 1.5 },
        { id: "bacon", name: "Bacon", price: 2 },
        { id: "avocado", name: "Avocado", price: 1.5 },
        { id: "mushrooms", name: "Mushrooms", price: 1 },
        { id: "jalapenos", name: "Jalapeños", price: 0.5 },
      ],
    },
    {
      id: "sandwich-preparation",
      name: "Preparation",
      type: "checkbox",
      options: [
        { id: "no-onions", name: "No Onions", price: 0 },
        { id: "no-tomato", name: "No Tomato", price: 0 },
        { id: "no-lettuce", name: "No Lettuce", price: 0 },
      ],
    },
  ],
}

// Modal component for better UX
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div ref={modalRef} className="bg-white  rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {children}
      </div>
    </div>
  )
}

// Product variant selector component
function ProductVariantSelector({
  product,
  onSelect,
  onClose,
}: {
  product: Product
  onSelect: (product: Product, variantId: string) => void
  onClose: () => void
}) {
  return (
    <>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Select {product.name} Variant</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200  transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-2">
          {product.variants?.map((variant) => (
            <button
              key={variant.id}
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors flex justify-between items-center"
              onClick={() => onSelect(product, variant.id)}
            >
              <span>{variant.name}</span>
              <span className="font-medium">${variant.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("1") // All
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [discountModalOpen, setDiscountModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false)
  const [customizeProductModal, setCustomizeProductModal] = useState<{
    open: boolean
    product: Product | null
    variantId?: string
  }>({
    open: false,
    product: null,
  })
  const [variantSelectorOpen, setVariantSelectorOpen] = useState<{
    open: boolean
    product: Product | null
  }>({
    open: false,
    product: null,
  })
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [splitBillModalOpen, setSplitBillModalOpen] = useState(false)
  const [splitWays, setSplitWays] = useState(2)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "1" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle product click
  const handleProductClick = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      setVariantSelectorOpen({
        open: true,
        product,
      })
    } else if (product.customizable) {
      setCustomizeProductModal({
        open: true,
        product,
      })
    } else {
      addToCart(product)
    }
  }

  // Handle variant selection
  const handleVariantSelect = (product: Product, variantId: string) => {
    const selectedVariant = product.variants?.find((v) => v.id === variantId)

    if (!selectedVariant) return

    if (product.customizable) {
      setCustomizeProductModal({
        open: true,
        product: {
          ...product,
          price: selectedVariant.price,
          taxRate: selectedVariant.taxRate || product.taxRate,
          discount: selectedVariant.discount || product.discount,
        },
        variantId,
      })
    } else {
      const productWithVariant = {
        ...product,
        price: selectedVariant.price,
        taxRate: selectedVariant.taxRate || product.taxRate,
        discount: selectedVariant.discount || product.discount,
        variantId,
      }
      addToCart(productWithVariant)
    }

    setVariantSelectorOpen({
      open: false,
      product: null,
    })
  }

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.variantId === product.variantId &&
          JSON.stringify(item.customizations) === JSON.stringify(product.customizations),
      )

      if (existingItemIndex !== -1) {
        return prevCart.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + (product.quantity || 1)
            const maxQuantity = item.stock || 999

            // Check if adding would exceed available stock
            if (newQuantity > maxQuantity) {
              // Optional: Show a toast or alert that max quantity was reached
              return { ...item, quantity: maxQuantity }
            }

            return { ...item, quantity: newQuantity }
          }
          return item
        })
      } else {
        return [...prevCart, { ...product, quantity: product.quantity || 1 }]
      }
    })
  }

  // Add customized product to cart
  const addCustomizedProductToCart = (customizedProduct: CartItem) => {
    setCart((prevCart) => {
      // Check if identical customized product exists
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === customizedProduct.id &&
          item.variantId === customizedProduct.variantId &&
          JSON.stringify(item.customizations) === JSON.stringify(customizedProduct.customizations),
      )

      if (existingItemIndex !== -1) {
        return prevCart.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + customizedProduct.quantity
            const maxQuantity = item.stock || 999

            // Check if adding would exceed available stock
            if (newQuantity > maxQuantity) {
              // Optional: Show a toast or alert that max quantity was reached
              return { ...item, quantity: maxQuantity }
            }

            return { ...item, quantity: newQuantity }
          }
          return item
        })
      } else {
        return [...prevCart, customizedProduct]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item, i) => {
        if (i === index) {
          const maxQuantity = item.stock || 999
          const validQuantity = Math.min(quantity, maxQuantity)
          return { ...item, quantity: validQuantity }
        }
        return item
      }),
    )
  }

  // Remove item from cart
  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index))
  }

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    // In a real implementation, you would look up the product by barcode
    // For now, we'll just set the search term to the barcode
    setSearchTerm(barcode)

    // Mock finding a product by barcode
    const mockProductMap: Record<string, string> = {
      "5901234123457": "Burger",
      "4001234567890": "Pizza",
      "9781234567897": "Coca Cola",
    }

    const productName = mockProductMap[barcode]
    if (productName) {
      setSearchTerm(productName)
      // Find the product and add it to cart
      const product = products.find((p) => p.name.toLowerCase() === productName.toLowerCase())
      if (product) {
        handleProductClick(product)
      }
    }
  }

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const itemPrice = item.totalPrice || item.price
      return sum + itemPrice * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()

  // Calculate tax based on individual product tax rates
  const calculateTax = () => {
    return cart.reduce((sum, item) => {
      const itemPrice = item.totalPrice || item.price
      const taxRate = item.taxRate || 0.08 // Default to 8% if not specified
      return sum + itemPrice * item.quantity * taxRate
    }, 0)
  }

  const tax = calculateTax()

  // Calculate discount based on individual product discounts
  const calculateDiscount = () => {
    return cart.reduce((sum, item) => {
      const itemPrice = item.totalPrice || item.price
      const discount = item.discount || 0
      return sum + itemPrice * item.quantity * discount
    }, 0)
  }

  const discount = calculateDiscount()

  // Calculate total
  const total = subtotal + tax - discount

  // Clear cart
  const clearCart = () => {
    setCart([])
    setSelectedCustomer(null)
    setSelectedTable(null)
  }

  // Process payment
  const processPayment = () => {
    // Here you would integrate with your payment processing backend
    alert(`Payment processed for $${total.toFixed(2)}`)
    clearCart()
    setPaymentModalOpen(false)
  }

  // Hold order
  const holdOrder = () => {
    // Here you would save the current order to be retrieved later
    alert("Order held for later")
    clearCart()
  }

  // Format cart item display name
  const formatCartItemName = (item: CartItem) => {
    let name = item.name

    // Add variant name if applicable
    if (item.variantId && item.variants) {
      const variant = item.variants.find((v) => v.id === item.variantId)
      if (variant) {
        name = `${name} - ${variant.name}`
      }
    }

    return name
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 animate-fade-in">
      {/* Product Section */}
      <div className="md:w-2/3 flex flex-col h-full">
        {/* Search and Categories */}
        <div className="mb-4">
          <div className="relative mb-4 flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or scan barcode..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setBarcodeScannerOpen(true)}
              aria-label="Scan Barcode"
            >
              <ScanBarcode size={20} />
            </button>

            <div className="ml-2 flex">
              <button
                className="p-2 border rounded-lg flex items-center hover:bg-gray-100  transition-colors"
                onClick={() => setCustomerModalOpen(true)}
              >
                <User size={20} className="mr-1" />
                <span className="hidden md:inline truncate max-w-[100px]">{selectedCustomer || "Customer"}</span>
              </button>

              <button
                className="ml-2 p-2 border rounded-lg flex items-center hover:bg-gray-100  transition-colors"
                onClick={() => setTableModalOpen(true)}
              >
                <Table size={20} className="mr-1" />
                <span className="hidden md:inline truncate max-w-[100px]">{selectedTable || "Table"}</span>
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 scrollbar-hidden">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200  text-gray-800  hover:bg-gray-300 "
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto flex-grow">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                product.customizable || (product.variants && product.variants.length > 0)
                  ? "border-blue-200 "
                  : ""
              }`}
              onClick={() => handleProductClick(product)}
            >
              <div className="aspect-square bg-gray-200  rounded-md mb-2 flex items-center justify-center relative">
                {product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <ShoppingBag size={40} className="text-gray-400" />
                )}
                {product.stock !== undefined && product.stock <= 5 && (
                  <span className="absolute top-1 right-1 text-xs bg-red-100 text-red-800   px-1.5 py-0.5 rounded">
                    Low Stock: {product.stock}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate">{product.name}</h3>
                {product.customizable && (
                  <span className="text-xs bg-blue-100 text-blue-800   px-1.5 py-0.5 rounded">
                    Custom
                  </span>
                )}
                {!product.customizable && product.variants && product.variants.length > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-800   px-1.5 py-0.5 rounded">
                    Variants
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                {product.stock !== undefined && <p className="text-xs text-gray-500">Stock: {product.stock}</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="md:w-1/3 flex flex-col h-full">
        <Card className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Current Sale</h2>
            <button
              className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Clear
            </button>
          </div>

          {/* Customer and Table Selection */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-100  rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <User size={18} className="mr-2 text-gray-500" />
                <span className="truncate max-w-[100px]">{selectedCustomer || "Walk-in"}</span>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
                onClick={() => setCustomerModalOpen(true)}
              >
                Change
              </button>
            </div>

            <div className="p-2 bg-gray-100  rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <Table size={18} className="mr-2 text-gray-500" />
                <span className="truncate max-w-[100px]">{selectedTable || "No table"}</span>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
                onClick={() => setTableModalOpen(true)}
              >
                Change
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-100  rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{formatCartItemName(item)}</h3>
                      <p className="text-sm text-gray-500">${(item.totalPrice || item.price).toFixed(2)} each</p>
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {Object.entries(item.customizations).map(([groupId, selection]) => {
                            const product = item.id
                            const groups = productCustomizations[product]
                            if (!groups) return null

                            const group = groups.find((g) => g.id === groupId)
                            if (!group) return null

                            const options: string[] = []
                            if (typeof selection === "string") {
                              const option = group.options.find((o) => o.id === selection)
                              if (option) options.push(option.name)
                            } else if (Array.isArray(selection)) {
                              selection.forEach((optionId) => {
                                const option = group.options.find((o) => o.id === optionId)
                                if (option) options.push(option.name)
                              })
                            }

                            if (options.length === 0) return null

                            return (
                              <div key={groupId} className="flex flex-wrap gap-1 mt-0.5">
                                {options.map((opt, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center bg-gray-200  px-1.5 py-0.5 rounded text-xs"
                                  >
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )
                          })}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 italic mt-1 truncate">Note: {item.specialInstructions}</p>
                      )}
                    </div>
                    <div className="flex items-center ml-2">
                      <button
                        className="p-1 rounded-full hover:bg-gray-200  transition-colors"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock || 999}
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = Number.parseInt(e.target.value) || 1
                          const maxQuantity = item.stock || 999
                          if (newQuantity <= maxQuantity) {
                            updateQuantity(index, newQuantity)
                          } else {
                            updateQuantity(index, maxQuantity)
                            // Optional: Show a toast or alert that max quantity was reached
                          }
                        }}
                        className="mx-2 w-12 text-center p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500  "
                      />
                      <button
                        className="p-1 rounded-full hover:bg-gray-200  transition-colors"
                        onClick={() => {
                          const maxQuantity = item.stock || 999
                          updateQuantity(index, Math.min(item.quantity + 1, maxQuantity))
                        }}
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                        onClick={() => removeFromCart(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span>Discount</span>
                <button
                  className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => setDiscountModalOpen(true)}
                >
                  <Tag size={16} />
                </button>
              </div>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
              onClick={() => setPaymentModalOpen(true)}
            >
              Pay
            </button>
            <button
              className="py-2 px-4 bg-gray-200  text-gray-800  rounded-lg hover:bg-gray-300  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
              onClick={holdOrder}
            >
              Hold
            </button>
          </div>

          <div className="mt-2">
            <button
              className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
              onClick={() => setSplitBillModalOpen(true)}
            >
              Split Bill
            </button>
          </div>
        </Card>
      </div>

      {/* Barcode Scanner Modal */}
      {barcodeScannerOpen && <BarcodeScanner onScan={handleBarcodeScan} onClose={() => setBarcodeScannerOpen(false)} />}

      {/* Product Customizer Modal */}
      {customizeProductModal.open && customizeProductModal.product && (
        <ProductCustomizer
          product={customizeProductModal.product}
          customizationGroups={productCustomizations[customizeProductModal.product.id] || []}
          onClose={() => setCustomizeProductModal({ open: false, product: null })}
          onAddToCart={addCustomizedProductToCart}
        />
      )}

      {/* Product Variant Selector Modal */}
      <Modal isOpen={variantSelectorOpen.open} onClose={() => setVariantSelectorOpen({ open: false, product: null })}>
        {variantSelectorOpen.product && (
          <ProductVariantSelector
            product={variantSelectorOpen.product}
            onSelect={handleVariantSelect}
            onClose={() => setVariantSelectorOpen({ open: false, product: null })}
          />
        )}
      </Modal>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        total={total}
        onProcessPayment={processPayment}
      />

      {/* Customer Modal */}
      <Modal isOpen={customerModalOpen} onClose={() => setCustomerModalOpen(false)}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Select Customer</h3>
          <button
            onClick={() => setCustomerModalOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200  transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
            />
          </div>

          {/* Customer List (Replace with actual data fetching) */}
          <div className="space-y-2">
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedCustomer("John Doe")
                setCustomerModalOpen(false)
              }}
            >
              John Doe
            </button>
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedCustomer("Jane Smith")
                setCustomerModalOpen(false)
              }}
            >
              Jane Smith
            </button>
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedCustomer("Mike Johnson")
                setCustomerModalOpen(false)
              }}
            >
              Mike Johnson
            </button>
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedCustomer(null)
                setCustomerModalOpen(false)
              }}
            >
              Walk-in Customer
            </button>
          </div>
        </div>
      </Modal>

      {/* Table Modal */}
      <Modal isOpen={tableModalOpen} onClose={() => setTableModalOpen(false)}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Select Table</h3>
          <button
            onClick={() => setTableModalOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200  transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search tables..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  "
            />
          </div>

          {/* Table List (Replace with actual data fetching) */}
          <div className="space-y-2">
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedTable("Table 1")
                setTableModalOpen(false)
              }}
            >
              Table 1
            </button>
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedTable("Table 2")
                setTableModalOpen(false)
              }}
            >
              Table 2
            </button>
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedTable("Table 3")
                setTableModalOpen(false)
              }}
            >
              Table 3
            </button>
            <button
              className="w-full p-3 text-left border rounded-lg hover:bg-gray-50  transition-colors"
              onClick={() => {
                setSelectedTable(null)
                setTableModalOpen(false)
              }}
            >
              No Table
            </button>
          </div>
        </div>
      </Modal>

      {/* Discount Modal */}
      <Modal isOpen={discountModalOpen} onClose={() => setDiscountModalOpen(false)}>
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Apply Discount</h3>
          <button
            onClick={() => setDiscountModalOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200  transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label htmlFor="discount-amount" className="block text-sm font-medium text-gray-700 ">
              Discount Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </div>
              <input
                type="number"
                name="discount-amount"
                id="discount-amount"
                className="block w-full rounded-md border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500    pl-7 sm:text-sm"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <label htmlFor="currency" className="sr-only">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-blue-500 focus:ring-blue-500    sm:text-sm"
                >
                  <option>USD</option>
                </select>
              </div>
            </div>
          </div>

          <button
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setDiscountModalOpen(false)}
          >
            Apply Discount
          </button>
        </div>
      </Modal>
    </div>
  )
}
