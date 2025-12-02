# Happy Animal Pet Shop - Shop Page Design Rules

## 🎨 Visual Design System

### Color Palette
```css
/* Primary Brand Colors */
--primary-orange: #F87537
--primary-orange-dark: #e66428
--primary-orange-light: #fff5f0
--primary-yellow: #FBA81F

/* Category Colors */
--category-food: #F87537
--category-toys: #FBA81F
--category-bowls: #3498db
--category-clothing: #9b59b6

/* Brand Colors */
--brand-natural-food: #e67e22
--brand-pet-care: #2ecc71
--brand-dogs-friend: #1abc9c

/* Status Colors */
--success-green: #2ecc71
--warning-orange: #f39c12
--danger-red: #e74c3c
--sale-red: #ff4757
--out-of-stock: #95a5a6

/* Neutral Colors */
--gray-50: #f8f9fa
--gray-100: #f0f0f0
--gray-200: #e0e0e0
--gray-300: #ddd
--gray-400: #ccc
--gray-500: #999
--gray-600: #666
--gray-700: #333
--gray-900: #000
--white: #fff
```

### Typography
```css
/* Font Families */
font-family: 'Inter', sans-serif (secondary)
font-family: 'Poppins', sans-serif (primary)

/* Heading Sizes */
- H1 (Page Titles): 48px, weight 700
- H2 (Product Titles): 20px, weight 600
- H3 (Section Headers): 24px, weight 700
- Labels: 13px, weight 400-500
- Body Text: 14px, weight 400

/* Letter Spacing */
- Headings: -0.5px
- Body Text: normal
```

## 📐 Layout & Spacing

### Content Sections
```css
/* Section Spacing */
- Section Padding: 60px 0
- Container Max-Width: 1920px
- Container Padding: 0 40px

/* Pet Type Carousel */
- Carousel Height: 320px (280px item + margins)
- Item Size: 280px × 280px
- Item Gap: 40px
- Animation: 40s linear infinite slideshow
```

### Shop Layout
```css
/* Main Shop Section */
- Background: var(--gray-50)
- Layout: Flex (sidebar + products)
- Gap: 40px

/* Sidebar Filters */
- Width: 280px (fixed)
- Background: var(--white)
- Border Radius: 16px
- Padding: 32px
- Box Shadow: var(--shadow-card)

/* Products Area */
- Flex: 1 (takes remaining space)
- Responsive: Stacked on mobile (≤992px)
```

## 🏷️ Product Card System

### Card Structure
```html
<article class="product-card" data-product-id="[ID]">
  <!-- Badges Container (Top Left) -->
  <div class="product-badges">
    <span class="product-badge badge-[TYPE]">[TEXT]</span>
  </div>
  
  <!-- Wishlist Button (Top Right) -->
  <button class="wishlist-btn" data-product-id="[ID]">
    <i class="far/fa-heart"></i>
  </button>
  
  <!-- Product Image Area -->
  <div class="product-image">
    <img src="[IMAGE]" alt="[ALT]">
    <button class="quick-view-btn" data-product-id="[ID]">Quick View</button>
    <div class="product-overlay"></div>
  </div>
  
  <!-- Product Information -->
  <div class="product-info">
    <!-- Meta: Category + Brand -->
    <!-- Title -->
    <!-- Rating -->
    <!-- Price -->
    <!-- Stock Status -->
    <!-- Actions -->
  </div>
</article>
```

### Card Dimensions
```css
/* Desktop */
- Height: Auto (flex column)
- Border Radius: 16px
- Box Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Hover Shadow: 0 8px 24px rgba(0,0,0,0.15)
- Hover Transform: translateY(-8px)

/* Image Container */
- Height: 300px (desktop), 280px (tablet), 250px (mobile)
- Object Fit: Cover
- Overlay on Hover: semi-transparent
```

### Badge System
```css
/* Badge Types */
badge-new (green)           → New products
badge-sale (red)            → Discounted items
badge-low-stock (orange)    → Limited quantity
badge-out-of-stock (gray)   → Unavailable

/* Badge Styling */
- Border Radius: 20px (pill)
- Font Size: 11px, weight 700
- Text Transform: uppercase
- Padding: 4px 12px
- Position: absolute top-left (z-index: 3)
```

### Stock Status Logic
```
Stock Status → Visual Display
─────────────────────────────
in-stock     → Green dot + "In Stock" + Add to Cart enabled
low-stock    → Orange dot + "Low Stock" + Add to Cart enabled  
out-of-stock → Gray dot + "Out of Stock" + Add to Cart disabled
```

