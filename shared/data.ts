// Shared data structures for consistent options across the application

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  department: string;
  role: string;
  description: string;
}

export const DEPARTMENTS: Department[] = [
  { id: 1, name: "SAP", description: "SAP systems implementation, support, and management" },
  { id: 2, name: "ICT", description: "Information and Communications Technology services" },
  { id: 3, name: "HR", description: "Human Resources and people management" },
  { id: 4, name: "PROJECT MANAGEMENT", description: "Project planning, execution, and delivery" },
  { id: 5, name: "SERVICE DESK", description: "IT support and helpdesk services" }
];

// Export interfaces for use in other files
export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Discipline {
  id: number;
  departmentId: number;
  name: string;
  description: string;
}

export interface Domain {
  id: number;
  disciplineId: number;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  domainId: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  certificate?: string;
}

export const DISCIPLINES: Discipline[] = [
  { id: 1, departmentId: 1, name: "SAP Functional", description: "SAP business modules and functionality" },
  { id: 2, departmentId: 1, name: "SAP Technical", description: "SAP development and technical configuration" },
  { id: 3, departmentId: 1, name: "SAP Basis", description: "SAP system administration and infrastructure" },
  { id: 4, departmentId: 2, name: "Network & Infrastructure", description: "Network design and IT infrastructure" },
  { id: 5, departmentId: 2, name: "Software Development", description: "Application development and programming" },
  { id: 6, departmentId: 2, name: "Cybersecurity", description: "Information security and threat management" },
  { id: 7, departmentId: 2, name: "Data Management", description: "Database administration and data analytics" },
  { id: 8, departmentId: 3, name: "Talent Management", description: "Recruitment and employee development" },
  { id: 9, departmentId: 3, name: "Employee Relations", description: "HR policies and employee support" },
  { id: 10, departmentId: 3, name: "Compensation & Benefits", description: "Payroll and employee benefits management" },
  { id: 11, departmentId: 4, name: "Project Planning", description: "Project scope and planning activities" },
  { id: 12, departmentId: 4, name: "Project Execution", description: "Project delivery and implementation" },
  { id: 13, departmentId: 4, name: "Portfolio Management", description: "Multi-project oversight and governance" },
  { id: 14, departmentId: 5, name: "Level 1 Support", description: "First-line technical support and troubleshooting" },
  { id: 15, departmentId: 5, name: "Level 2 Support", description: "Advanced technical support and escalation" },
  { id: 16, departmentId: 5, name: "Service Management", description: "ITIL service management and processes" }
];

export const DOMAINS: Domain[] = [
  { id: 1, disciplineId: 1, name: "SAP FI/CO", description: "Finance and Controlling modules" },
  { id: 2, disciplineId: 1, name: "SAP MM/WM", description: "Materials Management and Warehouse Management" },
  { id: 3, disciplineId: 1, name: "SAP SD/LE", description: "Sales & Distribution and Logistics Execution" },
  { id: 4, disciplineId: 1, name: "SAP HR/HCM", description: "Human Resources and Human Capital Management" },
  { id: 5, disciplineId: 2, name: "ABAP Development", description: "SAP ABAP programming and customization" },
  { id: 6, disciplineId: 2, name: "SAP UI5/Fiori", description: "Modern SAP user interface development" },
  { id: 7, disciplineId: 2, name: "SAP Integration", description: "SAP system integration and middleware" },
  { id: 8, disciplineId: 3, name: "SAP System Administration", description: "SAP system monitoring and maintenance" },
  { id: 9, disciplineId: 3, name: "SAP Database Management", description: "SAP database administration and tuning" },
  { id: 10, disciplineId: 4, name: "Network Design", description: "Enterprise network architecture and planning" },
  { id: 11, disciplineId: 4, name: "Server Infrastructure", description: "Physical and virtual server management" },
  { id: 12, disciplineId: 4, name: "Cloud Services", description: "Cloud infrastructure and migration" },
  { id: 13, disciplineId: 5, name: "Web Development", description: "Frontend and backend web applications" },
  { id: 14, disciplineId: 5, name: "Mobile Development", description: "iOS and Android applications" },
  { id: 15, disciplineId: 5, name: "Enterprise Applications", description: "Large-scale business applications" },
  { id: 16, disciplineId: 6, name: "Information Security", description: "Data protection and security policies" },
  { id: 17, disciplineId: 6, name: "Network Security", description: "Network protection and firewalls" },
  { id: 18, disciplineId: 6, name: "Identity Management", description: "Access control and authentication" },
  { id: 19, disciplineId: 7, name: "Database Administration", description: "Database management and optimization" },
  { id: 20, disciplineId: 7, name: "Business Intelligence", description: "Data warehousing and reporting" },
  { id: 21, disciplineId: 7, name: "Data Analytics", description: "Statistical analysis and data science" },
  { id: 22, disciplineId: 8, name: "Recruitment", description: "Talent acquisition and hiring processes" },
  { id: 23, disciplineId: 8, name: "Learning & Development", description: "Employee training and skill development" },
  { id: 24, disciplineId: 9, name: "Employee Relations", description: "Workplace conflict resolution and support" },
  { id: 25, disciplineId: 9, name: "Policy Development", description: "HR policy creation and implementation" },
  { id: 26, disciplineId: 10, name: "Payroll Management", description: "Salary processing and administration" },
  { id: 27, disciplineId: 10, name: "Benefits Administration", description: "Employee benefits and pension management" },
  { id: 28, disciplineId: 11, name: "Project Initiation", description: "Project charter and stakeholder analysis" },
  { id: 29, disciplineId: 11, name: "Resource Planning", description: "Project resource allocation and scheduling" },
  { id: 30, disciplineId: 12, name: "Implementation Management", description: "Project delivery and change management" },
  { id: 31, disciplineId: 12, name: "Quality Assurance", description: "Project quality control and testing" },
  { id: 32, disciplineId: 13, name: "Portfolio Strategy", description: "Strategic portfolio planning and governance" },
  { id: 33, disciplineId: 13, name: "Program Management", description: "Multi-project coordination and oversight" },
  { id: 34, disciplineId: 14, name: "Desktop Support", description: "End-user hardware and software support" },
  { id: 35, disciplineId: 14, name: "Incident Management", description: "Issue logging and initial troubleshooting" },
  { id: 36, disciplineId: 15, name: "System Troubleshooting", description: "Advanced technical problem resolution" },
  { id: 37, disciplineId: 15, name: "Application Support", description: "Business application maintenance and support" },
  { id: 38, disciplineId: 16, name: "Service Catalog", description: "IT service definition and management" },
  { id: 39, disciplineId: 16, name: "Change Management", description: "IT change control and approval processes" },
  { id: 40, disciplineId: 16, name: "SLA Management", description: "Service level agreement monitoring and reporting" }
];

