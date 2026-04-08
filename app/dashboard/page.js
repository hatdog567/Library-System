'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useSWR from 'swr'
import BookModal from '@/components/book-modal'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

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
  const { data, isLoading, mutate } = useSWR(
    user ? `/api/books` : null,
    fetcher
  )

  const books = data?.books || []
  const myBooks = books.filter(b => b.submitted_by === user?.id)

  // Filter books by search
  const filteredBooks = books.filter(book => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q)
    )
  })

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

  const handleBookSuccess = useCallback(() => {
    mutate()
  }, [mutate])

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U'

  if (!user) {
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
          <Image src="/img/arklib.png" alt="ArkLib Logo" width={100} height={100} className="h-[100px] w-auto" />
        </a>
        <nav className="flex gap-3">
          <button
            onClick={handleAddBook}
            className="ms-btn"
          >
            Submit a Book
          </button>
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="ms-btn ms-btn--ghost"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Overlay */}
      {(logoutModalOpen || bookModalOpen) && (
        <div
          className="ms-overlay"
          style={{ display: 'block' }}
          onClick={() => {
            setLogoutModalOpen(false)
            setBookModalOpen(false)
            setEditingBook(null)
          }}
        ></div>
      )}

      {/* Logout Modal */}
      {logoutModalOpen && (
        <div className="ms-modal" style={{ display: 'block' }}>
          <h2 className="ms-modal__title">Leaving so soon?</h2>
          <p className="ms-modal__body">Are you sure you want to log out, {user.username}?</p>
          <div className="ms-modal__row">
            <button className="ms-modal__stay" onClick={() => setLogoutModalOpen(false)}>
              Stay
            </button>
            <button className="ms-modal__go" onClick={handleLogout}>
              Yes, Logout
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="ms-main">
        {/* Welcome Banner */}
        <div className="ms-welcome">
          <div className="ms-welcome__inner">
            <div className="ms-welcome__left">
              <div className="ms-avatar">{userInitial}</div>
              <div className="ms-welcome__text">
                <p className="ms-welcome__sup">Welcome back</p>
                <h1 className="ms-welcome__name">{user.username}</h1>
                <p className="ms-welcome__sub">Your reading journey continues. What will you discover today?</p>
              </div>
            </div>
            <div className="ms-welcome__stats">
              <div className="ms-wstat">
                <span className="ms-wstat__num">{books.length}</span>
                <span className="ms-wstat__lbl">Books<br />in Library</span>
              </div>
              <div className="ms-wstat__sep"></div>
              <div className="ms-wstat">
                <span className="ms-wstat__num">{myBooks.length}</span>
                <span className="ms-wstat__lbl">Your<br />Submissions</span>
              </div>
              <div className="ms-wstat__sep"></div>
              <div className="ms-wstat">
                <span className="ms-wstat__num">∞</span>
                <span className="ms-wstat__lbl">Adventures<br />Awaiting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <section className="ms-featured-frame">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-[clamp(16px,3vw,34px)]">
            <article className="feature !m-0">
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
                <span className="ms-badge">Editor&apos;s Pick</span>
                <h2 className="author">Harper Lee</h2>
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
                Reading isn&apos;t just turning pages—it&apos;s slipping between worlds. A book can take you
                farther than any plane ticket, into lives you&apos;ve never lived. All you need is a quiet
                corner and an open mind.
              </p>
            </aside>
          </div>
        </section>

        {/* Book Collection */}
        <section className="ms-collection" id="books">
          <div className="ms-collection__hdr">
            <h2 className="ms-collection__title">Browse Collection</h2>
            <input
              type="search"
              id="bookSearch"
              placeholder="Search title or author..."
              className="ms-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="ms-grid" id="bookGrid">
            {isLoading ? (
              <p className="ms-empty">Loading books...</p>
            ) : filteredBooks.length === 0 ? (
              <p className="ms-empty">No books yet — be the first to submit one!</p>
            ) : (
              filteredBooks.map((book) => (
                <article key={book.id} className="ms-card">
                  <div
                    className="ms-card__spine"
                    style={{ background: book.cover_color || '#7f9aa2' }}
                  >
                    {book.cover_image ? (
                      <Image
                        src={book.cover_image}
                        alt="Cover"
                        width={230}
                        height={126}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: 'inherit' }}
                      />
                    ) : (
                      <span className="ms-card__initials">
                        {book.title.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="ms-card__body">
                    <span className="ms-card__genre">{book.genre || 'General'}</span>
                    <h3 className="ms-card__title">{book.title}</h3>
                    <p className="ms-card__author">{book.author}</p>
                    {book.description && (
                      <p className="ms-card__desc">
                        {book.description.length > 90
                          ? book.description.substring(0, 90) + '...'
                          : book.description}
                      </p>
                    )}
                  </div>
                  <div className="ms-card__foot">
                    {book.pdf_url ? (
                      <a
                        href={book.pdf_url.startsWith('urn:lcp:')
                          ? `https://archive.org/details/${book.pdf_url.split(':')[2]}/mode/2up`
                          : book.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-card__read"
                      >
                        Read →
                      </a>
                    ) : (
                      <span className="ms-card__nopdf">No link yet</span>
                    )}
                    <button
                      className="ms-card__edit-btn"
                      onClick={() => handleEditBook(book)}
                    >
                      Edit
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-sec">
        <div className="footer-text">
          <p>&copy; 2025 ArkLib. All rights reserved. Group 4</p>
          <p className="tagline">Turn Pages, Turn Minds.</p>
        </div>
      </footer>

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
