"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/toast-context'

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  onFileRemove?: (file: File) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
  multiple?: boolean
  uploadType?: 'resume' | 'logo' | 'document' | 'portfolio' | 'image'
}

interface FileWithPreview extends File {
  id: string
  preview?: string
  status?: 'uploading' | 'success' | 'error'
  progress?: number
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  maxFiles = 5,
  maxSize = 10,
  className = '',
  disabled = false,
  multiple = true,
  uploadType = 'document'
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const mimeType = file.type

    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type
      }
      if (type.includes('*')) {
        return mimeType.match(type.replace('*', '.*'))
      }
      return mimeType === type
    })

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
    }

    return null
  }, [acceptedTypes, maxSize])

  const createFilePreview = useCallback((file: File): FileWithPreview => {
    const fileWithPreview: FileWithPreview = Object.assign(file, {
      id: Math.random().toString(36).substr(2, 9),
      status: 'success'
    })

    if (file.type.startsWith('image/')) {
      fileWithPreview.preview = URL.createObjectURL(file)
    }

    return fileWithPreview
  }, [])

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: FileWithPreview[] = []
    const errors: string[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(createFilePreview(file))
      }
    })

    if (errors.length > 0) {
      showToast(errors.join('; '), 'error')
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple 
        ? [...files, ...validFiles].slice(0, maxFiles)
        : validFiles.slice(0, 1)
      
      setFiles(updatedFiles)
      onFileSelect(updatedFiles)
    }
  }, [files, validateFile, createFilePreview, onFileSelect, multiple, maxFiles, showToast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }, [disabled, handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeFile = useCallback((fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId)
    if (fileToRemove) {
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      
      const updatedFiles = files.filter(f => f.id !== fileId)
      setFiles(updatedFiles)
      onFileSelect(updatedFiles)
      
      if (onFileRemove) {
        onFileRemove(fileToRemove)
      }
    }
  }, [files, onFileSelect, onFileRemove])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />
    }
    if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">
          {uploadType === 'resume' && 'Upload your resume'}
          {uploadType === 'logo' && 'Upload company logo'}
          {uploadType === 'document' && 'Upload documents'}
          {uploadType === 'portfolio' && 'Upload portfolio files'}
          {uploadType === 'image' && 'Upload images'}
        </p>
        <p className="text-xs text-gray-500">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Max {maxSize}MB per file, up to {maxFiles} files
        </p>
        <p className="text-xs text-gray-400">
          Accepted: {acceptedTypes.join(', ')}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {file.status === 'uploading' && (
                  <div className="w-4 h-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
                
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
