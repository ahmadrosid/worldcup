import Head from 'next/head'
import LinearGradient from "../components/linear-background"

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js and tailwindcss boilerplate!</title>
      </Head>
      <LinearGradient option={1} width="100vw" height="100vh">
        <div className='text-center text-white space-y-8 font-sans'>
          <h1 className='text-9xl font-bold'>Starter.</h1>
          <h2 className='text-6xl '>Next.js + Tailwindcss</h2>
          <p>Build your next Amazing product!</p>
        </div>
      </LinearGradient>
    </>
  )
}
