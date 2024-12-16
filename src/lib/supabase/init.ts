import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uxkycvkibqwqbwbojprv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4a3ljdmtpYnF3cWJ3Ym9qcHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyODY3NjAsImV4cCI6MjA0ODg2Mjc2MH0.xrQZo-pRRuKt7ZuOYSSgKX1OSu9naAwjn2_J7XtjPk4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase