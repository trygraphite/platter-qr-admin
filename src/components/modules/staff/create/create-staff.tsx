'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Info, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QUERY_KEYS } from '@/keys/query-keys'
import { useCreateStaff } from '@/hooks/useStaff'
import { CreateStaffRequest } from '@/types/apiRequest/staff.request'

const staffSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  designation: z.string().min(1, 'Designation is required'),
  phone: z.string().min(1, 'Phone number is required'),
  type: z.enum(['waiter', 'operator']),
})

type StaffFormData = z.infer<typeof staffSchema>

const CreateStaff = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      designation: '',
      phone: '',
      type: 'waiter',
    },
  })

  const mutation = useCreateStaff()

  const onSubmit = async (data: StaffFormData) => {
    try {
      await mutation.mutateAsync(data)
      toast.success('Staff member created successfully!')
      reset()
    } catch (error) {
      toast.error('Failed to create staff member')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-transparent space-y-6 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-lg">Create Staff Member</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <span className='text-white'>Add a new staff member to your restaurant team.</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register('firstName')} placeholder="John" />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register('lastName')} placeholder="Doe" />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="john.doe@example.com" />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="designation">Designation</Label>
        <Input id="designation" {...register('designation')} placeholder="Waiter, Chef, Manager" />
        {errors.designation && <p className="text-sm text-red-500">{errors.designation.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" {...register('phone')} placeholder="+1234567890" />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Staff Type</Label>
        <Select onValueChange={(value) => setValue('type', value as 'waiter' | 'operator')} defaultValue="waiter">
          <SelectTrigger>
            <SelectValue placeholder="Select staff type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiter">Waiter</SelectItem>
            <SelectItem value="operator">Operator</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
      </div>

      <Button type="submit" className="w-full text-white" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Create Staff Member
          </>
        )}
      </Button>
    </form>
  )
}

export default CreateStaff 