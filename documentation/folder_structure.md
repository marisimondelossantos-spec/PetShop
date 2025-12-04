# Happy Animal Pet Shop - Folder Structure Documentation

## 📁 Complete Project Structure

```
PetShop/
│
├── 📄 HTML Pages (Root Level)
│   ├── index.html                    # Home page with 7 premium sections
│   ├── Shop.html                     # Shop page with product grid and filters
│   ├── about.html                    # About Us page with 7 sections
│   ├── contact.html                  # Contact page with form, map, FAQ
│   ├── service.html                  # Services page
│   └── profile.html                  # User profile page
│
├── 📂 css/                           # All stylesheets
│   │
│   ├── 📂 base/                      # Foundation styles
│   │   ├── variables.css            # CSS variables (colors, spacing, etc.)
│   │   ├── reset.css                # CSS reset/normalize
│   │   └── typography.css           # Font definitions and text styles
│   │
│   ├── 📂 components/               # Reusable component styles
│   │   ├── navbar.css              # Navigation bar styles
│   │   ├── footer.css              # Footer styles
│   │   ├── buttons.css             # Button variations
│   │   ├── cards.css               # Card component styles
│   │   ├── modals.css              # Modal window styles
│   │   ├── forms.css               # Form input styles
│   │   └── hero.css                # Hero section styles
│   │
│   ├── 📂 pages/                    # Page-specific premium styles
│   │   ├── home.css                # Premium home page sections
│   │   ├── about.css               # About page premium sections
│   │   └── contact.css             # Contact page premium sections
│   │
│   ├── main.css                     # Main CSS file (imports all modules)
│   ├── general.css                  # Legacy general styles
│   ├── home.css                     # Original home page styles
│   ├── shop.css                     # Shop page specific styles
│   ├── service.css                  # Services page styles
│   ├── about.css                    # Original about page styles
│   ├── contact.css                  # Original contact page styles
│   ├── profile.css                  # Profile page styles
│   ├── auth-modal.css              # Authentication modal styles
│   ├── payment-modal.css           # Payment modal styles
│   ├── ProductCard.css             # Product card component styles
│   ├── user-menu.css               # User dropdown menu styles
│   └── signup.css                   # Signup form styles
│
├── 📂 js/                           # All JavaScript files
│   │
│   ├── 📂 modules/                  # ES6 Modules (Modular architecture)
│   │   ├── init.js                 # Initialization module (loads navbar/footer)
│   │   ├── auth.js                 # Authentication logic
│   │   ├── cart.js                 # Shopping cart functionality
│   │   ├── wishlist.js             # Wishlist management
│   │   ├── ui.js                   # UI utilities (loading, scroll-to-top)
│   │   ├── modals.js               # Modal management
│   │   ├── navigation.js           # Navigation utilities
│   │   ├── search.js               # Search functionality
│   │   ├── shop.js                 # Shop page logic
│   │   ├── service.js              # Services page logic
│   │   ├── profile.js              # Profile page logic
│   │   └── mobileMenu.js           # Mobile menu functionality
│   │
│   ├── 📂 services/                # Service layer
│   │   └── storage.js              # LocalStorage service wrapper
│   │
│   ├── 📂 components/              # Component scripts
│   │   └── loader.js               # Page loader component
│   │
│   ├── 📂 data/                    # Data files (currently empty)
│   │
│   ├── main.js                      # Main JavaScript entry point
│   ├── shop.js                      # Shop page controller
│   ├── shopLogic.js                # Shop logic (filters, products)
│   ├── service.js                   # Services page controller
│   ├── profile.js                   # Profile page controller
│   ├── contact.js                   # Contact page controller
│   ├── productCard.js              # Product card component logic
│   ├── payment-modal.js            # Payment modal logic
│   ├── auth-modals-updated.js      # Authentication modals
│   └── auth-validation.js          # Form validation for auth
│
├── 📂 components/                   # HTML Component Templates
│   ├── navbar.html                 # Navbar HTML template
│   ├── footer.html                 # Footer HTML template
│   └── hero-section.html           # Hero section template
│
├── 📂 assets/                       # Static assets
│   └── 📂 images/                  # Image files
│       └── 📂 home/                # Home page images
│           ├── 📂 footer/          # Footer social icons
│           └── (various SVG/PNG files)
│
├── 📂 .git/                         # Git version control
│
└── 📄 Documentation Files
    ├── SHOP_DESIGN_RULES.md        # Shop page design guidelines
    └── (temp/backup files)
```