export const CATEGORIES: Category[] = [
  { id: 1, domainId: 1, name: "Frontend Development", description: "User interface and experience design" },
  { id: 2, domainId: 1, name: "Backend Development", description: "Server-side application logic" },
  { id: 3, domainId: 2, name: "iOS Development", description: "Apple mobile application development" },
  { id: 4, domainId: 2, name: "Android Development", description: "Google mobile application development" },
  { id: 5, domainId: 3, name: "ERP Systems", description: "Enterprise resource planning systems" },
  { id: 6, domainId: 3, name: "CRM Systems", description: "Customer relationship management systems" },
  { id: 7, domainId: 4, name: "Network Security", description: "Network protection and security protocols" },
  { id: 8, domainId: 4, name: "Network Design", description: "Network architecture and planning" },
  { id: 9, domainId: 5, name: "Windows Administration", description: "Microsoft Windows server management" },
  { id: 10, domainId: 5, name: "Linux Administration", description: "Linux server management" },
  { id: 11, domainId: 6, name: "SQL Databases", description: "Relational database management" },
  { id: 12, domainId: 6, name: "NoSQL Databases", description: "Non-relational database management" },
  { id: 13, domainId: 7, name: "Business Intelligence", description: "Data warehousing and reporting" },
  { id: 14, domainId: 7, name: "Predictive Analytics", description: "Statistical modeling and forecasting" },
  { id: 15, domainId: 8, name: "Budget Analysis", description: "Financial budget planning and monitoring" },
  { id: 16, domainId: 8, name: "Financial Forecasting", description: "Revenue and expense projections" },
  { id: 17, domainId: 9, name: "Portfolio Management", description: "Investment portfolio optimization" },
  { id: 18, domainId: 9, name: "Risk Assessment", description: "Financial risk analysis and mitigation" },
  { id: 19, domainId: 10, name: "Financial Statements", description: "Income statements and balance sheets" },
  { id: 20, domainId: 10, name: "Management Reporting", description: "Internal financial reporting" },
  { id: 21, domainId: 11, name: "Corporate Tax", description: "Business tax compliance and planning" },
  { id: 22, domainId: 11, name: "Personal Tax", description: "Individual tax preparation and advice" },
  { id: 23, domainId: 12, name: "Executive Search", description: "Senior leadership recruitment" },
  { id: 24, domainId: 12, name: "Graduate Recruitment", description: "Entry-level talent acquisition" },
  { id: 25, domainId: 13, name: "Performance Reviews", description: "Employee evaluation and feedback" },
  { id: 26, domainId: 13, name: "Career Development", description: "Employee growth and advancement" },
  { id: 27, domainId: 14, name: "Medical Benefits", description: "Healthcare and medical coverage" },
  { id: 28, domainId: 14, name: "Retirement Planning", description: "Pension and retirement benefits" },
  { id: 29, domainId: 15, name: "Union Relations", description: "Trade union negotiations and agreements" },
  { id: 30, domainId: 15, name: "Grievance Handling", description: "Employee complaint resolution" }
];

