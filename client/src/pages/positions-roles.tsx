import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";

interface Department {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  department: string;
  role: string;
  description: string;
}

export default function PositionsRoles() {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Engineering and Technology",
      description: "Technical engineering roles across various specializations including civil, mechanical, electrical, and software engineering disciplines."
    },
    {
      id: 2,
      name: "Healthcare and Medical Services",
      description: "Medical professionals, healthcare practitioners, and allied health services supporting South Africa's healthcare system."
    },
    {
      id: 3,
      name: "Education and Training",
      description: "Educational professionals from early childhood development through higher education and vocational training sectors."
    },
    {
      id: 4,
      name: "Finance and Accounting",
      description: "Financial services professionals including accountants, auditors, financial analysts, and banking specialists."
    },
    {
      id: 5,
      name: "Legal and Compliance",
      description: "Legal practitioners, paralegals, compliance officers, and regulatory affairs professionals."
    },
    {
      id: 6,
      name: "Mining and Natural Resources",
      description: "Mining engineers, geologists, environmental specialists, and natural resource management professionals."
    },
    {
      id: 7,
      name: "Agriculture and Food Security",
      description: "Agricultural specialists, food technologists, veterinarians, and sustainable farming professionals."
    },
    {
      id: 8,
      name: "Human Resources and Development",
      description: "HR professionals, organizational development specialists, and workplace learning facilitators."
    },
    {
      id: 9,
      name: "Communications and Media",
      description: "Marketing professionals, digital media specialists, communications officers, and public relations experts."
    },
    {
      id: 10,
      name: "Construction and Built Environment",
      description: "Construction professionals, architects, quantity surveyors, and urban planning specialists."
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: 1, department: "Engineering and Technology", role: "Software Engineer", description: "Develop and maintain software applications using modern programming languages and frameworks." },
    { id: 2, department: "Engineering and Technology", role: "Civil Engineer", description: "Design and oversee construction of infrastructure projects including roads, bridges, and buildings." },
    { id: 3, department: "Engineering and Technology", role: "Electrical Engineer", description: "Design electrical systems, power distribution networks, and electronic control systems." },
    { id: 4, department: "Healthcare and Medical Services", role: "Registered Nurse", description: "Provide direct patient care, administer medications, and coordinate healthcare services." },
    { id: 5, department: "Healthcare and Medical Services", role: "Medical Doctor", description: "Diagnose and treat patients, prescribe medications, and provide comprehensive medical care." },
    { id: 6, department: "Healthcare and Medical Services", role: "Physiotherapist", description: "Assess and treat patients with movement disorders and rehabilitation needs." },
    { id: 7, department: "Education and Training", role: "Primary School Teacher", description: "Teach foundation phase learners across multiple subjects in the South African curriculum." },
    { id: 8, department: "Education and Training", role: "Mathematics Teacher", description: "Teach mathematics at secondary level following CAPS curriculum requirements." },
    { id: 9, department: "Education and Training", role: "TVET Lecturer", description: "Deliver vocational education and training in technical and occupational programs." },
    { id: 10, department: "Finance and Accounting", role: "Chartered Accountant (CA)", description: "Provide financial reporting, auditing, and business advisory services." },
    { id: 11, department: "Finance and Accounting", role: "Financial Analyst", description: "Analyze financial data, prepare reports, and support investment decision-making." },
    { id: 12, department: "Finance and Accounting", role: "Tax Practitioner", description: "Prepare tax returns, provide tax advisory services, and ensure SARS compliance." },
    { id: 13, department: "Legal and Compliance", role: "Attorney", description: "Provide legal representation, draft legal documents, and advise clients on legal matters." },
    { id: 14, department: "Legal and Compliance", role: "Advocate", description: "Represent clients in higher courts and provide specialist legal opinions." },
    { id: 15, department: "Legal and Compliance", role: "Legal Advisor", description: "Provide in-house legal counsel and ensure regulatory compliance." },
    { id: 16, department: "Mining and Natural Resources", role: "Mining Engineer", description: "Plan and supervise mining operations, ensuring safety and efficiency standards." },
    { id: 17, department: "Mining and Natural Resources", role: "Geologist", description: "Study geological formations to identify mineral deposits and assess extraction viability." },
    { id: 18, department: "Mining and Natural Resources", role: "Environmental Officer", description: "Monitor environmental compliance and implement sustainable mining practices." },
    { id: 19, department: "Agriculture and Food Security", role: "Agricultural Extension Officer", description: "Provide technical support and training to farmers on sustainable agricultural practices." },
    { id: 20, department: "Agriculture and Food Security", role: "Veterinarian", description: "Provide animal healthcare services and ensure food safety standards." },
    { id: 21, department: "Agriculture and Food Security", role: "Food Technologist", description: "Develop and improve food products while ensuring quality and safety standards." },
    { id: 22, department: "Human Resources and Development", role: "HR Manager", description: "Oversee human resources functions including recruitment, training, and employee relations." },
    { id: 23, department: "Human Resources and Development", role: "Training and Development Specialist", description: "Design and deliver employee training programs and organizational development initiatives." },
    { id: 24, department: "Human Resources and Development", role: "Skills Development Facilitator", description: "Coordinate workplace skills development programs and SETA compliance." },
    { id: 25, department: "Communications and Media", role: "Digital Marketing Specialist", description: "Develop and execute digital marketing strategies across various online platforms." },
    { id: 26, department: "Communications and Media", role: "Public Relations Officer", description: "Manage organizational communications and maintain positive public relations." },
    { id: 27, department: "Communications and Media", role: "Content Creator", description: "Create engaging content for various media platforms and marketing campaigns." },
    { id: 28, department: "Construction and Built Environment", role: "Architect", description: "Design building structures and coordinate architectural projects from concept to completion." },
    { id: 29, department: "Construction and Built Environment", role: "Quantity Surveyor", description: "Manage construction costs, prepare tender documents, and oversee project budgets." },
    { id: 30, department: "Construction and Built Environment", role: "Project Manager", description: "Coordinate construction projects ensuring timely delivery within budget and quality standards." }
  ]);

  // Department management states
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [departmentFormData, setDepartmentFormData] = useState({
    name: "",
    description: ""
  });
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: ""
  });

  // Role management states
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    department: "",
    role: "",
    description: ""
  });
  const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    department: "",
    role: "",
    description: ""
  });

  // Filter states
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>("all");
  const [filteredRoles, setFilteredRoles] = useState<Role[]>(roles);

  // Department CRUD operations
  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.description) {
      const department: Department = {
        id: Math.max(...departments.map(d => d.id)) + 1,
        name: newDepartment.name,
        description: newDepartment.description
      };
      setDepartments([...departments, department]);
      setNewDepartment({ name: "", description: "" });
      setAddDepartmentModalOpen(false);
    }
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentFormData({
      name: department.name,
      description: department.description
    });
  };

  const handleUpdateDepartment = () => {
    if (editingDepartment && departmentFormData.name && departmentFormData.description) {
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...dept, name: departmentFormData.name, description: departmentFormData.description }
          : dept
      ));
      setEditingDepartment(null);
    }
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id));
    // Also remove roles associated with this department
    const departmentName = departments.find(d => d.id === id)?.name;
    if (departmentName) {
      setRoles(roles.filter(r => r.department !== departmentName));
    }
  };

  // Role CRUD operations
  const handleAddRole = () => {
    if (newRole.department && newRole.role && newRole.description) {
      const role: Role = {
        id: Math.max(...roles.map(r => r.id)) + 1,
        department: newRole.department,
        role: newRole.role,
        description: newRole.description
      };
      setRoles([...roles, role]);
      setNewRole({ department: "", role: "", description: "" });
      setAddRoleModalOpen(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleFormData({
      department: role.department,
      role: role.role,
      description: role.description
    });
  };

  const handleUpdateRole = () => {
    if (editingRole && roleFormData.department && roleFormData.role && roleFormData.description) {
      setRoles(roles.map(r => 
        r.id === editingRole.id 
          ? { ...r, department: roleFormData.department, role: roleFormData.role, description: roleFormData.description }
          : r
      ));
      setEditingRole(null);
    }
  };

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  // Filter functionality
  const handleApplyRoleFilter = () => {
    if (selectedDepartmentFilter === "all") {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(role => 
        role.department === selectedDepartmentFilter
      );
      setFilteredRoles(filtered);
    }
  };

  // Update filtered list when roles or filter changes
  useEffect(() => {
    handleApplyRoleFilter();
  }, [roles, selectedDepartmentFilter]);

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Departments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
            <Button 
              onClick={() => setAddDepartmentModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                      {department.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDepartment(department)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDepartment(department.id)}
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
        </div>

        {/* Roles Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Roles</h2>
            <Button 
              onClick={() => setAddRoleModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </div>

          {/* Filter Section */}
          <div className="mb-6 flex items-center gap-4">
            <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}>
              <SelectTrigger className="w-96">
                <SelectValue placeholder="Select department to filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleApplyRoleFilter}
              className="bg-blue-800 hover:bg-blue-900 text-white px-6"
            >
              Apply filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {role.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                      {role.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
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
        </div>

        {/* Add Department Modal */}
        <Dialog open={addDepartmentModalOpen} onOpenChange={setAddDepartmentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dept-name">Department Name</Label>
                <Input
                  id="dept-name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label htmlFor="dept-description">Description</Label>
                <Textarea
                  id="dept-description"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddDepartmentModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDepartment} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Add Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Department Modal */}
        <Dialog open={editingDepartment !== null} onOpenChange={() => setEditingDepartment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-dept-name">Department Name</Label>
                <Input
                  id="edit-dept-name"
                  value={departmentFormData.name}
                  onChange={(e) => setDepartmentFormData({ ...departmentFormData, name: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label htmlFor="edit-dept-description">Description</Label>
                <Textarea
                  id="edit-dept-description"
                  value={departmentFormData.description}
                  onChange={(e) => setDepartmentFormData({ ...departmentFormData, description: e.target.value })}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingDepartment(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateDepartment} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Update Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Role Modal */}
        <Dialog open={addRoleModalOpen} onOpenChange={setAddRoleModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-department">Department</Label>
                <Select value={newRole.department} onValueChange={(value) => setNewRole({ ...newRole, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={newRole.role}
                  onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Enter role description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setAddRoleModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRole} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Add Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Role Modal */}
        <Dialog open={editingRole !== null} onOpenChange={() => setEditingRole(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-role-department">Department</Label>
                <Select value={roleFormData.department} onValueChange={(value) => setRoleFormData({ ...roleFormData, department: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-role-name">Role Name</Label>
                <Input
                  id="edit-role-name"
                  value={roleFormData.role}
                  onChange={(e) => setRoleFormData({ ...roleFormData, role: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <Label htmlFor="edit-role-description">Description</Label>
                <Textarea
                  id="edit-role-description"
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  placeholder="Enter role description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingRole(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateRole} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Update Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}