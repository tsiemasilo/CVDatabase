import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    const element = document.getElementById('cv-content');
    if (element) {
      // Load html2pdf script if not already loaded
      if (!(window as any).html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => {
          generatePDF(element);
        };
        document.head.appendChild(script);
      } else {
        generatePDF(element);
      }
    }
  };

  const generatePDF = (element: HTMLElement) => {
    // Store current scroll positions
    const dialogContent = document.querySelector('[role="dialog"] .max-w-4xl');
    const originalScrollTop = dialogContent ? dialogContent.scrollTop : 0;
    const originalWindowScrollY = window.scrollY;
    
    // Reset scroll positions before generating PDF
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    
    // Force a layout recalculation
    element.style.transform = 'translateZ(0)';
    element.offsetHeight; // Trigger reflow
    
    const opt = {
      margin: 0.5,
      filename: `CV_${record.name}_${record.surname || ''}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        useCORS: true,
        allowTaint: false,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    (window as any).html2pdf().set(opt).from(element).save().then(() => {
      // Restore original scroll positions
      if (dialogContent) {
        dialogContent.scrollTop = originalScrollTop;
      }
      window.scrollTo(0, originalWindowScrollY);
      element.style.transform = '';
    });
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
              <div className="mt-8 mb-8">
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
              <div className="mt-8 mb-8">
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
                    {qualifications.length > 0 && qualifications.map((qual: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="border px-6 py-3 align-top" style={{ borderColor: '#000053' }}>{qual.name || qual.type}</td>
                        <td className="border px-6 py-3 align-top text-center" style={{ borderColor: '#000053' }}>-</td>
                        <td className="border px-6 py-3 align-top text-center" style={{ borderColor: '#000053' }}>-</td>
                      </tr>
                    ))}
                    {!record.qualifications && qualifications.length === 0 && (
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