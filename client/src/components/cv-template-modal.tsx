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
        
        <div className="bg-white p-8 space-y-8">
          {/* Header Section */}
          <div className="border-b-4 border-blue-600 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {record.name} {record.surname || ''}
                </h1>
                <p className="text-xl text-blue-600 font-semibold mt-2">
                  {record.position || record.roleTitle || 'Professional'}
                </p>
                <p className="text-lg text-gray-600 mt-1">
                  {record.department} Department
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {record.name.charAt(0)}{(record.surname || record.name.split(' ')[1] || '').charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-gray-600" />
                  <span>{record.email}</span>
                </div>
                {record.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-600" />
                    <span>{record.phone}</span>
                  </div>
                )}
                {record.idPassport && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-gray-600" />
                    <span>ID: {record.idPassport}</span>
                  </div>
                )}
                {record.gender && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-gray-600" />
                    <span>Gender: {record.gender}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                Professional Summary
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Years of Experience:</span>
                  <span className="ml-2">{totalExperience} years</span>
                </div>
                <div>
                  <span className="font-semibold">Status:</span>
                  <Badge className={`ml-2 ${
                    record.status === 'active' ? 'bg-green-100 text-green-800' :
                    record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.status}
                  </Badge>
                </div>
                {record.sapKLevel && (
                  <div>
                    <span className="font-semibold">SAP K-Level:</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      {record.sapKLevel}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((language, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {language.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {workExperiences.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                Work Experience
              </h2>
              <div className="space-y-6">
                {workExperiences.map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-6 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {exp.position || 'Position'}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {exp.company || 'Company'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-gray-600">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {exp.startDate ? new Date(exp.startDate).getFullYear() : 'Start'} - 
                            {exp.isCurrentRole ? ' Present' : (exp.endDate ? ` ${new Date(exp.endDate).getFullYear()}` : ' End')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Duration: {exp.startDate && (exp.endDate || exp.isCurrentRole) ? 
                            (() => {
                              const start = new Date(exp.startDate);
                              const end = exp.isCurrentRole ? new Date() : new Date(exp.endDate);
                              const years = end.getFullYear() - start.getFullYear();
                              const months = end.getMonth() - start.getMonth();
                              const totalMonths = years * 12 + months;
                              return totalMonths >= 12 ? 
                                `${Math.floor(totalMonths / 12)} years ${totalMonths % 12} months` :
                                `${totalMonths} months`;
                            })() : 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    {exp.isCurrentRole && (
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        Current Position
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qualifications */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Qualifications
            </h2>
            <div className="space-y-4">
              {record.qualifications && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Primary Qualifications</h3>
                  <p className="text-gray-700">{record.qualifications}</p>
                </div>
              )}
              
              {otherQualifications.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Additional Qualifications</h3>
                  <div className="space-y-2">
                    {otherQualifications.map((qual: any, index: number) => (
                      <div key={index} className="border-l-2 border-blue-300 pl-3">
                        <p className="font-medium text-gray-800">
                          {qual.type}: {qual.name}
                        </p>
                        {qual.description && (
                          <p className="text-sm text-gray-600">{qual.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

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