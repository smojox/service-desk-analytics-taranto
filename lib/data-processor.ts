import { TicketData } from './csv-parser'

export interface DashboardMetrics {
  totalTickets: number
  openTickets: number
  closedTickets: number
  avgResolution: number
  slaCompliance: number
}

export interface EscalatedTicket {
  ticketId: string
  subject: string
  priority: string
  companyName: string
  createdTime: string
  status: string
  usersAffected: number
}

export interface RecentTicket {
  ticketId: string
  subject: string
  priority: string
  companyName: string
  createdTime: string
  status: string
  agent: string
}

export interface ChartData {
  ticketVolumeData: Array<{ date: string; count: number }>
  ticketTypeData: Array<{ type: string; count: number }>
}

export class DataProcessor {
  private tickets: TicketData[] = []

  constructor(tickets: TicketData[]) {
    this.tickets = tickets
  }

  calculateMetrics(): DashboardMetrics {
    const totalTickets = this.tickets.length
    
    const openTickets = this.tickets.filter(ticket => 
      ticket.status !== 'Resolved' && ticket.status !== 'Closed'
    ).length
    
    const closedTickets = this.tickets.filter(ticket => 
      ticket.status === 'Resolved' || ticket.status === 'Closed'
    ).length

    const resolvedTickets = this.tickets.filter(ticket => 
      ticket.status === 'Resolved' || ticket.status === 'Closed'
    )
    
    const avgResolution = resolvedTickets.length > 0 
      ? resolvedTickets.reduce((sum, ticket) => {
          const resolutionTime = parseFloat(ticket.resolutionTimeHrs.split(':')[0]) || 0
          return sum + resolutionTime
        }, 0) / resolvedTickets.length
      : 0

    const slaCompliance = this.calculateSLACompliance()

    return {
      totalTickets,
      openTickets,
      closedTickets,
      avgResolution: Math.round(avgResolution * 10) / 10,
      slaCompliance: Math.round(slaCompliance * 10) / 10
    }
  }

  private calculateSLACompliance(): number {
    let compliantCount = 0
    const today = new Date()
    
    this.tickets.forEach(ticket => {
      if (ticket.resolutionStatus === 'Within SLA') {
        compliantCount++
      } else if (ticket.resolutionStatus === '') {
        const dueDate = new Date(ticket.dueByTime)
        if (dueDate > today || ticket.status === 'Pending') {
          compliantCount++
        }
      }
    })
    
    return this.tickets.length > 0 ? (compliantCount / this.tickets.length) * 100 : 0
  }

  getEscalatedTickets(): EscalatedTicket[] {
    return this.tickets
      .filter(ticket => ticket.sdmEscalation === 'true')
      .map(ticket => ({
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        priority: ticket.priority,
        companyName: ticket.companyName,
        createdTime: ticket.createdTime,
        status: ticket.status,
        usersAffected: parseInt(ticket.numberOfUsersAffected) || 0
      }))
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
  }

  getRecentPriorityTickets(): RecentTicket[] {
    return this.tickets
      .filter(ticket => ticket.priority === 'Urgent' || ticket.priority === 'High')
      .map(ticket => ({
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        priority: ticket.priority,
        companyName: ticket.companyName,
        createdTime: ticket.createdTime,
        status: ticket.status,
        agent: ticket.agent
      }))
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
      .slice(0, 10)
  }

  getChartData(): ChartData {
    const ticketVolumeMap = new Map<string, number>()
    const ticketTypeMap = new Map<string, number>()

    this.tickets.forEach(ticket => {
      const date = new Date(ticket.createdTime).toISOString().split('T')[0]
      ticketVolumeMap.set(date, (ticketVolumeMap.get(date) || 0) + 1)
      
      const type = ticket.type || 'Unknown'
      ticketTypeMap.set(type, (ticketTypeMap.get(type) || 0) + 1)
    })

    const ticketVolumeData = Array.from(ticketVolumeMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const ticketTypeData = Array.from(ticketTypeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

    return {
      ticketVolumeData,
      ticketTypeData
    }
  }

  getUniqueSDMs(): string[] {
    const sdms = new Set<string>()
    this.tickets.forEach(ticket => {
      if (ticket.sdm && ticket.sdm.trim() !== '') {
        sdms.add(ticket.sdm)
      }
    })
    return Array.from(sdms).sort()
  }

  getUniqueCompanies(): string[] {
    const companies = new Set<string>()
    this.tickets.forEach(ticket => {
      if (ticket.companyName && ticket.companyName.trim() !== '') {
        companies.add(ticket.companyName)
      }
    })
    return Array.from(companies).sort()
  }

  filterTickets(filters: {
    sdm?: string
    company?: string
    dateFrom?: string
    dateTo?: string
  }): DataProcessor {
    let filteredTickets = this.tickets

    if (filters.sdm && filters.sdm !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.sdm === filters.sdm)
    }

    if (filters.company && filters.company !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.companyName === filters.company)
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filteredTickets = filteredTickets.filter(ticket => 
        new Date(ticket.createdTime) >= fromDate
      )
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      filteredTickets = filteredTickets.filter(ticket => 
        new Date(ticket.createdTime) <= toDate
      )
    }

    return new DataProcessor(filteredTickets)
  }
}