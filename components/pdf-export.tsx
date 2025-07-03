"use client"

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { TicketData } from '@/lib/csv-parser'
import { DashboardMetrics, ChartData } from '@/lib/data-processor'

interface PDFExportProps {
  tickets: TicketData[]
  metrics: DashboardMetrics
  chartData: ChartData
  selectedSDM?: string
  selectedCompany?: string
  selectedDateFilter?: string
}

export class ClientServiceReportGenerator {
  private pdf: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private currentY: number
  private lineHeight: number
  private templatePages: string[] = []

  constructor() {
    this.pdf = new jsPDF('l', 'mm', 'a4') // Landscape orientation
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = 30
    this.currentY = this.margin
    this.lineHeight = 6
  }

  async generateReport(data: PDFExportProps): Promise<void> {
    const { metrics, tickets, chartData, selectedSDM, selectedCompany, selectedDateFilter } = data
    
    try {
      // Load template pages
      await this.loadTemplatePages()
      
      // Page 1: Title Page with template background
      await this.createTitlePageWithTemplate(selectedCompany, selectedDateFilter, selectedSDM)
      
      // Page 2: Agenda with template background
      await this.createAgendaPage()
      
      // Page 3: Service Report Content
      await this.createServiceReportPage(metrics, tickets, chartData)
      
      // Page 4: Questions Page (template only)
      await this.createQuestionsPage()
      
      // Page 5: Final Page (template only)
      await this.createFinalPage()
      
      // Generate and download
      const timestamp = new Date().toISOString().split('T')[0]
      const companyName = selectedCompany && selectedCompany !== 'all' ? selectedCompany.replace(/[^a-zA-Z0-9]/g, '_') : 'All_Companies'
      const filename = `Service_Review_${companyName}_${timestamp}.pdf`
      
      this.pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF with templates:', error)
      // Fallback to basic PDF without templates
      await this.generateBasicReport(data)
    }
  }

  private async loadTemplatePages(): Promise<void> {
    // For now, we'll create the PDF structure
    // In a production environment, you would extract pages from the template PDF
    // This requires additional libraries like pdf-lib or similar
    console.log('Template loading - using structured approach')
  }

  private async createTitlePageWithTemplate(company?: string, dateFilter?: string, sdm?: string): Promise<void> {
    // Add background for page 1 template
    this.addTemplateBackground(1)
    
    // Add content below the Taranto25 logo (positioned around y=100 for landscape)
    const centerX = this.pageWidth / 2
    
    // Client name
    if (company && company !== 'all') {
      this.pdf.setTextColor(51, 51, 51)
      this.pdf.setFontSize(24)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(`Client: ${company}`, centerX, 120, { align: 'center' })
    }
    
    // Report period
    const periodLabel = this.getDateFilterLabel(dateFilter)
    this.pdf.setFontSize(18)
    this.pdf.setTextColor(75, 75, 75)
    this.pdf.text(`Report Period: ${periodLabel}`, centerX, 140, { align: 'center' })
    
    // SDM
    if (sdm && sdm !== 'all') {
      this.pdf.setFontSize(16)
      this.pdf.text(`Service Delivery Manager: ${sdm}`, centerX, 160, { align: 'center' })
    }
    
    // Generated date
    this.pdf.setFontSize(12)
    this.pdf.setTextColor(100, 100, 100)
    this.pdf.text(`Generated: ${new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })}`, centerX, 180, { align: 'center' })
  }

  private async createAgendaPage(): Promise<void> {
    this.pdf.addPage()
    this.addTemplateBackground(2)
    
    // Add agenda items - positioned to work with template layout
    const agendaItems = [
      'Service Performance Overview',
      'SLA Compliance Analysis', 
      'Ticket Volume & Trends',
      'Escalation Metrics',
      'Agent Performance Summary',
      'Current Status & Issues',
      'Recommendations & Actions',
      'Questions & Discussion'
    ]
    
    // Position agenda items (adjust coordinates based on your template)
    this.pdf.setTextColor(51, 51, 51)
    this.pdf.setFontSize(16)
    this.pdf.setFont('helvetica', 'normal')
    
    const startY = 80
    const itemHeight = 15
    
    agendaItems.forEach((item, index) => {
      const y = startY + (index * itemHeight)
      this.pdf.text(`${index + 1}. ${item}`, 50, y)
    })
  }

