"use client"

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
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
  private templateDoc: PDFDocument | null = null
  private newDoc: PDFDocument | null = null

  constructor() {
    this.templateDoc = null
    this.newDoc = null
  }

  async generateReport(data: PDFExportProps): Promise<void> {
    const { metrics, tickets, chartData, selectedSDM, selectedCompany, selectedDateFilter } = data
    
    try {
      // Load template PDF
      await this.loadTemplatePDF()
      
      // Create new PDF document
      this.newDoc = await PDFDocument.create()
      
      // Copy and modify specific pages from template
      await this.createTitlePageWithTemplate(selectedCompany, selectedDateFilter, selectedSDM)
      await this.createAgendaPageWithTemplate()
      await this.createServiceReportPageWithTemplate(metrics, tickets, chartData)
      await this.createQuestionsPageWithTemplate()
      await this.createFinalPageWithTemplate()
      
      // Generate and download
      const pdfBytes = await this.newDoc.save()
      const timestamp = new Date().toISOString().split('T')[0]
      const companyName = selectedCompany && selectedCompany !== 'all' ? selectedCompany.replace(/[^a-zA-Z0-9]/g, '_') : 'All_Companies'
      const filename = `Service_Review_${companyName}_${timestamp}.pdf`
      
      // Download the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error generating PDF with templates:', error)
      // Fallback to basic PDF without templates
      await this.generateBasicReport(data)
    }
  }

  private async loadTemplatePDF(): Promise<void> {
    try {
      const response = await fetch('/Template.pdf')
      if (!response.ok) {
        throw new Error('Template PDF not found')
      }
      const templateBytes = await response.arrayBuffer()
      this.templateDoc = await PDFDocument.load(templateBytes)
    } catch (error) {
      console.error('Error loading template PDF:', error)
      throw error
    }
  }

  private async copyTemplatePageWithOverlay(templatePageIndex: number): Promise<any> {
    if (!this.templateDoc || !this.newDoc) {
      throw new Error('Template or new document not initialized')
    }

    // Copy the specific page from template
    const [templatePage] = await this.newDoc.copyPages(this.templateDoc, [templatePageIndex])
    const page = this.newDoc.addPage(templatePage)
    
    return page
  }

  private async createTitlePageWithTemplate(company?: string, dateFilter?: string, sdm?: string): Promise<void> {
    // Use Page 1 (index 0) of template
    const page = await this.copyTemplatePageWithOverlay(0)
    const font = await this.newDoc!.embedFont(StandardFonts.Helvetica)
    const boldFont = await this.newDoc!.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()
    
    // Add content below Taranto25 logo (adjust Y coordinates based on your template layout)
    const centerX = width / 2
    
    // Client name (positioned to not overlap with logo)
    if (company && company !== 'all') {
      page.drawText(`Client: ${company}`, {
        x: centerX - (company.length * 8), // Center the text approximately
        y: height - 200, // Adjust Y position based on your template
        size: 24,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      })
    }
    
    // Report period
    const periodLabel = this.getDateFilterLabel(dateFilter)
    page.drawText(`Report Period: ${periodLabel}`, {
      x: centerX - (periodLabel.length * 6),
      y: height - 240,
      size: 18,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    })
    
    // SDM
    if (sdm && sdm !== 'all') {
      const sdmText = `Service Delivery Manager: ${sdm}`
      page.drawText(sdmText, {
        x: centerX - (sdmText.length * 5),
        y: height - 280,
        size: 16,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      })
    }
    
    // Generated date
    const dateText = `Generated: ${new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })}`
    page.drawText(dateText, {
      x: centerX - (dateText.length * 4),
      y: height - 320,
      size: 12,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    })
  }

  private async createAgendaPageWithTemplate(): Promise<void> {
    // Use Page 2 (index 1) of template
    const page = await this.copyTemplatePageWithOverlay(1)
    const font = await this.newDoc!.embedFont(StandardFonts.Helvetica)
    
    const { height } = page.getSize()
    
    // Add agenda items (adjust positions based on your template)
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
    
    const startY = height - 150 // Adjust based on template layout
    const itemHeight = 25
    
    agendaItems.forEach((item, index) => {
      const y = startY - (index * itemHeight)
      page.drawText(`${index + 1}. ${item}`, {
        x: 80, // Adjust X position based on template
        y: y,
        size: 16,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      })
    })
  }

  private async createServiceReportPageWithTemplate(metrics: DashboardMetrics, tickets: TicketData[], chartData: ChartData): Promise<void> {
    // Use Page 3 (index 2) of template - the blank canvas
    const page = await this.copyTemplatePageWithOverlay(2)
    const font = await this.newDoc!.embedFont(StandardFonts.Helvetica)
    const boldFont = await this.newDoc!.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()
    
    // Layout service data in 6 sections on the blank canvas
    await this.addServiceDataSections(page, font, boldFont, metrics, tickets, chartData, width, height)
  }

  private async createQuestionsPageWithTemplate(): Promise<void> {
    // Use Page 7 (index 6) of template
    await this.copyTemplatePageWithOverlay(6)
    // No additional content needed - template handles this
  }

  private async createFinalPageWithTemplate(): Promise<void> {
    // Use Page 8 (index 7) of template  
    await this.copyTemplatePageWithOverlay(7)
    // No additional content needed - template handles this
  }

  private async addServiceDataSections(page: any, font: any, boldFont: any, metrics: DashboardMetrics, tickets: TicketData[], chartData: ChartData, width: number, height: number): Promise<void> {
    const sectionTitleSize = 14
    const textSize = 10
    const tealColor = rgb(0.06, 0.46, 0.43) // Teal color matching dashboard
    const textColor = rgb(0.2, 0.2, 0.2)
    
    // Section positions (adjust based on your template layout)
    const leftX = 60
    const rightX = width / 2 + 30
    const topY = height - 100
    const middleY = height - 250
    const bottomY = height - 400
    
    // Top Left: Key Metrics
    page.drawText('Key Performance Metrics', {
      x: leftX,
      y: topY,
      size: sectionTitleSize,
      font: boldFont,
      color: tealColor,
    })
    
    const metricsData = [
      `Total Tickets: ${metrics.totalTickets}`,
      `Open Tickets: ${metrics.openTickets}`,
      `SLA Compliance: ${metrics.slaCompliance}%`,
      `Avg Resolution: ${metrics.avgResolution}h`
    ]
    
    metricsData.forEach((metric, index) => {
      page.drawText(metric, {
        x: leftX,
        y: topY - 30 - (index * 20),
        size: textSize,
        font: font,
        color: textColor,
      })
    })
    
    // Top Right: SLA Performance
    page.drawText('SLA Performance', {
      x: rightX,
      y: topY,
      size: sectionTitleSize,
      font: boldFont,
      color: tealColor,
    })
    
    const breachedTickets = tickets.filter(t => 
      t.resolutionStatus === 'SLA Violated' || 
      ((!t.resolutionStatus || t.resolutionStatus.trim() === '') && 
       t.status !== 'Pending' && t.status !== 'Pending - Close' &&
       new Date(t.dueByTime) < new Date())
    ).length
    
    const compliantTickets = tickets.length - breachedTickets
    
    const slaData = [
      `Compliance Rate: ${metrics.slaCompliance}%`,
      `Within SLA: ${compliantTickets}`,
      `Breached: ${breachedTickets}`,
    ]
    
    slaData.forEach((item, index) => {
      page.drawText(item, {
        x: rightX,
        y: topY - 30 - (index * 20),
        size: textSize,
        font: font,
        color: textColor,
      })
    })
    
    // Middle Left: Current Status
    page.drawText('Current Ticket Status', {
      x: leftX,
      y: middleY,
      size: sectionTitleSize,
      font: boldFont,
      color: tealColor,
    })
    
    const statusCounts: { [key: string]: number } = {}
    tickets.forEach(ticket => {
      const status = ticket.status || 'Unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    
    Object.entries(statusCounts).slice(0, 5).forEach(([status, count], index) => {
      page.drawText(`${status}: ${count}`, {
        x: leftX,
        y: middleY - 30 - (index * 16),
        size: textSize,
        font: font,
        color: textColor,
      })
    })
    
    // Middle Right: Escalated Tickets
    page.drawText('Escalated Tickets', {
      x: rightX,
      y: middleY,
      size: sectionTitleSize,
      font: boldFont,
      color: tealColor,
    })
    
    const escalatedTickets = tickets.filter(t => t.sdmEscalation === 'true')
    const escalationRate = ((escalatedTickets.length / tickets.length) * 100).toFixed(1)
    
    const escalationData = [
      `Total Escalations: ${escalatedTickets.length}`,
      `Escalation Rate: ${escalationRate}%`,
    ]
    
    escalationData.forEach((item, index) => {
      page.drawText(item, {
        x: rightX,
        y: middleY - 30 - (index * 20),
        size: textSize,
        font: font,
        color: textColor,
      })
    })
    
    // Bottom Left: Top Ticket Types
    page.drawText('Top Ticket Types', {
      x: leftX,
      y: bottomY,
      size: sectionTitleSize,
      font: boldFont,
      color: tealColor,
    })
    
    const topTypes = chartData.openTicketTypeData.slice(0, 5)
    topTypes.forEach((type, index) => {
      page.drawText(`${type.type}: ${type.count}`, {
        x: leftX,
        y: bottomY - 30 - (index * 16),
        size: textSize,
        font: font,
        color: textColor,
      })
    })
    
    // Bottom Right: Performance Summary
    page.drawText('Performance Summary', {
      x: rightX,
      y: bottomY,
      size: sectionTitleSize,
      font: boldFont,
      color: tealColor,
    })
    
    const performance = metrics.slaCompliance >= 90 ? 'Excellent' : metrics.slaCompliance >= 70 ? 'Good' : 'Needs Attention'
    const resolution = metrics.avgResolution <= 8 ? 'Fast' : metrics.avgResolution <= 24 ? 'Moderate' : 'Slow'
    
    const summaryData = [
      `Overall: ${performance}`,
      `Resolution: ${resolution}`,
      `Service Level: ${metrics.slaCompliance}%`,
    ]
    
    summaryData.forEach((item, index) => {
      page.drawText(item, {
        x: rightX,
        y: bottomY - 30 - (index * 20),
        size: textSize,
        font: font,
        color: textColor,
      })
    })
  }

  private async generateBasicReport(data: PDFExportProps): Promise<void> {
    // Fallback basic report without templates
    const { selectedCompany, selectedDateFilter } = data
    
    // Create a simple PDF using pdf-lib
    const doc = await PDFDocument.create()
    const page = doc.addPage([595.28, 841.89]) // A4 size
    const font = await doc.embedFont(StandardFonts.Helvetica)
    
    const { width, height } = page.getSize()
    
    page.drawText('Service Desk Report', {
      x: width / 2 - 100,
      y: height - 100,
      size: 20,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    })
    
    if (selectedCompany && selectedCompany !== 'all') {
      page.drawText(`Client: ${selectedCompany}`, {
        x: width / 2 - 80,
        y: height - 140,
        size: 16,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      })
    }
    
    const pdfBytes = await doc.save()
    const timestamp = new Date().toISOString().split('T')[0]
    const companyName = selectedCompany && selectedCompany !== 'all' ? selectedCompany.replace(/[^a-zA-Z0-9]/g, '_') : 'All_Companies'
    const filename = `Service_Review_${companyName}_${timestamp}.pdf`
    
    // Download the PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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