import { useState } from "react";
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
import { DEPARTMENTS, ROLES, LANGUAGES, GENDERS, SAP_K_LEVELS, QUALIFICATION_TYPES, QUALIFICATION_NAMES } from "@shared/data";

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
    department: "",
    languages: [""],
    qualificationType: "",
    qualificationName: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get unique role names for the selected department
  const getAvailableRoles = () => {
    if (!formData.department) return [];
    return ROLES
      .filter(role => role.department === formData.department)
      .map(role => role.role);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
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
    if (!formData.department) newErrors.department = "Department is required";

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate years of experience is a number
    if (formData.yearsOfExperience && isNaN(Number(formData.yearsOfExperience))) {
      newErrors.yearsOfExperience = "Please enter a valid number";
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => {
                      handleInputChange("department", value);
                      // Clear position when department changes
                      handleInputChange("position", "");
                    }}
                  >
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
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
                  <Label htmlFor="sapKLevel">SAP K Level</Label>
                  <Select
                    value={formData.sapKLevel}
                    onValueChange={(value) => handleInputChange("sapKLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select SAP K Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAP_K_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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

          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qualificationType">Qualification Type</Label>
                  <Select
                    value={formData.qualificationType}
                    onValueChange={(value) => handleInputChange("qualificationType", value)}
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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification name" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALIFICATION_NAMES.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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