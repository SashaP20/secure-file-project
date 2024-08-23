import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lykptypiymhjcfbqcmrr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a3B0eXBpeW1oamNmYnFjbXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMzk0MDUsImV4cCI6MjAzOTkxNTQwNX0.eBphLPTpNqe6ZW75WJBoJnQIMd58QJyl_yB4_ExnwzU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
