# AGRIPOOL APPLICATION - COMPREHENSIVE DOCUMENTATION

## 🏗️ ARCHITECTURE OVERVIEW

**AgriPool** is a **full-stack web application** that connects farmers, equipment owners, drivers, and buyers for agricultural resource sharing and logistics. It uses:

- **Backend**: Laravel 12 (PHP framework)
- **Frontend**: React 18 + Vite (JavaScript framework)
- **Real-time Communication**: Laravel Reverb (WebSocket-based)
- **Database**: MongoDB (via laravel-mongodb)
- **Authentication**: JWT tokens + Google OAuth + Turnstile CAPTCHA
- **Payments**: Razorpay integration
- **Hosting**: Deployed as API-first architecture

---

## 📊 TECH STACK & WHY EACH TECHNOLOGY IS USED

| Component | Technology | Why Used |
|-----------|-----------|---------|
| **Backend Language** | PHP 8.2+ | Server-side logic, security, database operations |
| **Framework** | Laravel 12 | Enterprise-grade MVC, built-in auth, migrations, ORM (Eloquent) |
| **Real-time** | Laravel Reverb | WebSocket support for live chat, notifications, map updates |
| **Database** | MongoDB | Flexible schema for documents, good for scaling |
| **Frontend** | React 18 | Component-based UI, fast rendering, large ecosystem |
| **Build Tool** | Vite 7 | Fast bundling, hot module replacement for development |
| **Styling** | Tailwind CSS 4 | Utility-first CSS, rapid UI development |
| **HTTP Client** | Axios | Promise-based API requests |
| **Security** | Turnstile CAPTCHA | Bot prevention during registration/login |
| **Testing** | PHPUnit | Backend unit & feature testing |

---

## 📁 BACKEND STRUCTURE (Laravel)

### 1. Routes (`routes/api.php` & `routes/web.php`)

#### API Routes (`routes/api.php`) - All API endpoints for the React frontend:

**Authentication Endpoints:**
- `POST /api/auth/register` - User registration with Turnstile verification
- `POST /api/auth/login` - User login with credentials
- `POST /api/auth/turnstile-verify` - Verify Cloudflare CAPTCHA token
- `POST /api/auth/oauth/exchange` - Google OAuth token exchange
- `GET /api/auth/user` - Get current authenticated user (protected)
- `POST /api/logout` - Logout user (protected)
- `PATCH /api/user/role` - Update user role (protected)

**Dashboard Endpoints:**
- `GET /api/dashboard` - Get user dashboard stats (protected)

**Bookings Endpoints:**
- `GET /api/bookings` - List user's bookings (protected)
- `POST /api/bookings` - Create new booking (protected)
- `GET /api/bookings/:id` - View single booking detail (protected)
- `POST /api/bookings/:id/accept` - Driver accepts booking (protected)
- `POST /api/bookings/:id/reject` - Decline booking (protected)
- `GET /api/bookings/map-markers` - Active bookings for map display (protected)

**Conversations (Chat) Endpoints:**
- `GET /api/bookings/:id/conversation` - Get booking chat messages (protected)
- `POST /api/conversations/:id/messages` - Send new message (protected)

**Equipment Endpoints:**
- `GET /api/equipment` - List equipment (protected)
- `POST /api/equipment` - Create equipment listing (protected)
- `PUT /api/equipment/:id` - Update equipment (protected)
- `DELETE /api/equipment/:id` - Delete equipment (protected)

**Vehicle Endpoints:**
- `GET /api/vehicle` - Get driver's vehicle info (protected)
- `POST /api/vehicle` - Add vehicle (protected)
- `PUT /api/vehicle` - Update vehicle (protected)

**Payment Endpoints:**
- `POST /api/payments/create-order` - Create Razorpay order (protected)
- `POST /api/payments/verify` - Verify payment signature (protected)
- `POST /api/payments/demo-complete` - Demo payment completion (protected)
- `GET /api/payments/history` - User's payment history (protected)
- `GET /api/payments/:id` - Get payment details (protected)
- `GET /api/payments/:id/receipt` - Get payment receipt (protected)

**Analytics Endpoints (Admin Only):**
- `GET /api/analytics/revenue-chart` - Revenue statistics
- `GET /api/analytics/stats` - General platform stats

**Web Routes (`routes/web.php`):**
- `GET /auth/google/redirect` - Redirect to Google login
- `GET /auth/google/callback` - Google OAuth callback handler
- `GET /{any?}` - SPA catch-all route (serves React app)

### 2. Controllers (`app/Http/Controllers/`)

Controllers handle incoming requests and return JSON responses:

#### AuthController (`app/Http/Controllers/Api/AuthController.php`)
**Purpose:** Manage user authentication, registration, login, and OAuth

```php
Key Methods:
- register() 
  → Validates input (name, email, password)
  → Verifies Turnstile CAPTCHA token
  → Creates user in database
  → Issues JWT token
  → Returns user data + token

- login()
  → Validates credentials
  → Verifies password with Hash::check()
  → Issues JWT token
  → Returns user data + token

- exchangeOAuthCode()
  → Exchanges Google OAuth code for user data
  → Creates/updates user in database
  → Issues JWT token

- user()
  → Returns current authenticated user profile
  
- updateRole()
  → Updates user role (farmer/driver/equipment_owner/buyer)
  
- logout()
  → Invalidates user session
```

