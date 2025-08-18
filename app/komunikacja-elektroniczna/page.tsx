"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Edit, Trash2, Plus, Send } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  isActive: boolean
  company: string
}

const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Szablon Agent21",
    subject: "Przypomnienie o zaplanowanym zadaniu",
    content: `Szanowna Pani,

uprzejmie informujemy, że w najbliższym czasie kończy się ważność lub upływa termin płatności kolejnej raty składki następujących umów ubezpieczenia:

nr polisy: {POLICY_NUMBER}
ubezpieczenie: {INSURANCE_TYPE}
data: {DATE}

Dotyczy lokalizacji: {LOCATION}
Konto do wpłaty raty: {ACCOUNT_NUMBER}

Prosimy o kontakt w celu przygotowania dla Pani korzystnej oferty wznowieniowej w/w polis.

W przypadku płatności kolejnej raty, numer konta znajduje się na polisie.

W razie wątpliwości pozostajemy do Pani dyspozycji.

Z poważaniem
AGENTCMR
{AGENT_NAME}`,
    isActive: true,
    company: "AgentCMR",
  },
  {
    id: "2",
    name: "Szablon DOR-FIN",
    subject: "Informacja o kończącej się umowie ubezpieczenia",
    content: `Szanowny Kliencie,

informujemy o zbliżającym się terminie wygaśnięcia Państwa polisy ubezpieczeniowej:

Numer polisy: {POLICY_NUMBER}
Rodzaj ubezpieczenia: {INSURANCE_TYPE}
Data wygaśnięcia: {EXPIRY_DATE}

Zachęcamy do kontaktu w celu przedłużenia ochrony ubezpieczeniowej.

Z poważaniem,
{AGENT_NAME}
DOR-FIN`,
    isActive: true,
    company: "DOR-FIN",
  },
  {
    id: "3",
    name: "Szablon Wznowienia",
    subject: "Wznowienie polisy ubezpieczeniowej",
    content: `Szanowny {CLIENT_NAME},

Przypominamy o zbliżającym się terminie wznowienia Państwa polisy:

Numer polisy: {POLICY_NUMBER}
Towarzystwo: {INSURANCE_COMPANY}
Data wygaśnięcia: {EXPIRY_DATE}
Składka roczna: {ANNUAL_PREMIUM}

Aby zapewnić ciągłość ochrony ubezpieczeniowej, prosimy o kontakt w celu przedłużenia umowy.

Kontakt: {AGENT_PHONE} | {AGENT_EMAIL}

Z poważaniem,
{AGENT_NAME}
AgentCMR`,
    isActive: true,
    company: "AgentCMR",
  },
  {
    id: "4",
    name: "Szablon Szkody",
    subject: "Informacja o zgłoszeniu szkody",
    content: `Szanowny {CLIENT_NAME},

Potwierdzamy przyjęcie zgłoszenia szkody:

Numer szkody: {CLAIM_NUMBER}
Numer polisy: {POLICY_NUMBER}
Data zdarzenia: {INCIDENT_DATE}
Miejsce zdarzenia: {INCIDENT_LOCATION}

Dalsze informacje o przebiegu likwidacji szkody będą przekazywane na bieżąco.

W razie pytań prosimy o kontakt: {AGENT_PHONE}

Z poważaniem,
{AGENT_NAME}
AgentCMR`,
    isActive: true,
    company: "AgentCMR",
  },
]

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(mockTemplates[0])
  const [templates, setTemplates] = useState(mockTemplates)
  const [isEditing, setIsEditing] = useState(false)
  const [previewData, setPreviewData] = useState({
    clientName: "Jan Kowalski",
    policyNumber: "100000111199",
    insuranceType: "Dom Ochrona Allianz",
    insuranceCompany: "Allianz",
    date: "2021-11-18",
    expiryDate: "2021-11-18",
    location: "00-123 Miasteczko, ul. Długa 123 lok. 34",
    accountNumber: "PL26 1240 5774 8689 8234 6633 0486",
    agentName: "Bartłomiej Mazurek",
    agentPhone: "+48 123 456 789",
    agentEmail: "b.mazurek@agentcmr.pl",
    annualPremium: "2,500.00 zł",
    claimNumber: "SK/2021/001234",
    incidentDate: "2021-11-15",
    incidentLocation: "ul. Przykładowa 123, Warszawa",
  })

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(false)
  }

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      setTemplates((prev) => prev.map((t) => (t.id === selectedTemplate.id ? selectedTemplate : t)))
      setIsEditing(false)
    }
  }

  const renderPreviewContent = (content: string) => {
    return content
      .replace(/{CLIENT_NAME}/g, previewData.clientName)
      .replace(/{POLICY_NUMBER}/g, previewData.policyNumber)
      .replace(/{INSURANCE_TYPE}/g, previewData.insuranceType)
      .replace(/{INSURANCE_COMPANY}/g, previewData.insuranceCompany)
      .replace(/{DATE}/g, previewData.date)
      .replace(/{EXPIRY_DATE}/g, previewData.expiryDate)
      .replace(/{LOCATION}/g, previewData.location)
      .replace(/{ACCOUNT_NUMBER}/g, previewData.accountNumber)
      .replace(/{AGENT_NAME}/g, previewData.agentName)
      .replace(/{AGENT_PHONE}/g, previewData.agentPhone)
      .replace(/{AGENT_EMAIL}/g, previewData.agentEmail)
      .replace(/{ANNUAL_PREMIUM}/g, previewData.annualPremium)
      .replace(/{CLAIM_NUMBER}/g, previewData.claimNumber)
      .replace(/{INCIDENT_DATE}/g, previewData.incidentDate)
      .replace(/{INCIDENT_LOCATION}/g, previewData.incidentLocation)
  }

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: "Nowy szablon",
      subject: "Nowy temat",
      content: "Treść nowego szablonu...",
      isActive: true,
      company: "AgentCMR",
    }
    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplate(newTemplate)
    setIsEditing(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten szablon?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId))
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(templates[0] || null)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* Left Sidebar - Template List */}
        <div className="w-80 border-r bg-card">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Przegląd szablonów e-mail</h2>
              <Button size="sm" variant="outline" onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Nowy
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{template.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <span>✓ Szablon logo po prawej</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>✓ wysyłka z: m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>✓ stopka: {template.company}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content - Email Preview */}
        <div className="flex-1 flex flex-col">
          {selectedTemplate && (
            <>
              <div className="p-4 border-b bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold">Informacja</h1>
                    <p className="text-sm text-muted-foreground">o kończącym się ubezpieczeniu lub upływającej racie</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Podgląd" : "Edytuj"}
                    </Button>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Wyślij
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Temat wiadomości</Label>
                      <Input
                        id="subject"
                        value={selectedTemplate.subject}
                        onChange={(e) =>
                          setSelectedTemplate((prev) => (prev ? { ...prev, subject: e.target.value } : null))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Treść wiadomości</Label>
                      <Textarea
                        id="content"
                        value={selectedTemplate.content}
                        onChange={(e) =>
                          setSelectedTemplate((prev) => (prev ? { ...prev, content: e.target.value } : null))
                        }
                        rows={20}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveTemplate}>Zapisz zmiany</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Anuluj
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card className="max-w-4xl mx-auto">
                    <CardHeader className="text-center border-b">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">A21</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">2021-07-19 10:00</div>
                          <div className="text-sm text-muted-foreground">Kontakt z klientem</div>
                          <div className="flex items-center gap-1 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Przemysław Kozłowski</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-blue-600 mb-2">Informacja</h2>
                          <p className="text-muted-foreground">o kończącym się ubezpieczeniu lub upływającej racie</p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-semibold">nr polisy</div>
                              <div className="font-semibold">ubezpieczenie</div>
                              <div className="font-semibold">data</div>
                            </div>
                            <div>
                              <div className="font-semibold">Dom Ochrona</div>
                              <div className="font-semibold">Allianz</div>
                              <div className="font-semibold">2021-11-18</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{previewData.policyNumber}</div>
                              <div className="text-sm text-muted-foreground">2. rata: 525,25 zł</div>
                            </div>
                          </div>

                          <div className="text-sm space-y-1">
                            <div>
                              <strong>Dotyczy lokalizacji:</strong> {previewData.location}
                            </div>
                            <div>
                              <strong>Konto do wpłaty raty:</strong> {previewData.accountNumber}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <div className="font-semibold mb-2">123456789012</div>
                              <div className="text-sm space-y-1">
                                <div>
                                  <strong>Dotyczy pojazdu:</strong> WP99999, FORD MONDEO 1.8TDCI GHIA
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold mb-2">Komunikacyjne</div>
                              <div className="font-semibold mb-2">PZU</div>
                              <div className="text-sm">2021-11-23</div>
                            </div>
                          </div>
                        </div>

                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {renderPreviewContent(selectedTemplate.content)}
                        </div>

                        <div className="border-t pt-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{selectedTemplate.company}</span>
                            <span>{previewData.agentName}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
