import { formatDynamicAPIAccesses } from "@/node_modules/next/dist/server/app-render/dynamic-rendering";
import { createClient } from 
    '@supabase/supabase-js'
export const supabase = createClient (
    process.env.NEXT_PUBLIC_SUPABASE_URL !,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)