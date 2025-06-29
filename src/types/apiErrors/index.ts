export interface ApiErrorResponseType {
  message: string
  timestamp: string
  path: string
  data: unknown
}
export interface ApiErrorType {
  status: number
  error: string
  message: string
}