#### BookingController (`app/Http/Controllers/Api/BookingController.php`)
**Purpose:** Manage equipment rental and delivery bookings

```php
Key Methods:
- index()
  → Retrieves all bookings for authenticated user
  → Filters by role and status
  
- store()
  → Creates new booking/rental request
  → Validates: equipment, dates, location, quantity
  → Notifies equipment owner/driver
  
- show()
  → Returns single booking with all details
  → Includes linked messages, status history
  
- accept()
  → Driver/Equipment owner accepts booking
  → Changes status from 'pending' to 'assigned'
  → Broadcasts notification via Reverb
  
- reject()
  → Decline booking offer
  → Sends notification to requester
  
- mapMarkers()
  → Returns active bookings with GPS coordinates
  → Used for Leaflet map display
```

#### ConversationController (`app/Http/Controllers/Api/ConversationController.php`)
**Purpose:** Handle in-app messaging linked to bookings

```php
Key Methods:
- show()
  → Fetches all messages for a specific booking
  → Returns paginated results
  
- store()
  → Saves new message to database
  → Broadcasts via Reverb WebSocket
  → Notifies other conversation participant
```

#### PaymentController (`app/Http/Controllers/Api/PaymentController.php`)
**Purpose:** Handle Razorpay payment integration

```php
Key Methods:
- createOrder()
  → Creates Razorpay order
  → Returns order ID and key
  → Frontend uses to open Razorpay modal
  
- verify()
  → Verifies Razorpay payment signature
  → Confirms payment authenticity
  → Updates payment record in database
  
- history()
  → Returns user's payment history
  → Includes order details, amounts, timestamps
```

#### DashboardController (`app/Http/Controllers/Api/DashboardController.php`)
**Purpose:** Provide dashboard statistics and overview

```php
Key Methods:
- index()
  → Returns role-specific stats:
    - Farmers: active bookings, earnings
    - Drivers: deliveries completed, earnings
    - Equipment Owners: equipment leased, revenue
  → Includes charts data for frontend
```

#### EquipmentController (`app/Http/Controllers/Api/EquipmentController.php`)
**Purpose:** Manage equipment listings and inventory

```php
Key Methods:
- index() → List available equipment
- store() → Create equipment listing
- update() → Update equipment details
- destroy() → Delete equipment listing
```

#### VehicleController (`app/Http/Controllers/Api/VehicleController.php`)
**Purpose:** Manage driver vehicle information

```php
Key Methods:
- show() → Get driver's vehicle
- store() → Add new vehicle
- update() → Update vehicle details
```

#### AnalyticsController (`app/Http/Controllers/Api/AnalyticsController.php`)
**Purpose:** Provide admin analytics and reporting

```php
Key Methods:
- revenueChart() → Platform revenue data
- stats() → Overall platform statistics
```

### 3. Models (`app/Models/`) - Database Objects (Eloquent ORM)

#### User.php
**Purpose:** Represents user accounts

```
Attributes:
- id: Unique identifier
- name: Full name
- email: Email address (unique)
- password: Hashed password
- role: User type (farmer, driver, equipment_owner, buyer, admin)
- google_id: Google OAuth identifier
- last_seen_at: Last activity timestamp
- is_online: Real-time online status
- created_at, updated_at: Timestamps

Relationships:
- farmerDeliveries() → Deliveries where user is farmer
- driverDeliveries() → Deliveries where user is driver
- vehicles() → User's registered vehicles
- bookings() → User's bookings
- conversations() → Conversations user participates in
- payments() → User's payment history
```

#### PooledBooking.php / BookingCrop.php / BookingOffer.php
**Purpose:** Equipment rental and delivery booking management

```
Booking Attributes:
- id: Booking identifier
- farmer_id: User requesting equipment
- driver_id: User accepting delivery
- equipment_id: Equipment being rented
- status: pending → assigned → in_transit → completed
- quantity: Amount of equipment
- start_date, end_date: Rental period
- pickup_location, delivery_location: GPS coordinates
- total_amount: Cost in rupees
- created_at, updated_at: Timestamps

Relationships:
- farmer() → User model
- driver() → User model
- equipment() → Equipment model
- conversation() → Conversation model
- messages() → Linked chat messages
- statusLogs() → History of status changes
```

#### BookingStatusLog.php
**Purpose:** Audit trail of booking status changes

```
Attributes:
- booking_id: Which booking
- old_status: Previous status
- new_status: Updated status
- reason: Why status changed
- created_at: When change happened
```

#### Payment.php
**Purpose:** Payment transaction records

```
Attributes:
- id: Payment identifier
- user_id: Payer
- booking_id: Associated booking
- razorpay_order_id: Razorpay order ID
- razorpay_payment_id: Razorpay payment ID
- amount: Payment amount in rupees
- status: pending → completed → failed
- created_at, updated_at: Timestamps

Relationships:
- user() → User model
- booking() → Booking model
```

#### Conversation.php & Message.php
**Purpose:** In-app messaging system

```
Conversation Attributes:
- id: Conversation identifier
- booking_id: Associated booking
- participant_ids: Array of user IDs
- created_at, updated_at

Message Attributes:
- id: Message identifier
- conversation_id: Which conversation
- user_id: Message sender
- content: Message text
- is_read: Read status
- created_at, updated_at

Relationships:
- conversation() → Conversation model
- sender() → User model
```

