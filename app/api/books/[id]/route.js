import { NextResponse } from 'next/server'
import sql from '@/lib/db'
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
    const existing = await sql`
      SELECT id FROM books WHERE id = ${id} AND user_id = ${session.userId}
    `

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Book not found or unauthorized' },
        { status: 404 }
      )
    }

    const result = await sql`
      UPDATE books 
      SET book_name = ${book_name}, 
          author = ${author}, 
          genre = ${genre || null}, 
          description = ${description || null}, 
          cover_url = ${cover_url || null}
      WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: 'Book updated successfully',
      book: result[0]
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
    const result = await sql`
      DELETE FROM books 
      WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING id
    `

    if (result.length === 0) {
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
