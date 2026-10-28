// 六张同尺寸漫画插画，仅切换视觉状态；不接触账号或密码内容。
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

export function AuthArtwork({ scene }: { scene: AuthArtworkScene }) {
  return (
    <div
      role='img'
      aria-label={artwork[scene].label}
      className='pointer-events-none absolute inset-0 overflow-hidden bg-[#f9fbff] dark:bg-[#090c12]'
    >
      {/* 预先加载各状态的小体积 WebP，切换时只改变透明度，避免白屏、拉伸和图片闪烁。 */}
      {scenes.map((key) => (
        <img
          key={key}
          src={artwork[key].src}
          alt=''
          aria-hidden='true'
          draggable={false}
          decoding='async'
          fetchPriority={key === scene ? 'high' : 'low'}
          className={`absolute inset-0 h-full w-full select-none object-contain object-center mix-blend-multiply transition-opacity duration-300 ease-out motion-reduce:transition-none dark:invert dark:mix-blend-screen ${scene === key ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  )
}