#### Vehicle.php
**Purpose:** Driver vehicle details

```
Attributes:
- id: Vehicle identifier
- user_id: Driver who owns vehicle
- vehicle_type: Type (truck, car, bike, etc.)
- capacity: Cargo capacity in kg/liters
- registration_number: License plate
- year: Manufacturing year
- created_at, updated_at

Relationships:
- driver() → User model
```

#### Equipment / Delivery
**Purpose:** Additional domain models for inventory and logistics

```
Equipment:
- name, type, specifications
- owner_id, location
- availability_status
- rental_rate_per_day

Delivery:
- farmer_id, driver_id
- crop_type, quantity
- pickup_date, estimated_delivery
- status_logs
```

### 4. Services (`app/Services/`)

#### TurnstileService.php
**Purpose:** Cloudflare bot verification

```php
Methods:
- verifyRequest(Request $request)
  → Extracts Turnstile token from request
  → Calls Cloudflare API with secret key
  → Returns true/false based on verification
  
Usage in AuthController:
if (!$this->turnstile->verifyRequest($request)) {
    throw ValidationException::withMessages([
        'turnstile' => ['Verification failed']
    ]);
}
```

#### SpaTokenService.php
**Purpose:** JWT token management for SPA authentication

```php
Methods:
- issue(User $user)
  → Generates JWT token
  → Encodes user data (id, email, role)
  → Returns token string
  
- decode(string $token)
  → Verifies token signature
  → Extracts user data
  → Returns decoded token
```

#### SiteAssistantService.php
**Purpose:** AI chatbot for site assistance (placeholder for future)

```php
Could handle:
- FAQ responses
- Booking guidance
- User support
```

### 5. Database Migrations (`database/migrations/`)

Migrations are timestamped PHP files that create/modify database tables:

```
0001_01_01_000000_create_users_table.php
  → Creates users table with columns:
    id, name, email, password, role, 
    google_id, last_seen_at, is_online,
    email_verified_at, created_at, updated_at

0001_01_01_000001_create_cache_table.php
  → Laravel cache table

0001_01_01_000002_create_jobs_table.php
  → Background job queue table

2026_05_17_000100_add_role_and_google_id_to_users_table.php
  → Adds role and google_id columns

2026_05_17_000200_create_deliveries_table.php
  → Creates deliveries table with:
    id, farmer_id, driver_id, crop_type,
    quantity, pickup_location, delivery_location,
    status, created_at, updated_at

[Additional migrations for bookings, payments, conversations, etc.]
```

### 6. Middleware & Security

**SPA Auth Middleware** (`app/Http/Middleware/SpaAuth.php`)
- Verifies JWT token in Authorization header
- Checks token validity and expiration
- Blocks requests without valid token (returns 401)

**CORS Configuration** (`config/cors.php`)
- Allows requests from frontend domain
- Permits credentials in requests
- Allows specific HTTP methods (GET, POST, PUT, DELETE)

---

## ⚛️ FRONTEND STRUCTURE (React + Vite)

### 1. Entry Point (`frontend/src/main.jsx`)

```javascript
Responsibilities:
- Mounts React to #root DOM element
- Wraps app with essential providers:
  
  1. BrowserRouter
     → React Router for navigation
     → Enables useNavigate(), useParams() hooks
  
  2. ThemeProvider
     → Manages dark/light mode state
     → Toggles CSS classes for styling
  
  3. LanguageProvider
     → Internationalization (i18n)
     → Supports multi-language UI
  
  4. Toaster (react-hot-toast)
     → Shows toast notifications
     → Success, error, warning messages

- Renders <App /> component
```

### 2. Main App Component (`frontend/src/App.jsx`)

Routes all requests to appropriate pages based on URL:

```javascript
PUBLIC ROUTES (No authentication required):
- / → Home.jsx (Landing page)
- /login → Login.jsx (User login form)
- /register → Register.jsx (Registration form)
- /forgot-password → ForgotPassword.jsx
- /reset-password → ResetPassword.jsx
- /verify-email → VerifyEmail.jsx
- /auth/oauth/callback → OAuthCallback.jsx (Google OAuth)

ROLE SELECTION:
- /role-selection → RoleSelection.jsx (Choose farmer/driver/owner)

ONBOARDING (Protected):
- /onboarding/farmer → FarmerOnboarding.jsx (Farm details)
- /onboarding/driver → DriverOnboarding.jsx (Vehicle info)
- /onboarding/equipment-owner → EquipmentOwnerOnboarding.jsx
- /onboarding/buyer → BuyerOnboarding.jsx

DASHBOARD (Protected, role-based):
- /dashboard → DashboardRouter.jsx
  → /dashboard/farmer → FarmerDashboard.jsx
  → /dashboard/driver → DriverDashboard.jsx
  → /dashboard/equipment-owner → EquipmentOwnerDashboard.jsx
  → /dashboard/buyer → BuyerDashboard.jsx
  → /dashboard/admin → AdminDashboard.jsx

EQUIPMENT BROWSING:
- /equipment → BrowseEquipment.jsx (List all equipment)
- /equipment/:id → EquipmentDetail.jsx (Single equipment)
- /equipment/manage → ManageEquipment.jsx (Owner's listings)

BOOKINGS:
- /bookings → BookingsList.jsx (User's bookings)
- /bookings/:id → BookingDetail.jsx (Single booking)
- /bookings/create → CreateBooking.jsx (New booking form)

MARKETPLACE:
- /marketplace → BrowseProducts.jsx
- /marketplace/:id → ProductDetail.jsx

MESSAGING:
- /messages → Messages.jsx (Real-time chat)

MAP:
- /map → MapPage.jsx (Active bookings map)

PAYMENTS:
- /payments/checkout → PaymentCheckout.jsx
- /payments/success → PaymentSuccess.jsx
- /payments/failed → PaymentFailed.jsx
- /payments/history → PaymentHistory.jsx

SETTINGS:
- /settings → Settings.jsx (User preferences)
- /saved → SavedPage.jsx (Saved listings)

ADMIN (Protected):
- /admin/users → AdminUsers.jsx
- /admin/verification → AdminVerification.jsx
- /admin/moderation → AdminModeration.jsx
- /admin/analytics → AdminAnalytics.jsx
- /admin/notifications → AdminNotifications.jsx
```

