# 🎨 Dark Mode Color Reference Guide

## Quick Reference for Fixing Dark Mode

When updating components, replace hardcoded Tailwind colors with theme-aware classes:

### Backgrounds
| ❌ Old (Hardcoded) | ✅ New (Theme-aware) | Use Case |
|-------------------|---------------------|----------|
| `bg-white` | `bg-background` | Main page background |
| `bg-gray-50` | `bg-card-background` | Card/panel background |
| `bg-gray-100` | `bg-card-background` | Secondary elements |
| `bg-gray-200` | `bg-card-background` | Hover states |

### Text Colors
| ❌ Old (Hardcoded) | ✅ New (Theme-aware) | Use Case |
|-------------------|---------------------|----------|
| `text-gray-900` | `text-text-heading` | Main headings |
| `text-gray-800` | `text-text-heading` | Sub-headings |
| `text-gray-700` | `text-text-body` | Body text |
| `text-gray-600` | `text-text-body` | Descriptions |
| `text-gray-500` | `text-text-muted` | Muted/secondary text |
| `text-gray-400` | `text-text-muted` | Placeholder text |

### Borders
| ❌ Old (Hardcoded) | ✅ New (Theme-aware) | Use Case |
|-------------------|---------------------|----------|
| `border-gray-100` | `border-border` | Light borders |
| `border-gray-200` | `border-border` | Default borders |
| `border-gray-300` | `border-border` | Stronger borders |

### Accent Colors (Keep These!)
These are the same in both themes, so no change needed:
- `bg-primary-accent` ✅ (Blue #3B82F6)
- `bg-secondary-accent` ✅ (Teal #2DD4BF)
- `text-primary-accent` ✅
- `text-secondary-accent` ✅
- `bg-success` ✅ (Green #10b981)
- `bg-warning` ✅ (Orange #f59e0b)
- `bg-error` ✅ (Red #ef4444)

## Pages Needing Fixes

### ✅ Already Fixed:
- [x] EmailPage.jsx
- [x] PDFEditorPage.jsx
- [x] Header.jsx
- [x] Footer.jsx

### ⚠️ Need Fixing:
- [ ] QRCodePage.jsx
- [ ] FileConverterPage.jsx
- [ ] WhatsAppPage.jsx
- [ ] HomePage.jsx
- [ ] NotFoundPage.jsx

## How to Fix a Page

### Example: Fixing a Card Component

**Before:**
```jsx
<div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600">Description text</p>
  <button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
    Button
  </button>
</div>
```

**After:**
```jsx
<div className="bg-card-background rounded-3xl p-8 shadow-xl border border-border">
  <h2 className="text-2xl font-bold text-text-heading">Title</h2>
  <p className="text-text-body">Description text</p>
  <button className="bg-card-background text-text-body border border-border hover:bg-background">
    Button
  </button>
</div>
```

## Search & Replace Patterns

Use these patterns in VS Code (Ctrl+H with regex enabled):

1. **Background Colors:**
   - Find: `bg-white(?!\s*text-)`
   - Replace: `bg-background`
   
   - Find: `bg-gray-(50|100)`
   - Replace: `bg-card-background`

2. **Text Colors:**
   - Find: `text-gray-900`
   - Replace: `text-text-heading`
   
   - Find: `text-gray-(700|600)`
   - Replace: `text-text-body`
   
   - Find: `text-gray-(500|400)`
   - Replace: `text-text-muted`

3. **Borders:**
   - Find: `border-gray-(100|200|300)`
   - Replace: `border-border`

## Testing Dark Mode

After fixing a page, test both themes:

```javascript
// In browser console:
// Toggle to dark mode
document.documentElement.classList.add('dark');

// Toggle to light mode
document.documentElement.classList.remove('dark');
```

## CSS Variables Reference

These are defined in `src/styles/index.css`:

```css
/* Light Mode */
:root {
  --color-background: #ffffff;
  --color-card-background: #f9fafb;
  --color-text-heading: #111827;
  --color-text-body: #374151;
  --color-text-muted: #6B7280;
  --color-border: #e5e7eb;
  --color-primary-accent: #3B82F6;
  --color-secondary-accent: #2DD4BF;
}

/* Dark Mode */
.dark {
  --color-background: #111827;
  --color-card-background: #1F2937;
  --color-text-heading: #F9FAFB;
  --color-text-body: #D1D5DB;
  --color-text-muted: #9CA3AF;
  --color-border: #374151;
}
```

## Common Mistakes to Avoid

❌ **Don't use gradients with gray colors**
```jsx
// Bad
<div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
```

✅ **Use solid theme colors or keep gradient-heavy sections separate**
```jsx
// Good - Use theme background
<div className="bg-background">
  {/* Accent gradients are OK for specific elements */}
  <div className="bg-gradient-to-r from-primary-accent to-secondary-accent">
```

❌ **Don't mix hardcoded and theme colors**
```jsx
// Bad
<div className="bg-white text-text-body">
```

✅ **Use all theme colors together**
```jsx
// Good
<div className="bg-background text-text-body">
```

## Quick Fix Checklist

For each page component:

1. [ ] Replace `bg-white` with `bg-background` or `bg-card-background`
2. [ ] Replace all `text-gray-*` with appropriate text classes
3. [ ] Replace all `border-gray-*` with `border-border`
4. [ ] Keep accent colors (`primary-accent`, `secondary-accent`, etc.)
5. [ ] Test in both light and dark mode
6. [ ] Check hover states and transitions
7. [ ] Verify readability in both themes

## Need Help?

- Check `src/styles/index.css` for full variable definitions
- Look at `EmailPage.jsx` or `PDFEditorPage.jsx` as examples
- Use browser DevTools to inspect computed CSS variables
