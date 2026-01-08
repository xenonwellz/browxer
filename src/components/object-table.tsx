import * as React from 'react'
import {
  ArrowUp,
  Download,
  Edit3,
  File,
  Folder,
  Info,
  Loader2,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatBytes } from '@/lib/utils'
import { deleteObject, renameObject } from '@/routes/browser/-$bucket.server'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface ObjectTableProps {
  bucket: string
  prefix: string
  folders: Array<string>
  objects: Array<any>
  isLoading: boolean
  onRefresh: () => void
  onSelectObject: (object: any) => void
}

export function ObjectTable({
  bucket,
  prefix,
  folders,
  objects,
  isLoading,
  onRefresh,
  onSelectObject,
}: ObjectTableProps) {
  const [search, setSearch] = React.useState('')
  const [deletingObject, setDeletingObject] = React.useState<any>(null)
  const [renamingObject, setRenamingObject] = React.useState<any>(null)
  const [newName, setNewName] = React.useState('')
  const [isActionLoading, setIsActionLoading] = React.useState(false)

  const filteredFolders = folders.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredObjects = objects.filter((o) =>
    o.key.toLowerCase().includes(search.toLowerCase()),
  )

  const parentPrefix =
    prefix.split('/').filter(Boolean).slice(0, -1).join('/') +
    (prefix.split('/').filter(Boolean).length > 1 ? '/' : '')

  const handleDelete = async () => {
    if (!deletingObject) return
    setIsActionLoading(true)
    try {
      await deleteObject({ data: { bucket, key: deletingObject.key } })
      toast.success('Object deleted successfully')
      onRefresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete object')
    } finally {
      setIsActionLoading(false)
      setDeletingObject(null)
    }
  }

  const handleRename = async () => {
    if (!renamingObject || !newName) return
    setIsActionLoading(true)
    try {
      const currentPrefix = renamingObject.key.substring(
        0,
        renamingObject.key.lastIndexOf('/') + 1,
      )
      const newKey = `${currentPrefix}${newName}`

      await renameObject({
        data: { bucket, oldKey: renamingObject.key, newKey },
      })
      toast.success('Object renamed successfully')
      onRefresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to rename object')
    } finally {
      setIsActionLoading(false)
      setRenamingObject(null)
      setNewName('')
    }
  }

  const handleDownload = async (obj: any) => {
    try {
      const { getDownloadUrl } = await import('@/routes/browser/-$bucket.server')
      const { url } = await getDownloadUrl({ data: { bucket, key: obj.key } })

      const link = document.createElement('a')
      link.href = url
      link.download = obj.key.split('/').pop() || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Download started')
    } catch (error: any) {
      toast.error(error.message || 'Failed to download object')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in this folder..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredFolders.length + filteredObjects.length} items
          </Badge>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prefix && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Link
                    to="/browser/$bucket"
                    params={{ bucket }}
                    search={{ prefix: parentPrefix }}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary"
                  >
                    <ArrowUp className="h-4 w-4" />
                    ..
                  </Link>
                </TableCell>
              </TableRow>
            )}

            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 w-[200px] bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-[60px] bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-[120px] bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-8 ml-auto bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <>
                {filteredFolders.map((folder) => (
                  <TableRow key={folder}>
                    <TableCell>
                      <Link
                        to="/browser/$bucket"
                        params={{ bucket }}
                        search={{ prefix: folder }}
                        className="flex items-center gap-2 font-medium hover:text-primary"
                      >
                        <Folder className="h-4 w-4 text-blue-500 fill-blue-500" />
                        {folder.split('/').filter(Boolean).pop()}/
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">-</TableCell>
                    <TableCell className="text-muted-foreground">-</TableCell>
                    <TableCell className="text-right">
                      {/* Folder actions could go here, like delete folder */}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredObjects.map((obj) => (
                  <TableRow key={obj.key}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <File className="h-4 w-4 text-muted-foreground" />
                        {obj.key.split('/').pop()}
                      </div>
                    </TableCell>
                    <TableCell>{formatBytes(obj.size)}</TableCell>
                    <TableCell>
                      {format(new Date(obj.lastModified), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon" />}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onSelectObject(obj)}>
                            <Info className="mr-2 h-4 w-4" /> View Metadata
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(obj)}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setRenamingObject(obj)
                              setNewName(obj.key.split('/').pop() || '')
                            }}
                          >
                            <Edit3 className="mr-2 h-4 w-4" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeletingObject(obj)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredFolders.length === 0 &&
                  filteredObjects.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No objects found in this folder.
                      </TableCell>
                    </TableRow>
                  )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingObject}
        onOpenChange={() => setDeletingObject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <span className="font-semibold px-1">{deletingObject?.key}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isActionLoading}
            >
              {isActionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog
        open={!!renamingObject}
        onOpenChange={() => setRenamingObject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Object</DialogTitle>
            <DialogDescription>
              Enter a new name for the object.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newName">New Name</Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="filename.ext"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenamingObject(null)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={
                isActionLoading ||
                !newName ||
                newName === renamingObject?.key.split('/').pop()
              }
            >
              {isActionLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
