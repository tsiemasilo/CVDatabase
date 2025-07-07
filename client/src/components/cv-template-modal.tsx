import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CVRecord } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Phone, Mail, User, Award, Briefcase, GraduationCap, Globe } from "lucide-react";
import alteramLogoPath from "@assets/alteram1_1_600x197_1750838676214.png";

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

  return (
    <Dialog open={!!record} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-white">
          {/* Header with Alteram Logo and Branding */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-4">
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
            <div className="mt-2 border-t border-orange-300 pt-2">
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
              {/* Role */}
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-800">
                  <span className="font-bold text-blue-900">Role:</span> {record.position || record.roleTitle || ''}
                </p>
              </div>

              {/* Name and ID Section */}
              <div className="space-y-2 mb-6">
                <p className="text-lg">
                  <span className="font-bold text-blue-900">Name and Surname:</span> {record.name} {record.surname || ''}
                </p>
                <p className="text-lg">
                  <span className="font-bold text-blue-900">Id/Passport:</span> {record.idPassport || ''}
                </p>
              </div>

              {/* Experience Table */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-blue-900 mb-4 border-b-2 border-orange-400 pb-2">Experience</h2>
                <table className="w-full border-collapse border border-blue-300">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-blue-800">
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
                <h2 className="text-xl font-bold text-blue-900 mb-4 border-b-2 border-orange-400 pb-2">Qualification</h2>
                <table className="w-full border-collapse border border-blue-300">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-900 to-blue-800">
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
                  <h2 className="text-xl font-bold text-blue-900 mb-4 border-b-2 border-orange-400 pb-2">Skills</h2>
                  <p className="text-gray-700">
                    <span className="font-semibold text-blue-900">Languages:</span> {languages.join(', ')}
                    {record.sapKLevel && <span>. <span className="font-semibold text-blue-900">SAP Knowledge Level:</span> {record.sapKLevel}</span>}
                  </p>
                </div>
              )}

              {/* Experience Details Section */}
              {workExperiences.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-blue-900 mb-4 border-b-2 border-orange-400 pb-2">Experience</h2>
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
                    <p className="text-xs text-gray-600">
                      {new Date().toLocaleDateString()} • Professional Services
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