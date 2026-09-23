import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validateRegistrationForm } from '@/lib/validation';
import { generateUserUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password, confirmPassword } = body;

    // Log incoming request for debugging (without password)
    console.log('Registration attempt:', {
      firstName,
      lastName,
      email,
      phone: phone ? `${phone.substring(0, 4)}...` : 'missing',
      hasPassword: !!password,
      hasConfirmPassword: !!confirmPassword,
    });

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
      console.log('Validation errors:', errors);
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

    // Check if phone already exists
    const phoneCheck = await pool.query(
      'SELECT "Id" FROM "Users" WHERE "Phone" = $1',
      [phone]
    );

    if (phoneCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, errors: { phone: 'Phone number already registered' } },
        { status: 400 }
      );
    }

    // Start transaction
    let client;
    try {
      client = await pool.connect();
      console.log('Database connection acquired');
    } catch (dbConnError) {
      console.error('Failed to connect to database:', dbConnError);
      return NextResponse.json(
        {
          success: false,
          message: 'Database connection error. Please try again later.',
        },
        { status: 503 }
      );
    }
    
    try {
      await client.query('BEGIN');
      console.log('Transaction started');

      // Insert user
      console.log('Inserting user into Users table...');
      const userResult = await client.query(
        `INSERT INTO "Users" ("FirstName", "LastName", "Phone", "Email", "IsActive")
         VALUES ($1, $2, $3, $4, $5)
         RETURNING "Id"`,
        [firstName, lastName, phone, email, true]
      );

      const userId = userResult.rows[0].Id;
      console.log('User created with ID:', userId);

      // Hash password
      console.log('Hashing password...');
      const saltRounds = 10;
      const passHash = await bcrypt.hash(password, saltRounds);

      // Insert password hash into Secret table
      console.log('Inserting password hash into Secret table...');
      await client.query(
        `INSERT INTO "Secret" ("UserId", "PassHash")
         VALUES ($1, $2)`,
        [userId, passHash]
      );

      // Generate unique user URL
      const userUrl = generateUserUrl(firstName, lastName, userId);
      console.log('Generated user URL:', userUrl);

      // Create profile with UserUrl
      console.log('Creating profile...');
      await client.query(
        `INSERT INTO "Profiles" ("UserId", "UserUrl")
         VALUES ($1, $2)`,
        [userId, userUrl]
      );

      await client.query('COMMIT');
      console.log('Transaction committed successfully');

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
    
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check for specific database errors
    let errorMessage = 'An error occurred during registration. Please try again.';
    let errorDetails = {};
    
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as any;
      console.error('Database error code:', dbError.code);
      console.error('Database error detail:', dbError.detail);
      
      // PostgreSQL error codes
      if (dbError.code === '23505') {
        // Unique violation
        errorMessage = 'A user with this email or phone already exists.';
        if (dbError.constraint?.includes('email')) {
          errorDetails = { email: 'Email already registered' };
        } else if (dbError.constraint?.includes('phone')) {
          errorDetails = { phone: 'Phone number already registered' };
        }
      } else if (dbError.code === '23503') {
        // Foreign key violation
        errorMessage = 'Database constraint error. Please contact support.';
      } else if (dbError.code === '42P01') {
        // Undefined table
        errorMessage = 'Database configuration error. Please contact support.';
      } else if (dbError.code === '42703') {
        // Undefined column
        errorMessage = 'Database schema error. Please contact support.';
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        ...(Object.keys(errorDetails).length > 0 && { errors: errorDetails }),
      },
      { status: 500 }
    );
  }
}
