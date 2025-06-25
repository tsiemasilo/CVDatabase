import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CVRecord } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CVTableProps {
  records: CVRecord[];
  isLoading: boolean;
  onRefetch: () => void;
}

const ITEMS_PER_PAGE = 10;

export default function CVTable({ records, isLoading, onRefetch }: CVTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CVRecord; direction: 'asc' | 'desc' }>({ key: 'submittedAt', direction: 'desc' });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/cv-records/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-records"] });
      toast({ title: "CV record deleted successfully" });
      onRefetch();
    },
    onError: () => {
      toast({ title: "Failed to delete CV record", variant: "destructive" });
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-primary-500', 'bg-purple-500', 'bg-indigo-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleSort = (key: keyof CVRecord) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleView = (record: CVRecord) => {
    // TODO: Implement view functionality
    console.log("View CV:", record);
  };

  const handleEdit = (record: CVRecord) => {
    // TODO: Implement edit functionality
    console.log("Edit CV:", record);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">Records</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-slate-600" style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('name')}
              >
                Surname
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('name')}
              >
                First name
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('experience')}
              >
                Years experience
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('phone')}
              >
                Contact number
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('email')}
              >
                E-mail
              </TableHead>
              <TableHead 
                className="text-white font-medium py-4 px-6"
              >
                Qualifications
              </TableHead>
              <TableHead className="text-white font-medium py-4 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id} className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100">
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.name.split(' ').slice(-1)[0]}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.name.split(' ').slice(0, -1).join(' ')}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.experience || 0}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.phone || 'N/A'}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.email}</div>
                </TableCell>
                <TableCell className="py-4 px-6 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-900 truncate flex-1" title={record.qualifications || 'No qualifications listed'}>
                      {record.qualifications || 'No qualifications listed'}
                    </div>
                    {record.cvFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/api/cv-records/${record.id}/download`, '_blank')}
                        className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                        title="Download CV"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleView(record)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(record)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the CV record for {record.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(record.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedRecords.length)} of {sortedRecords.length} results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn-icon"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-primary-500 text-white" : ""}
                >
                  {page}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <Button
                  variant={currentPage === totalPages ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className={currentPage === totalPages ? "bg-primary-500 text-white" : ""}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn-icon"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
