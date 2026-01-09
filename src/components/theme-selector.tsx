import { Check, Laptop, Moon, Sun } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

export function ThemeSelector() {
  const { setTheme, theme, color, setColor, presets } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'relative',
        )}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
            <Sun className="h-4 w-4" /> Light
            {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
            <Moon className="h-4 w-4" /> Dark
            {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className="gap-2"
          >
            <Laptop className="h-4 w-4" /> System
            {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
          <div className="grid grid-cols-3 gap-2 p-2">
            {presets.map(
              (preset: { name: string; label: string; primary: string }) => (
                <button
                  key={preset.name}
                  onClick={() => setColor(preset.name)}
                  className={cn(
                    'flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground',
                    color === preset.name && 'border-primary',
                  )}
                  title={preset.label}
                >
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: `oklch(${preset.primary})` }}
                  />
                </button>
              ),
            )}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
