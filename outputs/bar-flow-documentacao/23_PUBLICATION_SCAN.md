# Publication scan

Date: 2026-08-05

- Vercel repository: `MarVinRant/Bar-Flow-V1`.
- Production branch: `main`.
- Supabase environment variables are configured for Production and Preview.
- The public domain was still serving the previous deployment during the scan.
- Supabase production has 8 public tables, RLS enabled on all tables, and 3 applied migrations.
- Security advisors returned no alerts.
- Mercado Pago and commercial billing remain frozen for V1.

## Final verification

- Vercel deployment `7c620ad` is Ready in Production.
- The production domain now serves the React/Vinext Bar Flow application instead of the previous static HTML project.
- Public smoke test: HTTP 200, dashboard rendered, and no browser console errors observed.
- Vercel build uses Nitro with the Vercel preset and `.output` configuration.
