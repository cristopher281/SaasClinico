@echo off
git add client/package.json client/package-lock.json client/tailwind.config.ts client/postcss.config.mjs
git commit -m "chore(frontend): setup tailwind css and ui foundation"
git add client/src/app/globals.css client/src/app/layout.tsx
git commit -m "feat(frontend): setup typography and global design tokens"
git add client/src/app/login/
git commit -m "feat(frontend): add premium login interface"
git add client/src/app/app/layout.tsx client/src/app/app/page.tsx
git commit -m "feat(frontend): add shell dashboard layout and overview"
git add client/src/app/app/patients/
git commit -m "feat(frontend): add patients directory module"
git add client/src/app/app/doctor/
git commit -m "feat(frontend): add split-view doctor console module"
git add client/src/app/app/calendar/
git commit -m "feat(frontend): add smart calendar module"
git push origin main
