import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Update auth session
  const response = await updateSession(request);

  // Periksa rute yang dilindungi
  const isPublicRoute = 
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/public-intake') ||
    request.nextUrl.pathname.startsWith('/tracking') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/';

  if (!isPublicRoute) {
    // Kita harus membuat client server independen untuk memeriksa auth karena updateSession hanya menyegarkan
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            // Abaikan set karena sudah ditangani oleh updateSession
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Pengecekan admin khusus untuk path /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Dalam implementasi nyata, ambil profil dan periksa role
      // Misalnya, menggunakan JWT claims jika kita telah mengaturnya:
      // const userRole = user.app_metadata?.role || 'USER';
      // if (userRole !== 'ADMIN' && userRole !== 'ATASAN') return NextResponse.redirect(new URL('/command-center', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
