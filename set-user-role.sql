-- Set owner role for aicustomautomations@gmail.com
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role": "owner"}'::jsonb
where email = 'aicustomautomations@gmail.com';

-- Verify it worked
select
  email,
  raw_app_meta_data->>'role' as role,
  raw_app_meta_data
from auth.users
where email = 'aicustomautomations@gmail.com';
