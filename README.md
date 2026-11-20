# Shikkha (শিক্ষা)

Android learning app for the Bangladesh NCTB curriculum — practice MCQs, browse the
question bank, track mistakes, and build toward exams, competition, and video lessons.

This repository is the **Phase 1-3 foundation** of the master specification: it is a
real, buildable project covering project setup, Supabase auth with admin-approved
registration, curriculum browsing, and MCQ practice with offline caching and result
review. Later phases are tracked in [docs/FEATURE_STATUS.md](docs/FEATURE_STATUS.md).

## Stack

| Layer | Choice |
|---|---|
| Language | Kotlin (JVM 17) |
| UI | Jetpack Compose, Material 3, primary `#1E88E5` |
| Architecture | MVVM + Repository |
| DI | Hilt (KSP) |
| Async | Coroutines + Flow |
| Backend | Supabase (Auth, PostgreSQL, RLS, Storage, Realtime) |
| Local | Room (cache + sync queue), DataStore (settings) |
| Languages | Bangla + English (`values`, `values-bn`) |

## Module map (Spec 19.2)

```
com.shikkha.app
├── core/          network (Supabase client), database (Room), datastore, common UiState
├── auth/          registration, login, pending-approval gate   (Spec §2)
├── dashboard/     student dashboard + PLANNED-feature empty states (Spec §3)
├── curriculum/    subjects → chapters catalog                  (Spec §4)
├── mcq/           practice engine, offline cache, result review (Spec §5)
├── mistakes/      mistake library + retry practice             (Spec §8)
├── cq/            creative-question browser + model answers    (Spec §6)
├── profile/       profile view/edit + practice stats           (Spec §15-lite)
├── settings/      preferences (DataStore)
├── theme/         Material 3 light/dark
└── navigation/    single NavHost, session-driven entry point
```

## Trust boundaries implemented (Spec §22.3)

- Approval status, roles, and ownership are enforced by Postgres RLS policies —
  clients cannot self-approve or read other users' data.
- Profile writes are restricted by **column privileges**: students can never set
  `role` or `approval_status`; admins act only through the audited
  `admin_set_approval()` security-definer function.
- Unpublished questions are invisible (policy filters `status = 'published'`).
- Practice attempt ids are client-generated UUIDs, making retries idempotent.

## Supabase

- `supabase/migrations/` — run in numeric order from the SQL editor.
- `supabase/seed/seed_data.sql` — demo catalog + sample MCQs (`source='seed-demo'`).
  Replace with verified NCTB-aligned content before any release (Spec §4.7).

## Getting started

See [BUILD_GUIDE.md](BUILD_GUIDE.md) — prerequisites, first build, backend setup,
test accounts, and troubleshooting.
