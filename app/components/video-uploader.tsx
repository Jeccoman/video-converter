"use client"

import { useState, useCallback, lazy, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Video, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

const LazyVideoPlayer = lazy(() => import('./lazy-loader'))

export default function VideoUploaderWithBase64Delay() {
  const [preview, setPreview] = useState<string | null>(null)
  const [base64Output, setBase64Output] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isBase64Loading, setIsBase64Loading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback((file: File) => {
    setIsLoading(true)
    setIsBase64Loading(true)
    setError(null)
    const reader = new FileReader()

    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      setIsLoading(false)
      
      // Simulate processing time for base64 output
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval)
            setBase64Output(result)
            setIsBase64Loading(false)
            return 100
          }
          return prevProgress + 10
        })
      }, 300)
    }

    reader.onerror = () => {
      console.error('Error reading file')
      setIsLoading(false)
      setIsBase64Loading(false)
      setError('An error occurred while processing the file. Please try again.')
    }

    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Upload Your Video</CardTitle>
        <CardDescription className="text-center">Drag and drop or select a video file to upload</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag and drop your video here, or click to select a file</p>
          <p className="mt-1 text-xs text-gray-500">Supported formats: MP4, WebM, Ogg (max 100MB)</p>
          <Input
            type="file"
            onChange={handleFileChange}
            accept="video/mp4,video/webm,video/ogg"
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline" className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Select Video
            </label>
          </Button>
        </div>

        {isLoading && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-gray-600">Processing your video...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {preview && !isLoading && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Video Preview</h3>
            <div className="max-w-sm max-h-[150px] mx-auto overflow-hidden">
              <Suspense fallback={<div className="w-full h-[150px] bg-gray-200 rounded-lg flex items-center justify-center">Loading video player...</div>}>
                <LazyVideoPlayer src={preview} />
              </Suspense>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Base64 Output</h3>
          {isBase64Loading ? (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">Generating Base64 output: {progress}%</p>
            </div>
          ) : base64Output ? (
            <div className="space-y-2">
              <div className="flex items-center text-green-600 mb-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Base64 generation complete</span>
              </div>
              <Textarea
                value={base64Output}
                readOnly
                className="w-full h-32 text-xs"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600">Upload a video to generate its Base64 representation</p>
          )}
        </div>

        {!preview && !isLoading && !error && (
          <p className="mt-4 text-sm text-gray-600 text-center">No video selected</p>
        )}
      </CardContent>
    </Card>
  )
}

