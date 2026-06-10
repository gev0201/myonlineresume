import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Fetch all skill levels from SkillsLevelDict
export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(
      `SELECT "Id", "Level" FROM "SkillsLevelDict" ORDER BY "Id"`
    );

    return NextResponse.json(
      { success: true, levels: result.rows },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching skill levels:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch skill levels' },
      { status: 500 }
    );
  }
}
