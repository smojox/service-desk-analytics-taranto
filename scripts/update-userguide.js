// Script to update user guide with actual screenshots
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
const userGuideHtml = path.join(__dirname, '..', 'docs', 'interactive-userguide.html');

// Screenshot mapping for the user guide
const screenshotMapping = {
    "welcome-screen": {
        filename: "01-welcome-screen.png",
        placeholder: "Screenshot: Initial welcome screen with upload area",
        section: "getting-started",
        description: "Welcome screen showing upload area"
    },
    "csv-upload": {
        filename: "02-csv-upload.png", 
        placeholder: "Screenshot: CSV upload interface",
        section: "upload-data",
        description: "CSV file upload process"
    },
    "dashboard-overview": {
        filename: "03-dashboard-overview.png",
        placeholder: "Screenshot: Complete dashboard with all sections highlighted",
        section: "dashboard",
        description: "Full dashboard view with all components"
    },
    "filter-bar": {
        filename: "04-filter-bar.png",
        placeholder: "Screenshot: Filter bar with dropdowns highlighted",
        section: "filters", 
        description: "Filter controls in the blue toolbar"
    },
    "metrics-cards": {
        filename: "05-metrics-cards.png",
        placeholder: "Screenshot: Metrics cards section",
        section: "metrics",
        description: "Key performance metric cards"
    },
    "sla-card-highlight": {
        filename: "06-sla-card-highlight.png",
        placeholder: "Screenshot: SLA card highlighted for clicking",
        section: "sla",
        description: "SLA Compliance card ready to click"
    },
    "sla-modal": {
        filename: "07-sla-modal.png",
        placeholder: "Screenshot: SLA modal with toggle switches",
        section: "sla",
        description: "SLA management modal with override toggles"
    },
    "charts-section": {
        filename: "08-charts-section.png",
        placeholder: "Screenshot: Charts section with monthly and pie charts",
        section: "dashboard",
        description: "Monthly trends and ticket type charts"
    },
    "escalated-tickets": {
        filename: "09-escalated-tickets.png",
        placeholder: "Screenshot: Escalated tickets section",
        section: "dashboard", 
        description: "Escalated tickets with priority indicators"
    },
    "export-buttons": {
        filename: "10-export-buttons.png",
        placeholder: "Screenshot: Export buttons in toolbar",
        section: "reports",
        description: "PDF, Excel, and AI export buttons"
    },
    "ai-modal": {
        filename: "11-ai-modal.png",
        placeholder: "Screenshot: AI insights modal",
        section: "dashboard",
        description: "AI-powered analytics and recommendations"
    },
    "filter-dropdowns": {
        filename: "12-filter-dropdowns.png",
        placeholder: "Screenshot: Filter dropdown options",
        section: "filters",
        description: "Dropdown menus showing filter options"
    }
};

function checkScreenshotsExist() {
    const missingScreenshots = [];
    const existingScreenshots = [];
    
    Object.entries(screenshotMapping).forEach(([key, info]) => {
        const screenshotPath = path.join(screenshotsDir, info.filename);
        if (fs.existsSync(screenshotPath)) {
            existingScreenshots.push(info.filename);
        } else {
            missingScreenshots.push(info.filename);
        }
    });
    
    return { existing: existingScreenshots, missing: missingScreenshots };
}

