"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { setIsSidebarCollapsed } from "../redux/state"
import {
  ShoppingCart,
  Package,
  Users,
  BarChart4,
  Settings,
  CreditCard,
  Tag,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Point of Sale", href: "/pos", icon: ShoppingCart },
  { name: "Products", href: "/products", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Discounts", href: "/discounts", icon: Tag },
  { name: "Reports", href: "/reports", icon: BarChart4 },
  { name: "Receipts", href: "/receipts", icon: Receipt },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isSidebarCollapsed } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()
  const [isMobile, setIsMobile] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null) // Create a ref for the sidebar

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        dispatch(setIsSidebarCollapsed(true))
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [dispatch])
  useEffect(() => {
    if (!isSidebarCollapsed) {
      const handleClickOutside = (event: MouseEvent) => {
        // Close sidebar if click is outside of sidebar
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          dispatch(setIsSidebarCollapsed(true))
        }
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          dispatch(setIsSidebarCollapsed(true))
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isSidebarCollapsed, dispatch])

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
  }

  return (
    <>
      {/* Mobile overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => dispatch(setIsSidebarCollapsed(true))}
        />
      )}

      <aside
      ref={sidebarRef} 
      className={`
        fixed md:relative z-30 flex flex-col h-full bg-white shadow-lg 
        transition-transform duration-300 ease-in-out md:transition-none
        ${
          isMobile 
            ? `w-64 transform ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`
            : `${isSidebarCollapsed ? 'w-14.5' : 'w-64'}`
        }
      `}
      >
        <div className="flex items-center justify-between  h-16 px-2 border-b ">
          <h1 className={`font-bold text-xl text-gray-900  ${isSidebarCollapsed ? "hidden" : "block"}`}>
            POS System
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-200 "
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center p-2 rounded-md transition-colors
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-700  "
                          : "text-gray-700  hover:bg-gray-100 "
                      }
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className={`ml-2 ${isSidebarCollapsed ? "hidden" : "block"}`}>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
