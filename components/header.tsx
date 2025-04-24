"use client"

import { useState, useRef, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { setIsDarkMode, resetToSystemTheme } from "../redux/state"
import { useLogoutMutation } from "../redux/features/authApiSlice"
import { logout } from "../redux/features/authSlice"
import { Bell, User, LogOut, Moon, Sun, Monitor, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { setIsSidebarCollapsed } from "../redux/state"

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const { isDarkMode, isSystemTheme } = useAppSelector((state) => state.global)
  const { isSidebarCollapsed } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [logoutApi] = useLogoutMutation()

  // Add refs for the dropdowns
  const themeMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Add effect for handling clicks outside and escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close theme menu if click is outside
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false)
      }

      // Close user menu if click is outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setThemeMenuOpen(false)
        setUserMenuOpen(false)
      }
    }

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap()
      dispatch(logout())
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const toggleTheme = (theme: "light" | "dark" | "system") => {
    if (theme === "system") {
      dispatch(resetToSystemTheme())
    } else {
      dispatch(setIsDarkMode(theme === "dark"))
    }
    setThemeMenuOpen(false)
  }

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
  }

  return (
    <header className="bg-white  border-b  h-16 flex items-center px-4 justify-between">
      <div className="flex items-center">
        <button
          className="md:hidden p-2 mr-2 rounded-md hover:bg-gray-200 "
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 ">Point of Sale</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200  relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Theme Switcher */}
        <div className="relative" ref={themeMenuRef}>
          <button
            className="p-2 rounded-full hover:bg-gray-200 "
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            aria-label="Change theme"
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {themeMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 bg-white  rounded-md shadow-lg py-1 z-10 border `}>
              <button
                className={`block px-4 py-2 text-sm w-full ${!isDarkMode && !isSystemTheme ? "bg-gray-100 dark:bg-gray-700" : ""} text-left text-gray-900`}
                onClick={() => toggleTheme("light")}
              >
                <div className="flex items-center">
                  <Sun size={16} className="mr-2" />
                  Light
                </div>
              </button>
              <button
                className={`block px-4 py-2 text-sm w-full ${isDarkMode && !isSystemTheme ? "bg-gray-100" : ""} text-left text-gray-900`}
                onClick={() => toggleTheme("dark")}
              >
                <div className="flex items-center text-gray-900">
                  <Moon size={16} className="mr-2" />
                  Dark
                </div>
              </button>
              <button
                className={`block px-4 py-2 text-sm w-full text-left text-gray-900  ${isSystemTheme ? 'bg-gray-100 ' : ''}`}
                onClick={() => toggleTheme("system")}
              >
                <div className="flex items-center">
                  <Monitor size={16} className="mr-2" />
                  System
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 "
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={16} />
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white   rounded-md shadow-lg py-1 z-10 border ">
              <a href="/profile" className="block text-gray-900 px-4 py-2 text-sm hover:bg-gray-100 ">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 ">
                Settings
              </a>
              <button
                className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100 "
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
