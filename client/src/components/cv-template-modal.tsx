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

  // Parse work experiences from the record
  const workExperiences = record.workExperiences ? JSON.parse(record.workExperiences) : [];
  const otherQualifications = record.otherQualifications ? JSON.parse(record.otherQualifications) : [];
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
    const opt = {
      margin: 0.5,
      filename: `CV_${record.name}_${record.surname || ''}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    (window as any).html2pdf().set(opt).from(element).save();
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
            
            <div className="relative z-10">
              {/* Name and ID Section */}
              <div className="space-y-2 mb-6">
                <p className="text-lg">
                  <span className="font-bold text-blue-700">Name and Surname:</span> {record.name} {record.surname || ''}
                </p>
                <p className="text-lg">
                  <span className="font-bold text-blue-700">Id/Passport:</span> {record.idPassport || ''}
                </p>
              </div>

              {/* Role */}
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-800">
                  <span className="font-bold text-blue-700">Role:</span> {record.position || record.roleTitle || ''}
                  {record.department && (
                    <span> | <span className="font-bold text-blue-700">Department:</span> {record.department}</span>
                  )}
                  {record.roleTitle && (
                    <span> | <span className="font-bold text-blue-700">Role Title:</span> {record.roleTitle}</span>
                  )}
                </p>
                {record.sapKLevel && record.sapKLevel.trim() !== '' && (
                  <p className="text-lg font-medium text-gray-800 mt-2">
                    <span className="font-bold text-blue-700">K-Level:</span> {record.sapKLevel}
                  </p>
                )}
                <p className="text-lg font-medium text-gray-800 mt-2">
                  <span className="font-bold text-blue-700">Years of Experience:</span> {record.experience || 0} years
                </p>
              </div>

              {/* Experience Table */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Experience</h2>
                <table className="w-full border-collapse border border-blue-300">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                      <th className="border border-blue-300 px-4 py-3 text-left font-bold text-white">Position</th>
                      <th className="border border-blue-300 px-4 py-3 text-left font-bold text-white">Company</th>
                      <th className="border border-blue-300 px-4 py-3 text-left font-bold text-white">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workExperiences.length > 0 ? workExperiences.map((exp: any, index: number) => (
                      <tr key={index} className="hover:bg-blue-50">
                        <td className="border border-blue-300 px-4 py-2">{exp.position || ''}</td>
                        <td className="border border-blue-300 px-4 py-2">{exp.company || ''}</td>
                        <td className="border border-blue-300 px-4 py-2">
                      {exp.startDate ? 
                        `${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${
                          exp.isCurrentRole ? 'Present' : 
                          (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present')
                          }` : ''
                        }
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="border border-blue-300 px-4 py-2" colSpan={3}>No work experience recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Qualification Table */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Qualification</h2>
                <table className="w-full border-collapse border border-blue-300">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                      <th className="border border-blue-300 px-4 py-3 text-left font-bold text-white">Qualifications</th>
                      <th className="border border-blue-300 px-4 py-3 text-left font-bold text-white">Institution</th>
                      <th className="border border-blue-300 px-4 py-3 text-left font-bold text-white">Year Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.qualifications ? (
                      <tr className="hover:bg-blue-50">
                        <td className="border border-blue-300 px-4 py-2">{record.qualifications}</td>
                        <td className="border border-blue-300 px-4 py-2">-</td>
                        <td className="border border-blue-300 px-4 py-2">-</td>
                      </tr>
                    ) : null}
                    {otherQualifications.length > 0 && otherQualifications.map((qual: any, index: number) => (
                      <tr key={index} className="hover:bg-blue-50">
                        <td className="border border-blue-300 px-4 py-2">{qual.name || qual.type}</td>
                        <td className="border border-blue-300 px-4 py-2">-</td>
                        <td className="border border-blue-300 px-4 py-2">-</td>
                      </tr>
                    ))}
                    {!record.qualifications && otherQualifications.length === 0 && (
                      <tr>
                        <td className="border border-blue-300 px-4 py-2" colSpan={3}>No qualifications recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

          {/* Professional Summary/Description */}
          {record.qualifications && (
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed text-justify">
                A highly motivated professional with experience in {record.department || 'various areas'}, 
                demonstrating strong skills in {record.position || 'their field'}. 
                {record.experience ? `With ${record.experience} years of experience, ` : ''}
                committed to delivering high-quality solutions and contributing to organizational success.
                {record.sapKLevel ? ` Certified at SAP ${record.sapKLevel} level.` : ''}
              </p>
            </div>
          )}

              {/* Skills Section */}
              {languages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Skills</h2>
                  <p className="text-gray-700">
                    <span className="font-semibold text-blue-700">Languages:</span> {languages.join(', ')}
                    {record.sapKLevel && <span>. <span className="font-semibold text-blue-700">SAP Knowledge Level:</span> {record.sapKLevel}</span>}
                  </p>
                </div>
              )}

              {/* Experience Details Section */}
              {workExperiences.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Experience</h2>
              {workExperiences.map((exp: any, index: number) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{exp.company || 'Company'}</h3>
                  <p className="font-semibold text-gray-800">{exp.position || 'Position'}</p>
                  <p className="text-gray-600 mb-3">
                    {exp.startDate ? 
                      `${new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} – ${
                        exp.isCurrentRole ? 'Present' : 
                        (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present')
                      }` : ''
                    }
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