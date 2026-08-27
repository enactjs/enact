---
name: ts-type-fixer
description: Analyzes TypeScript code to identify and provide accurate suggestions for fixing wrong type assignments, unsafe assertions, and any types. Use when the user asks to fix type errors, correct type assignments, or resolve typing issues.
---

# TypeScript Type Fixer

This skill restricts the agent's output strictly to identifying incorrect type assignments and providing accurate, type-safe replacements.

## Core Directive
Do **not** provide general code reviews, architectural feedback, executive summaries, or explanations of correct code. **Only** output actionable fixes for type issues.

## Target Issues
Scan the provided TypeScript code specifically for:
1. **Wrong Type Assignments:** Variables, parameters, or return types assigned an incorrect specific type (e.g., using `String` instead of `string`, or mismatched interface properties).
2. **The `any` Type:** Explicit `any` declarations or implicit `any` fallbacks.
3. **Unsafe Assertions:** Overuse of the `as Type` keyword or non-null assertions (`!`) where proper type narrowing or optional chaining should be used.
4. **Missing Generics:** Functions or components that lose type safety because they lack proper generic constraints.

## Output Format
For every type issue found, output a strict, repeating block using the following structure. Do not deviate from this format.

### Issue: [Brief Name of Type Error]
* **Location:** [File name or function/line number]
* **Current Wrong Type:** `[Snippet of the incorrect typing]`
* **Why it's wrong:** [1-2 sentences explaining the type mismatch or safety risk]
* **Accurate Fix:**
```typescript