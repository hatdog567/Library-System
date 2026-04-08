'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Library, Search, Star, Users, Shield, ArrowRight } from 'lucide-react'
import AuthModal from '@/components/auth-modal'

export default function HomePage() {
  const router = useRouter()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
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
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-pulse">
          <BookOpen className="w-16 h-16 text-wine" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-wine" />
              <span className="text-xl font-bold text-foreground">Library System</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2 text-wine hover:text-wine-dark font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('register')}
                className="px-4 py-2 bg-wine hover:bg-wine-dark text-white font-medium rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
              Your Personal{' '}
              <span className="text-wine">Book Collection</span>
              {' '}Manager
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
              Organize, track, and discover your books with ease. A modern library system 
              designed for book lovers who want to keep their collection organized and accessible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openAuth('register')}
                className="w-full sm:w-auto px-8 py-4 bg-wine hover:bg-wine-dark text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
              >
                Start Your Library
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => openAuth('login')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-paper-dark text-foreground font-semibold rounded-lg transition-colors border border-border text-lg"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Feature preview image/illustration */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-border max-w-4xl mx-auto">
              <div className="bg-wine px-6 py-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-4 text-white/80 text-sm">My Book Collection</span>
              </div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['The Great Gatsby', 'To Kill a Mockingbird', '1984', 'Pride and Prejudice'].map((title, i) => (
                  <div key={i} className="bg-paper rounded-lg p-4 text-center">
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-wine/20 to-gold/20 rounded-md mb-3 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-wine/50" />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{title}</p>
                    <p className="text-xs text-muted-foreground">Classic</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Manage Your Books
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple yet powerful features to help you organize and enjoy your book collection.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Library className="w-8 h-8" />}
              title="Organize Your Collection"
              description="Add books with details like title, author, genre, and description. Keep everything in one place."
            />
            <FeatureCard
              icon={<Search className="w-8 h-8" />}
              title="Quick Search"
              description="Find any book instantly with our powerful search. Filter by title, author, or genre."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Track Your Favorites"
              description="Mark your favorite books and keep track of what you love most in your collection."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Personal Library"
              description="Your books are private and secure. Only you can see and manage your collection."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Private"
              description="Your data is encrypted and protected. We take your privacy seriously."
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Easy to Use"
              description="A clean, intuitive interface that makes managing your books a pleasure."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-wine">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Organize Your Books?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join today and start building your personal digital library.
          </p>
          <button
            onClick={() => openAuth('register')}
            className="px-8 py-4 bg-white hover:bg-paper text-wine font-semibold rounded-lg transition-colors inline-flex items-center gap-2 text-lg"
          >
            Create Free Account
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Library System</span>
          </div>
          <p className="text-white/60 text-sm">
            A personal book collection manager
          </p>
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

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-paper rounded-xl border border-border hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-wine/10 rounded-xl flex items-center justify-center text-wine mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
