import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CVRecord } from "@shared/schema";

import CVTable from "@/components/cv-table";
import AddCVModal from "@/components/add-cv-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, X, ShieldAlert } from "lucide-react";
import { DEPARTMENTS, DISCIPLINES, DOMAINS, CATEGORIES, ROLES, LANGUAGES, QUALIFICATION_TYPES, QUALIFICATION_MAPPINGS, NQF_LEVELS, SAP_K_LEVELS } from "@shared/data";
import { useAppContext } from "@/contexts/AppContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";

export default function CVDatabase() {
  const { setActiveTab } = useAppContext();
  const { permissions } = useRoleAccess();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Additional filter states - moved before permission check to avoid hook order issues
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
  const [experienceFilter, setExperienceFilter] = useState("");

  // Get roles filtered by department
  const getFilteredRoles = () => {
    if (!departmentFilter) return ROLES;
    
    // Get categories that belong to the selected department
    const departmentData = DEPARTMENTS.find(dept => dept.name === departmentFilter);
    if (!departmentData) return [];

    // Get disciplines for this department
    const departmentDisciplines = DISCIPLINES.filter(disc => disc.departmentId === departmentData.id);
    
    // Get domains for these disciplines
    const disciplineIds = departmentDisciplines.map(disc => disc.id);
    const departmentDomains = DOMAINS.filter(domain => disciplineIds.includes(domain.disciplineId));
    
    // Get categories for these domains
    const domainIds = departmentDomains.map(domain => domain.id);
    const departmentCategories = CATEGORIES.filter(cat => domainIds.includes(cat.domainId));
    
    // Get roles for these categories
    const categoryIds = departmentCategories.map(cat => cat.id);
    const departmentRoles = ROLES.filter(role => categoryIds.includes(role.categoryId));
    
    return departmentRoles;
  };

  // Get K-levels filtered by department
  const getFilteredKLevels = () => {
    if (departmentFilter === "SAP") {
      return SAP_K_LEVELS; // Returns ["K1", "K2", "K3", "K4", "K5"]
    }
    return []; // Only SAP has K-levels
  };

  const { data: allCVRecords = [], isLoading, refetch } = useQuery<CVRecord[]>({
    queryKey: ["/api/cv-records"],
    queryFn: async () => {
      const response = await fetch(`/api/cv-records`);
      if (!response.ok) throw new Error("Failed to fetch CV records");
      return response.json();
    },
  });

  // Check if user has permission to view CVs - after all hooks are called
  if (!permissions.canViewAllCVs) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view CV records.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Apply all filters to the data
  const cvRecords = allCVRecords.filter(record => {
    // Show all records when only "All Status" is selected or no filters applied
    const hasSpecificFilters = searchTerm || departmentFilter || nameFilter || surnameFilter || 
                      idPassportFilter || languageFilter || roleFilter || roleTitleFilter || sapLevelFilter ||
                      qualificationType1Filter || qualificationType2Filter || qualification1Filter || qualification2Filter ||
                      experienceFilter;
    
    // If no specific filters are applied (including when "All Status" is selected), show all records
    if (!hasSpecificFilters && !statusFilter) {
      return true; // Show all records
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

    // Experience filter
    if (experienceFilter && record.experience !== parseInt(experienceFilter)) return false;

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
        qualification2: qualification2Filter || "",
        experience: experienceFilter || ""
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
    setExperienceFilter("");
  };

  // Handle department change - reset role and K-level filters
  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value === "all" ? "" : value);
    setRoleFilter(""); // Reset role filter when department changes
    setSapLevelFilter(""); // Reset K-level filter when department changes
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
                  <Select value={departmentFilter || "all"} onValueChange={handleDepartmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                      ))}
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
                      {getFilteredRoles().map((role) => (
                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* K-Level Filter - Only show when SAP is selected */}
                {departmentFilter === "SAP" && (
                  <div className="w-40">
                    <Select value={sapLevelFilter || "all"} onValueChange={(value) => setSapLevelFilter(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All K-Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All K-Levels</SelectItem>
                        {getFilteredKLevels().map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Experience Years Filter */}
                <div className="w-48">
                  <Select value={experienceFilter || "all"} onValueChange={(value) => setExperienceFilter(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Experience</SelectItem>
                      <SelectItem value="0">0 years</SelectItem>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="2">2 years</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="4">4 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="6">6 years</SelectItem>
                      <SelectItem value="7">7 years</SelectItem>
                      <SelectItem value="8">8 years</SelectItem>
                      <SelectItem value="9">9 years</SelectItem>
                      <SelectItem value="10">10+ years</SelectItem>
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