import { createServerClient } from '@supabase/ssr'
import type { AstroCookies } from 'astro'

export function createSupabaseClient(cookies: AstroCookies) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return Object.keys(cookies).map((name) => ({
            name,
            value: cookies.get(name)?.value ?? '',
          }))
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (value === '') {
                 cookies.delete(name, options)
              } else {
                 cookies.set(name, value, options)
              }
            })
          } catch {
            // Ignored on SSR
          }
        },
      },
    }
  )
}
