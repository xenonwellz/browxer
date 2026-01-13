import * as React from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '../styles.css?url'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'BROW-S3-R | Premium S3 Browser',
      },
      {
        name: 'description',
        content: 'A high-performance, open-source S3 file explorer designed for speed, security, and pure elegance. Direct client-to-S3 architecture.',
      },
      {
        property: 'og:title',
        content: 'BROW-S3-R | Premium S3 Browser',
      },
      {
        property: 'og:description',
        content: 'Management of S3 buckets with pure elegance. Direct client-to-S3 connection with no middle-man.',
      },
      {
        property: 'og:image',
        content: '/og-image.png',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'BROW-S3-R | Premium S3 Browser',
      },
      {
        name: 'twitter:description',
        content: 'High-performance, open-source S3 explorer. Pure elegance, zero middle-man.',
      },
      {
        name: 'twitter:image',
        content: '/og-image.png',
      },
      {
        name: 'twitter:site',
        content: '@xenonellz',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" />
          {process.env.NODE_ENV === 'development' && (
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          )}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
