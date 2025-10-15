"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Users, FileText, LayoutDashboard, Settings, Bell, LogOut, ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const menuItems = [
  {
    title: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý căn hộ",
    href: "/admin/apartments",
    icon: Building2,
  },
  {
    title: "Quản lý cư dân",
    href: "/admin/residents",
    icon: Users,
  },
  {
    title: "Khai báo",
    href: "/admin/declarations",
    icon: FileText,
  },
  {
    title: "Thông báo",
    href: "/admin/announcements",
    icon: Bell,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!collapsed && (
              <Link href="/admin" className="flex items-center gap-2 font-semibold">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Admin Panel</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn("hidden lg:flex", collapsed && "mx-auto")}
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className={cn("w-full justify-start text-muted-foreground", collapsed && "justify-center px-0")}
              asChild
            >
              <Link href="/login">
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Đăng xuất</span>}
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
