-- Page text for the portfolio. Each row is one piece of copy on one page.
create table if not exists public.page_content (
  id bigint generated always as identity primary key,
  page text not null,
  key text not null,
  value text not null,
  updated_at timestamptz not null default now(),
  unique (page, key)
);

alter table public.page_content enable row level security;

-- Visitors can read; only a logged-in admin can change it.
create policy "Anyone can read page content" on public.page_content
  for select using (true);
create policy "Admins can manage page content" on public.page_content
  for all to authenticated using (true) with check (true);

insert into public.page_content (page, key, value) values
  ('home', 'welcome', 'Welcome to my'),
  ('home', 'script', 'Portfolio'),
  ('home', 'reelTitle', 'Pick a reel'),
  ('home', 'reelHint', 'Hover a ticket to preview it on the TV. Each one opens its own page of projects.'),
  ('home', 'btsTitle', 'Behind the scenes'),
  ('home', 'btsLead', 'A former gymnast turned UX/UI designer, event planner, and creative. I love turning ideas into experiences and stories into something people can feel.'),
  ('home', 'btsBody', 'Before screens there was the gym floor. I grew up in rhythmic gymnastics and still coach it at Wadi Degla Club. Every routine is a story with a beginning, a middle and a landing, and I design the same way.'),
  ('home', 'kitTitle', 'The kit'),
  ('home', 'kitLead', 'The software I design, build and edit with.'),
  ('home', 'creditsTitle', 'End Credits.'),
  ('home', 'producedBy', 'Lamar Shehab'),
  ('home', 'location', 'Cairo, Egypt'),
  ('home', 'email', 'Lamarshehab01@gmail.com')
on conflict (page, key) do update set value = excluded.value, updated_at = now();
