'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useApi } from '@/network'
import { ServicePointRequest } from '@/types/apiRequest/business.request'

const servicePointSchema = z.object({
  name: z.string().min(1, 'Service point name is required'),
  description: z.string().min(1, 'Description is required'),
})

type ServicePointFormData = z.infer<typeof servicePointSchema>

const CreateServicePoint = () => {
  const { businessApi } = useApi()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServicePointFormData>({
    resolver: zodResolver(servicePointSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (payload: ServicePointRequest) => businessApi.createServicePoint(payload),
    onSuccess: () => {
      toast.success('Service point created!')
      reset()
    },
    onError: () => {
      toast.error('Failed to create service point')
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="max-w-md mx-auto bg-transparent space-y-6 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-lg">Create Service Point</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <span className='text-white'>This is the area where an order is processed/handled (e.g. kitchen, bar).</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g. Kitchen" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} placeholder="Describe this service point" />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>
      <Button type="submit" className="w-full text-white" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Service Point'}
      </Button>
    </form>
  )
}

export default CreateServicePoint