function updateHtmlUserGuide() {
    if (!fs.existsSync(userGuideHtml)) {
        console.error('❌ HTML user guide not found at:', userGuideHtml);
        return false;
    }
    
    let htmlContent = fs.readFileSync(userGuideHtml, 'utf8');
    let updatedCount = 0;
    
    // Replace screenshot placeholders with actual images
    Object.entries(screenshotMapping).forEach(([key, info]) => {
        const screenshotPath = path.join(screenshotsDir, info.filename);
        
        if (fs.existsSync(screenshotPath)) {
            // Convert to relative path for HTML
            const relativePath = `screenshots/${info.filename}`;
            
            // Find and replace the placeholder div
            const placeholderRegex = new RegExp(
                `<div class="screenshot-placeholder">\\s*<h4>[^<]*</h4>\\s*<p>${info.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</p>([\\s\\S]*?)</div>`,
                'g'
            );
            
            const replacement = `<div class="screenshot-container">
                <img src="${relativePath}" alt="${info.description}" style="width: 100%; max-width: 800px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <p style="text-align: center; margin-top: 10px; font-style: italic; color: #666;">${info.description}</p>$1
            </div>`;
            
            if (htmlContent.match(placeholderRegex)) {
                htmlContent = htmlContent.replace(placeholderRegex, replacement);
                updatedCount++;
            }
            
            // Also look for simpler placeholder patterns
            const simplePattern = new RegExp(`<p>${info.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</p>`, 'g');
            if (htmlContent.match(simplePattern)) {
                htmlContent = htmlContent.replace(simplePattern, 
                    `<img src="${relativePath}" alt="${info.description}" style="width: 100%; max-width: 600px; border: 1px solid #ddd; border-radius: 8px; margin: 10px 0;">`
                );
                updatedCount++;
            }
        }
    });
    
    // Add CSS for screenshot styling if not present
    if (!htmlContent.includes('.screenshot-container')) {
        const cssAddition = `
        .screenshot-container {
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .screenshot-container img {
            border: 2px solid #e9ecef;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease;
        }
        
        .screenshot-container img:hover {
            transform: scale(1.02);
        }
        `;
        
        htmlContent = htmlContent.replace('</style>', cssAddition + '</style>');
    }
    
    // Write updated HTML
    fs.writeFileSync(userGuideHtml, htmlContent);
    
    console.log(`✅ Updated HTML user guide with ${updatedCount} screenshots`);
    return updatedCount > 0;
}

function updatePdfGuide() {
    // For PDF guide, we'll create an updated version that references the screenshots
    const pdfGuideScript = path.join(__dirname, 'create-visual-userguide-with-images.js');
    
    const updatedPdfScript = `// Updated Visual User Guide PDF Generator with actual screenshots
// This script creates a comprehensive PDF user guide with real screenshot references

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

class VisualUserGuideWithImagesGenerator {
    constructor() {
        this.doc = null;
        this.font = null;
        this.boldFont = null;
        this.pageWidth = 595;
        this.pageHeight = 842;
        this.margin = 50;
        this.screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');
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

            // Create all pages with screenshot references
            await this.createCoverPage();
            await this.createTableOfContents();
            await this.createGettingStartedPageWithScreenshots();
            await this.createUploadDataPageWithScreenshots();
            await this.createDashboardOverviewPageWithScreenshots();
            await this.createFiltersPageWithScreenshots();
            await this.createMetricsPageWithScreenshots();
            await this.createSLAManagementPageWithScreenshots();
            await this.createReportGenerationPageWithScreenshots();
            await this.createTroubleshootingPage();

            // Save the PDF
            const pdfBytes = await this.doc.save();
            const outputPath = path.join(__dirname, '..', 'docs', 'Visual_User_Guide_With_Screenshots.pdf');
            fs.writeFileSync(outputPath, pdfBytes);
            
            console.log('✅ Updated PDF user guide created with screenshot references');
            return outputPath;
        } catch (error) {
            console.error('Error generating updated PDF guide:', error);
            throw error;
        }
    }

    // Add methods here that reference actual screenshots
    async createGettingStartedPageWithScreenshots() {
        const page = this.doc.addPage([this.pageWidth, this.pageHeight]);
        
        this.addPageHeader(page, '1. Getting Started');
        
        let yPos = this.pageHeight - 120;
        
        this.addStepHeader(page, 'Step 1: Access the Application', yPos);
        yPos -= 30;
        
        page.drawText('Navigate to the application URL and you will see the welcome screen.', {
            x: this.margin + 20,
            y: yPos,
            size: 12,
            font: this.font,
            color: this.colors.text
        });
        yPos -= 60;

        // Reference to actual screenshot
        this.addScreenshotReference(page, 'See screenshot: 01-welcome-screen.png', yPos - 20);
        yPos -= 60;
        
        this.addStepHeader(page, 'What You Will See', yPos);
        yPos -= 30;
        
        const features = [
            '* Welcome message with application title',
            '* Large upload area for CSV files', 
            '* Instructions for getting started',
            '* Clean, professional interface'
        ];
        
        features.forEach(feature => {
            page.drawText(feature, {
                x: this.margin + 20,
                y: yPos,
                size: 11,
                font: this.font,
                color: this.colors.text
            });
            yPos -= 18;
        });
    }

    addScreenshotReference(page, reference, yPos) {
        page.drawRectangle({
            x: this.margin,
            y: yPos - 25,
            width: this.pageWidth - 2 * this.margin,
            height: 30,
            color: this.colors.lightGray
        });
        
        page.drawText(reference, {
            x: this.margin + 10,
            y: yPos - 15,
            size: 11,
            font: this.boldFont,
            color: this.colors.primary
        });
    }
    
    // Include other helper methods from original script
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
}

// Export for use
module.exports = { VisualUserGuideWithImagesGenerator };
`;

    fs.writeFileSync(pdfGuideScript, updatedPdfScript);
    console.log('📄 Created updated PDF guide script with screenshot references');
}

