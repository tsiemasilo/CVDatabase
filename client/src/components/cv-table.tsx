import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CVRecord } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [viewingRecord, setViewingRecord] = useState<CVRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<CVRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    position: "",
    roleTitle: "",
    department: "",
    qualifications: "",
    experience: "",
    sapKLevel: "",
    status: "active" as const
  });
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

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<CVRecord> }) => {
      const response = await apiRequest("PUT", `/api/cv-records/${data.id}`, data.updates);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-records"] });
      setEditingRecord(null);
      toast({ title: "CV record updated successfully" });
      onRefetch();
    },
    onError: () => {
      toast({ title: "Failed to update CV record", variant: "destructive" });
    }
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const handleSort = (key: keyof CVRecord) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleView = (record: CVRecord) => {
    setViewingRecord(record);
  };

  const handleEdit = (record: CVRecord) => {
    setEditingRecord(record);
    setEditFormData({
      name: record.name,
      surname: record.surname || "",
      email: record.email,
      phone: record.phone || "",
      position: record.position || "",
      roleTitle: record.roleTitle || "",
      department: record.department || "",
      qualifications: record.qualifications || "",
      experience: record.experience?.toString() || "",
      sapKLevel: record.sapKLevel || "",
      status: record.status
    });
  };

  const handleUpdate = () => {
    if (editingRecord) {
      updateMutation.mutate({
        id: editingRecord.id,
        updates: {
          ...editFormData,
          experience: editFormData.experience ? parseInt(editFormData.experience) : 0
        }
      });
    }
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
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Records</h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: '#4A5568' }}>
              <TableHead className="text-white font-medium py-3 px-4 text-left">Surname</TableHead>
              <TableHead className="text-white font-medium py-3 px-4 text-left">First name</TableHead>
              <TableHead className="text-white font-medium py-3 px-4 text-left">Years experience</TableHead>
              <TableHead className="text-white font-medium py-3 px-4 text-left">Contact number</TableHead>
              <TableHead className="text-white font-medium py-3 px-4 text-left">E-mail</TableHead>
              <TableHead className="text-white font-medium py-3 px-4 text-left">Qualifications</TableHead>
              <TableHead className="text-white font-medium py-3 px-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record, index) => (
              <TableRow key={record.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="py-3 px-4 text-sm text-gray-900">
                  {record.surname || 'N/A'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm text-gray-900">
                  {record.name}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm text-gray-900">
                  {record.experience || 0}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm text-gray-900">
                  {record.phone || 'N/A'}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm text-gray-900">
                  {record.email}
                </TableCell>
                <TableCell className="py-3 px-4 text-sm text-gray-900 max-w-md">
                  <div className="flex items-center space-x-2">
                    <div className="truncate" title={record.qualifications || 'No qualifications listed'}>
                      {record.qualifications || 'No qualifications listed'}
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleView(record)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(record)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-600 hover:text-red-600 p-1"
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
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedRecords.length)} of {sortedRecords.length} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      <Dialog open={!!viewingRecord} onOpenChange={() => setViewingRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>CV Record Details</DialogTitle>
          </DialogHeader>
          {viewingRecord && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{viewingRecord.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Surname</label>
                <p className="text-sm text-gray-900">{viewingRecord.surname || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{viewingRecord.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{viewingRecord.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <p className="text-sm text-gray-900">{viewingRecord.department || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-sm text-gray-900">{viewingRecord.position || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role Title</label>
                <p className="text-sm text-gray-900">{viewingRecord.roleTitle || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">SAP K-Level</label>
                <p className="text-sm text-gray-900">{viewingRecord.sapKLevel || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Experience</label>
                <p className="text-sm text-gray-900">{viewingRecord.experience || 0} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Languages</label>
                <p className="text-sm text-gray-900">{viewingRecord.languages || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">Qualifications</label>
                <p className="text-sm text-gray-900">{viewingRecord.qualifications || 'No qualifications listed'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Badge className={`${getStatusColor(viewingRecord.status)} border-0`}>
                  {viewingRecord.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Submitted</label>
                <p className="text-sm text-gray-900">{new Date(viewingRecord.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Record Modal */}
      <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit CV Record</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Surname</label>
              <Input
                value={editFormData.surname}
                onChange={(e) => setEditFormData(prev => ({ ...prev, surname: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={editFormData.phone}
                onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Department</label>
              <Select value={editFormData.department} onValueChange={(value) => setEditFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAP">SAP</SelectItem>
                  <SelectItem value="ICT">ICT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="PROJECT MANAGEMENT">PROJECT MANAGEMENT</SelectItem>
                  <SelectItem value="SERVICE DESK">SERVICE DESK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <Input
                value={editFormData.position}
                onChange={(e) => setEditFormData(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role Title</label>
              <Input
                value={editFormData.roleTitle}
                onChange={(e) => setEditFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">SAP K-Level</label>
              <Select value={editFormData.sapKLevel} onValueChange={(value) => setEditFormData(prev => ({ ...prev, sapKLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select K-Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="K1">K1 (Entry Level)</SelectItem>
                  <SelectItem value="K2">K2 (Junior)</SelectItem>
                  <SelectItem value="K3">K3 (Independent)</SelectItem>
                  <SelectItem value="K4">K4 (Senior Lead)</SelectItem>
                  <SelectItem value="K5">K5 (Master Architect)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Experience (years)</label>
              <Input
                type="number"
                value={editFormData.experience}
                onChange={(e) => setEditFormData(prev => ({ ...prev, experience: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={editFormData.status} onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value as "active" | "pending" | "archived" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Qualifications</label>
              <Textarea
                value={editFormData.qualifications}
                onChange={(e) => setEditFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setEditingRecord(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Record"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}