### Rating System
```css
/* Star Display */
- Always exactly 5 stars (full, half, or empty)
- CSS: fas fa-star (full), fas fa-star-half-alt (half), far fa-star (empty)
- Color: #ffaa00 (gold)
- Size: 14px

/* Rating Layout */
Stars + Rating Value (4.5) + Review Count (120)
Font: weight 600 for value, normal for count
Color: var(--gray-600) for text
```

## 🎛️ Filter System

### Sidebar Structure
```html
<aside class="filters-sidebar">
  <!-- Filters Header -->
  <div class="filters-header">
    <h3>Filters</h3>
    <button class="clear-filters">Clear All</button>
  </div>
  
  <!-- Active Filters Display -->
  <div class="active-filters">
    <div class="active-filters-list"></div>
  </div>
  
  <!-- Filter Groups -->
  <div class="filter-group">
    <h4 class="filter-title">Group Name</h4>
    <div class="filter-options">
      <!-- Options -->
    </div>
  </div>
</aside>
```

### Filter Components
```css
/* Filter Group */
- Margin Bottom: 28px
- Padding Bottom: 24px
- Border Bottom: 1px solid var(--gray-100)

/* Filter Title */
- Font: weight 600, size 16px
- Display: flex justify-content space-between
- Clickable: collapse/expand functionality

/* Filter Options */
- Label + Checkbox + Count styling
- Hover state: background var(--gray-50)

/* Custom Checkboxes */
- Size: 16×16px
- Border: 2px solid var(--gray-300)
- Checked: background var(--primary-orange)
```

### Filter Types
```css
/* Category Filter */
- Icons: food (🍖), toys (🎾), bowls (🥣), clothing (👕)
- Product count badges

/* Price Range */
- Min/Max number inputs
- Apply button with primary orange theme

/* Rating Filter */
- Star display + "& up" text
- 5-star, 4-star, 3-star options
```

## 🛒 Product Actions

### Buttons & Interactions
```css
/* Primary: Add to Cart */
- Background: linear-gradient(var(--primary-orange) to var(--primary-yellow))
- Text: white, weight 600
- Padding: 12px 24px
- Border Radius: 8px
- Icon: fa-shopping-cart

/* Secondary: Quick View */
- Position: absolute bottom-right of image
- Background: white with border
- Icon: fa-eye
- Show on hover only

/* Wishlist Toggle */
- Position: absolute top-right
- Background: white with border
- Icon:far fa-heart (empty) / fas fa-heart (filled)
- Color: var(--danger-red) when active
```

### Button States
```css
/* Enabled State */
- Normal: gradient background
- Hover: translateY(-2px) + enhanced shadow
- Active: translateY(0)

/* Disabled State (Out of Stock) */
- Background: var(--gray-200)
- Text: var(--gray-500)
- Icon: fa-ban
- Cursor: not-allowed
```

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop → Tablet */
@media (max-width: 1400px): Container padding 60px
@media (max-width: 1200px): Reduced image sizes
@media (max-width: 992px): Stack layout (sidebar above products)
@media (max-width: 768px): Mobile filter toggle + cards 2 per row
@media (max-width: 480px): Cards 1 per row, increased spacing
```

### Mobile Adaptations
```css
/* Shop Layout */
- Sidebar: Hidden behind toggle button
- Products Grid: 2 columns (≤768px), 1 column (≤480px)
- Filter Toggle: Floating button with filter icon

/* Product Cards */
- Image Height: 250px (tablet), 220px (mobile)
- Font Sizes: Slightly smaller on mobile
- Button Text: "Add" instead of "Add to Cart" (space saving)
```

## 🔍 Search & Sorting

### Search Bar
```css
/* Search Container */
- Position: navbar-left (desktop)
- Width: 300px (desktop), 70% (mobile)
- Input: white background, rounded borders
- Icon: fa-search (right side)

/* Search Results */
- Highlight matching text
- Show product count
- "No results" state with clear filters option
```

### Toolbar Controls
```css
/* Results Info */
- "Showing 1-12 of 120 results"
- Font: weight 500

/* View Toggle */
- Grid (fa-th) vs List (fa-list) buttons
- Active state: primary orange background

/* Sort Dropdown */
- Options: Default, Price Low/High, Name A/Z, Rating, Newest
- White background, rounded borders

/* Per Page */
- Options: 12, 24, 48, All
- Same styling as sort
```

## 🗂️ Modal System

### Product Quick View Modal
```css
/* Modal Container */
- ID: #productModal
- Max Width: 1200px
- Layout: Flex (50/50 split images + details)
- Background: white
- Border Radius: 20px
- Centered on screen

/* Left: Images Section */
- Main Image: 500px height (desktop)
- Thumbnails: Horizontal strip below
- Badges: Top-left of main image

