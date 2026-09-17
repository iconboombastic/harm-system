// ============================================
// HARM Mobile — Auth Store (Zustand)
// ============================================
// Menyimpan state autentikasi pengguna

import { create } from 'zustand'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  name: string
  jabatan: string | null
  unit: string | null
  role: string
  avatar_url: string | null
  phone: string | null
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  isInitialized: boolean

  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        set({ session, user: session.user, isAuthenticated: true })
        await get().fetchProfile()
      }
    } catch (error) {
      console.error('Auth init error:', error)
    } finally {
      set({ isLoading: false, isInitialized: true })
    }

    // Listener perubahan auth
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
      })
      if (session) {
        get().fetchProfile()
      } else {
        set({ profile: null })
      }
    })
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        return { success: false, error: error.message }
      }
      set({ session: data.session, user: data.user, isAuthenticated: true })
      await get().fetchProfile()
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login gagal' }
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null, profile: null, isAuthenticated: false })
  },

  fetchProfile: async () => {
    const user = get().user
    if (!user) return

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      set({ profile: data })
    }
  },
}))
