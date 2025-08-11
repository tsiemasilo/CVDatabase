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
import { LANGUAGES, GENDERS, SAP_K_LEVELS, QUALIFICATION_TYPES, QUALIFICATION_MAPPINGS, DEPARTMENTS } from "@shared/data";

// Custom checkbox styles and dropdown z-index fix
const checkboxStyles = `
  .checkbox-container {
    display: flex;
    gap: 20px;
    padding: 0;
    background: transparent;
    border-radius: 12px;
  }

  .ios-checkbox {
    --checkbox-size: 24px;
    --checkbox-color: #3b82f6;
    --checkbox-bg: #dbeafe;
    --checkbox-border: #93c5fd;

    position: relative;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .ios-checkbox input {
    display: none;
  }

  .checkbox-wrapper {
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    border-radius: 6px;
    transition: transform 0.2s ease;
  }

  .checkbox-bg {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    border: 2px solid var(--checkbox-border);
    background: white;
    transition: all 0.2s ease;
  }

  .checkbox-icon {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 80%;
    height: 80%;
    color: white;
    transform: scale(0);
    transition: all 0.2s ease;
  }

  .check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    transition: stroke-dashoffset 0.3s ease 0.1s;
  }

  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
    background: var(--checkbox-color);
    border-color: var(--checkbox-color);
  }

  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-icon {
    transform: scale(1);
  }

  .ios-checkbox input:checked + .checkbox-wrapper .check-path {
    stroke-dashoffset: 0;
  }

  .ios-checkbox:hover .checkbox-wrapper {
    transform: scale(1.05);
  }

  .ios-checkbox:active .checkbox-wrapper {
    transform: scale(0.95);
  }

  .ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
    box-shadow: 0 0 0 4px var(--checkbox-bg);
  }

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .ios-checkbox input:checked + .checkbox-wrapper {
    animation: bounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Ensure Select dropdowns appear above all other elements */
  [data-radix-popper-content-wrapper] {
    z-index: 9999 !important;
  }

  [data-radix-select-content] {
    z-index: 9999 !important;
  }

  .radix-select-trigger {
    z-index: auto;
  }
`;

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
  
  // Force clear form function
  const clearForm = () => {
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
      roleTitle: "",
      department: "",
      languages: [""],
      qualificationType: "",
      qualificationName: "",
      instituteName: "",
      yearCompleted: "",
      qualificationCertificate: null as File | null,
      otherQualifications: [] as Array<{ qualificationType: string; qualificationName: string; instituteName: string; yearCompleted: string; certificate: File | null }>,
      certificates: [{ department: "", role: "", certificateName: "", certificateFile: null }],
      experienceInSimilarRole: "",
      experienceWithITSMTools: "",
      workExperiences: [{ companyName: "", position: "", roleTitle: "", startDate: "", endDate: "", isCurrentRole: false }]
    });
    console.log('Form manually cleared');
  };

  // Inject custom checkbox styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = checkboxStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    instituteName: "",
    yearCompleted: "",
    qualificationCertificate: null as File | null,
    otherQualifications: [] as Array<{ qualificationType: string; qualificationName: string; instituteName: string; yearCompleted: string; certificate: File | null }>,
    certificates: [{ department: "", role: "", certificateName: "", certificateFile: null }],
    experienceInSimilarRole: "",
    experienceWithITSMTools: "",
    workExperiences: [{ companyName: "", position: "", roleTitle: "", startDate: "", endDate: "", isCurrentRole: false }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departmentRoles, setDepartmentRoles] = useState<DepartmentRole[]>([]);



  // Clear any cached form data and load departments and roles
  useEffect(() => {
    // Clear any potential cached form data
    localStorage.removeItem('captureFormData');
    sessionStorage.removeItem('captureFormData');
    
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
    
    // Log initial form state to verify it's clean
    console.log('Initial form state on component mount:', {
      firstName: "",
      secondName: "",
      thirdName: "",
      surname: ""
    });
  }, []);

  // Get unique departments from the positions|roles data
  const getAvailableDepartments = () => {
    if (departmentRoles.length === 0) {
      // Fallback to default departments if no data is loaded yet
      return ["SAP", "ICT", "HR", "DEVELOPMENT", "Project Management", "Service Desk"];
    }
    const uniqueDepartments = Array.from(new Set(departmentRoles.map(role => role.department)));
    console.log('Available departments:', uniqueDepartments);
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
    if (departmentRoles.length === 0) {
      // Fallback role titles if no data is loaded yet
      const fallbackRoleTitles: Record<string, string[]> = {
        "SAP ABAP Developer": ["Junior SAP ABAP Developer", "SAP ABAP Developer", "Senior SAP ABAP Developer"],
        "SAP Functional Consultant": ["Junior SAP Functional Consultant", "SAP Functional Consultant", "Senior SAP Functional Consultant"],
        "SAP Technical Consultant": ["Junior SAP Technical Consultant", "SAP Technical Consultant", "Senior SAP Technical Consultant"],
        "IT Support Technician": ["Junior IT Support Technician", "IT Support Technician", "Senior IT Support Technician"],
        "Network Administrator": ["Junior Network Administrator", "Network Administrator", "Senior Network Administrator"],
        "Systems Analyst": ["Junior Systems Analyst", "Systems Analyst", "Senior Systems Analyst"],
        "Junior Developer": ["Junior Developer", "Software Developer"],
        "Software Developer": ["Software Developer", "Senior Software Developer"],
        "Senior Developer": ["Senior Developer", "Lead Developer"],
        "Project Coordinator": ["Project Coordinator", "Senior Project Coordinator"],
        "Project Officer": ["Project Officer", "Senior Project Officer"],
        "Project Manager": ["Project Manager", "Senior Project Manager"]
      };
      return fallbackRoleTitles[formData.position] || [formData.position];
    }
    return departmentRoles
      .filter(role => role.role === formData.position && role.department === formData.department)
      .map(role => role.roleTitle)
      .sort();
  };

  // Get K-level for the selected role title from the positions|roles data
  const getKLevelForRoleTitle = (roleTitle: string) => {
    if (!roleTitle || !formData.position || !formData.department) return "";
    
    // For SAP department, determine K-level based on role title seniority
    if (formData.department === "SAP") {
      if (roleTitle.toLowerCase().includes("junior") || roleTitle.toLowerCase().includes("entry")) return "K1";
      if (roleTitle.toLowerCase().includes("senior") || roleTitle.toLowerCase().includes("lead")) return "K4";
      if (roleTitle.toLowerCase().includes("architect") || roleTitle.toLowerCase().includes("principal")) return "K5";
      return "K3"; // Default for mid-level
    }
    
    if (departmentRoles.length === 0) return "";
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

  // Get qualification names for a specific qualification type (for additional qualifications)
  const getQualificationNamesByType = (qualificationType: string) => {
    if (!qualificationType) return [];
    const selectedMapping = QUALIFICATION_MAPPINGS.find(q => q.type === qualificationType);
    return selectedMapping ? selectedMapping.names : [];
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Field ${field} changed to:`, value);
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
    if ((formData.languages || []).length > 1) {
      const newLanguages = (formData.languages || []).filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        languages: newLanguages
      }));
    }
  };

  const formatDateInput = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 6);
    }
    return digits;
  };

  const handleWorkExperienceChange = (index: number, field: string, value: string | boolean) => {
    let processedValue = value;
    
    // Format date fields automatically
    if ((field === 'startDate' || field === 'endDate') && typeof value === 'string') {
      processedValue = formatDateInput(value);
    }
    
    const newWorkExperiences = [...(formData.workExperiences || [])];
    newWorkExperiences[index] = { ...newWorkExperiences[index], [field]: processedValue };
    setFormData(prev => ({
      ...prev,
      workExperiences: newWorkExperiences
    }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperiences: [...(prev.workExperiences || []), { companyName: "", position: "", roleTitle: "", startDate: "", endDate: "", isCurrentRole: false }]
    }));
  };

  const removeWorkExperience = (index: number) => {
    if ((formData.workExperiences || []).length > 1) {
      const newWorkExperiences = (formData.workExperiences || []).filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        workExperiences: newWorkExperiences
      }));
    }
  };

  const handleOtherQualificationChange = (index: number, field: string, value: string | File | null) => {
    const newOtherQualifications = [...(formData.otherQualifications || [])];
    newOtherQualifications[index] = { ...newOtherQualifications[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      otherQualifications: newOtherQualifications
    }));
  };

  const addOtherQualification = () => {
    setFormData(prev => ({
      ...prev,
      otherQualifications: [...(prev.otherQualifications || []), { qualificationType: "", qualificationName: "", instituteName: "", yearCompleted: "", certificate: null }]
    }));
  };

  const removeOtherQualification = (index: number) => {
    const newOtherQualifications = (formData.otherQualifications || []).filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      otherQualifications: newOtherQualifications
    }));
  };

  const handleFileUpload = (field: string, file: File | null, index?: number) => {
    if (field === 'qualificationCertificate') {
      setFormData(prev => ({
        ...prev,
        qualificationCertificate: file
      }));

    } else if (field === 'otherQualificationCertificate' && index !== undefined) {
      handleOtherQualificationChange(index, 'certificate', file);
    } else if (field === 'certificateFile' && index !== undefined) {
      handleCertificateChange(index, 'certificateFile', file);
    }
  };

  // Certificate handlers
  const handleCertificateChange = (index: number, field: string, value: string | File | null) => {
    console.log('Certificate change:', index, field, value);
    const newCertificates = [...(formData.certificates || [])];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    console.log('Updated certificates:', newCertificates);
    setFormData(prev => ({
      ...prev,
      certificates: newCertificates
    }));
  };

  const addCertificate = () => {
    setFormData(prev => ({
      ...prev,
      certificates: [...(prev.certificates || []), { department: "", role: "", certificateName: "", certificateFile: null }]
    }));
  };

  const removeCertificate = (index: number) => {
    if ((formData.certificates || []).length > 1) {
      const newCertificates = (formData.certificates || []).filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        certificates: newCertificates
      }));
    }
  };

  // Get available departments for certificates (from positions|roles data)
  const getCertificateDepartments = () => {
    const departments = getAvailableDepartments();
    console.log('Certificate departments:', departments);
    return departments;
  };

  // Get available roles for a department (from positions|roles data)
  const getCertificateRoles = (department: string) => {
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
      const roles = fallbackRoles[department] || [];
      console.log('Roles for', department, ':', roles);
      return roles;
    }
    const roles = departmentRoles
      .filter(role => role.department === department)
      .map(role => role.role)
      .filter((role, index, self) => self.indexOf(role) === index); // Remove duplicates
    console.log('Roles for', department, ':', roles);
    return roles.sort();
  };

  // Get available certificate names for department and role
  const getCertificateNames = (department: string, role: string) => {
    // Generate certificates based on department and role
    const certificatesByRole: Record<string, string[]> = {
      // Development certificates
      "Junior Developer": [
        "HTML5 Fundamentals Certificate", 
        "CSS3 Advanced Styling Certificate", 
        "JavaScript ES6+ Certificate", 
        "React Basics Certificate", 
        "Git Version Control Certificate", 
        "Responsive Web Design Certificate", 
        "Bootstrap Framework Certificate", 
        "Basic SQL Certificate", 
        "API Integration Certificate", 
        "Agile Development Certificate"
      ],
      "Software Developer": [
        "Full Stack Development Certificate", 
        "Node.js Backend Certificate", 
        "Database Management Certificate", 
        "Cloud Computing Basics Certificate", 
        "Software Testing Certificate", 
        "DevOps Fundamentals Certificate", 
        "Security Best Practices Certificate", 
        "Performance Optimization Certificate", 
        "Code Review Practices Certificate", 
        "System Architecture Certificate"
      ],
      "Senior Developer": [
        "Advanced System Architecture Certificate", 
        "Team Leadership Certificate", 
        "Code Quality Standards Certificate", 
        "Advanced Security Certificate", 
        "Microservices Architecture Certificate", 
        "Advanced Cloud Computing Certificate", 
        "Performance Tuning Certificate", 
        "Technical Mentoring Certificate", 
        "Project Management Certificate", 
        "Enterprise Development Certificate"
      ],
      // SAP certificates
      "SAP ABAP Developer": [
        "SAP ABAP Programming Certificate", 
        "SAP Data Dictionary Certificate", 
        "SAP Module Pool Programming Certificate", 
        "SAP Reports Development Certificate", 
        "SAP Enhancement Framework Certificate", 
        "SAP Workflow Certificate", 
        "SAP IDOC Processing Certificate", 
        "SAP BAdI Implementation Certificate", 
        "SAP Performance Optimization Certificate", 
        "SAP Debugging Techniques Certificate"
      ],
      "SAP Functional Consultant": [
        "SAP FI/CO Configuration Certificate", 
        "SAP SD Configuration Certificate", 
        "SAP MM Configuration Certificate", 
        "SAP Business Process Certificate", 
        "SAP Integration Certificate", 
        "SAP Customization Certificate", 
        "SAP User Training Certificate", 
        "SAP Testing Methodology Certificate", 
        "SAP Documentation Certificate", 
        "SAP Go-Live Support Certificate"
      ],
      "SAP Technical Consultant": [
        "SAP Basis Administration Certificate", 
        "SAP HANA Database Certificate", 
        "SAP System Integration Certificate", 
        "SAP Performance Monitoring Certificate", 
        "SAP Security Configuration Certificate", 
        "SAP Transport Management Certificate", 
        "SAP System Upgrade Certificate", 
        "SAP Backup & Recovery Certificate", 
        "SAP Monitoring Tools Certificate", 
        "SAP Technical Architecture Certificate"
      ],
      // ICT certificates
      "IT Support Technician": [
        "CompTIA A+ Certificate", 
        "Windows 10/11 Support Certificate", 
        "Hardware Troubleshooting Certificate", 
        "Network Basics Certificate", 
        "Help Desk Operations Certificate", 
        "Customer Service Certificate", 
        "Remote Support Tools Certificate", 
        "IT Documentation Certificate", 
        "Software Installation Certificate", 
        "Basic Security Certificate"
      ],
      "Network Administrator": [
        "Cisco CCNA Certificate", 
        "Network Security Certificate", 
        "Windows Server Administration Certificate", 
        "Network Monitoring Certificate", 
        "Firewall Configuration Certificate", 
        "VPN Setup Certificate", 
        "Network Troubleshooting Certificate", 
        "IP Address Management Certificate", 
        "Network Documentation Certificate", 
        "Wireless Network Certificate"
      ],
      "Systems Analyst": [
        "Systems Analysis Certificate", 
        "Requirements Gathering Certificate", 
        "Business Process Analysis Certificate", 
        "Data Flow Analysis Certificate", 
        "System Design Certificate", 
        "Testing Methodology Certificate", 
        "Project Management Certificate", 
        "Database Analysis Certificate", 
        "User Acceptance Testing Certificate", 
        "Technical Documentation Certificate"
      ],
      // HR certificates
      "HR Assistant": [
        "HR Administration Certificate", 
        "Employee Records Management Certificate", 
        "Payroll Processing Certificate", 
        "Benefits Administration Certificate", 
        "HR Compliance Certificate", 
        "Employee Communication Certificate", 
        "HRIS Software Certificate", 
        "HR Documentation Certificate", 
        "Time & Attendance Certificate", 
        "Customer Service Certificate"
      ],
      "Recruitment Coordinator": [
        "Recruitment Strategy Certificate", 
        "Candidate Screening Certificate", 
        "Interview Techniques Certificate", 
        "Job Posting Optimization Certificate", 
        "Applicant Tracking Systems Certificate", 
        "Background Check Procedures Certificate", 
        "Employment Law Certificate", 
        "Diversity & Inclusion Certificate", 
        "Onboarding Process Certificate", 
        "Talent Acquisition Certificate"
      ],
      "HR Business Partner": [
        "Strategic HR Management Certificate", 
        "Performance Management Certificate", 
        "Employee Relations Certificate", 
        "Change Management Certificate", 
        "Leadership Development Certificate", 
        "Organizational Development Certificate", 
        "HR Analytics Certificate", 
        "Compensation Planning Certificate", 
        "Succession Planning Certificate", 
        "Employee Engagement Certificate"
      ],
      // Project Management certificates
      "Project Coordinator": [
        "Project Management Basics Certificate", 
        "MS Project Software Certificate", 
        "Task Scheduling Certificate", 
        "Team Coordination Certificate", 
        "Meeting Management Certificate", 
        "Documentation Management Certificate", 
        "Risk Identification Certificate", 
        "Communication Skills Certificate", 
        "Quality Assurance Certificate", 
        "Stakeholder Management Certificate"
      ],
      "Project Officer": [
        "Project Planning Certificate", 
        "Budget Management Certificate", 
        "Resource Allocation Certificate", 
        "Progress Monitoring Certificate", 
        "Risk Management Certificate", 
        "Quality Control Certificate", 
        "Vendor Management Certificate", 
        "Project Reporting Certificate", 
        "Change Control Certificate", 
        "Project Closure Certificate"
      ],
      "Project Manager": [
        "PMP Certification", 
        "PRINCE2 Certificate", 
        "Agile Project Management Certificate", 
        "Scrum Master Certificate", 
        "Advanced Risk Management Certificate", 
        "Strategic Planning Certificate", 
        "Leadership in Projects Certificate", 
        "Financial Project Management Certificate", 
        "Multi-Project Management Certificate", 
        "Portfolio Management Certificate"
      ],
      // Service Desk certificates
      "Service Desk Agent": [
        "ITIL Foundation Certificate", 
        "Customer Service Excellence Certificate", 
        "Incident Management Certificate", 
        "Service Request Handling Certificate", 
        "Communication Skills Certificate", 
        "Problem-Solving Certificate", 
        "Help Desk Software Certificate", 
        "Time Management Certificate", 
        "Technical Writing Certificate", 
        "Conflict Resolution Certificate"
      ],
      "Technical Support Specialist": [
        "Advanced Troubleshooting Certificate", 
        "Technical Communication Certificate", 
        "System Diagnostics Certificate", 
        "Remote Support Tools Certificate", 
        "Knowledge Management Certificate", 
        "Process Improvement Certificate", 
        "Training Delivery Certificate", 
        "Quality Assurance Certificate", 
        "Technical Documentation Certificate", 
        "Customer Relationship Management Certificate"
      ],
      "Service Desk Analyst": [
        "Service Desk Management Certificate", 
        "Performance Metrics Certificate", 
        "Process Analysis Certificate", 
        "Team Leadership Certificate", 
        "Workflow Optimization Certificate", 
        "Reporting & Analytics Certificate", 
        "Continuous Improvement Certificate", 
        "Service Level Management Certificate", 
        "Knowledge Base Management Certificate", 
        "Strategic Planning Certificate"
      ]
    };

    const certificates = certificatesByRole[role] || [];
    console.log('Certificates for', department, role, ':', certificates);
    return certificates;
  };



  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.surname.trim()) newErrors.surname = "Surname is required";
    if (!formData.idPassportNumber.trim()) {
      newErrors.idPassportNumber = "ID/Passport number is required";
    } else if (!/^\d{13}$/.test(formData.idPassportNumber)) {
      newErrors.idPassportNumber = "ID/Passport number must be exactly 13 digits";
    }
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
    (formData.workExperiences || []).forEach((exp, index) => {
      if (!exp.companyName.trim()) newErrors[`workExperience${index}Company`] = "Company name is required";
      if (!exp.position.trim()) newErrors[`workExperience${index}Position`] = "Position is required";
      if (!exp.startDate.trim()) {
        newErrors[`workExperience${index}StartDate`] = "Start date is required";
      } else if (!/^\d{2}\/\d{4}$/.test(exp.startDate)) {
        newErrors[`workExperience${index}StartDate`] = "Please use MM/YYYY format (e.g., 01/2020)";
      }
      if (!exp.isCurrentRole && !exp.endDate.trim()) {
        newErrors[`workExperience${index}EndDate`] = "End date is required for non-current roles";
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
    const validLanguages = (formData.languages || []).filter(lang => lang.trim() !== "");
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
    onSuccess: (newRecord) => {
      toast({
        title: "Success",
        description: "CV record has been successfully captured.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cv-records"] });
      
      // Store the record ID for the success page
      localStorage.setItem('lastSubmittedRecordId', newRecord.id.toString());
      
      // Redirect to success page
      window.location.href = `?success=true&recordId=${newRecord.id}`;
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

    const firstNames = [formData.firstName, formData.secondName, formData.thirdName]
      .filter(name => name.trim() !== "")
      .join(" ");

    const validLanguages = (formData.languages || []).filter(lang => lang.trim() !== "");

    const cvData: InsertCVRecord = {
      name: firstNames,
      surname: formData.surname,
      idPassport: formData.idPassportNumber,
      gender: formData.gender,
      email: formData.email,
      phone: formData.contactNumber,
      position: formData.position,
      roleTitle: formData.roleTitle,
      department: formData.department,
      experience: parseInt(formData.yearsOfExperience) || 0,
      experienceInSimilarRole: parseInt(formData.experienceInSimilarRole) || 0,
      experienceWithITSMTools: parseInt(formData.experienceWithITSMTools) || 0,
      sapKLevel: formData.sapKLevel,
      status: "active",
      cvFile: "",
      languages: validLanguages.join(", "),
      qualifications: formData.qualificationType && formData.qualificationName 
        ? `${formData.qualificationType} - ${formData.qualificationName}`
        : "No qualifications listed",
      qualificationType: formData.qualificationType,
      qualificationName: formData.qualificationName,
      instituteName: formData.instituteName,
      yearCompleted: formData.yearCompleted,
      workExperiences: formData.workExperiences ? JSON.stringify(formData.workExperiences) : undefined,
      certificateTypes: formData.certificates ? JSON.stringify(formData.certificates) : undefined
    };

    console.log("Form data before submission:", formData);
    console.log("First names array:", [formData.firstName, formData.secondName, formData.thirdName]);
    console.log("firstNames concatenated:", firstNames);
    console.log("Surname:", formData.surname);
    console.log("Role title value:", formData.roleTitle);
    console.log("SAP K-level value:", formData.sapKLevel);
    console.log("Final CV data being submitted:", cvData);
    createCVMutation.mutate(cvData);
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Capture Record</h1>
            <p className="text-gray-600 mt-1">Add a new CV record to the database</p>
          </div>
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
                    autoComplete="off"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="secondName">Second Name (optional)</Label>
                  <Input
                    id="secondName"
                    value={formData.secondName}
                    onChange={(e) => handleInputChange("secondName", e.target.value)}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="Enter your second name (optional)"
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
                    autoComplete="off"
                    placeholder="Enter your third name (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="surname">Surname *</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => handleInputChange("surname", e.target.value)}
                    className={errors.surname ? "border-red-500" : ""}
                    autoComplete="off"
                    placeholder="Enter your surname"
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
                    onChange={(e) => {
                      // Only allow digits and limit to 13 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                      handleInputChange("idPassportNumber", value);
                    }}
                    className={errors.idPassportNumber ? "border-red-500" : ""}
                    placeholder="Enter 13-digit ID number"
                    maxLength={13}
                    pattern="[0-9]{13}"
                    inputMode="numeric"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be exactly 13 digits</p>
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
              {(formData.workExperiences || []).map((experience, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">
                      Work Experience {index + 1}
                      {index === 0 && " (Most Recent)"}
                    </h4>
                    {(formData.workExperiences || []).length > 1 && (
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    <div>
                      <Label htmlFor={`roleTitle-${index}`}>Role Title</Label>
                      <Input
                        id={`roleTitle-${index}`}
                        placeholder="Enter specific role title"
                        value={experience.roleTitle || ''}
                        onChange={(e) => handleWorkExperienceChange(index, "roleTitle", e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Optional: Specific title/designation for this role
                      </p>
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
                    <div className="flex items-center space-x-3 mt-6">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700 select-none">
                          Current Role
                        </span>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={experience.isCurrentRole === true}
                            onChange={(e) => {
                              console.log('Before change:', experience.isCurrentRole, 'New value:', e.target.checked);
                              const newWorkExperiences = [...(formData.workExperiences || [])];
                              newWorkExperiences[index] = { 
                                ...newWorkExperiences[index], 
                                isCurrentRole: e.target.checked,
                                endDate: e.target.checked ? "" : newWorkExperiences[index].endDate
                              };
                              setFormData(prev => ({
                                ...prev,
                                workExperiences: newWorkExperiences
                              }));
                              console.log('After change should be:', e.target.checked);
                            }}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                            experience.isCurrentRole 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'bg-white border-gray-300 hover:border-blue-400'
                          }`}>
                            {experience.isCurrentRole && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </label>
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
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Qualifications & Certificates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 overflow-visible">
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
                
                {/* Institute Name and Year Completed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instituteName">Institute Name</Label>
                    <Input
                      id="instituteName"
                      value={formData.instituteName || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, instituteName: e.target.value }))}
                      placeholder="Enter institute name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearCompleted">Year Completed</Label>
                    <Input
                      id="yearCompleted"
                      value={formData.yearCompleted || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearCompleted: e.target.value }))}
                      placeholder="e.g., 2023"
                      className="mt-1"
                    />
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
                      ✓ Certificate uploaded: {(formData.qualificationCertificate as File).name}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Qualifications */}
              {(formData.otherQualifications && formData.otherQualifications.length > 0) && (
                <div className="space-y-4 mt-6 relative">
                  {formData.otherQualifications.map((qualification, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-gray-50 relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-medium text-gray-700 text-base">
                          Additional Qualification {index + 1}
                        </h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOtherQualification(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="relative z-20">
                          <Label htmlFor={`otherQualType${index}`}>Qualification Type</Label>
                          <Select
                            value={qualification.qualificationType || ""}
                            onValueChange={(value) => {
                              handleOtherQualificationChange(index, 'qualificationType', value);
                              // Clear qualification name when type changes
                              handleOtherQualificationChange(index, 'qualificationName', "");
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select qualification type" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {QUALIFICATION_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="relative z-20">
                          <Label htmlFor={`otherQualName${index}`}>Qualification Name</Label>
                          <Select
                            value={qualification.qualificationName || ""}
                            onValueChange={(value) => handleOtherQualificationChange(index, 'qualificationName', value)}
                            disabled={!qualification.qualificationType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={qualification.qualificationType ? "Select qualification name" : "Select qualification type first"} />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {qualification.qualificationType && getQualificationNamesByType(qualification.qualificationType).map((name) => (
                                <SelectItem key={name} value={name}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Institute Name and Year Completed */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`otherInstName${index}`}>Institute Name</Label>
                          <Input
                            id={`otherInstName${index}`}
                            value={qualification.instituteName || ""}
                            onChange={(e) => handleOtherQualificationChange(index, 'instituteName', e.target.value)}
                            placeholder="Enter institute name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`otherYearComp${index}`}>Year Completed</Label>
                          <Input
                            id={`otherYearComp${index}`}
                            value={qualification.yearCompleted || ""}
                            onChange={(e) => handleOtherQualificationChange(index, 'yearCompleted', e.target.value)}
                            placeholder="e.g., 2020"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div></div>
                        
                        <div>
                          <Label htmlFor={`otherQualCert${index}`}>Upload Certificate (Optional)</Label>
                          <Input
                            id={`otherQualCert${index}`}
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
                </div>
              )}

              {/* Add Another Qualification Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addOtherQualification}
                className="w-full mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Qualification
              </Button>





            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold" style={{ color: 'rgb(0, 0, 83)' }}>
                Certificate Type & Certificate Name
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(formData.certificates || []).map((certificate, index) => (
                <div key={index} className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-gray-700 text-base">
                      Certificate {index + 1}
                    </h5>
                    {(formData.certificates || []).length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCertificate(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`certDept-${index}`} className="text-sm font-medium text-gray-700">Department</Label>
                      <Select
                        value={certificate.department}
                        onValueChange={(value) => {
                          const newCertificates = [...(formData.certificates || [])];
                          newCertificates[index] = { 
                            ...newCertificates[index], 
                            department: value,
                            role: "",
                            certificateName: ""
                          };
                          setFormData(prev => ({
                            ...prev,
                            certificates: newCertificates
                          }));
                        }}
                      >
                        <SelectTrigger id={`certDept-${index}`} className="mt-1">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCertificateDepartments().map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`certRole-${index}`} className="text-sm font-medium text-gray-700">Role</Label>
                      <Select
                        value={certificate.role}
                        onValueChange={(value) => {
                          const newCertificates = [...(formData.certificates || [])];
                          newCertificates[index] = { 
                            ...newCertificates[index], 
                            role: value,
                            certificateName: ""
                          };
                          setFormData(prev => ({
                            ...prev,
                            certificates: newCertificates
                          }));
                        }}
                        disabled={!certificate.department}
                      >
                        <SelectTrigger id={`certRole-${index}`} className="mt-1">
                          <SelectValue placeholder={certificate.department ? "Select role" : "Select department first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getCertificateRoles(certificate.department).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`certName-${index}`} className="text-sm font-medium text-gray-700">Certificate Name</Label>
                      <Select
                        value={certificate.certificateName}
                        onValueChange={(value) => {
                          handleCertificateChange(index, "certificateName", value);
                        }}
                        disabled={!certificate.department || !certificate.role}
                      >
                        <SelectTrigger id={`certName-${index}`} className="mt-1">
                          <SelectValue placeholder={certificate.department && certificate.role ? "Select certificate" : "Select department & role first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getCertificateNames(certificate.department, certificate.role).map((cert) => (
                            <SelectItem key={cert} value={cert}>
                              {cert}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`certFile-${index}`} className="text-sm font-medium text-gray-700">Upload Certificate (Optional)</Label>
                    <div className="mt-1 flex items-center justify-center w-full">
                      <label htmlFor={`certFile-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Choose File</span> No file chosen
                          </p>
                          <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max 10MB)</p>
                        </div>
                        <Input
                          id={`certFile-${index}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('certificateFile', e.target.files?.[0] || null, index)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {certificate.certificateFile && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Certificate uploaded: {(certificate.certificateFile as File).name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addCertificate}
                className="w-full mt-4 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Certificate
              </Button>
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
              {(formData.languages || []).map((language, index) => (
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
                  {(formData.languages || []).length > 1 && (
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