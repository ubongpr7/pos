"use client"

import { useState, useEffect, useRef } from "react"
import { X, Printer, Mail, CreditCard, Smartphone, QrCode, DollarSign } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  onProcessPayment: () => void
}

export default function PaymentModal({ isOpen, onClose, total, onProcessPayment }: PaymentModalProps) {
  const [tip, setTip] = useState(0)
  const [customTip, setCustomTip] = useState("")
  const [selectedTipPercentage, setSelectedTipPercentage] = useState<number | null>(null)
  const [isSplitPayment, setIsSplitPayment] = useState(false)
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState(total.toFixed(2))
  const [remainingAmount, setRemainingAmount] = useState(total)
  const [cashReceived, setCashReceived] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile" | "qr">("cash")
  const [printReceipt, setPrintReceipt] = useState(true)
  const [emailReceipt, setEmailReceipt] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTip(0)
      setCustomTip("")
      setSelectedTipPercentage(null)
      setIsSplitPayment(false)
      setCurrentPaymentAmount(total.toFixed(2))
      setRemainingAmount(total)
      setCashReceived("")
      setPaymentMethod("cash")
      setPrintReceipt(true)
      setEmailReceipt(false)
    }
  }, [isOpen, total])

  // Update remaining amount when current payment amount changes
  useEffect(() => {
    const currentAmount = Number.parseFloat(currentPaymentAmount) || 0
    const newRemainingAmount = Math.max(0, total + tip - currentAmount)
    setRemainingAmount(newRemainingAmount)
  }, [currentPaymentAmount, total, tip])

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  const handleTipSelection = (percentage: number) => {
    const newTip = Number.parseFloat((total * (percentage / 100)).toFixed(2))
    setTip(newTip)
    setCustomTip("")
    setSelectedTipPercentage(percentage)

    // If not splitting payment, update current payment amount to include tip
    if (!isSplitPayment) {
      setCurrentPaymentAmount((total + newTip).toFixed(2))
    }
  }

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value)
    setSelectedTipPercentage(null)

    const tipValue = Number.parseFloat(value) || 0
    setTip(tipValue)

    // If not splitting payment, update current payment amount to include tip
    if (!isSplitPayment) {
      setCurrentPaymentAmount((total + tipValue).toFixed(2))
    }
  }

  const handleSplitPaymentToggle = () => {
    setIsSplitPayment(!isSplitPayment)

    // Reset current payment amount when toggling split payment
    if (!isSplitPayment) {
      setCurrentPaymentAmount((total + tip).toFixed(2))
    }
  }

  const handleCurrentPaymentAmountChange = (value: string) => {
    // Ensure it's a valid number and not more than total + tip
    const numValue = Number.parseFloat(value) || 0
    const maxAmount = total + tip

    if (numValue > maxAmount) {
      setCurrentPaymentAmount(maxAmount.toFixed(2))
    } else {
      setCurrentPaymentAmount(value)
    }
  }

  const handlePaymentMethodSelect = (method: "cash" | "card" | "mobile" | "qr") => {
    setPaymentMethod(method)
  }

  const handleCompletePayment = () => {
    // If there's remaining amount and split payment is enabled,
    // we're doing a partial payment
    if (remainingAmount > 0 && isSplitPayment) {
      // Process partial payment
      // In a real app, you'd handle the payment processing here

      // Update the total to the remaining amount
      // This would typically update the parent component's state

      // Close the modal
      onClose()
    } else {
      // Process full payment
      onProcessPayment()
    }
  }

  if (!isOpen) return null

  const totalWithTip = total + tip
  const change =
    Number.parseFloat(cashReceived) > 0
      ? Math.max(0, Number.parseFloat(cashReceived) - Number.parseFloat(currentPaymentAmount))
      : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        ref={modalRef}
        className="bg-white  text-gray-800  rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 flex justify-between items-center border-b ">
          <h2 className="text-xl font-bold">Payment</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200  transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div
          ref={contentRef}
          className="overflow-y-auto p-4 flex-1 scrollbar-thin scrollbar-thumb-gray-300 "
        >
          <div className="text-center mb-4">
            <div className="text-3xl font-bold">${totalWithTip.toFixed(2)}</div>
            <div className="text-gray-500 ">Total amount due</div>

            {isSplitPayment && (
              <div className="mt-2">
                <div className="text-gray-500 ">Remaining</div>
                <div className="text-2xl font-bold">${remainingAmount.toFixed(2)}</div>
              </div>
            )}
          </div>

          {/* Tip Section */}
          <div className="mb-4">
            <div className="font-medium mb-2">Add Tip</div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 18, 20, 25].map((percentage) => (
                <button
                  key={percentage}
                  className={`py-2 rounded-md ${
                    selectedTipPercentage === percentage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100  text-gray-800  hover:bg-gray-200 "
                  }`}
                  onClick={() => handleTipSelection(percentage)}
                >
                  {percentage}%
                </button>
              ))}
            </div>

            <div className="mt-2">
              <div className="flex items-center">
                <span className="mr-2">Custom:</span>
                <input
                  type="number"
                  value={customTip}
                  onChange={(e) => handleCustomTipChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-100  border border-gray-300  rounded-md p-2 text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Split Payment */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSplitPayment}
                  onChange={handleSplitPaymentToggle}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border ${isSplitPayment ? "bg-blue-600 border-blue-600" : "border-gray-400 "} flex items-center justify-center`}
                >
                  {isSplitPayment && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-2">Split Payment</span>
            </label>
          </div>

          {/* Current Payment Amount (only shown when split payment is enabled) */}
          {isSplitPayment && (
            <div className="mb-4">
              <div className="font-medium mb-2">Current Payment Amount</div>
              <input
                type="number"
                value={currentPaymentAmount}
                onChange={(e) => handleCurrentPaymentAmountChange(e.target.value)}
                className="w-full bg-gray-100  border border-gray-300  rounded-md p-2 text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Payment Methods */}
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2">
              <button
                className={`py-2 px-1 rounded-md flex flex-col items-center justify-center ${
                  paymentMethod === "cash"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100  text-gray-800  hover:bg-gray-200 "
                }`}
                onClick={() => handlePaymentMethodSelect("cash")}
              >
                <DollarSign size={20} className="mb-1" />
                <span className="text-sm">Cash</span>
              </button>
              <button
                className={`py-2 px-1 rounded-md flex flex-col items-center justify-center ${
                  paymentMethod === "card"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100  text-gray-800  hover:bg-gray-200 "
                }`}
                onClick={() => handlePaymentMethodSelect("card")}
              >
                <CreditCard size={20} className="mb-1" />
                <span className="text-sm">Card</span>
              </button>
              <button
                className={`py-2 px-1 rounded-md flex flex-col items-center justify-center ${
                  paymentMethod === "mobile"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100  text-gray-800  hover:bg-gray-200 "
                }`}
                onClick={() => handlePaymentMethodSelect("mobile")}
              >
                <Smartphone size={20} className="mb-1" />
                <span className="text-sm">Mobile</span>
              </button>
              <button
                className={`py-2 px-1 rounded-md flex flex-col items-center justify-center ${
                  paymentMethod === "qr"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100  text-gray-800  hover:bg-gray-200 "
                }`}
                onClick={() => handlePaymentMethodSelect("qr")}
              >
                <QrCode size={20} className="mb-1" />
                <span className="text-sm">QR</span>
              </button>
            </div>
          </div>

          {/* Cash Received (only shown when cash payment method is selected) */}
          {paymentMethod === "cash" && (
            <div className="mb-4">
              <div className="font-medium mb-2">Cash Received</div>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-100  border border-gray-300  rounded-md p-2 text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {change > 0 && (
                <div className="mt-2 text-right">
                  <span className="text-gray-500 ">Change: </span>
                  <span className="font-bold">${change.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Receipt Options */}
          <div className="mb-4">
            <div className="font-medium mb-2">Receipt Options</div>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={printReceipt}
                    onChange={() => setPrintReceipt(!printReceipt)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border ${printReceipt ? "bg-blue-600 border-blue-600" : "border-gray-400 "} flex items-center justify-center`}
                  >
                    {printReceipt && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <Printer size={16} className="ml-2 mr-2" />
                <span>Print Receipt</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={emailReceipt}
                    onChange={() => setEmailReceipt(!emailReceipt)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border ${emailReceipt ? "bg-blue-600 border-blue-600" : "border-gray-400 "} flex items-center justify-center`}
                  >
                    {emailReceipt && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <Mail size={16} className="ml-2 mr-2" />
                <span>Email Receipt</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="p-4 border-t  bg-white  sticky bottom-0 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200  text-gray-800  rounded-md hover:bg-gray-300  transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCompletePayment}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
          >
            {remainingAmount > 0 && isSplitPayment ? "Process Payment" : "Complete Payment"}
          </button>
        </div>
      </div>
    </div>
  )
}
