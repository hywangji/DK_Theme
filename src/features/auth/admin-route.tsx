import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { checkXboardAdmin } from '@/lib/api/services/admin-check';
import { ErrorPage } from '@/pages/error-page';
import { AnimeAdmin } from '@/anime/admin';

export function AdminRoute() {
  const { token, hydrated } = useAuth();
  const [check, setCheck] = useState<{ token: string; allowed: boolean } | null>(null);

  useEffect(() => {
    if (!hydrated || !token) return;
    const controller = new AbortController();
    void checkXboardAdmin(token, controller.signal)
      .then(allowed => { if (!controller.signal.aborted) setCheck({ token, allowed }); })
      .catch(() => { if (!controller.signal.aborted) setCheck({ token, allowed: false }); });
    return () => controller.abort();
  }, [hydrated, token]);

  if (!hydrated) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">正在确认登录状态…</div>;
  if (!token) return <ErrorPage status={403} />;
  if (!check || check.token !== token) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">正在验证 XBoard 管理员权限…</div>;
  if (!check.allowed) return <ErrorPage status={403} />;
  return <AnimeAdmin />;
}