---

## 📊 Detailed File Breakdown

### 🌐 **HTML Pages (6 files)**

| File | Purpose | Sections |
|------|---------|----------|
| `index.html` | Home page | 7 premium sections |
| `Shop.html` | Product catalog | Hero, filters, products, pagination |
| `about.html` | Company information | 7 sections (story, team, stats, etc.) |
| `contact.html` | Contact information | 5 sections (form, map, FAQ, etc.) |
| `service.html` | Services offered | Hero, services grid |
| `profile.html` | User dashboard | Profile, cart, wishlist, orders |

---

### 🎨 **CSS Structure (3 folders, 16 component files)**

#### **Base Styles (3 files)**
- `variables.css` - CSS custom properties
- `reset.css` - Browser normalization
- `typography.css` - Font definitions

#### **Component Styles (7 files)**
- `navbar.css` - Navigation component
- `footer.css` - Footer component
- `buttons.css` - Button variations
- `cards.css` - Card components
- `modals.css` - Modal dialogs
- `forms.css` - Form inputs
- `hero.css` - Hero sections

#### **Page-Specific Premium Styles (3 files)**
- `pages/home.css` - Premium home sections (450+ lines)
- `pages/about.css` - Premium about sections (300+ lines)
- `pages/contact.css` - Premium contact sections (300+ lines)

#### **Main Styles**
- `main.css` - **Central import file** (loads all CSS modules)

#### **Legacy/Page-Specific Styles (9 files)**
- Original page styles and modals

---

### ⚙️ **JavaScript Structure (4 folders, 27 files)**

#### **Modules (ES6) - 12 files**
Modular architecture following best practices:

| Module | Purpose |
|--------|---------|
| `init.js` | Page initialization, loads navbar/footer |
| `auth.js` | User authentication logic |
| `cart.js` | Shopping cart management |
| `wishlist.js` | Wishlist functionality |
| `ui.js` | UI utilities (loading, scroll-to-top) |
| `modals.js` | Modal management |
| `navigation.js` | Navigation helpers |
| `search.js` | Search functionality |
| `shop.js` | Shop page module |
| `service.js` | Services page module |
| `profile.js` | Profile page module |
| `mobileMenu.js` | Mobile menu handler |

#### **Services - 1 file**
- `storage.js` - LocalStorage wrapper service

#### **Components - 1 file**
- `loader.js` - Page loading component

#### **Page Controllers - 6 files**
Legacy page-specific JavaScript files

#### **Specialized - 7 files**
Authentication, validation, product cards, etc.

---

### 🧩 **HTML Components (3 files)**

Reusable HTML templates loaded dynamically:
- `navbar.html` - Navigation bar
- `footer.html` - Footer with links
- `hero-section.html` - Hero template

---

### 🖼️ **Assets Structure**

```
assets/
└── images/
    └── home/
        ├── footer/
        │   ├── facebook.png
        │   ├── instagram.png
        │   └── x.png
        │
        ├── HeroImageMain.png
        ├── Shape (1).svg
        ├── bayong.png
        └── (other decorative images)
```

---

## 📈 **File Statistics**

### By Type
- **HTML Files:** 6 main pages + 3 components = 9 total
- **CSS Files:** 29 total (3 base + 7 components + 3 premium pages + 16 others)
- **JavaScript Files:** 27 total (12 modules + 15 others)
- **Total Project Files:** 65+ files

### By Category
- **Pages:** 6 HTML pages
- **Styles:** 29 CSS files
- **Scripts:** 27 JS files
- **Components:** 3 HTML templates
- **Assets:** Images and media

---

## 🏗️ **Architecture Patterns**

### **CSS Architecture: Component-Based**
```
base/ (foundation)
  ↓
components/ (reusable UI elements)
  ↓
pages/ (page-specific premium sections)
  ↓
main.css (imports everything)
```

