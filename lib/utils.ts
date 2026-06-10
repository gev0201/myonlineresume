import crypto from 'crypto';

/**
 * Generate a unique user URL slug
 * Format: firstname-lastname-id-{unique-hash}
 * Example: armen-petrosyan-123-a3f9c2
 */
export function generateUserUrl(firstName: string, lastName: string, userId: number): string {
  // Normalize names: lowercase, remove special chars, replace spaces with hyphens
  const normalizeString = (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-');          // Replace multiple hyphens with single
  };

  const normalizedFirstName = normalizeString(firstName);
  const normalizedLastName = normalizeString(lastName);

  // Generate a short unique hash based on userId and timestamp
  const uniqueData = `${userId}-${Date.now()}`;
  const hash = crypto
    .createHash('sha256')
    .update(uniqueData)
    .digest('hex')
    .substring(0, 6); // Take first 6 characters

  return `${normalizedFirstName}-${normalizedLastName}-${userId}-${hash}`;
}

/**
 * Check if a user URL already exists in the database
 */
export async function isUserUrlUnique(pool: any, userUrl: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT "UserId" FROM "Profiles" WHERE "UserUrl" = $1',
    [userUrl]
  );
  return result.rows.length === 0;
}
