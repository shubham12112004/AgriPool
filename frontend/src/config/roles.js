export const ROLES = {
  FARMER: 'farmer',
  DRIVER: 'driver',
  EQUIPMENT_OWNER: 'equipment_owner',
  BUYER: 'buyer',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  [ROLES.FARMER]: 'Farmer',
  [ROLES.DRIVER]: 'Driver',
  [ROLES.EQUIPMENT_OWNER]: 'Equipment Owner',
  [ROLES.BUYER]: 'Buyer',
  [ROLES.ADMIN]: 'Admin',
}

export const ONBOARDING_PATHS = {
  [ROLES.FARMER]: '/onboarding/farmer',
  [ROLES.DRIVER]: '/onboarding/driver',
  [ROLES.EQUIPMENT_OWNER]: '/onboarding/equipment-owner',
  [ROLES.BUYER]: '/onboarding/buyer',
}

export const DASHBOARD_PATHS = {
  [ROLES.FARMER]: '/dashboard/farmer',
  [ROLES.DRIVER]: '/dashboard/driver',
  [ROLES.EQUIPMENT_OWNER]: '/dashboard/equipment-owner',
  [ROLES.BUYER]: '/dashboard/buyer',
  [ROLES.ADMIN]: '/dashboard/admin',
}
