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
    name: "Information Technology",
    description: "IT professionals, software developers, cybersecurity specialists, and digital transformation experts."
  },
  {
    id: 9,
    name: "Human Resources and Development",
    description: "HR professionals, talent acquisition specialists, and organizational development experts."
  },
  {
    id: 10,
    name: "Communications and Media",
    description: "Communications professionals, journalists, media specialists, and public relations experts."
  },
  {
    id: 11,
    name: "Construction and Built Environment",
    description: "Construction professionals, architects, quantity surveyors, and built environment specialists."
  }
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
  { id: 1, categoryId: 1, name: "React Developer", description: "Frontend development using React framework", certificate: "React Certification" },
  { id: 2, department: "Engineering and Technology", role: "Mechanical Engineer", description: "Design, develop, and maintain mechanical systems and equipment across various industries." },
  { id: 3, department: "Engineering and Technology", role: "Electrical Engineer", description: "Design and implement electrical systems, power distribution, and electronic control systems." },
  { id: 4, department: "Healthcare and Medical Services", role: "Medical Doctor", description: "Provide comprehensive medical care, diagnosis, and treatment to patients across various specialties." },
  { id: 5, department: "Healthcare and Medical Services", role: "Registered Nurse", description: "Deliver patient care, administer medications, and support medical procedures in healthcare facilities." },
  { id: 6, department: "Healthcare and Medical Services", role: "Pharmacist", description: "Dispense medications, provide pharmaceutical care, and counsel patients on proper medication use." },
  { id: 7, department: "Education and Training", role: "Mathematics Teacher", description: "Teach mathematics concepts from foundation to advanced levels in secondary education institutions." },
  { id: 8, department: "Education and Training", role: "Science Teacher", description: "Educate students in physical and life sciences, conduct laboratory experiments, and promote scientific literacy." },
  { id: 9, department: "Education and Training", role: "Language Teacher", description: "Teach official South African languages and promote multilingual education and cultural understanding." },
  { id: 10, department: "Finance and Accounting", role: "Chartered Accountant", description: "Provide financial accounting, auditing, and business advisory services to organizations and individuals." },
  { id: 11, department: "Finance and Accounting", role: "Financial Analyst", description: "Analyze financial data, prepare reports, and provide investment recommendations to support business decisions." },
  { id: 12, department: "Finance and Accounting", role: "Tax Consultant", description: "Provide tax planning, compliance, and advisory services to ensure adherence to South African tax regulations." },
  { id: 13, department: "Legal and Compliance", role: "Attorney", description: "Provide legal representation, advice, and advocacy services across various areas of South African law." },
  { id: 14, department: "Legal and Compliance", role: "Paralegal", description: "Assist attorneys with legal research, document preparation, and case management activities." },
  { id: 15, department: "Legal and Compliance", role: "Compliance Officer", description: "Ensure organizational adherence to regulatory requirements and develop compliance management systems." },
  { id: 16, department: "Mining and Natural Resources", role: "Mining Engineer", description: "Plan and oversee mining operations, ensuring safety, efficiency, and environmental compliance." },
  { id: 17, department: "Mining and Natural Resources", role: "Geologist", description: "Study earth structures, identify mineral deposits, and assess geological risks for mining projects." },
  { id: 18, department: "Mining and Natural Resources", role: "Environmental Scientist", description: "Assess environmental impact of mining activities and develop sustainable resource management strategies." },
  { id: 19, department: "Agriculture and Food Security", role: "Agricultural Engineer", description: "Design and implement agricultural systems, irrigation infrastructure, and food processing technologies." },
  { id: 20, department: "Agriculture and Food Security", role: "Veterinarian", description: "Provide animal healthcare, disease prevention, and food safety services in agricultural settings." },
  { id: 21, department: "Agriculture and Food Security", role: "Food Technologist", description: "Develop food processing methods, ensure food safety, and improve nutritional value of food products." },
  { id: 22, department: "Information Technology", role: "Software Developer", description: "Design, develop, and maintain software applications and systems using various programming languages." },
  { id: 23, department: "Information Technology", role: "Cybersecurity Specialist", description: "Protect organizational digital assets, implement security measures, and respond to cyber threats." },
  { id: 24, department: "Information Technology", role: "Data Analyst", description: "Analyze complex datasets, create insights, and support data-driven decision making processes." },
  { id: 25, department: "Human Resources and Development", role: "HR Manager", description: "Oversee human resources operations, talent management, and organizational development initiatives." },
  { id: 26, department: "Human Resources and Development", role: "Training and Development Specialist", description: "Design and deliver employee training programs and organizational development initiatives." },
  { id: 27, department: "Human Resources and Development", role: "Skills Development Facilitator", description: "Coordinate workplace skills development programs and SETA compliance." },
  { id: 28, department: "Communications and Media", role: "Digital Marketing Specialist", description: "Develop and execute digital marketing strategies across various online platforms." },
  { id: 29, department: "Communications and Media", role: "Public Relations Officer", description: "Manage organizational communications and maintain positive public relations." },
  { id: 30, department: "Communications and Media", role: "Content Creator", description: "Create engaging content for various media platforms and marketing campaigns." },
  { id: 31, department: "Construction and Built Environment", role: "Architect", description: "Design building structures and coordinate architectural projects from concept to completion." },
  { id: 32, department: "Construction and Built Environment", role: "Quantity Surveyor", description: "Manage construction costs, prepare tender documents, and oversee project budgets." },
  { id: 33, department: "Construction and Built Environment", role: "Project Manager", description: "Coordinate construction projects ensuring timely delivery within budget and quality standards." }
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