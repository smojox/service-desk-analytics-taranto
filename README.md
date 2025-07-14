# 📊 Service Desk Analytics Dashboard v1.1

[![Release](https://img.shields.io/badge/release-v1.1-blue.svg)](https://github.com/smojox/service-desk-analytics-taranto/releases/tag/v1.1)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)

A comprehensive service desk analytics dashboard built for Taranto, providing powerful insights into ticket performance, SLA compliance, and team efficiency. Perfect for service desk managers, IT directors, and stakeholders who need clear visibility into support operations.

## 🎯 Key Features

### 📈 **Real-time Analytics Dashboard**
- **Live Metrics**: Total tickets, open/closed counts, average resolution time, SLA compliance
- **Interactive Charts**: Monthly ticket volume trends with 7-month historical view
- **Visual KPIs**: Color-coded metrics with trend indicators and hover details
- **Performance Tracking**: Real-time updates as data changes

### 🎪 **SDM Monthly Reviews**
- **Modal-based Interface**: Streamlined review process without losing dashboard context
- **Company Analysis**: Detailed performance breakdown by company
- **SLA Trending**: Month-over-month SLA comparisons with visual indicators
- **RAG Status Management**: Red/Amber/Green classifications with comment tracking
- **Ticket Type Breakdown**: Individual counts for Incidents, Service Requests, Problems, and Others

### 🔍 **Advanced Filtering & Search**
- **Multi-dimensional Filtering**: Filter by SDM, Company, and custom date ranges
- **Smart Dropdowns**: Dynamic company filtering based on SDM selection
- **Contextual Charts**: Monthly charts respect SDM/company filters while preserving historical context
- **Clear Filters**: Easy reset functionality for quick data exploration

### 📊 **Professional Exports**
- **PDF Service Reviews**: Comprehensive reports with charts, metrics, and professional formatting
- **Page Selection**: Choose specific pages to include in PDF exports with customizable options
- **Detailed Analysis Pages**: Open Incidents/Service Requests with pagination, Problem Records with JIRA references
- **Age Breakdown Charts**: Breakdown by Age of Ticket with vertical date formatting (MMM/YY)
- **Escalation Process Integration**: Automated inclusion of escalation documentation
- **Excel Data Export**: Detailed monthly review data for further analysis
- **Print-ready Reports**: Formatted for stakeholder presentations and archival

### 🤖 **AI-Powered Insights**
- **Pattern Recognition**: Intelligent analysis of ticket trends and anomalies
- **Performance Recommendations**: AI-generated suggestions for process improvement
- **Predictive Analytics**: Forecasting based on historical data patterns
- **Executive Summaries**: High-level insights for management reporting

### ⚡ **Performance & User Experience**
- **Lag-free Text Entry**: Optimized comment handling for smooth typing experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fast Data Processing**: Efficient CSV parsing and real-time calculations
- **Auto-save Functionality**: Automatic persistence of review data and comments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/smojox/service-desk-analytics-taranto.git
cd service-desk-analytics-taranto

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📋 Getting Started Guide

### 1. **Upload Your Data**
- Click the CSV upload area on the welcome screen
- Select your service desk export file
- Data is automatically parsed and validated

### 2. **Explore the Dashboard** 
- Use the filter bar to focus on specific SDMs, companies, or time periods
- Click on metric cards for detailed breakdowns
- Hover over charts for interactive data points

### 3. **Generate Monthly Reviews**
- Click the "Review" button in the header
- Select the month and SDM for analysis
- Review company performance and add comments
- Assign RAG status and export reports

### 4. **Export Reports**
- Use PDF export for comprehensive service reviews
- Excel export for detailed data analysis
- Share professional reports with stakeholders

## 📊 Data Requirements

The dashboard expects CSV files with the following key fields:

### Required Fields
- **ticketId**: Unique ticket identifier
- **subject**: Ticket summary/title
- **status**: Current ticket status (Open, Resolved, Closed, etc.)
- **priority**: Ticket priority level
- **createdTime**: Ticket creation timestamp
- **companyName**: Customer company name
- **sdm**: Service Desk Manager assignment

### SLA & Performance Fields
- **resolutionStatus**: SLA compliance status ('Within SLA', 'SLA Violated')
- **resolutionTimeHrs**: Time to resolution in hours
- **dueByTime**: SLA due date/time

### Additional Fields
- **type**: Ticket type (Incident, Service Request, Problem, etc.)
- **agent**: Assigned agent/technician
- **group**: Support group assignment

> 📁 **Sample Data**: Check `/public/testfiles/` for example CSV format

## 🏗️ Project Structure

```
service-desk-analytics-taranto/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard
│   └── monthly-review/    # Review page (legacy)
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── charts/           # Chart components
│   ├── modals/           # Modal dialogs
│   └── csv-upload.tsx    # CSV upload handler
├── lib/                  # Core utilities
│   ├── csv-parser.ts     # Data parsing logic
│   ├── data-processor.ts # Analytics engine
│   └── utils.ts          # Shared utilities
├── docs/                 # Documentation
│   ├── screenshots/      # UI screenshots
│   └── user-guides/      # User documentation
└── public/               # Static assets
    ├── testfiles/        # Sample data
    └── logo.png          # Branding assets
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 + TypeScript + React 18
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for interactive visualizations
- **Data Processing**: Custom analytics engine with TypeScript
- **State Management**: React hooks with optimized performance
- **PDF Generation**: Custom PDF export functionality
- **Development**: ESLint + Prettier + TypeScript strict mode

## 📈 SLA Calculation Logic

The dashboard uses a comprehensive SLA calculation that handles:

- **Explicit Status**: 'Within SLA' and 'SLA Violated' values
- **Due Date Checking**: Automatic calculation based on `dueByTime` field
- **Status Consideration**: Pending tickets assumed compliant
- **Override Support**: Manual SLA adjustments through the UI
- **Historical Accuracy**: Consistent calculations across dashboard and reviews

## 🎨 UI Components

Built with modern, accessible components:

- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Interactive Charts**: Hover states and clickable elements
- **Modal Dialogs**: Overlay interfaces that preserve context
- **Form Controls**: Accessible dropdowns, inputs, and buttons
- **Loading States**: Smooth loading indicators and skeleton screens
- **Toast Notifications**: User feedback for actions and errors

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Customize application behavior
NEXT_PUBLIC_APP_NAME="Service Desk Analytics"
NEXT_PUBLIC_COMPANY_NAME="Taranto"
```

### CSV Field Mapping
The application automatically maps common CSV field variations. See `/docs/field-mapping.md` for customization options.

## 📚 Documentation

- **User Guide**: `/docs/USER_MANUAL.md`
- **Screenshots**: `/docs/screenshots/`
- **API Reference**: `/docs/api/`
- **Development Guide**: `/docs/development.md`

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/smojox/service-desk-analytics-taranto/issues)
- **Documentation**: [User Manual](/docs/USER_MANUAL.md)
- **Email**: Contact your system administrator

## 🏆 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)

---

**🤖 Generated with [Claude Code](https://claude.ai/code)**

**v1.1 Release** - July 2025 | Built for Taranto Service Desk Analytics

## 🔄 Version 1.1 Release Notes

### New Features
- **PDF Page Selection**: Choose which pages to include in PDF exports with checkbox interface
- **Enhanced Ticket Analysis**: New dedicated pages for Open Incidents/Service Requests and Problem Records
- **Improved Chart Formatting**: Vertical date labels with MMM/YY format for better readability
- **Escalation Process Integration**: Automatic inclusion of escalation documentation in PDF exports
- **Pagination Support**: 15 tickets per page for detailed analysis sections
- **Production Optimizations**: Cleaned up project structure and improved performance

### Improvements
- Removed SDM management text from executive summaries for cleaner presentation
- Replaced Performance Summary with Priority breakdown analysis
- Enhanced chart positioning and alignment across all PDF pages
- Improved filtering for company-specific data across all analysis pages
- Better handling of JIRA references in Problem Records