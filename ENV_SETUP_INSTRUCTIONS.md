# Environment Setup Instructions

## 1. Create .env.local file

Create a file named `.env.local` in the root of the `myonlineresume` directory with the following content:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=myonlineresume
DATABASE_USER=postgres
DATABASE_PASSWORD=admin
```

## 2. Install Required Dependencies

Run the following command in the `myonlineresume` directory:

```bash
npm install pg @types/pg bcryptjs @types/bcryptjs
```

## 3. Run Database Migration

Execute the SQL script to add the Secret table:

```bash
psql -U postgres -d myonlineresume -f ../DB/add_secret_table.sql
```

Or manually run the SQL file in your PostgreSQL client (pgAdmin, DBeaver, etc.)

## 4. Verify Database Connection

After setting up the environment variables and installing dependencies, start the development server:

```bash
npm run dev
```

You should see "✅ Connected to PostgreSQL database" in the console.

## 5. Test Registration

Navigate to `http://localhost:3000/sign-up` and test the registration form.

## Security Notes

- Never commit `.env.local` to version control
- The `.env.local` file is already in `.gitignore`
- Use strong passwords in production
- Consider using environment-specific configuration for production deployment
