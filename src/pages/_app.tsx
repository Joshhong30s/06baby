import Navbar from '../components/navbar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NoSSR from '@/components/NoSSR'
import { Klee_One } from 'next/font/google'
import Head from 'next/head'
import Footer from '@/components/Footer'
import localFont from 'next/font/local'

const klee = Klee_One({
  weight: '600',
  subsets: ['latin'],
})

const wenkai = localFont({
  src: [
    {
      path: '../public/fonts/LXGWWenKaiTC-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/LXGWWenKaiTC-Light.ttf',
      weight: '400',
      style: 'light',
    },
    {
      path: '../public/fonts/LXGWWenKaiTC-Light.ttf',
      weight: '600',
      style: 'bold',
    },
  ],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={wenkai.className}>
      <Head>
        <link rel='apple-touch-icon' href='/family.jpg' />
        <title>小寶成長紀錄</title>
      </Head>
      <NoSSR>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </NoSSR>
    </div>
  )
}
