import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CVRecord } from "@shared/schema";

import CVTable from "@/components/cv-table";
import AddCVModal from "@/components/add-cv-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, X } from "lucide-react";

export default function CVDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter states for the new schema fields
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roleTitleFilter, setRoleTitleFilter] = useState("");
  const [sapLevelFilter, setSapLevelFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  const { data: allCVRecords = [], isLoading, refetch } = useQuery<CVRecord[]>({
    queryKey: ["/api/cv-records"],
    queryFn: async () => {
      const response = await fetch(`/api/cv-records`);
      if (!response.ok) throw new Error("Failed to fetch CV records");
      return response.json();
    },
  });

  // Apply filters to the data
  const cvRecords = allCVRecords.filter(record => {
    // Search term filter (searches across multiple fields)
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
        (record.qualifications && record.qualifications.toLowerCase().includes(searchLower)) ||
        (record.languages && record.languages.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter && record.status !== statusFilter) return false;

    // Department filter
    if (departmentFilter && record.department !== departmentFilter) return false;

    // Role filter
    if (roleFilter && record.position !== roleFilter) return false;

    // Role title filter
    if (roleTitleFilter && record.roleTitle !== roleTitleFilter) return false;

    // SAP K-Level filter
    if (sapLevelFilter && record.sapKLevel !== sapLevelFilter) return false;

    // Language filter
    if (languageFilter && (!record.languages || !record.languages.toLowerCase().includes(languageFilter.toLowerCase()))) return false;

    return true;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDepartmentFilter("");
    setRoleFilter("");
    setRoleTitleFilter("");
    setSapLevelFilter("");
    setLanguageFilter("");
  };

  const exportToCSV = () => {
    const headers = [
      "Name", "Surname", "Email", "Phone", "Department", "Role", "Role Title", 
      "SAP K-Level", "Experience", "Languages", "Qualifications", "Status", "Submitted"
    ];
    
    const csvData = cvRecords.map(record => [
      record.name,
      record.surname || "",
      record.email,
      record.phone || "",
      record.department || "",
      record.position || "",
      record.roleTitle || "",
      record.sapKLevel || "",
      record.experience || "",
      record.languages || "",
      record.qualifications || "",
      record.status,
      new Date(record.submittedAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cv_records_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = searchTerm || statusFilter || departmentFilter || roleFilter || roleTitleFilter || sapLevelFilter || languageFilter;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CV Database</h1>
          <p className="text-gray-600 mt-1">
            {cvRecords.length} of {allCVRecords.length} records
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center space-x-2"
            style={{ backgroundColor: '#ff8c00', borderColor: '#ff8c00', color: 'white' }}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2"
            style={{ backgroundColor: 'rgb(0, 0, 83)', borderColor: 'rgb(0, 0, 83)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Add New CV</span>
          </Button>
        </div>
      </div>

      {/* Search and Basic Filters */}
      <div className="rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-3 flex items-center" style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
          <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Search & Filter</h3>
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="ml-auto text-white hover:bg-white hover:text-gray-900"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <Input
                placeholder="Search by name, email, phone, role, qualifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="bg-white">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <Select value={departmentFilter || "all"} onValueChange={(value) => setDepartmentFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="bg-white">
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
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-3 flex items-center" style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
          <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Advanced Filters</h3>
        </div>
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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
                  <SelectValue placeholder="All K-Levels" />
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <Select value={languageFilter || "all"} onValueChange={(value) => setLanguageFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Afrikaans">Afrikaans</SelectItem>
                  <SelectItem value="Zulu">Zulu</SelectItem>
                  <SelectItem value="Xhosa">Xhosa</SelectItem>
                  <SelectItem value="Sotho">Sotho</SelectItem>
                  <SelectItem value="Tswana">Tswana</SelectItem>
                  <SelectItem value="Pedi">Pedi</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                  <SelectItem value="Tsonga">Tsonga</SelectItem>
                  <SelectItem value="Swati">Swati</SelectItem>
                  <SelectItem value="Ndebele">Ndebele</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="w-full"
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CV Table */}
      <CVTable 
        records={cvRecords} 
        isLoading={isLoading} 
        onRefetch={refetch}
      />

      {/* Add CV Modal */}
      <AddCVModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}