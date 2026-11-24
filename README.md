# Lamar · Portfolio

My film-themed portfolio website, built with **Create React App** and **Supabase**.

## Run it

```bash
npm install
npm start        # http://localhost:3000
npm run build    # production build in /build
```

## Supabase

The site reads page text from Supabase (table `page_content`). Until the keys are added it shows its built-in copy.

1. Copy `.env.example` to `.env.local`.
2. Paste your project URL and anon key (Supabase > Project Settings > API).
3. Run `supabase/page_content.sql` in the Supabase SQL editor.
4. Restart `npm start`.

## Pages

| Page | Status |
| --- | --- |
| Preloader (clapperboard) | Done |
| Home (horizontal film reel) | Done |
| About, All Projects, Categories, Project Details, Case Study, Contact, CV, FAQ, Thank You, 404 | Next |

The Home page scrolls sideways like a film reel on desktop and stacks vertically on tablet and mobile.