### 3. Layout Components (`frontend/src/layouts/`)

Reusable page templates:

#### PublicLayout.jsx
```
Used for: Home, Login, Register pages
Contents:
- Navbar (with login/register buttons)
- Main content area
- Footer
- No sidebar (for simplicity)
```

#### AuthLayout.jsx
```
Used for: Login, Register, Password Reset
Contents:
- Minimal navbar
- Center-aligned form
- Logo/branding
- Link to other auth pages
```

#### DashboardLayout.jsx
```
Used for: Authenticated pages (dashboard, bookings, etc.)
Contents:
- Top navigation bar
- Left sidebar (menu, user profile)
- Main content area
- Responsive (sidebar collapses on mobile)
```

#### OnboardingLayout.jsx
```
Used for: Role selection, onboarding forms
Contents:
- Progress indicator (step 1/2/3)
- Form section
- Next/Previous buttons
```

### 4. Components (`frontend/src/components/`)

Reusable UI building blocks:

#### auth/ - Authentication components
```
LoginForm.jsx
- Email and password inputs
- Validation using Zod schema
- Turnstile CAPTCHA widget
- Calls POST /api/auth/login
- Stores JWT token in localStorage
- Redirects to dashboard

RegisterForm.jsx
- Name, email, password, confirm password
- Turnstile CAPTCHA
- Calls POST /api/auth/register
- Auto-login after registration

GoogleOAuthButton.jsx
- Redirects to /auth/google/redirect
- Receives Google OAuth code
- Exchanges via /api/auth/oauth/exchange
- Stores token and user data
```

#### booking/ - Booking display components
```
BookingCard.jsx
- Shows booking summary
- Status badge (pending, assigned, in_transit, completed)
- Price, location, dates
- Accept/Reject buttons (for offers)
- Click to view details

BookingMap.jsx
- Leaflet map showing active bookings
- Markers for pickup/delivery locations
- Clicking marker shows booking info

BookingForm.jsx
- Equipment selection dropdown
- Date picker for rental period
- Quantity input
- Location search field
- Submits to POST /api/bookings
```

#### chat/ - Real-time messaging
```
ChatWindow.jsx
- Displays conversation messages
- Scrollable message list
- User avatars and timestamps
- Auto-scroll to latest message

MessageInput.jsx
- Text input field
- Send button
- Attaches booking context
- Calls POST /api/conversations/:id/messages

ConversationPanel.jsx
- List of active conversations
- Shows unread count
- Click to switch conversation
- Shows last message preview
```

#### map/ - Leaflet integration
```
MapComponent.jsx
- Initializes Leaflet map
- Fetches map markers from /api/bookings/map-markers
- Draws markers at GPS coordinates
- Click marker for booking details
- Fixes sizing with invalidateSize()
```

#### payments/ - Razorpay integration
```
RazorpayButton.jsx
- POST /api/payments/create-order
- Receives order ID and Razorpay key
- Opens Razorpay.Checkout modal
- Calls handlePaymentSuccess on completion
- Verifies with POST /api/payments/verify

PaymentForm.jsx
- Booking selection
- Amount confirmation
- Razorpay button
- Success/failure messages
```

#### layout/ - Layout components
```
Navbar.jsx
- Logo and site name
- Links to main pages
- User dropdown menu
- Mobile hamburger menu

Sidebar.jsx
- Navigation menu
- Dashboard links by role
- Equipment, bookings, messages links
- User profile section
- Logout button

Footer.jsx
- Company info
- Social links
- Terms of service
```

#### shared/ - Common components
```
ProtectedRoute.jsx
- Checks if user is authenticated
- Redirects unauthenticated users to login
- Wraps protected pages

LoadingSpinner.jsx
- Shows during data loading
- Centered with animation

ErrorBoundary.jsx
- Catches React errors
- Shows error message
- Provides recovery button
```

#### ui/ - Reusable UI elements
```
Button.jsx
- Variants: primary, secondary, danger
- Sizes: small, medium, large
- Disabled state
- Loading state

Input.jsx
- Text input field
- Email input
- Password input
- Error message display
- Placeholder text

Modal.jsx
- Modal dialog
- Title and close button
- Scrollable content area
- Action buttons (confirm, cancel)

Card.jsx
- Container with rounded corners
- Shadow and border
- Padding and spacing
- Used for content cards

Badge.jsx
- Status badge (pending, assigned, etc.)
- Color-coded by status
- Used in lists and cards

Select.jsx
- Dropdown menu
- Multiple options
- Search/filter
- Validation states
```

