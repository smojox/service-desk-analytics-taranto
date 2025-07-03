"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
  Search,
  Bell,
  Settings,
  Filter,
  CalendarIcon,
  FileText,
  FileSpreadsheet,
  Brain,
  Target,
  ArrowUp,
  Upload,
  BarChart3,
  PieChart,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TicketData, parseCSV } from "@/lib/csv-parser"
import { DataProcessor, DashboardMetrics, EscalatedTicket, RecentTicket, ChartData } from "@/lib/data-processor"
import { CSVUpload } from "@/components/csv-upload"


const statusColors = {
  critical: "bg-red-500",
  investigating: "bg-orange-500",
  monitoring: "bg-yellow-500",
  resolved: "bg-green-500",
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-orange-100 text-orange-800",
  low: "bg-green-100 text-green-800",
}

export default function SupportDashboard() {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [selectedSDM, setSelectedSDM] = useState<string>("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    avgResolution: 0,
    slaCompliance: 0
  })
  const [escalatedTickets, setEscalatedTickets] = useState<EscalatedTicket[]>([])
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([])
  const [chartData, setChartData] = useState<ChartData>({
    ticketVolumeData: [],
    ticketTypeData: []
  })
  const [sdmOptions, setSdmOptions] = useState<Array<{value: string, label: string}>>([])
  const [companyOptions, setCompanyOptions] = useState<Array<{value: string, label: string}>>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)

  // Load CSV data on component mount
  useEffect(() => {
    loadCSVData()
  }, [])

  // Update data when filters change
  useEffect(() => {
    if (tickets.length > 0) {
      updateDashboardData()
    }
  }, [selectedSDM, selectedCompany, dateRange, tickets])

  const loadCSVData = async () => {
    try {
      const response = await fetch('/testfiles/testfile.csv')
      const csvContent = await response.text()
      const parsedTickets = parseCSV(csvContent)
      setTickets(parsedTickets)
      
      const processor = new DataProcessor(parsedTickets)
      const uniqueSDMs = processor.getUniqueSDMs()
      const uniqueCompanies = processor.getUniqueCompanies()
      
      setSdmOptions([
        { value: 'all', label: 'All SDMs' },
        ...uniqueSDMs.map(sdm => ({ value: sdm, label: sdm }))
      ])
      
      setCompanyOptions([
        { value: 'all', label: 'All Companies' },
        ...uniqueCompanies.map(company => ({ value: company, label: company }))
      ])
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading CSV data:', error)
      setLoading(false)
    }
  }

  const updateDashboardData = () => {
    const processor = new DataProcessor(tickets)
    const filteredProcessor = processor.filterTickets({
      sdm: selectedSDM || undefined,
      company: selectedCompany || undefined,
      dateFrom: dateRange.from?.toISOString().split('T')[0],
      dateTo: dateRange.to?.toISOString().split('T')[0]
    })
    
    setMetrics(filteredProcessor.calculateMetrics())
    setEscalatedTickets(filteredProcessor.getEscalatedTickets())
    setRecentTickets(filteredProcessor.getRecentPriorityTickets())
    setChartData(filteredProcessor.getChartData())
  }

  const handleCSVUpload = (newTickets: TicketData[]) => {
    setTickets(newTickets)
    
    const processor = new DataProcessor(newTickets)
    const uniqueSDMs = processor.getUniqueSDMs()
    const uniqueCompanies = processor.getUniqueCompanies()
    
    setSdmOptions([
      { value: 'all', label: 'All SDMs' },
      ...uniqueSDMs.map(sdm => ({ value: sdm, label: sdm }))
    ])
    
    setCompanyOptions([
      { value: 'all', label: 'All Companies' },
      ...uniqueCompanies.map(company => ({ value: company, label: company }))
    ])
    
    setShowUpload(false)
    setLoading(false)
  }

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend = "up",
    onClick,
    children,
  }: {
    title: string
    value: string | number
    change?: string
    icon: any
    trend?: "up" | "down"
    onClick?: () => void
    children?: React.ReactNode
  }) => (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-teal-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <p className={`text-xs ${trend === "up" ? "text-green-600" : "text-red-600"} flex items-center mt-1`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {change}
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-green-400">
      {/* Header */}
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Taranto</h1>
              <span className="text-gray-300">Service Desk Analytics</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search incidents..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-64"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-medium">Filters:</span>
              </div>

              {/* SDM Dropdown */}
              <Select value={selectedSDM} onValueChange={setSelectedSDM}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Select SDM" />
                </SelectTrigger>
                <SelectContent>
                  {sdmOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Company Dropdown */}
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-64 justify-start text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30",
                      !dateRange.from && "text-white/70",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Clear Filters Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={() => {
                  setSelectedSDM("")
                  setSelectedCompany("")
                  setDateRange({ from: undefined, to: undefined })
                }}
              >
                Clear Filters
              </Button>
            </div>

            {/* Export and AI Icons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                title="Upload CSV"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="h-4 w-4" />
                <span className="ml-1 text-xs">CSV</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                title="Export to PowerPoint"
              >
                <FileText className="h-4 w-4" />
                <span className="ml-1 text-xs">PPT</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                title="Export to Excel"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="ml-1 text-xs">Excel</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
                title="AI Insights"
              >
                <Brain className="h-4 w-4" />
                <span className="ml-1 text-xs">AI</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <MetricCard 
              title="Total Tickets" 
              value={metrics.totalTickets} 
              icon={Activity} 
              trend="up" 
            />
            <MetricCard 
              title="Open Tickets" 
              value={metrics.openTickets} 
              icon={AlertTriangle} 
              trend="up" 
            />
            <MetricCard 
              title="Closed Tickets" 
              value={metrics.closedTickets} 
              icon={CheckCircle} 
              trend="up" 
            />
            <MetricCard 
              title="Avg Resolution" 
              value={`${metrics.avgResolution}h`} 
              icon={Clock} 
              trend="down" 
            />
            <MetricCard 
              title="SLA Compliance" 
              value={`${metrics.slaCompliance}%`} 
              icon={Target} 
              trend="up" 
            />
          </div>
        )}

        {/* Small Gap */}
        <div className="mb-6"></div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Ticket Volume</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 rounded w-full h-full"></div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  {chartData.ticketVolumeData.length > 0 ? 
                    `${chartData.ticketVolumeData.length} data points available` : 
                    'Chart visualization would go here'
                  }
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Ticket Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 rounded w-full h-full"></div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <PieChart className="h-8 w-8 mr-2" />
                  {chartData.ticketTypeData.length > 0 ? 
                    `${chartData.ticketTypeData.length} ticket types` : 
                    'Chart visualization would go here'
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Escalated Tickets Section */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 flex items-center">
                <ArrowUp className="h-5 w-5 text-red-600 mr-2" />
                Escalated Tickets
              </CardTitle>
              <Badge className="bg-red-100 text-red-800">
                {loading ? '...' : `${escalatedTickets.length} Escalated`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {escalatedTickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No escalated tickets found</p>
                ) : (
                  escalatedTickets.slice(0, 5).map((ticket) => {
                    const priorityColor = ticket.priority === 'Urgent' ? 'red' : 
                                         ticket.priority === 'High' ? 'orange' : 'yellow'
                    return (
                      <div key={ticket.ticketId} className={`flex items-center justify-between p-4 bg-${priorityColor}-50 rounded-lg border-l-4 border-${priorityColor}-500`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full bg-${priorityColor}-500`} />
                          <div>
                            <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                            <p className="text-sm text-gray-600">
                              {ticket.ticketId} • {ticket.companyName} • {new Date(ticket.createdTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`bg-${priorityColor}-100 text-${priorityColor}-800`}>
                            {ticket.priority}
                          </Badge>
                          {ticket.usersAffected > 0 && (
                            <span className="text-sm text-gray-600">{ticket.usersAffected}+ users affected</span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Recent Priority Tickets */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Recent Priority Tickets</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No high priority tickets found</p>
                  ) : (
                    recentTickets.map((ticket) => {
                      const priorityColor = ticket.priority === 'Urgent' ? 'red' : 'orange'
                      return (
                        <div key={ticket.ticketId} className={`flex items-center justify-between p-4 bg-${priorityColor}-50 rounded-lg hover:bg-${priorityColor}-100 transition-colors`}>
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full bg-${priorityColor}-500`} />
                            <div>
                              <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                              <p className="text-sm text-gray-600">
                                {ticket.ticketId} • {new Date(ticket.createdTime).toLocaleDateString()} • {ticket.agent}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`bg-${priorityColor}-100 text-${priorityColor}-800`}>
                              {ticket.priority}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* CSV Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Upload CSV Data</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CSVUpload onDataUpload={handleCSVUpload} />
          </div>
        </div>
      )}
    </div>
  )
}
