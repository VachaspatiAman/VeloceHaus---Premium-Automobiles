const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found in environment variables.');
}

// Client for normal operations
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Admin client for operations requiring elevated privileges (bypassing RLS)
const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || supabaseKey || '');

module.exports = { supabase, supabaseAdmin };
