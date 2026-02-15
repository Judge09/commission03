# Shopping Cart & Favorites Implementation Guide

## Overview

This document describes the comprehensive shopping cart and favorites system implemented for the Soul Good PWA. The implementation includes global state management, localStorage persistence, visual feedback, and seamless backend synchronization.

---

## ✅ What Has Been Implemented

### 1. **Global State Management** ✅

**Location:** `src/contexts/CartContext.jsx`

**Features:**
- Manages two main arrays: `cartItems` and `favoriteItems`
- Persists data in `localStorage` for PWA offline support
- Syncs with backend API when online
- Provides centralized cart and favorites management

**Storage Keys:**
```javascript
'soulgood_cart'       // Cart items array
'soulgood_favorites'  // Favorite items array
```

**Context Methods:**
```javascript
// Cart operations
addToCart(item, quantity)          // Add item to cart
updateQuantity(cartItemId, newQty) // Update item quantity
removeFromCart(cartItemId)         // Remove item from cart
clearCart()                        // Clear entire cart
getItemQuantity(itemId)            // Get quantity for specific item
cartTotal                          // Computed total price
cartItemCount                      // Total number of items

// Favorites operations
toggleFavorite(item)               // Add/remove from favorites
isFavorite(itemId)                 // Check if item is favorited
```

---

### 2. **Favorites Logic (Heart Icon)** ✅

**Implementation:** `src/contexts/CartContext.jsx` → `toggleFavorite()`

**Features:**
- ✅ Toggle favorite status with single click
- ✅ Optimistic UI updates (instant feedback)
- ✅ Backend synchronization when online
- ✅ localStorage persistence for offline support
- ✅ Visual feedback: Filled red heart when active

**Visual States:**

| State | Background | Border | Heart Icon |
|-------|-----------|--------|------------|
| Normal | White | Light gray | Outline (empty) |
| Favorited | Orange 50 | Orange 300 | Filled (red) |
| **Active** (Favorited + In Cart) | **Orange 100** | **Orange 400** | **Filled (red)** |

**Design Spec Implementation:**
```javascript
// In MenuItemCard.jsx
const isActive = isFavorite && quantity > 0;

<Box
  bg={isActive ? "orange.100" : isFavorite ? "orange.50" : bg}
  borderColor={isActive ? "orange.400" : isFavorite ? "orange.300" : "rgba(0,0,0,0.05)"}
  shadow={isActive ? "lg" : "md"}
>
```

**Result:**
- ✅ Product card shows **orange highlight** when both favorited AND has quantity > 0
- ✅ Clear visual distinction between favorited vs active items

---

### 3. **Cart Logic** ✅

**Implementation:** `src/contexts/CartContext.jsx`

#### **addToCart(item, quantity)**
```javascript
// Add new item or increase quantity if exists
await addToCart(menuItem, 1);
```

**Features:**
- Checks if item already exists in cart
- If exists: Increases quantity
- If new: Adds with specified quantity
- Syncs with backend via `POST /api/cart`
- Instant UI update (optimistic)

#### **updateQuantity(cartItemId, newQuantity)**
```javascript
// Update quantity or remove if < 1
await updateQuantity(cartItemId, 3);
```

**Features:**
- Updates item quantity in cart
- If quantity < 1: Automatically removes item
- Syncs with backend via `PUT /api/cart/:id`
- Real-time total price update

#### **removeFromCart(cartItemId)**
```javascript
// Remove item from cart
await removeFromCart(cartItemId);
```

**Features:**
- Removes item from cart
- Syncs with backend via `DELETE /api/cart/:id`
- Updates cart badge and total instantly

#### **cartTotal Calculation**
```javascript
const cartTotal = useCallback(() => {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}, [cartItems]);
```

**Features:**
- ✅ Automatically recalculates when cart changes
- ✅ Real-time updates on quantity changes
- ✅ Displayed with "The Seasons" font as per design specs

---

### 4. **UI Integration** ✅

#### **Cart Badge on Navigation**

**Location:** `src/pages/Menu.jsx`

```javascript
<Button position="relative">
  View Cart
  {cartItemCount > 0 && (
    <Badge
      position="absolute"
      top="-5px"
      right="-5px"
      colorScheme="red"
      borderRadius="full"
    >
      {cartItemCount}
    </Badge>
  )}
</Button>
```

**Features:**
- ✅ Shows total item count (not unique items)
- ✅ Red badge for visibility
- ✅ Only appears when cart has items
- ✅ Updates in real-time

#### **Cart Page Rendering**

**Location:** `src/pages/Cart.jsx`

