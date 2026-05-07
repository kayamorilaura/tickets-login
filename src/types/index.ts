export interface Technician {
  id: string
  name: string
  tickets: number
  avatar?: string
}

export interface QueueMetric {
  label: string
  value: number
  sublabel: string
  color: 'yellow' | 'purple' | 'red' | 'orange' | 'green'
}

export interface TicketSummary {
  openTickets: number
  totalTickets: number
  reviews: number
}

export interface ProcessSummary {
  onboardings: number
  quickRequests: number
  roleChanges: number
}

export interface MenuItem {
  label: string
  icon: string
  href: string
  active?: boolean
}

export interface MenuSection {
  title: string
  items: MenuItem[]
}

export interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'it_support' | 'technician' | 'user'
  avatar?: string
  company?: string
}

export interface Ticket {
  id: string
  title: string
  status: 'open' | 'closed' | 'passed' | 'mentioned'
  urgency: 'high' | 'medium' | 'low'
  category: string
  createdAt: Date
  assignedTo?: string
}

export interface QuickRequest {
  id: string
  title: string
  requester: string
  status: 'pending' | 'completed'
  type: string
}

// ===== AUTH & INVITES =====

export interface Invite {
  id: string
  code: string
  email?: string
  createdBy: string
  used: boolean
  createdAt: Date
  usedAt?: Date
  usedBy?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  company: string
  email: string
  confirmEmail: string
  password: string
  inviteCode: string
}
