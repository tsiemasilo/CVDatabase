import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface DepartmentRole {
  id: number;
  department: string;
  role: string;
  roleTitle: string;
  description: string;
  kLevel: string;
}

const getDefaultRecords = (): DepartmentRole[] => [
  // SAP Department
  { id: 1, department: "SAP", role: "SAP ABAP Developer", roleTitle: "Junior SAP ABAP Programmer", description: "Entry-level ABAP programming and development", kLevel: "K1" },
  { id: 2, department: "SAP", role: "SAP Functional Consultant", roleTitle: "SAP FI/CO Consultant", description: "Junior consultant for SAP modules implementation", kLevel: "K2" },
  { id: 3, department: "SAP", role: "SAP Technical Consultant", roleTitle: "Senior SAP Basis Administrator", description: "Independent technical implementation specialist", kLevel: "K3" },
  { id: 4, department: "SAP", role: "SAP Solution Architect", roleTitle: "SAP Enterprise Solutions Manager", description: "Senior lead for enterprise SAP solutions", kLevel: "K4" },
  { id: 5, department: "SAP", role: "SAP Master Architect", roleTitle: "Chief SAP Technology Officer", description: "Master-level SAP enterprise architect", kLevel: "K5" },
  
  // ICT Department
  { id: 6, department: "ICT", role: "IT Support Technician", roleTitle: "Junior IT Support Specialist", description: "Entry-level technical support and maintenance", kLevel: "K1" },
  { id: 7, department: "ICT", role: "Network Administrator", roleTitle: "Network Infrastructure Officer", description: "Junior network management and configuration", kLevel: "K2" },
  { id: 8, department: "ICT", role: "Systems Analyst", roleTitle: "Senior Business Systems Analyst", description: "Independent systems analysis and design", kLevel: "K3" },
  { id: 9, department: "ICT", role: "IT Infrastructure Manager", roleTitle: "ICT Operations Manager", description: "Senior lead for IT infrastructure operations", kLevel: "K4" },
  { id: 10, department: "ICT", role: "Chief Technology Officer", roleTitle: "Chief Information Officer", description: "Master-level technology strategy leadership", kLevel: "K5" },
  
  // HR Department
  { id: 11, department: "HR", role: "HR Assistant", roleTitle: "Human Resources Administrator", description: "Entry-level human resources administration", kLevel: "K1" },
  { id: 12, department: "HR", role: "Recruitment Coordinator", roleTitle: "Talent Acquisition Specialist", description: "Junior talent acquisition and recruitment", kLevel: "K2" },
  { id: 13, department: "HR", role: "HR Business Partner", roleTitle: "Senior HR Business Consultant", description: "Independent strategic HR partnership", kLevel: "K3" },
  { id: 14, department: "HR", role: "HR Director", roleTitle: "Head of Human Resources", description: "Senior lead for organizational development", kLevel: "K4" },
  { id: 15, department: "HR", role: "Chief People Officer", roleTitle: "Executive Director: People & Culture", description: "Master-level people strategy leadership", kLevel: "K5" },
  
  // DEVELOPMENT Department
  { id: 16, department: "DEVELOPMENT", role: "Junior Developer", roleTitle: "Graduate Software Developer", description: "Entry-level software development and coding", kLevel: "K1" },
  { id: 17, department: "DEVELOPMENT", role: "Software Developer", roleTitle: "Application Development Specialist", description: "Junior application development specialist", kLevel: "K2" },
  { id: 18, department: "DEVELOPMENT", role: "Senior Developer", roleTitle: "Senior Software Engineer", description: "Independent full-stack development expert", kLevel: "K3" },
  { id: 19, department: "DEVELOPMENT", role: "Development Team Lead", roleTitle: "Technical Team Leader", description: "Senior lead for development teams", kLevel: "K4" },
  { id: 20, department: "DEVELOPMENT", role: "Chief Technology Architect", roleTitle: "Chief Software Architect", description: "Master-level software architecture leadership", kLevel: "K5" },
  
  // Project Management Department
  { id: 21, department: "Project Management", role: "Project Coordinator", roleTitle: "Junior Project Administrator", description: "Entry-level project coordination and support", kLevel: "K1" },
  { id: 22, department: "Project Management", role: "Project Officer", roleTitle: "Project Management Officer", description: "Junior project execution and monitoring", kLevel: "K2" },
  { id: 23, department: "Project Management", role: "Project Manager", roleTitle: "Senior Project Manager", description: "Independent project lifecycle management", kLevel: "K3" },
  { id: 24, department: "Project Management", role: "Senior Project Manager", roleTitle: "Portfolio Manager", description: "Senior lead for complex project portfolios", kLevel: "K4" },
  { id: 25, department: "Project Management", role: "Program Director", roleTitle: "Executive Programme Director", description: "Master-level strategic program leadership", kLevel: "K5" },
  
  // Service Desk Department
  { id: 26, department: "Service Desk", role: "Service Desk Agent", roleTitle: "IT Help Desk Technician", description: "Entry-level user support and incident logging", kLevel: "K1" },
  { id: 27, department: "Service Desk", role: "Technical Support Specialist", roleTitle: "Senior Support Analyst", description: "Junior technical troubleshooting and resolution", kLevel: "K2" },
  { id: 28, department: "Service Desk", role: "Service Desk Analyst", roleTitle: "Service Delivery Analyst", description: "Independent incident and problem management", kLevel: "K3" },
  { id: 29, department: "Service Desk", role: "Service Desk Team Lead", roleTitle: "Service Desk Team Leader", description: "Senior lead for service desk operations", kLevel: "K4" },
  { id: 30, department: "Service Desk", role: "Service Desk Manager", roleTitle: "Head of Service Operations", description: "Master-level service delivery management", kLevel: "K5" }
];

