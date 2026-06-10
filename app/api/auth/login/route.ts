import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const userResult = await pool.query(
      `SELECT u."Id", u."FirstName", u."LastName", u."Email", u."Phone", u."IsActive", s."PassHash", p."UserUrl"
       FROM "Users" u
       LEFT JOIN "Secret" s ON u."Id" = s."UserId"
       LEFT JOIN "Profiles" p ON u."Id" = p."UserId"
       WHERE u."Email" = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Check if account is active
    if (!user.IsActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.PassHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Login successful
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user.Id,
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
          phone: user.Phone,
          userUrl: user.UserUrl,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during login. Please try again.',
      },
      { status: 500 }
    );
  }
}
