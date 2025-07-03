"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FileSpreadsheet, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { TicketData } from '@/lib/csv-parser'

interface SLAComplianceModalProps {
  isOpen: boolean
  onClose: () => void
  tickets: TicketData[]
  compliancePercentage: number
  selectedCompany?: string
}

interface SLATicket {
  ticketId: string
  subject: string
  companyName: string
  agent: string
  createdTime: string
  resolvedTime?: string
  slaHours: number
  actualHours: number
  isBreached: boolean
  priority: string
  status: string
}

interface AgentBreachSummary {
  agentName: string
  breachedCount: number
  totalCount: number
  breachPercentage: number
}

export function SLAComplianceModal({ isOpen, onClose, tickets, compliancePercentage, selectedCompany }: SLAComplianceModalProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  
  // Filter tickets by selected company if specified
  const filteredTickets = selectedCompany && selectedCompany !== 'all' 
    ? tickets.filter(ticket => ticket.companyName === selectedCompany)
    : tickets

  // Calculate SLA data for tickets
  const slaTickets: SLATicket[] = filteredTickets.map(ticket => {
    const created = new Date(ticket.createdTime)
    const resolved = ticket.resolvedTime ? new Date(ticket.resolvedTime) : null
    const slaHours = getSLAHours(ticket.priority)
    
    let actualHours = 0
    if (resolved) {
      actualHours = Math.round((resolved.getTime() - created.getTime()) / (1000 * 60 * 60))
    } else if (ticket.status !== 'Closed' && ticket.status !== 'Resolved') {
      // For open tickets, calculate hours since creation
      actualHours = Math.round((new Date().getTime() - created.getTime()) / (1000 * 60 * 60))
    }
    
    return {
      ticketId: ticket.ticketId,
      subject: ticket.subject || 'No Subject',
      companyName: ticket.companyName || 'Unknown',
      agent: ticket.agent || 'Unassigned',
      createdTime: ticket.createdTime,
      resolvedTime: ticket.resolvedTime,
      slaHours,
      actualHours,
      isBreached: actualHours > slaHours,
      priority: ticket.priority || 'Medium',
      status: ticket.status || 'Open'
    }
  })

  // Sort tickets: breached first, then by creation date (newest first)
  const sortedTickets = [...slaTickets].sort((a, b) => {
    if (a.isBreached && !b.isBreached) return -1
    if (!a.isBreached && b.isBreached) return 1
    return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  })

  // Calculate agent breach summaries
  const agentBreachSummaries: AgentBreachSummary[] = []
  const agentStats: { [key: string]: { breached: number; total: number } } = {}
  
  slaTickets.forEach(ticket => {
    if (!agentStats[ticket.agent]) {
      agentStats[ticket.agent] = { breached: 0, total: 0 }
    }
    agentStats[ticket.agent].total++
    if (ticket.isBreached) {
      agentStats[ticket.agent].breached++
    }
  })

  Object.entries(agentStats).forEach(([agent, stats]) => {
    if (stats.breached > 0) {
      agentBreachSummaries.push({
        agentName: agent,
        breachedCount: stats.breached,
        totalCount: stats.total,
        breachPercentage: Math.round((stats.breached / stats.total) * 100)
      })
    }
  })

  // Sort agents by breach count (highest first)
  agentBreachSummaries.sort((a, b) => b.breachedCount - a.breachedCount)

  // Filter tickets for selected agent
  const agentTickets = selectedAgent 
    ? sortedTickets.filter(ticket => ticket.agent === selectedAgent && ticket.isBreached)
    : sortedTickets

  const exportToExcel = () => {
    const csvContent = [
      ['Ticket ID', 'Subject', 'Company', 'Agent', 'Priority', 'Status', 'Created', 'Resolved', 'SLA Hours', 'Actual Hours', 'Breached'].join(','),
      ...agentTickets.map(ticket => [
        ticket.ticketId,
        `"${ticket.subject.replace(/"/g, '""')}"`,
        `"${ticket.companyName.replace(/"/g, '""')}"`,
        ticket.agent,
        ticket.priority,
        ticket.status,
        ticket.createdTime,
        ticket.resolvedTime || 'N/A',
        ticket.slaHours,
        ticket.actualHours,
        ticket.isBreached ? 'Yes' : 'No'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `sla-compliance-${selectedAgent || 'all'}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            SLA Compliance Analysis
            {selectedCompany && selectedCompany !== 'all' && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                - {selectedCompany}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Compliance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SLA Compliance Overview</span>
                <Badge className={`${compliancePercentage >= 90 ? 'bg-green-100 text-green-800' : 
                  compliancePercentage >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {compliancePercentage}% Compliance
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {slaTickets.filter(t => !t.isBreached).length}
                  </div>
                  <div className="text-sm text-gray-600">Within SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {slaTickets.filter(t => t.isBreached).length}
                  </div>
                  <div className="text-sm text-gray-600">Breached SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {slaTickets.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Tickets</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Breach Summary */}
          {agentBreachSummaries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Agents with SLA Breaches</span>
                  {selectedAgent && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedAgent(null)}>
                      Show All Tickets
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agentBreachSummaries.map((agent) => (
                    <Card 
                      key={agent.agentName}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedAgent === agent.agentName ? 'ring-2 ring-orange-500' : ''
                      }`}
                      onClick={() => setSelectedAgent(agent.agentName)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-600 mr-2" />
                            <span className="font-medium text-gray-900">{agent.agentName}</span>
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            {agent.breachedCount}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {agent.breachPercentage}% breach rate ({agent.breachedCount}/{agent.totalCount})
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ticket List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {selectedAgent ? `SLA Breaches by ${selectedAgent}` : 'All Tickets (Breached First)'}
                </span>
                <Button variant="outline" size="sm" onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agentTickets.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No tickets found</p>
                ) : (
                  agentTickets.map((ticket) => (
                    <div 
                      key={ticket.ticketId}
                      className={`p-4 rounded-lg border-l-4 ${
                        ticket.isBreached 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-green-500 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{ticket.ticketId}</span>
                            <Badge className={`${
                              ticket.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {ticket.priority}
                            </Badge>
                            <Badge variant="outline">{ticket.status}</Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{ticket.subject}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Company: {ticket.companyName} • Agent: {ticket.agent}</div>
                            <div>Created: {new Date(ticket.createdTime).toLocaleDateString()}</div>
                            {ticket.resolvedTime && (
                              <div>Resolved: {new Date(ticket.resolvedTime).toLocaleDateString()}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center ${ticket.isBreached ? 'text-red-600' : 'text-green-600'}`}>
                            {ticket.isBreached ? (
                              <AlertTriangle className="h-4 w-4 mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            <span className="font-medium">
                              {ticket.isBreached ? 'Breached' : 'Within SLA'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {ticket.actualHours}h / {ticket.slaHours}h SLA
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to determine SLA hours based on priority
function getSLAHours(priority: string): number {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return 4
    case 'high':
      return 8
    case 'medium':
      return 24
    case 'low':
      return 72
    default:
      return 24
  }
}