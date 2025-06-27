import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  departmentId: number;
  name: string;
  description: string;
  level: string;
}

export default function PositionsRoles() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Information Technology", description: "Technology and systems management" },
    { id: 2, name: "Human Resources", description: "People and organizational development" },
    { id: 3, name: "Finance", description: "Financial planning and management" }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: 1, departmentId: 1, name: "Software Developer", description: "Application development and programming", level: "Mid-Level" },
    { id: 2, departmentId: 1, name: "System Administrator", description: "System maintenance and support", level: "Senior" },
    { id: 3, departmentId: 2, name: "HR Business Partner", description: "Strategic HR support", level: "Senior" },
    { id: 4, departmentId: 3, name: "Financial Analyst", description: "Financial analysis and reporting", level: "Junior" }
  ]);

  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [newRole, setNewRole] = useState({ departmentId: 0, name: '', description: '', level: '' });
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

  const addDepartment = () => {
    if (newDept.name && newDept.description) {
      const department: Department = {
        id: Math.max(...departments.map(d => d.id), 0) + 1,
        name: newDept.name,
        description: newDept.description
      };
      setDepartments([...departments, department]);
      setNewDept({ name: '', description: '' });
      setShowAddDept(false);
    }
  };

  const addRole = () => {
    if (newRole.name && newRole.description && newRole.departmentId && newRole.level) {
      const role: Role = {
        id: Math.max(...roles.map(r => r.id), 0) + 1,
        departmentId: newRole.departmentId,
        name: newRole.name,
        description: newRole.description,
        level: newRole.level
      };
      setRoles([...roles, role]);
      setNewRole({ departmentId: 0, name: '', description: '', level: '' });
      setShowAddRole(false);
    }
  };

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id));
    setRoles(roles.filter(r => r.departmentId !== id));
  };

  const deleteRole = (id: number) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const getDepartmentName = (departmentId: number) => {
    return departments.find(d => d.id === departmentId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-8 pt-8 px-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: 'rgb(0, 0, 83)' }}>
          Positions | Roles
        </h1>
      </div>

      {/* Departments Section */}
      <Card>
        <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Departments</CardTitle>
            <Button 
              onClick={() => setShowAddDept(true)}
              className="bg-white text-blue-900 hover:bg-gray-100"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {showAddDept && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-4">Add New Department</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Department Name"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addDepartment} style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                  Save Department
                </Button>
                <Button variant="outline" onClick={() => setShowAddDept(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                  <TableHead className="font-semibold text-gray-700">Department Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteDepartment(dept.id)}
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

      {/* Roles Section */}
      <Card>
        <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Roles</CardTitle>
            <Button 
              onClick={() => setShowAddRole(true)}
              className="bg-white text-blue-900 hover:bg-gray-100"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {showAddRole && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-4">Add New Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={newRole.departmentId}
                  onChange={(e) => setNewRole({ ...newRole, departmentId: parseInt(e.target.value) })}
                >
                  <option value={0}>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                <Input
                  placeholder="Role Name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
                <select
                  className="px-3 py-2 border rounded-md"
                  value={newRole.level}
                  onChange={(e) => setNewRole({ ...newRole, level: e.target.value })}
                >
                  <option value="">Select Level</option>
                  <option value="Entry">Entry</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={addRole} style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                  Save Role
                </Button>
                <Button variant="outline" onClick={() => setShowAddRole(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                  <TableHead className="font-semibold text-gray-700">Role Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Department</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">Level</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getDepartmentName(role.departmentId)}</Badge>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteRole(role.id)}
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
    </div>
  );
}