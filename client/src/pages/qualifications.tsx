import { useState, useEffect } from "react";
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
      type: "Higher Certificates and Advanced National Vocational Certificate (NQF 5)",
      name: "Higher Certificate",
      description: "Post-secondary certificate qualification"
    },
    {
      id: 2,
      type: "National Diploma and Advanced Certificate (NQF 6)",
      name: "National Diploma",
      description: "Vocational diploma qualification"
    },
    {
      id: 3,
      type: "Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7)",
      name: "Bachelor's Degree",
      description: "Undergraduate degree qualification"
    },
    {
      id: 4,
      type: "Honours Degrees, Post Graduate Diploma, and Professional Qualifications(NQF 8)",
      name: "Honours Degree",
      description: "Postgraduate honours qualification"
    },
    {
      id: 5,
      type: "Master (NQF 9)",
      name: "Master's Degree",
      description: "Advanced postgraduate qualification"
    },
    {
      id: 6,
      type: "Doctoral degree (NQF 10)",
      name: "Doctoral Degree",
      description: "Highest level academic qualification"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
  
  // Qualification Names state
  const [qualificationNames, setQualificationNames] = useState<QualificationName[]>([
    {
      id: 1,
      qualificationType: "Higher Certificates and Advanced National Vocational Certificate (NQF 5)",
      qualificationName: "Higher Certificate in Information Technology",
      description: "Foundation IT qualification covering computer fundamentals, basic programming, networking concepts, and digital literacy skills."
    },
    {
      id: 2,
      qualificationType: "Higher Certificates and Advanced National Vocational Certificate (NQF 5)",
      qualificationName: "Higher Certificate in Business Management",
      description: "Entry-level business qualification focusing on management principles, communication skills, and basic financial management."
    },
    {
      id: 3,
      qualificationType: "National Diploma and Advanced Certificate (NQF 6)",
      qualificationName: "National Diploma in Electrical Engineering",
      description: "Technical qualification combining theoretical knowledge with practical skills in electrical systems, circuits, and power distribution."
    },
    {
      id: 4,
      qualificationType: "Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7)",
      qualificationName: "Bachelor of Science in Computer Science",
      description: "Comprehensive undergraduate degree covering programming, algorithms, software engineering, database systems, and computer networks."
    },
    {
      id: 5,
      qualificationType: "Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7)",
      qualificationName: "Bachelor of Commerce in Accounting",
      description: "Business degree specializing in financial accounting, auditing, taxation, management accounting, and business law."
    },
    {
      id: 6,
      qualificationType: "Honours Degrees, Post Graduate Diploma, and Professional Qualifications(NQF 8)",
      qualificationName: "Honours Degree in Psychology",
      description: "Advanced undergraduate degree with specialized focus on psychological research methods, cognitive psychology, and behavioral analysis."
    },
    {
      id: 7,
      qualificationType: "Master (NQF 9)",
      qualificationName: "Master of Business Administration (MBA)",
      description: "Advanced business degree emphasizing strategic leadership, financial management, operations, and organizational development."
    },
    {
      id: 8,
      qualificationType: "Doctoral degree (NQF 10)",
      qualificationName: "Doctor of Philosophy in Engineering",
      description: "Research-intensive doctoral program requiring original dissertation contributing significant new knowledge to engineering science."
    }
  ]);
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newQualificationName, setNewQualificationName] = useState({
    qualificationType: "",
    qualificationName: "",
    description: ""
  });
  
  // Filter state for qualification names
  const [selectedQualificationTypeFilter, setSelectedQualificationTypeFilter] = useState<string>("all");
  const [filteredQualificationNames, setFilteredQualificationNames] = useState<QualificationName[]>(qualificationNames);
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

  const [editingQualificationName, setEditingQualificationName] = useState<QualificationName | null>(null);
  const [editFormData, setEditFormData] = useState({
    qualificationType: "",
    qualificationName: "",
    description: ""
  });

  const handleEditQualificationName = (qualificationName: QualificationName) => {
    setEditingQualificationName(qualificationName);
    setEditFormData({
      qualificationType: qualificationName.qualificationType,
      qualificationName: qualificationName.qualificationName,
      description: qualificationName.description
    });
  };

  const handleUpdateQualificationName = () => {
    if (editingQualificationName && editFormData.qualificationType && editFormData.qualificationName) {
      setQualificationNames(qualificationNames.map(q => 
        q.id === editingQualificationName.id 
          ? { ...q, ...editFormData }
          : q
      ));
      setEditingQualificationName(null);
      setEditFormData({
        qualificationType: "",
        qualificationName: "",
        description: ""
      });
    }
  };

  const handleDeleteQualificationName = (id: number) => {
    setQualificationNames(qualificationNames.filter(q => q.id !== id));
  };

  const handleApplyQualificationFilter = () => {
    if (selectedQualificationTypeFilter === "all") {
      setFilteredQualificationNames(qualificationNames);
    } else {
      const filtered = qualificationNames.filter(qName => 
        qName.qualificationType === selectedQualificationTypeFilter
      );
      setFilteredQualificationNames(filtered);
    }
  };

  // Update filtered list when qualificationNames changes
  useEffect(() => {
    handleApplyQualificationFilter();
  }, [qualificationNames, selectedQualificationTypeFilter]);

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
            <Select value={selectedQualificationTypeFilter} onValueChange={setSelectedQualificationTypeFilter}>
              <SelectTrigger className="w-96">
                <SelectValue placeholder="Select qualification type to filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Qualification Types</SelectItem>
                {qualifications.map((qual) => (
                  <SelectItem key={qual.id} value={qual.type}>
                    {qual.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleApplyQualificationFilter}
              className="bg-blue-800 hover:bg-blue-900 text-white px-6"
            >
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
                {filteredQualificationNames.map((qualName) => (
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

        {/* Edit Qualification Name Modal */}
        <Dialog open={editingQualificationName !== null} onOpenChange={() => setEditingQualificationName(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Qualification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  • Qualification Type
                </label>
                <Select 
                  value={editFormData.qualificationType} 
                  onValueChange={(value) => setEditFormData({...editFormData, qualificationType: value})}
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
                  value={editFormData.qualificationName}
                  onChange={(e) => setEditFormData({...editFormData, qualificationName: e.target.value})}
                  placeholder="Enter qualification name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  • Description
                </label>
                <Textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  placeholder="Enter description"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingQualificationName(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateQualificationName}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}