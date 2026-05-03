-- Create projects table (LandingReels)
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE,
  is_premium boolean DEFAULT false NOT NULL,
  published_at timestamp with time zone,
  phone_number text, -- optional for WhatsApp
  content jsonb DEFAULT '{}'::jsonb, -- to store the editor blocks
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (published_at IS NOT NULL);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger for projects
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_project_update
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Note to @integrator: Configure Database Webhooks in Supabase UI or using another trigger here,
-- pointing to the n8n webhook URL whenever an INSERT or UPDATE happens on public.projects