### **JavaScript Architecture: Modular ES6**
```
services/ (data layer)
  ↓
modules/ (business logic)
  ↓
components/ (UI components)
  ↓
init.js (initialization)
```

### **HTML Architecture: Template-Based**
```
index.html (main page)
  ↓
#navbar → components/navbar.html (loaded via fetch)
  ↓
<main> (page content)
  ↓
#footer → components/footer.html (loaded via fetch)
```

---

## 🔄 **File Dependencies**

### **Critical Path: index.html**
```
index.html
  → css/main.css (loads all styles)
      → base/variables.css
      → components/*.css
      → pages/home.css ★
  → js/modules/init.js (loads components)
      → components/navbar.html
      → components/footer.html
  → js/services/storage.js
```

### **Module Import Chain**
```
init.js (entry point)
  → auth.js
  → cart.js
  → wishlist.js
  → ui.js
  → modals.js
  → search.js
  → navigation.js
  → mobileMenu.js
```

---

## 📝 **Naming Conventions**

### **CSS Files**
- **Lowercase with hyphens:** `auth-modal.css`, `payment-modal.css`
- **Component prefix:** `components/navbar.css`
- **Page prefix:** `pages/home.css`
- **CamelCase exception:** `ProductCard.css` (matches component)

### **JavaScript Files**
- **Lowercase with hyphens:** `auth-modals-updated.js`
- **Module structure:** `modules/auth.js`
- **Service suffix:** `services/storage.js`
- **CamelCase:** `shopLogic.js`, `productCard.js`

### **Directories**
- **Lowercase:** `css/`, `js/`, `assets/`, `components/`
- **Plural for collections:** `modules/`, `services/`, `pages/`

---

## 🎯 **Organization Principles**

1. **Separation of Concerns**
   - CSS organized by type (base, components, pages)
   - JS organized by function (modules, services, components)
   - HTML components separated from pages

2. **Modular Architecture**
   - Each module has a single responsibility
   - Components are reusable
   - Pages import what they need

3. **Scalability**
   - Easy to add new pages (add to `pages/`)
   - Easy to add components (add to `components/`)
   - Easy to add modules (add to `modules/`)

4. **Maintainability**
   - Clear folder structure
   - Consistent naming
   - Logical grouping

---

## 🚀 **Import Order (main.css)**

```css
1. Base Styles
   - variables.css
   - reset.css
   - typography.css

2. General Styles
   - general.css

3. Components
   - navbar.css
   - footer.css
   - buttons.css
   - cards.css
   - modals.css
   - forms.css
   - hero.css

4. Pages (Legacy)
   - home.css
   - shop.css
   - profile.css
   - contact.css
   - about.css
   - service.css

5. Pages (Premium)
   - pages/home.css ★
   - pages/about.css ★
   - pages/contact.css ★

6. Specialized
   - ProductCard.css
   - payment-modal.css
```

---

## ✅ **Best Practices Implemented**

✅ **Modular CSS** - Component-based architecture  
✅ **ES6 Modules** - Modern JavaScript structure  
✅ **Template Components** - Reusable HTML  
✅ **Service Layer** - Centralized data access  
✅ **Consistent Naming** - Clear conventions  
✅ **Logical Grouping** - Files organized by purpose  
✅ **Scalable Structure** - Easy to extend  
✅ **Version Control** - Git integrated  

---

## 📚 **Quick Navigation Guide**

**Want to edit...**
- **Home page sections?** → `css/pages/home.css`
- **About page sections?** → `css/pages/about.css`
- **Contact page sections?** → `css/pages/contact.css`
- **Navbar?** → `components/navbar.html` + `css/components/navbar.css`
- **Footer?** → `components/footer.html` + `css/components/footer.css`
- **Colors/spacing?** → `css/base/variables.css`
- **Buttons?** → `css/components/buttons.css`
- **Cards?** → `css/components/cards.css`
- **Shop logic?** → `js/shopLogic.js` + `js/modules/shop.js`
- **Auth logic?** → `js/modules/auth.js`
- **Cart?** → `js/modules/cart.js`

---

**This folder structure is designed for maximum organization, scalability, and maintainability!** 📁✨
