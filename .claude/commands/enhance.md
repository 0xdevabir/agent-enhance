Your job is to rewrite the following messy/vague prompt into a structured, detailed, production-quality prompt that will get dramatically better results from any AI coding agent.

**Original prompt:** $ARGUMENTS

---

**Step 1 — Scan the project silently:**
- Read `package.json` → detect frameworks, language, ORM, testing tools, UI library
- Check for `tsconfig.json` → note path aliases
- Scan folder structure → note `app/` vs `pages/` (Next.js router), `src/`, `components/`, `lib/`, `hooks/`
- Read 1-2 existing files most relevant to the prompt topic (for pattern/convention reference)

**Step 2 — Understand the intent:**
- What is the user actually trying to build/fix/refactor?
- What entity is involved? (page, component, API, hook, util)
- What feature domain? (auth, payment, dashboard, upload, etc.)

**Step 3 — Output the enhanced prompt in this exact format:**

---
## ✦ Enhanced Prompt

**Context:**
[Project stack, folder conventions, existing patterns found]

**Task:**
[Rewrite the original request as a clear, specific, unambiguous instruction]

**Requirements:**
[8-15 specific requirements based on detected stack + task domain:]
- Language/type safety (TypeScript, Zod, no `any`)
- Framework rules (App Router, server components, next/navigation, etc.)
- UI/styling (Tailwind, shadcn components)
- Security if relevant (auth → bcrypt, httpOnly; API → input validation)
- Code quality (match existing conventions, reuse utils, no unnecessary deps)
- Output rule: list every file created/modified at the end

**Relevant existing code:**
[1-2 file snippets for reference, or "no relevant files found"]

---

**Step 4 — Ask the user:**
> Does this look right? Reply **yes** to execute, **no** to refine, or edit any part of the prompt above.

---

**Step 5 — Handle the response:**

If the user says **yes** → execute the enhanced prompt exactly as written above.

If the user says **no** or gives feedback → do all of the following:
1. Ask: "What's missing or wrong? (e.g. wrong framework assumed, missing requirement, task unclear)"
2. Wait for their answer
3. Revise the enhanced prompt incorporating their feedback
4. Show the updated prompt in the same format above
5. Ask again: "Better? Reply yes to execute or no to keep refining."
6. Repeat this loop until the user says yes.

If the user edits specific parts of the prompt → accept their edits, merge with the enhanced version, confirm, then execute.

The goal: never execute until the user is satisfied with the enhanced prompt.