### 5. Pages (`frontend/src/pages/`)

Full page components (not reusable):

```
Home.jsx
- Landing page
- Features section
- Call-to-action buttons
- No authentication required
- Hero image and testimonials

Login.jsx
- Uses LoginForm component
- Layout: AuthLayout
- Links to register and forgot-password

Register.jsx
- Uses RegisterForm component
- Turnstile CAPTCHA
- Terms checkbox
- Auto-redirects to role-selection

RoleSelection.jsx
- Card layout for each role:
  - Farmer (rent equipment)
  - Driver (deliver goods)
  - Equipment Owner (list equipment)
  - Buyer (purchase goods)
- PATCH /api/user/role
- Redirects to role-specific onboarding

FarmerOnboarding.jsx
- Farm name, location, crops
- Land size, preferred equipment types
- Save and proceed

DriverOnboarding.jsx
- Vehicle type, capacity, registration
- Service areas (map)
- License details

EquipmentOwnerOnboarding.jsx
- Equipment catalog
- Rental rates and availability
- Photos upload

FarmerDashboard.jsx
- Active bookings list
- Equipment requests status
- Recent messages count
- Upcoming deliveries
- Quick create booking button

DriverDashboard.jsx
- Available bookings/offers
- Active deliveries
- Earnings this month
- Completed trips count
- Accept/reject buttons

Dashboard.jsx
- Redirects to role-specific dashboard
- Shows user profile

BrowseEquipment.jsx
- List of available equipment
- Filters by type, location, price
- Search bar
- Shows equipment cards with ratings

EquipmentDetail.jsx
- Equipment photos/gallery
- Specifications (capacity, condition)
- Owner information
- Reviews and ratings
- Book/Rent button

CreateBooking.jsx
- Equipment selection
- Quantity and dates
- Location auto-fill from user profile
- Additional notes
- Submit to POST /api/bookings

BookingDetail.jsx
- Full booking information
- Driver/Equipment owner details
- Chat window (Messages component)
- Payment button
- Status history timeline
- Cancel booking option

BookingsList.jsx
- Table of all user bookings
- Status filters
- Sort by date
- Quick view button
- Pagination

Messages.jsx
- List of conversations on left
- Chat window on right
- Real-time message display
- Typing indicator
- Message timestamps

MapPage.jsx
- Full-screen Leaflet map
- All active booking locations
- Click for booking preview
- Filter by type/status

PaymentCheckout.jsx
- Order summary
- Amount breakdown
- Razorpay button
- Terms agreement

PaymentSuccess.jsx
- Confirmation message
- Order receipt preview
- Download receipt button
- Return to dashboard link

PaymentHistory.jsx
- Table of past payments
- Amount, date, status
- Download receipt link
- Filter by date range

Settings.jsx
- Update profile info
- Change password
- Notification preferences
- Privacy settings
- Delete account option

ManageEquipment.jsx
- Owner's equipment list
- Edit/delete buttons
- Add new equipment button
- View inquiry count

AdminUsers.jsx
- Table of all users
- Filter by role
- Suspend/verify user buttons
- View user details

AdminAnalytics.jsx
- Revenue chart
- Booking statistics
- User growth graph
- Conversion metrics
```

### 6. State Management & Context (`frontend/src/context/`, `frontend/src/store/`)

#### AuthContext.jsx
```javascript
Global authentication state shared across app

State:
- currentUser (object)
  {
    id: 1,
    name: "John Farmer",
    email: "john@example.com",
    role: "farmer",
    isOnboarded: true
  }
- isAuthenticated (boolean)
- isLoading (boolean)
- error (string or null)
- token (JWT token from localStorage)

Methods:
- login(email, password)
  → POST /api/auth/login
  → Store token
  → Fetch user data from /api/user
  
- logout()
  → Clear token from localStorage
  → Reset currentUser to null
  → Redirect to home

- updateRole(newRole)
  → PATCH /api/user/role
  → Update currentUser.role
  → Redirect to appropriate dashboard

- fetchCurrentUser()
  → GET /api/user
  → Called on app mount to verify token
  → Redirect to login if invalid

Usage:
const { currentUser, login, logout } = useAuth();
```

#### ThemeContext.jsx
```javascript
Dark/Light mode toggle

State:
- theme (light | dark)
- systemPreference (follows OS setting)

Methods:
- toggleTheme()
  → Switch between light and dark
  → Save to localStorage
  → Apply CSS class to document

Usage:
const { theme, toggleTheme } = useTheme();
```

#### LanguageContext.jsx
```javascript
Multi-language support

State:
- currentLanguage (en, hi, etc.)
- translations (object with all strings)

Methods:
- setLanguage(lang)
  → Load translation file
  → Update UI language
  → Save to localStorage

- t(key)
  → Get translated string
  → Falls back to English if missing

Usage:
const { t, currentLanguage } = useLanguage();
return <h1>{t('dashboard.title')}</h1>;
```

### 7. Utilities & Services (`frontend/src/lib/`, `frontend/src/services/`)

#### axiosInstance.js
```javascript
Configured HTTP client for all API calls

Configuration:
- baseURL: import.meta.env.VITE_API_URL
- Headers:
  - Authorization: `Bearer ${token}`
  - Content-Type: application/json
  
- Interceptors:
  - Request: Add token to all requests
  - Response: Handle 401 errors (redirect to login)
  - Error: Format error messages

Usage:
axiosInstance.post('/auth/login', credentials)
  .then(response => response.data)
  .catch(error => error.response.data)
```

