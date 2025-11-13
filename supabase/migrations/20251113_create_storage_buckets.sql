-- Create storage buckets for RAG documents and image edits
-- Required for KBUploadCard.tsx and image analytics

-- Create kb-uploads bucket for RAG document storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kb-uploads',
  'kb-uploads',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Create image-edits bucket for image analytics storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'image-edits',
  'image-edits',
  true,
  52428800, -- 50MB limit for images
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for kb-uploads bucket
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload kb documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kb-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read all kb documents (for RAG retrieval)
CREATE POLICY "Users can read kb documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'kb-uploads');

-- Allow users to delete their own kb documents
CREATE POLICY "Users can delete own kb documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'kb-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for image-edits bucket
-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload image edits"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'image-edits' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own image edits
CREATE POLICY "Users can read own image edits"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'image-edits' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own image edits
CREATE POLICY "Users can delete own image edits"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'image-edits' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access for image-edits (for sharing URLs)
CREATE POLICY "Public can view image edits"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'image-edits');