export default function PositionsRoles() {
  const [records, setRecords] = useState<DepartmentRole[]>([]);

  const [newRecord, setNewRecord] = useState({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addStep, setAddStep] = useState<'department' | 'role'>('department');
  const [editingRecord, setEditingRecord] = useState<DepartmentRole | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });

  const departments = ["SAP", "ICT", "HR", "DEVELOPMENT", "Project Management", "Service Desk"];
  const kLevels = ["K1", "K2", "K3", "K4", "K5"];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('departmentRoles');
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        setRecords(parsedRecords);
      } catch (error) {
        console.error('Error parsing saved records:', error);
        setRecords(getDefaultRecords());
      }
    } else {
      setRecords(getDefaultRecords());
    }
  }, []);

  // Save data to localStorage whenever records change
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('departmentRoles', JSON.stringify(records));
    }
  }, [records]);

  const addRecord = () => {
    if (newRecord.department && newRecord.role && newRecord.roleTitle && newRecord.description && newRecord.kLevel) {
      const record: DepartmentRole = {
        id: Math.max(...records.map(r => r.id), 0) + 1,
        department: newRecord.department,
        role: newRecord.role,
        roleTitle: newRecord.roleTitle,
        description: newRecord.description,
        kLevel: newRecord.kLevel
      };
      setRecords([...records, record]);
      setNewRecord({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
      setShowAddForm(false);
      setAddStep('department');
    }
  };



  const startEdit = (record: DepartmentRole) => {
    setEditingRecord(record);
    setEditFormData({
      department: record.department,
      role: record.role,
      roleTitle: record.roleTitle,
      description: record.description,
      kLevel: record.kLevel
    });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (editingRecord && editFormData.department && editFormData.role && editFormData.roleTitle && editFormData.description && editFormData.kLevel) {
      const updatedRecords = records.map(r => 
        r.id === editingRecord.id 
          ? { ...r, department: editFormData.department, role: editFormData.role, roleTitle: editFormData.roleTitle, description: editFormData.description, kLevel: editFormData.kLevel }
          : r
      );
      setRecords(updatedRecords);
      setShowEditModal(false);
      setEditingRecord(null);
      setEditFormData({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
    }
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingRecord(null);
    setEditFormData({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
  };



  const deleteRecord = (id: number) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const handleNextStep = () => {
    if (addStep === 'department' && newRecord.department) {
      setAddStep('role');
    }
  };

  const handleBackStep = () => {
    setAddStep('department');
  };

  return (
    <div className="space-y-8 pt-8 px-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: 'rgb(0, 0, 83)' }}>
          Positions | Roles
        </h1>
      </div>

      {/* Single Table for Departments and Roles */}
      <Card>
        <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Departments & Roles with K-Levels</CardTitle>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-white text-blue-900 hover:bg-gray-100"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-4">
                {isEditing 
                  ? 'Edit Role' 
                  : addStep === 'department' 
                    ? 'Step 1: Select Department' 
                    : 'Step 2: Add Role Details'
                }
              </h3>
              
              {!isEditing && addStep === 'department' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={newRecord.department}
                      onChange={(e) => setNewRecord({ ...newRecord, department: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleNextStep} 
                      disabled={!newRecord.department}
                      style={{ backgroundColor: 'rgb(0, 0, 83)' }}
                    >
                      Next Step
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {(addStep === 'role' || isEditing) && (
                <div className="space-y-4">
                  {!isEditing && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">Selected Department: <strong>{newRecord.department}</strong></p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={newRecord.department}
                          onChange={(e) => setNewRecord({ ...newRecord, department: e.target.value })}
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                      <Input
                        placeholder="Enter role name"
                        value={newRecord.role}
                        onChange={(e) => setNewRecord({ ...newRecord, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role Title</label>
                      <Input
                        placeholder="Enter role title"
                        value={newRecord.roleTitle}
                        onChange={(e) => setNewRecord({ ...newRecord, roleTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">K-Level</label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={newRecord.kLevel}
                        onChange={(e) => setNewRecord({ ...newRecord, kLevel: e.target.value })}
                      >
                        <option value="">Select K-Level</option>
                        {kLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Input
                      placeholder="Enter role description"
                      value={newRecord.description}
                      onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={isEditing ? updateRecord : addRecord} 
                      style={{ backgroundColor: 'rgb(0, 0, 83)' }}
                    >
                      {isEditing ? 'Update Role' : 'Save Role'}
                    </Button>
                    {!isEditing && (
                      <Button variant="outline" onClick={handleBackStep}>
                        Back
                      </Button>
                    )}
                    <Button variant="outline" onClick={isEditing ? cancelEdit : () => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                  <TableHead className="font-semibold text-gray-700">Department</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">K-Level</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{record.role}</TableCell>
                    <TableCell className="text-blue-600 font-medium">{record.roleTitle}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.kLevel}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteRecord(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ color: 'rgb(0, 0, 83)' }}>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editFormData.department}
                onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
              <Input
                placeholder="Enter role name"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Title</label>
              <Input
                placeholder="Enter role title"
                value={editFormData.roleTitle}
                onChange={(e) => setEditFormData({ ...editFormData, roleTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Input
                placeholder="Enter role description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">K-Level</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editFormData.kLevel}
                onChange={(e) => setEditFormData({ ...editFormData, kLevel: e.target.value })}
              >
                <option value="">Select K-Level</option>
                {kLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={saveEdit} 
                style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={cancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}