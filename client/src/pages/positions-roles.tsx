import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useRoleAccess } from '@/hooks/useRoleAccess';

interface DepartmentRole {
  id: number;
  department: string;
  role: string;
  roleTitle: string;
  description: string;
  kLevel: string;
}

const getDefaultRecords = (): DepartmentRole[] => [
  // SAP Department - K1 (Entry Level)
  { id: 1, department: "SAP", role: "SAP ABAP Developer", roleTitle: "SAP ABAP Programmer", description: "Entry-level ABAP programming and development", kLevel: "K1" },
  { id: 2, department: "SAP", role: "SAP ABAP Developer", roleTitle: "Junior SAP Developer", description: "Entry-level ABAP programming and development", kLevel: "K1" },
  { id: 3, department: "SAP", role: "SAP ABAP Developer", roleTitle: "SAP Technical Trainee", description: "Entry-level ABAP programming and development", kLevel: "K1" },
  { id: 4, department: "SAP", role: "SAP ABAP Developer", roleTitle: "SAP Systems Analyst", description: "Entry-level ABAP programming and development", kLevel: "K1" },
  { id: 5, department: "SAP", role: "SAP ABAP Developer", roleTitle: "SAP Application Developer", description: "Entry-level ABAP programming and development", kLevel: "K1" },
  
  // SAP Department - K2 (Junior Level)
  { id: 6, department: "SAP", role: "SAP Functional Consultant", roleTitle: "SAP FI/CO Consultant", description: "Junior consultant for SAP modules implementation", kLevel: "K2" },
  { id: 7, department: "SAP", role: "SAP Functional Consultant", roleTitle: "SAP SD Consultant", description: "Junior consultant for SAP modules implementation", kLevel: "K2" },
  { id: 8, department: "SAP", role: "SAP Functional Consultant", roleTitle: "SAP MM Consultant", description: "Junior consultant for SAP modules implementation", kLevel: "K2" },
  { id: 9, department: "SAP", role: "SAP Functional Consultant", roleTitle: "SAP HR Consultant", description: "Junior consultant for SAP modules implementation", kLevel: "K2" },
  { id: 10, department: "SAP", role: "SAP Functional Consultant", roleTitle: "SAP PP Consultant", description: "Junior consultant for SAP modules implementation", kLevel: "K2" },
  
  // SAP Department - K3 (Independent Level)
  { id: 11, department: "SAP", role: "SAP Technical Consultant", roleTitle: "Senior SAP Basis Administrator", description: "Independent technical implementation specialist", kLevel: "K3" },
  { id: 12, department: "SAP", role: "SAP Technical Consultant", roleTitle: "SAP Security Consultant", description: "Independent technical implementation specialist", kLevel: "K3" },
  { id: 13, department: "SAP", role: "SAP Technical Consultant", roleTitle: "SAP Integration Specialist", description: "Independent technical implementation specialist", kLevel: "K3" },
  { id: 14, department: "SAP", role: "SAP Technical Consultant", roleTitle: "SAP Workflow Developer", description: "Independent technical implementation specialist", kLevel: "K3" },
  { id: 15, department: "SAP", role: "SAP Technical Consultant", roleTitle: "SAP PI/PO Consultant", description: "Independent technical implementation specialist", kLevel: "K3" },
  
  // SAP Department - K4 (Senior Level)
  { id: 16, department: "SAP", role: "SAP Solution Architect", roleTitle: "SAP Enterprise Solutions Manager", description: "Senior lead for enterprise SAP solutions", kLevel: "K4" },
  { id: 17, department: "SAP", role: "SAP Solution Architect", roleTitle: "SAP Technical Lead", description: "Senior lead for enterprise SAP solutions", kLevel: "K4" },
  { id: 18, department: "SAP", role: "SAP Solution Architect", roleTitle: "SAP Project Manager", description: "Senior lead for enterprise SAP solutions", kLevel: "K4" },
  { id: 19, department: "SAP", role: "SAP Solution Architect", roleTitle: "SAP Practice Manager", description: "Senior lead for enterprise SAP solutions", kLevel: "K4" },
  { id: 20, department: "SAP", role: "SAP Solution Architect", roleTitle: "SAP Business Analyst", description: "Senior lead for enterprise SAP solutions", kLevel: "K4" },
  
  // SAP Department - K5 (Master Level)
  { id: 21, department: "SAP", role: "SAP Master Architect", roleTitle: "Chief SAP Technology Officer", description: "Master-level SAP enterprise architect", kLevel: "K5" },
  { id: 22, department: "SAP", role: "SAP Master Architect", roleTitle: "SAP Centre of Excellence Head", description: "Master-level SAP enterprise architect", kLevel: "K5" },
  { id: 23, department: "SAP", role: "SAP Master Architect", roleTitle: "SAP Strategy Director", description: "Master-level SAP enterprise architect", kLevel: "K5" },
  { id: 24, department: "SAP", role: "SAP Master Architect", roleTitle: "SAP Global Practice Lead", description: "Master-level SAP enterprise architect", kLevel: "K5" },
  { id: 25, department: "SAP", role: "SAP Master Architect", roleTitle: "SAP Enterprise Architect", description: "Master-level SAP enterprise architect", kLevel: "K5" },
  
  // DEVELOPMENT Department - K1 (Entry Level)
  { id: 26, department: "DEVELOPMENT", role: "Junior Developer", roleTitle: "Software Developer", description: "Entry-level software development and coding", kLevel: "K1" },
  { id: 27, department: "DEVELOPMENT", role: "Junior Developer", roleTitle: "Junior Web Developer", description: "Entry-level software development and coding", kLevel: "K1" },
  { id: 28, department: "DEVELOPMENT", role: "Junior Developer", roleTitle: "Junior Mobile Developer", description: "Entry-level software development and coding", kLevel: "K1" },
  { id: 29, department: "DEVELOPMENT", role: "Junior Developer", roleTitle: "Junior Database Developer", description: "Entry-level software development and coding", kLevel: "K1" },
  { id: 30, department: "DEVELOPMENT", role: "Junior Developer", roleTitle: "Junior QA Tester", description: "Entry-level software development and coding", kLevel: "K1" },
  
  // DEVELOPMENT Department - K2 (Junior Level)
  { id: 31, department: "DEVELOPMENT", role: "Software Developer", roleTitle: "Application Developer", description: "Junior application development specialist", kLevel: "K2" },
  { id: 32, department: "DEVELOPMENT", role: "Software Developer", roleTitle: "Frontend Developer", description: "Junior application development specialist", kLevel: "K2" },
  { id: 33, department: "DEVELOPMENT", role: "Software Developer", roleTitle: "Backend Developer", description: "Junior application development specialist", kLevel: "K2" },
  { id: 34, department: "DEVELOPMENT", role: "Software Developer", roleTitle: "Full Stack Developer", description: "Junior application development specialist", kLevel: "K2" },
  { id: 35, department: "DEVELOPMENT", role: "Software Developer", roleTitle: "API Developer", description: "Junior application development specialist", kLevel: "K2" },
  
  // DEVELOPMENT Department - K3 (Independent Level)
  { id: 36, department: "DEVELOPMENT", role: "Senior Developer", roleTitle: "Senior Software Engineer", description: "Independent full-stack development expert", kLevel: "K3" },
  { id: 37, department: "DEVELOPMENT", role: "Senior Developer", roleTitle: "Senior Frontend Engineer", description: "Independent full-stack development expert", kLevel: "K3" },
  { id: 38, department: "DEVELOPMENT", role: "Senior Developer", roleTitle: "Senior Backend Engineer", description: "Independent full-stack development expert", kLevel: "K3" },
  { id: 39, department: "DEVELOPMENT", role: "Senior Developer", roleTitle: "Senior Full Stack Engineer", description: "Independent full-stack development expert", kLevel: "K3" },
  { id: 40, department: "DEVELOPMENT", role: "Senior Developer", roleTitle: "Lead Developer", description: "Independent full-stack development expert", kLevel: "K3" },
  
  // DEVELOPMENT Department - K4 (Senior Level)
  { id: 41, department: "DEVELOPMENT", role: "Development Team Lead", roleTitle: "Technical Team Leader", description: "Senior lead for development teams", kLevel: "K4" },
  { id: 42, department: "DEVELOPMENT", role: "Development Team Lead", roleTitle: "Software Engineering Manager", description: "Senior lead for development teams", kLevel: "K4" },
  { id: 43, department: "DEVELOPMENT", role: "Development Team Lead", roleTitle: "Development Manager", description: "Senior lead for development teams", kLevel: "K4" },
  { id: 44, department: "DEVELOPMENT", role: "Development Team Lead", roleTitle: "Principal Software Engineer", description: "Senior lead for development teams", kLevel: "K4" },
  { id: 45, department: "DEVELOPMENT", role: "Development Team Lead", roleTitle: "Technical Director", description: "Senior lead for development teams", kLevel: "K4" },
  
  // DEVELOPMENT Department - K5 (Master Level)
  { id: 46, department: "DEVELOPMENT", role: "Chief Technology Architect", roleTitle: "Chief Software Architect", description: "Master-level software architecture leadership", kLevel: "K5" },
  { id: 47, department: "DEVELOPMENT", role: "Chief Technology Architect", roleTitle: "VP of Engineering", description: "Master-level software architecture leadership", kLevel: "K5" },
  { id: 48, department: "DEVELOPMENT", role: "Chief Technology Architect", roleTitle: "Chief Technology Officer", description: "Master-level software architecture leadership", kLevel: "K5" },
  { id: 49, department: "DEVELOPMENT", role: "Chief Technology Architect", roleTitle: "Head of Software Development", description: "Master-level software architecture leadership", kLevel: "K5" },
  { id: 50, department: "DEVELOPMENT", role: "Chief Technology Architect", roleTitle: "Enterprise Architect", description: "Master-level software architecture leadership", kLevel: "K5" },
  
  // ICT Department - K1 (Entry Level)
  { id: 51, department: "ICT", role: "IT Support Technician", roleTitle: "IT Help Desk Technician", description: "Entry-level technical support and maintenance", kLevel: "K1" },
  { id: 52, department: "ICT", role: "IT Support Technician", roleTitle: "Junior IT Support Specialist", description: "Entry-level technical support and maintenance", kLevel: "K1" },
  { id: 53, department: "ICT", role: "IT Support Technician", roleTitle: "Desktop Support Technician", description: "Entry-level technical support and maintenance", kLevel: "K1" },
  { id: 54, department: "ICT", role: "IT Support Technician", roleTitle: "PC Technician", description: "Entry-level technical support and maintenance", kLevel: "K1" },
  { id: 55, department: "ICT", role: "IT Support Technician", roleTitle: "Hardware Technician", description: "Entry-level technical support and maintenance", kLevel: "K1" },
  
  // ICT Department - K2 (Junior Level)
  { id: 56, department: "ICT", role: "Network Administrator", roleTitle: "Network Infrastructure Officer", description: "Junior network management and configuration", kLevel: "K2" },
  { id: 57, department: "ICT", role: "Network Administrator", roleTitle: "Junior Network Engineer", description: "Junior network management and configuration", kLevel: "K2" },
  { id: 58, department: "ICT", role: "Network Administrator", roleTitle: "System Administrator", description: "Junior network management and configuration", kLevel: "K2" },
  { id: 59, department: "ICT", role: "Network Administrator", roleTitle: "Network Technician", description: "Junior network management and configuration", kLevel: "K2" },
  { id: 60, department: "ICT", role: "Network Administrator", roleTitle: "Server Administrator", description: "Junior network management and configuration", kLevel: "K2" },
  
  // ICT Department - K3 (Independent Level)
  { id: 61, department: "ICT", role: "Systems Analyst", roleTitle: "Senior Business Systems Analyst", description: "Independent systems analysis and design", kLevel: "K3" },
  { id: 62, department: "ICT", role: "Systems Analyst", roleTitle: "Senior Network Engineer", description: "Independent systems analysis and design", kLevel: "K3" },
  { id: 63, department: "ICT", role: "Systems Analyst", roleTitle: "Infrastructure Specialist", description: "Independent systems analysis and design", kLevel: "K3" },
  { id: 64, department: "ICT", role: "Systems Analyst", roleTitle: "Security Analyst", description: "Independent systems analysis and design", kLevel: "K3" },
  { id: 65, department: "ICT", role: "Systems Analyst", roleTitle: "Database Administrator", description: "Independent systems analysis and design", kLevel: "K3" },
  
  // ICT Department - K4 (Senior Level)
  { id: 66, department: "ICT", role: "IT Infrastructure Manager", roleTitle: "ICT Operations Manager", description: "Senior lead for IT infrastructure operations", kLevel: "K4" },
  { id: 67, department: "ICT", role: "IT Infrastructure Manager", roleTitle: "IT Manager", description: "Senior lead for IT infrastructure operations", kLevel: "K4" },
  { id: 68, department: "ICT", role: "IT Infrastructure Manager", roleTitle: "Network Manager", description: "Senior lead for IT infrastructure operations", kLevel: "K4" },
  { id: 69, department: "ICT", role: "IT Infrastructure Manager", roleTitle: "Systems Manager", description: "Senior lead for IT infrastructure operations", kLevel: "K4" },
  { id: 70, department: "ICT", role: "IT Infrastructure Manager", roleTitle: "IT Service Manager", description: "Senior lead for IT infrastructure operations", kLevel: "K4" },
  
  // ICT Department - K5 (Master Level)
  { id: 71, department: "ICT", role: "Chief Technology Officer", roleTitle: "Chief Information Officer", description: "Master-level technology strategy leadership", kLevel: "K5" },
  { id: 72, department: "ICT", role: "Chief Technology Officer", roleTitle: "IT Director", description: "Master-level technology strategy leadership", kLevel: "K5" },
  { id: 73, department: "ICT", role: "Chief Technology Officer", roleTitle: "Head of IT", description: "Master-level technology strategy leadership", kLevel: "K5" },
  { id: 74, department: "ICT", role: "Chief Technology Officer", roleTitle: "VP of Information Technology", description: "Master-level technology strategy leadership", kLevel: "K5" },
  { id: 75, department: "ICT", role: "Chief Technology Officer", roleTitle: "Chief Digital Officer", description: "Master-level technology strategy leadership", kLevel: "K5" },
  
  // HR Department - K1 (Entry Level)
  { id: 76, department: "HR", role: "HR Assistant", roleTitle: "Human Resources Administrator", description: "Entry-level human resources administration", kLevel: "K1" },
  { id: 77, department: "HR", role: "HR Assistant", roleTitle: "HR Clerk", description: "Entry-level human resources administration", kLevel: "K1" },
  { id: 78, department: "HR", role: "HR Assistant", roleTitle: "People Operations Assistant", description: "Entry-level human resources administration", kLevel: "K1" },
  { id: 79, department: "HR", role: "HR Assistant", roleTitle: "Payroll Assistant", description: "Entry-level human resources administration", kLevel: "K1" },
  { id: 80, department: "HR", role: "HR Assistant", roleTitle: "HR Coordinator", description: "Entry-level human resources administration", kLevel: "K1" },
  
  // HR Department - K2 (Junior Level)
  { id: 81, department: "HR", role: "Recruitment Coordinator", roleTitle: "Talent Acquisition Specialist", description: "Junior talent acquisition and recruitment", kLevel: "K2" },
  { id: 82, department: "HR", role: "Recruitment Coordinator", roleTitle: "Recruiter", description: "Junior talent acquisition and recruitment", kLevel: "K2" },
  { id: 83, department: "HR", role: "Recruitment Coordinator", roleTitle: "Talent Sourcer", description: "Junior talent acquisition and recruitment", kLevel: "K2" },
  { id: 84, department: "HR", role: "Recruitment Coordinator", roleTitle: "HR Generalist", description: "Junior talent acquisition and recruitment", kLevel: "K2" },
  { id: 85, department: "HR", role: "Recruitment Coordinator", roleTitle: "Employee Relations Officer", description: "Junior talent acquisition and recruitment", kLevel: "K2" },
  
  // HR Department - K3 (Independent Level)
  { id: 86, department: "HR", role: "HR Business Partner", roleTitle: "Senior HR Business Consultant", description: "Independent strategic HR partnership", kLevel: "K3" },
  { id: 87, department: "HR", role: "HR Business Partner", roleTitle: "Senior Recruiter", description: "Independent strategic HR partnership", kLevel: "K3" },
  { id: 88, department: "HR", role: "HR Business Partner", roleTitle: "Training and Development Specialist", description: "Independent strategic HR partnership", kLevel: "K3" },
  { id: 89, department: "HR", role: "HR Business Partner", roleTitle: "Compensation and Benefits Analyst", description: "Independent strategic HR partnership", kLevel: "K3" },
  { id: 90, department: "HR", role: "HR Business Partner", roleTitle: "Performance Management Specialist", description: "Independent strategic HR partnership", kLevel: "K3" },
  
  // HR Department - K4 (Senior Level)
  { id: 91, department: "HR", role: "HR Director", roleTitle: "Head of Human Resources", description: "Senior lead for organizational development", kLevel: "K4" },
  { id: 92, department: "HR", role: "HR Director", roleTitle: "HR Manager", description: "Senior lead for organizational development", kLevel: "K4" },
  { id: 93, department: "HR", role: "HR Director", roleTitle: "Talent Acquisition Manager", description: "Senior lead for organizational development", kLevel: "K4" },
  { id: 94, department: "HR", role: "HR Director", roleTitle: "People Operations Manager", description: "Senior lead for organizational development", kLevel: "K4" },
  { id: 95, department: "HR", role: "HR Director", roleTitle: "Organisational Development Manager", description: "Senior lead for organizational development", kLevel: "K4" },
  
  // HR Department - K5 (Master Level)
  { id: 96, department: "HR", role: "Chief People Officer", roleTitle: "Executive Director: People & Culture", description: "Master-level people strategy leadership", kLevel: "K5" },
  { id: 97, department: "HR", role: "Chief People Officer", roleTitle: "VP of Human Resources", description: "Master-level people strategy leadership", kLevel: "K5" },
  { id: 98, department: "HR", role: "Chief People Officer", roleTitle: "Chief Human Resources Officer", description: "Master-level people strategy leadership", kLevel: "K5" },
  { id: 99, department: "HR", role: "Chief People Officer", roleTitle: "Head of People Strategy", description: "Master-level people strategy leadership", kLevel: "K5" },
  { id: 100, department: "HR", role: "Chief People Officer", roleTitle: "Director of Human Capital", description: "Master-level people strategy leadership", kLevel: "K5" },
  
  // Project Management Department - K1 (Entry Level)
  { id: 101, department: "Project Management", role: "Project Coordinator", roleTitle: "Junior Project Administrator", description: "Entry-level project coordination and support", kLevel: "K1" },
  { id: 102, department: "Project Management", role: "Project Coordinator", roleTitle: "Project Assistant", description: "Entry-level project coordination and support", kLevel: "K1" },
  { id: 103, department: "Project Management", role: "Project Coordinator", roleTitle: "Project Support Officer", description: "Entry-level project coordination and support", kLevel: "K1" },
  { id: 104, department: "Project Management", role: "Project Coordinator", roleTitle: "Junior Business Analyst", description: "Entry-level project coordination and support", kLevel: "K1" },
  { id: 105, department: "Project Management", role: "Project Coordinator", roleTitle: "PMO Analyst", description: "Entry-level project coordination and support", kLevel: "K1" },
  
  // Project Management Department - K2 (Junior Level)
  { id: 106, department: "Project Management", role: "Project Officer", roleTitle: "Project Management Officer", description: "Junior project execution and monitoring", kLevel: "K2" },
  { id: 107, department: "Project Management", role: "Project Officer", roleTitle: "Junior Project Manager", description: "Junior project execution and monitoring", kLevel: "K2" },
  { id: 108, department: "Project Management", role: "Project Officer", roleTitle: "Business Analyst", description: "Junior project execution and monitoring", kLevel: "K2" },
  { id: 109, department: "Project Management", role: "Project Officer", roleTitle: "Scrum Master", description: "Junior project execution and monitoring", kLevel: "K2" },
  { id: 110, department: "Project Management", role: "Project Officer", roleTitle: "Change Management Specialist", description: "Junior project execution and monitoring", kLevel: "K2" },
  
  // Project Management Department - K3 (Independent Level)
  { id: 111, department: "Project Management", role: "Project Manager", roleTitle: "Senior Project Manager", description: "Independent project lifecycle management", kLevel: "K3" },
  { id: 112, department: "Project Management", role: "Project Manager", roleTitle: "Program Coordinator", description: "Independent project lifecycle management", kLevel: "K3" },
  { id: 113, department: "Project Management", role: "Project Manager", roleTitle: "Senior Business Analyst", description: "Independent project lifecycle management", kLevel: "K3" },
  { id: 114, department: "Project Management", role: "Project Manager", roleTitle: "Product Manager", description: "Independent project lifecycle management", kLevel: "K3" },
  { id: 115, department: "Project Management", role: "Project Manager", roleTitle: "Delivery Manager", description: "Independent project lifecycle management", kLevel: "K3" },
  
  // Project Management Department - K4 (Senior Level)
  { id: 116, department: "Project Management", role: "Senior Project Manager", roleTitle: "Portfolio Manager", description: "Senior lead for complex project portfolios", kLevel: "K4" },
  { id: 117, department: "Project Management", role: "Senior Project Manager", roleTitle: "Program Manager", description: "Senior lead for complex project portfolios", kLevel: "K4" },
  { id: 118, department: "Project Management", role: "Senior Project Manager", roleTitle: "PMO Manager", description: "Senior lead for complex project portfolios", kLevel: "K4" },
  { id: 119, department: "Project Management", role: "Senior Project Manager", roleTitle: "Principal Project Manager", description: "Senior lead for complex project portfolios", kLevel: "K4" },
  { id: 120, department: "Project Management", role: "Senior Project Manager", roleTitle: "Head of Project Delivery", description: "Senior lead for complex project portfolios", kLevel: "K4" },
  
  // Project Management Department - K5 (Master Level)
  { id: 121, department: "Project Management", role: "Program Director", roleTitle: "Executive Programme Director", description: "Master-level strategic program leadership", kLevel: "K5" },
  { id: 122, department: "Project Management", role: "Program Director", roleTitle: "VP of Project Management", description: "Master-level strategic program leadership", kLevel: "K5" },
  { id: 123, department: "Project Management", role: "Program Director", roleTitle: "Head of Portfolio Management", description: "Master-level strategic program leadership", kLevel: "K5" },
  { id: 124, department: "Project Management", role: "Program Director", roleTitle: "Chief Program Officer", description: "Master-level strategic program leadership", kLevel: "K5" },
  { id: 125, department: "Project Management", role: "Program Director", roleTitle: "Director of Strategic Initiatives", description: "Master-level strategic program leadership", kLevel: "K5" },
  
  // Service Desk Department - K1 (Entry Level)
  { id: 126, department: "Service Desk", role: "Service Desk Agent", roleTitle: "IT Help Desk Technician", description: "Entry-level user support and incident logging", kLevel: "K1" },
  { id: 127, department: "Service Desk", role: "Service Desk Agent", roleTitle: "Level 1 Support Analyst", description: "Entry-level user support and incident logging", kLevel: "K1" },
  { id: 128, department: "Service Desk", role: "Service Desk Agent", roleTitle: "Customer Support Representative", description: "Entry-level user support and incident logging", kLevel: "K1" },
  { id: 129, department: "Service Desk", role: "Service Desk Agent", roleTitle: "IT Support Agent", description: "Entry-level user support and incident logging", kLevel: "K1" },
  { id: 130, department: "Service Desk", role: "Service Desk Agent", roleTitle: "Technical Support Agent", description: "Entry-level user support and incident logging", kLevel: "K1" },
  
  // Service Desk Department - K2 (Junior Level)
  { id: 131, department: "Service Desk", role: "Technical Support Specialist", roleTitle: "Senior Support Analyst", description: "Junior technical troubleshooting and resolution", kLevel: "K2" },
  { id: 132, department: "Service Desk", role: "Technical Support Specialist", roleTitle: "Level 2 Support Specialist", description: "Junior technical troubleshooting and resolution", kLevel: "K2" },
  { id: 133, department: "Service Desk", role: "Technical Support Specialist", roleTitle: "Incident Management Specialist", description: "Junior technical troubleshooting and resolution", kLevel: "K2" },
  { id: 134, department: "Service Desk", role: "Technical Support Specialist", roleTitle: "Application Support Analyst", description: "Junior technical troubleshooting and resolution", kLevel: "K2" },
  { id: 135, department: "Service Desk", role: "Technical Support Specialist", roleTitle: "System Support Specialist", description: "Junior technical troubleshooting and resolution", kLevel: "K2" },
  
  // Service Desk Department - K3 (Independent Level)
  { id: 136, department: "Service Desk", role: "Service Desk Analyst", roleTitle: "Service Delivery Analyst", description: "Independent incident and problem management", kLevel: "K3" },
  { id: 137, department: "Service Desk", role: "Service Desk Analyst", roleTitle: "Senior Service Desk Analyst", description: "Independent incident and problem management", kLevel: "K3" },
  { id: 138, department: "Service Desk", role: "Service Desk Analyst", roleTitle: "Problem Management Specialist", description: "Independent incident and problem management", kLevel: "K3" },
  { id: 139, department: "Service Desk", role: "Service Desk Analyst", roleTitle: "ITIL Service Analyst", description: "Independent incident and problem management", kLevel: "K3" },
  { id: 140, department: "Service Desk", role: "Service Desk Analyst", roleTitle: "Change Management Analyst", description: "Independent incident and problem management", kLevel: "K3" },
  
  // Service Desk Department - K4 (Senior Level)
  { id: 141, department: "Service Desk", role: "Service Desk Team Lead", roleTitle: "Service Desk Team Leader", description: "Senior lead for service desk operations", kLevel: "K4" },
  { id: 142, department: "Service Desk", role: "Service Desk Team Lead", roleTitle: "Service Desk Supervisor", description: "Senior lead for service desk operations", kLevel: "K4" },
  { id: 143, department: "Service Desk", role: "Service Desk Team Lead", roleTitle: "Senior Service Analyst", description: "Senior lead for service desk operations", kLevel: "K4" },
  { id: 144, department: "Service Desk", role: "Service Desk Team Lead", roleTitle: "IT Service Coordinator", description: "Senior lead for service desk operations", kLevel: "K4" },
  { id: 145, department: "Service Desk", role: "Service Desk Team Lead", roleTitle: "Support Services Manager", description: "Senior lead for service desk operations", kLevel: "K4" },
  
  // Service Desk Department - K5 (Master Level)
  { id: 146, department: "Service Desk", role: "Service Desk Manager", roleTitle: "Head of Service Operations", description: "Master-level service delivery management", kLevel: "K5" },
  { id: 147, department: "Service Desk", role: "Service Desk Manager", roleTitle: "IT Service Manager", description: "Master-level service delivery management", kLevel: "K5" },
  { id: 148, department: "Service Desk", role: "Service Desk Manager", roleTitle: "Director of IT Support", description: "Master-level service delivery management", kLevel: "K5" },
  { id: 149, department: "Service Desk", role: "Service Desk Manager", roleTitle: "Head of Customer Support", description: "Master-level service delivery management", kLevel: "K5" },
  { id: 150, department: "Service Desk", role: "Service Desk Manager", roleTitle: "VP of Service Delivery", description: "Master-level service delivery management", kLevel: "K5" }
];

