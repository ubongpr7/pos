"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Check, Plus, Minus } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CustomizationOption {
  id: string
  name: string
  price: number
}

interface CustomizationGroup {
  id: string
  name: string
  type: "radio" | "checkbox"
  required?: boolean
  options: CustomizationOption[]
}

interface ProductCustomizerProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    stock?: number
    taxRate?: number
    discount?: number
  }
  customizationGroups: CustomizationGroup[]
  onClose: () => void
  onAddToCart: (product: any) => void
}

export default function ProductCustomizer({
  product,
  customizationGroups,
  onClose,
  onAddToCart,
}: ProductCustomizerProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({})
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [quantity, setQuantity] = useState(1)
  const modalRef = useRef<HTMLDivElement>(null)
  const maxQuantity = product.stock || 999

  // Initialize default selections for required radio groups
  useEffect(() => {
    const defaultSelections: Record<string, string | string[]> = {}

    customizationGroups.forEach((group) => {
      if (group.type === "radio" && group.required && group.options.length > 0) {
        defaultSelections[group.id] = group.options[0].id
      }
    })

    setSelectedOptions(defaultSelections)
  }, [customizationGroups])

  // Handle escape key and click outside
  useEffect(() => {
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

    document.addEventListener("keydown", handleEscapeKey)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleOptionChange = (groupId: string, optionId: string, isChecked: boolean) => {
    setSelectedOptions((prev) => {
      const group = customizationGroups.find((g) => g.id === groupId)

      if (!group) return prev

      if (group.type === "radio") {
        return { ...prev, [groupId]: optionId }
      } else {
        const currentSelections = (prev[groupId] as string[]) || []

        if (isChecked) {
          return { ...prev, [groupId]: [...currentSelections, optionId] }
        } else {
          return {
            ...prev,
            [groupId]: currentSelections.filter((id) => id !== optionId),
          }
        }
      }
    })
  }

  const calculateTotalPrice = () => {
    let total = product.price

    Object.entries(selectedOptions).forEach(([groupId, selection]) => {
      const group = customizationGroups.find((g) => g.id === groupId)

      if (!group) return

      if (group.type === "radio" && typeof selection === "string") {
        const option = group.options.find((o) => o.id === selection)
        if (option) total += option.price
      } else if (Array.isArray(selection)) {
        selection.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId)
          if (option) total += option.price
        })
      }
    })

    // Apply product-specific discount if available
    if (product.discount && product.discount > 0) {
      total = total * (1 - product.discount)
    }

    return total * quantity
  }

  const handleAddToCart = () => {
    // Create a customized product object
    const customizedProduct = {
      ...product,
      customizations: selectedOptions,
      specialInstructions: specialInstructions || undefined,
      totalPrice: Number.parseFloat((calculateTotalPrice() / quantity).toFixed(2)),
      quantity,
    }

    onAddToCart(customizedProduct)
    onClose()
  }

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      if (value > maxQuantity) {
        setQuantity(maxQuantity)
      } else if (value < 1) {
        setQuantity(1)
      } else {
        setQuantity(value)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card ref={modalRef} className="w-full max-w-md max-h-[90vh] overflow-hidden shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Customize {product.name}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200  transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 max-h-[calc(90vh-10rem)]">
          {customizationGroups.map((group) => (
            <div key={group.id} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">
                  {group.name} {group.required && <span className="text-red-500">*</span>}
                </h4>
                {group.type === "radio" && <span className="text-xs text-gray-500">Choose one</span>}
                {group.type === "checkbox" && <span className="text-xs text-gray-500">Choose any</span>}
              </div>
              <div className="space-y-2">
                {group.options.map((option) => {
                  const isSelected =
                    group.type === "radio"
                      ? selectedOptions[group.id] === option.id
                      : Array.isArray(selectedOptions[group.id]) &&
                        (selectedOptions[group.id] as string[])?.includes(option.id)

                  return (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer
                        ${
                          isSelected
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white  border-gray-200  hover:bg-gray-50 "
                        }`}
                      onClick={() => handleOptionChange(group.id, option.id, !isSelected)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`
                          w-5 h-5 mr-3 rounded-full flex items-center justify-center
                          ${
                            group.type === "radio"
                              ? "border-2 border-gray-300 "
                              : "border border-gray-300  rounded"
                          }
                          ${isSelected ? "border-blue-500 " : ""}
                        `}
                        >
                          {isSelected &&
                            (group.type === "radio" ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 " />
                            ) : (
                              <Check size={12} className="text-blue-500 " />
                            ))}
                        </div>
                        <label className="cursor-pointer">{option.name}</label>
                      </div>
                      {option.price > 0 && <span className="text-sm font-medium">+${option.price.toFixed(2)}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="mb-6">
            <h4 className="font-medium mb-2">Special Instructions</h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Add any special requests here..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500   resize-none"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Quantity</h4>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                className="w-10 h-10 rounded-l-lg bg-gray-200  flex items-center justify-center hover:bg-gray-300  transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 h-10 text-center border-y border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 rounded-r-lg bg-gray-200  flex items-center justify-center hover:bg-gray-300  transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {product.stock !== undefined && <p className="text-xs text-gray-500 mt-1">Available: {product.stock}</p>}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold">${calculateTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100  transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add to Order
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
