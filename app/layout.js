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
  title: 'Library System - Your Personal Book Collection',
  description: 'A modern library management system to organize and track your personal book collection.',
}

export const viewport = {
  themeColor: '#722f37',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${anton.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
