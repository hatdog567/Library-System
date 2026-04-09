'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AuthModal from '@/components/auth-modal'

export default function HomePage() {
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (data.authenticated) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
  }, [router])

  const openAuth = (mode) => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efe8e0]">
        <div className="animate-pulse">
          <Image src="/img/arklib.png" alt="ArkLib" width={100} height={100} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#efe8e0]">
      {/* Header */}
      <header className="header-container">
        <a href="#" className="mr-auto">
          <Image src="/img/arklib.png" alt="ArkLib Logo" width={100} height={100} className="h-[50px] sm:h-[70px] md:h-[100px] w-auto" />
        </a>
        <nav className="flex gap-2 sm:gap-3">
          <a href="#members" className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#1f1f1f] text-white rounded-[20px] font-bold no-underline hover:bg-[#340a10] transition-colors" style={{ fontFamily: 'Anton, sans-serif' }}>
            About
          </a>
          <button
            onClick={() => openAuth('login')}
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#1f1f1f] text-white rounded-[20px] border-none cursor-pointer hover:bg-[#340a10] transition-colors"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            Login
          </button>
          <button
            onClick={() => openAuth('register')}
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#1f1f1f] text-white rounded-[20px] border-none cursor-pointer hover:bg-[#340a10] transition-colors"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-[120px] flex-1">
        <section className="px-[clamp(16px,3vw,34px)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-[clamp(16px,3vw,34px)]">
            {/* Feature Card */}
            <article className="feature mt-0 lg:mt-[90px] lg:ml-[50px]">
              <div className="covers">
                <Image
                  src="/img/image-1.png"
                  alt="To Kill a Mockingbird"
                  width={250}
                  height={200}
                  className="cover cover-1"
                />
              </div>
              <div className="details flex flex-col justify-center">
                <h1 className="author">Harper Lee</h1>
                <p className="blurb">
                  From innocence under reckoning in <em>Mockingbird</em> to the uneasy return of Maycomb in{' '}
                  <em>Watchman</em>—Lee wrote not just of justice, but of the journey to see it clearly.
                </p>
                <a
                  className="cta"
                  href="https://www.goodreads.com/author/show/1825.Harper_Lee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Now
                </a>
              </div>
            </article>

            {/* Aside */}
            <aside className="aside">
              <h2>Turn Pages, Turn Minds.</h2>
              <Image
                src="/img/image-2.png"
                alt="Readers in a library"
                width={360}
                height={240}
                className="photo"
              />
              <p>
                Reading isn&apos;t just turning pages—it&apos;s slipping between worlds. A book can take you farther than any
                plane ticket, into lives you&apos;ve never lived and places you&apos;ve never seen. It&apos;s the cheapest form of
                travel and the richest form of escape. All you need is a quiet corner and an open mind.
              </p>
            </aside>
          </div>
        </section>
      </main>

      {/* Members Section */}
      <section id="members" className="member-frames">
        <h1>Meet the Group 4</h1>
        <div className="member-grid">
          <div className="member">
            <Image src="/img/member1.jpg" alt="Member 1" width={160} height={160} className="photo" />
            <h2>Aldrin Clark Adino</h2>
            <p>Project Manager – Oversees team operations and ensures smooth delivery.</p>
          </div>
          <div className="member">
            <Image src="/img/member2.jpg" alt="Member 2" width={160} height={160} className="photo" />
            <h2>Antonette Formento</h2>
            <p>Lead Developer – Builds and maintains the core platform features.</p>
          </div>
          <div className="member">
            <Image src="/img/member3.jpg" alt="Member 3" width={160} height={160} className="photo" />
            <h2>Mikaella Licup</h2>
            <p>Lead Developer – Builds and maintains the core platform features.</p>
          </div>
          <div className="member">
            <Image src="/img/member4.jpg" alt="Member 4" width={160} height={160} className="photo" />
            <h2>Savina Lilagan</h2>
            <p>Lead Developer – Builds and maintains the core platform features.</p>
          </div>
          <div className="member">
            <Image src="/img/member5.jpg" alt="Member 5" width={160} height={160} className="photo" />
            <h2>Wency Geraldo</h2>
            <p>Lead Developer – Builds and maintains the core platform features.</p>
          </div>
          <div className="member">
            <Image src="/img/member6.jpg" alt="Member 6" width={160} height={160} className="photo" />
            <h2>Gabriel Palattao</h2>
            <p>Lead Developer – Builds and maintains the core platform features.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-sec">
        <div className="footer-text">
          <p>&copy; 2025 ArkLib. All rights reserved. Group 4</p>
          <p className="tagline">Turn Pages, Turn Minds.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}
