import { NextResponse } from 'next/server'
import db from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/auth'

export async function POST(request) {
  try {
    const { username, email, password, confirmPassword } = await request.json()

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = db.findUserByEmailOrUsername(email, username)

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = db.createUser(username, email, hashedPassword)
    console.log('[v0] User created:', user.email, 'Total users:', globalThis.__dbStore?.users?.length)

    // Create session
    await createSession(user.id, user.username)

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: { id: user.id, username: user.username }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
