import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { CVRecord } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Phone, Mail, User, Award, Briefcase, GraduationCap, Globe, Download, Printer, Building, Calendar } from "lucide-react";
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
          scale: 1.5, // Reduced scale for better fit
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          putOnlyUsedFonts: true,
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
          fontSize: '12px',
          lineHeight: '1.4',
          fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif'
        }}>
          {/* Header with Alteram Logo and Branding */}
          <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-8 py-6 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <img 
                  src={alteramLogoPath} 
                  alt="Alteram Solutions" 
                  className="h-18 w-auto drop-shadow-lg"
                />
                <div className="border-l border-orange-200 pl-6">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Professional CV</h1>
                  <p className="text-orange-100 font-medium">Talent Solutions & Consulting</p>
                </div>
              </div>
              
              <div className="text-right text-white">
                <div className="text-sm font-medium space-y-1">
                  <p className="flex items-center justify-end space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>1144, 16th Road Randjespark Midrand</span>
                  </p>
                  <p className="text-orange-100">Postnet Suite 551, Private Bag X1, Melrose Arch, 2076</p>
                </div>
                <div className="text-sm mt-3 space-y-1">
                  <p className="flex items-center justify-end space-x-2">
                    <Phone className="w-4 h-4" />
                    <span><span className="font-semibold">T</span> 010 900 4075 | <span className="font-semibold">F</span> 086 665 2021</span>
                  </p>
                  <p className="flex items-center justify-end space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>info@alteram.co.za</span>
                  </p>
                  <p className="flex items-center justify-end space-x-2">
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">www.alteram.co.za</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-4 pt-4 border-t border-orange-300">
              <p className="text-sm text-orange-100 font-medium text-center">
                Alteram Solutions (Pty) Ltd | Registration Number: 2013/171329/07
              </p>
            </div>
          </div>
        
          {/* Main Content Area */}
          <div className="p-8 space-y-8 relative">
            {/* Subtle Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
              <img 
                src={alteramLogoPath} 
                alt="Alteram Solutions Watermark" 
                className="w-80 h-auto"
              />
            </div>
            
            <div className="relative z-10">
              {/* Candidate Profile Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-8 border-l-4 border-orange-500">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Personal Info */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <h2 className="text-xl font-bold mb-4 flex items-center" style={{ color: '#000053' }}>
                        <User className="w-5 h-5 mr-2" />
                        Candidate Profile
                      </h2>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-24 font-semibold text-gray-700 text-sm">Name:</div>
                        <div className="font-bold text-lg" style={{ color: '#000053' }}>
                          {record.name} {record.surname || ''}
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-24 font-semibold text-gray-700 text-sm">ID/Passport:</div>
                        <div className="text-gray-800 font-medium">{record.idPassport || 'Not provided'}</div>
                      </div>
                      
                      {record.email && (
                        <div className="flex items-start space-x-3">
                          <div className="w-24 font-semibold text-gray-700 text-sm">Email:</div>
                          <div className="text-gray-800 font-medium">{record.email}</div>
                        </div>
                      )}
                      
                      {record.phone && (
                        <div className="flex items-start space-x-3">
                          <div className="w-24 font-semibold text-gray-700 text-sm">Phone:</div>
                          <div className="text-gray-800 font-medium">{record.phone}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column - Professional Info */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <h3 className="text-lg font-bold flex items-center" style={{ color: '#000053' }}>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Professional Details
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {record.department && (
                        <div className="flex items-start space-x-3">
                          <div className="w-24 font-semibold text-gray-700 text-sm">Department:</div>
                          <div className="text-gray-800 font-medium">{record.department}</div>
                        </div>
                      )}
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-24 font-semibold text-gray-700 text-sm">Position:</div>
                        <div className="font-semibold" style={{ color: '#000053' }}>
                          {record.position || record.roleTitle || 'Not specified'}
                        </div>
                      </div>
                      
                      {record.roleTitle && record.position !== record.roleTitle && (
                        <div className="flex items-start space-x-3">
                          <div className="w-24 font-semibold text-gray-700 text-sm">Role Title:</div>
                          <div className="text-gray-800 font-medium">{record.roleTitle}</div>
                        </div>
                      )}
                      
                      {record.sapKLevel && record.sapKLevel.trim() !== '' && (
                        <div className="flex items-start space-x-3">
                          <div className="w-24 font-semibold text-gray-700 text-sm">SAP Level:</div>
                          <div className="text-gray-800 font-medium bg-orange-100 px-2 py-1 rounded text-sm">
                            {record.sapKLevel}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-24 font-semibold text-gray-700 text-sm">Experience:</div>
                        <div className="text-gray-800 font-medium">
                          <span className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
                            {record.experience || 0} years
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                
              {/* Certificates Section */}
              {record.certificateTypes && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: '#000053' }}>
                    <Award className="w-5 h-5 mr-2" />
                    Professional Certifications
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
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
                          <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                            <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-gray-800">
                                {cert.certificateName || cert.certificate}
                              </div>
                              {cert.department && cert.role && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {cert.department} - {cert.role}
                                </div>
                              )}
                            </div>
                          </div>
                        ));
                      } catch (error) {
                        console.error("Error parsing certificates:", error);
                        return (
                          <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                            <Award className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="font-semibold text-gray-800">{record.certificateTypes}</div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Professional Experience Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: '#000053' }}>
                  <Briefcase className="w-6 h-6 mr-2" />
                  Professional Experience
                </h2>
                
                {workExperiences.length > 0 ? (
                  <div className="space-y-6">
                    {workExperiences.map((exp: any, index: number) => (
                      <div key={index} className="relative border-l-4 border-orange-400 pl-6 pb-6 last:pb-0">
                        {/* Experience Timeline Dot */}
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-orange-400 rounded-full border-4 border-white shadow-md"></div>
                        
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-bold" style={{ color: '#000053' }}>
                                {exp.position || exp.role || 'Position Not Specified'}
                              </h3>
                              <p className="text-orange-600 font-semibold">
                                {exp.companyName || exp.company || exp.employer || exp.organization || 'Company Not Specified'}
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-blue-800">
                                {(() => {
                                  try {
                                    if (!exp.startDate) return 'Duration Not Specified';
                                    
                                    // Handle MM/yyyy format from sample data
                                    let startDate;
                                    if (exp.startDate.includes('/')) {
                                      const [month, year] = exp.startDate.split('/');
                                      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                                    } else {
                                      startDate = new Date(exp.startDate);
                                    }
                                    
                                    if (isNaN(startDate.getTime())) return 'Invalid Date';
                                    
                                    const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                    
                                    if (exp.isCurrentRole || !exp.endDate || exp.endDate === '') {
                                      return `${startFormatted} - Present`;
                                    }
                                    
                                    let endDate;
                                    if (exp.endDate.includes('/')) {
                                      const [month, year] = exp.endDate.split('/');
                                      endDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                                    } else {
                                      endDate = new Date(exp.endDate);
                                    }
                                    
                                    if (isNaN(endDate.getTime())) return startFormatted;
                                    
                                    const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                    
                                    return `${startFormatted} - ${endFormatted}`;
                                  } catch (error) {
                                    console.error('Error formatting date:', error);
                                    return exp.startDate || 'Date Error';
                                  }
                                })()}
                              </div>
                              
                              {exp.isCurrentRole && (
                                <div className="mt-2">
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Current Role
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Role Details */}
                          {exp.roleTitle && exp.roleTitle !== exp.position && (
                            <div className="mb-2">
                              <span className="text-gray-600 text-sm font-medium">Role Title: </span>
                              <span className="text-gray-800 font-medium">{exp.roleTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No work experience data available</p>
                    <p className="text-gray-400 text-sm mt-1">Experience information will be displayed here once added</p>
                  </div>
                )}
              </div>

              {/* Academic Qualifications Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: '#000053' }}>
                  <GraduationCap className="w-6 h-6 mr-2" />
                  Academic Qualifications
                </h2>
                
                <div className="space-y-4">
                  {record.qualifications && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold" style={{ color: '#000053' }}>
                            {record.qualifications}
                          </h3>
                          {record.instituteName && (
                            <p className="text-blue-600 font-semibold mt-1">
                              <Building className="w-4 h-4 inline mr-1" />
                              {record.instituteName}
                            </p>
                          )}
                        </div>
                        {record.yearCompleted && (
                          <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-blue-800">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {record.yearCompleted}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {otherQualifications.length > 0 && otherQualifications.map((qual: any, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold" style={{ color: '#000053' }}>
                            {qual.name || qual.type}
                          </h3>
                          <p className="text-green-600 font-semibold mt-1">
                            <Award className="w-4 h-4 inline mr-1" />
                            Additional Qualification
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!record.qualifications && otherQualifications.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No qualifications data available</p>
                      <p className="text-gray-400 text-sm mt-1">Educational qualifications will be displayed here once added</p>
                    </div>
                  )}
                </div>
              </div>

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