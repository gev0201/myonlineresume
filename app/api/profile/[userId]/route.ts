import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Fetch user profile data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const result = await pool.query(
      `SELECT 
        u."Id", u."FirstName", u."LastName", u."Email", u."Phone", u."Address",
        p."UserUrl", p."Summary", p."Experience", p."Education", p."Skills", 
        p."Certificates", p."Hobbies"
       FROM "Users" u
       LEFT JOIN "Profiles" p ON u."Id" = p."UserId"
       WHERE u."Id" = $1 AND u."IsActive" = true`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, profile: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile data
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      summary,
      experience,
      education,
      skills,
      certificates,
      hobbies,
    } = body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update Users table
      await client.query(
        `UPDATE "Users" 
         SET "FirstName" = $1, "LastName" = $2, "Email" = $3, "Phone" = $4, "Address" = $5
         WHERE "Id" = $6`,
        [firstName, lastName, email, phone, address, userId]
      );

      // Update Profiles table
      await client.query(
        `UPDATE "Profiles" 
         SET "Summary" = $1, "Experience" = $2, "Education" = $3, "Skills" = $4, 
             "Certificates" = $5, "Hobbies" = $6
         WHERE "UserId" = $7`,
        [summary, experience, education, skills, certificates, hobbies, userId]
      );

      await client.query('COMMIT');

      return NextResponse.json(
        { success: true, message: 'Profile updated successfully' },
        { status: 200 }
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
