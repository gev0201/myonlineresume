import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Since we're using localStorage for session management,
    // the actual logout happens on the client side
    // This endpoint can be used for server-side cleanup if needed in the future
    
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during logout.',
      },
      { status: 500 }
    );
  }
}
