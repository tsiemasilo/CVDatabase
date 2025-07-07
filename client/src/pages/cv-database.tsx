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
import { useAppContext } from "@/contexts/AppContext";

export default function CVDatabase() {
  const { setActiveTab } = useAppContext();
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
    // If no filters are applied, return empty results
    const hasFilters = searchTerm || statusFilter || departmentFilter || nameFilter || surnameFilter || 
                      idPassportFilter || languageFilter || roleFilter || roleTitleFilter || sapLevelFilter ||
                      qualificationType1Filter || qualificationType2Filter || qualification1Filter || qualification2Filter;
    
    if (!hasFilters) {
      return false; // Return empty results when no filters are applied
    }

    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        record.name.toLowerCase().includes(searchLower) ||
        (record.surname && record.surname.toLowerCase().includes(searchLower)) ||
        record.email.toLowerCase().includes(searchLower) ||
        (record.phone && record.phone.toLowerCase().includes(searchLower)) ||
        (record.position && record.position.toLowerCase().includes(searchLower)) ||
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
    if (surnameFilter && (!record.surname || !record.surname.toLowerCase().includes(surnameFilter.toLowerCase()))) return false;

    // ID/Passport filter
    if (idPassportFilter && (!record.idPassport || !record.idPassport.toLowerCase().includes(idPassportFilter.toLowerCase()))) return false;

    // Language filter
    if (languageFilter && (!record.languages || !record.languages.toLowerCase().includes(languageFilter.toLowerCase()))) return false;

    // Role filter
    if (roleFilter && record.position !== roleFilter) return false;

    // Role title filter
    if (roleTitleFilter && record.roleTitle !== roleTitleFilter) return false;

    // SAP K-Level filter
    if (sapLevelFilter && record.sapKLevel !== sapLevelFilter) return false;

    // Qualification type 1 filter
    if (qualificationType1Filter && (!record.qualifications || !record.qualifications.toLowerCase().includes(qualificationType1Filter.toLowerCase()))) return false;

    // Qualification type 2 filter
    if (qualificationType2Filter && (!record.qualifications || !record.qualifications.toLowerCase().includes(qualificationType2Filter.toLowerCase()))) return false;

    // Qualification 1 filter
    if (qualification1Filter && (!record.qualifications || !record.qualifications.toLowerCase().includes(qualification1Filter.toLowerCase()))) return false;

    // Qualification 2 filter
    if (qualification2Filter && (!record.qualifications || !record.qualifications.toLowerCase().includes(qualification2Filter.toLowerCase()))) return false;

    return true;
  });

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        searchTerm: searchTerm || "",
        status: statusFilter || "",
        department: departmentFilter || "",
        name: nameFilter || "",
        surname: surnameFilter || "",
        idPassport: idPassportFilter || "",
        language: languageFilter || "",
        role: roleFilter || "",
        roleTitle: roleTitleFilter || "",
        sapLevel: sapLevelFilter || "",
        qualificationType1: qualificationType1Filter || "",
        qualificationType2: qualificationType2Filter || "",
        qualification1: qualification1Filter || "",
        qualification2: qualification2Filter || ""
      });

      const response = await fetch(`/api/cv-records/export/csv?${params}`);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv-records-${new Date().toISOString().split('T')[0]}.csv`;
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
                {/* Export button removed as requested */}
              </div>
            </div>
          </div>

          {/* Filter Content */}
          <div className="p-6">
            {/* CV Database Management Table */}
            <div className="bg-white">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">CV Database Management</h3>
                  <p className="text-sm text-gray-500 mt-1">Showing {cvRecords.length} of {allCVRecords.length} records</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={() => setActiveTab("Capture record")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New CV
                  </Button>
                </div>
              </div>

              {/* Search and Filter Row */}
              <div className="flex items-center space-x-4 mb-6">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by name, email, phone, role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                {/* Status Filter */}
                <div className="w-40">
                  <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                    <SelectTrigger className="border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Filter */}
                <div className="w-48">
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

                {/* Role Filter */}
                <div className="w-48">
                  <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
                    <SelectTrigger>
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

                {/* K-Level Filter */}
                <div className="w-40">
                  <Select value={sapLevelFilter || "all"} onValueChange={(value) => setSapLevelFilter(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All K-Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All K-Levels</SelectItem>
                      <SelectItem value="K1">K1</SelectItem>
                      <SelectItem value="K2">K2</SelectItem>
                      <SelectItem value="K3">K3</SelectItem>
                      <SelectItem value="K4">K4</SelectItem>
                      <SelectItem value="K5">K5</SelectItem>
                    </SelectContent>
                  </Select>
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

        <AddCVModal 
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSuccess={() => {
            setIsAddModalOpen(false);
            refetch();
          }}
        />
      </main>
    </div>
  );
}