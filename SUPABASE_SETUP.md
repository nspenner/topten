# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up (free tier available)
2. Create a new project
3. Once created, go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon public key**

## Step 2: Create Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 1.

## Step 3: Create Database Table

In Supabase:

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste this SQL:

```sql
CREATE TABLE game_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  games JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER DEFAULT 0
);

-- Create an index on slug for faster lookups
CREATE INDEX idx_game_lists_slug ON game_lists(slug);
```

4. Click **Run**

## Step 4: Generate a Slug

You'll need a function to generate short, readable slugs. The app includes a utility that creates 6-character slugs like `abc123`.

## Step 5: Test the Connection

Once environment variables are set, the app will automatically initialize Supabase. Check the browser console for any errors.

## Database Schema Reference

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Automatically generated |
| slug | TEXT | Short shareable ID (e.g., `abc123`) |
| title | TEXT | List title |
| author | TEXT | List author |
| games | JSONB | Array of game objects with title, description, url, screenshot |
| created_at | TIMESTAMP | When the list was created |
| view_count | INTEGER | Optional: tracks how many times the list was viewed |

## What Happens Next

- When you save a list, it creates a record in `game_lists` with a unique slug
- Share URLs become: `yoursite.com/share/abc123` instead of long encoded strings
- When someone visits a shared link, the app fetches the data from Supabase by slug
- Much shorter, cleaner URLs!
