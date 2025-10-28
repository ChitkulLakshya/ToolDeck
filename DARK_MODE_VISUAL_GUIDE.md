# Dark Mode Visual Guide

## 🌙 What You'll See

### Header Component

#### Light Mode:
```
┌────────────────────────────────────────────────────────┐
│  🤖 ToolDeck ✨    Home  Tools  About  Contact    ☀️  │
│  (blue gradient)   (gray text)                (yellow) │
└────────────────────────────────────────────────────────┘
Background: White/transparent with blur
Text: Gray-700
Icons: Blue-600, Yellow-500
```

#### Dark Mode:
```
┌────────────────────────────────────────────────────────┐
│  🤖 ToolDeck ✨    Home  Tools  About  Contact    🌙  │
│  (blue gradient)   (gray-300)                  (blue)  │
└────────────────────────────────────────────────────────┘
Background: Gray-900/transparent with blur
Text: Gray-300
Icons: Blue-400
```

### Theme Toggle Button

#### States:
```
Light Mode Active:  ☀️ (Yellow sun icon)
Dark Mode Active:   🌙 (Blue moon icon)
```

#### Button Styles:
```
Light: bg-gray-100, hover:bg-gray-200
Dark:  bg-gray-800, hover:bg-gray-700
```

### Mobile View

```
┌──────────────────────────┐
│  🤖 ToolDeck    ☀️  ☰   │  <- Sun + Menu
│                          │
│  [When menu open]        │
│  ╔════════════════════╗  │
│  ║ Home               ║  │
│  ║ Tools              ║  │
│  ║ About              ║  │
│  ║ Contact            ║  │
│  ╚════════════════════╝  │
└──────────────────────────┘
```

## 🎨 Color Palette

### Light Mode Colors:
- **Background:** `#F9FAFB` (gray-50)
- **Surface:** `#FFFFFF` (white)
- **Text Primary:** `#111827` (gray-900)
- **Text Secondary:** `#4B5563` (gray-600)
- **Border:** `#E5E7EB` (gray-200)
- **Accent:** `#3B82F6` (blue-600)

### Dark Mode Colors:
- **Background:** `#111827` (gray-900)
- **Surface:** `#1F2937` (gray-800)
- **Text Primary:** `#FFFFFF` (white)
- **Text Secondary:** `#9CA3AF` (gray-400)
- **Border:** `#374151` (gray-700)
- **Accent:** `#60A5FA` (blue-400)

## 🔄 Theme Transitions

### Animation Flow:
```
User clicks toggle
       ↓
State updates (theme: 'light' → 'dark')
       ↓
localStorage.setItem('tooldeck-theme', 'dark')
       ↓
document.documentElement.classList.add('dark')
       ↓
CSS transitions kick in (200ms)
       ↓
All 'dark:' classes activate
       ↓
Meta theme-color updates
```

### Transition Speed:
- **Color changes:** 200ms
- **Interactive elements:** 300ms
- **Smooth, no jarring:** ✅

## 📱 Responsive Behavior

### Desktop (≥1024px):
```
Logo | Navigation | Theme Toggle
     ^              ^
  Always visible  In navbar
```

### Mobile (<1024px):
```
Logo | Theme Toggle | Menu Button
           ^              ^
    Always visible    Hamburger
```

## 🎯 Class Examples

### Before (Light Only):
```jsx
<div className="bg-white text-gray-900 border-gray-200">
  <h1 className="text-blue-600">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

### After (Light + Dark):
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
  <h1 className="text-blue-600 dark:text-blue-400">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

## 🔍 localStorage Structure

```javascript
// Key: 'tooldeck-theme'
// Values: 'light' | 'dark'

// Check current theme:
localStorage.getItem('tooldeck-theme')
// Returns: "dark" or "light"

// Clear saved preference (use system):
localStorage.removeItem('tooldeck-theme')
```

## 🧪 Testing Scenarios

### Scenario 1: First Visit
```
User visits site for first time
       ↓
No localStorage found
       ↓
Check: window.matchMedia('(prefers-color-scheme: dark)')
       ↓
If dark → Apply dark theme
If light → Apply light theme
```

### Scenario 2: Returning User
```
User returns to site
       ↓
Check localStorage: 'tooldeck-theme'
       ↓
Found: 'dark' → Apply dark theme
Found: 'light' → Apply light theme
       ↓
Ignore system preference (user chose manually)
```

### Scenario 3: System Theme Changes
```
User has OS set to dark mode
       ↓
Changes OS to light mode
       ↓
If no localStorage → Auto-switch to light
If localStorage exists → Keep user choice
```

## 💡 Code Snippets

### Toggle Theme in Any Component:
```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

### Conditional Rendering Based on Theme:
```jsx
const { isDark } = useTheme();

return (
  <div>
    {isDark ? (
      <img src="/logo-dark.svg" alt="Logo" />
    ) : (
      <img src="/logo-light.svg" alt="Logo" />
    )}
  </div>
);
```

### Force Specific Theme:
```jsx
const { setLightTheme, setDarkTheme, setSystemTheme } = useTheme();

<button onClick={setLightTheme}>Force Light</button>
<button onClick={setDarkTheme}>Force Dark</button>
<button onClick={setSystemTheme}>Use System</button>
```

## 🎨 Common Patterns

### Card Component:
```jsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
    Card Title
  </h2>
  <p className="text-gray-600 dark:text-gray-400">
    Card description text
  </p>
</div>
```

### Button Component:
```jsx
<button className="px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl transition-colors">
  Click Me
</button>
```

### Input Component:
```jsx
<input
  type="text"
  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
  placeholder="Enter text..."
/>
```

### Link Component:
```jsx
<a
  href="#"
  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
>
  Click here
</a>
```

## 📊 Browser Support

- ✅ Chrome/Edge (all versions with CSS variables)
- ✅ Firefox (all versions with CSS variables)
- ✅ Safari (all versions with CSS variables)
- ✅ Mobile browsers (with meta theme-color)
- ✅ System preference detection (modern browsers)

## 🚀 Performance

- **Initial Load:** <50ms (inline script)
- **Theme Toggle:** <200ms (CSS transitions)
- **localStorage:** <1ms (synchronous)
- **No Flash:** ✅ (prevents FOUC)

## ✨ User Experience

1. **Smooth Transitions:** No jarring color changes
2. **Persistent:** Choice saved across sessions
3. **Smart Detection:** Respects system preference
4. **Accessible:** Keyboard + screen reader friendly
5. **Mobile-Friendly:** Native browser UI updates

---

**Visual Reference Complete** ✅
