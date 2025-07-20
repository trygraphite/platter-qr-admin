'use client'

import React, { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { Loader2, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApi } from '@/network'
import { UpdateBusinessRequest } from '@/types/apiRequest/business.request'
import { ImageUploader } from '@/components/custom/image-uploader'
import { AccountBusinessResponse } from '@/types/apiResponse/account.payload'

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  description: z.string().min(1, 'Description is required'),
  subdomain: z.string().min(1, 'Subdomain is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  socials: z.array(z.string()),
  address: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    proofOfAddress: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
  }),
  logo: z.any().optional(),
  image: z.any().optional(),
  contactEmail: z.string().email('Please enter a valid email'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  hours: z.array(z.object({
    day: z.string(),
    opening: z.string(),
    closing: z.string(),
  })),
})

type BusinessFormData = z.infer<typeof businessSchema>

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

const SettingTemplate = () => {
  const { accountApi, uploadApi, businessApi } = useApi()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      description: '',
      subdomain: '',
      website: '',
      socials: [],
      address: {
        address: '',
        city: '',
        country: '',
        postalCode: '',
        proofOfAddress: '',
        latitude: '',
        longitude: '',
      },
      logo: undefined,
      image: undefined,
      contactEmail: '',
      contactName: '',
      contactPhone: '',
      hours: [],
    },
  })

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['account-details'],
    queryFn: accountApi.getAccountDetails,
  })

  const { data: activeBusinessData, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ['active-business'],
    queryFn: () => accountApi.getActiveBusiness().then(res => res.data as AccountBusinessResponse),
  })

  useEffect(() => {
    if (activeBusinessData?.data) {
      const b = activeBusinessData.data;
      reset({
        name: b.name || '',
        description: b.description || '',
        subdomain: b.subdomain || '',
        website: b.website || '',
        socials: b.socials || [],
        address: {
          address: b.address?.address || '',
          city: b.address?.city || '',
          country: b.address?.country || '',
          postalCode: b.address?.postalCode || '',
          proofOfAddress: b.address?.proofOfAddress || '',
          latitude: b.address?.latitude || '',
          longitude: b.address?.longitude || '',
        },
        logo: b.logo || undefined,
        image: b.image || undefined,
        contactEmail: b.contacts?.email?.value || '',
        contactName: b.contacts?.name || '',
        contactPhone: b.contacts?.phone || '',
        hours: b.hours || [],
      });
    }
  }, [activeBusinessData, reset]);

  // Mutations
  const updateBusinessMutation = useMutation({
    mutationFn: (payload: UpdateBusinessRequest) => businessApi.updateBusiness(payload),
    onSuccess: () => {
      toast.success('Business updated successfully!')
    },
    onError: (error: AxiosError) => {
      const errorData = error.response?.data as { message?: string }
      toast.error('Failed to update business', {
        description: errorData?.message || 'Please try again.',
      })
    },
  })

  const onSubmit: SubmitHandler<BusinessFormData> = async (data) => {
    try {
      const payload: BusinessFormData = { ...data }
      // Upload logo if it's a File
      if (payload.logo && payload.logo instanceof File) {
        const uploadResponse = await uploadApi.uploadImage(payload.logo)
        payload.logo = uploadResponse.data.data.url
      }
      // Upload image if it's a File
      if (payload.image && payload.image instanceof File) {
        const uploadResponse = await uploadApi.uploadImage(payload.image)
        payload.image = uploadResponse.data.data.url
      }
      // Use correct mutation
      updateBusinessMutation.mutate(payload as unknown as UpdateBusinessRequest)
    } catch (error) {
      const axiosError = error as AxiosError
      toast.error('Image upload failed', {
        description: (axiosError.response?.data as {message: string})?.message || 'Could not upload images. Please try again.',
      })
      console.error('Upload error:', error)
    }
  }

  const addSocial = () => {
    const currentSocials = watch('socials')
    setValue('socials', [...currentSocials, ''])
  }

  const removeSocial = (index: number) => {
    const currentSocials = watch('socials')
    setValue('socials', currentSocials.filter((_, i) => i !== index))
  }

  const addBusinessHour = () => {
    const currentHours = watch('hours')
    setValue('hours', [...currentHours, { day: 'monday', opening: '09:00', closing: '17:00' }])
  }

  const removeBusinessHour = (index: number) => {
    const currentHours = watch('hours')
    setValue('hours', currentHours.filter((_, i) => i !== index))
  }

  if (isLoadingUser || isLoadingBusiness) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Settings</h1>
        <p className="text-muted-foreground">
          Manage your business information and settings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your business basic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter business name"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain *</Label>
                <Input
                  id="subdomain"
                  {...register('subdomain')}
                  placeholder="your-business"
                />
                {errors.subdomain && (
                  <p className="text-sm text-red-500">{errors.subdomain.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your business"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://your-website.com"
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>
              Upload your business logo and cover image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUploader
                caption="Click or drag to upload logo (PNG, JPG)"
                onFileChange={(file) => setValue('logo', file, { shouldValidate: true })}
                imageUrl={userData?.data?.data?.businesses?.[0]?.logo}
                imagePreviewClassName="size-24 rounded-full"
                placeholderClassName="size-24 rounded-full"
                errorMessage={errors.logo?.message as string}
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUploader
                caption="Click or drag to upload cover image (PNG, JPG)"
                onFileChange={(file) => setValue('image', file, { shouldValidate: true })}
                imageUrl={userData?.data?.data?.businesses?.[0]?.image}
                imagePreviewClassName="w-full h-40 rounded-md"
                placeholderClassName="w-full h-40 rounded-md"
                errorMessage={errors.image?.message as string}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update your business contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  {...register('contactName')}
                  placeholder="Enter contact name"
                />
                {errors.contactName && (
                  <p className="text-sm text-red-500">{errors.contactName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail')}
                  placeholder="contact@business.com"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                {...register('contactPhone')}
                placeholder="+1234567890"
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>
              Update your business address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                {...register('address.address')}
                placeholder="Enter street address"
              />
              {errors.address?.address && (
                <p className="text-sm text-red-500">{errors.address.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register('address.city')}
                  placeholder="Enter city"
                />
                {errors.address?.city && (
                  <p className="text-sm text-red-500">{errors.address.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  {...register('address.country')}
                  placeholder="Enter country"
                />
                {errors.address?.country && (
                  <p className="text-sm text-red-500">{errors.address.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  {...register('address.postalCode')}
                  placeholder="Enter postal code"
                />
                {errors.address?.postalCode && (
                  <p className="text-sm text-red-500">{errors.address.postalCode.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>
              Set your business operating hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {watch('hours').map((hour, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <Select
                  value={hour.day}
                  onValueChange={(value) => {
                    const currentHours = watch('hours')
                    const updatedHours = [...currentHours]
                    updatedHours[index] = { ...updatedHours[index], day: value }
                    setValue('hours', updatedHours)
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="time"
                  value={hour.opening}
                  onChange={(e) => {
                    const currentHours = watch('hours')
                    const updatedHours = [...currentHours]
                    updatedHours[index] = { ...updatedHours[index], opening: e.target.value }
                    setValue('hours', updatedHours)
                  }}
                  className="w-32"
                />

                <span>to</span>

                <Input
                  type="time"
                  value={hour.closing}
                  onChange={(e) => {
                    const currentHours = watch('hours')
                    const updatedHours = [...currentHours]
                    updatedHours[index] = { ...updatedHours[index], closing: e.target.value }
                    setValue('hours', updatedHours)
                  }}
                  className="w-32"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBusinessHour(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addBusinessHour}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Business Hour
            </Button>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Add your social media links
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {watch('socials').map((social, index) => (
              <div key={index} className="flex items-center gap-4">
                <Input
                  value={social}
                  onChange={(e) => {
                    const currentSocials = watch('socials')
                    const updatedSocials = [...currentSocials]
                    updatedSocials[index] = e.target.value
                    setValue('socials', updatedSocials)
                  }}
                  placeholder="Enter social media URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocial(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addSocial}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Social Media Link
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateBusinessMutation.isPending}
            className="min-w-[200px] text-white"
          >
            {updateBusinessMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Business'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SettingTemplate