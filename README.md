# Service Desk Analytics Taranto

A comprehensive service desk analytics dashboard with real-time ticket monitoring, SLA tracking, and CSV data integration.

## Features

- 📊 **Real-time Metrics**: Total tickets, open/closed counts, average resolution time, SLA compliance
- 🚨 **Escalated Tickets**: Priority-based filtering and tracking with visual indicators
- 📈 **Dynamic Charts**: Ticket volume trends and type breakdown visualizations
- 🔍 **Advanced Filtering**: Filter by SDM, Company, date ranges with dynamic dropdowns
- 📁 **CSV Integration**: Drag-and-drop CSV upload with automatic data processing
- 🎨 **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - Reusable UI components and CSV upload functionality
- `lib/` - Data processing utilities and CSV parser
- `public/` - Static assets including sample data
- `instructions/` - Field mapping and configuration documentation

## Data Format

The application expects CSV files with service desk ticket data including:
- Ticket details (ID, Subject, Status, Priority, Type)
- Timing data (Created, Resolved, SLA compliance)
- Assignment data (Agent, SDM, Company)
- Customer information and impact metrics

## Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Data Processing**: Custom CSV parser and analytics engine
- **Charts**: Recharts integration ready
- **State Management**: React hooks with real-time updates
