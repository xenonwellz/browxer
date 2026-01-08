import * as React from 'react'
import {
  File,
  Loader2,
  Upload,
  X,
} from 'lucide-react'
import { useUpload } from '@/hooks/use-upload'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatBytes } from '@/lib/utils'

interface UploadDropzoneProps {
  bucket: string
  prefix: string
  onComplete: () => void
}

export function UploadDropzone({
  bucket,
  prefix,
  onComplete,
}: UploadDropzoneProps) {
  const [files, setFiles] = React.useState<Array<File>>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const { uploadFiles, progresses, isUploading } = useUpload(bucket, prefix)

  const onDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const startUpload = async () => {
    if (files.length === 0) return
    await uploadFiles(files)
    setFiles([])
    onComplete()
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-10 transition-colors flex flex-col items-center justify-center gap-4 text-center',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          isUploading && 'pointer-events-none opacity-50',
        )}
      >
        <div className="bg-primary/10 p-4 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium">Drag & drop files here</p>
          <p className="text-sm text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>
        <Input
          type="file"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={onFileSelect}
        />
      </div>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">
                Selected Files ({files.length})
              </h4>
              <Button size="sm" onClick={startUpload} disabled={isUploading}>
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upload All
              </Button>
            </div>

            <div className="grid gap-2 max-h-[300px] overflow-auto pr-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 p-2 rounded-md border bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeFile(i)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isUploading && Object.keys(progresses).length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading Files...
            </h4>
            <div className="space-y-3">
              {Object.entries(progresses).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate">{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Minimal implementation of Input for this component because I can't import it easily here if it's not exported correctly
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />
}
