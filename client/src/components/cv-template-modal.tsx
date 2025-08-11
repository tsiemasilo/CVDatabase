import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { CVRecord } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Phone, Mail, User, Award, Briefcase, GraduationCap, Globe, Download, Printer } from "lucide-react";
import alteramLogoPath from "@assets/alteram1_1_600x197_1750838676214.png";
import footerImagePath from "@assets/image_1751895895280.png";

interface CVTemplateModalProps {
  record: CVRecord | null;
  onClose: () => void;
}

export default function CVTemplateModal({ record, onClose }: CVTemplateModalProps) {
  if (!record) return null;

  // Parse work experiences from the record with error handling
  const workExperiences = (() => {
    if (!record.workExperiences) return [];
    try {
      console.log("Raw workExperiences data:", record.workExperiences);
      
      // Handle PostgreSQL array format if it's a string that looks like {"item1","item2"}
      if (typeof record.workExperiences === 'string' && record.workExperiences.startsWith('{') && record.workExperiences.endsWith('}')) {
        const arrayContent = record.workExperiences.slice(1, -1); // Remove { and }
        
        // Split by comma, but only at the top level (not inside quoted strings)
        const items = [];
        let current = '';
        let inQuotes = false;
        let escapeNext = false;
        
        for (let i = 0; i < arrayContent.length; i++) {
          const char = arrayContent[i];
          
          if (escapeNext) {
            current += char;
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            current += char;
            escapeNext = true;
            continue;
          }
          
          if (char === '"') {
            inQuotes = !inQuotes;
            current += char;
            continue;
          }
          
          if (char === ',' && !inQuotes) {
            // End of an item
            if (current.trim()) {
              try {
                // Remove surrounding quotes and unescape
                let cleanItem = current.trim();
                if (cleanItem.startsWith('"') && cleanItem.endsWith('"')) {
                  cleanItem = cleanItem.slice(1, -1);
                }
                // Unescape the JSON string
                cleanItem = cleanItem.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                const parsed = JSON.parse(cleanItem);
                items.push(parsed);
              } catch (e) {
                console.warn("Failed to parse item:", current);
              }
            }
            current = '';
            continue;
          }
          
          current += char;
        }
        
        // Handle the last item
        if (current.trim()) {
          try {
            let cleanItem = current.trim();
            if (cleanItem.startsWith('"') && cleanItem.endsWith('"')) {
              cleanItem = cleanItem.slice(1, -1);
            }
            cleanItem = cleanItem.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const parsed = JSON.parse(cleanItem);
            items.push(parsed);
          } catch (e) {
            console.warn("Failed to parse final item:", current);
          }
        }
        
        console.log("Parsed PostgreSQL array items:", items);
        return items;
      }
      
      // Regular JSON parse
      return JSON.parse(record.workExperiences);
    } catch (error) {
      console.error("Error parsing work experiences:", error, record.workExperiences);
      return [];
    }
  })();
  
  // Note: Using empty array since otherQualifications field doesn't exist in schema
  // Only using the main qualifications field from the schema
  const otherQualifications: any[] = [];
  
  const languages = record.languages ? record.languages.split(', ') : [];

  // Calculate total experience
  const totalExperience = workExperiences.reduce((total: number, exp: any) => {
    if (exp.startDate) {
      const startYear = new Date(exp.startDate).getFullYear();
      const endYear = exp.isCurrentRole ? new Date().getFullYear() : (exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear());
      return total + (endYear - startYear);
    }
    return total;
  }, 0);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-content');
    if (!element) {
      console.error('CV content element not found');
      return;
    }

    try {
      // Load html2pdf script if not already loaded
      if (!(window as any).html2pdf) {
        await loadHtml2PdfScript();
      }
      
      if ((window as any).html2pdf) {
        await generatePDF(element);
      } else {
        console.error('Failed to load html2pdf library');
        // Fallback to browser print dialog
        handlePrint();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to browser print dialog
      handlePrint();
    }
  };

  const handleDownloadWord = () => {
    try {
      // Create Word document content
      const wordContent = generateWordContent();
      
      // Create and download the Word file
      const blob = new Blob([wordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${record.name}_${record.surname || ''}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Word document generated successfully');
    } catch (error) {
      console.error('Error generating Word document:', error);
    }
  };

  const generateWordContent = (): string => {
    // Parse skills for Word document
    const skillsText = record.skills ? record.skills.trim() : '';
    const skillsList = skillsText
      .split(/[,\n\r•\-\*]+/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .filter(skill => !skill.match(/^[•\-\*\s]+$/));

    // Parse work experiences
    const workExps = record.workExperience ? JSON.parse(record.workExperience) : [];
    const certifications = record.certificateTypes ? JSON.parse(record.certificateTypes) : [];

    // Create HTML content for Word document matching the CV template
    return `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="utf-8">
  <title>CV - ${record.name} ${record.surname || ''}</title>
  <style>
    @page { margin: 0.4in; size: A4; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; font-size: 13px; line-height: 1.3; }
    
    /* Header styling to match CV template */
    .cv-header {
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      color: white;
      padding: 16px 32px;
      margin-bottom: 0;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .company-info {
      text-align: right;
      font-size: 12px;
    }
    .company-info p { margin: 2px 0; }
    .company-reg {
      border-top: 1px solid rgba(255,255,255,0.3);
      padding-top: 8px;
      margin-top: 8px;
      font-size: 11px;
    }
    
    /* Main content */
    .cv-content {
      padding: 32px;
      background: white;
    }
    
    /* Candidate info section */
    .candidate-header {
      text-align: center;
      padding: 24px 0;
      border-bottom: 4px solid #f97316;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #fff5f0 0%, #ffedd5 100%);
      border-radius: 8px;
    }
    .candidate-name {
      font-size: 32px;
      font-weight: bold;
      color: #000053;
      margin-bottom: 8px;
    }
    .candidate-contact {
      font-size: 14px;
      color: #4b5563;
      margin-bottom: 16px;
    }
    .candidate-summary {
      display: flex;
      justify-content: center;
      gap: 40px;
      font-size: 14px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-value {
      font-size: 18px;
      font-weight: bold;
      color: #f97316;
    }
    .summary-label {
      color: #6b7280;
      font-size: 12px;
    }
    
    /* Personal info table */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .info-table td {
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      vertical-align: top;
    }
    .info-label {
      font-weight: 600;
      background: #f9fafb;
      color: #374151;
      width: 140px;
    }
    .info-value {
      background: white;
      color: #1f2937;
    }
    
    /* Section styling */
    .section {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #000053;
      border-bottom: 3px solid #f97316;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    
    /* Work experience styling */
    .experience-item {
      margin-bottom: 24px;
      padding: 16px;
      border-left: 4px solid #f97316;
      background: #fafafa;
      border-radius: 0 8px 8px 0;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .job-title {
      font-size: 16px;
      font-weight: bold;
      color: #000053;
    }
    .job-company {
      font-size: 14px;
      color: #f97316;
      font-weight: 600;
      margin: 4px 0;
    }
    .job-duration {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
      text-align: right;
    }
    .job-description {
      color: #374151;
      margin-top: 8px;
      text-align: justify;
    }
    
    /* Qualifications styling */
    .qualification-item {
      margin-bottom: 16px;
      padding: 12px 16px;
      border-left: 4px solid #f97316;
      background: #f0f9ff;
      border-radius: 0 8px 8px 0;
    }
    .cert-name {
      font-size: 14px;
      font-weight: bold;
      color: #000053;
      margin-bottom: 4px;
    }
    .cert-details {
      font-size: 12px;
      color: #6b7280;
    }
    
    /* Skills styling */
    .skills-container {
      border-left: 4px solid #f97316;
      padding-left: 24px;
    }
    .skill-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .skill-bullet {
      width: 8px;
      height: 8px;
      background: #f97316;
      border-radius: 50%;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .skill-text {
      color: #374151;
    }
    
    /* Footer */
    .cv-footer {
      text-align: center;
      padding: 16px;
      border-top: 4px solid #f97316;
      background: linear-gradient(135deg, #fff5f0 0%, #ffedd5 100%);
      border-radius: 8px;
      margin-top: 40px;
    }
    .footer-text {
      font-size: 12px;
      font-weight: 600;
      color: #f97316;
    }
    .footer-names {
      font-size: 10px;
      color: #6b7280;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <!-- Header with Alteram branding -->
  <div class="cv-header">
    <div class="header-content">
      <div style="font-size: 24px; font-weight: bold;">ALTERAM SOLUTIONS</div>
      <div class="company-info">
        <p><strong>1144, 16th Road Randjespark Midrand</strong></p>
        <p>Postnet Suite 551, Private Bag X1, Melrose Arch, 2076</p>
        <p><strong>T</strong> 010 900 4075 | <strong>F</strong> 086 665 2021 | info@alteram.co.za</p>
        <p><strong>www.alteram.co.za</strong></p>
        <div class="company-reg">
          <p>Alteram Solutions (Pty) Ltd | Reg Number 2013/171329/07</p>
        </div>
      </div>
    </div>
  </div>

  <div class="cv-content">
    <!-- Candidate Information Header -->
    <div class="candidate-header">
      <div class="candidate-name">${record.name} ${record.surname || ''}</div>
      <div class="candidate-contact">
        ${record.email || ''} | ${record.phoneNumber || ''} | ${record.position || ''}
      </div>
      <div class="candidate-summary">
        <div class="summary-item">
          <div class="summary-value">${workExps.length}</div>
          <div class="summary-label">Work Experience${workExps.length !== 1 ? 's' : ''}</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${certifications.length}</div>
          <div class="summary-label">Qualification${certifications.length !== 1 ? 's' : ''}</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">${skillsList.length}</div>
          <div class="summary-label">Professional Skill${skillsList.length !== 1 ? 's' : ''}</div>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="section">
      <h2 class="section-title">Personal Information</h2>
      <table class="info-table">
        <tr><td class="info-label">ID Number:</td><td class="info-value">${record.idNumber || 'Not specified'}</td></tr>
        <tr><td class="info-label">Gender:</td><td class="info-value">${record.gender || 'Not specified'}</td></tr>
        <tr><td class="info-label">Race:</td><td class="info-value">${record.race || 'Not specified'}</td></tr>
        <tr><td class="info-label">Date of Birth:</td><td class="info-value">${record.dateOfBirth ? new Date(record.dateOfBirth).toLocaleDateString() : 'Not specified'}</td></tr>
        <tr><td class="info-label">Address:</td><td class="info-value">${record.address || 'Not specified'}</td></tr>
        <tr><td class="info-label">Languages:</td><td class="info-value">${record.languages || 'Not specified'}</td></tr>
      </table>
    </div>

    ${workExps.length > 0 ? `
    <!-- Work Experience -->
    <div class="section">
      <h2 class="section-title">Work Experience</h2>
      ${workExps.map((exp: any) => {
        // Format date range similar to CV template
        let dateRange = '';
        try {
          if (exp.startDate) {
            let startDate;
            if (exp.startDate.includes('/')) {
              const [month, year] = exp.startDate.split('/');
              startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            } else {
              startDate = new Date(exp.startDate);
            }
            const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            if (exp.isCurrentRole || !exp.endDate) {
              dateRange = `${startFormatted} - Present`;
            } else {
              let endDate;
              if (exp.endDate.includes('/')) {
                const [month, year] = exp.endDate.split('/');
                endDate = new Date(parseInt(year), parseInt(month) - 1, 1);
              } else {
                endDate = new Date(exp.endDate);
              }
              const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              dateRange = `${startFormatted} - ${endFormatted}`;
            }
          }
        } catch (e) {
          dateRange = exp.startDate || '';
        }
        
        return `
        <div class="experience-item">
          <div class="job-header">
            <div>
              <div class="job-title">${exp.position || ''} ${exp.roleTitle ? `- ${exp.roleTitle}` : ''}</div>
              <div class="job-company">${exp.companyName || ''}</div>
            </div>
            <div class="job-duration">${dateRange}</div>
          </div>
          ${exp.description ? `<div class="job-description">${exp.description}</div>` : ''}
        </div>`;
      }).join('')}
    </div>
    ` : ''}

    ${certifications.length > 0 ? `
    <!-- Qualifications & Certifications -->
    <div class="section">
      <h2 class="section-title">Qualifications & Certifications</h2>
      ${certifications.map((cert: any) => `
        <div class="qualification-item">
          <div class="cert-name">${cert.certificateName || ''}</div>
          <div class="cert-details">Department: ${cert.department || ''} | Role: ${cert.role || ''}</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${skillsList.length > 0 ? `
    <!-- Professional Skills -->
    <div class="section">
      <h2 class="section-title">Professional Skills</h2>
      <div class="skills-container">
        ${skillsList.map(skill => `
          <div class="skill-item">
            <div class="skill-bullet"></div>
            <div class="skill-text">${skill}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
  </div>

  <!-- Footer -->
  <div class="cv-footer">
    <div class="footer-text">CV Generated by Alteram Solutions</div>
    <div class="footer-names">Philip Henry Arnold | Garth Solomon Madella</div>
  </div>
</body>
</html>`;
  };

  const loadHtml2PdfScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="html2pdf"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error('Failed to load html2pdf')));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('html2pdf library loaded successfully');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load html2pdf library');
        reject(new Error('Failed to load html2pdf'));
      };
      document.head.appendChild(script);
    });
  };

  const generatePDF = async (element: HTMLElement): Promise<void> => {
    try {
      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4], // top, left, bottom, right margins in inches
        filename: `CV_${record.name}_${record.surname || ''}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.2, // Adjusted scale for multi-page content
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794, // A4 width in pixels at 96 DPI
          height: 2246, // Height for 2 pages (1123 * 2)
          scrollX: 0,
          scrollY: 0,
          onrendered: function (canvas: any) {
            console.log('Canvas rendered with dimensions:', canvas.width, 'x', canvas.height);
          }
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          putOnlyUsedFonts: true,
          compress: true
        },
        pagebreak: { 
          mode: ['css', 'legacy'], 
          before: '.page-break-before', 
          after: '.page-break-after', 
          avoid: '.no-page-break'
        },
        enableLinks: false
      };
      
      await (window as any).html2pdf().set(opt).from(element).save();
      console.log('PDF generated successfully with A4 sizing');
    } catch (error) {
      console.error('Error in generatePDF:', error);
      throw error;
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('cv-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>CV - ${record.name} ${record.surname || ''}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  return (
    <Dialog open={!!record} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" aria-describedby="cv-template-description">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>CV Template for {record.name} {record.surname || ''}</DialogTitle>
            <DialogDescription>
              Professional CV template displaying candidate information including work experience, qualifications, and contact details for {record.name} {record.surname || ''}
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-16 z-50 flex gap-2 no-print">
          <Button
            onClick={handleDownloadPDF}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg"
          >
            <Download className="w-4 h-4 mr-1" />
            Download PDF
          </Button>
          <Button
            onClick={handleDownloadWord}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-lg"
          >
            <Download className="w-4 h-4 mr-1" />
            Download Word
          </Button>
          <Button
            onClick={handlePrint}
            size="sm"
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-lg"
          >
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        </div>
        
        <div id="cv-template-description" className="sr-only">
          Professional CV template displaying candidate information including work experience, qualifications, and contact details for {record.name} {record.surname || ''}
        </div>
        
        <div id="cv-content" className="bg-white print:max-w-none print:shadow-none a4-optimized" style={{ 
          maxWidth: '210mm', // A4 width
          minHeight: '297mm', // A4 height
          margin: '0 auto',
          fontSize: '13px',
          lineHeight: '1.3'
        }}>
          {/* Header with Alteram Logo and Branding */}
          <div className="bg-gradient-to-r from-orange-300 to-orange-400 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={alteramLogoPath} 
                  alt="Alteram Solutions" 
                  className="h-16 w-auto"
                />
              </div>
              <div className="text-right text-white">
                <div className="text-sm font-medium">
                  <p>1144, 16th Road Randjespark Midrand</p>
                  <p>Postnet Suite 551, Private Bag X1, Melrose Arch, 2076</p>
                </div>
                <div className="text-sm mt-1">
                  <span className="font-semibold">T</span> 010 900 4075 | <span className="font-semibold">F</span> 086 665 2021 | info@alteram.co.za
                </div>
                <p className="text-sm font-medium mt-1">www.alteram.co.za</p>
              </div>
            </div>
            <div className="mt-2 border-t border-orange-200 pt-2">
              <p className="text-sm text-white font-medium">
                Alteram Solutions (Pty) Ltd | Reg Number 2013/171329/07
              </p>
            </div>
          </div>
        
          <div className="p-8 space-y-6 font-sans relative">
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <img 
                src={alteramLogoPath} 
                alt="Alteram Solutions Watermark" 
                className="w-96 h-auto"
              />
            </div>
            
            <div className="relative z-10 space-y-4">
              {/* Name and ID Section */}
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  <span className="font-bold" style={{ color: '#000053' }}>Name and Surname:</span> {record.name} {record.surname || ''}
                </p>
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  <span className="font-bold" style={{ color: '#000053' }}>Id/Passport:</span> {record.idPassport || ''}
                </p>
              </div>

              {/* Role Information */}
              <div className="space-y-2">
                {record.department && (
                  <p className="text-lg font-medium text-gray-800 leading-relaxed">
                    <span className="font-bold" style={{ color: '#000053' }}>Department:</span> {record.department}
                  </p>
                )}
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  <span className="font-bold" style={{ color: '#000053' }}>Role:</span> {record.position || record.roleTitle || ''}
                  {record.roleTitle && (
                    <span> | <span className="font-bold" style={{ color: '#000053' }}>Role Title:</span> {record.roleTitle}</span>
                  )}
                  {record.sapKLevel && record.sapKLevel.trim() !== '' && (
                    <span> | <span className="font-bold" style={{ color: '#000053' }}>K-Level:</span> {record.sapKLevel}</span>
                  )}
                </p>
                
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  <span className="font-bold" style={{ color: '#000053' }}>Years of Experience:</span> {record.experience || 0} years
                </p>
                
                {record.certificateTypes && (
                  <div className="mt-4">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed mb-2">
                      <span className="font-bold" style={{ color: '#000053' }}>Certificates:</span>
                    </p>
                    <div className="pl-4 space-y-1">
                      {(() => {
                        try {
                          console.log("Raw certificateTypes data:", record.certificateTypes);
                          
                          let certificates;
                          // Handle PostgreSQL array format
                          if (typeof record.certificateTypes === 'string' && record.certificateTypes.startsWith('{') && record.certificateTypes.endsWith('}')) {
                            const arrayContent = record.certificateTypes.slice(1, -1);
                            const items = [];
                            let current = '';
                            let inQuotes = false;
                            let escapeNext = false;
                            
                            for (let i = 0; i < arrayContent.length; i++) {
                              const char = arrayContent[i];
                              
                              if (escapeNext) {
                                current += char;
                                escapeNext = false;
                                continue;
                              }
                              
                              if (char === '\\') {
                                current += char;
                                escapeNext = true;
                                continue;
                              }
                              
                              if (char === '"') {
                                inQuotes = !inQuotes;
                                current += char;
                                continue;
                              }
                              
                              if (char === ',' && !inQuotes) {
                                if (current.trim()) {
                                  try {
                                    let cleanItem = current.trim();
                                    if (cleanItem.startsWith('"') && cleanItem.endsWith('"')) {
                                      cleanItem = cleanItem.slice(1, -1);
                                    }
                                    cleanItem = cleanItem.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                                    const parsed = JSON.parse(cleanItem);
                                    items.push(parsed);
                                  } catch (e) {
                                    console.warn("Failed to parse certificate item:", current);
                                  }
                                }
                                current = '';
                                continue;
                              }
                              
                              current += char;
                            }
                            
                            // Handle the last item
                            if (current.trim()) {
                              try {
                                let cleanItem = current.trim();
                                if (cleanItem.startsWith('"') && cleanItem.endsWith('"')) {
                                  cleanItem = cleanItem.slice(1, -1);
                                }
                                cleanItem = cleanItem.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                                const parsed = JSON.parse(cleanItem);
                                items.push(parsed);
                              } catch (e) {
                                console.warn("Failed to parse final certificate item:", current);
                              }
                            }
                            
                            certificates = items;
                          } else {
                            certificates = JSON.parse(record.certificateTypes);
                          }
                          
                          return certificates.map((cert: any, index: number) => (
                            <p key={index} className="text-lg font-medium text-gray-800 leading-relaxed">
                              • {cert.certificateName || cert.certificate}
                            </p>
                          ));
                        } catch (error) {
                          console.error("Error parsing certificates:", error);
                          return <p className="text-lg font-medium text-gray-800 leading-relaxed">• {record.certificateTypes}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Experience Table */}
              <div className="mt-8 mb-8 print-avoid-break">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-orange-400 pb-2" style={{ color: '#000053' }}>Experience Summary
</h2>
                <table className="w-full border-collapse border shadow-sm" style={{ borderColor: '#000053' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, #000053, #000066)' }}>
                      <th className="border px-6 py-3 text-left font-bold text-white" style={{ borderColor: '#000053' }}>Position</th>
                      <th className="border px-6 py-3 text-left font-bold text-white" style={{ borderColor: '#000053' }}>Company</th>
                      <th className="border px-6 py-3 text-left font-bold text-white" style={{ borderColor: '#000053' }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workExperiences.length > 0 ? workExperiences.map((exp: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="border px-6 py-3 align-top" style={{ borderColor: '#000053' }}>{exp.position || exp.role || ''}</td>
                        <td className="border px-6 py-3 align-top" style={{ borderColor: '#000053' }}>{exp.companyName || exp.company || exp.employer || exp.organization || ''}</td>
                        <td className="border px-6 py-3 align-top" style={{ borderColor: '#000053' }}>
                          {(() => {
                            try {
                              if (!exp.startDate) return '';
                              
                              // Handle MM/yyyy format from sample data
                              let startDate;
                              if (exp.startDate.includes('/')) {
                                const [month, year] = exp.startDate.split('/');
                                startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                              } else {
                                startDate = new Date(exp.startDate);
                              }
                              
                              if (isNaN(startDate.getTime())) return '';
                              
                              const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                              
                              if (exp.isCurrentRole || !exp.endDate || exp.endDate === '') {
                                return `${startFormatted} - Present`;
                              }
                              
                              // Handle MM/yyyy format for end date
                              let endDate;
                              if (exp.endDate.includes('/')) {
                                const [month, year] = exp.endDate.split('/');
                                endDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                              } else {
                                endDate = new Date(exp.endDate);
                              }
                              
                              if (isNaN(endDate.getTime())) return `${startFormatted} - Present`;
                              const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                              return `${startFormatted} - ${endFormatted}`;
                            } catch (error) {
                              return '';
                            }
                          })()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="border px-6 py-4 text-center text-gray-500 italic" style={{ borderColor: '#000053' }} colSpan={3}>No work experience recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Qualification Table */}
              <div className="mt-8 mb-8 print-avoid-break">
                <h2 className="text-xl font-bold mb-4 border-b-2 border-orange-400 pb-2" style={{ color: '#000053' }}>Qualification</h2>
                <table className="w-full border-collapse border shadow-sm" style={{ borderColor: '#000053' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, #000053, #000066)' }}>
                      <th className="border px-6 py-3 text-left font-bold text-white" style={{ borderColor: '#000053' }}>Qualifications</th>
                      <th className="border px-6 py-3 text-left font-bold text-white" style={{ borderColor: '#000053' }}>Institution</th>
                      <th className="border px-6 py-3 text-left font-bold text-white" style={{ borderColor: '#000053' }}>Year Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.qualifications ? (
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="border px-6 py-3 align-top" style={{ borderColor: '#000053' }}>{record.qualifications}</td>
                        <td className="border px-6 py-3 align-top text-center" style={{ borderColor: '#000053' }}>{record.instituteName || '-'}</td>
                        <td className="border px-6 py-3 align-top text-center" style={{ borderColor: '#000053' }}>{record.yearCompleted || '-'}</td>
                      </tr>
                    ) : null}
                    {otherQualifications.length > 0 && otherQualifications.map((qual: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="border px-6 py-3 align-top" style={{ borderColor: '#000053' }}>{qual.name || qual.type}</td>
                        <td className="border px-6 py-3 align-top text-center" style={{ borderColor: '#000053' }}>-</td>
                        <td className="border px-6 py-3 align-top text-center" style={{ borderColor: '#000053' }}>-</td>
                      </tr>
                    ))}
                    {!record.qualifications && otherQualifications.length === 0 && (
                      <tr>
                        <td className="border px-6 py-4 text-center text-gray-500 italic" style={{ borderColor: '#000053' }} colSpan={3}>No qualifications recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>



              {/* Experience Details Section */}
              {workExperiences.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 border-b-2 border-orange-400 pb-2" style={{ color: '#000053' }}>Experience</h2>
              {workExperiences.map((exp: any, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {exp.companyName || exp.company || exp.employer || exp.organization || 'Company'}
                    {(exp.roleTitle || exp.title) && (
                      <span className="font-medium ml-2" style={{ color: '#000053' }}>| {exp.roleTitle || exp.title}</span>
                    )}
                  </h3>
                  <p className="font-semibold text-gray-800">{exp.position || exp.role || 'Position'}</p>
                  <p className="text-gray-600 mb-3">
                    {(() => {
                      try {
                        if (!exp.startDate) return '';
                        
                        // Handle MM/yyyy format from sample data
                        let startDate;
                        if (exp.startDate.includes('/')) {
                          const [month, year] = exp.startDate.split('/');
                          startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                        } else {
                          startDate = new Date(exp.startDate);
                        }
                        
                        if (isNaN(startDate.getTime())) return '';
                        
                        const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                        
                        if (exp.isCurrentRole || !exp.endDate || exp.endDate === '') {
                          return `${startFormatted} - Present`;
                        }
                        
                        // Handle MM/yyyy format for end date
                        let endDate;
                        if (exp.endDate.includes('/')) {
                          const [month, year] = exp.endDate.split('/');
                          endDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                        } else {
                          endDate = new Date(exp.endDate);
                        }
                        
                        if (isNaN(endDate.getTime())) return `${startFormatted} - Present`;
                        const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                        return `${startFormatted} - ${endFormatted}`;
                      } catch (error) {
                        return '';
                      }
                    })()}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

              {/* Footer for Page 1 */}
              <div className="text-center pt-6 border-t-4 border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={alteramLogoPath} 
                    alt="Alteram Solutions" 
                    className="h-8 w-auto"
                  />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-orange-600">
                      CV Generated by Alteram Solutions - Page 1 of 2
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Philip Henry Arnold | Garth Solomon Madella
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 - Skills Section */}
          <div className="bg-white print:max-w-none print:shadow-none a4-optimized page-break-before flex flex-col" style={{ 
            maxWidth: '210mm', // A4 width
            minHeight: '297mm', // A4 height
            margin: '0 auto',
            fontSize: '13px',
            lineHeight: '1.3'
          }}>
            {/* Header with Alteram Logo and Branding - Page 2 */}
            <div className="bg-gradient-to-r from-orange-300 to-orange-400 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={alteramLogoPath} 
                    alt="Alteram Solutions" 
                    className="h-16 w-auto"
                  />
                </div>
                <div className="text-right text-white">
                  <div className="text-sm font-medium">
                    <p>1144, 16th Road Randjespark Midrand</p>
                    <p>Postnet Suite 551, Private Bag X1, Melrose Arch, 2076</p>
                  </div>
                  <div className="text-sm mt-1">
                    <span className="font-semibold">T</span> 010 900 4075 | <span className="font-semibold">F</span> 086 665 2021 | info@alteram.co.za
                  </div>
                  <p className="text-sm font-medium mt-1">www.alteram.co.za</p>
                </div>
              </div>
              <div className="mt-2 border-t border-orange-200 pt-2">
                <p className="text-sm text-white font-medium">
                  Alteram Solutions (Pty) Ltd | Reg Number 2013/171329/07
                </p>
              </div>
            </div>

            <div className="p-8 font-sans relative flex-grow flex flex-col">
              {/* Background watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <img 
                  src={alteramLogoPath} 
                  alt="Alteram Solutions Watermark" 
                  className="w-96 h-auto"
                />
              </div>

              <div className="relative z-10 space-y-6 flex-grow">
                {/* Skills Section */}
                <div>
                  <h2 className="text-xl font-bold mb-6 border-b-2 border-orange-400 pb-2" style={{ color: '#000053' }}>
                    Professional Skills
                  </h2>
                  {(() => {
                    // Parse and organize skills
                    const skillsText = record.skills ? record.skills.trim() : '';
                    if (!skillsText) return (
                      <div className="text-center py-12">
                        <p className="text-gray-500 italic text-lg mb-4">No skills have been added to this CV yet</p>
                        <p className="text-gray-400 text-sm">
                          Skills can be added when editing the CV record to showcase professional competencies and expertise
                        </p>
                      </div>
                    );

                      // Split skills by common separators and clean them up
                      const skillsList = skillsText
                        .split(/[,\n\r•\-\*]+/)
                        .map(skill => skill.trim())
                        .filter(skill => skill.length > 0)
                        .filter(skill => !skill.match(/^[•\-\*\s]+$/)); // Remove lines with only bullet points

                      if (skillsList.length === 0) {
                        return <p className="text-gray-500 italic">No skills recorded</p>;
                      }

                      // Group skills by category if they contain certain keywords
                      const categorizedSkills: { [key: string]: string[] } = {};
                      const uncategorizedSkills: string[] = [];

                      const categories = {
                        'Technical Skills': ['javascript', 'python', 'java', 'c++', 'html', 'css', 'react', 'angular', 'vue', 'node', 'sql', 'database', 'api', 'git', 'docker', 'kubernetes', 'aws', 'azure', 'cloud', 'programming', 'coding', 'software', 'web', 'mobile', 'app'],
                        'Management Skills': ['project management', 'team leadership', 'management', 'leadership', 'planning', 'strategic', 'budget', 'resource', 'coordination', 'oversight', 'supervision'],
                        'Communication Skills': ['communication', 'presentation', 'writing', 'speaking', 'interpersonal', 'collaboration', 'teamwork', 'negotiation', 'customer service', 'client relations'],
                        'Analytical Skills': ['analysis', 'analytical', 'problem solving', 'critical thinking', 'data analysis', 'research', 'statistics', 'metrics', 'reporting', 'troubleshooting'],
                        'Business Skills': ['business', 'finance', 'accounting', 'marketing', 'sales', 'strategy', 'operations', 'process improvement', 'quality assurance', 'compliance']
                      };

                      skillsList.forEach(skill => {
                        let categorized = false;
                        const skillLower = skill.toLowerCase();
                        
                        for (const [category, keywords] of Object.entries(categories)) {
                          if (keywords.some(keyword => skillLower.includes(keyword))) {
                            if (!categorizedSkills[category]) {
                              categorizedSkills[category] = [];
                            }
                            categorizedSkills[category].push(skill);
                            categorized = true;
                            break;
                          }
                        }
                        
                        if (!categorized) {
                          uncategorizedSkills.push(skill);
                        }
                      });

                      return (
                        <div className="border-l-4 border-orange-400 pl-6">
                          <div className="space-y-2">
                            {/* All Skills - no categories, just bullet points */}
                            {Object.entries(categorizedSkills).map(([category, skills]) => 
                              skills.map((skill, index) => (
                                <div key={`${category}-${index}`} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-gray-800">{skill}</span>
                                </div>
                              ))
                            )}
                            {/* Uncategorized Skills */}
                            {uncategorizedSkills.map((skill, index) => (
                              <div key={`uncategorized-${index}`} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                                <span className="text-gray-800">{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                </div>

              </div>

              {/* Footer for Page 2 - positioned at bottom */}
              <div className="text-center pt-6 border-t-4 border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg mt-auto">
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={alteramLogoPath} 
                    alt="Alteram Solutions" 
                    className="h-8 w-auto"
                  />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-orange-600">
                      CV Generated by Alteram Solutions - Page 2 of 2
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Philip Henry Arnold | Garth Solomon Madella
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}