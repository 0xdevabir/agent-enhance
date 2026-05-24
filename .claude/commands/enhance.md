Before executing the task below, perform the following project analysis steps silently (do not narrate them — just do them):

1. Read `package.json` to detect: frameworks (next, react, vue, svelte, express, fastify, hono), styling (tailwindcss, shadcn), ORM (prisma, drizzle, mongoose, typeorm), testing (vitest, jest), language (typescript or javascript)
2. Check for `tsconfig.json` — note path aliases if present
3. Scan top-level folders and `src/` (if present) — note structure, whether `app/` or `pages/` dir exists (Next.js router type), common dirs like `components/`, `lib/`, `hooks/`, `utils/`
4. Based on the detected stack, identify 1-3 existing files most relevant to the task and read them for pattern/convention reference

Then, using everything you discovered, execute this task:

---

**Task:** $ARGUMENTS

---

Apply these rules based on what you detected:

**Always:**
- Match the existing code style, naming conventions, and folder structure you observed
- List every file you create or modify at the end of your response
- Prefer reusing existing utilities over creating new ones
- No unnecessary dependencies

**If TypeScript detected:**
- No `any` — use `unknown` + type guards if needed
- Export all types and interfaces
- Use Zod for validation at external boundaries (API input, form submissions)

**If Next.js App Router detected:**
- Server Components by default — `"use client"` only when browser APIs or interactivity needed
- Use `next/navigation` (not `next/router`)
- Follow file conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`
- Prefer server actions for mutations

**If Next.js Pages Router detected:**
- Use `next/router` for navigation
- Data fetching in `getServerSideProps` or `getStaticProps`

**If React / Next.js detected:**
- Small, focused components
- Extract reusable logic into custom hooks
- Composition over prop drilling
- Accessible: aria labels, keyboard navigation, semantic HTML

**If TailwindCSS detected:**
- Tailwind classes only — no custom CSS unless unavoidable
- Mobile-first: base = mobile, `md:` / `lg:` for larger

**If shadcn/ui detected:**
- Use shadcn components (Button, Input, Dialog, Form, etc.) — import from `@/components/ui/`

**If Prisma detected:**
- Use Prisma client for all DB operations
- Wrap multi-step operations in a transaction

**If the task involves authentication:**
- Never plain-text passwords — use bcrypt or argon2
- httpOnly, Secure cookies for session tokens — never localStorage
- Server-side validation on all inputs
- Note: consider rate limiting on auth endpoints
- CSRF protection on state-changing operations

**If the task involves file upload:**
- Validate file type and size server-side (not just client-side)
- Sanitize filenames before storage
- Prefer presigned URLs for direct-to-storage uploads

**If the task involves an API endpoint:**
- Consistent response shape: `{ data, error }`
- Explicit error handling — no unhandled rejections leaking to client
- Validate all input with Zod before processing
- Correct HTTP status codes

**If the task involves payments:**
- Never log or store raw card data
- Verify webhook signatures server-side
- Use idempotency keys for payment operations
