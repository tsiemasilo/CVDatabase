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
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
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
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search CVs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleClearFilters}
                variant="outline"
                size="sm"
                className="btn-icon"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
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
