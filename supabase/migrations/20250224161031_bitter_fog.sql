/*
  # Initial Schema Setup for Imagitime

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `age_group` (text)
      - `page_count` (int)
      - `preview_image` (text)
      - `created_at` (timestamp)

    - `stories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `template_id` (uuid, references templates)
      - `title` (text)
      - `status` (text)
      - `content` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `shared_links`
      - `id` (uuid, primary key)
      - `story_id` (uuid, references stories)
      - `access_code` (text, null if public)
      - `is_public` (boolean)
      - `views` (int)
      - `created_at` (timestamp)
      - `expires_at` (timestamp, optional)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public access policies for shared stories
*/

-- Create templates table
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  age_group text NOT NULL,
  page_count int NOT NULL DEFAULT 16,
  preview_image text,
  created_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES templates(id),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  content jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shared_links table
CREATE TABLE shared_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  access_code text,
  is_public boolean NOT NULL DEFAULT false,
  views int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

-- Templates policies
CREATE POLICY "Templates are viewable by all users"
  ON templates FOR SELECT
  TO authenticated
  USING (true);

-- Stories policies
CREATE POLICY "Users can create their own stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own stories"
  ON stories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shared links policies
CREATE POLICY "Users can create shared links for their stories"
  ON shared_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE id = story_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view shared links for their stories"
  ON shared_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE id = story_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view public shared links"
  ON shared_links FOR SELECT
  TO anon
  USING (is_public = true);

-- Create function to update stories updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for stories updated_at
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial templates
INSERT INTO templates (title, description, category, age_group, page_count, preview_image) VALUES
  (
    'Space Adventure',
    'An exciting journey through the cosmos where your child becomes an astronaut exploring new worlds.',
    'adventure',
    '5-8',
    24,
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=500'
  ),
  (
    'Magical Forest',
    'A enchanting tale through a mystical forest filled with friendly creatures and magical discoveries.',
    'fantasy',
    '3-6',
    16,
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=500'
  ),
  (
    'Ocean Explorer',
    'Dive deep into an underwater adventure with sea creatures and hidden treasures.',
    'adventure',
    '4-7',
    20,
    'https://images.unsplash.com/photo-1498747946579-bde604cb8f44?auto=format&fit=crop&q=80&w=500'
  );