  private async createServiceReportPage(metrics: DashboardMetrics, tickets: TicketData[], chartData: ChartData): Promise<void> {
    this.pdf.addPage()
    this.addTemplateBackground(3)
    
    // Use the blank canvas (page 3) to layout all service data
    await this.layoutServiceData(metrics, tickets, chartData)
  }

  private async createQuestionsPage(): Promise<void> {
    this.pdf.addPage()
    this.addTemplateBackground(7) // Page 7 from template
    // No additional content needed - template handles this
  }

  private async createFinalPage(): Promise<void> {
    this.pdf.addPage()
    this.addTemplateBackground(8) // Page 8 from template
    // No additional content needed - template handles this
  }

  private addTemplateBackground(pageNumber: number): void {
    // This would load the specific page from template.pdf as background
    // For now, we'll add a placeholder that indicates which template page this represents
    this.pdf.setFillColor(245, 247, 250)
    this.pdf.rect(0, 0, this.pageWidth, this.pageHeight, 'F')
    
    // Add template page indicator (remove this in production)
    this.pdf.setTextColor(200, 200, 200)
    this.pdf.setFontSize(8)
    this.pdf.text(`Template Page ${pageNumber}`, 10, 10)
  }

  private async layoutServiceData(metrics: DashboardMetrics, tickets: TicketData[], chartData: ChartData): Promise<void> {
    // Layout all service data on the blank canvas (page 3)
    
    // Key Metrics Section (Top Left)
    await this.addKeyMetricsSection(metrics, 30, 40)
    
    // SLA Performance (Top Right)
    await this.addSLASection(metrics, tickets, 160, 40)
    
    // Current Status (Middle Left)
    await this.addCurrentStatusSection(tickets, 30, 100)
    
    // Escalated Tickets (Middle Right)
    await this.addEscalatedTicketsSection(tickets, 160, 100)
    
    // Ticket Types (Bottom Left)
    await this.addTicketTypesSection(chartData, 30, 160)
    
    // Performance Summary (Bottom Right)
    await this.addPerformanceSummarySection(metrics, tickets, 160, 160)
  }

  private async addKeyMetricsSection(metrics: DashboardMetrics, x: number, y: number): Promise<void> {
    // Section title
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Key Performance Metrics', x, y)
    
    // Metrics
    const metricsData = [
      { label: 'Total Tickets', value: metrics.totalTickets.toString() },
      { label: 'Open Tickets', value: metrics.openTickets.toString() },
      { label: 'SLA Compliance', value: `${metrics.slaCompliance}%` },
      { label: 'Avg Resolution', value: `${metrics.avgResolution}h` }
    ]
    
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setTextColor(51, 51, 51)
    
    metricsData.forEach((metric, index) => {
      const itemY = y + 15 + (index * 8)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(`${metric.label}:`, x, itemY)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(metric.value, x + 40, itemY)
    })
  }

  private async addSLASection(metrics: DashboardMetrics, tickets: TicketData[], x: number, y: number): Promise<void> {
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('SLA Performance', x, y)
    
    // SLA status indicator
    const slaColor = metrics.slaCompliance >= 90 ? [16, 185, 129] : 
                    metrics.slaCompliance >= 70 ? [245, 158, 11] : [239, 68, 68]
    
    this.pdf.setFillColor(slaColor[0], slaColor[1], slaColor[2])
    this.pdf.rect(x, y + 5, 100, 3, 'F')
    
    const breachedTickets = tickets.filter(t => 
      t.resolutionStatus === 'SLA Violated' || 
      ((!t.resolutionStatus || t.resolutionStatus.trim() === '') && 
       t.status !== 'Pending' && t.status !== 'Pending - Close' &&
       new Date(t.dueByTime) < new Date())
    ).length
    
    const compliantTickets = tickets.length - breachedTickets
    
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(51, 51, 51)
    this.pdf.text(`Compliance Rate: ${metrics.slaCompliance}%`, x, y + 20)
    this.pdf.text(`Within SLA: ${compliantTickets}`, x, y + 28)
    this.pdf.text(`Breached: ${breachedTickets}`, x, y + 36)
  }

