import { Link } from 'react-router-dom';

type ErrorPageProps = { status: 403 | 404 };

export function ErrorPage({ status }: ErrorPageProps) {
  const forbidden = status === 403;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-5 py-10 text-center" lang="zh-CN">
      <img
        src={forbidden ? '/images/errors/403-forbidden.png' : '/images/errors/404-not-found.png'}
        alt={forbidden ? '初音未来阻止未授权访问的 403 插画' : '初音未来寻找不到页面的 404 插画'}
        className="w-full max-w-3xl h-auto object-contain"
      />
      <h1 className="mt-4 text-2xl font-semibold text-slate-800">{forbidden ? '403 · 拒绝访问' : '404 · 页面不存在'}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {forbidden ? '当前账号无权访问此页面，请使用管理员账号登录。' : '抱歉，你访问的页面不存在或已被移动。'}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link className="rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700" to="/">返回首页</Link>
        {forbidden && <Link className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50" to="/login">前往登录</Link>}
      </div>
    </main>
  );
}
