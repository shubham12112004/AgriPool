export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const BOOKING_STATUS_CONFIG = {
  [BOOKING_STATUS.PENDING]: { label: 'Pending', variant: 'warning' },
  [BOOKING_STATUS.ACCEPTED]: { label: 'Accepted', variant: 'primary' },
  [BOOKING_STATUS.IN_PROGRESS]: { label: 'In Progress', variant: 'primary' },
  [BOOKING_STATUS.COMPLETED]: { label: 'Completed', variant: 'success' },
  [BOOKING_STATUS.CANCELLED]: { label: 'Cancelled', variant: 'error' },
}
