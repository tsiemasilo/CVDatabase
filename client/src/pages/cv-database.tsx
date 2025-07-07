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
            {/* This section is empty - ready for new filter content */}
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