  private async addCurrentStatusSection(tickets: TicketData[], x: number, y: number): Promise<void> {
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Current Ticket Status', x, y)
    
    const statusCounts: { [key: string]: number } = {}
    tickets.forEach(ticket => {
      const status = ticket.status || 'Unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(51, 51, 51)
    
    Object.entries(statusCounts).slice(0, 5).forEach(([status, count], index) => {
      const itemY = y + 15 + (index * 8)
      this.pdf.text(`${status}: ${count}`, x, itemY)
    })
  }

  private async addEscalatedTicketsSection(tickets: TicketData[], x: number, y: number): Promise<void> {
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Escalated Tickets', x, y)
    
    const escalatedTickets = tickets.filter(t => t.sdmEscalation === 'true')
    const escalationRate = ((escalatedTickets.length / tickets.length) * 100).toFixed(1)
    
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(51, 51, 51)
    this.pdf.text(`Total Escalations: ${escalatedTickets.length}`, x, y + 15)
    this.pdf.text(`Escalation Rate: ${escalationRate}%`, x, y + 23)
    
    // Recent escalations
    const recentEscalations = escalatedTickets
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
      .slice(0, 3)
    
    if (recentEscalations.length > 0) {
      this.pdf.setFontSize(9)
      this.pdf.text('Recent:', x, y + 35)
      recentEscalations.forEach((ticket, index) => {
        const itemY = y + 43 + (index * 6)
        this.pdf.text(`• ${ticket.ticketId}`, x, itemY)
      })
    }
  }

  private async addTicketTypesSection(chartData: ChartData, x: number, y: number): Promise<void> {
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Top Ticket Types', x, y)
    
    const topTypes = chartData.openTicketTypeData.slice(0, 5)
    
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(51, 51, 51)
    
    topTypes.forEach((type, index) => {
      const itemY = y + 15 + (index * 8)
      this.pdf.text(`${type.type}: ${type.count}`, x, itemY)
    })
  }

  private async addPerformanceSummarySection(metrics: DashboardMetrics, tickets: TicketData[], x: number, y: number): Promise<void> {
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Performance Summary', x, y)
    
    // Generate performance assessment
    const performance = metrics.slaCompliance >= 90 ? 'Excellent' : metrics.slaCompliance >= 70 ? 'Good' : 'Needs Attention'
    const resolution = metrics.avgResolution <= 8 ? 'Fast' : metrics.avgResolution <= 24 ? 'Moderate' : 'Slow'
    
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(51, 51, 51)
    
    const summaryLines = [
      `Overall Performance: ${performance}`,
      `Resolution Speed: ${resolution}`,
      `Service Level: ${metrics.slaCompliance}%`,
      `Open Tickets: ${metrics.openTickets}`,
      ''
    ]
    
    summaryLines.forEach((line, index) => {
      if (line) {
        const itemY = y + 15 + (index * 8)
        this.pdf.text(line, x, itemY)
      }
    })
  }

  private async generateBasicReport(data: PDFExportProps): Promise<void> {
    // Fallback basic report without templates
    const { selectedCompany, selectedDateFilter } = data
    
    this.pdf.setTextColor(51, 51, 51)
    this.pdf.setFontSize(20)
    this.pdf.text('Service Desk Report', this.pageWidth / 2, 50, { align: 'center' })
    
    if (selectedCompany && selectedCompany !== 'all') {
      this.pdf.setFontSize(16)
      this.pdf.text(`Client: ${selectedCompany}`, this.pageWidth / 2, 70, { align: 'center' })
    }
    
    const timestamp = new Date().toISOString().split('T')[0]
    const companyName = selectedCompany && selectedCompany !== 'all' ? selectedCompany.replace(/[^a-zA-Z0-9]/g, '_') : 'All_Companies'
    const filename = `Service_Review_${companyName}_${timestamp}.pdf`
    
    this.pdf.save(filename)
  }

  private getDateFilterLabel(dateFilter?: string): string {
    switch (dateFilter) {
      case 'last3months': return 'Last 3 Months'
      case 'last6months': return 'Last 6 Months'
      case 'lastyear': return 'Last 12 Months'
      case 'all': return 'All Time'
      default:
        if (dateFilter?.includes('-')) {
          const [year, month] = dateFilter.split('-')
          const date = new Date(parseInt(year), parseInt(month) - 1, 1)
          return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
        }
        return 'All Time'
    }
  }
}

// Hook for easy usage in components
export function usePDFExport() {
  const exportToPDF = async (data: PDFExportProps) => {
    const generator = new ClientServiceReportGenerator()
    await generator.generateReport(data)
  }
  
  return { exportToPDF }
}