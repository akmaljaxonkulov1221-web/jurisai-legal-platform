// Mock Supabase client for development/testing
// This provides fallback when Supabase is not configured

export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          gte: () => ({
            in: () => Promise.resolve({ data: [], error: null })
          })
        })
      })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null })
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null })
    })
  }
}

export default supabase
