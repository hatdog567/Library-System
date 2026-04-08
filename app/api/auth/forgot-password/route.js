import { NextResponse } from 'next/server'
import db from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { email, newPassword, confirmPassword } = await request.json()

    // Validation
    if (!email || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = db.findUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      )
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    db.updateUserPassword(email, hashedPassword)

    return NextResponse.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Password reset failed. Please try again.' },
      { status: 500 }
    )
  }
}
