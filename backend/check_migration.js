const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://brnomtstkukqfqjiqsti.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybm9tdHN0a3VrcWZxamlxc3RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY2NTg0MiwiZXhwIjoyMDk0MjQxODQyfQ.NOh1YHoDGu0tFiraktC3Q2YIm0DEGQml7X2y4hrvL78'
);

// We add each column one at a time by attempting to insert a dummy row
// and reading what columns exist first
async function run() {
  // Check current columns
  const { data, error } = await client.from('vehicles').select('*').limit(1);
  
  if (error) {
    console.error('Error fetching vehicles:', error.message);
    return;
  }

  const existingCols = data && data[0] ? Object.keys(data[0]) : [];
  console.log('Existing columns:', existingCols.join(', '));

  const newCols = ['engine', 'transmission', 'horsepower', 'torque', 'mileage', 'seats', 'top_speed', 'warranty', 'color_variants'];
  const missing = newCols.filter(c => !existingCols.includes(c));

  if (missing.length === 0) {
    console.log('All columns already exist! No migration needed.');
    return;
  }

  console.log('Missing columns:', missing.join(', '));
  console.log('\nThese need to be added via Supabase SQL Editor.');
  console.log('Go to: https://supabase.com/dashboard/project/brnomtstkukqfqjiqsti/sql/new');
  console.log('\nRun this SQL:\n');
  console.log('ALTER TABLE public.vehicles');
  missing.forEach((col, i) => {
    const isLast = i === missing.length - 1;
    let def = 'TEXT';
    if (col === 'horsepower' || col === 'top_speed') def = 'INTEGER';
    if (col === 'seats') def = 'INTEGER DEFAULT 5';
    if (col === 'color_variants') def = "JSONB DEFAULT '[]'::jsonb";
    console.log(`  ADD COLUMN IF NOT EXISTS ${col.padEnd(16)} ${def}${isLast ? ';' : ','}`);
  });
}

run();
