'use client'

import { useState, useEffect } from 'react'

export default function BookModal({ isOpen, onClose, onSuccess, book = null }) {
  const isEditing = !!book
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    pdf_url: '',
  })

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        description: book.description || '',
        pdf_url: book.pdf_url || '',
      })
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        description: '',
        pdf_url: '',
      })
    }
    setError('')
    setSuccess('')
  }, [book, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('body-locked')
    } else {
      document.body.classList.remove('body-locked')
    }
    return () => document.body.classList.remove('body-locked')
  }, [isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

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

      setSuccess(isEditing ? 'Book updated successfully!' : 'Book submitted successfully!')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="ms-modal" style={{ display: 'block' }}>
      <button
        className="ms-modal__x"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
      <h2 className="ms-modal__title">{isEditing ? 'Edit Book' : 'Submit a Book'}</h2>
      <p className="ms-modal__body">
        {isEditing ? 'Update the book details below.' : 'Share a title with the ArkLib community.'}
      </p>

      {error && <div className="ms-flash ms-flash--err">{error}</div>}
      {success && <div className="ms-flash ms-flash--ok">{success}</div>}

      <form className="ms-form" onSubmit={handleSubmit}>
        <div className="ms-field">
          <label htmlFor="bkTitle">
            Book Title <span>*</span>
          </label>
          <input
            type="text"
            id="bkTitle"
            name="title"
            placeholder="e.g. The Alchemist"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={255}
          />
        </div>

        <div className="ms-field">
          <label htmlFor="bkAuthor">
            Author <span>*</span>
          </label>
          <input
            type="text"
            id="bkAuthor"
            name="author"
            placeholder="e.g. Paulo Coelho"
            value={formData.author}
            onChange={handleChange}
            required
            maxLength={255}
          />
        </div>

        <div className="ms-field">
          <label htmlFor="bkGenre">Genre</label>
          <select
            id="bkGenre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          >
            <option value="">— Select genre —</option>
            <option>Classic</option>
            <option>Romance</option>
            <option>Sci-Fi</option>
            <option>Dystopia</option>
            <option>Adventure</option>
            <option>Fantasy</option>
            <option>Mystery</option>
            <option>Non-Fiction</option>
            <option>Historical Fiction</option>
            <option>Other</option>
          </select>
        </div>

        <div className="ms-field">
          <label htmlFor="bkDesc">Short Description</label>
          <textarea
            id="bkDesc"
            name="description"
            rows={3}
            placeholder="What is this book about?"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="ms-field">
          <label htmlFor="bkPdf">Book Link (URL)</label>
          <input
            type="text"
            id="bkPdf"
            name="pdf_url"
            placeholder="e.g. https://www.gutenberg.org/ebooks/1234"
            value={formData.pdf_url}
            onChange={handleChange}
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          className="ms-submit-btn"
          disabled={loading}
        >
          {loading
            ? (isEditing ? 'Saving...' : 'Submitting...')
            : (isEditing ? 'Save Changes' : 'Submit Book')}
        </button>
      </form>
    </div>
  )
}
