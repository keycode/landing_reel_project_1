import { createSupabaseClient } from '../../lib/supabase-server'

export async function GET({ request, cookies }: any) {
  const supabase = createSupabaseClient(cookies)
  
  // Example of how to fetch project status
  // const { data, error } = await supabase.from('projects').select('is_premium, published_at').eq('id', 'some-id').single()

  return new Response(JSON.stringify({ status: 'ok' }), { status: 200 })
}
