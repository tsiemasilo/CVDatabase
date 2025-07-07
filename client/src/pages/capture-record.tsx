import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertCVRecord } from "@shared/schema";
import { LANGUAGES, GENDERS, SAP_K_LEVELS, QUALIFICATION_TYPES, QUALIFICATION_MAPPINGS } from "@shared/data";

// Interface matching the positions-roles page structure
interface DepartmentRole {
  id: number;
  department: string;
  role: string;
  roleTitle: string;
  description: string;
  kLevel: string;
}

export default function CaptureRecord() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    surname: "",
    idPassportNumber: "",
    gender: "",
    yearsOfExperience: "",
    sapKLevel: "",
    contactNumber: "",
    email: "",
    position: "",
    roleTitle: "",
    department: "",
    languages: [""],
    qualificationType: "",
    qualificationName: "",
    qualificationCertificate: null,
    otherQualifications: [{ name: "", certificate: null }],
    experienceInSimilarRole: "",
    experienceWithITSMTools: "",
    workExperiences: [{ companyName: "", position: "", startDate: "", endDate: "", isCurrentRole: false }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departmentRoles, setDepartmentRoles] = useState<DepartmentRole[]>([]);

  // Load departments and roles from localStorage (same source as positions|roles page)
  useEffect(() => {
    const savedRecords = localStorage.getItem('departmentRoles');
    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords);
        setDepartmentRoles(parsed);
      } catch (error) {
        console.error('Error loading department roles:', error);
        setDepartmentRoles([]);
      }
    }
  }, []);

  // Get unique departments from the positions|roles data
  const getAvailableDepartments = () => {
    if (departmentRoles.length === 0) {
      // Fallback to default departments if no data is loaded yet
      return ["SAP", "ICT", "HR", "DEVELOPMENT", "Project Management", "Service Desk"];
    }
    const uniqueDepartments = [...new Set(departmentRoles.map(role => role.department))];
    return uniqueDepartments.sort();
  };

  // Get roles for the selected department from the positions|roles data
  const getAvailableRoles = () => {
    if (!formData.department) return [];
    if (departmentRoles.length === 0) {
      // Fallback roles if no data is loaded yet
      const fallbackRoles: Record<string, string[]> = {
        "SAP": ["SAP ABAP Developer", "SAP Functional Consultant", "SAP Technical Consultant"],
        "ICT": ["IT Support Technician", "Network Administrator", "Systems Analyst"],
        "HR": ["HR Assistant", "Recruitment Coordinator", "HR Business Partner"],
        "DEVELOPMENT": ["Junior Developer", "Software Developer", "Senior Developer"],
        "Project Management": ["Project Coordinator", "Project Officer", "Project Manager"],
        "Service Desk": ["Service Desk Agent", "Technical Support Specialist", "Service Desk Analyst"]
      };
      return fallbackRoles[formData.department] || [];
    }
    return departmentRoles
      .filter(role => role.department === formData.department)
      .map(role => role.role)
      .filter((role, index, self) => self.indexOf(role) === index) // Remove duplicates
      .sort();
  };

  // Get role titles for the selected role from the positions|roles data
  const getAvailableRoleTitles = () => {
    if (!formData.position) return [];
    if (departmentRoles.length === 0) return [];
    return departmentRoles
      .filter(role => role.role === formData.position && role.department === formData.department)
      .map(role => role.roleTitle)
      .sort();
  };

  // Get K-level for the selected role title from the positions|roles data
  const getKLevelForRoleTitle = (roleTitle: string) => {
    if (!roleTitle || !formData.position || !formData.department || departmentRoles.length === 0) return "";
    const roleData = departmentRoles.find(role => 
      role.roleTitle === roleTitle && 
      role.role === formData.position && 
      role.department === formData.department
    );
    return roleData?.kLevel || "";
  };

  // Get available K-levels for the selected department
  const getAvailableKLevels = () => {
    if (!formData.department) return [];
    if (departmentRoles.length === 0) {
      return ["K1", "K2", "K3", "K4", "K5"]; // Fallback
    }
    const departmentKLevels = departmentRoles
      .filter(role => role.department === formData.department)
      .map(role => role.kLevel)
      .filter((kLevel, index, self) => self.indexOf(kLevel) === index) // Remove duplicates
      .sort();
    return departmentKLevels;
  };

  // Get qualification names for the selected qualification type
  const getAvailableQualificationNames = () => {
    if (!formData.qualificationType) return [];
    const selectedMapping = QUALIFICATION_MAPPINGS.find(q => q.type === formData.qualificationType);
    return selectedMapping ? selectedMapping.names : [];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Clear role title and K-level when role changes
      if (field === "position" && value) {
        updated.roleTitle = "";
        updated.sapKLevel = "";
      }
      
      // Auto-set K-level when role title is selected
      if (field === "roleTitle" && value) {
        const kLevel = getKLevelForRoleTitle(value);
        if (kLevel) {
          updated.sapKLevel = kLevel;
        }
      }
      
      return updated;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLanguageChange = (index: number, value: string) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = value;
    setFormData(prev => ({
      ...prev,
      languages: newLanguages
    }));
  };

  const addLanguage = () => {
    setFormData(prev => ({
      ...prev,
      languages: [...prev.languages, ""]
    }));
  };

  const removeLanguage = (index: number) => {
    if (formData.languages.length > 1) {
      const newLanguages = formData.languages.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        languages: newLanguages
      }));
    }
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string | boolean) => {
    const newWorkExperiences = [...formData.workExperiences];
    newWorkExperiences[index] = { ...newWorkExperiences[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      workExperiences: newWorkExperiences
    }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, { companyName: "", position: "", startDate: "", endDate: "", isCurrentRole: false }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    if (formData.workExperiences.length > 1) {
      const newWorkExperiences = formData.workExperiences.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        workExperiences: newWorkExperiences
      }));
    }
  };

  const handleOtherQualificationChange = (index: number, field: string, value: string | File | null) => {
    const newOtherQualifications = [...formData.otherQualifications];
    newOtherQualifications[index] = { ...newOtherQualifications[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      otherQualifications: newOtherQualifications
    }));
  };

  const addOtherQualification = () => {
    setFormData(prev => ({
      ...prev,
      otherQualifications: [...prev.otherQualifications, { name: "", certificate: null }]
    }));
  };

  const removeOtherQualification = (index: number) => {
    if (formData.otherQualifications.length > 1) {
      const newOtherQualifications = formData.otherQualifications.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        otherQualifications: newOtherQualifications
      }));
    }
  };

  const handleFileUpload = (field: string, file: File | null, index?: number) => {
    if (field === 'qualificationCertificate') {
      setFormData(prev => ({
        ...prev,
        qualificationCertificate: file
      }));
    } else if (field === 'otherQualificationCertificate' && index !== undefined) {
      handleOtherQualificationChange(index, 'certificate', file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.idPassportNumber.trim()) newErrors.idPassportNumber = "ID/Passport number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.yearsOfExperience.trim()) newErrors.yearsOfExperience = "Years of experience is required";
    if (!formData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.position.trim()) newErrors.position = "Position/Role is required";
    if (!formData.roleTitle.trim()) newErrors.roleTitle = "Role title is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.experienceInSimilarRole.trim()) newErrors.experienceInSimilarRole = "Experience in similar role is required";
    if (!formData.experienceWithITSMTools.trim()) newErrors.experienceWithITSMTools = "Experience with ITSM tools is required";
    
    // Validate work experiences
    formData.workExperiences.forEach((exp, index) => {
      if (!exp.companyName.trim()) newErrors[`workExperience${index}Company`] = "Company name is required";
      if (!exp.position.trim()) newErrors[`workExperience${index}Position`] = "Position is required";
      if (!exp.startDate.trim()) {
        newErrors[`workExperience${index}StartDate`] = "Start date is required";
      } else if (!/^\d{2}\/\d{4}$/.test(exp.startDate)) {
        newErrors[`workExperience${index}StartDate`] = "Please use MM/YYYY format (e.g., 01/2020)";
      }
      if (!exp.isCurrentRole && !exp.endDate.trim()) {
        newErrors[`workExperience${index}EndDate`] = "End date is required";
      } else if (!exp.isCurrentRole && exp.endDate && !/^\d{2}\/\d{4}$/.test(exp.endDate)) {
        newErrors[`workExperience${index}EndDate`] = "Please use MM/YYYY format (e.g., 12/2023)";
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate years of experience is a number
    if (formData.yearsOfExperience && isNaN(Number(formData.yearsOfExperience))) {
      newErrors.yearsOfExperience = "Please enter a valid number";
    }
    
    // Validate experience in similar role is a number
    if (formData.experienceInSimilarRole && isNaN(Number(formData.experienceInSimilarRole))) {
      newErrors.experienceInSimilarRole = "Please enter a valid number";
    }
    
    // Validate experience with ITSM tools is a number
    if (formData.experienceWithITSMTools && isNaN(Number(formData.experienceWithITSMTools))) {
      newErrors.experienceWithITSMTools = "Please enter a valid number";
    }

    // Validate at least one language is selected
    const validLanguages = formData.languages.filter(lang => lang.trim() !== "");
    if (validLanguages.length === 0) {
      newErrors.languages = "At least one language is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCVMutation = useMutation({
    mutationFn: async (data: InsertCVRecord) => {
      const response = await apiRequest("POST", "/api/cv-records", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "CV record has been successfully captured.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cv-records"] });
      
      // Reset form
      setFormData({
        firstName: "",
        secondName: "",
        thirdName: "",
        surname: "",
        idPassportNumber: "",
        gender: "",
        yearsOfExperience: "",
        sapKLevel: "",
        contactNumber: "",
        email: "",
        position: "",
        department: "",
        languages: [""],
        qualificationType: "",
        qualificationName: ""
      });
    },
    onError: (error: any) => {
      console.error("CV creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to capture CV record. Please check all required fields.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const fullName = [formData.firstName, formData.secondName, formData.thirdName, formData.surname]
      .filter(name => name.trim() !== "")
      .join(" ");

    const validLanguages = formData.languages.filter(lang => lang.trim() !== "");

    const cvData: InsertCVRecord = {
      name: fullName,
      email: formData.email,
      phone: formData.contactNumber,
      position: formData.position,
      department: formData.department,
      experience: parseInt(formData.yearsOfExperience) || 0,
      status: "active",
      cvFile: "",
      languages: validLanguages.join(", "), // Store languages in languages field
      qualifications: formData.qualificationType && formData.qualificationName 
        ? `${formData.qualificationType} - ${formData.qualificationName}`
        : "No qualifications listed" // Combine qualification type and name
    };

    console.log("Submitting CV data:", cvData);
    createCVMutation.mutate(cvData);
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Capture Record</h1>
          <p className="text-gray-600 mt-1">Add a new CV record to the database</p>
        </div>

        <div className="space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="secondName">Second Name (optional)</Label>
                  <Input
                    id="secondName"
                    value={formData.secondName}
                    onChange={(e) => handleInputChange("secondName", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="thirdName">Third Name (optional)</Label>
                  <Input
                    id="thirdName"
                    value={formData.thirdName}
                    onChange={(e) => handleInputChange("thirdName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="surname">Surname *</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => handleInputChange("surname", e.target.value)}
                    className={errors.surname ? "border-red-500" : ""}
                  />
                  {errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idPassportNumber">I.D./Passport Number *</Label>
                  <Input
                    id="idPassportNumber"
                    value={formData.idPassportNumber}
                    onChange={(e) => handleInputChange("idPassportNumber", e.target.value)}
                    className={errors.idPassportNumber ? "border-red-500" : ""}
                  />
                  {errors.idPassportNumber && <p className="text-red-500 text-sm mt-1">{errors.idPassportNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender.toLowerCase()}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Position & Department */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Position | Role & Department
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Departments and roles are synchronized with the Positions | Roles section. 
                Visit the Positions | Roles tab to add or modify available options.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => {
                      // Clear position, role title, and K-level when department changes
                      setFormData(prev => ({
                        ...prev,
                        department: value,
                        position: "",
                        roleTitle: "",
                        sapKLevel: ""
                      }));
                    }}
                  >
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDepartments().map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>
                <div>
                  <Label htmlFor="position">Role *</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => handleInputChange("position", value)}
                    disabled={!formData.department}
                  >
                    <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                      <SelectValue placeholder={formData.department ? "Select role" : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles().map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roleTitle">Role Title *</Label>
                  <Select
                    value={formData.roleTitle}
                    onValueChange={(value) => handleInputChange("roleTitle", value)}
                    disabled={!formData.position}
                  >
                    <SelectTrigger className={errors.roleTitle ? "border-red-500" : ""}>
                      <SelectValue placeholder={formData.position ? "Select role title" : "Select role first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoleTitles().map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roleTitle && <p className="text-red-500 text-sm mt-1">{errors.roleTitle}</p>}
                </div>
                <div>
                  <Label htmlFor="sapKLevel">K-Level (Auto-populated from role)</Label>
                  <Select
                    value={formData.sapKLevel}
                    onValueChange={(value) => handleInputChange("sapKLevel", value)}
                    disabled={!formData.roleTitle}
                  >
                    <SelectTrigger className={formData.roleTitle && formData.sapKLevel ? "bg-green-50" : ""}>
                      <SelectValue placeholder={formData.roleTitle ? "K-Level auto-set from role title" : "Select role title first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableKLevels().map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.roleTitle && formData.sapKLevel && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ K-Level {formData.sapKLevel} automatically set for {formData.roleTitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                    className={errors.yearsOfExperience ? "border-red-500" : ""}
                  />
                  {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
                </div>
                <div>
                  <Label htmlFor="experienceInSimilarRole">Years in Similar Role *</Label>
                  <Input
                    id="experienceInSimilarRole"
                    type="number"
                    min="0"
                    value={formData.experienceInSimilarRole}
                    onChange={(e) => handleInputChange("experienceInSimilarRole", e.target.value)}
                    className={errors.experienceInSimilarRole ? "border-red-500" : ""}
                  />
                  {errors.experienceInSimilarRole && <p className="text-red-500 text-sm mt-1">{errors.experienceInSimilarRole}</p>}
                </div>
                <div>
                  <Label htmlFor="experienceWithITSMTools">Years with ITSM Tools *</Label>
                  <Input
                    id="experienceWithITSMTools"
                    type="number"
                    min="0"
                    value={formData.experienceWithITSMTools}
                    onChange={(e) => handleInputChange("experienceWithITSMTools", e.target.value)}
                    className={errors.experienceWithITSMTools ? "border-red-500" : ""}
                  />
                  {errors.experienceWithITSMTools && <p className="text-red-500 text-sm mt-1">{errors.experienceWithITSMTools}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary of Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Summary of Work Experience
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Add your work history timeline from most recent to earliest experience.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.workExperiences.map((experience, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">
                      Work Experience {index + 1}
                      {index === 0 && " (Most Recent)"}
                    </h4>
                    {formData.workExperiences.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeWorkExperience(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`company-${index}`}>Company Name *</Label>
                      <Input
                        id={`company-${index}`}
                        placeholder="Enter company name"
                        value={experience.companyName}
                        onChange={(e) => handleWorkExperienceChange(index, "companyName", e.target.value)}
                        className={errors[`workExperience${index}Company`] ? "border-red-500" : ""}
                      />
                      {errors[`workExperience${index}Company`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`workExperience${index}Company`]}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`position-${index}`}>Position *</Label>
                      <Input
                        id={`position-${index}`}
                        placeholder="Enter position/role"
                        value={experience.position}
                        onChange={(e) => handleWorkExperienceChange(index, "position", e.target.value)}
                        className={errors[`workExperience${index}Position`] ? "border-red-500" : ""}
                      />
                      {errors[`workExperience${index}Position`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`workExperience${index}Position`]}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${index}`}>Start Date *</Label>
                      <Input
                        id={`startDate-${index}`}
                        type="text"
                        value={experience.startDate}
                        onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)}
                        className={errors[`workExperience${index}StartDate`] ? "border-red-500" : ""}
                        placeholder="MM/YYYY"
                        maxLength={7}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: MM/YYYY (e.g., 01/2020 for Jan 2020)
                      </p>
                      {errors[`workExperience${index}StartDate`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`workExperience${index}StartDate`]}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${index}`}>End Date {!experience.isCurrentRole ? "*" : ""}</Label>
                      <Input
                        id={`endDate-${index}`}
                        type="text"
                        value={experience.endDate}
                        onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)}
                        disabled={experience.isCurrentRole}
                        className={errors[`workExperience${index}EndDate`] ? "border-red-500" : ""}
                        placeholder="MM/YYYY"
                        maxLength={7}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {experience.isCurrentRole ? "Disabled for current role" : "Format: MM/YYYY (e.g., 12/2023 for Dec 2023)"}
                      </p>
                      {errors[`workExperience${index}EndDate`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`workExperience${index}EndDate`]}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id={`currentRole-${index}`}
                        checked={experience.isCurrentRole}
                        onChange={(e) => {
                          handleWorkExperienceChange(index, "isCurrentRole", e.target.checked);
                          if (e.target.checked) {
                            handleWorkExperienceChange(index, "endDate", "");
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`currentRole-${index}`} className="text-sm">
                        Current Role
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addWorkExperience}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Work Experience
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    className={errors.contactNumber ? "border-red-500" : ""}
                  />
                  {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qualifications & Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Qualifications & Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Qualification */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-3">Primary Qualification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="qualificationType">Qualification Type</Label>
                    <Select
                      value={formData.qualificationType}
                      onValueChange={(value) => {
                        handleInputChange("qualificationType", value);
                        // Clear qualification name when type changes
                        handleInputChange("qualificationName", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification type" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUALIFICATION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="qualificationName">Qualification Name</Label>
                    <Select
                      value={formData.qualificationName}
                      onValueChange={(value) => handleInputChange("qualificationName", value)}
                      disabled={!formData.qualificationType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.qualificationType ? "Select qualification name" : "Select qualification type first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableQualificationNames().map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Certificate Upload for Primary Qualification */}
                <div>
                  <Label htmlFor="qualificationCertificate">Upload Certificate (Optional)</Label>
                  <Input
                    id="qualificationCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('qualificationCertificate', e.target.files?.[0] || null)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                  {formData.qualificationCertificate && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Certificate uploaded: {formData.qualificationCertificate.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Other Qualifications */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Other Qualifications</h4>
                {formData.otherQualifications.map((qualification, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-700">
                        Other Qualification {index + 1}
                      </h5>
                      {formData.otherQualifications.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOtherQualification(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`otherQual-${index}`}>Qualification Name</Label>
                        <Input
                          id={`otherQual-${index}`}
                          placeholder="Enter qualification name"
                          value={qualification.name}
                          onChange={(e) => handleOtherQualificationChange(index, "name", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`otherQualCert-${index}`}>Upload Certificate (Optional)</Label>
                        <Input
                          id={`otherQualCert-${index}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('otherQualificationCertificate', e.target.files?.[0] || null, index)}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Accepted formats: PDF, JPG, PNG (Max 10MB)
                        </p>
                        {qualification.certificate && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Certificate uploaded: {(qualification.certificate as File).name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOtherQualification}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Qualification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.languages.map((language, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Select
                      value={language}
                      onValueChange={(value) => handleLanguageChange(index, value)}
                    >
                      <SelectTrigger className={errors.languages && !language ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.languages.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLanguage(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
              <Button
                type="button"
                variant="outline"
                onClick={addLanguage}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={createCVMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {createCVMutation.isPending ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}