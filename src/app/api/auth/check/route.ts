import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('meta_access_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify token is still valid with Meta
    const response = await fetch(
      `https://graph.instagram.com/debug_token?input_token=${token}&access_token=${token}`
    );

    if (!response.ok) {
      // Token is invalid, clear it
      const res = NextResponse.json({ authenticated: false }, { status: 401 });
      res.cookies.delete('meta_access_token');
      return res;
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
