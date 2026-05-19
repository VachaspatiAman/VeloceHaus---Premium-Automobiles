const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found in environment variables.');
}

// Client for normal operations
const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || '',
  {
    auth: {
      persistSession: false
    },
    realtime: {
      transport: WebSocket
    }
  }
);

// Admin client
const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || supabaseKey || '',
  {
    auth: {
      persistSession: false
    },
    realtime: {
      transport: WebSocket
    }
  }
);

module.exports = { supabase, supabaseAdmin };