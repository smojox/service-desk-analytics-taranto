// Screenshot capture script for user guide
// Since we can't install Puppeteer due to certificate issues, 
// this script provides instructions for manual screenshot capture

const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Define all the screenshots we need to capture
const screenshotGuide = {
    "welcome-screen": {
        url: "http://localhost:3008",
        description: "Initial welcome screen with upload area",
        filename: "01-welcome-screen.png",
        instructions: [
            "1. Navigate to http://localhost:3008",
            "2. Ensure no CSV data is loaded (fresh state)",
            "3. Capture the full welcome screen showing:",
            "   - Header with Taranto logo",
            "   - Welcome message",
            "   - Upload area with drag-and-drop zone",
            "   - 'Browse files' text"
        ]
    },
    "csv-upload-process": {
        url: "http://localhost:3008",
        description: "CSV upload interface during file selection",
        filename: "02-csv-upload.png", 
        instructions: [
            "1. Navigate to http://localhost:3008",
            "2. Click on the upload area to show file browser",
            "3. Capture the upload area in highlighted/active state",
            "4. Or capture drag-and-drop in progress if possible"
        ]
    },
    "dashboard-overview": {
        url: "http://localhost:3008",
        description: "Full dashboard with all components loaded",
        filename: "03-dashboard-overview.png",
        instructions: [
            "1. Upload a CSV file to load the dashboard",
            "2. Ensure all components are visible:",
            "   - Header with logo and search",
            "   - Filter bar (blue section)",
            "   - 5 metric cards",
            "   - Monthly chart and pie chart",
            "   - Escalated tickets section",
            "   - Recent priority tickets section",
            "3. Capture full page (may need to scroll or take multiple shots)"
        ]
    },
    "filter-bar": {
        url: "http://localhost:3008",
        description: "Filter bar with dropdown options",
        filename: "04-filter-bar.png",
        instructions: [
            "1. With dashboard loaded, focus on the blue filter bar",
            "2. Optionally open one of the dropdown menus to show options",
            "3. Capture showing:",
            "   - SDM dropdown",
            "   - Company dropdown", 
            "   - Date filter dropdown",
            "   - Clear Filters button",
            "   - Export buttons (CSV, PDF, Excel, AI)"
        ]
    },
    "metrics-cards": {
        url: "http://localhost:3008",
        description: "Close-up of the 5 metric cards",
        filename: "05-metrics-cards.png",
        instructions: [
            "1. Focus on the top row of metric cards",
            "2. Ensure all 5 cards are visible:",
            "   - Total Tickets",
            "   - Open Tickets", 
            "   - Closed Tickets",
            "   - Average Resolution",
            "   - SLA Compliance (this one should be highlighted as clickable)",
            "3. Capture with good detail showing numbers and icons"
        ]
    },
    "sla-modal-closed": {
        url: "http://localhost:3008",
        description: "SLA Compliance metric card highlighted for clicking",
        filename: "06-sla-card-highlight.png",
        instructions: [
            "1. Hover over the SLA Compliance metric card",
            "2. Capture it in hover state to show it's clickable",
            "3. Add annotation or arrow pointing to it"
        ]
    },
    "sla-modal-open": {
        url: "http://localhost:3008",
        description: "SLA Compliance modal with toggle switches",
        filename: "07-sla-modal.png",
        instructions: [
            "1. Click the SLA Compliance metric card to open modal",
            "2. Capture the modal showing:",
            "   - Modal header with compliance percentage",
            "   - Search box",
            "   - Table with tickets and SLA status",
            "   - Green/red toggle switches",
            "   - Export to Excel button",
            "3. Ensure some toggle switches are visible"
        ]
    },
    "charts-section": {
        url: "http://localhost:3008", 
        description: "Monthly chart and pie chart side by side",
        filename: "08-charts-section.png",
        instructions: [
            "1. Focus on the charts section of dashboard",
            "2. Capture both charts clearly:",
            "   - Monthly Created vs Resolved Tickets (line chart)",
            "   - Open Tickets by Type (pie chart)",
            "3. Ensure chart legends and data are visible"
        ]
    },
    "escalated-tickets": {
        url: "http://localhost:3008",
        description: "Escalated tickets section with priority coding",
        filename: "09-escalated-tickets.png", 
        instructions: [
            "1. Scroll to escalated tickets section",
            "2. If no escalated tickets in data, this may show 'No escalated tickets'",
            "3. Capture showing:",
            "   - Section header with escalation count",
            "   - Escalated ticket items (if any) with priority colors",
            "   - Priority badges (Urgent, High, etc.)"
        ]
    },
    "export-buttons": {
        url: "http://localhost:3008",
        description: "Export buttons in toolbar highlighted", 
        filename: "10-export-buttons.png",
        instructions: [
            "1. Focus on the top-right export section in filter bar",
            "2. Capture clearly showing all buttons:",
            "   - CSV button",
            "   - PDF button (highlight this one)",
            "   - Excel button", 
            "   - AI button",
            "3. Add annotation pointing to PDF button"
        ]
    },
    "ai-modal": {
        url: "http://localhost:3008",
        description: "AI Insights modal with analysis",
        filename: "11-ai-modal.png",
        instructions: [
            "1. Click the AI button to open AI insights modal",
            "2. Wait for analysis to complete",
            "3. Capture the modal showing:",
            "   - AI insights header",
            "   - Analysis results and recommendations",
            "   - Any charts or data visualizations in the modal"
        ]
    },
    "dropdown-examples": {
        url: "http://localhost:3008",
        description: "Filter dropdown menus opened",
        filename: "12-filter-dropdowns.png",
        instructions: [
            "1. Open one of the filter dropdowns (SDM, Company, or Date)",
            "2. Capture showing the dropdown options list",
            "3. This shows users what options are available"
        ]
    }
};

