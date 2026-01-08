import { Outlet } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Menu } from 'lucide-react'
import { BucketSidebar } from './bucket-sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function BrowserLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 shrink-0">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <BucketSidebar className="border-none" />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span className="text-xl tracking-tight hidden sm:inline-block">
            S3 Brows3r
          </span>
        </div>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden h-full w-[280px] md:block shrink-0">
          <BucketSidebar />
        </aside>

        <main className="flex-1 overflow-auto bg-muted/10 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
