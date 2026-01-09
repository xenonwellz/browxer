import { Outlet } from '@tanstack/react-router'
import { LogOut, Menu } from 'lucide-react'
import { BucketSidebar } from './bucket-sidebar'
import { ThemeSelector } from './theme-selector'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function BrowserLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <header className="flex h-18 items-center gap-4 border-b bg-muted/40 px-6 shrink-0">
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

        <div className="flex items-center gap-2">
          {/* Logo */}
          <span className="font-logo text-3xl font-bold tracking-tighter select-none">
            BROW<span className="text-primary">S3</span>R
          </span>
        </div>

        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary/20 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out of your session?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => logout()}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