// Generate screenshot instructions file
function generateInstructions() {
    let instructions = `# Screenshot Capture Instructions for User Guide

## Overview
This guide explains how to capture screenshots for the Service Desk Analytics user guide.
The application should be running at http://localhost:3008

## Prerequisites
1. Application running on http://localhost:3008
2. Sample CSV data file ready for upload
3. Screenshot tool (built-in screenshot tools, Snipping Tool, etc.)

## Screenshots to Capture

`;

    Object.entries(screenshotGuide).forEach(([key, info]) => {
        instructions += `### ${info.filename}
**Description:** ${info.description}
**URL:** ${info.url}

**Instructions:**
${info.instructions.map(instruction => `${instruction}`).join('\n')}

---

`;
    });

    instructions += `## Tips for Better Screenshots

1. **Browser Setup:**
   - Use Chrome or Firefox for consistency
   - Set browser zoom to 100%
   - Use full screen or maximize browser window
   - Hide bookmarks bar for cleaner screenshots

2. **Image Quality:**
   - Capture at high resolution (at least 1920x1080)
   - Save as PNG format for better quality
   - Ensure good contrast and readability

3. **Annotations:**
   - Add red arrows or circles to highlight clickable elements
   - Use consistent annotation style across all screenshots
   - Keep annotations minimal but clear

4. **File Naming:**
   - Use the exact filenames specified above
   - Save all screenshots in docs/screenshots/ directory
   - Maintain consistent numbering for order

## After Capturing Screenshots

1. Save all images in the docs/screenshots/ directory
2. Run the update-userguide.js script to embed images in the HTML guide
3. Review the updated user guide to ensure all images display correctly

## Integration with User Guide

The screenshots will be automatically integrated into:
- Visual_User_Guide.pdf (placeholders will be replaced)
- interactive-userguide.html (embedded as images)

`;

    const instructionsPath = path.join(screenshotsDir, 'INSTRUCTIONS.md');
    fs.writeFileSync(instructionsPath, instructions);
    console.log(`\n📋 Screenshot instructions saved to: ${instructionsPath}`);
}

// Generate the directory structure and instructions
console.log('🖼️  Setting up screenshot capture for user guide...\n');

console.log(`📁 Created screenshots directory: ${screenshotsDir}`);
generateInstructions();

console.log(`
🎯 Next Steps:
1. Follow the instructions in docs/screenshots/INSTRUCTIONS.md
2. Capture all ${Object.keys(screenshotGuide).length} screenshots manually
3. Run 'node scripts/update-userguide.js' to integrate images

📊 Screenshots needed:
${Object.entries(screenshotGuide).map(([key, info]) => `   • ${info.filename} - ${info.description}`).join('\n')}

🌐 Application URL: http://localhost:3008
`);

module.exports = { screenshotGuide, screenshotsDir };