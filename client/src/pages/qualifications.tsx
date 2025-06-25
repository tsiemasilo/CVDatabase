import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Qualification {
  id: number;
  type: string;
  name: string;
  description: string;
}

export default function Qualifications() {
  const [qualifications, setQualifications] = useState<Qualification[]>([
    {
      id: 1,
      type: "Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7)",
      name: "Bachelor's Degree",
      description: "Undergraduate degree qualification"
    },
    {
      id: 2,
      type: "Doctoral degree (NQF 10)",
      name: "Doctoral Degree",
      description: "Highest level academic qualification"
    },
    {
      id: 3,
      type: "Higher Certificates and Advanced National Vocational Certificate (NQF 5)",
      name: "Higher Certificate",
      description: "Post-secondary certificate qualification"
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
      type: "National Diploma and Advanced Certificate (NQF 6)",
      name: "National Diploma",
      description: "Vocational diploma qualification"
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
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
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Qualification Type
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qualifications.map((qualification) => (
                  <tr key={qualification.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{qualification.type}</div>
                        <div className="text-xs text-gray-500 mt-1">{qualification.name}</div>
                        {qualification.description && (
                          <div className="text-xs text-gray-400 mt-1">{qualification.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(qualification)}
                          className="btn-secondary btn-icon h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(qualification.id)}
                          className="btn-danger btn-icon h-8 w-8 p-0"
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
      </main>
    </div>
  );
}