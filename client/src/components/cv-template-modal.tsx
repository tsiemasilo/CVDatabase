import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CVRecord } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Phone, Mail, User, Award, Briefcase, GraduationCap, Globe } from "lucide-react";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-800">
            Curriculum Vitae
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-8 space-y-6 font-sans">
          {/* Role */}
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-800">
              <span className="font-bold">Role:</span> {record.position || record.roleTitle || ''}
            </p>
          </div>

          {/* Name and ID Section */}
          <div className="space-y-2 mb-6">
            <p className="text-lg">
              <span className="font-bold">Name and Surname:</span> {record.name} {record.surname || ''}
            </p>
            <p className="text-lg">
              <span className="font-bold">Id/Passport:</span> {record.idPassport || ''}
            </p>
          </div>

          {/* Experience Table */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Experience</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Position</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Company</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Duration</th>
                </tr>
              </thead>
              <tbody>
                {workExperiences.length > 0 ? workExperiences.map((exp: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{exp.position || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">{exp.company || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">
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
                    <td className="border border-gray-300 px-4 py-2" colSpan={3}>No work experience recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Qualification Table */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Qualification</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Qualifications</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Institution</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Year Completed</th>
                </tr>
              </thead>
              <tbody>
                {record.qualifications ? (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">{record.qualifications}</td>
                    <td className="border border-gray-300 px-4 py-2">-</td>
                    <td className="border border-gray-300 px-4 py-2">-</td>
                  </tr>
                ) : null}
                {otherQualifications.length > 0 && otherQualifications.map((qual: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{qual.name || qual.type}</td>
                    <td className="border border-gray-300 px-4 py-2">-</td>
                    <td className="border border-gray-300 px-4 py-2">-</td>
                  </tr>
                ))}
                {!record.qualifications && otherQualifications.length === 0 && (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2" colSpan={3}>No qualifications recorded</td>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
              <p className="text-gray-700">
                <span className="font-semibold">Languages:</span> {languages.join(', ')}
                {record.sapKLevel && <span>. <span className="font-semibold">SAP Knowledge Level:</span> {record.sapKLevel}</span>}
              </p>
            </div>
          )}

          {/* Experience Details Section */}
          {workExperiences.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Experience</h2>
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
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              CV Generated by Alteram Solutions • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}