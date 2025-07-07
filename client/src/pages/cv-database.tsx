import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CVRecord } from "@shared/schema";

import CVTable from "@/components/cv-table";
import AddCVModal from "@/components/add-cv-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, X, Search, Filter } from "lucide-react";

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">CV Database Management</h1>
            <p className="text-gray-600">
              Showing {cvRecords.length} of {allCVRecords.length} records
              {hasActiveFilters && " (filtered)"}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="bg-orange-500 border-orange-500 text-white hover:bg-orange-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New CV
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Search */}
          <div className="lg:col-span-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, phone, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
              <SelectTrigger>
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
          <div className="lg:col-span-2">
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
          <div className="lg:col-span-2">
            <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="SAP Technical Consultant">SAP Technical Consultant</SelectItem>
                <SelectItem value="SAP Functional Consultant">SAP Functional Consultant</SelectItem>
                <SelectItem value="HR Specialist">HR Specialist</SelectItem>
                <SelectItem value="Project Manager">Project Manager</SelectItem>
                <SelectItem value="Help Desk Technician">Help Desk Technician</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SAP K-Level Filter */}
          <div className="lg:col-span-2">
            <Select value={sapLevelFilter || "all"} onValueChange={(value) => setSapLevelFilter(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="SAP K-Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All K-Levels</SelectItem>
                <SelectItem value="K1">K1 (Entry)</SelectItem>
                <SelectItem value="K2">K2 (Junior)</SelectItem>
                <SelectItem value="K3">K3 (Independent)</SelectItem>
                <SelectItem value="K4">K4 (Senior)</SelectItem>
                <SelectItem value="K5">K5 (Expert)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all filters
            </Button>
          </div>
        )}
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