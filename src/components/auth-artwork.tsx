// 六张同尺寸漫画插画，只根据页面交互状态切换；不读取账号或密码内容。
export type AuthArtworkScene = 'welcome' | 'email' | 'password' | 'success' | 'failure' | 'register'

const artwork: Record<AuthArtworkScene, { src: string; label: string }> = {
  welcome: { src: '/images/auth/miku-welcome.webp', label: '初音欢迎登录' },
  email: { src: '/images/auth/miku-email.webp', label: '初音正在注视账号输入' },
  password: { src: '/images/auth/miku-password.webp', label: '初音遮住双眼，尊重密码隐私' },
  success: { src: '/images/auth/miku-success.webp', label: '初音庆祝登录成功' },
  failure: { src: '/images/auth/miku-failure.webp', label: '初音对登录失败感到疑惑' },
  register: { src: '/images/auth/miku-register.webp', label: '初音欢迎注册新账户' },
}

const scenes = Object.keys(artwork) as AuthArtworkScene[]

// 漫画插画是白底图片：先缩小并留白，再借助混合模式与边缘遮罩柔和融入页面底色。
// 遮罩只作用于插画，周围页面背景保持不变，浅色/深色模式均兼容。
const softEdgeMask =
  'radial-gradient(ellipse 68% 68% at 50% 50%, black 54%, rgba(0,0,0,0.96) 68%, rgba(0,0,0,0.5) 85%, transparent 100%)'

export function AuthArtwork({ scene }: { scene: AuthArtworkScene }) {
  return (
    <div
      role='img'
      aria-label={artwork[scene].label}
      className='pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_15%_5%,rgba(178,220,231,0.13),transparent_55%),linear-gradient(180deg,#f9fbfd_0%,#f3f6fa_100%)] dark:bg-[linear-gradient(180deg,#0b1220_0%,#111a2a_100%)]'
    >
      {/* 右侧仍占原来一半宽度，只缩小插画自身，与左侧表单形成视觉平衡。 */}
      <div
        className='relative shrink-0'
        style={{ width: 'min(72%, 540px)', maxHeight: '78vh', aspectRatio: '1122 / 1402' }}
      >
        {/* 六张图保持同尺寸叠放，切换状态时淡入淡出，避免尺寸跳动。 */}
        {scenes.map((key) => (
          <img
            key={key}
            src={artwork[key].src}
            alt=''
            aria-hidden='true'
            draggable={false}
            decoding='async'
            fetchPriority={key === scene ? 'high' : 'low'}
            style={{ WebkitMaskImage: softEdgeMask, maskImage: softEdgeMask }}
            className={`absolute inset-0 block h-full w-full select-none object-contain object-center mix-blend-multiply transition-opacity duration-300 ease-out motion-reduce:transition-none dark:invert dark:mix-blend-screen ${scene === key ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
    </div>
  )
}
