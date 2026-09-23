import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW() as current_time');
    
    // Test if Users table exists
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('Users', 'Secret', 'Profiles')
    `);
    
    const tables = tableCheck.rows.map(row => row.table_name);
    
    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: true,
        currentTime: result.rows[0].current_time,
        tables: {
          Users: tables.includes('Users'),
          Secret: tables.includes('Secret'),
          Profiles: tables.includes('Profiles'),
        },
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 503 }
    );
  }
}
