const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', {
    url: supabaseUrl ? 'set' : 'MISSING',
    key: supabaseKey ? 'set' : 'MISSING'
  });
  throw new Error('Supabase credentials not configured. Check environment variables.');
}

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (err) {
  console.error('Failed to initialize Supabase client:', err.message);
  throw err;
}

module.exports = supabase;
