import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, getUserById } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json({ user: null });
    }

    const user = await getUserById(decoded.userId);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}