/* Right: Details Section */
- Vertical flex layout with 24px gaps
- Responsive: Stack on mobile (≤992px)
```

### Modal Components
```css
/* Header */
- Category + Brand (meta info)
- Product Title (H2, 700 weight)
- Rating display

/* Price Section */
- Current price + original price (strikethrough)
- Discount badge (-40%)
- Stock status indicator

/* Actions */
- Quantity controls (-/+/input)
- "Add to Cart" primary button
- Wishlist toggle button

/* Tabs */
- Description | Additional Info | Reviews
- Active tab: primary orange underline
- Tab content: smooth transitions
```

## ⚡ Transitions & Micro-interactions

### Animation Standards
```css
/* Base Transition Duration */
--transition-base: 0.3s ease
--transition-fast: 0.15s ease  
--transition-slow: 0.5s ease

/* Hover Effects */
- Cards: translateY(-8px) + shadow increase
- Images: scale(1.1) for background shapes
- Buttons: translateY(-2px) + shadow
- Links: color change + slight scale

/* Loading States */
- Spinner animation for content loading
- Skeleton loading for images
- Smooth fade transitions
```

### Interactive Feedback
```css
/* Button Press */
- Transform: scale(0.98) for 0.1s
- Shadow reduction

/* Form Validation */
- Red borders for errors
- Green borders for success
- Animation: shake for errors

/* Cart Updates */
- Fly-to-cart animation for products
- Cart icon bounce effect
- Badge update with scale animation
```

## 🎯 Accessibility Standards

### ARIA Implementation
```html
<!-- Product Cards -->
<article role="article" aria-label="Premium Dog Food product">
  <button aria-label="Add Premium Dog Food to cart">
  <a aria-label="View Premium Dog Food details">

<!-- Filters -->
<input type="checkbox" aria-describedby="category-count">
<div id="category-count">28 products</div>

<!-- Modals -->
<div role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <button aria-label="Close product details">
```

### Keyboard Navigation
```css
/* Focus States */
- Outline: 2px solid var(--primary-orange)
- Skip links for major sections
- Tab order: logical, left-to-right

/* Screen Readers */
- Alternative text for all images
- Semantic HTML5 structure
- Descriptive button/link text
- Status announcements for dynamic updates
```

## 📊 Performance Considerations

### Image Optimization
```css
/* Lazy Loading */
- loading="lazy" for all product images
- Fallback SVG for failed loads
- Responsive images with srcset
- WebP format support

/* Image Dimensions */
- Aspect ratio preservation
- Consistent heights within grids
- Optimized file sizes
- CDN delivery via assets/ folder
```

### Animation Performance
```css
/* Hardware Acceleration */
- transform: translateY() (instead of top/bottom)
- opacity transitions (instead of display)
- will-change: transform for hover states
- Backface-visibility: hidden

/* Reduced Motion */
- @media (prefers-reduced-motion)
- Respect user accessibility preferences
- Essential animations only
```

## 🔧 Development Guidelines

### CSS Architecture
```css
/* BEM Methodology */
- .product-card (block)
- .product-card__image (element)  
- .product-card--out-of-stock (modifier)

/* Component Structure */
- Variables first
- Base styles
- Component styles
- Layout styles
- Responsive styles
- Utilities/helpers
```

### Implementation Rules
1. **Always use CSS Custom Properties** for colors, spacing, transitions
2. **Mobile-first responsive approach** (min-width media queries)
3. **Component isolation** - avoid nested selectors deeper than 3 levels
4. **Consistent naming** - follow established patterns (kebab-case)
5. **Semantic HTML5** - proper use of article, section, nav, etc.

### File Organization
```
css/
├── shop.css           (Main shop page styles)
├── productCard.css    (Product card components)
├── general.css        (Shared/global styles)
└── variables.css      (Custom properties - if separated)
```

---

## 📝 Code Review Checklist

### New Feature Implementation
- [ ] Used existing CSS custom properties
- [ ] Followed BEM naming convention
- [ ] Added proper ARIA labels
- [ ] Implemented hover/focus states
- [ ] Added responsive breakpoints
- [ ] Tested keyboard navigation
- [ ] Verified accessibility contrast
- [ ] Optimized for reduced motion
- [ ] Performance tested (lazy loading, animations)

### Bug Fixes
- [ ] Maintained design consistency
- [ ] No regression in responsive behavior
- [ ] Accessibility still functional
- [ ] Cross-browser compatibility确认
- [ ] Performance impact assessed

---

*Last Updated: December 2024*
*Version: 1.0.0*
*Maintainer: Happy Animal Pet Shop Frontend Team*
