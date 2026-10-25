import { apiClient } from '@/lib/api/client'

type SigninEnvelope<T> = {
  status?: string | number | boolean
  message?: string
  data?: T
}

export type SigninStatus = {
  daily_limit: number
  today_count: number
  can_signin: boolean
}

export type SigninReward = {
  traffic_bytes: number
  traffic_gb: number
  remaining_bytes: number
  message: string
}

function unwrapSignin<T>(response: SigninEnvelope<T>): T {
  if (response.status === 'fail' || response.status === 'error' || response.status === 0 || response.status === false) {
    throw new Error(response.message || '签到接口返回失败')
  }
  if (!response.data) {
    throw new Error(response.message || '签到接口未返回数据，请检查插件是否启用')
  }
  return response.data
}

export async function getSigninStatus(): Promise<SigninStatus> {
  const response = await apiClient.get<SigninEnvelope<SigninStatus>>('/api/v1/signin/status')
  return unwrapSignin(response.data)
}

export async function submitSignin(): Promise<SigninReward> {
  const response = await apiClient.post<SigninEnvelope<SigninReward>>('/api/v1/signin')
  return unwrapSignin(response.data)
}
