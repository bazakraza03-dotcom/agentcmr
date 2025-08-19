export type Company = {
  id: string
  name: string
  icon?: string
  url?: string
  username?: string
  password_encrypted?: string
  auto_login_script?: string
  updated_at: number
  deleted_at?: number | null
}

export class ApiClient {
  constructor(private baseUrl: string) {}

  async listCompanies(): Promise<Company[]> {
    const res = await fetch(`${this.baseUrl}/api/companies`)
    if (!res.ok) throw new Error('Failed to fetch companies')
    return res.json()
  }

  async createCompany(payload: Partial<Company>): Promise<{ id: string }> {
    const res = await fetch(`${this.baseUrl}/api/companies`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to create company')
    return res.json()
  }

  async updateCompany(id: string, payload: Partial<Company>): Promise<{ ok: boolean }> {
    const res = await fetch(`${this.baseUrl}/api/companies/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to update company')
    return res.json()
  }

  async deleteCompany(id: string): Promise<{ ok: boolean }> {
    const res = await fetch(`${this.baseUrl}/api/companies/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete company')
    return res.json()
  }
}

