const config = {
  platterApiUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  hashSecret: process.env.NEXT_HASH_SECRET_KEY || '',
} as const

export default config
