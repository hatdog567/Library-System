'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { BookOpen, Plus, Search, LogOut, Loader2, Library } from 'lucide-react'
import BookCard from '@/components/book-card'
import BookModal from '@/components/book-modal'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      if (data.authenticated) {
        setUser(data.user)
      } else {
        router.push('/')
      }
    }
    fetchUser()
  }, [router])

  // Fetch books
  const { data, error, isLoading, mutate } = useSWR(
    user ? `/api/books${debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : ''}` : null,
    fetcher
  )

  const books = data?.books || []

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const handleAddBook = () => {
    setEditingBook(null)
    setBookModalOpen(true)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setBookModalOpen(true)
  }

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    setDeleteLoading(bookId)
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' })
      if (res.ok) {
        mutate()
      }
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleBookSuccess = useCallback(() => {
    mutate()
  }, [mutate])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-8 h-8 text-wine animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-wine shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Library System</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-white/80 hidden sm:block">
                Welcome, <span className="font-semibold text-white">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Book Collection</h1>
            <p className="text-muted-foreground mt-1">
              {books.length} {books.length === 1 ? 'book' : 'books'} in your library
            </p>
          </div>
          <button
            onClick={handleAddBook}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-wine hover:bg-wine-dark text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} />
            Add Book
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or genre..."
            className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-white text-foreground focus:ring-2 focus:ring-wine focus:border-transparent shadow-sm"
          />
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-wine animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600">Failed to load books. Please try again.</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <Library className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
            {debouncedSearch ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">No books found</h3>
                <p className="text-muted-foreground">
                  {"No books match your search \"" + debouncedSearch + "\". Try a different search term."}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Your library is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start building your collection by adding your first book.
                </p>
                <button
                  onClick={handleAddBook}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-wine hover:bg-wine-dark text-white font-semibold rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  Add Your First Book
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </main>

      {/* Book Modal */}
      <BookModal
        isOpen={bookModalOpen}
        onClose={() => {
          setBookModalOpen(false)
          setEditingBook(null)
        }}
        onSuccess={handleBookSuccess}
        book={editingBook}
      />
    </div>
  )
}