#### echoInstance.js
```javascript
Laravel Echo client for WebSocket connections

Configuration:
- broadcaster: reverb
- key: import.meta.env.VITE_REVERB_APP_KEY
- wsHost: import.meta.env.VITE_REVERB_HOST
- wsPort: import.meta.env.VITE_REVERB_PORT
- token: JWT token for authentication

Channel Subscriptions:
- private-conversation.{booking_id}
  → Listen for new messages
  → Receive real-time updates

Events:
- ConversationMessageSent
  → Broadcast when message sent
  → Update message list instantly
```

#### api.js / apiService.js
```javascript
Wrapper functions for common API calls

Examples:
export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/logout'),
  getUser: () => axiosInstance.get('/user'),
}

export const bookingAPI = {
  list: () => axiosInstance.get('/bookings'),
  create: (data) => axiosInstance.post('/bookings', data),
  accept: (id) => axiosInstance.post(`/bookings/${id}/accept`),
  reject: (id) => axiosInstance.post(`/bookings/${id}/reject`),
}

Usage:
const { data } = await bookingAPI.list();
```

### 8. Custom Hooks (`frontend/src/hooks/`)

Reusable logic components:

#### useAuth.js
```javascript
Access authentication context

Returns:
{
  currentUser,
  isAuthenticated,
  login,
  logout,
  updateRole,
  isLoading,
  error
}

Usage:
const { currentUser, logout } = useAuth();
if (!currentUser) return <Redirect to="/login" />;
```

#### useApi.js
```javascript
Make API calls with loading/error handling

Usage:
const { data, loading, error } = useApi(
  () => axiosInstance.get('/bookings'),
  true // run immediately
);

if (loading) return <Spinner />;
if (error) return <ErrorMessage />;
return <BookingList bookings={data} />;
```

#### useMobileMenu.js
```javascript
Toggle mobile navigation menu

Returns:
{
  isOpen: boolean,
  open: function,
  close: function,
  toggle: function
}
```

#### useLocalStorage.js
```javascript
Persist data to browser localStorage

Usage:
const [token, setToken] = useLocalStorage('authToken', '');
setToken(newToken); // Auto-saves to localStorage
```

#### useDebounce.js
```javascript
Debounce search/filter inputs

Usage:
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  api.search(debouncedSearch);
}, [debouncedSearch]);
```

### 9. Configuration (`frontend/src/config/`)

#### environment.js / config.js
```javascript
Environment variables and constants

VITE_API_URL=http://localhost:8000/api
VITE_REVERB_APP_KEY=agripool-local
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=ws

// Constants
export const BOOKING_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
}

export const USER_ROLES = {
  FARMER: 'farmer',
  DRIVER: 'driver',
  EQUIPMENT_OWNER: 'equipment_owner',
  BUYER: 'buyer',
  ADMIN: 'admin',
}
```

### 10. Styling

#### index.css / tailwind.config.cjs
```
Base Tailwind configuration:
- Color palette: Green (#1f8f5f), blue, orange
- Typography: Inter font
- Dark mode: class-based
- Spacing scale (consistent padding/margin)

Status color mapping:
- pending: #FF9500 (orange)
- assigned: #2b5fbf (blue)
- in_transit: #FF6B6B (red)
- completed: #10c8a6 (teal)
```

---

## 🔄 HOW PAGES WORK TOGETHER - USER JOURNEYS

### Journey 1: Equipment Rental (Farmer's Perspective)

```
1. HOME PAGE (/)
   ↓ Unauthenticated user sees landing page
   ↓ Clicks "Get Started" → Register
   
2. REGISTER PAGE (/register)
   ↓ Form: name, email, password
   ↓ Turnstile CAPTCHA verification
   ↓ POST /api/auth/register
   ↓ Receives: JWT token + user object
   ↓ Token stored in localStorage
   
3. ROLE SELECTION PAGE (/role-selection)
   ↓ Choose: Farmer
   ↓ PATCH /api/user/role
   ↓ Redirects to onboarding
   
4. FARMER ONBOARDING (/onboarding/farmer)
   ↓ Input farm details: location, crops, equipment needs
   ↓ Save to database
   ↓ Redirects to /dashboard/farmer
   
5. FARMER DASHBOARD (/dashboard/farmer)
   ↓ Shows dashboard stats
   ↓ Featured equipment from other farmers
   ↓ "Request Equipment" button
   
6. CREATE BOOKING (/bookings/create)
   ↓ Select equipment from dropdown
   ↓ Choose rental dates
   ↓ Enter quantity
   ↓ Pickup location (auto-filled from profile)
   ↓ POST /api/bookings
   ↓ Returns booking ID
   
7. BOOKING DETAIL (/bookings/:id)
   ↓ Shows equipment details
   ↓ "Driver offers" list
   ↓ Equipment owner/driver names
   ↓ Accept/Reject offer buttons
   ↓ Opens chat for communication
   
8. MESSAGES PAGE (/messages)
   ↓ SELECT conversation from list
   ↓ Connects to WebSocket (Reverb)
   ↓ Echo.channel('private-conversation.{id}')
   ↓ Listens for ConversationMessageSent event
   ↓ Type message + Send
   ↓ POST /api/conversations/:id/messages
   ↓ Server broadcasts via Reverb
   ↓ Other user's Echo listener receives event
   ↓ Message appears instantly in chat window
   
9. PAYMENT CHECKOUT (/payments/checkout)
   ↓ Order summary shown
   ↓ Click "Pay with Razorpay"
   ↓ POST /api/payments/create-order
   ↓ Receives: order_id, razorpay_key
   ↓ Opens Razorpay popup
   ↓ User enters card details (Razorpay handles)
   ↓ POST /api/payments/verify
   ↓ Server verifies signature with Razorpay
   
10. PAYMENT SUCCESS (/payments/success)
    ↓ Shows receipt
    ↓ Updates booking status to 'assigned'
    ↓ Driver receives notification
```