**Features:**
- ✅ Product names: "The Seasons" font (Cinzel)
- ✅ Prices: "The Seasons" font (Cinzel)
- ✅ "Total" label: "Lora" font
- ✅ Remove button with trash icon
- ✅ Number input for quantity adjustment
- ✅ Empty state with "Browse Menu" button
- ✅ "Continue Shopping" button in header

**Visual Layout:**
```
┌─────────────────────────────────┐
│ Your Cart    [Continue Shopping]│
├─────────────────────────────────┤
│ [Image] Product Name       [Qty]│
│         ₱Price          [Remove]│
├─────────────────────────────────┤
│ Total                    ₱99.99 │
│ [Proceed to Checkout Button]    │
└─────────────────────────────────┘
```

#### **Real-time Updates**

**When quantity changes:**
1. ✅ Cart item quantity updates instantly
2. ✅ Cart total recalculates automatically
3. ✅ Cart badge updates on navigation
4. ✅ Backend syncs in background
5. ✅ localStorage updated

**When item removed:**
1. ✅ Item disappears from cart
2. ✅ Total recalculates
3. ✅ Badge updates
4. ✅ Shows empty state if last item
5. ✅ Backend and localStorage updated

---

## 📁 File Structure

```
soul-good/
├── src/
│   ├── contexts/
│   │   ├── AuthContext.jsx              [EXISTING] Auth management
│   │   └── CartContext.jsx              [NEW] Cart & favorites
│   ├── components/
│   │   ├── MenuItemCard.jsx             [UPDATED] Visual feedback
│   │   └── ProtectedRoute.jsx           [EXISTING] Route guard
│   ├── pages/
│   │   ├── Menu.jsx                     [UPDATED] Cart integration
│   │   └── Cart.jsx                     [UPDATED] Context integration
│   └── App.jsx                          [UPDATED] CartProvider added
└── CART_FAVORITES_IMPLEMENTATION.md     [NEW] This document
```

---

## 🔄 Data Flow Diagram

### Adding Item to Cart

```
┌──────────┐
│   User   │ Clicks "Add to Cart"
└────┬─────┘
     │
     ▼
┌──────────────────────────┐
│   Menu.jsx               │ handleAddToCart(item)
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│   CartContext            │ addToCart(item, quantity)
└────┬─────────────────────┘
     │
     ├─────────────────┬─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
┌─────────┐    ┌──────────────┐  ┌──────────┐
│cartItems│    │ localStorage │  │  Backend │
│ State   │    │              │  │   API    │
└────┬────┘    └──────────────┘  └──────────┘
     │
     ▼
┌──────────────────────────┐
│  UI Updates:             │
│  • Cart badge            │
│  • Cart total            │
│  • Item quantity         │
└──────────────────────────┘
```

### Toggling Favorite

```
┌──────────┐
│   User   │ Clicks heart icon
└────┬─────┘
     │
     ▼
┌──────────────────────────┐
│   MenuItemCard           │ onToggleFavorite()
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│   CartContext            │ toggleFavorite(item)
└────┬─────────────────────┘
     │
     ├─────────────────┬─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────┐
│favoriteItems │ │ localStorage │ │  Backend │
│    State     │ │              │ │   API    │
└──────┬───────┘ └──────────────┘ └──────────┘
       │
       ▼
┌──────────────────────────┐
│  Visual Update:          │
│  • Heart icon fills      │
│  • Card background color │
│  • Border color          │
│  • Shadow (if in cart)   │
└──────────────────────────┘
```

---

## 🎨 Visual Design Implementation

### Product Card States

**1. Normal State (Default)**
```css
background: white
border: 2px solid rgba(0,0,0,0.05)
shadow: md
```

**2. Favorited (Heart clicked)**
```css
background: orange.50
border: 2px solid orange.300
shadow: md
heart: filled red
```

**3. Active (Favorited + In Cart)**
```css
background: orange.100          /* Darker orange */
border: 2px solid orange.400    /* Darker border */
shadow: lg                      /* Larger shadow */
heart: filled red
```

### Typography (Design Specs)

| Element | Font | Location |
|---------|------|----------|
| Product Names (Cards) | The Seasons (Cinzel) | MenuItemCard |
| Product Names (Cart) | The Seasons (Cinzel) | Cart.jsx |
| Prices | The Seasons (Cinzel) | MenuItemCard, Cart.jsx |
| "Your Cart" Heading | Lora | Cart.jsx |
| "Total" Label | Lora | Cart.jsx |
| Category Selector | Lora | Menu.jsx |
| Search Input | Lora | Menu.jsx |

---

