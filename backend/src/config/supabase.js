const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('[Supabase Config] Checking credentials:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING',
  key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING'
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Supabase credentials missing: url=${!supabaseUrl}, key=${!supabaseKey}`);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
