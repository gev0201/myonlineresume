import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const result = await pool.query(
      `SELECT pl."Id", pl."LanguageId", pl."LevelId", 
              ld."Language", ll."Level"
       FROM "ProfileLanguages" pl
       JOIN "LanguageDicts" ld ON pl."LanguageId" = ld."Id"
       JOIN "LanguageLevelDict" ll ON pl."LevelId" = ll."Id"
       WHERE pl."UserId" = $1
       ORDER BY pl."Id" ASC`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      languages: result.rows,
    });
  } catch (error) {
    console.error("Error fetching profile languages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile languages" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { languages } = await request.json();

    // Validate max 6 languages
    if (languages.length > 6) {
      return NextResponse.json(
        { success: false, error: "Maximum 6 languages allowed" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Delete existing languages for this user
      await client.query(
        'DELETE FROM "ProfileLanguages" WHERE "UserId" = $1',
        [userId]
      );

      // Insert new languages
      for (const lang of languages) {
        await client.query(
          `INSERT INTO "ProfileLanguages" ("UserId", "LanguageId", "LevelId")
           VALUES ($1, $2, $3)`,
          [userId, lang.LanguageId, lang.LevelId]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Languages updated successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating profile languages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile languages" },
      { status: 500 }
    );
  }
}
