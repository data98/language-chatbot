# 📄 PRD — Text-Only AI Language Practice MVP (with localStorage) called "Language Coach"

## 1. Overview

**Product:** Text-only AI language practice web app
**Framework:** Next.js (App Router)
**Persistence:** `localStorage` (client-side only)
**Backend storage:** None

### Purpose

Enable short, focused language practice loops with immediate correction and guided repetition, while preserving session continuity across page reloads.

---

## 2. What localStorage is used for (explicit)

`localStorage` is used **only** for:

1. Session setup

   * native language
   * target language
   * difficulty
   * scenario

2. Current practice state

   * last prompt
   * last user answer
   * last AI feedback

3. Optional history (very limited)

   * last N (e.g. 5–10) interactions

### What is NOT stored

* No user identity
* No long-term progress
* No scoring
* No analytics
* No timestamps needed for logic

---

## 3. Updated User Flow

### First visit

1. User selects session setup
2. Data saved to `localStorage`
3. First task is generated

### Refresh / return

1. App checks `localStorage`
2. If session exists:

   * restore last prompt + feedback
   * allow user to continue
3. Option to **“Reset session”** (clears storage)

---

## 4. Functional Requirements (Updated)

### UI

* Single-page app
* Reset session button
* Subtle “Session restored” indicator (optional)
* No onboarding screens beyond setup form

### Client State Logic

* On load:

  * hydrate state from `localStorage`
* On change:

  * sync state → `localStorage`
* On reset:

  * clear keys and restart flow

---

## 5. localStorage Schema (simple & explicit)

```ts
language_practice_session = {
  nativeLanguage: string,
  targetLanguage: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  scenario: string,
  currentPrompt: string | null,
  lastAnswer: string | null,
  lastFeedback: {
    corrected: string,
    explanation: string,
    alternatives: string[],
    next_prompt: string
  } | null,
  history: Array<{
    prompt: string,
    answer: string,
    corrected: string
  }>
}
```

> History length should be capped (e.g. last 5 items).

---

## 6. API Contract (unchanged)

```json
{
  "corrected": "string",
  "explanation": "string",
  "alternatives": ["string", "string"],
  "next_prompt": "string"
}
```

---

## 7. UX Rules (Reinforced)

* User never feels “logged in”
* Everything feels disposable
* Reset is always easy
* App must still fully work with empty storage

---

## 8. Success Criteria (Updated)

* User can refresh and continue seamlessly
* User understands corrections immediately
* App feels lightweight and non-committal