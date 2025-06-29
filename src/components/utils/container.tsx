import React from 'react'

import { cn } from '@/lib/utils'

function Container({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn(className, 'mx-auto max-w-[120rem] px-8 py-5')}>{children}</div>
}

export default Container