export const ROLES: Role[] = [
  { id: 1, categoryId: 1, name: "SAP FI Consultant", description: "SAP Financial Accounting module implementation and support", certificate: "SAP FI Certification" },
  { id: 2, categoryId: 1, name: "SAP CO Consultant", description: "SAP Controlling module configuration and optimization", certificate: "SAP CO Certification" },
  { id: 3, categoryId: 2, name: "SAP MM Consultant", description: "Materials Management module specialist", certificate: "SAP MM Certification" },
  { id: 4, categoryId: 2, name: "SAP WM Consultant", description: "Warehouse Management module expert", certificate: "SAP WM Certification" },
  { id: 5, categoryId: 3, name: "SAP SD Consultant", description: "Sales and Distribution module consultant", certificate: "SAP SD Certification" },
  { id: 6, categoryId: 3, name: "SAP LE Consultant", description: "Logistics Execution specialist", certificate: "SAP LE Certification" },
  { id: 7, categoryId: 4, name: "SAP HR Consultant", description: "Human Resources module implementation", certificate: "SAP HR Certification" },
  { id: 8, categoryId: 4, name: "SAP HCM Consultant", description: "Human Capital Management specialist", certificate: "SAP HCM Certification" },
  { id: 9, categoryId: 5, name: "ABAP Developer", description: "SAP ABAP programming and development", certificate: "SAP ABAP Certification" },
  { id: 10, categoryId: 5, name: "SAP Technical Consultant", description: "Technical SAP configuration and customization", certificate: "SAP Technical Certification" },
  { id: 11, categoryId: 6, name: "UI5 Developer", description: "SAP UI5 and Fiori application development", certificate: "SAP UI5 Certification" },
  { id: 12, categoryId: 6, name: "Fiori Consultant", description: "SAP Fiori user experience specialist", certificate: "SAP Fiori Certification" },
  { id: 13, categoryId: 7, name: "SAP Integration Specialist", description: "SAP system integration and middleware", certificate: "SAP PI/PO Certification" },
  { id: 14, categoryId: 7, name: "SAP Cloud Consultant", description: "SAP cloud platform integration", certificate: "SAP Cloud Certification" },
  { id: 15, categoryId: 8, name: "SAP Basis Administrator", description: "SAP system administration and monitoring", certificate: "SAP Basis Certification" },
  { id: 16, categoryId: 8, name: "SAP System Administrator", description: "SAP landscape maintenance and support", certificate: "SAP Admin Certification" },
  { id: 17, categoryId: 9, name: "SAP Database Administrator", description: "SAP database management and tuning", certificate: "SAP DBA Certification" },
  { id: 18, categoryId: 9, name: "SAP Performance Analyst", description: "SAP system performance optimization", certificate: "SAP Performance Certification" },
  { id: 19, categoryId: 10, name: "Network Engineer", description: "Enterprise network design and implementation", certificate: "CCNA Certification" },
  { id: 20, categoryId: 10, name: "Network Architect", description: "Network architecture planning and design", certificate: "CCIE Certification" }
];

export const LANGUAGES = [
  "English", "Afrikaans", "isiZulu", "isiXhosa", "Sesotho", "Setswana",
  "Sepedi", "isiSwati", "Xitsonga", "Tshivenda", "isiNdebele"
];

export interface QualificationMapping {
  type: string;
  names: string[];
}

export const QUALIFICATION_MAPPINGS: QualificationMapping[] = [
  {
    type: "Higher Certificates and Advanced National Vocational Certificate (NQF 5)",
    names: [
      "Higher Certificate in Information Technology",
      "Higher Certificate in Business Management",
      "Higher Certificate in Engineering",
      "Advanced National Vocational Certificate"
    ]
  },
  {
    type: "National Diplomas and Diplomas (NQF 6)",
    names: [
      "National Diploma in Engineering",
      "National Diploma in Information Technology", 
      "National Diploma in Business Studies",
      "National Diploma in Marketing",
      "Diploma in Nursing"
    ]
  },
  {
    type: "Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7)",
    names: [
      "Bachelor of Commerce",
      "Bachelor of Science",
      "Bachelor of Arts",
      "Bachelor of Technology",
      "Bachelor of Engineering",
      "Advanced Diploma in Engineering",
      "Post Graduate Certificate in Education"
    ]
  },
  {
    type: "Honours Degree, Post Graduate Diploma (NQF 8)",
    names: [
      "Bachelor of Commerce Honours",
      "Bachelor of Science Honours", 
      "Bachelor of Arts Honours",
      "Post Graduate Diploma in Management",
      "Post Graduate Diploma in Education"
    ]
  },
  {
    type: "Master's Degree (NQF 9)",
    names: [
      "Master of Business Administration",
      "Master of Science",
      "Master of Arts",
      "Master of Engineering",
      "Master of Commerce"
    ]
  },
  {
    type: "Doctoral Degree (NQF 10)",
    names: [
      "Doctor of Philosophy (PhD)",
      "Doctor of Engineering",
      "Doctor of Business Administration",
      "Doctor of Education"
    ]
  }
];

export const QUALIFICATION_TYPES = QUALIFICATION_MAPPINGS.map(q => q.type);

export const NQF_LEVELS = ["5", "6", "7", "8", "9", "10"];

export const SAP_K_LEVELS = ["---n/a---", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8"];

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];