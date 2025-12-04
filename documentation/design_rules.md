# Happy Animal Pet Shop - Design Rules & Guidelines

## 🎨 Complete Design System Documentation

---

## 1. COLOR PALETTE

### Primary Colors

```css
--primary-orange: #F87537
--primary-yellow: #FFB800
--primary-orange-dark: #e66428  /* Hover state */
```

**Usage:**
- Primary orange: Main brand color, CTAs, icons, highlights
- Primary yellow: Gradient endpoints, accents
- Primary orange dark: Hover states for orange elements

### Gradients

```css
/* Primary Gradient */
background: linear-gradient(135deg, #F87537 0%, #FFB800 100%);
```

**Applications:**
- Hero sections
- CTA buttons
- Statistics sections
- Icon backgrounds
- Feature highlights

### Neutral Colors

```css
--white: #FFFFFF
--gray-50: #F8F9FA     /* Light backgrounds */
--gray-100: #F5F5F5    /* Card backgrounds */
--gray-200: #E9ECEF    /* Borders */
--gray-600: #6C757D    /* Secondary text */
--gray-700: #495057    /* Body text */
--gray-900: #212529    /* Headings */
--black: #000000
```

**Usage:**
- White: Card backgrounds, buttons, text on dark
- Gray 50: Alternating section backgrounds
- Gray 200: Card borders, dividers
- Gray 600-700: Body text, descriptions
- Gray 900: Headings, important text

### Accent Colors

```css
--success-green: #28A745
--warning-yellow: #FFC107
--danger-red: #DC3545
--info-blue: #17A2B8
```

**Usage:**
- Success messages, checkmarks
- Warnings, alerts
- Errors, delete actions
- Info badges, notifications

### Star Rating Color

```css
--star-yellow: #FFB800
```

---

## 2. TYPOGRAPHY

### Font Families

```css
--font-primary: 'Poppins', sans-serif;
--font-secondary: 'Inter', sans-serif;
```

**Font Weights:**
- Poppins: 400, 500, 600, 700, 800, 900
- Inter: 400, 500, 600, 700

### Hierarchy

#### Headings (Poppins)

```css
h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--gray-900);
}

h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--gray-900);
}

h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--gray-900);
}

h4 {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--gray-900);
}
```

#### Body Text (Inter)

```css
body, p {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--gray-700);
}

/* Large text */
.text-large {
  font-size: 18px;
  line-height: 1.7;
}

/* Small text */
.text-small {
  font-size: 14px;
  line-height: 1.5;
}

/* Extra small text */
.text-xs {
  font-size: 13px;
  line-height: 1.4;
}
```

### Responsive Typography

```css
/* Mobile (< 768px) */
h1 { font-size: 32px; }
h2 { font-size: 28px; }
h3 { font-size: 20px; }

/* Tablet (768px - 1199px) */
h1 { font-size: 40px; }
h2 { font-size: 32px; }
h3 { font-size: 22px; }

/* Desktop (1200px+) */
h1 { font-size: 48px; }
h2 { font-size: 36px; }
h3 { font-size: 24px; }
```

---

## 3. SPACING SYSTEM

### Scale

```css
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-20: 20px;
--space-24: 24px;
--space-32: 32px;
--space-48: 48px;
--space-64: 64px;
--space-80: 80px;
--space-100: 100px;
```

### Section Spacing

```css
/* Standard section padding */
section {
  padding: 80px 0;
}

/* Compact sections */
.section-compact {
  padding: 60px 0;
}

/* Large sections */
.section-large {
  padding: 100px 0;
}
```

