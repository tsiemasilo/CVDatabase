import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, Mail, Phone, Building, Calendar, Languages, Award, FileText, Home, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CVRecord {
  id: number;
  name: string;
  surname?: string;
  email: string;
  phone: string;
  position: string;
  roleTitle?: string;
  department: string;
  experience: number;
  experienceInSimilarRole?: number;
  experienceWithITSMTools?: number;
  sapKLevel?: string;
  status: string;
  languages: string;
  qualifications: string;
  qualificationType?: string;
  qualificationName?: string;
  cvFile?: string;
  submittedAt: string;
  workExperiences?: string; // JSON string in database
  certificateTypes?: string; // JSON string in database
}

export default function SuccessPage() {
  const [submittedRecordId, setSubmittedRecordId] = useState<number | null>(null);

  // Get the record ID from URL parameters or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const recordId = urlParams.get('recordId');
    
    if (recordId) {
      setSubmittedRecordId(parseInt(recordId));
    } else {
      // Fallback to localStorage if no URL param
      const storedRecordId = localStorage.getItem('lastSubmittedRecordId');
      if (storedRecordId) {
        setSubmittedRecordId(parseInt(storedRecordId));
      }
    }
  }, []);

  // Fetch the submitted record details
  const { data: record, isLoading, error } = useQuery<CVRecord>({
    queryKey: [`/api/cv-records/${submittedRecordId}`],
    enabled: !!submittedRecordId,
  });



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-blue-100 text-blue-800';
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your submission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CV Successfully Submitted!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your application. Your CV has been received and is being reviewed.
          </p>
        </div>



        {/* Record Details */}
        {record ? (
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Name:</span>
                      <span>{record.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span>{record.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span>{record.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Position:</span>
                      <span>{record.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Department:</span>
                      <span>{record.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Experience:</span>
                      <span>{record.experience} years</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-medium">Status:</span>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'Unknown'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Submitted:</span>
                  <span>{formatDate(record.submittedAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages and Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{record.languages || "Not specified"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{record.qualifications || "Not specified"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Experience Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {record.experienceInSimilarRole !== undefined && record.experienceInSimilarRole !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Similar Role Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">{record.experienceInSimilarRole} years</p>
                  </CardContent>
                </Card>
              )}
              
              {record.experienceWithITSMTools !== undefined && record.experienceWithITSMTools !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      ITSM Tools Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">{record.experienceWithITSMTools} years</p>
                  </CardContent>
                </Card>
              )}
              
              {record.sapKLevel && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      SAP Knowledge Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="text-lg px-3 py-1">{record.sapKLevel}</Badge>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Work Experience */}
            {record.workExperiences && (() => {
              try {
                const workExp = JSON.parse(record.workExperiences);
                return workExp && workExp.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Work Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {workExp.map((exp: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4">
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-gray-600">{exp.companyName}</p>
                            <p className="text-sm text-gray-500">
                              {exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}
                            </p>
                            {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              } catch (e) {
                return null;
              }
            })()}

            {/* Certificates */}
            {record.certificateTypes && (() => {
              try {
                const certificates = JSON.parse(record.certificateTypes);
                return certificates && certificates.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Certificates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certificates.map((cert: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3">
                            <p className="font-medium">{cert.certificateName}</p>
                            <p className="text-sm text-gray-600">{cert.department} - {cert.role}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              } catch (e) {
                return null;
              }
            })()}

            {/* Next Steps */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <ul className="space-y-2">
                  <li>• Your application will be reviewed by our HR team</li>
                  <li>• We will contact you within 5-7 business days</li>
                  <li>• If shortlisted, you will be invited for an interview</li>
                  <li>• Keep an eye on your email for updates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Unable to load your submission details at this time.
              </p>
              <p className="text-sm text-gray-500">
                Your CV has been successfully submitted and saved in our system.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => {
              // Clear the success state and localStorage
              localStorage.removeItem('lastSubmittedRecordId');
              window.history.replaceState({}, '', window.location.pathname);
              window.location.reload();
            }}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Submit Another Application
          </Button>
        </div>
      </div>
    </div>
  );
}