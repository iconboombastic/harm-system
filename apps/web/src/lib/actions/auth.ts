'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
// Optional: import validators from shared if available
// import { LoginSchema, RegisterSchema } from '@harm/shared/src/validators';

const LoginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

const RegisterSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = LoginSchema.safeParse({ email, password });
  
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: 'Email atau kata sandi salah.' };
  }

  redirect('/command-center');
}

export async function register(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'Kata sandi tidak cocok' };
  }

  const result = RegisterSchema.safeParse({ fullName, email, password });
  
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Profil pengguna akan dibuat oleh trigger Supabase atau webhook
  
  redirect('/login?registered=true');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
