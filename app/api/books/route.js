import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const books = db.getBooksByUserId(session.userId, search)

    return NextResponse.json({ books })

  } catch (error) {
    console.error('Fetch books error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { book_name, author, genre, description, cover_url } = await request.json()

    // Validation
    if (!book_name || !author) {
      return NextResponse.json(
        { error: 'Book name and author are required' },
        { status: 400 }
      )
    }

    const book = db.createBook(session.userId, {
      book_name,
      author,
      genre,
      description,
      cover_url
    })

    return NextResponse.json({
      success: true,
      message: 'Book added successfully',
      book
    })

  } catch (error) {
    console.error('Add book error:', error)
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    )
  }
}