### Container Widths

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.container-narrow {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.container-wide {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### Grid Gaps

```css
/* Standard grid gap */
.grid {
  gap: 24px;
}

/* Large gap */
.grid-large {
  gap: 32px;
}

/* Extra large gap */
.grid-xl {
  gap: 48px;
}
```

---

## 4. BORDER RADIUS

### Scale

```css
--radius-sm: 8px;    /* Small elements, inputs */
--radius-md: 12px;   /* Cards, buttons */
--radius-lg: 16px;   /* Large cards */
--radius-xl: 24px;   /* Hero sections */
--radius-full: 50px; /* Pills, rounded buttons */
--radius-circle: 50%; /* Circular elements */
```

### Usage

- Buttons: `12px` or `50px` (pill style)
- Cards: `12px`
- Inputs: `8px`
- Icons: `50%` (circles)
- Modals: `16px`

---

## 5. SHADOWS

### Elevation System

```css
/* Card shadow - Level 1 */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

/* Hover shadow - Level 2 */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Lifted shadow - Level 3 */
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

/* Intense shadow - Level 4 */
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);

/* Orange accent shadow */
box-shadow: 0 4px 16px rgba(248, 117, 55, 0.3);

/* Orange hover shadow */
box-shadow: 0 8px 24px rgba(248, 117, 55, 0.4);
```

---

## 6. BUTTONS

### Primary Button (Gradient)

```css
.btn-primary, .cta-button {
  padding: 16px 48px;
  background: linear-gradient(135deg, #F87537, #FFB800);
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(248, 117, 55, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(248, 117, 55, 0.4);
}
```

### Secondary Button (Outline)

```css
.btn-secondary, .category-link {
  padding: 10px 24px;
  background: transparent;
  color: #F87537;
  border: 2px solid #F87537;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #F87537;
  color: white;
}
```

### Button Sizes

```css
/* Small */
.btn-sm {
  padding: 8px 20px;
  font-size: 14px;
}

/* Medium (default) */
.btn-md {
  padding: 12px 32px;
  font-size: 16px;
}

/* Large */
.btn-lg {
  padding: 16px 48px;
  font-size: 18px;
}
```

---

## 7. CARDS

### Standard Card

```css
.card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  border: 2px solid #E9ECEF;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card:hover {
  border-color: #F87537;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(248, 117, 55, 0.15);
}
```

### Product Card

```css
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}
```

### Category Card

```css
.category-card {
  background: white;
  padding: 32px 24px;
  border-radius: 12px;
  border: 2px solid #E9ECEF;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  border-color: #F87537;
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(248, 117, 55, 0.2);
}
```

---

## 8. FORMS

### Input Fields

```css
input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E9ECEF;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #F87537;
  box-shadow: 0 0 0 3px rgba(248, 117, 55, 0.1);
}
```

### Labels

```css
label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 8px;
}
```

---

## 9. ICONS

### Icon Sizing

```css
/* Small icons */
.icon-sm {
  font-size: 16px;
  width: 16px;
  height: 16px;
}

/* Medium icons (default) */
.icon-md {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

/* Large icons */
.icon-lg {
  font-size: 36px;
  width: 36px;
  height: 36px;
}

/* Extra large icons */
.icon-xl {
  font-size: 48px;
  width: 48px;
  height: 48px;
}
```

### Icon Backgrounds

```css
/* Circular icon background */
.category-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #F87537, #FFB800);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  margin: 0 auto 20px;
}
```

---

## 10. ANIMATIONS & TRANSITIONS

### Timing Functions

```css
/* Standard ease */
transition: all 0.3s ease;

/* Smooth ease-out */
transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Bounce */
transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Hover Effects

```css
/* Lift effect */
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Strong lift */
.hover-lift-strong:hover {
  transform: translateY(-8px);
}

/* Scale */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Rotate */
.hover-rotate:hover {
  transform: rotate(5deg);
}
```

### Page Transitions

```css
/* Fade in on load */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 11. GRID SYSTEMS

### Standard Grid

```css
.grid {
  display: grid;
  gap: 24px;
}

/* 4 columns */
.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* 3 columns */
.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* 2 columns */
.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}
```

### Responsive Grid

```css
/* Desktop: 4 columns */
@media (min-width: 1200px) {
  .category-grid { grid-template-columns: repeat(4, 1fr); }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1199px) {
  .category-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .category-grid { grid-template-columns: 1fr; }
}
```

---

## 12. RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */

/* Extra small devices (phones) */
@media (max-width: 575px) { }

/* Small devices (landscape phones) */
@media (min-width: 576px) { }

/* Medium devices (tablets) */
@media (min-width: 768px) { }

/* Large devices (desktops) */
@media (min-width: 992px) { }

/* Extra large devices (large desktops) */
@media (min-width: 1200px) { }

/* Extra extra large devices */
@media (min-width: 1400px) { }
```

---

## 13. Z-INDEX LAYERS

```css
--z-base: 1;
--z-dropdown: 100;
--z-sticky: 200;
--z-fixed: 300;
--z-modal-backdrop: 1000;
--z-modal: 1001;
--z-popover: 1500;
--z-tooltip: 2000;
--z-notification: 3000;
```

---

## 14. SECTION BACKGROUNDS

### Pattern

```css
/* Alternate sections */
section:nth-child(odd) {
  background: white;
}

section:nth-child(even) {
  background: #F8F9FA;
}

/* Gradient sections */
.section-gradient {
  background: linear-gradient(135deg, #F87537 0%, #FFB800 100%);
  color: white;
}
```

---

## 15. COMPONENT PATTERNS

### Hero Section

```css
.hero-section {
  padding: 140px 0 80px 0;
  text-align: center;
  background: linear-gradient(135deg, #F87537 0%, #FFB800 100%);
  color: white;
}
```

### Feature Cards

```css
.feature-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  border: 2px solid #E9ECEF;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card i {
  font-size: 40px;
  color: #F87537;
  margin-bottom: 20px;
}
```

### Testimonial Cards

```css
.testimonial-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.testimonial-stars i {
  color: #FFB800;
  font-size: 16px;
  margin-right: 4px;
}
```

---

## 16. ACCESSIBILITY RULES

### Focus States

```css
*:focus {
  outline: 3px solid rgba(248, 117, 55, 0.5);
  outline-offset: 2px;
}

button:focus,
a:focus {
  outline: 3px solid rgba(248, 117, 55, 0.5);
}
```

### Contrast Ratios

- Text on white: Minimum 4.5:1 (WCAG AA)
- Large text on white: Minimum 3:1
- Text on gradient background: Use white with shadow if needed

### Semantic HTML

- Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Use `<h1>` - `<h6>` in proper hierarchy
- Use `<button>` for actions, `<a>` for navigation
- Include `alt` text for all images
- Use `aria-label` for icons without text

---

## 17. PERFORMANCE RULES

### Image Optimization

- Use WebP format when possible
- Lazy load images below the fold
- Max image size: 200KB for photos, 50KB for icons
- Use `srcset` for responsive images

### CSS

- Use CSS variables for theming
- Minimize use of `!important`
- Prefer CSS Grid and Flexbox over floats
- Use `transform` and `opacity` for animations (GPU accelerated)

### JavaScript

- Use ES6 modules
- Defer non-critical scripts
- Minimize DOM manipulation
- Use event delegation

---

## 18. NAMING CONVENTIONS

### BEM Methodology (where applicable)

```css
.block { }
.block__element { }
.block--modifier { }

/* Examples */
.card { }
.card__title { }
.card--featured { }
```

### Utility Classes

```css
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }

.mb-1 { margin-bottom: 8px; }
.mb-2 { margin-bottom: 16px; }
.mb-3 { margin-bottom: 24px; }
```

---

## 19. CONSISTENCY RULES

### Always Use

✅ Consistent spacing (multiples of 4px or 8px)  
✅ Same transition duration (0.3s)  
✅ Same border-radius values  
✅ Same shadow patterns  
✅ Same color palette  
✅ Same typography scale  
✅ Same hover effects  

### Never Use

❌ Random spacing values  
❌ Different transition durations  
❌ Pure black (#000) for text (use gray-900)  
❌ Pure gray (#808080) - use defined grays  
❌ Inconsistent button styles  
❌ Mixed font families  
❌ Hard-coded colors (use variables)  

---

## 20. MOBILE-FIRST PRINCIPLES

1. **Design for mobile first**
2. **Stack elements vertically on mobile**
3. **Increase padding on larger screens**
4. **Show/hide elements responsively**
5. **Touch-friendly targets (minimum 44x44px)**
6. **Readable text (minimum 16px on mobile)**
7. **Optimized images for mobile**

---

## 🎯 QUICK REFERENCE

### Common Patterns

**Section Title:**
```css
font-size: 36px;
font-weight: 700;
text-align: center;
margin-bottom: 16px;
font-family: 'Poppins';
```

**Card Hover:**
```css
border-color: #F87537;
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(248, 117, 55, 0.15);
```

**CTA Button:**
```css
padding: 16px 48px;
background: linear-gradient(135deg, #F87537, #FFB800);
border-radius: 50px;
color: white;
font-weight: 600;
```

---

**These design rules ensure consistency, professionalism, and a premium feel across the entire Happy Animal Pet Shop website!** 🎨✨
