import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT "Id", "Level" FROM "LanguageLevelDict" ORDER BY "Id" ASC'
    );

    return NextResponse.json({
      success: true,
      levels: result.rows,
    });
  } catch (error) {
    console.error("Error fetching language levels:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch language levels" },
      { status: 500 }
    );
  }
}
