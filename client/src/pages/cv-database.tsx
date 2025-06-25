import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CVRecord } from "@shared/schema";
import Header from "@/components/header";
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
  
  // Additional filter states
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [surnameFilter, setSurnameFilter] = useState("");
  const [idPassportFilter, setIdPassportFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sapLevelFilter, setSapLevelFilter] = useState("");
  const [qualificationType1Filter, setQualificationType1Filter] = useState("");
  const [qualificationType2Filter, setQualificationType2Filter] = useState("");
  const [qualification1Filter, setQualification1Filter] = useState("");
  const [qualification2Filter, setQualification2Filter] = useState("");

  const { data: cvRecords = [], isLoading, refetch } = useQuery<CVRecord[]>({
    queryKey: ["/api/cv-records", { search: searchTerm, status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      
      const response = await fetch(`/api/cv-records?${params}`);
      if (!response.ok) throw new Error("Failed to fetch CV records");
      return response.json();
    },
  });

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      
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
    setSapLevelFilter("");
    setQualificationType1Filter("");
    setQualificationType2Filter("");
    setQualification1Filter("");
    setQualification2Filter("");
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Landing page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Landing page</h1>
        </div>

        {/* Filtering/Searching options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Filtering/Searching options</h2>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-4 mb-6">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary btn-icon"
              >
                <Plus className="w-4 h-4" />
                Add New CV
              </Button>
              <Button 
                onClick={handleExport}
                className="btn-success btn-icon"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                onClick={handleClearFilters}
                variant="outline"
                className="btn-icon"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" />
                <span>Case sensitive search</span>
              </label>
            </div>

            {/* First row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Select value={departmentFilter || "all"} onValueChange={(value) => setDepartmentFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">---</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
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
                    <SelectValue placeholder="---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">---</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="afrikaans">Afrikaans</SelectItem>
                    <SelectItem value="zulu">Zulu</SelectItem>
                    <SelectItem value="xhosa">Xhosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">---</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SAP & Level</label>
                <Select value={sapLevelFilter || "all"} onValueChange={(value) => setSapLevelFilter(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">---</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Third row - Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Type 1</label>
                  <Select value={qualificationType1Filter || "all"} onValueChange={(value) => setQualificationType1Filter(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">---</SelectItem>
                      <SelectItem value="degree">Degree</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification 1</label>
                  <Select value={qualification1Filter || "all"} onValueChange={(value) => setQualification1Filter(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">---</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Type 2</label>
                  <Select value={qualificationType2Filter || "all"} onValueChange={(value) => setQualificationType2Filter(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">---</SelectItem>
                      <SelectItem value="degree">Degree</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification 2</label>
                  <Select value={qualification2Filter || "all"} onValueChange={(value) => setQualification2Filter(value === "all" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">---</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
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
      </main>

      <AddCVModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
