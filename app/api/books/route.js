import { NextResponse } from 'next/server'
import sql from '@/lib/db'
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

    let books
    if (search) {
      const searchPattern = `%${search}%`
      books = await sql`
        SELECT * FROM books 
        WHERE user_id = ${session.userId}
        AND (
          LOWER(book_name) LIKE LOWER(${searchPattern})
          OR LOWER(author) LIKE LOWER(${searchPattern})
          OR LOWER(genre) LIKE LOWER(${searchPattern})
        )
        ORDER BY created_at DESC
      `
    } else {
      books = await sql`
        SELECT * FROM books 
        WHERE user_id = ${session.userId}
        ORDER BY created_at DESC
      `
    }

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

    const result = await sql`
      INSERT INTO books (user_id, book_name, author, genre, description, cover_url)
      VALUES (${session.userId}, ${book_name}, ${author}, ${genre || null}, ${description || null}, ${cover_url || null})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: 'Book added successfully',
      book: result[0]
    })

  } catch (error) {
    console.error('Add book error:', error)
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    )
  }
}
