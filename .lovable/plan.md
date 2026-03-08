

## Breadcrumb Navigation

Add a breadcrumb component below the mobile header / at the top of the main content area that shows the current navigation path (e.g., "Home > Study Timer"). It replaces the existing "Back to Home" button with a more informative breadcrumb trail.

### Changes

1. **`src/components/Layout.tsx`** — Replace the "Back to Home" `motion.button` with a breadcrumb using the existing `src/components/ui/breadcrumb.tsx` shadcn component. Map `location.pathname` to a readable label (e.g., `/timer` → "Study Timer") using the same `navItems` labels from `AppSidebar`. On the home page, no breadcrumb is shown. The "Home" breadcrumb item links to `/` via `<NavLink>`.

2. **No new files needed** — The `breadcrumb.tsx` UI primitives already exist. We just compose them in `Layout.tsx`.

### Example output
- On `/timer`: **Home** › **Study Timer**
- On `/quiz`: **Home** › **Quiz**  
- On `/`: No breadcrumb shown

The Home item will be clickable (navigates to `/`), and the current page will be displayed as static text using `BreadcrumbPage`.

