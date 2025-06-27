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
  kLevel?: string;
  department?: string;
  role?: string;
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
  // K1 - Basic Awareness / Entry-Level (Interns, Trainees) - 0-1 year experience
  { id: 1, categoryId: 1, name: "SAP MM Trainee Consultant", description: "Learning SAP Materials Management with guidance, 0-1 year experience", certificate: "SAP MM Foundation", kLevel: "K1" },
  { id: 2, categoryId: 1, name: "SAP FICO Intern", description: "Supporting SAP Finance and Controlling activities, entry-level trainee", certificate: "SAP FICO Foundation", kLevel: "K1" },
  { id: 3, categoryId: 5, name: "SAP ABAP Junior Developer", description: "Learning ABAP programming fundamentals with supervision", certificate: "SAP ABAP Foundation", kLevel: "K1" },
  { id: 4, categoryId: 4, name: "SAP HCM Support Assistant", description: "Supporting Human Capital Management processes, trainee level", certificate: "SAP HCM Foundation", kLevel: "K1" },
  { id: 5, categoryId: 8, name: "SAP BASIS Trainee", description: "Learning SAP system administration basics under guidance", certificate: "SAP BASIS Foundation", kLevel: "K1" },
  
  // K2 - Functional Understanding / Junior Consultant - 1-2 years experience
  { id: 6, categoryId: 3, name: "SAP SD Junior Consultant", description: "Working on Sales and Distribution with guidance, 1-2 years experience", certificate: "SAP SD Associate", kLevel: "K2" },
  { id: 7, categoryId: 6, name: "SAP BI Analyst (Junior)", description: "Supporting Business Intelligence reporting and analysis", certificate: "SAP BI Associate", kLevel: "K2" },
  { id: 8, categoryId: 2, name: "SAP PM Support Consultant", description: "Supporting Plant Maintenance processes with supervision", certificate: "SAP PM Associate", kLevel: "K2" },
  { id: 9, categoryId: 7, name: "SAP Ariba Associate", description: "Supporting procurement processes in SAP Ariba platform", certificate: "SAP Ariba Foundation", kLevel: "K2" },
  { id: 10, categoryId: 8, name: "SAP Security Assistant", description: "Supporting SAP security administration with guidance", certificate: "SAP Security Foundation", kLevel: "K2" },
  
  // K3 - Practitioner / Independent Consultant - 2-4 years experience
  { id: 11, categoryId: 2, name: "SAP MM Functional Consultant", description: "Independent Materials Management implementation, 2-4 years experience", certificate: "SAP MM Consultant", kLevel: "K3" },
  { id: 12, categoryId: 1, name: "SAP FICO Consultant", description: "Independent Finance and Controlling module delivery", certificate: "SAP FICO Consultant", kLevel: "K3" },
  { id: 13, categoryId: 5, name: "SAP ABAP Developer", description: "Independent ABAP development and customization", certificate: "SAP ABAP Developer", kLevel: "K3" },
  { id: 14, categoryId: 6, name: "SAP BW Consultant", description: "Independent Business Warehouse implementation and support", certificate: "SAP BW Consultant", kLevel: "K3" },
  { id: 15, categoryId: 3, name: "SAP CRM Consultant", description: "Independent Customer Relationship Management implementation", certificate: "SAP CRM Consultant", kLevel: "K3" },
  
  // K4 - Senior Expert / Lead Consultant - 5-8+ years experience
  { id: 16, categoryId: 3, name: "SAP SD Lead Consultant", description: "Leading Sales and Distribution projects, 5-8+ years experience", certificate: "SAP SD Expert", kLevel: "K4" },
  { id: 17, categoryId: 1, name: "SAP S/4HANA Migration Consultant", description: "Leading S/4HANA migration projects and transformations", certificate: "SAP S/4HANA Migration", kLevel: "K4" },
  { id: 18, categoryId: 8, name: "SAP BASIS Senior Administrator", description: "Leading SAP system administration and infrastructure", certificate: "SAP BASIS Expert", kLevel: "K4" },
  { id: 19, categoryId: 4, name: "SAP SuccessFactors Solution Lead", description: "Leading SuccessFactors HR solutions implementation", certificate: "SAP SuccessFactors Expert", kLevel: "K4" },
  { id: 20, categoryId: 9, name: "SAP Data Migration Lead", description: "Leading data migration projects and strategies", certificate: "SAP Data Migration Expert", kLevel: "K4" },
  
  // K5 - Master / Solution Architect / Strategist - 10+ years experience
  { id: 21, categoryId: 1, name: "SAP Solution Architect (FICO/MM/SD)", description: "Enterprise solution architecture, 10+ years experience", certificate: "SAP Solution Architect", kLevel: "K5" },
  { id: 22, categoryId: 1, name: "SAP S/4HANA Program Manager", description: "Managing enterprise S/4HANA transformation programs", certificate: "SAP Program Management", kLevel: "K5" },
  { id: 23, categoryId: 5, name: "SAP Enterprise Architect", description: "Strategic enterprise SAP architecture and governance", certificate: "SAP Enterprise Architecture", kLevel: "K5" },
  { id: 24, categoryId: 8, name: "SAP GRC Strategy Lead", description: "Leading Governance, Risk and Compliance strategy", certificate: "SAP GRC Master", kLevel: "K5" },
  { id: 25, categoryId: 5, name: "SAP Technical Architect (ABAP + BASIS + Integration)", description: "Master technical architect for complex SAP landscapes", certificate: "SAP Technical Master", kLevel: "K5" },
  
  // Non-SAP roles (ICT department examples)
  { id: 26, categoryId: 10, name: "Network Engineer", description: "Enterprise network design and implementation", certificate: "CCNA Certification" },
  { id: 27, categoryId: 10, name: "Network Architect", description: "Network architecture planning and design", certificate: "CCIE Certification" },
  { id: 28, categoryId: 11, name: "Software Developer", description: "Application development using various programming languages", certificate: "Programming Certification" },
  { id: 29, categoryId: 11, name: "Full Stack Developer", description: "Frontend and backend web application development", certificate: "Full Stack Certification" },
  { id: 30, categoryId: 12, name: "Security Analyst", description: "Information security monitoring and threat detection", certificate: "Security+ Certification" },
  { id: 31, categoryId: 12, name: "Penetration Tester", description: "Ethical hacking and vulnerability assessment", certificate: "CEH Certification" },
  { id: 32, categoryId: 13, name: "Database Administrator", description: "Database management and optimization", certificate: "DBA Certification" },
  { id: 33, categoryId: 13, name: "Data Analyst", description: "Data analysis and business intelligence reporting", certificate: "Data Analytics Certification" },
  
  // HR department examples
  { id: 34, categoryId: 14, name: "Talent Acquisition Specialist", description: "Recruitment and hiring processes", certificate: "HR Certification" },
  { id: 35, categoryId: 14, name: "HR Business Partner", description: "Strategic HR support for business units", certificate: "SHRM Certification" },
  { id: 36, categoryId: 15, name: "Employee Relations Manager", description: "Managing workplace relationships and conflicts", certificate: "Employee Relations Certification" },
  { id: 37, categoryId: 15, name: "HR Policy Coordinator", description: "Development and implementation of HR policies", certificate: "HR Policy Certification" },
  
  // Project Management examples
  { id: 38, categoryId: 16, name: "Project Manager", description: "Project planning and execution management", certificate: "PMP Certification" },
  { id: 39, categoryId: 16, name: "Scrum Master", description: "Agile project management and team facilitation", certificate: "Scrum Master Certification" },
  { id: 40, categoryId: 17, name: "Program Manager", description: "Multi-project portfolio management", certificate: "Program Management Certification" },
  { id: 41, categoryId: 17, name: "Project Coordinator", description: "Project support and coordination activities", certificate: "Project Coordination Certification" },
  
  // Service Desk examples
  { id: 42, categoryId: 18, name: "Service Desk Analyst", description: "First-line IT support and incident resolution", certificate: "ITIL Foundation" },
  { id: 43, categoryId: 18, name: "Technical Support Specialist", description: "Advanced technical problem resolution", certificate: "Technical Support Certification" },
  { id: 44, categoryId: 19, name: "Remote Support Technician", description: "Remote desktop and system support", certificate: "Remote Support Certification" },
  { id: 45, categoryId: 19, name: "Field Service Technician", description: "On-site hardware and software support", certificate: "Field Service Certification" }
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

export const SAP_K_LEVELS = [
  "K1", // Basic Awareness / Entry-Level (0-1 year)
  "K2", // Functional Understanding / Junior Consultant (1-2 years) 
  "K3", // Practitioner / Independent Consultant (2-4 years)
  "K4", // Senior Expert / Lead Consultant (5-8+ years)
  "K5"  // Master / Solution Architect / Strategist (10+ years)
];

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];