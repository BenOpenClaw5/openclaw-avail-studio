import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      'https://graph.instagram.com/v18.0/oauth/access_token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
          client_secret: process.env.META_APP_SECRET!,
          redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_URI!,
          code,
        }).toString(),
      }
    );

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const userId = tokenData.user_id;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/?error=no_token', request.url));
    }

    // Get user info from Meta
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,name,email&access_token=${accessToken}`
    );

    const userData = await userResponse.json();

    // Store in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('meta_user_id', userId)
      .single();

    if (existingUser) {
      // Update existing user
      await supabase
        .from('users')
        .update({
          access_token: accessToken,
          meta_user_name: userData.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id);
    } else {
      // Create new user
      await supabase
        .from('users')
        .insert({
          meta_user_id: userId,
          meta_user_name: userData.name,
          access_token: accessToken,
          created_at: new Date().toISOString(),
        });
    }

    // Set secure httpOnly cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set('meta_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
