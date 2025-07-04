// Visual User Guide PDF Generator with Screenshots and Annotations
// This script creates a comprehensive PDF user guide with visual elements

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

class VisualUserGuideGenerator {
  constructor() {
    this.doc = null;
    this.font = null;
    this.boldFont = null;
    this.pageWidth = 595; // A4 width in points
    this.pageHeight = 842; // A4 height in points
    this.margin = 50;
    this.colors = {
      primary: rgb(0.2, 0.4, 0.6),
      secondary: rgb(0.15, 0.7, 0.7),
      accent: rgb(0.9, 0.3, 0.3),
      text: rgb(0.2, 0.2, 0.2),
      lightGray: rgb(0.95, 0.95, 0.95),
      darkGray: rgb(0.4, 0.4, 0.4)
    };
  }

  async generateGuide() {
    try {
      this.doc = await PDFDocument.create();
      this.font = await this.doc.embedFont(StandardFonts.Helvetica);
      this.boldFont = await this.doc.embedFont(StandardFonts.HelveticaBold);

      // Create all pages
      await this.createCoverPage();
      await this.createTableOfContents();
      await this.createGettingStartedPage();
      await this.createUploadDataPage();
      await this.createDashboardOverviewPage();
      await this.createFiltersPage();
      await this.createMetricsPage();
      await this.createSLAManagementPage();
      await this.createReportGenerationPage();
      await this.createTroubleshootingPage();

      // Save the PDF
      const pdfBytes = await this.doc.save();
      const outputPath = path.join(__dirname, '..', 'docs', 'Visual_User_Guide.pdf');
      fs.writeFileSync(outputPath, pdfBytes);
      
      console.log(`Visual User Guide created successfully at: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error generating visual user guide:', error);
      throw error;
    }
  }

  async createCoverPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    // Background gradient effect
    page.drawRectangle({
      x: 0,
      y: 0,
      width: this.pageWidth,
      height: this.pageHeight,
      color: this.colors.lightGray
    });

    // Title section
    page.drawRectangle({
      x: 0,
      y: this.pageHeight - 200,
      width: this.pageWidth,
      height: 200,
      color: this.colors.primary
    });

    page.drawText('Service Desk Analytics', {
      x: this.margin,
      y: this.pageHeight - 100,
      size: 32,
      font: this.boldFont,
      color: rgb(1, 1, 1)
    });

    page.drawText('Visual User Guide', {
      x: this.margin,
      y: this.pageHeight - 140,
      size: 24,
      font: this.font,
      color: rgb(0.9, 0.9, 0.9)
    });

    // Subtitle
    page.drawText('Complete Step-by-Step Guide with Screenshots', {
      x: this.margin,
      y: this.pageHeight - 300,
      size: 18,
      font: this.boldFont,
      color: this.colors.text
    });

    // Features list
    const features = [
      '* Upload and analyze ticket data',
      '* Interactive dashboard with charts',
      '* SLA compliance management',
      '* Professional PDF reports',
      '* AI-powered insights',
      '* Advanced filtering options'
    ];

    let yPos = this.pageHeight - 380;
    features.forEach(feature => {
      page.drawText(feature, {
        x: this.margin + 20,
        y: yPos,
        size: 14,
        font: this.font,
        color: this.colors.text
      });
      yPos -= 25;
    });

    // Footer
    page.drawText('Version 2.0 | January 2025', {
      x: this.margin,
      y: 50,
      size: 12,
      font: this.font,
      color: this.colors.darkGray
    });
  }

  async createTableOfContents() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    page.drawText('Table of Contents', {
      x: this.margin,
      y: this.pageHeight - 80,
      size: 24,
      font: this.boldFont,
      color: this.colors.primary
    });

    const contents = [
      { title: '1. Getting Started', page: 3 },
      { title: '2. Uploading Data', page: 4 },
      { title: '3. Dashboard Overview', page: 5 },
      { title: '4. Using Filters', page: 6 },
      { title: '5. Understanding Metrics', page: 7 },
      { title: '6. SLA Management', page: 8 },
      { title: '7. Generating Reports', page: 9 },
      { title: '8. Troubleshooting', page: 10 }
    ];

    let yPos = this.pageHeight - 150;
    contents.forEach(item => {
      page.drawText(item.title, {
        x: this.margin,
        y: yPos,
        size: 16,
        font: this.font,
        color: this.colors.text
      });
      
      page.drawText(`Page ${item.page}`, {
        x: this.pageWidth - this.margin - 60,
        y: yPos,
        size: 16,
        font: this.font,
        color: this.colors.darkGray
      });
      
      yPos -= 30;
    });
  }

  async createGettingStartedPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '1. Getting Started');
    
    let yPos = this.pageHeight - 120;
    
    // Step 1
    this.addStepHeader(page, 'Step 1: Access the Application', yPos);
    yPos -= 40;
    
    page.drawText('1. Open your web browser (Chrome, Firefox, Safari, or Edge)', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 20;
    
    page.drawText('2. Navigate to the application URL', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 20;
    
    page.drawText('3. You will see the welcome screen with upload area', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 60;

    // Visual placeholder for screenshot
    this.addScreenshotPlaceholder(page, 'Welcome Screen Screenshot', yPos - 120);
    yPos -= 160;

    // Step 2
    this.addStepHeader(page, 'Step 2: What You\'ll Need', yPos);
    yPos -= 40;
    
    const requirements = [
      '• CSV file with ticket data',
      '• File should contain columns: ticketId, subject, status, priority, etc.',
      '• Modern web browser with JavaScript enabled',
      '• Stable internet connection'
    ];
    
    requirements.forEach(req => {
      page.drawText(req, {
        x: this.margin + 20,
        y: yPos,
        size: 12,
        font: this.font,
        color: this.colors.text
      });
      yPos -= 20;
    });
  }

  async createUploadDataPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '2. Uploading Your Data');
    
    let yPos = this.pageHeight - 120;
    
    // Upload instructions
    this.addStepHeader(page, 'How to Upload Your CSV File', yPos);
    yPos -= 40;
    
    // Step-by-step with click indicators
    const uploadSteps = [
      { step: '1', action: 'Click the upload area or drag and drop your CSV file', highlight: true },
      { step: '2', action: 'Wait for the file to process (you\'ll see a loading indicator)', highlight: false },
      { step: '3', action: 'Dashboard will load automatically with your data', highlight: false },
      { step: '4', action: 'If upload fails, check file format and try again', highlight: false }
    ];
    
    uploadSteps.forEach(item => {
      // Step number in circle
      page.drawCircle({
        x: this.margin + 15,
        y: yPos - 5,
        size: 12,
        color: item.highlight ? this.colors.accent : this.colors.secondary
      });
      
      page.drawText(item.step, {
        x: this.margin + 11,
        y: yPos - 9,
        size: 10,
        font: this.boldFont,
        color: rgb(1, 1, 1)
      });
      
      page.drawText(item.action, {
        x: this.margin + 40,
        y: yPos - 8,
        size: 12,
        font: this.font,
        color: this.colors.text
      });
      
      yPos -= 25;
    });
    
    yPos -= 40;
    
    // Screenshot placeholder
    this.addScreenshotPlaceholder(page, 'Upload Area - Click Here to Upload', yPos - 120);
    yPos -= 160;
    
    // File format requirements
    this.addStepHeader(page, 'File Format Requirements', yPos);
    yPos -= 30;
    
    const requirements = [
      '* File must be .csv format',
      '* First row should contain column headers',
      '* Required columns: ticketId, subject, status, priority, createdTime',
      '* Optional columns: companyName, sdm, agent, type, resolvedTime'
    ];
    
    requirements.forEach(req => {
      page.drawText(req, {
        x: this.margin + 20,
        y: yPos,
        size: 11,
        font: this.font,
        color: this.colors.text
      });
      yPos -= 18;
    });
  }

  async createDashboardOverviewPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '3. Dashboard Overview');
    
    let yPos = this.pageHeight - 120;
    
    // Dashboard sections
    const sections = [
      {
        title: 'Top Metrics Cards',
        items: [
          'Total Tickets - Shows overall count',
          'Open Tickets - Currently unresolved',
          'Closed Tickets - Resolved tickets',
          'Average Resolution - Time in hours',
          'SLA Compliance - Click for details'
        ]
      },
      {
        title: 'Charts Section',
        items: [
          'Monthly Trends - Created vs Resolved',
          'Open Tickets by Type - Pie chart'
        ]
      },
      {
        title: 'Escalated Tickets',
        items: [
          'Shows escalated tickets',
          'Color-coded by priority',
          'Click for more details'
        ]
      }
    ];
    
    sections.forEach(section => {
      this.addStepHeader(page, section.title, yPos);
      yPos -= 30;
      
      section.items.forEach(item => {
        page.drawText(`• ${item}`, {
          x: this.margin + 20,
          y: yPos,
          size: 11,
          font: this.font,
          color: this.colors.text
        });
        yPos -= 16;
      });
      
      yPos -= 20;
    });
    
    // Large screenshot placeholder
    this.addScreenshotPlaceholder(page, 'Full Dashboard View', yPos - 100);
  }

  async createFiltersPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '4. Using Filters');
    
    let yPos = this.pageHeight - 120;
    
    // Filter location
    this.addStepHeader(page, 'Where to Find Filters', yPos);
    yPos -= 30;
    
    page.drawText('Filters are located in the blue bar below the header when data is loaded.', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 40;
    
    // Filter types with click instructions
    const filters = [
      {
        name: 'SDM Filter',
        description: 'Select specific Service Delivery Manager',
        instruction: 'Click dropdown > Select SDM or "All SDMs"'
      },
      {
        name: 'Company Filter',
        description: 'Focus on specific client company',
        instruction: 'Click dropdown > Select company or "All Companies"'
      },
      {
        name: 'Date Filter',
        description: 'Choose time period for analysis',
        instruction: 'Click dropdown > Select preset or specific month'
      }
    ];
    
    filters.forEach(filter => {
      // Filter box
      page.drawRectangle({
        x: this.margin,
        y: yPos - 25,
        width: this.pageWidth - 2 * this.margin,
        height: 60,
        color: this.colors.lightGray
      });
      
      page.drawText(filter.name, {
        x: this.margin + 10,
        y: yPos - 5,
        size: 14,
        font: this.boldFont,
        color: this.colors.primary
      });
      
      page.drawText(filter.description, {
        x: this.margin + 10,
        y: yPos - 20,
        size: 11,
        font: this.font,
        color: this.colors.text
      });
      
      page.drawText(`How to use: ${filter.instruction}`, {
        x: this.margin + 10,
        y: yPos - 35,
        size: 10,
        font: this.font,
        color: this.colors.accent
      });
      
      yPos -= 80;
    });
    
    // Clear filters button
    this.addStepHeader(page, 'Clear All Filters', yPos);
    yPos -= 25;
    
    page.drawText('Click the "Clear Filters" button to reset all filters to "All" selections.', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    
    // Screenshot placeholder
    this.addScreenshotPlaceholder(page, 'Filter Bar - Click Here', yPos - 80);
  }

  async createMetricsPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '5. Understanding Metrics');
    
    let yPos = this.pageHeight - 120;
    
    // Metrics explanation
    const metrics = [
      {
        name: 'Total Tickets',
        description: 'Complete count of all tickets in your dataset',
        clickable: false
      },
      {
        name: 'Open Tickets',
        description: 'Tickets that are not yet resolved or closed',
        clickable: false
      },
      {
        name: 'Closed Tickets',
        description: 'Tickets marked as resolved or closed',
        clickable: false
      },
      {
        name: 'Average Resolution',
        description: 'Mean time to resolve tickets (displayed in hours)',
        clickable: false
      },
      {
        name: 'SLA Compliance',
        description: 'Percentage of tickets meeting SLA requirements',
        clickable: true,
        clickAction: 'Click to open detailed SLA analysis'
      }
    ];
    
    metrics.forEach(metric => {
      // Metric card
      page.drawRectangle({
        x: this.margin,
        y: yPos - 30,
        width: this.pageWidth - 2 * this.margin,
        height: 50,
        color: metric.clickable ? this.colors.secondary : this.colors.lightGray,
        opacity: metric.clickable ? 0.1 : 0.3
      });
      
      page.drawText(metric.name, {
        x: this.margin + 10,
        y: yPos - 8,
        size: 14,
        font: this.boldFont,
        color: this.colors.primary
      });
      
      page.drawText(metric.description, {
        x: this.margin + 10,
        y: yPos - 23,
        size: 11,
        font: this.font,
        color: this.colors.text
      });
      
      if (metric.clickable) {
        page.drawText(`>> ${metric.clickAction}`, {
          x: this.margin + 10,
          y: yPos - 38,
          size: 10,
          font: this.boldFont,
          color: this.colors.accent
        });
      }
      
      yPos -= 70;
    });
    
    // Charts explanation
    this.addStepHeader(page, 'Charts and Visualizations', yPos);
    yPos -= 30;
    
    const charts = [
      'Monthly Trends: Shows created vs resolved tickets over 7 months',
      'Open Tickets by Type: Pie chart showing ticket category distribution',
      'All charts update automatically when you apply filters'
    ];
    
    charts.forEach(chart => {
      page.drawText(`• ${chart}`, {
        x: this.margin + 20,
        y: yPos,
        size: 11,
        font: this.font,
        color: this.colors.text
      });
      yPos -= 18;
    });
  }

  async createSLAManagementPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '6. SLA Management');
    
    let yPos = this.pageHeight - 120;
    
    // How to access SLA details
    this.addStepHeader(page, 'How to Access SLA Details', yPos);
    yPos -= 30;
    
    const slaSteps = [
      '1. Click the "SLA Compliance" metric card on the dashboard',
      '2. A modal window will open showing detailed SLA breakdown',
      '3. Use the tabs to view different aspects of SLA data',
      '4. Search for specific tickets using the search box'
    ];
    
    slaSteps.forEach(step => {
      page.drawText(step, {
        x: this.margin + 20,
        y: yPos,
        size: 12,
        font: this.font,
        color: this.colors.text
      });
      yPos -= 20;
    });
    
    yPos -= 30;
    
    // SLA Override system
    this.addStepHeader(page, 'SLA Override System', yPos);
    yPos -= 30;
    
    page.drawText('You can manually override SLA status for individual tickets:', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 25;
    
    // Toggle instructions
    page.drawRectangle({
      x: this.margin,
      y: yPos - 40,
      width: this.pageWidth - 2 * this.margin,
      height: 80,
      color: this.colors.lightGray
    });
    
    page.drawText('* Green Toggle = Ticket meets SLA requirements', {
      x: this.margin + 20,
      y: yPos - 10,
      size: 11,
      font: this.font,
      color: this.colors.text
    });
    
    page.drawText('* Red Toggle = Ticket breaches SLA requirements', {
      x: this.margin + 20,
      y: yPos - 25,
      size: 11,
      font: this.font,
      color: this.colors.text
    });
    
    page.drawText('>> Click any toggle to override the system calculation', {
      x: this.margin + 20,
      y: yPos - 40,
      size: 11,
      font: this.boldFont,
      color: this.colors.accent
    });
    
    yPos -= 80;
    
    // Export feature
    this.addStepHeader(page, 'Export SLA Data', yPos);
    yPos -= 25;
    
    page.drawText('Click "Export to Excel" button to download current SLA breach data.', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    
    // Screenshot placeholder
    this.addScreenshotPlaceholder(page, 'SLA Modal - Click Toggles Here', yPos - 80);
  }

  async createReportGenerationPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '7. Generating Reports');
    
    let yPos = this.pageHeight - 120;
    
    // Report preparation
    this.addStepHeader(page, 'Before Generating Reports', yPos);
    yPos -= 30;
    
    const prepSteps = [
      '1. Set your desired filters (Company, SDM, Date Range)',
      '2. Review the dashboard to ensure data looks correct',
      '3. Check SLA overrides if needed',
      '4. Verify charts show the expected data'
    ];
    
    prepSteps.forEach(step => {
      page.drawText(step, {
        x: this.margin + 20,
        y: yPos,
        size: 12,
        font: this.font,
        color: this.colors.text
      });
      yPos -= 18;
    });
    
    yPos -= 30;
    
    // PDF generation steps
    this.addStepHeader(page, 'How to Generate PDF Reports', yPos);
    yPos -= 30;
    
    // Step-by-step with visual indicators
    const reportSteps = [
      { step: '1', action: 'Click the "PDF" button in the top toolbar', highlight: true },
      { step: '2', action: 'Wait for generation (usually 10-30 seconds)', highlight: false },
      { step: '3', action: 'Download starts automatically', highlight: false },
      { step: '4', action: 'File saved with descriptive name', highlight: false }
    ];
    
    reportSteps.forEach(item => {
      page.drawCircle({
        x: this.margin + 15,
        y: yPos - 5,
        size: 12,
        color: item.highlight ? this.colors.accent : this.colors.secondary
      });
      
      page.drawText(item.step, {
        x: this.margin + 11,
        y: yPos - 9,
        size: 10,
        font: this.boldFont,
        color: rgb(1, 1, 1)
      });
      
      page.drawText(item.action, {
        x: this.margin + 40,
        y: yPos - 8,
        size: 12,
        font: this.font,
        color: this.colors.text
      });
      
      yPos -= 25;
    });
    
    yPos -= 30;
    
    // Report contents
    this.addStepHeader(page, 'What\'s in Your Report', yPos);
    yPos -= 25;
    
    const reportPages = [
      'Page 1: Title page with client and report details',
      'Page 2: Agenda and report overview',
      'Page 3: Key performance metrics dashboard',
      'Page 4: SLA compliance analysis',
      'Page 5: Escalated tickets (if any exist)',
      'Page 6: Monthly ticket trends chart',
      'Page 7: Open tickets by type chart',
      'Page 8: Questions and discussion page'
    ];
    
    reportPages.forEach(pageContent => {
      page.drawText(`• ${pageContent}`, {
        x: this.margin + 20,
        y: yPos,
        size: 11,
        font: this.font,
        color: this.colors.text
      });
      yPos -= 16;
    });
    
    // Screenshot placeholder
    this.addScreenshotPlaceholder(page, 'PDF Button - Click Here', yPos - 60);
  }

  async createTroubleshootingPage() {
    const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    
    this.addPageHeader(page, '8. Troubleshooting');
    
    let yPos = this.pageHeight - 120;
    
    // Common issues
    const issues = [
      {
        problem: 'CSV file won\'t upload',
        solutions: [
          'Check file is .csv format',
          'Verify column headers match requirements',
          'Try with smaller file size',
          'Ensure stable internet connection'
        ]
      },
      {
        problem: 'Dashboard not showing data',
        solutions: [
          'Refresh the browser page',
          'Check browser console for errors',
          'Clear browser cache',
          'Try uploading file again'
        ]
      },
      {
        problem: 'PDF generation fails',
        solutions: [
          'Check browser console for errors',
          'Try with smaller date range',
          'Ensure stable internet connection',
          'Refresh page and try again'
        ]
      },
      {
        problem: 'Filters not working',
        solutions: [
          'Click "Clear Filters" button',
          'Reload the page',
          'Upload data again',
          'Try different browser'
        ]
      }
    ];
    
    issues.forEach(issue => {
      // Problem header
      page.drawText(`Problem: ${issue.problem}`, {
        x: this.margin,
        y: yPos,
        size: 13,
        font: this.boldFont,
        color: this.colors.accent
      });
      yPos -= 20;
      
      // Solutions
      issue.solutions.forEach(solution => {
        page.drawText(`• ${solution}`, {
          x: this.margin + 20,
          y: yPos,
          size: 11,
          font: this.font,
          color: this.colors.text
        });
        yPos -= 16;
      });
      
      yPos -= 20;
    });
    
    // Contact information
    this.addStepHeader(page, 'Need More Help?', yPos);
    yPos -= 25;
    
    page.drawText('If you continue to experience issues:', {
      x: this.margin + 20,
      y: yPos,
      size: 12,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 20;
    
    page.drawText('1. Check the browser console for detailed error messages', {
      x: this.margin + 20,
      y: yPos,
      size: 11,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 16;
    
    page.drawText('2. Try with a different browser or device', {
      x: this.margin + 20,
      y: yPos,
      size: 11,
      font: this.font,
      color: this.colors.text
    });
    yPos -= 16;
    
    page.drawText('3. Contact your system administrator for support', {
      x: this.margin + 20,
      y: yPos,
      size: 11,
      font: this.font,
      color: this.colors.text
    });
  }

  // Helper methods
  addPageHeader(page, title) {
    page.drawRectangle({
      x: 0,
      y: this.pageHeight - 60,
      width: this.pageWidth,
      height: 60,
      color: this.colors.primary
    });
    
    page.drawText(title, {
      x: this.margin,
      y: this.pageHeight - 40,
      size: 20,
      font: this.boldFont,
      color: rgb(1, 1, 1)
    });
  }

  addStepHeader(page, title, yPos) {
    page.drawText(title, {
      x: this.margin,
      y: yPos,
      size: 16,
      font: this.boldFont,
      color: this.colors.primary
    });
  }

  addScreenshotPlaceholder(page, caption, yPos) {
    const height = 100;
    const width = this.pageWidth - 2 * this.margin;
    
    // Screenshot placeholder
    page.drawRectangle({
      x: this.margin,
      y: yPos - height,
      width: width,
      height: height,
      color: this.colors.lightGray
    });
    
    page.drawRectangle({
      x: this.margin + 2,
      y: yPos - height + 2,
      width: width - 4,
      height: height - 4,
      color: rgb(1, 1, 1)
    });
    
    page.drawText(caption, {
      x: this.margin + width / 2 - (caption.length * 3),
      y: yPos - height / 2,
      size: 12,
      font: this.boldFont,
      color: this.colors.darkGray
    });
    
    page.drawText('[Screenshot will be added here]', {
      x: this.margin + width / 2 - 80,
      y: yPos - height / 2 - 20,
      size: 10,
      font: this.font,
      color: this.colors.darkGray
    });
  }
}

// Generate the guide
async function createVisualUserGuide() {
  const generator = new VisualUserGuideGenerator();
  await generator.generateGuide();
}

// Export for use
module.exports = { createVisualUserGuide };

// Run if called directly
if (require.main === module) {
  createVisualUserGuide().catch(console.error);
}