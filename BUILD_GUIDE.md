# Build Guide — Shikkha

Follow these steps in order. Total setup time: roughly 30-45 minutes.

---

## 1. Prerequisites

- **Android Studio** — any recent stable release (2024.2+). It bundles JDK 17.
- An Android device or emulator running **Android 8.0 (API 26) or newer**.
- A free **Supabase** account at https://supabase.com.
- Basic familiarity with Kotlin and Android Studio is assumed.

## 2. Open the project

1. Unzip the project folder anywhere.
2. Open Android Studio → **Open** → select the `Shikkha` folder.
3. Let Gradle sync. Android Studio downloads Gradle 8.9 automatically
   (the wrapper properties file is included; if prompted to generate the wrapper
   JAR, accept — or run `gradle wrapper --gradle-version 8.9` once).
4. Sync should succeed with the pinned toolchain:
   AGP 8.7.3, Kotlin 2.1.20, KSP 2.1.20-1.0.31, Compose BOM 2024.12.01,
   supabase-kt 3.2.6. If you intentionally upgrade versions, do one jump at a time
   and rebuild (see "Upgrading the toolchain" below).

## 3. Create the Supabase project

1. Supabase dashboard → **New project** (choose a region close to Bangladesh,
   e.g. Singapore/Mumbai if offered).
2. Wait for provisioning. Note the **Project URL** and **anon public key**
   (Settings → API).
3. **Authentication → Providers**: enable Email.
4. **Authentication → Sign In / Providers → Email**: for development, turn
   **OFF** "Confirm email" so accounts work immediately. Turn it back on before
   any real release.

## 4. Create the database schema

Open **SQL Editor → New query**, paste each migration **in order**, run it, and
confirm success before the next:

1. `supabase/migrations/0001_extensions_and_helpers.sql`
2. `supabase/migrations/0002_core_schema.sql`
3. `supabase/migrations/0003_rls_policies.sql`
4. `supabase/seed/seed_data.sql` (demo content — run once)
5. `supabase/seed/seed_cq.sql` (demo creative questions — run after step 4; safe to re-run)

To re-run the seed cleanly, delete demo MCQs first:
`delete from mcqs where source = 'seed-demo';` then re-run the seed file.

## 5. Connect the app

Create or edit the project-root `local.properties` file (this file is ignored by Git and should stay on your computer). Keep any existing `sdk.dir` entry, and add:

```properties
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_ANON_KEY=YOUR-SUPABASE-PUBLISHABLE-OR-ANON-KEY
```

Use only the Supabase publishable/anon key in the Android app. It is expected to be visible in a client application, so protect your data with correctly configured Row Level Security (RLS). **Never** put a Supabase `service_role`/secret key in the app or in GitHub.

## 6. Create test accounts

For local testing only, create test users in the Supabase dashboard → **Authentication → Users → Add user**. These are example credentials; do not reuse them for real accounts or production users:

| Email | Password | Purpose |
|---|---|---|
| `admin@example.com` | `Admin#12345` | Administrator (tester) |
| `student@example.com` | `Student#123` | Approved student |
| `pending@example.com` | `Student#123` | Pending student |

Then, in the SQL editor, promote the admin and approve the student **(the
admin-approval path of Spec §2.2 / §14.2)**:

```sql
-- 1. Make admin@example.com an administrator (Spec 2.7: trusted process only).
update public.profiles
set role = 'admin', approval_status = 'approved'
where id = (select id from auth.users where email = 'admin@example.com');

-- 2. Approve the student through the audited admin function.
select public.admin_set_approval(
    (select id from auth.users where email = 'student@example.com'),
    'approved'
);

-- Leave pending@example.com untouched: it stays in the pending queue.
```

Verify the audit trail was written (service role only — dashboard SQL editor uses
it):

```sql
select action, target_id, created_at from public.audit_logs order by created_at desc;
```

## 7. Run the app

1. Select a device/emulator (API 26+).
2. **Run ▶**. The app builds, installs, and opens.
3. Expected flows:
   - `student@example.com` → lands on the dashboard → Subjects → Class 6
     Mathematics → a chapter → **Start practice**.
   - `pending@example.com` → the restricted **Pending Approval** screen; only
     "Check status" and "Sign out" are available.
   - `admin@example.com` → same student UI (admin console is Phase 9).
   - Chapter → **Creative questions** → tap a question → **Show model answer**.
   - Answer a few MCQs wrongly, then dashboard → **Mistake Review** → **Practice these
     mistakes**. Answering one correctly removes it from the list.

## 8. Verify offline behavior

1. Start a practice session with connectivity, answer a few questions.
2. Enable airplane mode, finish the session → the attempt is queued locally.
3. Reconnect, then the queued bundle syncs on the next attempt (a WorkManager
   poller wiring `McqRepository.syncQueuedAttempts()` is the planned upgrade).

---

## Troubleshooting

| Symptom | Likely fix |
|---|---|
| Sync fails: "Unsupported class file major version" | Studio is using an old embedded JDK. Set Gradle JDK to 17+ (Settings → Build Tools → Gradle). |
| `Could not resolve io.github.jan-tennert...` | Check network; confirm the version exists on Maven Central. The pinned supabase-kt 3.2.6 pairs with Kotlin 2.1.x. |
| `Duplicate class` in kotlinx / metadata errors | You bumped one version without the others. Use the catalog and bump Kotlin + KSP + Compose compiler together. |
| App shows "Sign-in failed" for correct credentials | Check SUPABASE_URL/ANON_KEY; confirm the user exists and email confirmation is off (dev). |
| Empty subject list after login | Re-run step 4; confirm the student's profile class/medium match seeded rows (class 6, bangla or english). |
| `new row violates row-level security policy` on register | Migration 0003 not applied, or reordered. Apply 0001→0002→0003 exactly. |
| `403` on question load | Seed not run, or no published MCQs for that chapter. |

## Upgrading the toolchain

The pinned versions are a known-good set. As of late 2026 the current stable
line is AGP 9.x with Kotlin 2.4.x, KSP versioned independently (2.3.x),
Compose BOM 2026.09.00+, compileSdk 37 — supabase-kt is at 3.9.0 (minSdk 26
still applies). Upgrade in this order: Kotlin + KSP first (build green), then
AGP (run the AGP Upgrade Assistant), then the Compose BOM, then libraries.
Do not jump supabase-kt across majors without checking its changelog.

## What to build next

Follow the phases in [docs/FEATURE_STATUS.md](docs/FEATURE_STATUS.md). Phase 3
is now feature-complete except bookmarks/reports and CQ writing practice; Phase 4
(exams with server-side scoring) is the natural next slice.