function generateScreenshotIndex() {
    const { existing, missing } = checkScreenshotsExist();
    
    const indexContent = `# Screenshot Index for User Guide

## Available Screenshots (${existing.length}/${Object.keys(screenshotMapping).length})

${existing.map(filename => {
    const info = Object.values(screenshotMapping).find(s => s.filename === filename);
    return `✅ **${filename}** - ${info ? info.description : 'Description not found'}`;
}).join('\n')}

## Missing Screenshots (${missing.length})

${missing.map(filename => {
    const info = Object.values(screenshotMapping).find(s => s.filename === filename);
    return `❌ **${filename}** - ${info ? info.description : 'Description not found'}`;
}).join('\n')}

## Next Steps

${missing.length > 0 ? `
### To Complete the User Guide:
1. Capture the missing screenshots following instructions in INSTRUCTIONS.md
2. Run 'node scripts/update-userguide.js' again to integrate new images
3. Review the updated user guides
` : `
### User Guide is Complete! ✨
All screenshots have been captured and integrated into the user guides.

**Available Guides:**
- \`docs/interactive-userguide.html\` - Interactive HTML version with embedded screenshots
- \`docs/Visual_User_Guide.pdf\` - PDF version with screenshot placeholders
- \`docs/Visual_User_Guide_With_Screenshots.pdf\` - Updated PDF with screenshot references
`}

## Integration Status

- **HTML User Guide:** ${existing.length > 0 ? 'Updated with available screenshots' : 'Waiting for screenshots'}
- **PDF User Guide:** ${existing.length > 0 ? 'References added for available screenshots' : 'Waiting for screenshots'}

Generated on: ${new Date().toISOString()}
`;

    const indexPath = path.join(screenshotsDir, 'INDEX.md');
    fs.writeFileSync(indexPath, indexContent);
    
    return { existing: existing.length, missing: missing.length, total: Object.keys(screenshotMapping).length };
}

// Main execution
function main() {
    console.log('🖼️  Updating user guide with screenshots...\n');
    
    // Check which screenshots exist
    const stats = generateScreenshotIndex();
    
    console.log(`📊 Screenshot Status: ${stats.existing}/${stats.total} available`);
    
    if (stats.existing > 0) {
        // Update HTML user guide
        const htmlUpdated = updateHtmlUserGuide();
        
        // Create updated PDF guide script
        updatePdfGuide();
        
        console.log(`\n✅ User guide update complete!`);
        console.log(`📁 Check docs/screenshots/INDEX.md for detailed status`);
        
        if (stats.missing > 0) {
            console.log(`\n⚠️  Still need ${stats.missing} screenshots to complete the guide`);
            console.log(`📋 See docs/screenshots/INSTRUCTIONS.md for capture instructions`);
        } else {
            console.log(`\n🎉 All screenshots captured! User guide is complete!`);
        }
    } else {
        console.log(`\n⚠️  No screenshots found. Please capture screenshots first:`);
        console.log(`📋 Follow instructions in docs/screenshots/INSTRUCTIONS.md`);
        console.log(`🌐 Application should be running at http://localhost:3008`);
    }
    
    console.log(`\n📖 Updated files:`);
    console.log(`   • docs/interactive-userguide.html`);
    console.log(`   • docs/screenshots/INDEX.md`);
    if (stats.existing > 0) {
        console.log(`   • scripts/create-visual-userguide-with-images.js`);
    }
}

if (require.main === module) {
    main();
}

module.exports = { updateHtmlUserGuide, checkScreenshotsExist, screenshotMapping };