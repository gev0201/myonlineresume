import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendPasswordResetEmail } from '@/lib/mailer';

function generateTempPassword(length = 10): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const userResult = await pool.query(
      'SELECT "Id", "FirstName", "Email" FROM "Users" WHERE "Email" = $1',
      [email.toLowerCase().trim()]
    );

    // Always return success to avoid email enumeration
    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: true });
    }

    const user = userResult.rows[0];
    const tempPassword = generateTempPassword();
    const hash = await bcrypt.hash(tempPassword, 12);

    await pool.query(
      'UPDATE "Secret" SET "PassHash" = $1, "UpdatedAt" = CURRENT_TIMESTAMP WHERE "UserId" = $2',
      [hash, user.Id]
    );

    await sendPasswordResetEmail(user.Email, user.FirstName, tempPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