export default function PositionsRoles() {
  const permissions = useRoleAccess();
  const [records, setRecords] = useState<DepartmentRole[]>([]);

  const [newRecord, setNewRecord] = useState({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addStep, setAddStep] = useState<'department' | 'role'>('department');
  const [editingRecord, setEditingRecord] = useState<DepartmentRole | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });

  const departments = ["SAP", "ICT", "HR", "DEVELOPMENT", "Project Management", "Service Desk"];
  const kLevels = ["K1", "K2", "K3", "K4", "K5"];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('departmentRoles');
    const dataVersion = localStorage.getItem('departmentRolesVersion');
    const currentVersion = "2.0"; // Updated version for roleTitle feature
    
    if (savedRecords && dataVersion === currentVersion) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        // Check if the first record has roleTitle field to ensure data structure compatibility
        if (parsedRecords.length > 0 && parsedRecords[0].roleTitle !== undefined) {
          setRecords(parsedRecords);
        } else {
          // Old data structure, reload with new structure
          console.log('Updating to new data structure with role titles');
          const newRecords = getDefaultRecords();
          setRecords(newRecords);
          localStorage.setItem('departmentRolesVersion', currentVersion);
        }
      } catch (error) {
        console.error('Error parsing saved records:', error);
        const newRecords = getDefaultRecords();
        setRecords(newRecords);
        localStorage.setItem('departmentRolesVersion', currentVersion);
      }
    } else {
      // No saved data or version mismatch, use default records
      console.log('Loading new role title data structure');
      const newRecords = getDefaultRecords();
      setRecords(newRecords);
      localStorage.setItem('departmentRolesVersion', currentVersion);
    }
  }, []);

  // Save data to localStorage whenever records change
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('departmentRoles', JSON.stringify(records));
      localStorage.setItem('departmentRolesVersion', "2.0");
    }
  }, [records]);

  const addRecord = () => {
    if (newRecord.department && newRecord.role && newRecord.roleTitle && newRecord.description && newRecord.kLevel) {
      const record: DepartmentRole = {
        id: Math.max(...records.map(r => r.id), 0) + 1,
        department: newRecord.department,
        role: newRecord.role,
        roleTitle: newRecord.roleTitle,
        description: newRecord.description,
        kLevel: newRecord.kLevel
      };
      setRecords([...records, record]);
      setNewRecord({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
      setShowAddForm(false);
      setAddStep('department');
    }
  };



  const startEdit = (record: DepartmentRole) => {
    setEditingRecord(record);
    setEditFormData({
      department: record.department,
      role: record.role,
      roleTitle: record.roleTitle,
      description: record.description,
      kLevel: record.kLevel
    });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (editingRecord && editFormData.department && editFormData.role && editFormData.roleTitle && editFormData.description && editFormData.kLevel) {
      const updatedRecords = records.map(r => 
        r.id === editingRecord.id 
          ? { ...r, department: editFormData.department, role: editFormData.role, roleTitle: editFormData.roleTitle, description: editFormData.description, kLevel: editFormData.kLevel }
          : r
      );
      setRecords(updatedRecords);
      setShowEditModal(false);
      setEditingRecord(null);
      setEditFormData({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
    }
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingRecord(null);
    setEditFormData({ department: '', role: '', roleTitle: '', description: '', kLevel: '' });
  };



  const deleteRecord = (id: number) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const handleNextStep = () => {
    if (addStep === 'department' && newRecord.department) {
      setAddStep('role');
    }
  };

  const handleBackStep = () => {
    setAddStep('department');
  };

  return (
    <div className="space-y-8 pt-8 px-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: 'rgb(0, 0, 83)' }}>
          Positions | Roles
        </h1>
      </div>

      {/* Single Table for Departments and Roles */}
      <Card>
        <CardHeader className="pb-4" style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Departments & Roles with K-Levels</CardTitle>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-white text-blue-900 hover:bg-gray-100"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-4">
                {isEditing 
                  ? 'Edit Role' 
                  : addStep === 'department' 
                    ? 'Step 1: Select Department' 
                    : 'Step 2: Add Role Details'
                }
              </h3>
              
              {!isEditing && addStep === 'department' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={newRecord.department}
                      onChange={(e) => setNewRecord({ ...newRecord, department: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleNextStep} 
                      disabled={!newRecord.department}
                      style={{ backgroundColor: 'rgb(0, 0, 83)' }}
                    >
                      Next Step
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {(addStep === 'role' || isEditing) && (
                <div className="space-y-4">
                  {!isEditing && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">Selected Department: <strong>{newRecord.department}</strong></p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={newRecord.department}
                          onChange={(e) => setNewRecord({ ...newRecord, department: e.target.value })}
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                      <Input
                        placeholder="Enter role name"
                        value={newRecord.role}
                        onChange={(e) => setNewRecord({ ...newRecord, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role Title</label>
                      <Input
                        placeholder="Enter role title"
                        value={newRecord.roleTitle}
                        onChange={(e) => setNewRecord({ ...newRecord, roleTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">K-Level</label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={newRecord.kLevel}
                        onChange={(e) => setNewRecord({ ...newRecord, kLevel: e.target.value })}
                      >
                        <option value="">Select K-Level</option>
                        {kLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Input
                      placeholder="Enter role description"
                      value={newRecord.description}
                      onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={isEditing ? updateRecord : addRecord} 
                      style={{ backgroundColor: 'rgb(0, 0, 83)' }}
                    >
                      {isEditing ? 'Update Role' : 'Save Role'}
                    </Button>
                    {!isEditing && (
                      <Button variant="outline" onClick={handleBackStep}>
                        Back
                      </Button>
                    )}
                    <Button variant="outline" onClick={isEditing ? cancelEdit : () => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'rgb(240, 240, 240)' }}>
                  <TableHead className="font-semibold text-gray-700">Department</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role</TableHead>
                  <TableHead className="font-semibold text-gray-700">Role Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Description</TableHead>
                  <TableHead className="font-semibold text-gray-700">K-Level</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Badge variant="outline">{record.department}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{record.role}</TableCell>
                    <TableCell className="text-black font-medium">{record.roleTitle}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.kLevel}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {permissions.canDeletePositions && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ color: 'rgb(0, 0, 83)' }}>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editFormData.department}
                onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
              <Input
                placeholder="Enter role name"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Title</label>
              <Input
                placeholder="Enter role title"
                value={editFormData.roleTitle}
                onChange={(e) => setEditFormData({ ...editFormData, roleTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Input
                placeholder="Enter role description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">K-Level</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={editFormData.kLevel}
                onChange={(e) => setEditFormData({ ...editFormData, kLevel: e.target.value })}
              >
                <option value="">Select K-Level</option>
                {kLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={saveEdit} 
                style={{ backgroundColor: 'rgb(0, 0, 83)', color: 'white' }}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={cancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}