### Journey 2: Driver Accepting Delivery

```
1. DRIVER LOGIN (/login)
   ↓ POST /api/auth/login
   ↓ Receives JWT token
   
2. ROLE SELECTION (/role-selection)
   ↓ Choose: Driver
   ↓ Redirects to onboarding
   
3. DRIVER ONBOARDING (/onboarding/driver)
   ↓ Add vehicle: type, capacity, registration
   ↓ Service areas (map)
   
4. DRIVER DASHBOARD (/dashboard/driver)
   ↓ Shows "Available Bookings"
   ↓ Farmers' equipment rental requests
   ↓ Distance, date, pay, pickup location
   
5. BOOKING DETAIL (/bookings/:id)
   ↓ View full request details
   ↓ Equipment specs, location, dates
   ↓ Click "Accept Offer"
   ↓ POST /api/bookings/:id/accept
   ↓ Status changes: pending → assigned
   
6. START COMMUNICATION (/messages)
   ↓ Chat with farmer about pickup details
   ↓ WebSocket connection → real-time messages
   
7. COMPLETE DELIVERY
   ↓ Pickup equipment
   ↓ Transport to farmer's location
   ↓ Delivery complete
   ↓ Status: in_transit → completed
   ↓ Earnings credited to account
```

### Journey 3: Equipment Owner Listing Equipment

```
1. REGISTRATION & ROLE SELECTION
   ↓ Register → Choose "Equipment Owner"
   
2. ONBOARDING (/onboarding/equipment-owner)
   ↓ Add equipment: name, type, specs
   ↓ Upload photos
   ↓ Set rental rate per day
   ↓ Mark available dates
   
3. MANAGE EQUIPMENT (/equipment/manage)
   ↓ View all listings
   ↓ Edit details
   ↓ See booking requests
   
4. BOOKING NOTIFICATIONS
   ↓ New booking request received
   ↓ Toast notification at top-right
   ↓ Update in BOOKING DETAIL page
   
5. ACCEPT/REJECT BOOKING
   ↓ See driver/farmer details
   ↓ Accept → assigns driver
   ↓ Driver gets assignment notification
   ↓ Equipment owner earns rental fee
```

---

## 🔐 SECURITY ARCHITECTURE

### Authentication Flow

```
User Registration:
1. Frontend form capture (name, email, password)
2. Turnstile CAPTCHA verification
3. POST /api/auth/register
4. Backend validates input (email unique, password strong)
5. Hash password with bcrypt
6. Create user in database
7. Issue JWT token
8. Token contains: { user_id, email, role, exp }
9. Frontend stores token in localStorage
10. Subsequent requests include: Authorization: Bearer <token>

Token Verification:
- Every protected route checks token in Authorization header
- SpaAuth middleware verifies token signature
- 401 error if token invalid/expired
- Frontend catches 401 → redirect to login → clear localStorage
```

### Security Measures

| Measure | Implementation | Purpose |
|---------|-----------------|---------|
| **Turnstile CAPTCHA** | Called before register/login | Prevent bot attacks |
| **Password Hashing** | Laravel's Hash::make() (bcrypt) | Never store plain passwords |
| **JWT Tokens** | Signed with app key | Validate request authenticity |
| **HTTPS/TLS** | Enforced in production | Encrypt data in transit |
| **CORS** | Whitelisted domains | Prevent cross-origin attacks |
| **Rate Limiting** | Throttle repeated requests | Prevent brute force |
| **Input Validation** | Validate all inputs server-side | Prevent SQL injection, XSS |
| **Role-based Access** | Check user.role in controllers | Restrict admin endpoints |
| **Broadcast Auth** | Reverb requires spa.auth token | Only authenticated users get messages |
| **CSRF Protection** | Laravel token in forms | Prevent cross-site form hijacking |

---

## 📊 DATA FLOW DIAGRAMS

### Traditional REST API Call

```
User clicks "Create Booking" button
    ↓
<CreateBooking /> component renders form
    ↓
User fills: equipment, dates, location
    ↓
Form submit → POST /api/bookings
    ↓
axiosInstance adds Authorization header
    ↓
Laravel receives request
    ↓
SpaAuth middleware verifies token
    ↓
BookingController@store method called
    ↓
Validate input using Laravel rules
    ↓
PooledBooking::create() saves to MongoDB
    ↓
Broadcast ConversationMessageSent event (to notify equipment owner)
    ↓
Return: { id: 123, status: 'pending', ... } JSON
    ↓
Frontend catches response
    ↓
Update React state with new booking
    ↓
Component re-renders showing new booking
    ↓
Navigate to /bookings/123
```

