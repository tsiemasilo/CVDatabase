import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEPARTMENTS, DISCIPLINES, DOMAINS, CATEGORIES, ROLES, Department, Discipline, Domain, Category, Role } from "@shared/data";

export default function PositionsRoles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedKLevel, setSelectedKLevel] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormStep, setAddFormStep] = useState(0); // 0: department, 1: discipline, 2: domain, 3: category
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    certificate: "",
    kLevel: ""
  });
  const [newDepartmentId, setNewDepartmentId] = useState<number | null>(null);
  const [newDisciplineId, setNewDisciplineId] = useState<number | null>(null);
  const [newDomainId, setNewDomainId] = useState<number | null>(null);

  // State for managing dynamic data
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [disciplines, setDisciplines] = useState(DISCIPLINES);
  const [domains, setDomains] = useState(DOMAINS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [roles, setRoles] = useState(ROLES);

  // Get filtered data based on selections
  const getAvailableDisciplines = () => {
    if (!selectedDepartmentId) return [];
    return disciplines.filter(d => d.departmentId === selectedDepartmentId);
  };

  const getAvailableDomains = () => {
    if (!selectedDisciplineId) return [];
    return domains.filter(d => d.disciplineId === selectedDisciplineId);
  };

  const getAvailableCategories = () => {
    if (!selectedDomainId) return [];
    return categories.filter(c => c.domainId === selectedDomainId);
  };

  const getAvailableRoles = () => {
    if (!selectedCategoryId) return [];
    return roles.filter(r => r.categoryId === selectedCategoryId);
  };

  // Get current display data based on deepest selection
  const getCurrentDisplayData = () => {
    if (selectedCategoryId) {
      return {
        type: 'roles',
        data: getAvailableRoles().filter(role => {
          const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               role.description.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesKLevel = !selectedKLevel || selectedKLevel === "all" || role.kLevel === selectedKLevel;
          return matchesSearch && matchesKLevel;
        })
      };
    } else if (selectedDomainId) {
      return {
        type: 'categories',
        data: getAvailableCategories().filter(category =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };
    } else if (selectedDisciplineId) {
      return {
        type: 'domains',
        data: getAvailableDomains().filter(domain =>
          domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          domain.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };
    } else if (selectedDepartmentId) {
      return {
        type: 'disciplines',
        data: getAvailableDisciplines().filter(discipline =>
          discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discipline.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };
    } else {
      return {
        type: 'departments',
        data: departments.filter(dept =>
          dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      };
    }
  };

  const handleDepartmentChange = (value: string) => {
    const deptId = parseInt(value);
    setSelectedDepartmentId(deptId);
    setSelectedDisciplineId(null);
    setSelectedDomainId(null);
    setSelectedCategoryId(null);
    setSelectedKLevel("all"); // Reset K-level when department changes
  };

  const handleDisciplineChange = (value: string) => {
    const discId = parseInt(value);
    setSelectedDisciplineId(discId);
    setSelectedDomainId(null);
    setSelectedCategoryId(null);
  };

  const handleDomainChange = (value: string) => {
    const domainId = parseInt(value);
    setSelectedDomainId(domainId);
    setSelectedCategoryId(null);
  };

  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setSelectedCategoryId(categoryId);
    setSelectedKLevel("all"); // Reset K-level when category changes
  };

  const resetSelections = () => {
    setSelectedDepartmentId(null);
    setSelectedDisciplineId(null);
    setSelectedDomainId(null);
    setSelectedCategoryId(null);
    setSelectedKLevel("all");
    setSearchTerm("");
  };

  const getTableHeaders = () => {
    const { type } = getCurrentDisplayData();
    switch (type) {
      case 'roles':
        return ['Role Name', 'Description', 'Certificate Required', 'K-Level', 'Actions'];
      default:
        return ['Name', 'Description', 'Actions'];
    }
  };

  const isSAPRole = (item: any) => {
    // SAP roles are in categories 1-9 (based on the data structure)
    return item.categoryId && item.categoryId <= 9;
  };

  const renderTableRow = (item: any, type: string) => {
    const showKLevel = type === 'roles' && isSAPRole(item);
    
    return (
      <TableRow key={item.id} className="hover:bg-gray-50">
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell className="text-gray-600">{item.description}</TableCell>
        {type === 'roles' && (
          <>
            <TableCell>
              {item.certificate ? (
                <Badge variant="outline" className="text-xs">
                  {item.certificate}
                </Badge>
              ) : (
                <span className="text-gray-400 text-sm">No certificate required</span>
              )}
            </TableCell>
            <TableCell>
              {showKLevel && item.kLevel ? (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  {item.kLevel}
                </Badge>
              ) : showKLevel ? (
                <span className="text-gray-400 text-sm">No K-level</span>
              ) : (
                <span className="text-gray-400 text-sm">N/A</span>
              )}
            </TableCell>
          </>
        )}
        <TableCell className="text-center">
          <div className="flex justify-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleEdit(item, type)}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDelete(item, type)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const getAddButtonText = () => {
    const steps = ['Add Department', 'Add Discipline', 'Add Domain', 'Add Category'];
    return steps[addFormStep];
  };

  const getCurrentLevel = () => {
    const { type } = getCurrentDisplayData();
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const isSAPCategory = () => {
    // Check if we're currently in a SAP category (categories 1-9)
    return selectedCategoryId && selectedCategoryId <= 9;
  };

  const handleAddRole = () => {
    if (!formData.name.trim() || !selectedCategoryId) return;

    const newRole: Role = {
      id: Math.max(...roles.map(r => r.id), 0) + 1,
      categoryId: selectedCategoryId,
      name: formData.name,
      description: formData.description,
      certificate: formData.certificate || undefined,
      kLevel: (isSAPCategory() && formData.kLevel) ? formData.kLevel : undefined
    };

    setRoles([...roles, newRole]);
    setShowAddRoleForm(false);
    setFormData({ name: "", description: "", certificate: "", kLevel: "" });
  };

  const isSAPDepartment = () => {
    // Check if we're in SAP department (department ID 1)
    return selectedDepartmentId === 1 || newDepartmentId === 1;
  };

  const handleAddStep = () => {
    if (!formData.name.trim()) return;

    switch (addFormStep) {
      case 0: // Department
        const newDept: Department = {
          id: Math.max(...departments.map(d => d.id), 0) + 1,
          name: formData.name,
          description: formData.description
        };
        setDepartments([...departments, newDept]);
        setNewDepartmentId(newDept.id);
        setAddFormStep(1);
        break;

      case 1: // Discipline
        if (!newDepartmentId) return;
        const newDisc: Discipline = {
          id: Math.max(...disciplines.map(d => d.id), 0) + 1,
          departmentId: newDepartmentId,
          name: formData.name,
          description: formData.description
        };
        setDisciplines([...disciplines, newDisc]);
        setNewDisciplineId(newDisc.id);
        setAddFormStep(2);
        break;

      case 2: // Domain
        if (!newDisciplineId) return;
        const newDomain: Domain = {
          id: Math.max(...domains.map(d => d.id), 0) + 1,
          disciplineId: newDisciplineId,
          name: formData.name,
          description: formData.description
        };
        setDomains([...domains, newDomain]);
        setNewDomainId(newDomain.id);
        setAddFormStep(3);
        break;

      case 3: // Category
        if (!newDomainId) return;
        const newCategory: Category = {
          id: Math.max(...categories.map(c => c.id), 0) + 1,
          domainId: newDomainId,
          name: formData.name,
          description: formData.description
        };
        setCategories([...categories, newCategory]);
        // Complete the process
        setShowAddForm(false);
        setAddFormStep(0);
        setNewDepartmentId(null);
        setNewDisciplineId(null);
        setNewDomainId(null);
        break;
    }

    setFormData({ name: "", description: "", certificate: "", kLevel: "" });
  };

  const getStepTitle = () => {
    const steps = ['Department', 'Discipline', 'Domain', 'Category'];
    return steps[addFormStep];
  };

  const handleEdit = (item: any, type: string) => {
    setFormData({
      name: item.name,
      description: item.description,
      certificate: item.certificate || "",
      kLevel: item.kLevel || ""
    });
    
    // Set the form to edit mode for the specific item type
    const typeToStep = {
      'departments': 0,
      'disciplines': 1,
      'domains': 2,
      'categories': 3
    };
    
    if (type in typeToStep) {
      setAddFormStep(typeToStep[type as keyof typeof typeToStep]);
      setShowAddForm(true);
    }
  };

  const handleDelete = (item: any, type: string) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      switch (type) {
        case 'departments':
          setDepartments(departments.filter(d => d.id !== item.id));
          break;
        case 'disciplines':
          setDisciplines(disciplines.filter(d => d.id !== item.id));
          break;
        case 'domains':
          setDomains(domains.filter(d => d.id !== item.id));
          break;
        case 'categories':
          setCategories(categories.filter(c => c.id !== item.id));
          break;
        case 'roles':
          setRoles(roles.filter(r => r.id !== item.id));
          break;
      }
    }
  };

  const { type, data } = getCurrentDisplayData();

  return (
    <div className="space-y-6 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" style={{ color: 'rgb(0, 0, 83)' }}>
          Positions | Roles
        </h1>
        <div className="flex gap-3">
          <Button
            onClick={resetSelections}
            variant="outline"
          >
            Reset Filters
          </Button>
          {type === 'roles' ? (
            <Button
              onClick={() => setShowAddRoleForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          ) : (
            <Button
              onClick={() => {
                setAddFormStep(0);
                setShowAddForm(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Positions|Roles
            </Button>
          )}
        </div>
      </div>

      {/* Hierarchical Dropdown Filters */}
      <Card>
        <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
          <CardTitle className="text-lg font-semibold">Navigation Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <Select 
                value={selectedDepartmentId?.toString() || ""} 
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Discipline Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discipline</label>
              <Select 
                value={selectedDisciplineId?.toString() || ""} 
                onValueChange={handleDisciplineChange}
                disabled={!selectedDepartmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedDepartmentId ? "Select discipline" : "Select department first"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDisciplines().map((disc) => (
                    <SelectItem key={disc.id} value={disc.id.toString()}>
                      {disc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Domain Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
              <Select 
                value={selectedDomainId?.toString() || ""} 
                onValueChange={handleDomainChange}
                disabled={!selectedDisciplineId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedDisciplineId ? "Select domain" : "Select discipline first"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDomains().map((domain) => (
                    <SelectItem key={domain.id} value={domain.id.toString()}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select 
                value={selectedCategoryId?.toString() || ""} 
                onValueChange={handleCategoryChange}
                disabled={!selectedDomainId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedDomainId ? "Select category" : "Select domain first"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableCategories().map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* K-Level Filter - Only show for SAP department */}
            {selectedDepartmentId === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">K-Level</label>
                <Select value={selectedKLevel} onValueChange={setSelectedKLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select K-Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All K-Levels</SelectItem>
                    <SelectItem value="K1">K1 - Basic Awareness / Entry-Level (0-1 year)</SelectItem>
                    <SelectItem value="K2">K2 - Functional Understanding / Junior Consultant (1-2 years)</SelectItem>
                    <SelectItem value="K3">K3 - Practitioner / Independent Consultant (2-4 years)</SelectItem>
                    <SelectItem value="K4">K4 - Senior Expert / Lead Consultant (5-8+ years)</SelectItem>
                    <SelectItem value="K5">K5 - Master / Solution Architect / Strategist (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={`Search ${getCurrentLevel().toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
          <CardTitle className="text-lg font-semibold">
            {getCurrentLevel()} ({data.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {data.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {getTableHeaders().map((header) => (
                      <TableHead key={header} className="font-semibold">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => renderTableRow(item, type))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No {getCurrentLevel().toLowerCase()} found.
                {!selectedDepartmentId && " Please select a department to begin."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {getAddButtonText()}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: "", description: "", certificate: "", kLevel: "" });
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={`Enter ${getStepTitle().toLowerCase()} name`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={`Enter ${getStepTitle().toLowerCase()} description`}
                />
              </div>

              {/* K-Level field for SAP roles only */}
              {getCurrentLevel() === 'Roles' && isSAPCategory() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    K-Level (SAP Knowledge Level)
                  </label>
                  <Select
                    value={formData.kLevel}
                    onValueChange={(value) => setFormData({ ...formData, kLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select K-Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K4">K4 - Basic Level</SelectItem>
                      <SelectItem value="K5">K5 - Intermediate Level</SelectItem>
                      <SelectItem value="K6">K6 - Advanced Level</SelectItem>
                      <SelectItem value="K7">K7 - Expert Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Certificate field for roles */}
              {getCurrentLevel() === 'Roles' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Required (Optional)
                  </label>
                  <Input
                    value={formData.certificate}
                    onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                    placeholder="Enter required certification"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddStep}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={!formData.name.trim()}
                >
                  {getAddButtonText()}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setAddFormStep(0);
                    setNewDepartmentId(null);
                    setNewDisciplineId(null);
                    setNewDomainId(null);
                    setFormData({ name: "", description: "", certificate: "", kLevel: "" });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Role Form */}
      {showAddRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Add New Role
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddRoleForm(false);
                    setFormData({ name: "", description: "", certificate: "", kLevel: "" });
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter role name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter role description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Required (Optional)
                </label>
                <Input
                  value={formData.certificate}
                  onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                  placeholder="Enter required certification"
                />
              </div>

              {/* K-Level field for SAP roles only */}
              {isSAPCategory() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    K-Level (SAP Knowledge Level)
                  </label>
                  <Select
                    value={formData.kLevel}
                    onValueChange={(value) => setFormData({ ...formData, kLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select K-Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K4">K4 - Basic Level</SelectItem>
                      <SelectItem value="K5">K5 - Intermediate Level</SelectItem>
                      <SelectItem value="K6">K6 - Advanced Level</SelectItem>
                      <SelectItem value="K7">K7 - Expert Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddRole}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={!formData.name.trim()}
                >
                  Add Role
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddRoleForm(false);
                    setFormData({ name: "", description: "", certificate: "", kLevel: "" });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}