#!/bin/bash

# Direct PostgreSQL connection to fix RLS on auth.users
# You'll need your database password from Supabase Dashboard > Settings > Database

echo "Enter your Supabase database password:"
read -s DB_PASSWORD

echo ""
echo "Attempting to disable RLS on auth.users..."

PGPASSWORD="$DB_PASSWORD" psql \
  "postgresql://postgres.xhqwmtzawqfffepcqxwf:$DB_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres" \
  -c "ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;" \
  -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='auth' AND tablename='users';"

if [ $? -eq 0 ]; then
  echo "✅ Success! RLS has been disabled on auth.users"
else
  echo "❌ Failed. You need to contact Supabase Support."
fi
