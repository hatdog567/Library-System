import { Montserrat, Anton } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

export const metadata = {
  title: 'ArkLib - Turn Pages, Turn Minds',
  description: 'ArkLib is your personal digital library. Organize, discover, and share books with the ArkLib community.',
  icons: {
    icon: '/img/arklib.png',
  },
}

export const viewport = {
  themeColor: '#251818',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${anton.variable}`}>
      <head>
        <link rel="icon" href="/img/arklib.png" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
