import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react'
import smoothscroll from 'smoothscroll-polyfill'

import Header from '@/components/Header'
import PageLayout from '@/components/layouts/PageLayout'
import { trackPageview } from '@/lib/gtag'
import { defaultSEO } from '@/lib/seo'
import '@/styles/global.css'

function App({ Component, pageProps }) {
  const { headerTitle, ...rest } = pageProps
  const router = useRouter()
  const {
    pathname,
    query: { slug }
  } = router

  useEffect(() => {
    smoothscroll.polyfill()
  }, [])

  useEffect(() => {
    const handleRouteChange = (url) => process.env.NODE_ENV === 'production' && trackPageview(url)
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        strategy="worker"
      />
      <DefaultSeo {...defaultSEO} />
      <Header headerTitle={headerTitle} pathname={pathname} slug={slug} router={router} />
      <PageLayout pathname={pathname} slug={slug}>
        <Component {...rest} />
      </PageLayout>
      <Analytics />
    </>
  )
}

export default App
