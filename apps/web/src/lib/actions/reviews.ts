'use server'

import { createClient } from '@/lib/supabase/server'

export async function getReviews(caseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('case_reviews')
    .select('*, reviewer:reviewer_id(name, email), threads:review_threads(*, author:author_id(name, email))')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function createReview(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: review, error } = await supabase
    .from('case_reviews')
    .insert({
      ...data,
      reviewer_id: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: review }
}

export async function createThread(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: thread, error } = await supabase
    .from('review_threads')
    .insert({
      ...data,
      author_id: user?.id,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: thread }
}
