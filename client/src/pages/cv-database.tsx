import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CVRecord } from "@shared/schema";

import CVTable from "@/components/cv-table";
import AddCVModal from "@/components/add-cv-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, X } from "lucide-react";
import { DEPARTMENTS, ROLES, LANGUAGES, QUALIFICATION_TYPES, QUALIFICATION_MAPPINGS, NQF_LEVELS, SAP_K_LEVELS } from "@shared/data";

export default function CVDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Additional filter states
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [surnameFilter, setSurnameFilter] = useState("");
  const [idPassportFilter, setIdPassportFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roleTitleFilter, setRoleTitleFilter] = useState("");
  const [sapLevelFilter, setSapLevelFilter] = useState("");
  const [qualificationType1Filter, setQualificationType1Filter] = useState("");
  const [qualificationType2Filter, setQualificationType2Filter] = useState("");
  const [qualification1Filter, setQualification1Filter] = useState("");
  const [qualification2Filter, setQualification2Filter] = useState("");

  const { data: allCVRecords = [], isLoading, refetch } = useQuery<CVRecord[]>({
    queryKey: ["/api/cv-records"],
    queryFn: async () => {
      const response = await fetch(`/api/cv-records`);
      if (!response.ok) throw new Error("Failed to fetch CV records");
      return response.json();
    },
  });

  // Apply all filters to the data
  const cvRecords = allCVRecords.filter(record => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        record.name.toLowerCase().includes(searchLower) ||
        (record.surname && record.surname.toLowerCase().includes(searchLower)) ||
        record.email.toLowerCase().includes(searchLower) ||
        (record.phone && record.phone.toLowerCase().includes(searchLower)) ||
        (record.position && record.position.toLowerCase().includes(searchLower)) ||
        (record.roleTitle && record.roleTitle.toLowerCase().includes(searchLower)) ||
        (record.department && record.department.toLowerCase().includes(searchLower)) ||
        (record.qualifications && record.qualifications.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter && record.status !== statusFilter) return false;

    // Department filter
    if (departmentFilter && record.department !== departmentFilter) return false;

    // Name filter
    if (nameFilter && !record.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;

    // Surname filter
    if (surnameFilter && record.surname && !record.surname.toLowerCase().includes(surnameFilter.toLowerCase())) return false;

    // ID/Passport filter
    if (idPassportFilter && record.idPassport && !record.idPassport.includes(idPassportFilter)) return false;

    // Role filter (checking position field)
    if (roleFilter && record.position !== roleFilter) return false;

    // Role Title filter
    if (roleTitleFilter && record.roleTitle !== roleTitleFilter) return false;

    // SAP K-Level filter
    if (sapLevelFilter && record.sapKLevel !== sapLevelFilter) return false;

    // Language filter
    if (languageFilter && (!record.languages || !record.languages.toLowerCase().includes(languageFilter.toLowerCase()))) return false;

    // Qualification filters
    if (qualification1Filter || qualification2Filter) {
      const qualifications = record.qualifications?.toLowerCase() || '';
      if (qualification1Filter && !qualifications.includes(qualification1Filter.toLowerCase())) return false;
      if (qualification2Filter && !qualifications.includes(qualification2Filter.toLowerCase())) return false;
    }

    return true;
  });

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (departmentFilter) params.append("department", departmentFilter);
      if (nameFilter) params.append("name", nameFilter);
      if (surnameFilter) params.append("surname", surnameFilter);
      if (idPassportFilter) params.append("idPassport", idPassportFilter);
      if (roleFilter) params.append("role", roleFilter);
      if (roleTitleFilter) params.append("roleTitle", roleTitleFilter);
      if (sapLevelFilter) params.append("sapLevel", sapLevelFilter);
      if (languageFilter) params.append("language", languageFilter);
      if (qualification1Filter) params.append("qualification1", qualification1Filter);
      if (qualification2Filter) params.append("qualification2", qualification2Filter);
      
      const response = await fetch(`/api/cv-records/export/csv?${params}`);
      if (!response.ok) throw new Error("Failed to export CV records");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv_records.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDepartmentFilter("");
    setNameFilter("");
    setSurnameFilter("");
    setIdPassportFilter("");
    setLanguageFilter("");
    setRoleFilter("");
    setRoleTitleFilter("");
    setSapLevelFilter("");
    setQualificationType1Filter("");
    setQualificationType2Filter("");
    setQualification1Filter("");
    setQualification2Filter("");
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtering/Searching options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Search & Filter Records</h2>
                <p className="text-sm text-gray-600">Find and manage CV records using the filters below</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleExport}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Content */}
          <div className="p-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleClearFilters}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
                <label className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>Case sensitive search</span>
                </label>
              </div>
              <div className="text-sm text-gray-500">
                {cvRecords.length} record{cvRecords.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* First row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Select value={departmentFilter || "all"} onValueChange={(value) => setDepartmentFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="SAP">SAP</SelectItem>
                    <SelectItem value="ICT">ICT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="PROJECT MANAGEMENT">PROJECT MANAGEMENT</SelectItem>
                    <SelectItem value="SERVICE DESK">SERVICE DESK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name fields</label>
                <Input
                  type="text"
                  placeholder=""
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                <Input
                  type="text"
                  placeholder=""
                  value={surnameFilter}
                  onChange={(e) => setSurnameFilter(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID/Passport number</label>
                <Input
                  type="text"
                  placeholder=""
                  value={idPassportFilter}
                  onChange={(e) => setIdPassportFilter(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <Select value={languageFilter || "all"} onValueChange={(value) => setLanguageFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Afrikaans">Afrikaans</SelectItem>
                    <SelectItem value="isiZulu">isiZulu</SelectItem>
                    <SelectItem value="isiXhosa">isiXhosa</SelectItem>
                    <SelectItem value="Sesotho">Sesotho</SelectItem>
                    <SelectItem value="Setswana">Setswana</SelectItem>
                    <SelectItem value="Sepedi">Sepedi</SelectItem>
                    <SelectItem value="Xitsonga">Xitsonga</SelectItem>
                    <SelectItem value="SiSwati">SiSwati</SelectItem>
                    <SelectItem value="Tshivenda">Tshivenda</SelectItem>
                    <SelectItem value="isiNdebele">isiNdebele</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Basic Filters */}
            <div className="rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-3 flex items-center" style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Basic Filters</h3>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                  <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="SAP Technical Consultant">SAP Technical Consultant</SelectItem>
                      <SelectItem value="SAP Functional Consultant">SAP Functional Consultant</SelectItem>
                      <SelectItem value="Technical Support Specialist">Technical Support Specialist</SelectItem>
                      <SelectItem value="System Administrator">System Administrator</SelectItem>
                      <SelectItem value="Network Engineer">Network Engineer</SelectItem>
                      <SelectItem value="HR Specialist">HR Specialist</SelectItem>
                      <SelectItem value="Recruitment Specialist">Recruitment Specialist</SelectItem>
                      <SelectItem value="Training Coordinator">Training Coordinator</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Project Coordinator">Project Coordinator</SelectItem>
                      <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                      <SelectItem value="Help Desk Technician">Help Desk Technician</SelectItem>
                      <SelectItem value="IT Support Specialist">IT Support Specialist</SelectItem>
                      <SelectItem value="Service Desk Manager">Service Desk Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
                  <Select value={roleTitleFilter || "all"} onValueChange={(value) => setRoleTitleFilter(value === "all" ? "" : value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Role Titles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Role Titles</SelectItem>
                      <SelectItem value="Software Developer">Software Developer</SelectItem>
                      <SelectItem value="Junior Web Developer">Junior Web Developer</SelectItem>
                      <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                      <SelectItem value="SAP ABAP Developer">SAP ABAP Developer</SelectItem>
                      <SelectItem value="SAP Basis Administrator">SAP Basis Administrator</SelectItem>
                      <SelectItem value="SAP Functional Consultant - FI">SAP Functional Consultant - FI</SelectItem>
                      <SelectItem value="Senior Project Manager">Senior Project Manager</SelectItem>
                      <SelectItem value="IT Project Manager">IT Project Manager</SelectItem>
                      <SelectItem value="HR Business Partner">HR Business Partner</SelectItem>
                      <SelectItem value="Talent Acquisition Specialist">Talent Acquisition Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SAP K-Level</label>
                  <Select value={sapLevelFilter || "all"} onValueChange={(value) => setSapLevelFilter(value === "all" ? "" : value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All K-Levels</SelectItem>
                      <SelectItem value="K1">K1 (Entry Level)</SelectItem>
                      <SelectItem value="K2">K2 (Junior)</SelectItem>
                      <SelectItem value="K3">K3 (Independent)</SelectItem>
                      <SelectItem value="K4">K4 (Senior Lead)</SelectItem>
                      <SelectItem value="K5">K5 (Master Architect)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
              </div>
            </div>

            {/* Position & Experience Filters */}
            <div className="rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-3 flex items-center" style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Position & Experience</h3>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                    <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                        <SelectItem value="Civil Engineer">Civil Engineer</SelectItem>
                        <SelectItem value="Electrical Engineer">Electrical Engineer</SelectItem>
                        <SelectItem value="Registered Nurse">Registered Nurse</SelectItem>
                        <SelectItem value="Medical Doctor">Medical Doctor</SelectItem>
                        <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                        <SelectItem value="Primary School Teacher">Primary School Teacher</SelectItem>
                        <SelectItem value="Mathematics Teacher">Mathematics Teacher</SelectItem>
                        <SelectItem value="TVET Lecturer">TVET Lecturer</SelectItem>
                        <SelectItem value="Chartered Accountant (CA)">Chartered Accountant (CA)</SelectItem>
                        <SelectItem value="Financial Analyst">Financial Analyst</SelectItem>
                        <SelectItem value="Tax Practitioner">Tax Practitioner</SelectItem>
                        <SelectItem value="Attorney">Attorney</SelectItem>
                        <SelectItem value="Advocate">Advocate</SelectItem>
                        <SelectItem value="Legal Advisor">Legal Advisor</SelectItem>
                        <SelectItem value="Mining Engineer">Mining Engineer</SelectItem>
                        <SelectItem value="Geologist">Geologist</SelectItem>
                        <SelectItem value="Environmental Officer">Environmental Officer</SelectItem>
                        <SelectItem value="Agricultural Extension Officer">Agricultural Extension Officer</SelectItem>
                        <SelectItem value="Veterinarian">Veterinarian</SelectItem>
                        <SelectItem value="Food Technologist">Food Technologist</SelectItem>
                        <SelectItem value="HR Manager">HR Manager</SelectItem>
                        <SelectItem value="Training and Development Specialist">Training and Development Specialist</SelectItem>
                        <SelectItem value="Skills Development Facilitator">Skills Development Facilitator</SelectItem>
                        <SelectItem value="Digital Marketing Specialist">Digital Marketing Specialist</SelectItem>
                        <SelectItem value="Public Relations Officer">Public Relations Officer</SelectItem>
                        <SelectItem value="Content Creator">Content Creator</SelectItem>
                        <SelectItem value="Architect">Architect</SelectItem>
                        <SelectItem value="Quantity Surveyor">Quantity Surveyor</SelectItem>
                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <Select value={sapLevelFilter || "all"} onValueChange={(value) => setSapLevelFilter(value === "all" ? "" : value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (6-10 years)</SelectItem>
                        <SelectItem value="expert">Expert (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Qualifications Filters */}
            <div className="rounded-lg overflow-hidden">
              <div className="px-4 py-3 flex items-center" style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Qualifications Search</h3>
              </div>
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider">Primary Qualification</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Type</label>
                      <Select value={qualificationType1Filter || "all"} onValueChange={(value) => setQualificationType1Filter(value === "all" ? "" : value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Higher Certificates and Advanced National Vocational Certificate (NQF 5)">Higher Certificates (NQF 5)</SelectItem>
                          <SelectItem value="National Diploma and Advanced Certificate (NQF 6)">National Diploma (NQF 6)</SelectItem>
                          <SelectItem value="Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7)">Bachelor's Degree (NQF 7)</SelectItem>
                          <SelectItem value="Honours Degrees, Post Graduate Diploma, and Professional Qualifications(NQF 8)">Honours Degree (NQF 8)</SelectItem>
                          <SelectItem value="Master (NQF 9)">Master's Degree (NQF 9)</SelectItem>
                          <SelectItem value="Doctoral degree (NQF 10)">Doctoral Degree (NQF 10)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specific Qualification</label>
                      <Select value={qualification1Filter || "all"} onValueChange={(value) => setQualification1Filter(value === "all" ? "" : value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Qualifications</SelectItem>
                          <SelectItem value="Higher Certificate in Information Technology">Higher Certificate in Information Technology</SelectItem>
                          <SelectItem value="Higher Certificate in Business Management">Higher Certificate in Business Management</SelectItem>
                          <SelectItem value="National Diploma in Electrical Engineering">National Diploma in Electrical Engineering</SelectItem>
                          <SelectItem value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</SelectItem>
                          <SelectItem value="Bachelor of Commerce in Accounting">Bachelor of Commerce in Accounting</SelectItem>
                          <SelectItem value="Honours Degree in Psychology">Honours Degree in Psychology</SelectItem>
                          <SelectItem value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</SelectItem>
                          <SelectItem value="Doctor of Philosophy in Engineering">Doctor of Philosophy in Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider">Secondary Qualification</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Type</label>
                      <Select value={qualificationType2Filter || "all"} onValueChange={(value) => setQualificationType2Filter(value === "all" ? "" : value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Higher Certificates and Advanced National Vocational Certificate (NQF 5)">Higher Certificates (NQF 5)</SelectItem>
                          <SelectItem value="National Diploma and Advanced Certificate (NQF 6)">National Diploma (NQF 6)</SelectItem>
                          <SelectItem value="Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7)">Bachelor's Degree (NQF 7)</SelectItem>
                          <SelectItem value="Honours Degrees, Post Graduate Diploma, and Professional Qualifications(NQF 8)">Honours Degree (NQF 8)</SelectItem>
                          <SelectItem value="Master (NQF 9)">Master's Degree (NQF 9)</SelectItem>
                          <SelectItem value="Doctoral degree (NQF 10)">Doctoral Degree (NQF 10)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specific Qualification</label>
                      <Select value={qualification2Filter || "all"} onValueChange={(value) => setQualification2Filter(value === "all" ? "" : value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Qualifications</SelectItem>
                          <SelectItem value="Higher Certificate in Information Technology">Higher Certificate in Information Technology</SelectItem>
                          <SelectItem value="Higher Certificate in Business Management">Higher Certificate in Business Management</SelectItem>
                          <SelectItem value="National Diploma in Electrical Engineering">National Diploma in Electrical Engineering</SelectItem>
                          <SelectItem value="Bachelor of Science in Computer Science">Bachelor of Science in Computer Science</SelectItem>
                          <SelectItem value="Bachelor of Commerce in Accounting">Bachelor of Commerce in Accounting</SelectItem>
                          <SelectItem value="Honours Degree in Psychology">Honours Degree in Psychology</SelectItem>
                          <SelectItem value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</SelectItem>
                          <SelectItem value="Doctor of Philosophy in Engineering">Doctor of Philosophy in Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CVTable 
          records={cvRecords} 
          isLoading={isLoading} 
          onRefetch={refetch}
        />
      </main>
    </div>
  );
}
