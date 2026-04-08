'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

export default function BookModal({ isOpen, onClose, onSuccess, book = null }) {
  const isEditing = !!book
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    book_name: '',
    author: '',
    genre: '',
    description: '',
    cover_url: '',
  })

  useEffect(() => {
    if (book) {
      setFormData({
        book_name: book.book_name || '',
        author: book.author || '',
        genre: book.genre || '',
        description: book.description || '',
        cover_url: book.cover_url || '',
      })
    } else {
      setFormData({
        book_name: '',
        author: '',
        genre: '',
        description: '',
        cover_url: '',
      })
    }
    setError('')
  }, [book, isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing ? `/api/books/${book.id}` : '/api/books'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/50">
      <div className="relative w-full max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-wine px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-display tracking-wide">
            {isEditing ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="book_name" className="block text-sm font-medium text-foreground mb-1">
              Book Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="book_name"
              name="book_name"
              value={formData.book_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-white text-foreground focus:ring-2 focus:ring-wine focus:border-transparent"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-foreground mb-1">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-white text-foreground focus:ring-2 focus:ring-wine focus:border-transparent"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-foreground mb-1">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-white text-foreground focus:ring-2 focus:ring-wine focus:border-transparent"
            >
              <option value="">Select a genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Horror">Horror</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Poetry">Poetry</option>
              <option value="Classic">Classic</option>
              <option value="Children">Children</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-white text-foreground focus:ring-2 focus:ring-wine focus:border-transparent resize-none"
              placeholder="Enter a brief description of the book"
            />
          </div>

          <div>
            <label htmlFor="cover_url" className="block text-sm font-medium text-foreground mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              id="cover_url"
              name="cover_url"
              value={formData.cover_url}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-white text-foreground focus:ring-2 focus:ring-wine focus:border-transparent"
              placeholder="https://example.com/book-cover.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Paste a URL to the book cover image
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground font-medium hover:bg-paper-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-wine hover:bg-wine-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {isEditing ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Adding...' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
