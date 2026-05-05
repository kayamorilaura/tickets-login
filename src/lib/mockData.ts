import { User, Invite } from "@/types"

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

// Mock invites - agora só com LINKS (tokens), sem códigos visíveis
export let mockInvites: Invite[] = [
  {
    id: "inv-1",
    code: "abc123def456",
    email: "funcionario1@teste.local",
    createdBy: "1",
    used: false,
    createdAt: new Date("2026-05-01"),
  },
  {
    id: "inv-2",
    code: "xyz789uvw012",
    email: "funcionario2@teste.local",
    createdBy: "1",
    used: true,
    createdAt: new Date("2026-04-28"),
    usedAt: new Date("2026-04-29"),
    usedBy: "user-123",
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
