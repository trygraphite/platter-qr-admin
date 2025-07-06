'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

import { cn, getFileUrl } from '@/lib/utils'

export const ImageUploader = ({
  title,
  type = 'upload',
  disabled = false,
  caption,
  imageUrl,
  onFileChange,
  className,
  imagePreviewClassName,
  placeholderClassName,
  errorMessage,
  children,
}: {
  caption: string
  title?: string
  type?: 'upload' | 'view' | 'profile'
  imageUrl?: string
  className?: string
  imagePreviewClassName?: string
  placeholderClassName?: string
  errorMessage?: string
  disabled?: boolean
  onFileChange?: (file: File) => void
  children?: React.ReactNode
}) => {
  const [url, setUrl] = useState(imageUrl)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        const newUrl = getFileUrl(file)
        setUrl(newUrl)
        if (onFileChange) onFileChange(file)
      }
    },
  })

  useEffect(() => {
    if (imageUrl) {
      setUrl(imageUrl)
    }
  }, [imageUrl])

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'w-full rounded-lg border px-5 py-4',
          errorMessage && 'border-red-500',
          disabled && 'opacity-50',
          className,
        )}
      >
        <div className="flex items-center">
          {url ? (
            <div className={cn('relative overflow-hidden border bg-gray-100', imagePreviewClassName)}>
              <Image src={url} fill alt="profile image" className="object-cover" />
            </div>
          ) : (
            <div
              className={cn(
                'relative flex cursor-pointer items-center justify-center bg-gray-100',
                placeholderClassName,
              )}
            >
              <Camera size={38} className="text-muted-foreground" />
            </div>
          )}
          <div className="ml-3">
            <div
              className={
                type === 'profile'
                  ? 'text-sm font-semibold text-black'
                  : 'text-xs font-medium text-muted-foreground'
              }
            >
              {title}
            </div>
            <div
              className={
                type === 'view' || type === 'upload'
                  ? 'text-sm font-semibold text-black'
                  : 'text-sm font-medium text-muted-foreground'
              }
            >
              {caption}
            </div>
          </div>
          <div className="relative ml-auto">
            {type === 'upload' ? (
              <>
                <input type="text" hidden {...getInputProps()} />
                {children}
              </>
            ) : (
              <>{children}</>
            )}
          </div>
        </div>
      </div>
      {errorMessage ? (
        <div
          className={cn(
            'mt-2 w-full text-sm text-red-600 first-letter:capitalize',
            disabled && 'opacity-50',
          )}
        >
          {errorMessage}
        </div>
      ) : null}
    </>
  )
} 