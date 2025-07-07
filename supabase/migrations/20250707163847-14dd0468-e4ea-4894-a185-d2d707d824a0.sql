-- Create storage buckets for images and videos
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('post-videos', 'post-videos', true);

-- Create policies for post images
CREATE POLICY "Anyone can view post images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-images');

CREATE POLICY "VIP users can upload post images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND balance >= 150000
  )
);

CREATE POLICY "Users can update their own post images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own post images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'post-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policies for post videos
CREATE POLICY "Anyone can view post videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-videos');

CREATE POLICY "VIP users can upload post videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'post-videos' 
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND balance >= 150000
  )
);

CREATE POLICY "Users can update their own post videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'post-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own post videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'post-videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);