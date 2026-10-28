import axios from 'axios';
import { appConfig } from '@/lib/config';

/** XBoard service-authoritative identity check. Never use localStorage role flags. */
export async function checkXboardAdmin(token: string, signal?: AbortSignal): Promise<boolean> {
  // No mock bypass: development/mock tokens are not administrator credentials.
  if (!token || appConfig.enableMock) return false;
  const response = await axios.get<{
    status?: string;
    data?: { is_login?: boolean; is_admin?: boolean };
  }>('/api/v1/user/checkLogin', {
    baseURL: appConfig.apiBaseUrl,
    headers: { Authorization: token },
    withCredentials: false,
    signal,
    timeout: 12000,
  });
  return response.status === 200 &&
    response.data?.status === 'success' &&
    response.data?.data?.is_login === true &&
    response.data?.data?.is_admin === true;
}
