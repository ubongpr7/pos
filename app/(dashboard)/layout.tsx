'use client'
import type React from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Suspense } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { useAppSelector, useAppDispatch } from "../../redux/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className={`${isDarkMode ? "dark" : ""} text-gray-900 bg-gray-100 flex h-screen overflow-hidden`}>
      <Sidebar />
      <div className="flex  flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 ">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
