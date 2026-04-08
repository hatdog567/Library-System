import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { book_name, author, genre, description, cover_url } = await request.json()

    // Validation
    if (!book_name || !author) {
      return NextResponse.json(
        { error: 'Book name and author are required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existing = db.getBookById(id, session.userId)

    if (!existing) {
      return NextResponse.json(
        { error: 'Book not found or unauthorized' },
        { status: 404 }
      )
    }

    const book = db.updateBook(id, session.userId, {
      book_name,
      author,
      genre,
      description,
      cover_url
    })

    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
      book
    })

  } catch (error) {
    console.error('Update book error:', error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership and delete
    const deleted = db.deleteBook(id, session.userId)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Book not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully'
    })

  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
