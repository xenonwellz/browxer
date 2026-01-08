import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbNavProps {
  bucket: string
  prefix?: string
}

export function BreadcrumbNav({ bucket, prefix }: BreadcrumbNavProps) {
  const parts = React.useMemo(() => {
    if (!prefix) return []
    return prefix.split('/').filter(Boolean)
  }, [prefix])

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link to="/browser/$bucket" params={{ bucket }} />}
          >
            <Home className="h-4 w-4 mr-2" />
            {bucket}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {parts.length > 0 && <BreadcrumbSeparator />}

        {parts.map((part, index) => {
          const isLast = index === parts.length - 1
          const currentPrefix = parts.slice(0, index + 1).join('/') + '/'

          return (
            <React.Fragment key={currentPrefix}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{part}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link
                        to="/browser/$bucket"
                        params={{ bucket }}
                        search={{ prefix: currentPrefix }}
                      />
                    }
                  >
                    {part}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

