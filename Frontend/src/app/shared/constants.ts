// ─── App-wide Constants ─────────────────────────────

/** User roles matching .NET backend Role values */
export const ROLES = {
  ADMIN: 'Admin',
  FARMER: 'Farmer',
  USER: 'User',
} as const;

/** Route paths used throughout the app */
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FARMER_DASHBOARD: '/farmer-dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  CROP_UPLOAD: '/crop-upload',
  HISTORY: '/prediction-history',
  PROFILE: '/profile',
} as const;

/** Sidebar navigation items */
export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',        icon: 'dashboard',          route: ROUTES.CROP_UPLOAD },
  { label: 'Prediction History', icon: 'history',            route: ROUTES.HISTORY }
];
