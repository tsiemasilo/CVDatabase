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
import CVTemplateModal from "./cv-template-modal";

interface CVTableProps {
  records: CVRecord[];
  isLoading: boolean;
  onRefetch: () => void;
}

const ITEMS_PER_PAGE = 10;

// Phone number formatting function
const formatPhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // South African phone number formatting
  if (cleaned.length === 10) {
    // Format as: 083 123 4567
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('27')) {
    // Format international: +27 83 123 4567
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 9) {
    // Format as: 83 123 4567 (missing leading 0)
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  
  // Return original if can't format
  return phone;
};

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];
    return colors[index % colors.length];
  };



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

  const generateCVHTML = (record: CVRecord) => {
    console.log("Generating CV for record:", record);
    console.log("Role data:", {
      position: record.position,
      roleTitle: record.roleTitle,
      department: record.department,
      sapKLevel: record.sapKLevel
    });
    const languages = record.languages ? record.languages.split(',').map(l => l.trim()).filter(Boolean) : [];
    const workExperiences = record.workExperience ? record.workExperience.split(';').map(exp => {
      const parts = exp.split('|');
      return {
        company: parts[0]?.trim() || '',
        position: parts[1]?.trim() || '',
        duration: parts[2]?.trim() || '',
        description: parts[3]?.trim() || ''
      };
    }).filter(exp => exp.company || exp.position) : [];

    const otherQualifications = record.qualifications ? record.qualifications.split(',').map(q => q.trim()).filter(Boolean) : [];

    // Build experience table rows
    const experienceRows = workExperiences.length > 0 
      ? workExperiences.map(exp => 
          '<tr class="hover:bg-blue-50">' +
          '<td class="border border-blue-300 px-4 py-2">' + (exp.position || '') + '</td>' +
          '<td class="border border-blue-300 px-4 py-2">' + (exp.company || '') + '</td>' +
          '<td class="border border-blue-300 px-4 py-2">' + (exp.duration || '') + '</td>' +
          '</tr>'
        ).join('')
      : '<tr><td class="border border-blue-300 px-4 py-2" colspan="3">No work experience recorded</td></tr>';

    // Build qualification table rows
    const qualificationRows = otherQualifications.length > 0
      ? otherQualifications.map(qual =>
          '<tr class="hover:bg-blue-50">' +
          '<td class="border border-blue-300 px-4 py-2">' + qual + '</td>' +
          '<td class="border border-blue-300 px-4 py-2">-</td>' +
          '<td class="border border-blue-300 px-4 py-2">-</td>' +
          '</tr>'
        ).join('')
      : '<tr><td class="border border-blue-300 px-4 py-2" colspan="3">No qualifications recorded</td></tr>';

    // Build experience details section
    const experienceDetails = workExperiences.length > 0
      ? '<div class="mb-8">' +
        '<h2 class="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Experience Details</h2>' +
        workExperiences.map(exp =>
          '<div class="mb-6">' +
          '<h3 class="text-lg font-bold text-gray-900 mb-2">' + (exp.company || 'Company') + '</h3>' +
          '<p class="text-md font-semibold text-blue-700 mb-1">' + (exp.position || 'Position') + '</p>' +
          '<p class="text-sm text-gray-600 mb-2">' + (exp.duration || 'Duration not specified') + '</p>' +
          (exp.description ? '<p class="text-gray-700">' + exp.description + '</p>' : '') +
          '</div>'
        ).join('') +
        '</div>'
      : '';

    // Build skills section
    const skillsSection = languages.length > 0
      ? '<div class="mb-8">' +
        '<h2 class="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Skills</h2>' +
        '<p class="text-gray-700">' +
        '<span class="font-semibold text-blue-700">Languages:</span> ' + languages.join(', ') +
        (record.sapKLevel ? '. <span class="font-semibold text-blue-700">SAP Knowledge Level:</span> ' + record.sapKLevel : '') +
        '</p>' +
        '</div>'
      : '';

    // Build professional summary
    const professionalSummary = record.qualifications
      ? '<div class="mb-8">' +
        '<p class="text-gray-700 leading-relaxed text-justify">' +
        'A highly motivated professional with experience in ' + (record.department || 'various areas') + ', ' +
        'demonstrating strong skills in ' + (record.position || 'their field') + '. ' +
        (record.experience ? 'With ' + record.experience + ' years of experience, ' : '') +
        'committed to delivering high-quality solutions and contributing to organizational success.' +
        (record.sapKLevel ? ' Certified at SAP ' + record.sapKLevel + ' level.' : '') +
        '</p>' +
        '</div>'
      : '';

    return (
      '<!-- Header with Alteram Logo and Branding -->' +
      '<div class="bg-gradient-to-r from-orange-300 to-orange-400 px-8 py-4">' +
        '<div class="flex items-center justify-between">' +
          '<div class="flex items-center space-x-4">' +
            '<div class="h-16 w-32 bg-white bg-opacity-20 rounded flex items-center justify-center">' +
              '<span class="text-white font-bold text-lg">ALTERAM</span>' +
            '</div>' +
          '</div>' +
          '<div class="text-right text-white">' +
            '<div class="text-sm font-medium">' +
              '<p>1144, 16th Road Randjespark Midrand</p>' +
              '<p>Postnet Suite 551, Private Bag X1, Melrose Arch, 2076</p>' +
            '</div>' +
            '<div class="text-sm mt-1">' +
              '<span class="font-semibold">T</span> 010 900 4075 | <span class="font-semibold">F</span> 086 665 2021 | info@alteram.co.za' +
            '</div>' +
            '<p class="text-sm font-medium mt-1">www.alteram.co.za</p>' +
          '</div>' +
        '</div>' +
        '<div class="mt-2 border-t border-orange-200 pt-2">' +
          '<p class="text-sm text-white font-medium">' +
            'Alteram Solutions (Pty) Ltd | Reg Number 2013/171329/07' +
          '</p>' +
        '</div>' +
      '</div>' +

      '<!-- CV Content -->' +
      '<div class="p-8">' +
        '<!-- Role -->' +
        '<div class="mb-4">' +
          '<p class="text-lg font-medium text-gray-800">' +
            '<span class="font-bold text-blue-700">Role:</span> ' + (record.position || record.roleTitle || '') +
            (record.department ? ' | <span class="font-bold text-blue-700">Department:</span> ' + record.department : '') +
            (record.roleTitle ? ' | <span class="font-bold text-blue-700">Role Title:</span> ' + record.roleTitle : '') +
            (record.sapKLevel && record.sapKLevel.trim() !== '' ? ' | <span class="font-bold text-blue-700">K-Level:</span> ' + record.sapKLevel : '') +
          '</p>' +
          '<!-- DEBUG INFO -->' +
          '<div class="text-sm text-gray-500 mt-2">' +
            'DEBUG - Department: "' + (record.department || 'empty') + '", ' +
            'Role Title: "' + (record.roleTitle || 'empty') + '", ' +
            'K-Level: "' + (record.sapKLevel || 'empty') + '"' +
          '</div>' +
        '</div>' +

        '<!-- Name and ID Section -->' +
        '<div class="space-y-2 mb-6">' +
          '<p class="text-lg">' +
            '<span class="font-bold text-blue-700">Name and Surname:</span> ' + record.name + ' ' + (record.surname || '') +
          '</p>' +
          '<p class="text-lg">' +
            '<span class="font-bold text-blue-700">Id/Passport:</span> ' + (record.idPassport || '') +
          '</p>' +
        '</div>' +

        '<!-- Experience Table -->' +
        '<div class="mb-8">' +
          '<h2 class="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Experience</h2>' +
          '<table class="w-full border-collapse border border-blue-300">' +
            '<thead>' +
              '<tr class="bg-gradient-to-r from-blue-600 to-blue-700">' +
                '<th class="border border-blue-300 px-4 py-3 text-left font-bold text-white">Position</th>' +
                '<th class="border border-blue-300 px-4 py-3 text-left font-bold text-white">Company</th>' +
                '<th class="border border-blue-300 px-4 py-3 text-left font-bold text-white">Duration</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              experienceRows +
            '</tbody>' +
          '</table>' +
        '</div>' +

        '<!-- Qualification Table -->' +
        '<div class="mb-8">' +
          '<h2 class="text-xl font-bold text-blue-700 mb-4 border-b-2 border-orange-400 pb-2">Qualification</h2>' +
          '<table class="w-full border-collapse border border-blue-300">' +
            '<thead>' +
              '<tr class="bg-gradient-to-r from-blue-600 to-blue-700">' +
                '<th class="border border-blue-300 px-4 py-3 text-left font-bold text-white">Qualifications</th>' +
                '<th class="border border-blue-300 px-4 py-3 text-left font-bold text-white">Institution</th>' +
                '<th class="border border-blue-300 px-4 py-3 text-left font-bold text-white">Year Completed</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              qualificationRows +
            '</tbody>' +
          '</table>' +
        '</div>' +

        professionalSummary +
        skillsSection +
        experienceDetails +

        '<!-- Footer -->' +
        '<div class="text-center pt-6 border-t-4 border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">' +
          '<div class="flex items-center justify-center space-x-4">' +
            '<div class="h-8 w-16 bg-orange-200 rounded flex items-center justify-center">' +
              '<span class="text-orange-600 font-bold text-xs">ALTERAM</span>' +
            '</div>' +
            '<div class="text-center">' +
              '<p class="text-sm font-semibold text-orange-600">' +
                'CV Generated by Alteram Solutions' +
              '</p>' +
              '<p class="text-xs text-gray-600 mt-1">' +
                'Philip Henry Arnold | Garth Solomon Madella' +
              '</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
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
                Name
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('department')}
              >
                Department
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('position')}
              >
                Role
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('roleTitle')}
              >
                Role Title
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('status')}
              >
                Status
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white font-medium py-4 px-6"
                onClick={() => handleSort('experience')}
              >
                Experience
              </TableHead>
              <TableHead className="text-white font-medium py-4 px-6">
                SAP K-Level
              </TableHead>
              <TableHead className="text-white font-medium py-4 px-6 min-w-[160px]">
                Phone Number
              </TableHead>
              <TableHead className="text-white font-medium py-4 px-6">
                Languages
              </TableHead>
              <TableHead className="text-white font-medium py-4 px-6 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record, index) => (
              <TableRow key={record.id} className="hover:bg-gray-50">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${getRandomColor(index)} flex items-center justify-center text-white text-sm font-medium`}>
                      {getInitials(record.name)}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {record.name.split(' ')[0] || record.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.surname || 'N/A'}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.department || 'N/A'}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.position || 'N/A'}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.roleTitle || 'N/A'}</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <Select 
                    value={record.status} 
                    onValueChange={(value) => updateMutation.mutate({ 
                      id: record.id, 
                      updates: { status: value as "active" | "pending" | "archived" } 
                    })}
                  >
                    <SelectTrigger className={`w-24 h-6 text-xs border-0 ${getStatusColor(record.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="archived">Archive</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.experience || 0} years</div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="text-sm text-gray-900">{record.sapKLevel || 'N/A'}</div>
                </TableCell>
                <TableCell className="py-4 px-6 min-w-[160px]">
                  <div className="text-sm text-gray-900 font-mono whitespace-nowrap">
                    {record.phone ? formatPhoneNumber(record.phone) : 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 max-w-xs">
                  <div className="text-sm text-gray-900 truncate" title={record.languages || 'No languages listed'}>
                    {record.languages || 'No languages listed'}
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
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedRecords.length)} of {sortedRecords.length} records
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

      {/* CV Template Modal */}
      <CVTemplateModal 
        record={viewingRecord} 
        onClose={() => setViewingRecord(null)} 
      />

      {/* Edit Record Modal */}
      <Dialog open={editingRecord !== null} onOpenChange={() => setEditingRecord(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit CV Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <Input
                  value={editFormData.position}
                  onChange={(e) => setEditFormData({...editFormData, position: e.target.value})}
                  placeholder="Enter position applied for"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Input
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                  placeholder="Enter department"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <Input
                  type="number"
                  value={editFormData.experience}
                  onChange={(e) => setEditFormData({...editFormData, experience: e.target.value})}
                  placeholder="Enter years of experience"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select value={editFormData.status} onValueChange={(value) => setEditFormData({...editFormData, status: value as any})}>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              <Textarea
                value={editFormData.qualifications}
                onChange={(e) => setEditFormData({...editFormData, qualifications: e.target.value})}
                placeholder="Enter qualifications"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingRecord(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}