import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whqlhefjfwcpmtjzyxxf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocWxoZWZqZndjcG10anp5eHhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY2NDg3OCwiZXhwIjoyMDYzMjQwODc4fQ.wZ4kUELHTdv5YiaNUcLvk6Vv2KRSkZNxd_Df_jm6AnI';

export const supabase = createClient(supabaseUrl, supabaseKey); 