## 📊 Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| **Cart Persistence** | ✅ | localStorage + backend sync |
| **Favorites Persistence** | ✅ | localStorage + backend sync |
| **Optimistic Updates** | ✅ | Instant UI feedback |
| **Cart Badge** | ✅ | Shows item count on "View Cart" |
| **Visual Highlights** | ✅ | Orange background for active items |
| **Real-time Total** | ✅ | Recalculates on every change |
| **Quantity Controls** | ✅ | +/- buttons with number input |
| **Remove Items** | ✅ | Trash icon button |
| **Empty State** | ✅ | "Browse Menu" button |
| **Offline Support** | ✅ | Works without internet |

---

## 🧪 Testing Checklist

### Cart Operations
- ✅ **Add to cart:** Item appears in cart with quantity 1
- ✅ **Add existing:** Quantity increments instead of duplicate
- ✅ **Update quantity:** +/- buttons work correctly
- ✅ **Remove item:** Item disappears from cart
- ✅ **Cart badge:** Updates to show correct count
- ✅ **Cart total:** Recalculates on any change
- ✅ **Empty cart:** Shows "Your cart is empty" message

### Favorites Operations
- ✅ **Toggle favorite:** Heart fills/empties on click
- ✅ **Card highlight:** Background changes to orange
- ✅ **Active state:** Darker orange when favorited + in cart
- ✅ **Persistence:** Favorites survive page refresh
- ✅ **Sync:** Backend updates when online

### PWA Offline Support
- ✅ **Add to cart offline:** Saves to localStorage
- ✅ **Toggle favorite offline:** Saves to localStorage
- ✅ **View cart offline:** Displays cached items
- ✅ **Go online:** Syncs changes to backend
- ✅ **Page refresh:** Data persists from localStorage

---

## 🔧 Configuration

### localStorage Keys

```javascript
// Storage format
localStorage.setItem('soulgood_cart', JSON.stringify([
  {
    id: 123,                    // Cart item ID (from backend)
    itemId: 456,                // Product ID
    name: "Avocado Smoothie",
    price: 150,
    quantity: 2,
    image: "/1.png",
    userId: 789
  }
]));

localStorage.setItem('soulgood_favorites', JSON.stringify([
  {
    id: 456,        // Product ID
    userId: 789     // User ID
  }
]));
```

### Backend API Endpoints

```javascript
// Cart endpoints
POST   /api/cart              // Add item to cart
GET    /api/cart?userId=X     // Get user's cart
PUT    /api/cart/:id          // Update quantity
DELETE /api/cart/:id          // Remove item

// Favorites endpoints
POST   /api/favorites         // Add to favorites
GET    /api/favorites?userId=X // Get user's favorites
DELETE /api/favorites         // Remove favorite
```

---

## 🚀 Usage Examples

### Using CartContext in Components

```javascript
import { useCart } from '../contexts/CartContext';

function MyComponent() {
  const {
    // Cart state
    cartItems,
    cartTotal,
    cartItemCount,

    // Cart methods
    addToCart,
    updateQuantity,
    removeFromCart,
    getItemQuantity,

    // Favorites state
    favoriteItems,
    isFavorite,

    // Favorites methods
    toggleFavorite,
  } = useCart();

  // Add to cart
  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
  };

  // Toggle favorite
  const handleToggleFavorite = (product) => {
    toggleFavorite(product);
  };

  // Check quantity
  const quantity = getItemQuantity(product.id);

  return (
    <div>
      <p>Cart Total: ₱{cartTotal.toFixed(2)}</p>
      <p>Items in cart: {cartItemCount}</p>
    </div>
  );
}
```

---

## 📝 Known Limitations

1. **Backend Sync:** Relies on backend endpoints that need JWT authentication (from PWA_AUTH_IMPLEMENTATION.md)
2. **Conflict Resolution:** No conflict resolution if same user edits cart from multiple devices
3. **Stock Management:** No stock checking (can add unlimited quantities)
4. **Promo Codes:** Not implemented
5. **Order History:** Not implemented

---

## 🔮 Future Enhancements

1. **Order Placement:** Complete checkout flow
2. **Order History:** View past orders
3. **Saved Carts:** Multiple saved carts
4. **Share Cart:** Share cart link with others
5. **Cart Expiration:** Auto-clear old cart items
6. **Stock Alerts:** Notify when favorited items are back in stock
7. **Price Alerts:** Notify when favorited items go on sale

---

## 📞 Related Documentation

- **Authentication System:** See [PWA_AUTH_IMPLEMENTATION.md](PWA_AUTH_IMPLEMENTATION.md)
- **Design System:** See [SYSTEM_ASSESSMENT.md](SYSTEM_ASSESSMENT.md)
- **API Documentation:** See `/server/README.md`

---

**Last Updated:** February 2026
**Implementation Status:** ✅ Complete
**PWA Ready:** ✅ Yes (localStorage persistence + offline support)
