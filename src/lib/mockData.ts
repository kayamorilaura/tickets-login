import { User, Invite, AllowedEmail, Ticket } from "@/types"

// Mock users para teste - SEM emails reais da empresa
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "admin@teste.local",
    role: "super_admin",
    company: "Grupo Timing",
  },
  {
    id: "2",
    name: "Laura Kayamori",
    email: "laura@teste.local",
    role: "it_support",
    company: "Grupo Timing",
  },
]

export const mockAllowedEmails: AllowedEmail[] = [
  {
    id: "email-1",
    email: "admin@teste.local",
    importedFrom: "manual",
    createdAt: new Date("2026-05-01"),
  },
  {
    id: "email-2",
    email: "laura@teste.local",
    importedFrom: "manual",
    createdAt: new Date("2026-05-01"),
  },
  {
    id: "email-3",
    email: "funcionario1@teste.local",
    importedFrom: "365",
    createdAt: new Date("2026-05-01"),
  },
  {
    id: "email-4",
    email: "funcionario2@teste.local",
    importedFrom: "365",
    createdAt: new Date("2026-04-28"),
  },
]

export let mockInvites: Invite[] = [
  {
    id: "inv-1",
    code: "abc123def456",
    email: "funcionario1@teste.local",
    createdBy: "1",
    used: false,
    createdAt: new Date("2026-05-01"),
    lastSentAt: new Date("2026-05-01T09:00:00"),
  },
  {
    id: "inv-2",
    code: "xyz789uvw012",
    email: "funcionario2@teste.local",
    createdBy: "1",
    used: true,
    createdAt: new Date("2026-04-28"),
    lastSentAt: new Date("2026-04-28T14:15:00"),
    usedAt: new Date("2026-04-29"),
    usedBy: "user-123",
  },
]

export const mockTickets: Ticket[] = [
  {
    id: "IT802",
    title: "Falha de rede no edifício A",
    status: "open",
    urgency: "high",
    category: "Rede",
    createdAt: new Date("2026-05-06T09:12:00"),
    assignedTo: "2",
  },
  {
    id: "IT803",
    title: "Erro no acesso ao ERP",
    status: "open",
    urgency: "medium",
    category: "Software",
    createdAt: new Date("2026-05-07T11:20:00"),
    assignedTo: "2",
  },
]

// Senhas mock (em produção usarias hash!)
export const mockPasswords: Record<string, string> = {
  "admin@teste.local": "Admin123!",
  "laura@teste.local": "Laura123!",
}

// Gerar token aleatório para o link
export function generateInviteToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function isEmailAuthorized(email: string) {
  return mockAllowedEmails.some((item) => item.email.toLowerCase() === email.toLowerCase())
}

export function addAllowedEmails(emails: string[]) {
  const added: string[] = []
  emails.forEach((value) => {
    const email = value.trim().toLowerCase()
    if (!email) return
    if (!mockAllowedEmails.some((item) => item.email === email)) {
      mockAllowedEmails.push({
        id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        email,
        importedFrom: "manual",
        createdAt: new Date(),
      })
      added.push(email)
    }
  })
  return added
}

export function findInviteByEmail(email: string) {
  return mockInvites.find((invite) => invite.email?.toLowerCase() === email.toLowerCase() && !invite.used)
}

export function createInviteForEmail(email: string, createdBy: string) {
  if (!isEmailAuthorized(email)) {
    throw new Error("E-mail não autorizado para convites.")
  }

  const existing = findInviteByEmail(email)
  if (existing) {
    return existing
  }

  return createInvite(email, createdBy)
}

export function getOrCreateInviteForEmail(email: string, createdBy: string) {
  const existing = mockInvites
    .filter((invite) => invite.email?.toLowerCase() === email.toLowerCase())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]

  if (existing && !existing.used) {
    return existing
  }

  return createInvite(email, createdBy)
}

export function sendInviteEmail(email: string, createdBy: string) {
  const invite = getOrCreateInviteForEmail(email, createdBy)
  const inviteIndex = mockInvites.findIndex((inv) => inv.id === invite.id)
  if (inviteIndex !== -1) {
    mockInvites[inviteIndex] = {
      ...mockInvites[inviteIndex],
      lastSentAt: new Date(),
    }
  }
  return invite
}

// Validar convite por TOKEN
export function validateInvite(token: string): { valid: boolean; invite?: Invite; message: string } {
  const invite = mockInvites.find((inv) => inv.code === token)

  if (!invite) {
    return { valid: false, message: "Link de convite inválido." }
  }

  if (invite.used) {
    return { valid: false, message: "Este link já foi utilizado." }
  }

  const now = new Date()
  const diffDays = (now.getTime() - invite.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays > 7) {
    return { valid: false, message: "Este link expirou." }
  }

  if (invite.email && !isEmailAuthorized(invite.email)) {
    return { valid: false, message: "Este e-mail não está autorizado." }
  }

  return { valid: true, invite, message: "Link válido!" }
}

// Usar convite
export function useInvite(token: string, userId: string): boolean {
  const result = validateInvite(token)
  if (!result.valid || !result.invite) return false

  const inviteIndex = mockInvites.findIndex((inv) => inv.code === token)
  if (inviteIndex === -1) return false

  mockInvites[inviteIndex] = {
    ...mockInvites[inviteIndex],
    used: true,
    usedAt: new Date(),
    usedBy: userId,
  }

  return true
}

// Criar novo convite
export function createInvite(email: string | undefined, createdBy: string): Invite {
  const newInvite: Invite = {
    id: `inv-${Date.now()}`,
    code: generateInviteToken(),
    email,
    createdBy,
    used: false,
    createdAt: new Date(),
  }
  mockInvites.push(newInvite)
  return newInvite
}

// Login mock
export function mockLogin(email: string, password: string): { success: boolean; user?: User; message: string } {
  if (!isEmailAuthorized(email)) {
    return { success: false, message: "E-mail não autorizado para login." }
  }

  const user = mockUsers.find((u) => u.email === email)
  if (!user) {
    return { success: false, message: "E-mail ou password incorretos." }
  }

  const storedPassword = mockPasswords[email]
  if (storedPassword !== password) {
    return { success: false, message: "E-mail ou password incorretos." }
  }

  return { success: true, user, message: "Login bem-sucedido!" }
}

// Registo mock
export function mockRegister(data: {
  fullName: string
  company: string
  email: string
  password: string
  inviteToken: string
}): { success: boolean; user?: User; message: string } {
  const inviteResult = validateInvite(data.inviteToken)
  if (!inviteResult.valid) {
    return { success: false, message: inviteResult.message }
  }

  if (!isEmailAuthorized(data.email)) {
    return { success: false, message: "E-mail não autorizado para registo." }
  }

  if (mockUsers.some((u) => u.email === data.email)) {
    return { success: false, message: "Este e-mail já está registado." }
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.fullName,
    email: data.email,
    role: "user",
    company: data.company,
  }

  mockUsers.push(newUser)
  mockPasswords[data.email] = data.password

  useInvite(data.inviteToken, newUser.id)

  return { success: true, user: newUser, message: "Conta criada com sucesso!" }
}
