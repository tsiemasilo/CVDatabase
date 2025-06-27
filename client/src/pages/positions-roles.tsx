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
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormType, setAddFormType] = useState<'department' | 'discipline' | 'domain' | 'category' | 'role'>('department');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    certificate: ""
  });

  // Get filtered data based on selections
  const getAvailableDisciplines = () => {
    if (!selectedDepartmentId) return [];
    return DISCIPLINES.filter(d => d.departmentId === selectedDepartmentId);
  };

  const getAvailableDomains = () => {
    if (!selectedDisciplineId) return [];
    return DOMAINS.filter(d => d.disciplineId === selectedDisciplineId);
  };

  const getAvailableCategories = () => {
    if (!selectedDomainId) return [];
    return CATEGORIES.filter(c => c.domainId === selectedDomainId);
  };

  const getAvailableRoles = () => {
    if (!selectedCategoryId) return [];
    return ROLES.filter(r => r.categoryId === selectedCategoryId);
  };

  // Get current display data based on deepest selection
  const getCurrentDisplayData = () => {
    if (selectedCategoryId) {
      return {
        type: 'roles',
        data: getAvailableRoles().filter(role =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
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
        data: DEPARTMENTS.filter(dept =>
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
  };

  const resetSelections = () => {
    setSelectedDepartmentId(null);
    setSelectedDisciplineId(null);
    setSelectedDomainId(null);
    setSelectedCategoryId(null);
    setSearchTerm("");
  };

  const getTableHeaders = () => {
    const { type } = getCurrentDisplayData();
    switch (type) {
      case 'roles':
        return ['Role Name', 'Description', 'Certificate Required', 'Actions'];
      default:
        return ['Name', 'Description', 'Actions'];
    }
  };

  const renderTableRow = (item: any, type: string) => {
    return (
      <TableRow key={item.id} className="hover:bg-gray-50">
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell className="text-gray-600">{item.description}</TableCell>
        {type === 'roles' && (
          <TableCell>
            {item.certificate ? (
              <Badge variant="outline" className="text-xs">
                {item.certificate}
              </Badge>
            ) : (
              <span className="text-gray-400 text-sm">No certificate required</span>
            )}
          </TableCell>
        )}
        <TableCell className="text-center">
          <div className="flex justify-center gap-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const getAddButtonText = () => {
    const { type } = getCurrentDisplayData();
    switch (type) {
      case 'departments': return 'Add Department';
      case 'disciplines': return 'Add Discipline';
      case 'domains': return 'Add Domain';
      case 'categories': return 'Add Category';
      case 'roles': return 'Add Role';
      default: return 'Add Item';
    }
  };

  const getCurrentLevel = () => {
    const { type } = getCurrentDisplayData();
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const { type, data } = getCurrentDisplayData();

  return (
    <div className="space-y-6">
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
          <Button
            onClick={() => {
              setAddFormType(type as any);
              setShowAddForm(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {getAddButtonText()}
          </Button>
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
                  {DEPARTMENTS.map((dept) => (
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
                    setFormData({ name: "", description: "", certificate: "" });
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
                  placeholder={`Enter ${addFormType} name`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={`Enter ${addFormType} description`}
                />
              </div>
              {addFormType === 'role' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Certificate (Optional)
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
                  onClick={() => {
                    console.log(`Adding ${addFormType}:`, formData);
                    setShowAddForm(false);
                    setFormData({ name: "", description: "", certificate: "" });
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {getAddButtonText()}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: "", description: "", certificate: "" });
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