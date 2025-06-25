import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Qualification {
  id: number;
  type: string;
  name: string;
  description: string;
}

interface QualificationName {
  id: number;
  qualificationType: string;
  qualificationName: string;
  description: string;
}

export default function Qualifications() {
  const [qualifications, setQualifications] = useState<Qualification[]>([
    {
      id: 1,
      type: "Certificate Programs",
      name: "Professional Certificate",
      description: "Short-term specialized training programs typically lasting 3-12 months"
    },
    {
      id: 2,
      type: "Diploma Programs",
      name: "Associate Degree/Diploma",
      description: "Two-year post-secondary programs focusing on practical skills and technical knowledge"
    },
    {
      id: 3,
      type: "Bachelor's Degrees",
      name: "Undergraduate Degree",
      description: "Four-year university degrees providing broad knowledge and specialized skills"
    },
    {
      id: 4,
      type: "Postgraduate Qualifications",
      name: "Graduate Certificates & Diplomas",
      description: "Advanced professional qualifications and specialized postgraduate programs"
    },
    {
      id: 5,
      type: "Master's Degrees",
      name: "Graduate Degree",
      description: "Advanced academic or professional degrees typically requiring 1-2 years of study"
    },
    {
      id: 6,
      type: "Doctoral Degrees",
      name: "PhD and Professional Doctorates",
      description: "Highest level of academic achievement involving original research and dissertation"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
  
  // Qualification Names state
  const [qualificationNames, setQualificationNames] = useState<QualificationName[]>([
    {
      id: 1,
      qualificationType: "Bachelor's Degrees",
      qualificationName: "Bachelor of Science in Computer Science",
      description: "Four-year undergraduate degree covering programming, algorithms, data structures, software engineering, and computer systems fundamentals."
    },
    {
      id: 2,
      qualificationType: "Bachelor's Degrees",
      qualificationName: "Bachelor of Business Administration",
      description: "Comprehensive business degree covering management, finance, marketing, operations, and strategic planning for business leadership roles."
    },
    {
      id: 3,
      qualificationType: "Certificate Programs",
      qualificationName: "Google Project Management Certificate",
      description: "Six-month professional certificate program teaching project planning, execution, and management using industry-standard tools and methodologies."
    },
    {
      id: 4,
      qualificationType: "Diploma Programs",
      qualificationName: "Associate Degree in Nursing",
      description: "Two-year healthcare program preparing students for registered nursing practice with clinical experience and theoretical knowledge."
    },
    {
      id: 5,
      qualificationType: "Postgraduate Qualifications",
      qualificationName: "Graduate Certificate in Data Analytics",
      description: "Specialized postgraduate program focusing on statistical analysis, data visualization, and business intelligence for working professionals."
    },
    {
      id: 6,
      qualificationType: "Master's Degrees",
      qualificationName: "Master of Business Administration (MBA)",
      description: "Advanced business degree emphasizing leadership, strategy, finance, and operations management for executive-level positions."
    },
    {
      id: 7,
      qualificationType: "Doctoral Degrees",
      qualificationName: "Doctor of Philosophy in Engineering",
      description: "Research-focused doctoral program requiring original dissertation work in engineering fields with significant contribution to knowledge."
    }
  ]);
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newQualificationName, setNewQualificationName] = useState({
    qualificationType: "",
    qualificationName: "",
    description: ""
  });
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: ""
  });

  const handleAdd = () => {
    if (formData.type && formData.name && formData.description) {
      const newQualification: Qualification = {
        id: Math.max(...qualifications.map(q => q.id), 0) + 1,
        type: formData.type,
        name: formData.name,
        description: formData.description
      };
      setQualifications([...qualifications, newQualification]);
      setFormData({ type: "", name: "", description: "" });
      setIsAddModalOpen(false);
    }
  };

  const handleEdit = (qualification: Qualification) => {
    setEditingQualification(qualification);
    setFormData({
      type: qualification.type,
      name: qualification.name,
      description: qualification.description
    });
  };

  const handleUpdate = () => {
    if (editingQualification && formData.type && formData.name && formData.description) {
      setQualifications(qualifications.map(q => 
        q.id === editingQualification.id 
          ? { ...q, type: formData.type, name: formData.name, description: formData.description }
          : q
      ));
      setEditingQualification(null);
      setFormData({ type: "", name: "", description: "" });
    }
  };

  const handleDelete = (id: number) => {
    setQualifications(qualifications.filter(q => q.id !== id));
  };

  // Qualification Names handlers
  const handleAddQualificationName = () => {
    if (newQualificationName.qualificationType && newQualificationName.qualificationName) {
      const newId = Math.max(...qualificationNames.map(q => q.id), 0) + 1;
      setQualificationNames([...qualificationNames, {
        id: newId,
        ...newQualificationName
      }]);
      setNewQualificationName({
        qualificationType: "",
        qualificationName: "",
        description: ""
      });
      setAddModalOpen(false);
    }
  };

  const handleEditQualificationName = (qualificationName: QualificationName) => {
    console.log("Edit qualification name:", qualificationName);
  };

  const handleDeleteQualificationName = (id: number) => {
    setQualificationNames(qualificationNames.filter(q => q.id !== id));
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Qualifications Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary btn-icon">
                <Plus className="w-4 h-4" />
                Add Qualification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Qualification Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Qualification Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Enter qualification type"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Qualification Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter qualification name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter qualification description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd}>
                    Add Qualification
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* CV Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'rgb(0, 0, 83)' }} className="text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Qualification Type
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qualifications.map((qualification) => (
                  <tr key={qualification.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{qualification.type}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{qualification.name}</div>
                        {qualification.description && (
                          <div className="text-xs text-gray-400 mt-0.5">{qualification.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(qualification)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(qualification.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        <Dialog open={editingQualification !== null} onOpenChange={() => setEditingQualification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Qualification Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-type">Qualification Type</Label>
                <Input
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Enter qualification type"
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Qualification Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter qualification name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter qualification description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingQualification(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>
                  Update Qualification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Qualification Names Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-4">
            <Select defaultValue="Bachelor's degree, Advanced Diplomas, Post Graduate Certificates (NQF 7)">
              <SelectTrigger className="w-96">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualifications.map((qual) => (
                  <SelectItem key={qual.id} value={qual.type}>
                    {qual.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-6">
              Apply filter
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Qualifications</h2>
            <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary btn-icon">
                  <Plus className="w-4 h-4" />
                  Add qualification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Qualification details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      • Qualification Type
                    </label>
                    <Select 
                      value={newQualificationName.qualificationType} 
                      onValueChange={(value) => setNewQualificationName({...newQualificationName, qualificationType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification type" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualifications.map((qual) => (
                          <SelectItem key={qual.id} value={qual.type}>
                            {qual.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      • Qualification Name
                    </label>
                    <Input
                      value={newQualificationName.qualificationName}
                      onChange={(e) => setNewQualificationName({...newQualificationName, qualificationName: e.target.value})}
                      placeholder="Enter qualification name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      • Description
                    </label>
                    <Textarea
                      value={newQualificationName.description}
                      onChange={(e) => setNewQualificationName({...newQualificationName, description: e.target.value})}
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddQualificationName}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'rgb(0, 0, 83)' }} className="text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Qualification Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Qualification Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Qualification Description
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qualificationNames.map((qualName) => (
                  <tr key={qualName.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {qualName.qualificationType}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {qualName.qualificationName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {qualName.description}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditQualificationName(qualName)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteQualificationName(qualName.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}