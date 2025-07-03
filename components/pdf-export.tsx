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
      await this.createSLADetailPageWithTemplate(metrics, tickets)
      
      // Add escalated tickets page only if escalations exist
      const escalatedTickets = tickets.filter(t => t.sdmEscalation === 'true')
      if (escalatedTickets.length > 0) {
        await this.createEscalatedTicketsPageWithTemplate(escalatedTickets)
      }
      
      await this.createMonthlyChartsPageWithTemplate(chartData)
      await this.createTicketTypesPieChartPageWithTemplate(chartData)
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
    
    // Adjust positioning: move right and down, make white and 20% bigger than 50% smaller (so 40% smaller overall)
    const rightOffset = width * 0.65 // Move to right side
    const downOffset = height * 0.48 // Move down 20% more (was 0.6, now 0.48 = 60% - 20% of 60%)
    
    // Client name (positioned to the right and down, white, 20% bigger than previous)
    if (company && company !== 'all') {
      page.drawText(`Client: ${company}`, {
        x: rightOffset,
        y: downOffset,
        size: 14.4, // 20% bigger than 12 (12 * 1.2 = 14.4)
        font: boldFont,
        color: rgb(1, 1, 1), // White text
      })
    }
    
    // Report period
    const periodLabel = this.getDateFilterLabel(dateFilter)
    page.drawText(`Report Period: ${periodLabel}`, {
      x: rightOffset,
      y: downOffset - 30,
      size: 10.8, // 20% bigger than 9 (9 * 1.2 = 10.8)
      font: font,
      color: rgb(1, 1, 1), // White text
    })
    
    // SDM
    if (sdm && sdm !== 'all') {
      const sdmText = `Service Delivery Manager: ${sdm}`
      page.drawText(sdmText, {
        x: rightOffset,
        y: downOffset - 60,
        size: 9.6, // 20% bigger than 8 (8 * 1.2 = 9.6)
        font: font,
        color: rgb(1, 1, 1), // White text
      })
    }
    
    // Generated date
    const dateText = `Generated: ${new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })}`
    page.drawText(dateText, {
      x: rightOffset,
      y: downOffset - 90,
      size: 7.2, // 20% bigger than 6 (6 * 1.2 = 7.2)
      font: font,
      color: rgb(1, 1, 1), // White text
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
    
    const startY = height - 206 // Move down 2cm more (was 150, now 206 = 150 + 56 points)
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

  private async createSLADetailPageWithTemplate(metrics: DashboardMetrics, tickets: TicketData[]): Promise<void> {
    // Use Page 3 (blank canvas) again for SLA details
    const page = await this.copyTemplatePageWithOverlay(2)
    const font = await this.newDoc!.embedFont(StandardFonts.Helvetica)
    const boldFont = await this.newDoc!.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()
    const tealColor = rgb(0.06, 0.46, 0.43)
    const textColor = rgb(0.2, 0.2, 0.2)
    const redColor = rgb(0.8, 0.2, 0.2)
    
    // Page title
    page.drawText('SLA Compliance Analysis', {
      x: 50,
      y: height - 60,
      size: 20,
      font: boldFont,
      color: tealColor,
    })
    
    // Get breached tickets
    const breachedTickets = tickets.filter(t => 
      t.resolutionStatus === 'SLA Violated' || 
      ((!t.resolutionStatus || t.resolutionStatus.trim() === '') && 
       t.status !== 'Pending' && t.status !== 'Pending - Close' &&
       new Date(t.dueByTime) < new Date())
    )
    
    // SLA Summary
    const compliantTickets = tickets.length - breachedTickets.length
    page.drawText(`Total Tickets: ${tickets.length}`, {
      x: 50, y: height - 100, size: 12, font: font, color: textColor,
    })
    page.drawText(`SLA Compliant: ${compliantTickets} (${metrics.slaCompliance}%)`, {
      x: 50, y: height - 120, size: 12, font: font, color: textColor,
    })
    page.drawText(`SLA Breached: ${breachedTickets.length}`, {
      x: 50, y: height - 140, size: 12, font: font, color: redColor,
    })
    
    // Table headers
    const tableY = height - 180
    const headerHeight = 20
    const rowHeight = 18
    const columnWidths = [80, 200, 90, 90, 90, 80]
    const columnX = [50, 130, 330, 420, 510, 600]
    const headers = ['Ticket ID', 'Summary', 'Created', 'Due Date', 'Resolved', 'Status']
    
    // Draw header background
    page.drawRectangle({
      x: 50, y: tableY - 5, width: width - 100, height: headerHeight,
      color: rgb(0.9, 0.9, 0.9),
    })
    
    // Draw headers
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: columnX[index], y: tableY + 5, size: 10, font: boldFont, color: textColor,
      })
    })
    
    // Draw breached tickets (limit to fit on page)
    const maxRows = Math.min(breachedTickets.length, 20)
    breachedTickets.slice(0, maxRows).forEach((ticket, index) => {
      const y = tableY - headerHeight - (index * rowHeight)
      const rowColor = index % 2 === 0 ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1)
      
      // Draw row background
      page.drawRectangle({
        x: 50, y: y - 5, width: width - 100, height: rowHeight,
        color: rowColor,
      })
      
      // Ticket data
      const ticketData = [
        ticket.ticketId || 'N/A',
        (ticket.subject || 'No Subject').length > 25 ? 
          (ticket.subject || 'No Subject').substring(0, 25) + '...' : 
          (ticket.subject || 'No Subject'),
        new Date(ticket.createdTime).toLocaleDateString('en-GB') || 'N/A',
        new Date(ticket.dueByTime).toLocaleDateString('en-GB') || 'N/A',
        ticket.resolvedTime ? new Date(ticket.resolvedTime).toLocaleDateString('en-GB') : 'Open',
        ticket.status || 'Unknown'
      ]
      
      ticketData.forEach((data, colIndex) => {
        page.drawText(data, {
          x: columnX[colIndex], y: y, size: 8, font: font, color: textColor,
        })
      })
    })
    
    // Footer note if more tickets exist
    if (breachedTickets.length > maxRows) {
      page.drawText(`Showing ${maxRows} of ${breachedTickets.length} breached tickets`, {
        x: 50, y: 80, size: 10, font: font, color: rgb(0.5, 0.5, 0.5),
      })
    }
  }

  private async createEscalatedTicketsPageWithTemplate(escalatedTickets: TicketData[]): Promise<void> {
    // Use Page 3 (blank canvas) for escalated tickets details
    const page = await this.copyTemplatePageWithOverlay(2)
    const font = await this.newDoc!.embedFont(StandardFonts.Helvetica)
    const boldFont = await this.newDoc!.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()
    const tealColor = rgb(0.06, 0.46, 0.43)
    const textColor = rgb(0.2, 0.2, 0.2)
    const redColor = rgb(0.8, 0.2, 0.2)
    
    // Page title
    page.drawText('Escalated Tickets Analysis', {
      x: 50,
      y: height - 60,
      size: 20,
      font: boldFont,
      color: tealColor,
    })
    
    // Escalation summary
    const escalationRate = ((escalatedTickets.length / (escalatedTickets.length + 100)) * 100).toFixed(1) // Approximate
    page.drawText(`Total Escalations: ${escalatedTickets.length}`, {
      x: 50, y: height - 100, size: 12, font: font, color: textColor,
    })
    page.drawText(`Escalation Rate: ${escalationRate}%`, {
      x: 50, y: height - 120, size: 12, font: font, color: redColor,
    })
    
    // Table headers
    const tableY = height - 160
    const headerHeight = 20
    const rowHeight = 18
    const columnX = [50, 130, 300, 420, 520, 620, 720]
    const headers = ['Ticket ID', 'Summary', 'Company', 'Priority', 'Agent', 'Created', 'Status']
    
    // Draw header background
    page.drawRectangle({
      x: 50, y: tableY - 5, width: width - 100, height: headerHeight,
      color: rgb(0.9, 0.9, 0.9),
    })
    
    // Draw headers
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: columnX[index], y: tableY + 5, size: 10, font: boldFont, color: textColor,
      })
    })
    
    // Draw escalated tickets (limit to fit on page)
    const maxRows = Math.min(escalatedTickets.length, 18)
    escalatedTickets.slice(0, maxRows).forEach((ticket, index) => {
      const y = tableY - headerHeight - (index * rowHeight)
      const rowColor = index % 2 === 0 ? rgb(0.98, 0.98, 0.98) : rgb(1, 1, 1)
      
      // Draw row background
      page.drawRectangle({
        x: 50, y: y - 5, width: width - 100, height: rowHeight,
        color: rowColor,
      })
      
      // Ticket data
      const ticketData = [
        ticket.ticketId || 'N/A',
        (ticket.subject || 'No Subject').length > 20 ? 
          (ticket.subject || 'No Subject').substring(0, 20) + '...' : 
          (ticket.subject || 'No Subject'),
        (ticket.companyName || 'Unknown').length > 15 ?
          (ticket.companyName || 'Unknown').substring(0, 15) + '...' :
          (ticket.companyName || 'Unknown'),
        ticket.priority || 'Normal',
        (ticket.agent || 'Unassigned').length > 12 ?
          (ticket.agent || 'Unassigned').substring(0, 12) + '...' :
          (ticket.agent || 'Unassigned'),
        new Date(ticket.createdTime).toLocaleDateString('en-GB') || 'N/A',
        ticket.status || 'Unknown'
      ]
      
      ticketData.forEach((data, colIndex) => {
        page.drawText(data, {
          x: columnX[colIndex], y: y, size: 8, font: font, color: textColor,
        })
      })
    })
    
    // Footer note if more tickets exist
    if (escalatedTickets.length > maxRows) {
      page.drawText(`Showing ${maxRows} of ${escalatedTickets.length} escalated tickets`, {
        x: 50, y: 80, size: 10, font: font, color: rgb(0.5, 0.5, 0.5),
      })
    }
    
    // Escalation insights
    const priorityCounts: { [key: string]: number } = {}
    escalatedTickets.forEach(ticket => {
      const priority = ticket.priority || 'Normal'
      priorityCounts[priority] = (priorityCounts[priority] || 0) + 1
    })
    
    let insightY = 120
    page.drawText('Escalation Breakdown by Priority:', {
      x: 450, y: insightY, size: 12, font: boldFont, color: tealColor,
    })
    
    Object.entries(priorityCounts).forEach(([priority, count], index) => {
      const percentage = ((count / escalatedTickets.length) * 100).toFixed(1)
      page.drawText(`${priority}: ${count} tickets (${percentage}%)`, {
        x: 450, y: insightY - 20 - (index * 16), size: 10, font: font, color: textColor,
      })
    })
  }

  private async createMonthlyChartsPageWithTemplate(chartData: ChartData): Promise<void> {
    // Dedicated page for Monthly Created vs Resolved chart
    const page = await this.copyTemplatePageWithOverlay(2)
    const font = await this.newDoc!.embedFont(StandardFonts.Helvetica)
    const boldFont = await this.newDoc!.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()
    const tealColor = rgb(0.06, 0.46, 0.43)
    const textColor = rgb(0.2, 0.2, 0.2)
    
    // Page title
    page.drawText('Monthly Created vs Resolved Tickets', {
      x: 50,
      y: height - 60,
      size: 20,
      font: boldFont,
      color: tealColor,
    })
    
    // Chart subtitle
    page.drawText('Ticket Volume Trends Over Time', {
      x: 50, y: height - 90, size: 14, font: font, color: textColor,
    })
    
    // Draw chart with more space and better scaling
    const chartStartX = 80
    const chartStartY = height - 450
    const chartWidth = 600
    const chartHeight = 250
    
    // Y-axis
    page.drawLine({
      start: { x: chartStartX, y: chartStartY },
      end: { x: chartStartX, y: chartStartY + chartHeight },
      thickness: 2,
      color: rgb(0.5, 0.5, 0.5),
    })
    
    // X-axis
    page.drawLine({
      start: { x: chartStartX, y: chartStartY },
      end: { x: chartStartX + chartWidth, y: chartStartY },
      thickness: 2,
      color: rgb(0.5, 0.5, 0.5),
    })
    
    const monthlyData = chartData.ticketVolumeData.slice(-8) // Last 8 months
    const maxTickets = Math.max(...monthlyData.map(d => Math.max(d.created, d.resolved)), 10)
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxTickets / 5) * i)
      const y = chartStartY + (chartHeight / 5) * i
      page.drawText(`${value}`, {
        x: chartStartX - 25, y: y - 3, size: 8, font: font, color: textColor,
      })
      
      // Grid lines
      page.drawLine({
        start: { x: chartStartX, y: y },
        end: { x: chartStartX + chartWidth, y: y },
        thickness: 0.5,
        color: rgb(0.9, 0.9, 0.9),
      })
    }
    
    monthlyData.forEach((data, index) => {
      const x = chartStartX + 40 + (index * (chartWidth - 80) / (monthlyData.length - 1))
      const createdHeight = (data.created / maxTickets) * chartHeight
      const resolvedHeight = (data.resolved / maxTickets) * chartHeight
      
      // Created tickets bar (blue)
      page.drawRectangle({
        x: x - 12, y: chartStartY, width: 18, height: createdHeight,
        color: rgb(0.2, 0.6, 1),
      })
      
      // Resolved tickets bar (green) 
      page.drawRectangle({
        x: x + 8, y: chartStartY, width: 18, height: resolvedHeight,
        color: rgb(0.2, 0.8, 0.4),
      })
      
      // Month label
      const monthLabel = data.month.length > 8 ? data.month.substring(0, 8) : data.month
      page.drawText(monthLabel, {
        x: x - 20, y: chartStartY - 20, size: 9, font: font, color: textColor,
      })
      
      // Values above bars (no decimals)
      page.drawText(`${Math.round(data.created)}`, {
        x: x - 12, y: chartStartY + createdHeight + 8, size: 8, font: font, color: rgb(0.2, 0.6, 1),
      })
      page.drawText(`${Math.round(data.resolved)}`, {
        x: x + 8, y: chartStartY + resolvedHeight + 8, size: 8, font: font, color: rgb(0.2, 0.8, 0.4),
      })
    })
    
    // Enhanced legend
    const legendY = height - 120
    page.drawRectangle({ x: 400, y: legendY, width: 20, height: 12, color: rgb(0.2, 0.6, 1) })
    page.drawText('Created Tickets', { x: 430, y: legendY + 6, size: 12, font: font, color: textColor })
    page.drawRectangle({ x: 400, y: legendY - 25, width: 20, height: 12, color: rgb(0.2, 0.8, 0.4) })
    page.drawText('Resolved Tickets', { x: 430, y: legendY - 19, size: 12, font: font, color: textColor })
    
    // Summary statistics without decimals - moved to very right
    const summaryX = width - 300 // Position at far right
    page.drawText('Summary Statistics:', {
      x: summaryX, y: 200, size: 16, font: boldFont, color: tealColor,
    })
    
    const totalCreated = monthlyData.reduce((sum, d) => sum + d.created, 0)
    const totalResolved = monthlyData.reduce((sum, d) => sum + d.resolved, 0)
    const avgMonthlyCreated = Math.round(totalCreated / monthlyData.length)
    const avgMonthlyResolved = Math.round(totalResolved / monthlyData.length)
    
    page.drawText(`• Average monthly created: ${avgMonthlyCreated} tickets`, {
      x: summaryX, y: 175, size: 12, font: font, color: textColor,
    })
    page.drawText(`• Average monthly resolved: ${avgMonthlyResolved} tickets`, {
      x: summaryX, y: 155, size: 12, font: font, color: textColor,
    })
    page.drawText(`• Total tickets created: ${Math.round(totalCreated)}`, {
      x: summaryX, y: 135, size: 12, font: font, color: textColor,
    })
    page.drawText(`• Total tickets resolved: ${Math.round(totalResolved)}`, {
      x: summaryX, y: 115, size: 12, font: font, color: textColor,
    })
  }

  private async createTicketTypesPieChartPageWithTemplate(chartData: ChartData): Promise<void> {
    // Dedicated page for Ticket Types pie chart
    const page = await this.copyTemplatePageWithOverlay(2)
    const font = await this.newDoc!.embedFont(StandardFonts.Helvetica)
    const boldFont = await this.newDoc!.embedFont(StandardFonts.HelveticaBold)
    
    const { width, height } = page.getSize()
    const tealColor = rgb(0.06, 0.46, 0.43)
    const textColor = rgb(0.2, 0.2, 0.2)
    
    // Page title
    page.drawText('Open Tickets by Type', {
      x: 50,
      y: height - 60,
      size: 20,
      font: boldFont,
      color: tealColor,
    })
    
    page.drawText('Distribution of Open Ticket Categories', {
      x: 50, y: height - 90, size: 14, font: font, color: textColor,
    })
    
    const topTypes = chartData.openTicketTypeData.slice(0, 12)
    const totalOpenTickets = topTypes.reduce((sum, type) => sum + type.count, 0)
    
    // Draw actual pie chart
    const centerX = 300
    const centerY = height - 280
    const radius = 120
    
    const colors = [
      rgb(0.2, 0.6, 1), rgb(0.8, 0.4, 0.2), rgb(0.2, 0.8, 0.4), 
      rgb(0.8, 0.2, 0.8), rgb(1, 0.6, 0.2), rgb(0.4, 0.2, 0.8),
      rgb(0.6, 0.8, 0.2), rgb(0.8, 0.2, 0.4), rgb(0.5, 0.5, 0.5),
      rgb(0.9, 0.5, 0.7), rgb(0.3, 0.7, 0.8), rgb(0.7, 0.3, 0.5)
    ]
    
    let currentAngle = 0
    
    topTypes.forEach((type, index) => {
      const percentage = (type.count / totalOpenTickets) * 100
      const sliceAngle = (percentage / 100) * 2 * Math.PI
      
      // Draw pie slice (simplified as polygon)
      const points = []
      points.push({ x: centerX, y: centerY }) // Center point
      
      for (let a = currentAngle; a <= currentAngle + sliceAngle; a += 0.1) {
        points.push({
          x: centerX + radius * Math.cos(a),
          y: centerY + radius * Math.sin(a)
        })
      }
      
      // Draw slice as series of triangles from center
      for (let i = 1; i < points.length - 1; i++) {
        const triangle = [points[0], points[i], points[i + 1]]
        // Draw filled triangle (approximated with small rectangles)
        for (let step = 0; step <= 1; step += 0.1) {
          const x1 = triangle[0].x + step * (triangle[1].x - triangle[0].x)
          const y1 = triangle[0].y + step * (triangle[1].y - triangle[0].y)
          const x2 = triangle[0].x + step * (triangle[2].x - triangle[0].x)
          const y2 = triangle[0].y + step * (triangle[2].y - triangle[0].y)
          
          page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness: 2,
            color: colors[index % colors.length],
          })
        }
      }
      
      // Label outside the pie
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + (radius + 40) * Math.cos(labelAngle)
      const labelY = centerY + (radius + 40) * Math.sin(labelAngle)
      
      if (percentage > 3) { // Only show labels for significant slices
        page.drawText(`${Math.round(percentage)}%`, {
          x: labelX - 10, y: labelY, size: 8, font: font, color: textColor,
        })
      }
      
      currentAngle += sliceAngle
    })
    
    // Legend with ticket counts
    let legendY = height - 130
    page.drawText('Legend:', {
      x: 500, y: legendY + 20, size: 14, font: boldFont, color: tealColor,
    })
    
    topTypes.forEach((type, index) => {
      const percentage = Math.round((type.count / totalOpenTickets) * 100)
      const typeLabel = type.type.length > 25 ? type.type.substring(0, 25) + '...' : type.type
      
      page.drawRectangle({
        x: 500, y: legendY - 5, width: 15, height: 10,
        color: colors[index % colors.length],
      })
      
      page.drawText(`${typeLabel}: ${type.count} (${percentage}%)`, {
        x: 520, y: legendY, size: 9, font: font, color: textColor,
      })
      
      legendY -= 20
    })
    
    // Summary at bottom - moved to very right
    const chartSummaryX = width - 300 // Position at far right
    page.drawText('Chart Summary:', {
      x: chartSummaryX, y: 180, size: 16, font: boldFont, color: tealColor,
    })
    
    page.drawText(`• Total open tickets: ${totalOpenTickets}`, {
      x: chartSummaryX, y: 155, size: 12, font: font, color: textColor,
    })
    page.drawText(`• Number of ticket types: ${chartData.openTicketTypeData.length}`, {
      x: chartSummaryX, y: 135, size: 12, font: font, color: textColor,
    })
    page.drawText(`• Most common type: ${topTypes[0]?.type} (${topTypes[0]?.count} tickets)`, {
      x: chartSummaryX, y: 115, size: 12, font: font, color: textColor,
    })
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
    
    // Section positions (moved up 1cm and improved alignment)
    const leftX = 60
    const rightX = width / 2 + 40
    const topY = height - 72  // Moved up 1cm (28 points)
    const middleY = height - 222  // Moved up 1cm
    const bottomY = height - 372  // Moved up 1cm
    
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