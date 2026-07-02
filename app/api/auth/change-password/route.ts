import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendPasswordChangedEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const { userId, currentPassword, newPassword } = await request.json();

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const secretResult = await pool.query(
      'SELECT s."PassHash", u."FirstName", u."Email" FROM "Secret" s JOIN "Users" u ON u."Id" = s."UserId" WHERE s."UserId" = $1',
      [userId]
    );

    if (secretResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    const { PassHash, FirstName, Email } = secretResult.rows[0];

    const isValid = await bcrypt.compare(currentPassword, PassHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      'UPDATE "Secret" SET "PassHash" = $1, "UpdatedAt" = CURRENT_TIMESTAMP WHERE "UserId" = $2',
      [newHash, userId]
    );

    await sendPasswordChangedEmail(Email, FirstName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
