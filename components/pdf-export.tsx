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

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = 20
    this.currentY = this.margin
    this.lineHeight = 6
  }

  async generateReport(data: PDFExportProps): Promise<void> {
    const { metrics, tickets, chartData, selectedSDM, selectedCompany, selectedDateFilter } = data
    
    // Page 1: Title & Executive Summary
    await this.createTitlePage(selectedCompany, selectedDateFilter)
    
    // Page 2: Service Performance Overview
    this.addPage()
    await this.createPerformanceOverview(metrics, tickets.length)
    
    // Page 3: SLA Performance Analysis
    this.addPage()
    await this.createSLAAnalysis(metrics, tickets)
    
    // Page 4: Ticket Volume & Trends
    this.addPage()
    await this.createVolumeAnalysis(chartData, metrics)
    
    // Page 5: Service Quality Metrics
    this.addPage()
    await this.createServiceQualityMetrics(tickets, metrics)
    
    // Page 6: Recommendations & Next Steps
    this.addPage()
    await this.createRecommendations(metrics, tickets)
    
    // Generate and download
    const timestamp = new Date().toISOString().split('T')[0]
    const companyName = selectedCompany && selectedCompany !== 'all' ? selectedCompany.replace(/[^a-zA-Z0-9]/g, '_') : 'All_Companies'
    const filename = `Service_Review_${companyName}_${timestamp}.pdf`
    
    this.pdf.save(filename)
  }

  private addPage() {
    this.pdf.addPage()
    this.currentY = this.margin
    this.addHeaderFooter()
  }

  private addHeaderFooter() {
    // Header with logo space and title
    this.pdf.setFillColor(15, 118, 110) // Teal color
    this.pdf.rect(0, 0, this.pageWidth, 15, 'F')
    
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Service Desk Performance Review', this.margin, 10)
    
    // Footer
    const pageNumber = this.pdf.internal.getCurrentPageInfo().pageNumber
    this.pdf.setTextColor(128, 128, 128)
    this.pdf.setFontSize(8)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text(`Page ${pageNumber}`, this.pageWidth - this.margin, this.pageHeight - 10, { align: 'right' })
    this.pdf.text('Confidential - For Client Review Only', this.margin, this.pageHeight - 10)
    
    this.currentY = 25 // Start content after header
  }

  private async createTitlePage(selectedCompany?: string, selectedDateFilter?: string) {
    this.addHeaderFooter()
    
    // Main title
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(28)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('SERVICE DESK', this.pageWidth / 2, 60, { align: 'center' })
    this.pdf.text('PERFORMANCE REVIEW', this.pageWidth / 2, 75, { align: 'center' })
    
    // Client information
    if (selectedCompany && selectedCompany !== 'all') {
      this.pdf.setFontSize(18)
      this.pdf.setTextColor(64, 64, 64)
      this.pdf.text(`Client: ${selectedCompany}`, this.pageWidth / 2, 95, { align: 'center' })
    }
    
    // Report period
    const periodLabel = this.getDateFilterLabel(selectedDateFilter)
    this.pdf.setFontSize(14)
    this.pdf.setTextColor(96, 96, 96)
    this.pdf.text(`Report Period: ${periodLabel}`, this.pageWidth / 2, 110, { align: 'center' })
    
    // Generated date
    this.pdf.setFontSize(12)
    this.pdf.text(`Generated: ${new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })}`, this.pageWidth / 2, 125, { align: 'center' })
    
    // Professional summary box
    this.pdf.setFillColor(248, 250, 252)
    this.pdf.rect(this.margin, 150, this.pageWidth - (this.margin * 2), 60, 'F')
    this.pdf.setDrawColor(203, 213, 225)
    this.pdf.rect(this.margin, 150, this.pageWidth - (this.margin * 2), 60, 'S')
    
    this.pdf.setTextColor(51, 51, 51)
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('Executive Summary', this.margin + 10, 165)
    
    this.pdf.setFontSize(11)
    this.pdf.setFont('helvetica', 'normal')
    const summaryText = `This comprehensive service review provides detailed analysis of your support operations, 
including SLA performance, ticket resolution metrics, and service quality indicators. 
The data presented reflects actual performance during the specified period and includes 
actionable insights for continuous service improvement.`
    
    this.pdf.text(summaryText, this.margin + 10, 175, { 
      maxWidth: this.pageWidth - (this.margin * 2) - 20,
      lineHeightFactor: 1.5
    })
  }

  private async createPerformanceOverview(metrics: DashboardMetrics, totalTickets: number) {
    this.addSectionTitle('Service Performance Overview')
    
    // Key metrics cards
    const metricsData = [
      { 
        label: 'Total Tickets Processed', 
        value: metrics.totalTickets.toString(), 
        status: 'neutral',
        description: 'Total volume handled'
      },
      { 
        label: 'SLA Compliance Rate', 
        value: `${metrics.slaCompliance}%`, 
        status: metrics.slaCompliance >= 90 ? 'excellent' : metrics.slaCompliance >= 70 ? 'good' : 'attention',
        description: 'Within agreed service levels'
      },
      { 
        label: 'Average Resolution Time', 
        value: `${metrics.avgResolution} hours`, 
        status: metrics.avgResolution <= 8 ? 'excellent' : metrics.avgResolution <= 24 ? 'good' : 'attention',
        description: 'Mean time to resolution'
      },
      { 
        label: 'Currently Open Tickets', 
        value: metrics.openTickets.toString(), 
        status: metrics.openTickets < (totalTickets * 0.1) ? 'excellent' : metrics.openTickets < (totalTickets * 0.3) ? 'good' : 'attention',
        description: 'Active tickets requiring attention'
      }
    ]
    
    const cardWidth = (this.pageWidth - (this.margin * 2) - 10) / 2
    const cardHeight = 35
    
    metricsData.forEach((metric, index) => {
      const x = this.margin + (index % 2) * (cardWidth + 10)
      const y = this.currentY + Math.floor(index / 2) * (cardHeight + 10)
      
      // Card background
      this.pdf.setFillColor(255, 255, 255)
      this.pdf.rect(x, y, cardWidth, cardHeight, 'F')
      this.pdf.setDrawColor(229, 231, 235)
      this.pdf.rect(x, y, cardWidth, cardHeight, 'S')
      
      // Status indicator
      const statusColors = {
        excellent: [16, 185, 129],
        good: [245, 158, 11],
        attention: [239, 68, 68],
        neutral: [59, 130, 246]
      }
      const [r, g, b] = statusColors[metric.status as keyof typeof statusColors]
      this.pdf.setFillColor(r, g, b)
      this.pdf.rect(x, y, 4, cardHeight, 'F')
      
      // Metric value
      this.pdf.setTextColor(17, 24, 39)
      this.pdf.setFontSize(18)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(metric.value, x + 10, y + 12)
      
      // Metric label
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(metric.label, x + 10, y + 20)
      
      // Description
      this.pdf.setFontSize(8)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.setTextColor(107, 114, 128)
      this.pdf.text(metric.description, x + 10, y + 27)
    })
    
    this.currentY += 80
    
    // Performance summary
    this.addSubsectionTitle('Performance Summary')
    
    const performanceText = this.generatePerformanceSummary(metrics, totalTickets)
    this.pdf.setTextColor(55, 65, 81)
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text(performanceText, this.margin, this.currentY, {
      maxWidth: this.pageWidth - (this.margin * 2),
      lineHeightFactor: 1.4
    })
    
    this.currentY += 30
  }

  private async createSLAAnalysis(metrics: DashboardMetrics, tickets: TicketData[]) {
    this.addSectionTitle('SLA Performance Analysis')
    
    // SLA breakdown
    const breachedTickets = tickets.filter(t => 
      t.resolutionStatus === 'SLA Violated' || 
      ((!t.resolutionStatus || t.resolutionStatus.trim() === '') && 
       t.status !== 'Pending' && t.status !== 'Pending - Close' &&
       new Date(t.dueByTime) < new Date())
    ).length
    
    const compliantTickets = tickets.length - breachedTickets
    
    // SLA Status indicator
    const slaColor = metrics.slaCompliance >= 90 ? [16, 185, 129] : 
                    metrics.slaCompliance >= 70 ? [245, 158, 11] : [239, 68, 68]
    
    this.pdf.setFillColor(slaColor[0], slaColor[1], slaColor[2])
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - (this.margin * 2), 3, 'F')
    this.currentY += 10
    
    // SLA table
    const slaTableData = [
      ['Metric', 'Value', 'Target', 'Status'],
      ['SLA Compliance Rate', `${metrics.slaCompliance}%`, '≥ 90%', metrics.slaCompliance >= 90 ? '✓ Met' : '⚠ Below Target'],
      ['Tickets Within SLA', compliantTickets.toString(), 'Maximize', ''],
      ['SLA Breaches', breachedTickets.toString(), 'Minimize', breachedTickets === 0 ? '✓ Excellent' : '⚠ Attention Required'],
      ['Average Resolution Time', `${metrics.avgResolution}h`, '≤ 8h', metrics.avgResolution <= 8 ? '✓ Met' : '⚠ Above Target']
    ]
    
    this.createTable(slaTableData, this.currentY)
    this.currentY += (slaTableData.length * 8) + 15
    
    // SLA insights
    this.addSubsectionTitle('SLA Performance Insights')
    const slaInsights = this.generateSLAInsights(metrics, compliantTickets, breachedTickets)
    
    this.pdf.setTextColor(55, 65, 81)
    this.pdf.setFontSize(10)
    this.pdf.text(slaInsights, this.margin, this.currentY, {
      maxWidth: this.pageWidth - (this.margin * 2),
      lineHeightFactor: 1.4
    })
    
    this.currentY += 25
  }

  private async createVolumeAnalysis(chartData: ChartData, metrics: DashboardMetrics) {
    this.addSectionTitle('Ticket Volume & Trend Analysis')
    
    // Volume trends summary
    if (chartData.ticketVolumeData.length > 0) {
      this.addSubsectionTitle('Volume Trends')
      
      const recentMonths = chartData.ticketVolumeData.slice(-3)
      const volumeTableData = [
        ['Period', 'Created', 'Resolved', 'Net Change'],
        ...recentMonths.map(month => [
          new Date(month.month + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
          month.created.toString(),
          month.resolved.toString(),
          (month.resolved - month.created).toString()
        ])
      ]
      
      this.createTable(volumeTableData, this.currentY)
      this.currentY += (volumeTableData.length * 8) + 15
    }
    
    // Ticket types breakdown
    if (chartData.openTicketTypeData.length > 0) {
      this.addSubsectionTitle('Open Tickets by Category')
      
      const topTypes = chartData.openTicketTypeData.slice(0, 5)
      const typeTableData = [
        ['Category', 'Count', 'Percentage', 'Priority'],
        ...topTypes.map(type => [
          type.type,
          type.count.toString(),
          `${((type.count / metrics.openTickets) * 100).toFixed(1)}%`,
          type.count > (metrics.openTickets * 0.3) ? 'High' : type.count > (metrics.openTickets * 0.1) ? 'Medium' : 'Low'
        ])
      ]
      
      this.createTable(typeTableData, this.currentY)
      this.currentY += (typeTableData.length * 8) + 15
    }
  }

  private async createServiceQualityMetrics(tickets: TicketData[], metrics: DashboardMetrics) {
    this.addSectionTitle('Service Quality Metrics')
    
    // Agent performance summary
    const agentStats: { [key: string]: { resolved: number; total: number } } = {}
    
    tickets.forEach(ticket => {
      if (ticket.agent && ticket.agent !== 'Unassigned') {
        if (!agentStats[ticket.agent]) {
          agentStats[ticket.agent] = { resolved: 0, total: 0 }
        }
        agentStats[ticket.agent].total++
        if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
          agentStats[ticket.agent].resolved++
        }
      }
    })
    
    const agentPerformance = Object.entries(agentStats)
      .map(([agent, stats]) => ({
        agent,
        resolved: stats.resolved,
        total: stats.total,
        rate: ((stats.resolved / stats.total) * 100).toFixed(1)
      }))
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
      .slice(0, 5)
    
    if (agentPerformance.length > 0) {
      this.addSubsectionTitle('Agent Performance (Top 5)')
      
      const agentTableData = [
        ['Agent', 'Resolved', 'Total Assigned', 'Success Rate'],
        ...agentPerformance.map(agent => [
          agent.agent,
          agent.resolved.toString(),
          agent.total.toString(),
          `${agent.rate}%`
        ])
      ]
      
      this.createTable(agentTableData, this.currentY)
      this.currentY += (agentTableData.length * 8) + 15
    }
    
    // Escalation metrics
    const escalatedTickets = tickets.filter(t => t.sdmEscalation === 'true')
    const escalationRate = ((escalatedTickets.length / tickets.length) * 100).toFixed(1)
    
    this.addSubsectionTitle('Escalation Metrics')
    
    const escalationTableData = [
      ['Metric', 'Value', 'Assessment'],
      ['Total Escalations', escalatedTickets.length.toString(), ''],
      ['Escalation Rate', `${escalationRate}%`, parseFloat(escalationRate) < 5 ? '✓ Low' : parseFloat(escalationRate) < 15 ? '⚠ Moderate' : '⚠ High'],
      ['First Call Resolution', `${(100 - parseFloat(escalationRate)).toFixed(1)}%`, '']
    ]
    
    this.createTable(escalationTableData, this.currentY)
    this.currentY += (escalationTableData.length * 8) + 10
  }

  private async createRecommendations(metrics: DashboardMetrics, tickets: TicketData[]) {
    this.addSectionTitle('Recommendations & Action Items')
    
    const recommendations = this.generateRecommendations(metrics, tickets)
    
    recommendations.forEach((rec, index) => {
      // Priority indicator
      const priorityColors = {
        high: [239, 68, 68],
        medium: [245, 158, 11],
        low: [16, 185, 129]
      }
      
      const [r, g, b] = priorityColors[rec.priority as keyof typeof priorityColors]
      this.pdf.setFillColor(r, g, b)
      this.pdf.circle(this.margin + 3, this.currentY + 3, 2, 'F')
      
      // Recommendation text
      this.pdf.setTextColor(17, 24, 39)
      this.pdf.setFontSize(11)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(`${index + 1}. ${rec.title}`, this.margin + 10, this.currentY + 5)
      
      this.pdf.setFontSize(9)
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.setTextColor(55, 65, 81)
      this.pdf.text(rec.description, this.margin + 10, this.currentY + 12, {
        maxWidth: this.pageWidth - (this.margin * 2) - 10,
        lineHeightFactor: 1.3
      })
      
      this.currentY += 20
    })
    
    // Next review section
    this.currentY += 10
    this.addSubsectionTitle('Next Service Review')
    
    const nextReview = new Date()
    nextReview.setMonth(nextReview.getMonth() + 1)
    
    this.pdf.setTextColor(55, 65, 81)
    this.pdf.setFontSize(10)
    this.pdf.text(`Scheduled for: ${nextReview.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })}`, this.margin, this.currentY)
    
    this.currentY += 8
    this.pdf.text('Focus areas: Implementation of recommendations and performance trend analysis', this.margin, this.currentY)
  }

  private addSectionTitle(title: string) {
    this.pdf.setTextColor(15, 118, 110)
    this.pdf.setFontSize(16)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(title, this.margin, this.currentY)
    this.currentY += 12
  }

  private addSubsectionTitle(title: string) {
    this.pdf.setTextColor(55, 65, 81)
    this.pdf.setFontSize(12)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(title, this.margin, this.currentY)
    this.currentY += 8
  }

  private createTable(data: string[][], startY: number) {
    const rowHeight = 8
    const colWidths = [40, 30, 30, 50] // Adjust based on content
    
    data.forEach((row, rowIndex) => {
      const y = startY + (rowIndex * rowHeight)
      
      if (rowIndex === 0) {
        // Header row
        this.pdf.setFillColor(248, 250, 252)
        this.pdf.rect(this.margin, y - 2, this.pageWidth - (this.margin * 2), rowHeight, 'F')
        this.pdf.setTextColor(55, 65, 81)
        this.pdf.setFontSize(9)
        this.pdf.setFont('helvetica', 'bold')
      } else {
        this.pdf.setTextColor(75, 85, 99)
        this.pdf.setFontSize(9)
        this.pdf.setFont('helvetica', 'normal')
      }
      
      let x = this.margin + 5
      row.forEach((cell, colIndex) => {
        this.pdf.text(cell, x, y + 4)
        x += colWidths[colIndex] || 30
      })
      
      // Row separator
      if (rowIndex === 0) {
        this.pdf.setDrawColor(203, 213, 225)
        this.pdf.line(this.margin, y + rowHeight - 2, this.pageWidth - this.margin, y + rowHeight - 2)
      }
    })
  }

  private generatePerformanceSummary(metrics: DashboardMetrics, totalTickets: number): string {
    const performance = metrics.slaCompliance >= 90 ? 'excellent' : metrics.slaCompliance >= 70 ? 'good' : 'below expectations'
    const resolution = metrics.avgResolution <= 8 ? 'fast' : metrics.avgResolution <= 24 ? 'reasonable' : 'slower than optimal'
    
    return `During this reporting period, service desk performance has been ${performance} with an SLA compliance rate of ${metrics.slaCompliance}%. ` +
           `Resolution times are ${resolution} at an average of ${metrics.avgResolution} hours. ` +
           `A total of ${totalTickets} tickets were processed, with ${metrics.openTickets} currently remaining open. ` +
           `The service team continues to focus on maintaining high service standards and improving customer satisfaction.`
  }

  private generateSLAInsights(metrics: DashboardMetrics, compliant: number, breached: number): string {
    if (metrics.slaCompliance >= 90) {
      return `Excellent SLA performance with ${metrics.slaCompliance}% compliance rate. The service team is consistently meeting agreed service levels. ` +
             `Out of ${compliant + breached} tickets analyzed, ${compliant} were resolved within SLA timeframes. ` +
             `This demonstrates strong process adherence and effective resource management.`
    } else if (metrics.slaCompliance >= 70) {
      return `Good SLA performance at ${metrics.slaCompliance}% compliance, though there is room for improvement. ` +
             `${breached} tickets breached SLA out of ${compliant + breached} total tickets. ` +
             `Focus should be placed on identifying bottlenecks and optimizing resolution processes to achieve target compliance levels.`
    } else {
      return `SLA performance requires immediate attention with ${metrics.slaCompliance}% compliance rate. ` +
             `${breached} tickets breached SLA commitments, representing a significant service impact. ` +
             `Urgent review of processes, resource allocation, and escalation procedures is recommended to restore service levels.`
    }
  }

  private generateRecommendations(metrics: DashboardMetrics, tickets: TicketData[]): Array<{title: string, description: string, priority: string}> {
    const recommendations = []
    
    if (metrics.slaCompliance < 90) {
      recommendations.push({
        title: 'Improve SLA Compliance',
        description: `Current compliance rate of ${metrics.slaCompliance}% is below target. Implement process optimization and resource reallocation to achieve 90%+ compliance.`,
        priority: metrics.slaCompliance < 70 ? 'high' : 'medium'
      })
    }
    
    if (metrics.avgResolution > 24) {
      recommendations.push({
        title: 'Reduce Resolution Times',
        description: `Average resolution time of ${metrics.avgResolution} hours exceeds best practices. Consider additional training, automation, or process improvements.`,
        priority: 'high'
      })
    }
    
    const escalationRate = (tickets.filter(t => t.sdmEscalation === 'true').length / tickets.length) * 100
    if (escalationRate > 15) {
      recommendations.push({
        title: 'Reduce Escalation Rate',
        description: `High escalation rate of ${escalationRate.toFixed(1)}% indicates potential first-line resolution challenges. Review knowledge base and agent training.`,
        priority: 'medium'
      })
    }
    
    if (metrics.openTickets > (tickets.length * 0.3)) {
      recommendations.push({
        title: 'Address Open Ticket Backlog',
        description: `High number of open tickets (${metrics.openTickets}) may impact service quality. Consider temporary resource increase or backlog clearing initiative.`,
        priority: 'high'
      })
    }
    
    // Always include continuous improvement
    recommendations.push({
      title: 'Continuous Service Improvement',
      description: 'Maintain regular service reviews, customer feedback collection, and process optimization initiatives to ensure sustained performance improvement.',
      priority: 'low'
    })
    
    return recommendations
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