// xenia-api wraps every response as { status, data, message } — this unwraps .data.
// $fetch already throws on non-2xx, surfacing xenia-api's error message via the thrown FetchError.
export function useXeniaApi() {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()

  return async function xeniaFetch<T>(path: string, opts: Parameters<typeof $fetch>[1] = {}) {
    const { data: { session } } = await supabase.auth.getSession()
    const envelope = await $fetch<{ status: boolean, data: T, message: string }>(path, {
      baseURL: config.public.xeniaApiBase as string,
      headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
      ...opts
    })
    return envelope.data
  }
}
