import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validateRegistrationForm } from '@/lib/validation';
import { generateUserUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password, confirmPassword } = body;

    // Validate input
    const errors = validateRegistrationForm({
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Check if email already exists
    const emailCheck = await pool.query(
      'SELECT "Id" FROM "Users" WHERE "Email" = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, errors: { email: 'Email already registered' } },
        { status: 400 }
      );
    }

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert user
      const userResult = await client.query(
        `INSERT INTO "Users" ("FirstName", "LastName", "Phone", "Email", "IsActive")
         VALUES ($1, $2, $3, $4, $5)
         RETURNING "Id"`,
        [firstName, lastName, phone, email, true]
      );

      const userId = userResult.rows[0].Id;

      // Hash password
      const saltRounds = 10;
      const passHash = await bcrypt.hash(password, saltRounds);

      // Insert password hash into Secret table
      await client.query(
        `INSERT INTO "Secret" ("UserId", "PassHash")
         VALUES ($1, $2)`,
        [userId, passHash]
      );

      // Generate unique user URL
      const userUrl = generateUserUrl(firstName, lastName, userId);

      // Create profile with UserUrl
      await client.query(
        `INSERT INTO "Profiles" ("UserId", "UserUrl")
         VALUES ($1, $2)`,
        [userId, userUrl]
      );

      await client.query('COMMIT');

      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully',
          userId,
          userUrl,
        },
        { status: 201 }
      );

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during registration. Please try again.',
      },
      { status: 500 }
    );
  }
}
