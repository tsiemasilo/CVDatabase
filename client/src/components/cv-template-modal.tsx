import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  
  const qualifications = (() => {
    if (!record.qualifications) return [];
    try {
      // Handle different data types
      if (typeof record.qualifications === 'string') {
        // Skip empty strings, whitespace, or empty objects
        const trimmed = record.qualifications.trim();
        if (!trimmed || trimmed === '{}' || trimmed === '[]') {
          return [];
        }
        
        // If it's just a plain text qualification (not JSON), return empty array
        // since the main qualification will be displayed separately
        if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
          return [];
        }
        
        // Handle PostgreSQL array format like work experiences
        if (trimmed.startsWith('{') && trimmed.endsWith('}') && !trimmed.startsWith('{[')) {
          const arrayContent = trimmed.slice(1, -1);
          if (!arrayContent.trim()) return [];
          
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
                  console.warn("Failed to parse qualification item:", current);
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
              console.warn("Failed to parse final qualification item:", current);
            }
          }
          
          return items;
        }
        
        // Regular JSON parse
        return JSON.parse(record.qualifications);
      } else if (Array.isArray(record.qualifications)) {
        return record.qualifications;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error parsing qualifications:", error, record.qualifications);
      return [];
    }
  })();
  
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

  const handleDownloadPDF = () => {
    // Load jsPDF script if not already loaded
    if (!(window as any).jspdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        generateProgrammaticPDF();
      };
      document.head.appendChild(script);
    } else {
      generateProgrammaticPDF();
    }
  };

  const generateProgrammaticPDF = () => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // A4 dimensions: 210mm x 297mm
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;
    
    // Add Alteram branding header
    doc.setFillColor(255, 165, 0); // Orange color
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Company info (white text on orange background)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Alteram Solutions", margin, 15);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("1144, 16th Road Randjespark Midrand", margin, 22);
    doc.text("Postnet Suite 551, Private Bag X1, Melrose Arch, 2076", margin, 26);
    doc.text("T: 010 900 4075 | F: 086 665 2021 | info@alteram.co.za | www.alteram.co.za", margin, 30);
    
    currentY = 45;
    
    // Reset text color to black for content
    doc.setTextColor(0, 0, 0);
    
    // Personal Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CURRICULUM VITAE", margin, currentY);
    currentY += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 83); // Dark blue color
    doc.text("Name and Surname: ", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`${record.name} ${record.surname || ''}`, margin + 45, currentY);
    currentY += 7;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 83);
    doc.text("ID/Passport: ", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(record.idPassport || '', margin + 30, currentY);
    currentY += 7;
    
    if (record.department) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 83);
      doc.text("Department: ", margin, currentY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(record.department, margin + 30, currentY);
      currentY += 7;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 83);
    doc.text("Role: ", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(record.position || record.roleTitle || '', margin + 20, currentY);
    currentY += 7;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 83);
    doc.text("Years of Experience: ", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`${record.experience || 0} years`, margin + 45, currentY);
    currentY += 12;
    
    // Experience Summary Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 83);
    doc.text("Experience Summary", margin, currentY);
    currentY += 8;
    
    // Table headers
    const tableStartY = currentY;
    const colWidths = [60, 60, 50]; // Position, Company, Duration
    const rowHeight = 8;
    
    // Header background
    doc.setFillColor(0, 0, 83);
    doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Position", margin + 2, currentY + 5);
    doc.text("Company", margin + colWidths[0] + 2, currentY + 5);
    doc.text("Duration", margin + colWidths[0] + colWidths[1] + 2, currentY + 5);
    currentY += rowHeight;
    
    // Table rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    
    if (workExperiences.length > 0) {
      workExperiences.forEach((exp: any, index: number) => {
        // Alternate row background
        if (index % 2 === 1) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
        }
        
        // Row content
        doc.text(exp.position || exp.role || '', margin + 2, currentY + 5);
        doc.text(exp.companyName || exp.company || '', margin + colWidths[0] + 2, currentY + 5);
        
        // Format duration
        let duration = '';
        try {
          if (exp.startDate) {
            let startDate;
            if (exp.startDate.includes('/')) {
              const [month, year] = exp.startDate.split('/');
              startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            } else {
              startDate = new Date(exp.startDate);
            }
            
            if (!isNaN(startDate.getTime())) {
              const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              
              if (exp.isCurrentRole || !exp.endDate) {
                duration = `${startFormatted} - Present`;
              } else {
                let endDate;
                if (exp.endDate.includes('/')) {
                  const [month, year] = exp.endDate.split('/');
                  endDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                } else {
                  endDate = new Date(exp.endDate);
                }
                
                if (!isNaN(endDate.getTime())) {
                  const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                  duration = `${startFormatted} - ${endFormatted}`;
                }
              }
            }
          }
        } catch (error) {
          // If parsing fails, leave duration empty
        }
        
        doc.text(duration, margin + colWidths[0] + colWidths[1] + 2, currentY + 5);
        currentY += rowHeight;
      });
    } else {
      doc.setTextColor(128, 128, 128);
      doc.text("No work experience recorded", margin + 2, currentY + 5);
      currentY += rowHeight;
    }
    
    currentY += 8;
    
    // Qualifications Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 83);
    doc.text("Qualifications", margin, currentY);
    currentY += 8;
    
    // Qualifications table headers
    doc.setFillColor(0, 0, 83);
    doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Qualifications", margin + 2, currentY + 5);
    doc.text("Institution", margin + 80, currentY + 5);
    doc.text("Year Completed", margin + 130, currentY + 5);
    currentY += rowHeight;
    
    // Qualifications rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    
    let qualRowIndex = 0;
    
    // Main qualification
    if (record.qualifications) {
      if (qualRowIndex % 2 === 1) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
      }
      
      doc.text(record.qualifications.substring(0, 35), margin + 2, currentY + 5);
      doc.text(record.instituteName || '-', margin + 80, currentY + 5);
      doc.text(record.yearCompleted || '-', margin + 130, currentY + 5);
      currentY += rowHeight;
      qualRowIndex++;
    }
    
    // Additional qualifications from JSON
    if (qualifications.length > 0) {
      qualifications.forEach((qual: any) => {
        if (qualRowIndex % 2 === 1) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
        }
        
        doc.text(qual.name || qual.type || '', margin + 2, currentY + 5);
        doc.text('-', margin + 80, currentY + 5);
        doc.text('-', margin + 130, currentY + 5);
        currentY += rowHeight;
        qualRowIndex++;
      });
    }
    
    if (!record.qualifications && qualifications.length === 0) {
      doc.setTextColor(128, 128, 128);
      doc.text("No qualifications recorded", margin + 2, currentY + 5);
      currentY += rowHeight;
    }
    
    // Save the PDF
    doc.save(`CV_${record.name}_${record.surname || ''}.pdf`);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>CV Template - {record.name} {record.surname || ''}</DialogTitle>
          <DialogDescription>
            Professional CV template displaying candidate information, experience, and qualifications in a formatted layout.
          </DialogDescription>
        </DialogHeader>
        {/* Action Buttons */}
        <div className="absolute top-4 right-16 z-50 flex gap-2">
          <Button
            onClick={handleDownloadPDF}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg"
          >
            <Download className="w-4 h-4 mr-1" />
            Download PDF
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
        
        <div id="cv-content" className="bg-white">
          <style>{`
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body { margin: 0 !important; font-family: Arial, sans-serif !important; }
              .no-print { display: none !important; }
              table { page-break-inside: avoid; }
              tr { page-break-inside: avoid; }
            }
            @page {
              size: A4;
              margin: 15mm;
            }
          `}</style>
          {/* Header with Alteram Logo and Branding */}
          <div 
            className="px-8 py-4" 
            style={{ 
              background: 'linear-gradient(135deg, #fb923c, #f97316)',
              printColorAdjust: 'exact',
              WebkitPrintColorAdjust: 'exact'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={alteramLogoPath} 
                  alt="Alteram Solutions" 
                  style={{ height: '64px', width: 'auto' }}
                />
              </div>
              <div className="text-right" style={{ color: 'white' }}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>
                  <p>1144, 16th Road Randjespark Midrand</p>
                  <p>Postnet Suite 551, Private Bag X1, Melrose Arch, 2076</p>
                </div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  <span style={{ fontWeight: '600' }}>T</span> 010 900 4075 | <span style={{ fontWeight: '600' }}>F</span> 086 665 2021 | info@alteram.co.za
                </div>
                <p style={{ fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>www.alteram.co.za</p>
              </div>
            </div>
            <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.3)', paddingTop: '8px' }}>
              <p style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                Alteram Solutions (Pty) Ltd | Reg Number 2013/171329/07
              </p>
            </div>
          </div>
        
          <div style={{ 
            padding: '24px', 
            fontFamily: 'Arial, sans-serif', 
            position: 'relative',
            zIndex: 1,
            minHeight: '600px'
          }}>
            {/* Background watermark */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              opacity: 0.05,
              pointerEvents: 'none',
              zIndex: 0
            }}>
              <img 
                src={alteramLogoPath} 
                alt="Alteram Solutions Watermark" 
                style={{ width: '384px', height: 'auto', maxWidth: '384px' }}
              />
            </div>
            
            <div style={{ position: 'relative', zIndex: 10 }}>
              {/* Name and ID Section */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#374151',
                  lineHeight: '1.6',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#000053' }}>Name and Surname:</span> {record.name} {record.surname || ''}
                </p>
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#374151',
                  lineHeight: '1.6',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#000053' }}>Id/Passport:</span> {record.idPassport || ''}
                </p>
              </div>

              {/* Role Information */}
              <div style={{ marginBottom: '16px' }}>
                {record.department && (
                  <p style={{ 
                    fontSize: '18px', 
                    fontWeight: '500', 
                    color: '#374151',
                    lineHeight: '1.6',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: 'bold', color: '#000053' }}>Department:</span> {record.department}
                  </p>
                )}
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#374151',
                  lineHeight: '1.6',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#000053' }}>Role:</span> {record.position || record.roleTitle || ''}
                  {record.roleTitle && (
                    <span> | <span style={{ fontWeight: 'bold', color: '#000053' }}>Role Title:</span> {record.roleTitle}</span>
                  )}
                  {record.sapKLevel && record.sapKLevel.trim() !== '' && (
                    <span> | <span style={{ fontWeight: 'bold', color: '#000053' }}>K-Level:</span> {record.sapKLevel}</span>
                  )}
                </p>
                
                <p style={{ 
                  fontSize: '18px', 
                  fontWeight: '500', 
                  color: '#374151',
                  lineHeight: '1.6',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', color: '#000053' }}>Years of Experience:</span> {record.experience || 0} years
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
              <div style={{ margin: '32px 0' }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px', 
                  paddingBottom: '8px',
                  borderBottom: '2px solid #fb923c',
                  color: '#000053'
                }}>Experience Summary</h2>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  border: '1px solid #000053',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(to right, #000053, #000066)',
                      printColorAdjust: 'exact',
                      WebkitPrintColorAdjust: 'exact'
                    }}>
                      <th style={{ 
                        border: '1px solid #000053',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>Position</th>
                      <th style={{ 
                        border: '1px solid #000053',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>Company</th>
                      <th style={{ 
                        border: '1px solid #000053',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workExperiences.length > 0 ? workExperiences.map((exp: any, index: number) => (
                      <tr key={index} style={{ 
                        backgroundColor: index % 2 === 0 ? 'transparent' : '#f9fafb'
                      }}>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top'
                        }}>{exp.position || exp.role || ''}</td>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top'
                        }}>{exp.companyName || exp.company || exp.employer || exp.organization || ''}</td>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top'
                        }}>
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
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '16px 24px',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontStyle: 'italic'
                        }} colSpan={3}>No work experience recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Qualification Table */}
              <div style={{ margin: '32px 0' }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px', 
                  paddingBottom: '8px',
                  borderBottom: '2px solid #fb923c',
                  color: '#000053'
                }}>Qualification</h2>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  border: '1px solid #000053',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(to right, #000053, #000066)',
                      printColorAdjust: 'exact',
                      WebkitPrintColorAdjust: 'exact'
                    }}>
                      <th style={{ 
                        border: '1px solid #000053',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>Qualifications</th>
                      <th style={{ 
                        border: '1px solid #000053',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>Institution</th>
                      <th style={{ 
                        border: '1px solid #000053',
                        padding: '8px 16px',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>Year Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.qualifications ? (
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top'
                        }}>{record.qualifications}</td>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top',
                          textAlign: 'center'
                        }}>{record.instituteName || '-'}</td>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top',
                          textAlign: 'center'
                        }}>{record.yearCompleted || '-'}</td>
                      </tr>
                    ) : null}
                    {qualifications.length > 0 && qualifications.map((qual: any, index: number) => (
                      <tr key={index} style={{ 
                        backgroundColor: (index + (record.qualifications ? 1 : 0)) % 2 === 0 ? 'transparent' : '#f9fafb'
                      }}>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top'
                        }}>{qual.name || qual.type}</td>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top',
                          textAlign: 'center'
                        }}>-</td>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '8px 16px',
                          verticalAlign: 'top',
                          textAlign: 'center'
                        }}>-</td>
                      </tr>
                    ))}
                    {!record.qualifications && qualifications.length === 0 && (
                      <tr>
                        <td style={{ 
                          border: '1px solid #000053',
                          padding: '16px 24px',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontStyle: 'italic'
                        }} colSpan={3}>No qualifications recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>



              {/* Experience Details Section */}
              {workExperiences.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-4 border-b-2 border-orange-400 pb-2" style={{ color: '#000053' }}>Experience</h2>
              {workExperiences.map((exp: any, index: number) => (
                <div key={index} className="mb-3">
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

              {/* Footer */}
              <div className="text-center pt-6 border-t-4 border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={alteramLogoPath} 
                    alt="Alteram Solutions" 
                    className="h-8 w-auto"
                  />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-orange-600">
                      CV Generated by Alteram Solutions
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