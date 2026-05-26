import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ROLES } from '../config/roles'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      setAuth: ({ user, token, role }) =>
        set((state) => ({
          user: user !== undefined ? user : state.user,
          token: token !== undefined ? token : state.token,
          role: role !== undefined ? role : (user?.role ?? state.role),
        })),
      setRole: (role) => set({ role }),
      logout: () => {
        sessionStorage.removeItem('auth_token')
        set({ user: null, token: null, role: null })
      },
    }),
    {
      name: 'agripool-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
      }),
    }
  )
)

export function getDashboardPathForRole(role) {
  const paths = {
    [ROLES.FARMER]: '/dashboard/farmer',
    [ROLES.DRIVER]: '/dashboard/driver',
    [ROLES.EQUIPMENT_OWNER]: '/dashboard/equipment-owner',
    [ROLES.BUYER]: '/dashboard/buyer',
    [ROLES.ADMIN]: '/dashboard/admin',
  }
  return paths[role] || '/dashboard/farmer'
}
