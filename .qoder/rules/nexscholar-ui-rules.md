---
alwaysApply: true
description: A guide for frontend development in Nexscholar, covering React, Inertia.js, Tailwind CSS, Shadcn UI, component structure, and styling guidelines.
---

# Nexscholar UI Rules (React + Inertia.js + Tailwind + Shadcn UI + Framer Motion)

These rules define how the AI agent should create, update, and maintain the **frontend user interface** for the Nexscholar platform.

---

## 1. Framework & Libraries

-   Use **React 18** with **Inertia.js** for page rendering.
-   Use **Tailwind CSS** for styling. Prefer utility classes over inline styles.
-   Use **Shadcn UI components** (`@/components/ui/*`) as the base for forms, modals, dropdowns, tables, etc.
-   Use **Framer Motion** for animations (page transitions, hover effects, micro-interactions).
-   Do **not** use Next.js or Firebase — they are not part of this system.

---

## 2. Component Structure

-   Place reusable components in `resources/js/Components/`.
-   Place page-level components in `resources/js/Pages/`.
-   Name components in **PascalCase** (`UserProfileCard.jsx`).
-   Each component should be:
    -   Small and composable.
    -   Focused on one responsibility.
    -   Easy to test in isolation.

---

## 3. Styling Guidelines

-   Use Tailwind CSS classes for layout, spacing, typography, and colors.
-   Follow the **design tokens** defined in `tailwind.config.js`.
-   Use responsive utilities (`sm:`, `md:`, `lg:`) for mobile-first design.
-   Do not hardcode colors — always use Tailwind variables.
-   Apply `className` consistently, e.g.:
    ```jsx
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      ...
    </div>
    ```

---

## 4. Shadcn UI Usage

-   Import only what you need, e.g.: `import { Button } from "@/components/ui/button";`
-   Wrap Shadcn UI components with Tailwind classes for platform-specific styles.
-   Extend components in `/components/ui/` instead of duplicating logic.

---

## 5. Animations (Framer Motion)

-   Use `motion.div` wrappers for fade/slide effects.
-   **Default Animations**:
    -   Page transitions: fade-in with slight upward motion.
    -   List items: staggered entry with spring transitions.
    -   Buttons/interactive elements: subtle scale-up on hover.
-   Keep animations performant — avoid blocking reflows.

---

## 6. Forms & Inputs

-   Always use Shadcn form components (`<Input>`, `<Select>`, `<Textarea>`) combined with Tailwind.
-   Validate on both frontend (basic checks) and backend (Laravel validation).
-   Use `react-hook-form` when building complex forms.

---

## 7. State Management

-   Prefer React hooks (`useState`, `useEffect`, `useContext`) over external state libraries.
-   Use Inertia’s `useForm` hook for form submissions.
-   Always handle loading states, success confirmations, and error states with proper UI feedback.

---

## 8. Accessibility

-   All interactive elements must have ARIA labels or descriptive text.
-   Use semantic HTML (`<button>`, `<nav>`, `<section>`) for better screen reader support.
-   Ensure sufficient color contrast (Tailwind’s `dark:` mode must be supported).

---

## 9. Testing & QA

-   Use **Jest + React Testing Library** for component testing.
-   Test:
    -   **Rendering**: Does the component mount?
    -   **Props**: Does it display correct content?
    -   **Interactions**: Does a button click trigger the expected behavior?
-   Avoid snapshot-only tests.

---

## 10. Branching & Commits

-   **Branching**: Place UI changes in a dedicated feature branch: `feat/ui-<short-description>`.
-   **Commit Messages**: Follow the conventional commit format:
    ```
    feat(ui): added Faculty dropdown filtering
    fix(ui): corrected Tailwind responsive breakpoints
    ```