'use client'

import { BookOpen, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className="book-card bg-card rounded-xl overflow-hidden border border-border shadow-sm">
      {/* Cover Image */}
      <div className="relative aspect-[2/3] bg-gradient-to-br from-wine/10 to-gold/10">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.book_name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-wine/30" />
          </div>
        )}
        
        {/* Genre Badge */}
        {book.genre && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-wine/90 text-white text-xs font-medium rounded">
              {book.genre}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg leading-tight mb-1 line-clamp-2">
          {book.book_name}
        </h3>
        <p className="text-muted-foreground text-sm mb-2">by {book.author}</p>
        
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {book.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <button
            onClick={() => onEdit(book)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-wine hover:bg-wine/10 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
