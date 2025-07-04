// Create sample/placeholder screenshots for user guide
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'docs', 'screenshots');

// Create SVG-based sample screenshots that look realistic
const createSampleScreenshot = (filename, title, description, elements) => {
    const width = 1200;
    const height = 800;
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:0.9" />
        </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#headerGradient)"/>
    
    <!-- Header -->
    <rect x="0" y="0" width="100%" height="80" fill="rgba(44, 62, 80, 0.9)"/>
    <text x="30" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">Service Desk Analytics</text>
    
    <!-- Title -->
    <text x="50" y="130" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#2c3e50">${title}</text>
    <text x="50" y="155" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d">${description}</text>
    
    ${elements.join('\n    ')}
    
    <!-- Watermark -->
    <text x="${width - 200}" y="${height - 20}" font-family="Arial, sans-serif" font-size="12" fill="rgba(0,0,0,0.3)">[Sample Screenshot - Replace with Actual]</text>
</svg>`;

    const outputPath = path.join(screenshotsDir, filename);
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ Created sample screenshot: ${filename}`);
};

// Create all sample screenshots
const sampleScreenshots = [
    {
        filename: '01-welcome-screen.png',
        title: 'Welcome to Service Desk Analytics', 
        description: 'Upload your CSV file to start analyzing your service desk data',
        elements: [
            '<rect x="300" y="250" width="600" height="300" rx="10" fill="url(#cardGradient)" stroke="#e9ecef" stroke-width="2"/>',
            '<circle cx="600" cy="350" r="30" fill="#3498db"/>',
            '<text x="570" y="360" font-family="Arial, sans-serif" font-size="24" fill="white">📤</text>',
            '<text x="500" y="420" font-family="Arial, sans-serif" font-size="16" fill="#2c3e50" text-anchor="middle">Click to upload CSV file</text>',
            '<text x="500" y="440" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d" text-anchor="middle">or drag and drop your file here</text>',
            '<rect x="350" y="480" width="300" height="40" rx="5" fill="#3498db" opacity="0.8"/>',
            '<text x="500" y="505" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">Browse Files</text>'
        ]
    },
    {
        filename: '02-csv-upload.png',
        title: 'CSV File Upload Process',
        description: 'File selection and upload interface',
        elements: [
            '<rect x="300" y="250" width="600" height="300" rx="10" fill="url(#cardGradient)" stroke="#3498db" stroke-width="3" stroke-dasharray="10,5"/>',
            '<circle cx="600" cy="350" r="30" fill="#27ae60"/>',
            '<text x="570" y="360" font-family="Arial, sans-serif" font-size="24" fill="white">✓</text>',
            '<text x="500" y="420" font-family="Arial, sans-serif" font-size="16" fill="#27ae60" text-anchor="middle">File selected: tickets_data.csv</text>',
            '<rect x="350" y="450" width="300" height="20" rx="10" fill="#ecf0f1"/>',
            '<rect x="350" y="450" width="180" height="20" rx="10" fill="#3498db"/>',
            '<text x="500" y="490" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d" text-anchor="middle">Uploading... 60%</text>'
        ]
    },
    {
        filename: '03-dashboard-overview.png',
        title: 'Dashboard Overview',
        description: 'Complete dashboard with metrics, charts, and data sections',
        elements: [
            // Filter bar
            '<rect x="50" y="180" width="1100" height="60" fill="rgba(52, 152, 219, 0.8)" rx="5"/>',
            '<text x="70" y="205" font-family="Arial, sans-serif" font-size="12" fill="white">SDM: All</text>',
            '<text x="200" y="205" font-family="Arial, sans-serif" font-size="12" fill="white">Company: All</text>',
            '<text x="350" y="205" font-family="Arial, sans-serif" font-size="12" fill="white">Date: Last 6 Months</text>',
            '<text x="950" y="205" font-family="Arial, sans-serif" font-size="12" fill="white">PDF | Excel | AI</text>',
            
            // Metrics cards
            '<rect x="50" y="260" width="200" height="120" fill="url(#cardGradient)" rx="8" stroke="#e9ecef"/>',
            '<text x="70" y="285" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">Total Tickets</text>',
            '<text x="70" y="310" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#2c3e50">1,247</text>',
            
            '<rect x="270" y="260" width="200" height="120" fill="url(#cardGradient)" rx="8" stroke="#e9ecef"/>',
            '<text x="290" y="285" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">Open Tickets</text>',
            '<text x="290" y="310" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#e74c3c">89</text>',
            
            '<rect x="490" y="260" width="200" height="120" fill="url(#cardGradient)" rx="8" stroke="#e9ecef"/>',
            '<text x="510" y="285" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">Closed Tickets</text>',
            '<text x="510" y="310" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#27ae60">1,158</text>',
            
            '<rect x="710" y="260" width="200" height="120" fill="url(#cardGradient)" rx="8" stroke="#e9ecef"/>',
            '<text x="730" y="285" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">Avg Resolution</text>',
            '<text x="730" y="310" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#2c3e50">4.2h</text>',
            
            '<rect x="930" y="260" width="200" height="120" fill="url(#cardGradient)" rx="8" stroke="#3498db" stroke-width="2"/>',
            '<text x="950" y="285" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">SLA Compliance</text>',
            '<text x="950" y="310" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#3498db">94.2%</text>',
            '<text x="950" y="330" font-family="Arial, sans-serif" font-size="10" fill="#3498db">👆 Click for details</text>',
            
            // Charts section
            '<rect x="50" y="400" width="540" height="300" fill="url(#cardGradient)" rx="8" stroke="#e9ecef"/>',
            '<text x="70" y="430" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#2c3e50">Monthly Created vs Resolved</text>',
            '<polyline points="80,600 150,580 220,560 290,570 360,550 430,540 500,530" stroke="#3498db" stroke-width="3" fill="none"/>',
            '<polyline points="80,620 150,610 220,590 290,600 360,580 430,570 500,560" stroke="#27ae60" stroke-width="3" fill="none"/>',
            
            '<rect x="610" y="400" width="540" height="300" fill="url(#cardGradient)" rx="8" stroke="#e9ecef"/>',
            '<text x="630" y="430" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#2c3e50">Open Tickets by Type</text>',
            '<circle cx="880" cy="550" r="80" fill="#3498db" opacity="0.7"/>',
            '<circle cx="880" cy="550" r="60" fill="#e74c3c" opacity="0.7"/>',
            '<circle cx="880" cy="550" r="40" fill="#f39c12" opacity="0.7"/>',
            '<circle cx="880" cy="550" r="20" fill="#27ae60" opacity="0.7"/>'
        ]
    },
    {
        filename: '04-filter-bar.png',
        title: 'Filter Controls',
        description: 'SDM, Company, and Date filter dropdowns in the toolbar',
        elements: [
            '<rect x="50" y="250" width="1100" height="80" fill="rgba(52, 152, 219, 0.9)" rx="8"/>',
            '<text x="80" y="280" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Filters:</text>',
            
            '<rect x="150" y="260" width="180" height="40" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="160" y="285" font-family="Arial, sans-serif" font-size="12" fill="white">SDM: All SDMs ▼</text>',
            '<rect x="320" y="300" width="160" height="100" fill="white" rx="5" stroke="#ddd"/>',
            '<text x="330" y="320" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">All SDMs</text>',
            '<text x="330" y="340" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">John Smith</text>',
            '<text x="330" y="360" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Jane Doe</text>',
            '<text x="330" y="380" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Mike Johnson</text>',
            
            '<rect x="350" y="260" width="180" height="40" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="360" y="285" font-family="Arial, sans-serif" font-size="12" fill="white">Company: All Companies ▼</text>',
            
            '<rect x="550" y="260" width="180" height="40" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="560" y="285" font-family="Arial, sans-serif" font-size="12" fill="white">Date: Last 6 Months ▼</text>',
            
            '<rect x="750" y="260" width="100" height="40" fill="rgba(255,255,255,0.2)" rx="5"/>',
            '<text x="770" y="285" font-family="Arial, sans-serif" font-size="12" fill="white">Clear Filters</text>',
            
            '<rect x="900" y="260" width="60" height="40" fill="rgba(231, 76, 60, 0.8)" rx="5"/>',
            '<text x="920" y="285" font-family="Arial, sans-serif" font-size="12" fill="white" font-weight="bold">PDF</text>',
            
            '<rect x="970" y="260" width="60" height="40" fill="rgba(255,255,255,0.2)" rx="5"/>',
            '<text x="985" y="285" font-family="Arial, sans-serif" font-size="12" fill="white">Excel</text>',
            
            '<rect x="1040" y="260" width="50" height="40" fill="rgba(255,255,255,0.2)" rx="5"/>',
            '<text x="1055" y="285" font-family="Arial, sans-serif" font-size="12" fill="white">AI</text>'
        ]
    },
    {
        filename: '05-metrics-cards.png',
        title: 'Key Performance Metrics',
        description: 'Dashboard metric cards showing ticket statistics',
        elements: [
            // Five metric cards in a row
            '<rect x="50" y="250" width="200" height="140" fill="url(#cardGradient)" rx="10" stroke="#e9ecef" stroke-width="2"/>',
            '<circle cx="80" cy="280" r="12" fill="#3498db"/>',
            '<text x="110" y="290" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d">Total Tickets</text>',
            '<text x="110" y="320" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#2c3e50">1,247</text>',
            '<text x="110" y="350" font-family="Arial, sans-serif" font-size="12" fill="#27ae60">+12% from last month</text>',
            
            '<rect x="270" y="250" width="200" height="140" fill="url(#cardGradient)" rx="10" stroke="#e9ecef" stroke-width="2"/>',
            '<circle cx="300" cy="280" r="12" fill="#e74c3c"/>',
            '<text x="330" y="290" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d">Open Tickets</text>',
            '<text x="330" y="320" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#2c3e50">89</text>',
            '<text x="330" y="350" font-family="Arial, sans-serif" font-size="12" fill="#e74c3c">+3 since yesterday</text>',
            
            '<rect x="490" y="250" width="200" height="140" fill="url(#cardGradient)" rx="10" stroke="#e9ecef" stroke-width="2"/>',
            '<circle cx="520" cy="280" r="12" fill="#27ae60"/>',
            '<text x="550" y="290" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d">Closed Tickets</text>',
            '<text x="550" y="320" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#2c3e50">1,158</text>',
            '<text x="550" y="350" font-family="Arial, sans-serif" font-size="12" fill="#27ae60">93% resolution rate</text>',
            
            '<rect x="710" y="250" width="200" height="140" fill="url(#cardGradient)" rx="10" stroke="#e9ecef" stroke-width="2"/>',
            '<circle cx="740" cy="280" r="12" fill="#f39c12"/>',
            '<text x="770" y="290" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d">Avg Resolution</text>',
            '<text x="770" y="320" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#2c3e50">4.2h</text>',
            '<text x="770" y="350" font-family="Arial, sans-serif" font-size="12" fill="#27ae60">-0.8h improvement</text>',
            
            '<rect x="930" y="250" width="200" height="140" fill="url(#cardGradient)" rx="10" stroke="#3498db" stroke-width="3"/>',
            '<circle cx="960" cy="280" r="12" fill="#3498db"/>',
            '<text x="990" y="290" font-family="Arial, sans-serif" font-size="14" fill="#7f8c8d">SLA Compliance</text>',
            '<text x="990" y="320" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#3498db">94.2%</text>',
            '<text x="990" y="350" font-family="Arial, sans-serif" font-size="12" fill="#3498db">👆 Click for details</text>',
            '<rect x="935" y="255" width="190" height="130" fill="none" stroke="#3498db" stroke-width="2" stroke-dasharray="5,5" rx="8"/>',
            
            // Arrow pointing to SLA card
            '<path d="M 850 200 L 880 200 L 870 190 M 880 200 L 870 210" stroke="#e74c3c" stroke-width="3" fill="none"/>',
            '<text x="780" y="195" font-family="Arial, sans-serif" font-size="14" fill="#e74c3c" font-weight="bold">Click here!</text>'
        ]
    },
    {
        filename: '06-sla-card-highlight.png',
        title: 'SLA Compliance Card - Clickable',
        description: 'SLA metric card highlighted to show it can be clicked for details',
        elements: [
            '<rect x="400" y="250" width="250" height="180" fill="url(#cardGradient)" rx="12" stroke="#3498db" stroke-width="4"/>',
            '<circle cx="430" cy="290" r="15" fill="#3498db"/>',
            '<text x="460" y="305" font-family="Arial, sans-serif" font-size="16" fill="#7f8c8d">SLA Compliance</text>',
            '<text x="460" y="340" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#3498db">94.2%</text>',
            '<text x="460" y="365" font-family="Arial, sans-serif" font-size="12" fill="#27ae60">+2.1% this month</text>',
            '<text x="460" y="385" font-family="Arial, sans-serif" font-size="14" fill="#3498db" font-weight="bold">👆 Click for details</text>',
            
            // Glow effect
            '<rect x="395" y="245" width="260" height="190" fill="none" stroke="#3498db" stroke-width="2" stroke-dasharray="8,4" rx="15" opacity="0.6"/>',
            '<rect x="390" y="240" width="270" height="200" fill="none" stroke="#3498db" stroke-width="1" stroke-dasharray="12,6" rx="18" opacity="0.3"/>',
            
            // Mouse cursor
            '<polygon points="500,200 520,220 510,220 515,235 505,235 485,215" fill="#2c3e50"/>',
            
            // Tooltip
            '<rect x="520" y="190" width="180" height="40" fill="#2c3e50" rx="5"/>',
            '<polygon points="520,210 510,210 515,220" fill="#2c3e50"/>',
            '<text x="530" y="205" font-family="Arial, sans-serif" font-size="12" fill="white">Click to open SLA details</text>',
            '<text x="530" y="220" font-family="Arial, sans-serif" font-size="12" fill="white">and manage overrides</text>'
        ]
    },
    {
        filename: '07-sla-modal.png',
        title: 'SLA Compliance Management Modal',
        description: 'Modal window showing SLA breach details with toggle switches',
        elements: [
            // Modal backdrop
            '<rect x="0" y="0" width="1200" height="800" fill="rgba(0,0,0,0.5)"/>',
            
            // Modal window
            '<rect x="200" y="150" width="800" height="500" fill="white" rx="10" stroke="#ddd" stroke-width="2"/>',
            
            // Modal header
            '<rect x="200" y="150" width="800" height="60" fill="#3498db" rx="10"/>',
            '<rect x="200" y="190" width="800" height="20" fill="#3498db"/>',
            '<text x="230" y="185" font-family="Arial, sans-serif" font-size="20" fill="white" font-weight="bold">SLA Compliance Details</text>',
            '<text x="950" y="185" font-family="Arial, sans-serif" font-size="24" fill="white">✕</text>',
            
            // Search bar
            '<rect x="230" y="230" width="300" height="35" fill="#f8f9fa" rx="5" stroke="#ddd"/>',
            '<text x="240" y="252" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">🔍 Search tickets...</text>',
            
            // Export button
            '<rect x="800" y="230" width="120" height="35" fill="#27ae60" rx="5"/>',
            '<text x="830" y="252" font-family="Arial, sans-serif" font-size="12" fill="white">Export to Excel</text>',
            
            // Table header
            '<rect x="230" y="280" width="740" height="30" fill="#f8f9fa"/>',
            '<text x="240" y="300" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">Ticket ID</text>',
            '<text x="350" y="300" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">Subject</text>',
            '<text x="600" y="300" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">Company</text>',
            '<text x="800" y="300" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">SLA Status</text>',
            '<text x="900" y="300" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">Override</text>',
            
            // Table rows with toggles
            '<rect x="230" y="310" width="740" height="40" fill="white" stroke="#eee"/>',
            '<text x="240" y="335" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">TKT-001</text>',
            '<text x="350" y="335" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Email not working</text>',
            '<text x="600" y="335" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Acme Corp</text>',
            '<rect x="800" y="320" width="60" height="20" fill="#e74c3c" rx="10"/>',
            '<text x="815" y="334" font-family="Arial, sans-serif" font-size="10" fill="white">BREACH</text>',
            '<rect x="910" y="322" width="30" height="16" fill="#e74c3c" rx="8"/>',
            '<circle cx="932" cy="330" r="6" fill="white"/>',
            
            '<rect x="230" y="350" width="740" height="40" fill="#f8f9fa" stroke="#eee"/>',
            '<text x="240" y="375" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">TKT-002</text>',
            '<text x="350" y="375" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">System slow performance</text>',
            '<text x="600" y="375" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Tech Inc</text>',
            '<rect x="800" y="360" width="60" height="20" fill="#27ae60" rx="10"/>',
            '<text x="815" y="374" font-family="Arial, sans-serif" font-size="10" fill="white">OK</text>',
            '<rect x="910" y="362" width="30" height="16" fill="#27ae60" rx="8"/>',
            '<circle cx="918" cy="370" r="6" fill="white"/>',
            
            '<rect x="230" y="390" width="740" height="40" fill="white" stroke="#eee"/>',
            '<text x="240" y="415" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">TKT-003</text>',
            '<text x="350" y="415" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Password reset needed</text>',
            '<text x="600" y="415" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Global Ltd</text>',
            '<rect x="800" y="400" width="60" height="20" fill="#e74c3c" rx="10"/>',
            '<text x="815" y="414" font-family="Arial, sans-serif" font-size="10" fill="white">BREACH</text>',
            '<rect x="910" y="402" width="30" height="16" fill="#e74c3c" rx="8"/>',
            '<circle cx="932" cy="410" r="6" fill="white"/>',
            
            // Instructions
            '<text x="230" y="470" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">• Green toggle = SLA compliant</text>',
            '<text x="230" y="490" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">• Red toggle = SLA breach</text>',
            '<text x="230" y="510" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">• Click toggles to override system calculation</text>',
            
            // Arrow pointing to toggle
            '<path d="M 880 350 L 900 350 L 890 340 M 900 350 L 890 360" stroke="#e74c3c" stroke-width="2" fill="none"/>',
            '<text x="820" y="345" font-family="Arial, sans-serif" font-size="12" fill="#e74c3c" font-weight="bold">Click to toggle</text>'
        ]
    },
    {
        filename: '08-charts-section.png',
        title: 'Analytics Charts',
        description: 'Monthly trends and ticket type distribution charts',
        elements: [
            // Left chart - Monthly trends
            '<rect x="50" y="200" width="550" height="350" fill="url(#cardGradient)" rx="10" stroke="#e9ecef" stroke-width="2"/>',
            '<text x="70" y="230" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#2c3e50">Monthly Created vs Resolved Tickets</text>',
            
            // Chart axes
            '<line x1="100" y1="500" x2="550" y2="500" stroke="#ddd" stroke-width="1"/>',
            '<line x1="100" y1="270" x2="100" y2="500" stroke="#ddd" stroke-width="1"/>',
            
            // Month labels
            '<text x="130" y="520" font-family="Arial, sans-serif" font-size="10" fill="#7f8c8d">Jan</text>',
            '<text x="200" y="520" font-family="Arial, sans-serif" font-size="10" fill="#7f8c8d">Feb</text>',
            '<text x="270" y="520" font-family="Arial, sans-serif" font-size="10" fill="#7f8c8d">Mar</text>',
            '<text x="340" y="520" font-family="Arial, sans-serif" font-size="10" fill="#7f8c8d">Apr</text>',
            '<text x="410" y="520" font-family="Arial, sans-serif" font-size="10" fill="#7f8c8d">May</text>',
            '<text x="480" y="520" font-family="Arial, sans-serif" font-size="10" fill="#7f8c8d">Jun</text>',
            '<text x="550" y="520" font-family="Arial, sans-serif" font-size="10" fill="#7f8c8d">Jul</text>',
            
            // Created line (blue)
            '<polyline points="130,450 200,420 270,380 340,390 410,360 480,340 550,320" stroke="#3498db" stroke-width="4" fill="none"/>',
            '<circle cx="130" cy="450" r="4" fill="#3498db"/>',
            '<circle cx="200" cy="420" r="4" fill="#3498db"/>',
            '<circle cx="270" cy="380" r="4" fill="#3498db"/>',
            '<circle cx="340" cy="390" r="4" fill="#3498db"/>',
            '<circle cx="410" cy="360" r="4" fill="#3498db"/>',
            '<circle cx="480" cy="340" r="4" fill="#3498db"/>',
            '<circle cx="550" cy="320" r="4" fill="#3498db"/>',
            
            // Resolved line (green)
            '<polyline points="130,470 200,440 270,410 340,420 410,390 480,370 550,350" stroke="#27ae60" stroke-width="4" fill="none"/>',
            '<circle cx="130" cy="470" r="4" fill="#27ae60"/>',
            '<circle cx="200" cy="440" r="4" fill="#27ae60"/>',
            '<circle cx="270" cy="410" r="4" fill="#27ae60"/>',
            '<circle cx="340" cy="420" r="4" fill="#27ae60"/>',
            '<circle cx="410" cy="390" r="4" fill="#27ae60"/>',
            '<circle cx="480" cy="370" r="4" fill="#27ae60"/>',
            '<circle cx="550" cy="350" r="4" fill="#27ae60"/>',
            
            // Legend
            '<rect x="450" y="250" width="120" height="50" fill="rgba(255,255,255,0.9)" stroke="#ddd" rx="5"/>',
            '<line x1="460" y1="265" x2="480" y2="265" stroke="#3498db" stroke-width="3"/>',
            '<text x="485" y="270" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Created</text>',
            '<line x1="460" y1="285" x2="480" y2="285" stroke="#27ae60" stroke-width="3"/>',
            '<text x="485" y="290" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Resolved</text>',
            
            // Right chart - Pie chart
            '<rect x="620" y="200" width="530" height="350" fill="url(#cardGradient)" rx="10" stroke="#e9ecef" stroke-width="2"/>',
            '<text x="640" y="230" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#2c3e50">Open Tickets by Type</text>',
            
            // Pie chart segments
            '<circle cx="885" cy="375" r="80" fill="#3498db" opacity="0.8"/>',
            '<path d="M 885 375 L 885 295 A 80 80 0 0 1 945 335 Z" fill="#e74c3c" opacity="0.8"/>',
            '<path d="M 885 375 L 945 335 A 80 80 0 0 1 925 445 Z" fill="#f39c12" opacity="0.8"/>',
            '<path d="M 885 375 L 925 445 A 80 80 0 0 1 825 415 Z" fill="#27ae60" opacity="0.8"/>',
            '<path d="M 885 375 L 825 415 A 80 80 0 0 1 885 295 Z" fill="#9b59b6" opacity="0.8"/>',
            
            // Pie chart legend
            '<rect x="1000" y="300" width="130" height="150" fill="rgba(255,255,255,0.9)" stroke="#ddd" rx="5"/>',
            '<rect x="1010" y="315" width="15" height="15" fill="#3498db"/>',
            '<text x="1030" y="327" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Incident (45%)</text>',
            '<rect x="1010" y="335" width="15" height="15" fill="#e74c3c"/>',
            '<text x="1030" y="347" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Request (25%)</text>',
            '<rect x="1010" y="355" width="15" height="15" fill="#f39c12"/>',
            '<text x="1030" y="367" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Change (15%)</text>',
            '<rect x="1010" y="375" width="15" height="15" fill="#27ae60"/>',
            '<text x="1030" y="387" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Problem (10%)</text>',
            '<rect x="1010" y="395" width="15" height="15" fill="#9b59b6"/>',
            '<text x="1030" y="407" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Other (5%)</text>'
        ]
    },
    {
        filename: '09-escalated-tickets.png',
        title: 'Escalated Tickets Section',
        description: 'Priority-coded escalated tickets with user impact information',
        elements: [
            '<rect x="50" y="200" width="1100" height="350" fill="url(#cardGradient)" rx="10" stroke="#e9ecef" stroke-width="2"/>',
            '<text x="70" y="235" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#2c3e50">🔺 Escalated Tickets</text>',
            '<rect x="950" y="210" width="120" height="25" fill="#e74c3c" rx="12"/>',
            '<text x="980" y="227" font-family="Arial, sans-serif" font-size="12" fill="white">5 Escalated</text>',
            
            // Escalated ticket items
            '<rect x="70" y="260" width="1060" height="80" fill="#ffeaa7" rx="8" stroke="#fdcb6e" stroke-width="2"/>',
            '<rect x="70" y="260" width="8" height="80" fill="#e17055" rx="4"/>',
            '<circle cx="100" cy="290" r="8" fill="#e17055"/>',
            '<text x="130" y="285" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2c3e50">Email server completely down</text>',
            '<text x="130" y="305" font-family="Arial, sans-serif" font-size="12" fill="#636e72">TKT-001 • Global Corp • Created: 2 hours ago</text>',
            '<rect x="900" y="275" width="60" height="20" fill="#e17055" rx="10"/>',
            '<text x="915" y="289" font-family="Arial, sans-serif" font-size="10" fill="white">URGENT</text>',
            '<text x="980" y="289" font-family="Arial, sans-serif" font-size="12" fill="#636e72">500+ users affected</text>',
            
            '<rect x="70" y="350" width="1060" height="80" fill="#fab1a0" rx="8" stroke="#e17055" stroke-width="2"/>',
            '<rect x="70" y="350" width="8" height="80" fill="#e17055" rx="4"/>',
            '<circle cx="100" cy="380" r="8" fill="#e17055"/>',
            '<text x="130" y="375" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2c3e50">Database performance critical</text>',
            '<text x="130" y="395" font-family="Arial, sans-serif" font-size="12" fill="#636e72">TKT-002 • Tech Solutions • Created: 4 hours ago</text>',
            '<rect x="900" y="365" width="50" height="20" fill="#fd79a8" rx="10"/>',
            '<text x="915" y="379" font-family="Arial, sans-serif" font-size="10" fill="white">HIGH</text>',
            '<text x="980" y="379" font-family="Arial, sans-serif" font-size="12" fill="#636e72">200+ users affected</text>',
            
            '<rect x="70" y="440" width="1060" height="80" fill="#ffeaa7" rx="8" stroke="#fdcb6e" stroke-width="2"/>',
            '<rect x="70" y="440" width="8" height="80" fill="#e17055" rx="4"/>',
            '<circle cx="100" cy="470" r="8" fill="#e17055"/>',
            '<text x="130" y="465" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2c3e50">Network connectivity issues</text>',
            '<text x="130" y="485" font-family="Arial, sans-serif" font-size="12" fill="#636e72">TKT-003 • Manufacturing Inc • Created: 6 hours ago</text>',
            '<rect x="900" y="455" width="60" height="20" fill="#e17055" rx="10"/>',
            '<text x="915" y="469" font-family="Arial, sans-serif" font-size="10" fill="white">URGENT</text>',
            '<text x="980" y="469" font-family="Arial, sans-serif" font-size="12" fill="#636e72">150+ users affected</text>'
        ]
    },
    {
        filename: '10-export-buttons.png',
        title: 'Export and Action Buttons',
        description: 'PDF, Excel, and AI export buttons in the toolbar',
        elements: [
            '<rect x="300" y="250" width="600" height="100" fill="rgba(52, 152, 219, 0.9)" rx="10"/>',
            '<text x="320" y="285" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Export & Actions:</text>',
            
            // CSV Upload button
            '<rect x="500" y="265" width="80" height="35" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="525" y="287" font-family="Arial, sans-serif" font-size="12" fill="white">📤 CSV</text>',
            
            // PDF button (highlighted)
            '<rect x="590" y="265" width="80" height="35" fill="#e74c3c" rx="5" stroke="#c0392b" stroke-width="2"/>',
            '<text x="615" y="287" font-family="Arial, sans-serif" font-size="12" fill="white" font-weight="bold">📄 PDF</text>',
            '<rect x="585" y="260" width="90" height="45" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,5" rx="8"/>',
            
            // Excel button
            '<rect x="680" y="265" width="80" height="35" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="700" y="287" font-family="Arial, sans-serif" font-size="12" fill="white">📊 Excel</text>',
            
            // AI button
            '<rect x="770" y="265" width="80" height="35" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="795" y="287" font-family="Arial, sans-serif" font-size="12" fill="white">🧠 AI</text>',
            
            // Arrow pointing to PDF
            '<path d="M 550 220 L 620 240 L 610 230 M 620 240 L 610 250" stroke="#e74c3c" stroke-width="3" fill="none"/>',
            '<text x="450" y="215" font-family="Arial, sans-serif" font-size="14" fill="#e74c3c" font-weight="bold">Click to generate PDF report</text>',
            
            // Tooltip
            '<rect x="520" y="320" width="200" height="50" fill="#2c3e50" rx="5"/>',
            '<polygon points="620,320 610,320 615,310" fill="#2c3e50"/>',
            '<text x="530" y="340" font-family="Arial, sans-serif" font-size="12" fill="white">Generate professional</text>',
            '<text x="530" y="355" font-family="Arial, sans-serif" font-size="12" fill="white">PDF report for clients</text>'
        ]
    },
    {
        filename: '11-ai-modal.png',
        title: 'AI Insights Modal',
        description: 'AI-powered analytics and recommendations window',
        elements: [
            // Modal backdrop
            '<rect x="0" y="0" width="1200" height="800" fill="rgba(0,0,0,0.5)"/>',
            
            // Modal window
            '<rect x="150" y="100" width="900" height="600" fill="white" rx="12" stroke="#ddd" stroke-width="2"/>',
            
            // Modal header
            '<rect x="150" y="100" width="900" height="70" fill="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" rx="12"/>',
            '<rect x="150" y="150" width="900" height="20" fill="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"/>',
            '<text x="180" y="145" font-family="Arial, sans-serif" font-size="24" fill="white" font-weight="bold">🧠 AI Insights & Recommendations</text>',
            '<text x="1000" y="145" font-family="Arial, sans-serif" font-size="24" fill="white">✕</text>',
            
            // Loading/Analysis section
            '<rect x="180" y="190" width="840" height="60" fill="#f8f9fa" rx="8"/>',
            '<text x="200" y="215" font-family="Arial, sans-serif" font-size="14" fill="#27ae60" font-weight="bold">✓ Analysis Complete</text>',
            '<text x="200" y="235" font-family="Arial, sans-serif" font-size="12" fill="#7f8c8d">Analyzed 1,247 tickets across 7 months • Processing time: 2.3 seconds</text>',
            
            // Key insights section
            '<text x="180" y="280" font-family="Arial, sans-serif" font-size="18" fill="#2c3e50" font-weight="bold">🎯 Key Insights</text>',
            
            '<rect x="180" y="290" width="400" height="100" fill="#e8f5e8" rx="8" stroke="#27ae60"/>',
            '<text x="200" y="315" font-family="Arial, sans-serif" font-size="14" fill="#27ae60" font-weight="bold">Positive Trend</text>',
            '<text x="200" y="335" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50">• Resolution time improved by 18% this month</text>',
            '<text x="200" y="350" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50">• SLA compliance increased to 94.2%</text>',
            '<text x="200" y="365" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50">• Escalation rate decreased by 12%</text>',
            
            '<rect x="600" y="290" width="420" height="100" fill="#fff3cd" rx="8" stroke="#f39c12"/>',
            '<text x="620" y="315" font-family="Arial, sans-serif" font-size="14" fill="#f39c12" font-weight="bold">Areas for Improvement</text>',
            '<text x="620" y="335" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50">• Email-related tickets take 40% longer to resolve</text>',
            '<text x="620" y="350" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50">• Friday tickets have higher escalation rate</text>',
            '<text x="620" y="365" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50">• Network issues peak between 2-4 PM</text>',
            
            // Recommendations section
            '<text x="180" y="420" font-family="Arial, sans-serif" font-size="18" fill="#2c3e50" font-weight="bold">💡 AI Recommendations</text>',
            
            '<rect x="180" y="430" width="840" height="40" fill="#e3f2fd" rx="8" stroke="#2196f3"/>',
            '<circle cx="210" cy="450" r="8" fill="#2196f3"/>',
            '<text x="215" y="455" font-family="Arial, sans-serif" font-size="10" fill="white">1</text>',
            '<text x="230" y="440" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">Implement Email Automation</text>',
            '<text x="230" y="455" font-family="Arial, sans-serif" font-size="11" fill="#7f8c8d">Deploy automated responses for common email issues to reduce resolution time by estimated 25%</text>',
            
            '<rect x="180" y="480" width="840" height="40" fill="#e3f2fd" rx="8" stroke="#2196f3"/>',
            '<circle cx="210" cy="500" r="8" fill="#2196f3"/>',
            '<text x="215" y="505" font-family="Arial, sans-serif" font-size="10" fill="white">2</text>',
            '<text x="230" y="490" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">Proactive Network Monitoring</text>',
            '<text x="230" y="505" font-family="Arial, sans-serif" font-size="11" fill="#7f8c8d">Schedule preventive network maintenance during 2-4 PM window to reduce incident volume</text>',
            
            '<rect x="180" y="530" width="840" height="40" fill="#e3f2fd" rx="8" stroke="#2196f3"/>',
            '<circle cx="210" cy="550" r="8" fill="#2196f3"/>',
            '<text x="215" y="555" font-family="Arial, sans-serif" font-size="10" fill="white">3</text>',
            '<text x="230" y="540" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50" font-weight="bold">Friday Staffing Adjustment</text>',
            '<text x="230" y="555" font-family="Arial, sans-serif" font-size="11" fill="#7f8c8d">Increase support staffing on Fridays by 20% to handle higher escalation volumes</text>',
            
            // Confidence indicator
            '<rect x="180" y="590" width="840" height="80" fill="#f8f9fa" rx="8"/>',
            '<text x="200" y="615" font-family="Arial, sans-serif" font-size="14" fill="#2c3e50" font-weight="bold">Analysis Confidence: 92%</text>',
            '<rect x="200" y="625" width="300" height="10" fill="#ecf0f1" rx="5"/>',
            '<rect x="200" y="625" width="276" height="10" fill="#27ae60" rx="5"/>',
            '<text x="200" y="650" font-family="Arial, sans-serif" font-size="11" fill="#7f8c8d">Based on historical patterns, seasonal trends, and statistical analysis</text>',
            '<text x="200" y="665" font-family="Arial, sans-serif" font-size="11" fill="#7f8c8d">Next analysis will include 30 days additional data for improved accuracy</text>',
            
            // Regenerate button
            '<rect x="750" y="620" width="120" height="35" fill="#3498db" rx="5"/>',
            '<text x="785" y="642" font-family="Arial, sans-serif" font-size="12" fill="white">🔄 Regenerate</text>'
        ]
    },
    {
        filename: '12-filter-dropdowns.png',
        title: 'Filter Dropdown Options',
        description: 'Dropdown menus showing available filter options',
        elements: [
            '<rect x="50" y="200" width="1100" height="80" fill="rgba(52, 152, 219, 0.9)" rx="8"/>',
            '<text x="80" y="235" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">Filters:</text>',
            
            // SDM dropdown (open)
            '<rect x="150" y="215" width="180" height="40" fill="rgba(255,255,255,0.9)" rx="5" stroke="#3498db" stroke-width="2"/>',
            '<text x="160" y="240" font-family="Arial, sans-serif" font-size="12" fill="#2c3e50">SDM: John Smith ▼</text>',
            '<rect x="150" y="255" width="180" height="120" fill="white" rx="5" stroke="#ddd" stroke-width="2"/>',
            '<rect x="150" y="255" width="180" height="25" fill="#3498db"/>',
            '<text x="160" y="272" font-family="Arial, sans-serif" font-size="11" fill="white" font-weight="bold">John Smith</text>',
            '<text x="160" y="295" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">All SDMs</text>',
            '<text x="160" y="315" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Jane Doe</text>',
            '<text x="160" y="335" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Mike Johnson</text>',
            '<text x="160" y="355" font-family="Arial, sans-serif" font-size="11" fill="#2c3e50">Sarah Wilson</text>',
            
            // Company dropdown (closed)
            '<rect x="350" y="215" width="180" height="40" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="360" y="240" font-family="Arial, sans-serif" font-size="12" fill="white">Company: All Companies ▼</text>',
            
            // Date dropdown (closed)
            '<rect x="550" y="215" width="180" height="40" fill="rgba(255,255,255,0.2)" rx="5" stroke="rgba(255,255,255,0.3)"/>',
            '<text x="560" y="240" font-family="Arial, sans-serif" font-size="12" fill="white">Date: Last 6 Months ▼</text>',
            
            // Clear button
            '<rect x="750" y="215" width="100" height="40" fill="rgba(255,255,255,0.2)" rx="5"/>',
            '<text x="775" y="240" font-family="Arial, sans-serif" font-size="12" fill="white">Clear Filters</text>',
            
            // Export buttons
            '<rect x="900" y="215" width="60" height="40" fill="rgba(231, 76, 60, 0.8)" rx="5"/>',
            '<text x="920" y="240" font-family="Arial, sans-serif" font-size="12" fill="white">PDF</text>',
            
            '<rect x="970" y="215" width="60" height="40" fill="rgba(255,255,255,0.2)" rx="5"/>',
            '<text x="985" y="240" font-family="Arial, sans-serif" font-size="12" fill="white">Excel</text>',
            
            '<rect x="1040" y="215" width="50" height="40" fill="rgba(255,255,255,0.2)" rx="5"/>',
            '<text x="1055" y="240" font-family="Arial, sans-serif" font-size="12" fill="white">AI</text>',
            
            // Arrow pointing to dropdown
            '<path d="M 100 300 L 140 280 L 130 270 M 140 280 L 130 290" stroke="#e74c3c" stroke-width="3" fill="none"/>',
            '<text x="30" y="295" font-family="Arial, sans-serif" font-size="12" fill="#e74c3c" font-weight="bold">Click to select</text>',
            '<text x="30" y="310" font-family="Arial, sans-serif" font-size="12" fill="#e74c3c" font-weight="bold">different SDM</text>'
        ]
    }
];

// Create all sample screenshots
console.log('🎨 Creating sample screenshots for user guide...\n');

sampleScreenshots.forEach(screenshot => {
    createSampleScreenshot(screenshot.filename, screenshot.title, screenshot.description, screenshot.elements);
});

console.log(`\n✅ Created ${sampleScreenshots.length} sample screenshots`);
console.log('📁 Screenshots saved to: docs/screenshots/');
console.log('\n💡 These are placeholder SVG images that show what each screenshot should contain.');
console.log('🔄 Replace them with actual PNG screenshots from the running application for best results.');
console.log('\n🌐 Application running at: http://localhost:3008');
console.log('📋 Follow docs/screenshots/INSTRUCTIONS.md to capture real screenshots');

module.exports = { sampleScreenshots };