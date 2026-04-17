# Design System & Theming

## Color Palette
- **Primary (Light):** Pastel Green (#b5e0a7)
- **Secondary (Light):** Brown (#c5a880)
- **Background (Light):** #ffffff
- **Text (Light):** #1a1a1a

- **Background (Dark):** #121212
- **Text (Dark):** #f5f5f5

## CSS Variables
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --color-accent: #b5e0a7;
  --color-secondary: #c5a880;
}

[data-theme='dark'] {
  --bg-primary: #121212;
  --text-primary: #f5f5f5;
  --color-accent: #8fb982; /* Slightly adjusted for dark mode */
}
```

## Transitions
- Smooth 0.3s ease-in-out for theme switching.
- Slide-in fade-up animations for cards.
