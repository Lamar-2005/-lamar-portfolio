import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Until the keys are added to .env.local, supabase is null and the site uses its local content.
export const supabase = url && key ? createClient(url, key) : null;
