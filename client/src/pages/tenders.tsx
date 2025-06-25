import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";

interface Tender {
  id: number;
  referenceNumber: string;
  description: string;
  status: 'open' | 'closed' | 'awarded';
  publishDate: string;
  closingDate: string;
  estimatedValue: string;
  department: string;
}

export default function Tenders() {
  const [tenders, setTenders] = useState<Tender[]>([
    {
      id: 1,
      referenceNumber: "GT-INFRA-2025-001",
      description: "Upgrade and modernization of provincial traffic management systems including smart traffic lights and monitoring equipment",
      status: 'open',
      publishDate: "2025-01-15",
      closingDate: "2025-03-15",
      estimatedValue: "R 18,500,000",
      department: "Gauteng Department of Roads and Transport"
    },
    {
      id: 2,
      referenceNumber: "WC-HEALTH-2025-007",
      description: "Supply and delivery of medical equipment and pharmaceutical supplies for district hospitals across the Western Cape",
      status: 'open',
      publishDate: "2025-01-20",
      closingDate: "2025-02-28",
      estimatedValue: "R 25,750,000",
      department: "Western Cape Department of Health and Wellness"
    },
    {
      id: 3,
      referenceNumber: "KZN-EDU-2025-003",
      description: "Construction and renovation of school facilities including classrooms, laboratories and library infrastructure in rural KwaZulu-Natal",
      status: 'closed',
      publishDate: "2024-12-10",
      closingDate: "2025-01-25",
      estimatedValue: "R 42,300,000",
      department: "KwaZulu-Natal Department of Education"
    }
  ]);

  const [editingTender, setEditingTender] = useState<Tender | null>(null);
  const [tenderFormData, setTenderFormData] = useState({
    referenceNumber: "",
    description: "",
    status: "open" as const,
    publishDate: "",
    closingDate: "",
    estimatedValue: "",
    department: ""
  });

  const [addTenderModalOpen, setAddTenderModalOpen] = useState(false);
  const [newTender, setNewTender] = useState({
    referenceNumber: "",
    description: "",
    status: "open" as const,
    publishDate: "",
    closingDate: "",
    estimatedValue: "",
    department: ""
  });

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200',
      awarded: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const handleAddTender = () => {
    if (newTender.referenceNumber && newTender.description && newTender.department) {
      const tender: Tender = {
        id: Math.max(...tenders.map(t => t.id)) + 1,
        ...newTender
      };
      setTenders([...tenders, tender]);
      setNewTender({
        referenceNumber: "",
        description: "",
        status: "open",
        publishDate: "",
        closingDate: "",
        estimatedValue: "",
        department: ""
      });
      setAddTenderModalOpen(false);
    }
  };

  const handleEditTender = (tender: Tender) => {
    setEditingTender(tender);
    setTenderFormData({
      referenceNumber: tender.referenceNumber,
      description: tender.description,
      status: tender.status,
      publishDate: tender.publishDate,
      closingDate: tender.closingDate,
      estimatedValue: tender.estimatedValue,
      department: tender.department
    });
  };

  const handleUpdateTender = () => {
    if (editingTender && tenderFormData.referenceNumber && tenderFormData.description && tenderFormData.department) {
      setTenders(tenders.map(tender => 
        tender.id === editingTender.id 
          ? { ...tender, ...tenderFormData }
          : tender
      ));
      setEditingTender(null);
    }
  };

  const handleDeleteTender = (id: number) => {
    setTenders(tenders.filter(t => t.id !== id));
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tenders</h2>
            <Button 
              onClick={() => setAddTenderModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add tender
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Reference Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Estimated Value
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Closing Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenders.map((tender) => (
                  <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tender.referenceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                      <div className="line-clamp-2" title={tender.description}>
                        {tender.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="line-clamp-2" title={tender.department}>
                        {tender.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(tender.status)}`}>
                        {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tender.estimatedValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tender.closingDate ? new Date(tender.closingDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTender(tender)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTender(tender.id)}
                          className="text-gray-600 hover:text-red-600"
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

          {tenders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tenders found.</p>
            </div>
          )}
        </div>

        {/* Add Tender Modal */}
        <Dialog open={addTenderModalOpen} onOpenChange={setAddTenderModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Tender</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tender-ref">Reference Number</Label>
                  <Input
                    id="tender-ref"
                    value={newTender.referenceNumber}
                    onChange={(e) => setNewTender({ ...newTender, referenceNumber: e.target.value })}
                    placeholder="Enter reference number"
                  />
                </div>
                <div>
                  <Label htmlFor="tender-status">Status</Label>
                  <select
                    id="tender-status"
                    value={newTender.status}
                    onChange={(e) => setNewTender({ ...newTender, status: e.target.value as 'open' | 'closed' | 'awarded' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="awarded">Awarded</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="tender-desc">Description</Label>
                <Textarea
                  id="tender-desc"
                  value={newTender.description}
                  onChange={(e) => setNewTender({ ...newTender, description: e.target.value })}
                  placeholder="Enter tender description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tender-dept">Department</Label>
                <Input
                  id="tender-dept"
                  value={newTender.department}
                  onChange={(e) => setNewTender({ ...newTender, department: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tender-value">Estimated Value</Label>
                  <Input
                    id="tender-value"
                    value={newTender.estimatedValue}
                    onChange={(e) => setNewTender({ ...newTender, estimatedValue: e.target.value })}
                    placeholder="R 0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="tender-publish">Publish Date</Label>
                  <Input
                    id="tender-publish"
                    type="date"
                    value={newTender.publishDate}
                    onChange={(e) => setNewTender({ ...newTender, publishDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tender-closing">Closing Date</Label>
                  <Input
                    id="tender-closing"
                    type="date"
                    value={newTender.closingDate}
                    onChange={(e) => setNewTender({ ...newTender, closingDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setAddTenderModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTender} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Add Tender
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Tender Modal */}
        <Dialog open={editingTender !== null} onOpenChange={() => setEditingTender(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tender</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-tender-ref">Reference Number</Label>
                  <Input
                    id="edit-tender-ref"
                    value={tenderFormData.referenceNumber}
                    onChange={(e) => setTenderFormData({ ...tenderFormData, referenceNumber: e.target.value })}
                    placeholder="Enter reference number"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tender-status">Status</Label>
                  <select
                    id="edit-tender-status"
                    value={tenderFormData.status}
                    onChange={(e) => setTenderFormData({ ...tenderFormData, status: e.target.value as 'open' | 'closed' | 'awarded' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="awarded">Awarded</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-tender-desc">Description</Label>
                <Textarea
                  id="edit-tender-desc"
                  value={tenderFormData.description}
                  onChange={(e) => setTenderFormData({ ...tenderFormData, description: e.target.value })}
                  placeholder="Enter tender description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-tender-dept">Department</Label>
                <Input
                  id="edit-tender-dept"
                  value={tenderFormData.department}
                  onChange={(e) => setTenderFormData({ ...tenderFormData, department: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-tender-value">Estimated Value</Label>
                  <Input
                    id="edit-tender-value"
                    value={tenderFormData.estimatedValue}
                    onChange={(e) => setTenderFormData({ ...tenderFormData, estimatedValue: e.target.value })}
                    placeholder="R 0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tender-publish">Publish Date</Label>
                  <Input
                    id="edit-tender-publish"
                    type="date"
                    value={tenderFormData.publishDate}
                    onChange={(e) => setTenderFormData({ ...tenderFormData, publishDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tender-closing">Closing Date</Label>
                  <Input
                    id="edit-tender-closing"
                    type="date"
                    value={tenderFormData.closingDate}
                    onChange={(e) => setTenderFormData({ ...tenderFormData, closingDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingTender(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTender} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Update Tender
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}