### Real-time WebSocket Chat

```
User opens <Messages /> component
    ↓
useEffect hook runs on mount
    ↓
Fetch conversation history: GET /api/bookings/:id/conversation
    ↓
Set state: messages = [...]
    ↓
Render message list + input box
    ↓
User types message + hits send
    ↓
POST /api/conversations/:id/messages
    ↓
Laravel MessageController@store
    ↓
Save Message model to database
    ↓
Broadcast to Reverb:
    - Event: ConversationMessageSent
    - Channel: private-conversation.{booking_id}
    - Data: { message, sender, timestamp }
    ↓
All connected users listening to this channel receive event via WebSocket
    ↓
Echo.channel('private-conversation.{id}').listen('ConversationMessageSent', (data) => {
    setState([...messages, data.message])
  })
    ↓
Message appears in real-time (no page refresh)
```

### Payment Processing

```
User at PaymentCheckout page
    ↓
Click "Pay with Razorpay" button
    ↓
POST /api/payments/create-order
    ↓
Backend calls Razorpay API:
    - amount, currency, receipt_id
    ↓
Razorpay returns: { order_id, amount, ... }
    ↓
Frontend receives order_id + razorpay_key
    ↓
Initialize Razorpay.Checkout(options)
    ↓
User's browser opens Razorpay popup
    ↓
User enters card/UPI details (on Razorpay's secure server)
    ↓
Razorpay processes payment
    ↓
Razorpay returns: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    ↓
Frontend sends to backend: POST /api/payments/verify
    ↓
Backend calls Razorpay API to verify signature
    ↓
If valid:
    - Create Payment record in database
    - Update Booking status: pending → assigned
    - Return success response
    ↓
Frontend navigates to /payments/success
    ↓
Show receipt and order details
```

---

## 🚀 DEVELOPMENT WORKFLOW

### Backend Development Commands

```bash
# Setup
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed

# Development
php artisan serve                    # Starts server at localhost:8000
php artisan queue:listen             # Process background jobs
php artisan pail --timeout=0        # Stream logs to terminal

# Run all together (from root)
composer run dev

# Testing
php artisan test                     # Run PHPUnit tests
php artisan test --filter=BookingTest

# Database
php artisan migrate:fresh            # Reset database
php artisan migrate:rollback         # Undo last migration
php artisan tinker                   # Interactive shell
```

### Frontend Development Commands

```bash
# Setup
cd frontend
npm install

# Development
npm run dev                          # Starts Vite at localhost:5173

# Production
npm run build                        # Builds to public/spa/

# From root (runs both backend + frontend)
npm run dev
```

### Environment Variables

**.env (Backend)**
```
APP_NAME=AgriPool
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=mongodb
DB_HOST=localhost
DB_DATABASE=agripool

SANCTUM_STATEFUL_DOMAINS=localhost:5173

REVERB_APP_KEY=agripool-local
REVERB_HOST=localhost
REVERB_PORT=8080

SERVICES_TURNSTILE_SECRET=your_turnstile_secret
SERVICES_GOOGLE_CLIENT_ID=your_google_client_id
SERVICES_RAZORPAY_KEY=your_razorpay_key
```

**.env.local (Frontend)**
```
VITE_API_URL=http://localhost:8000/api
VITE_REVERB_APP_KEY=agripool-local
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=ws
```

---

## 📝 KEY FEATURES SUMMARY

### For Farmers
✅ Browse available equipment from other farmers  
✅ Create booking requests  
✅ Real-time chat with drivers/equipment owners  
✅ Track booking status  
✅ Make payments via Razorpay  

### For Drivers
✅ View available equipment delivery requests  
✅ Accept/reject bookings  
✅ Real-time communication with farmers  
✅ Track earnings  
✅ Manage vehicle information  

### For Equipment Owners
✅ List equipment for rent  
✅ Manage equipment details and photos  
✅ View booking requests  
✅ Track rental income  

### For Admins
✅ Analytics dashboard  
✅ User management and verification  
✅ Revenue tracking  
✅ Moderation tools  

---

## 🔄 TECH DECISIONS & WHY

| Decision | Why |
|----------|-----|
| **Laravel for backend** | Mature, secure, built-in features (auth, migrations, ORM) |
| **React for frontend** | Fast, component-based, large community & libraries |
| **MongoDB** | Flexible schema for different user types, good scalability |
| **JWT tokens** | Stateless authentication, works well for SPAs |
| **Reverb for real-time** | Built into Laravel ecosystem, WebSocket support |
| **Razorpay** | Indian payment processor, good for agriculture sector |
| **Tailwind CSS** | Rapid UI development, consistent styling |
| **Vite** | Lightning-fast build tool, excellent DX |
| **TypeScript** | (Could be added) Type safety for larger codebase |

---

## 🎯 CONCLUSION

**AgriPool** is a modern, full-stack agricultural tech platform that:
- ✅ Connects farmers, drivers, and equipment owners
- ✅ Facilitates real-time communication via WebSockets
- ✅ Handles payments securely with Razorpay
- ✅ Uses role-based access control
- ✅ Provides responsive UI for all devices
- ✅ Scales with MongoDB database
- ✅ Follows REST API best practices

The architecture separates frontend (React) and backend (Laravel), making it maintainable, testable, and scalable for future growth.
