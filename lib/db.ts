import { Pool } from 'pg';

// Database connection pool
// Make sure to create .env.local with these variables:
// DATABASE_HOST=localhost
// DATABASE_PORT=5432
// DATABASE_NAME=myonlineresume
// DATABASE_USER=postgres
// DATABASE_PASSWORD=admin

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'myonlineresume',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'admin',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
