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
  { id: 2, name: "Information and Communications Technology", description: "Information and Communications Technology services" },
  { id: 3, name: "Human Resources", description: "Human Resources and people management" },
  { id: 4, name: "Project Management", description: "Project planning, execution, and delivery" },
  { id: 5, name: "Service Desk", description: "IT support and helpdesk services" }
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
  { id: 1, departmentId: 1, name: "SAP Functional Consulting and Business Process Management", description: "SAP business modules and functionality" },
  { id: 2, departmentId: 1, name: "SAP Technical Development and Custom Programming", description: "SAP development and technical configuration" },
  { id: 3, departmentId: 1, name: "SAP Basis System Administration and Infrastructure", description: "SAP system administration and infrastructure" },
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
  { id: 1, disciplineId: 1, name: "SAP Financial Accounting and Controlling for South African Enterprises", description: "Finance and Controlling modules with South African localization" },
  { id: 2, disciplineId: 1, name: "SAP Materials Management and Warehouse Management for Mining Operations", description: "Materials Management optimized for South African mining industry" },
  { id: 3, disciplineId: 1, name: "SAP Sales and Distribution and Logistics Execution for Retail", description: "Sales & Distribution for South African retail and distribution" },
  { id: 4, disciplineId: 1, name: "SAP Human Resources and Human Capital Management with Skills Development", description: "HR modules with South African Skills Development Act compliance" },
  { id: 5, disciplineId: 2, name: "SAP Advanced Business Application Programming Development and Enhancement", description: "ABAP programming with South African business customizations" },
  { id: 6, disciplineId: 2, name: "SAP User Interface Five and Fiori Development for Mobile Workforce", description: "Modern SAP interfaces for South African mobile workforce" },
  { id: 7, disciplineId: 2, name: "SAP Process Integration and Cloud Platform Integration Services", description: "Integration services for South African enterprise systems" },
  { id: 8, disciplineId: 3, name: "SAP Basis System Administration and Infrastructure Management", description: "System administration for South African enterprise environments" },
  { id: 9, disciplineId: 3, name: "SAP Database Administration and Performance Tuning Optimization", description: "Database optimization for South African business requirements" },
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
  // SAP Categories (mapping to SAP domains 1-9)
  { id: 1, domainId: 1, name: "SAP Financial Accounting and Controlling Systems for JSE Listed Companies", description: "Financial processes for Johannesburg Stock Exchange compliance" },
  { id: 2, domainId: 2, name: "SAP Materials Management and Procurement Systems for Mining Industry", description: "Procurement optimized for South African mining operations" },
  { id: 3, domainId: 3, name: "SAP Sales and Distribution Management Systems for Retail and FMCG", description: "Sales processes for South African retail and fast-moving consumer goods" },
  { id: 4, domainId: 4, name: "SAP Human Resources Management Systems with Employment Equity Compliance", description: "HR systems with South African Employment Equity Act compliance" },
  { id: 5, domainId: 5, name: "SAP Advanced Business Application Programming Systems and Custom Solutions", description: "Custom ABAP development for South African business requirements" },
  { id: 6, domainId: 6, name: "SAP User Experience and Interface Design Systems for Multi-Language Support", description: "UI development supporting South African official languages" },
  { id: 7, domainId: 7, name: "SAP System Integration and Connectivity Systems for Enterprise Architecture", description: "Integration with South African banking and government systems" },
  { id: 8, domainId: 8, name: "SAP Basis System Administration and Infrastructure for Cloud and On-Premise", description: "System administration for hybrid South African enterprise environments" },
  { id: 9, domainId: 9, name: "SAP Database Administration and Performance Systems for High-Volume Transactions", description: "Database optimization for high-volume South African business transactions" },
  
  // Non-SAP Categories
  { id: 10, domainId: 10, name: "Network Infrastructure", description: "Network design and IT infrastructure" },
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
  // Knowledge Level One - Basic Awareness and Entry Level (0-1 year experience)
  { id: 1, categoryId: 1, name: "SAP Financial Accounting and Controlling Trainee for JSE Compliance", description: "Learning SAP FICO with JSE and IFRS compliance, 0-1 year experience", certificate: "SAP FICO Foundation Certificate with South African Localization", kLevel: "Knowledge Level One" },
  { id: 2, categoryId: 2, name: "SAP Materials Management Intern for Mining Operations", description: "Supporting SAP MM for mining procurement and inventory, entry-level position", certificate: "SAP MM Foundation Certificate for Mining Industry", kLevel: "Knowledge Level One" },
  { id: 3, categoryId: 3, name: "SAP Sales and Distribution Assistant for Retail FMCG", description: "Learning SAP SD for South African retail and FMCG processes", certificate: "SAP SD Foundation Certificate for Retail", kLevel: "Knowledge Level One" },
  { id: 4, categoryId: 4, name: "SAP Human Resources Support Trainee with Employment Equity Focus", description: "Supporting SAP HR with Employment Equity Act compliance, trainee level", certificate: "SAP HR Foundation Certificate with Employment Equity", kLevel: "Knowledge Level One" },
  { id: 5, categoryId: 5, name: "SAP Advanced Business Application Programming Junior Developer for Local Customizations", description: "Learning ABAP with South African business customizations", certificate: "SAP ABAP Foundation Certificate for South African Enterprises", kLevel: "Knowledge Level One" },
  { id: 6, categoryId: 6, name: "SAP User Interface Development Trainee for Multi-Language Systems", description: "Learning SAP UI5 and Fiori with South African language support", certificate: "SAP UI5 Foundation Certificate for Multi-Language Applications", kLevel: "Knowledge Level One" },
  { id: 7, categoryId: 7, name: "SAP Integration Technologies Assistant for Banking Systems", description: "Supporting integration with South African banking and government systems", certificate: "SAP Integration Foundation Certificate for Financial Services", kLevel: "Knowledge Level One" },
  { id: 8, categoryId: 8, name: "SAP Basis Administration Trainee for Hybrid Cloud Environments", description: "Learning SAP system administration for cloud and on-premise environments", certificate: "SAP BASIS Foundation Certificate for Hybrid Infrastructure", kLevel: "Knowledge Level One" },
  { id: 9, categoryId: 9, name: "SAP Database Administration Assistant for High-Volume Processing", description: "Supporting database management for high-volume South African transactions", certificate: "SAP Database Foundation Certificate for Enterprise Performance", kLevel: "Knowledge Level One" },
  
  // Knowledge Level Two - Functional Understanding and Junior Consultant (1-2 years experience)
  { id: 10, categoryId: 1, name: "SAP Financial Accounting and Controlling Junior Consultant for Corporate Governance", description: "Working on FICO with King IV governance requirements, 1-2 years experience", certificate: "SAP FICO Associate Certificate with Corporate Governance", kLevel: "Knowledge Level Two" },
  { id: 11, categoryId: 2, name: "SAP Materials Management Junior Consultant for Supply Chain Optimization", description: "Supporting MM processes for South African supply chain networks", certificate: "SAP MM Associate Certificate for Supply Chain Management", kLevel: "Knowledge Level Two" },
  { id: 12, categoryId: 3, name: "SAP Sales and Distribution Junior Consultant for Multi-Channel Retail", description: "Working on SD for omnichannel South African retail environments", certificate: "SAP SD Associate Certificate for Multi-Channel Operations", kLevel: "Knowledge Level Two" },
  { id: 13, categoryId: 4, name: "SAP Human Resources Junior Consultant for Skills Development Compliance", description: "Supporting HR with Skills Development Act and B-BBEE compliance", certificate: "SAP HR Associate Certificate for Skills Development", kLevel: "Knowledge Level Two" },
  { id: 14, categoryId: 5, name: "SAP Advanced Business Application Programming Associate Developer for Industry Solutions", description: "Supporting ABAP development for South African industry-specific solutions", certificate: "SAP ABAP Associate Certificate for Industry Customizations", kLevel: "Knowledge Level Two" },
  { id: 15, categoryId: 6, name: "SAP User Interface Development Associate for Mobile-First Applications", description: "Supporting UI5 and Fiori for mobile workforce solutions", certificate: "SAP UI5 Associate Certificate for Mobile Applications", kLevel: "Knowledge Level Two" },
  { id: 16, categoryId: 7, name: "SAP Integration Technologies Associate for Government Systems", description: "Supporting integration with SARS, Department of Labour, and government systems", certificate: "SAP Integration Associate Certificate for Government Compliance", kLevel: "Knowledge Level Two" },
  { id: 17, categoryId: 8, name: "SAP Basis Administration Associate for Multi-Tenant Environments", description: "Supporting system administration for multi-tenant South African enterprises", certificate: "SAP BASIS Associate Certificate for Multi-Tenant Systems", kLevel: "Knowledge Level Two" },
  { id: 18, categoryId: 9, name: "SAP Database Administration Associate for Business Intelligence", description: "Supporting database management for BI and analytics workloads", certificate: "SAP Database Associate Certificate for Business Intelligence", kLevel: "Knowledge Level Two" },
  
  // Knowledge Level Three - Practitioner and Independent Consultant (2-4 years experience)
  { id: 19, categoryId: 1, name: "SAP Financial Accounting and Controlling Independent Consultant for Multinational Corporations", description: "Independent FICO delivery for JSE-listed multinationals, 2-4 years experience", certificate: "SAP FICO Professional Certificate for Multinational Enterprises", kLevel: "Knowledge Level Three" },
  { id: 20, categoryId: 2, name: "SAP Materials Management Independent Consultant for Manufacturing and Mining", description: "Independent MM implementation for South African manufacturing and mining sectors", certificate: "SAP MM Professional Certificate for Manufacturing and Mining", kLevel: "Knowledge Level Three" },
  { id: 21, categoryId: 3, name: "SAP Sales and Distribution Independent Consultant for E-Commerce Integration", description: "Independent SD delivery with e-commerce and digital transformation", certificate: "SAP SD Professional Certificate for E-Commerce Integration", kLevel: "Knowledge Level Three" },
  { id: 22, categoryId: 4, name: "SAP Human Resources Independent Consultant for Transformation and Change Management", description: "Independent HR implementation with organizational transformation", certificate: "SAP HR Professional Certificate for Organizational Transformation", kLevel: "Knowledge Level Three" },
  { id: 23, categoryId: 5, name: "SAP Advanced Business Application Programming Independent Developer for Integration Solutions", description: "Independent ABAP development for complex integration and custom solutions", certificate: "SAP ABAP Professional Certificate for Integration Development", kLevel: "Knowledge Level Three" },
  { id: 24, categoryId: 6, name: "SAP User Interface Development Independent Consultant for Digital Experience", description: "Independent UI5 and Fiori development for digital workplace transformation", certificate: "SAP UI5 Professional Certificate for Digital Experience", kLevel: "Knowledge Level Three" },
  { id: 25, categoryId: 7, name: "SAP Integration Technologies Independent Consultant for Cloud Migration", description: "Independent system integration for cloud migration and hybrid architectures", certificate: "SAP Integration Professional Certificate for Cloud Migration", kLevel: "Knowledge Level Three" },
  { id: 26, categoryId: 8, name: "SAP Basis Administration Independent Consultant for Performance Optimization", description: "Independent system administration with performance tuning and optimization", certificate: "SAP BASIS Professional Certificate for Performance Optimization", kLevel: "Knowledge Level Three" },
  { id: 27, categoryId: 9, name: "SAP Database Administration Independent Consultant for Data Governance", description: "Independent database management with data governance and security", certificate: "SAP Database Professional Certificate for Data Governance", kLevel: "Knowledge Level Three" },
  
  // Knowledge Level Four - Senior Expert and Lead Consultant (5-8+ years experience)
  { id: 28, categoryId: 1, name: "SAP Financial Accounting and Controlling Lead Consultant for Enterprise Transformation", description: "Leading FICO transformation for JSE Top 40 companies, 5-8+ years experience", certificate: "SAP FICO Expert Certificate for Enterprise Transformation", kLevel: "Knowledge Level Four" },
  { id: 29, categoryId: 2, name: "SAP Materials Management Lead Consultant for Industry Four Point Zero", description: "Leading MM projects for Industry 4.0 and smart manufacturing initiatives", certificate: "SAP MM Expert Certificate for Industry 4.0", kLevel: "Knowledge Level Four" },
  { id: 30, categoryId: 3, name: "SAP Sales and Distribution Lead Consultant for Omnichannel Excellence", description: "Leading SD transformation for omnichannel customer experience", certificate: "SAP SD Expert Certificate for Omnichannel Excellence", kLevel: "Knowledge Level Four" },
  { id: 31, categoryId: 4, name: "SAP Human Resources Solution Lead for Workforce Analytics and Planning", description: "Leading HR solutions with advanced workforce analytics and strategic planning", certificate: "SAP HR Expert Certificate for Workforce Analytics", kLevel: "Knowledge Level Four" },
  { id: 32, categoryId: 5, name: "SAP Advanced Business Application Programming Lead Developer for S/4HANA Migration", description: "Leading ABAP teams for S/4HANA transformation and code remediation", certificate: "SAP ABAP Expert Certificate for S/4HANA Migration", kLevel: "Knowledge Level Four" },
  { id: 33, categoryId: 6, name: "SAP User Interface Development Lead Consultant for Design Thinking Innovation", description: "Leading UI5 and Fiori projects with design thinking and user experience innovation", certificate: "SAP UI5 Expert Certificate for Design Innovation", kLevel: "Knowledge Level Four" },
  { id: 34, categoryId: 7, name: "SAP Integration Technologies Lead Consultant for API Management and Microservices", description: "Leading integration strategy for API management and microservices architecture", certificate: "SAP Integration Expert Certificate for API Management", kLevel: "Knowledge Level Four" },
  { id: 35, categoryId: 8, name: "SAP Basis Administration Senior Lead for Cloud-First Strategy", description: "Leading system administration for cloud-first and hybrid infrastructure strategy", certificate: "SAP BASIS Expert Certificate for Cloud-First Architecture", kLevel: "Knowledge Level Four" },
  { id: 36, categoryId: 9, name: "SAP Database Administration Lead Consultant for Big Data and Analytics", description: "Leading database strategy for big data, analytics, and machine learning workloads", certificate: "SAP Database Expert Certificate for Big Data Analytics", kLevel: "Knowledge Level Four" },
  
  // Knowledge Level Five - Master Solution Architect and Strategist (10+ years experience)
  { id: 37, categoryId: 1, name: "SAP Financial Accounting and Controlling Master Solution Architect for African Market Expansion", description: "Enterprise FICO architecture for pan-African market expansion, 10+ years experience", certificate: "SAP FICO Master Architect Certificate for African Markets", kLevel: "Knowledge Level Five" },
  { id: 38, categoryId: 2, name: "SAP Materials Management Master Solution Architect for Sustainable Supply Chain", description: "Enterprise MM architecture for sustainable and ethical supply chain transformation", certificate: "SAP MM Master Architect Certificate for Sustainable Supply Chain", kLevel: "Knowledge Level Five" },
  { id: 39, categoryId: 3, name: "SAP Sales and Distribution Master Solution Architect for Digital Commerce", description: "Enterprise SD architecture for digital commerce and customer experience transformation", certificate: "SAP SD Master Architect Certificate for Digital Commerce", kLevel: "Knowledge Level Five" },
  { id: 40, categoryId: 4, name: "SAP Human Resources Master Enterprise Architect for Future of Work", description: "Strategic HR architecture for future of work and employee experience transformation", certificate: "SAP HR Master Architect Certificate for Future of Work", kLevel: "Knowledge Level Five" },
  { id: 41, categoryId: 5, name: "SAP Advanced Business Application Programming Master Technical Architect for Innovation", description: "Master ABAP architect for innovation labs and emerging technology integration", certificate: "SAP ABAP Master Architect Certificate for Innovation and Emerging Tech", kLevel: "Knowledge Level Five" },
  { id: 42, categoryId: 6, name: "SAP User Interface Development Master Architect for Inclusive Design", description: "Enterprise UI5 and Fiori architecture with inclusive design and accessibility", certificate: "SAP UI5 Master Architect Certificate for Inclusive Design", kLevel: "Knowledge Level Five" },
  { id: 43, categoryId: 7, name: "SAP Integration Technologies Master Architect for Ecosystem Orchestration", description: "Enterprise integration architecture for ecosystem orchestration and platform strategy", certificate: "SAP Integration Master Architect Certificate for Ecosystem Orchestration", kLevel: "Knowledge Level Five" },
  { id: 44, categoryId: 8, name: "SAP Basis Administration Master Architect for Zero-Downtime Operations", description: "Enterprise system architecture for zero-downtime operations and resilient infrastructure", certificate: "SAP BASIS Master Architect Certificate for Zero-Downtime Operations", kLevel: "Knowledge Level Five" },
  { id: 45, categoryId: 9, name: "SAP Database Administration Master Architect for Intelligent Enterprise", description: "Enterprise database architecture for intelligent enterprise and real-time analytics", certificate: "SAP Database Master Architect Certificate for Intelligent Enterprise", kLevel: "Knowledge Level Five" },
  
  // Non-SAP roles (ICT department examples)
  { id: 46, categoryId: 10, name: "Network Engineer", description: "Enterprise network design and implementation", certificate: "CCNA Certification" },
  { id: 47, categoryId: 10, name: "Network Architect", description: "Network architecture planning and design", certificate: "CCIE Certification" },
  { id: 48, categoryId: 11, name: "Software Developer", description: "Application development using various programming languages", certificate: "Programming Certification" },
  { id: 49, categoryId: 11, name: "Full Stack Developer", description: "Frontend and backend web application development", certificate: "Full Stack Certification" },
  { id: 50, categoryId: 12, name: "Security Analyst", description: "Information security monitoring and threat detection", certificate: "Security+ Certification" },
  { id: 51, categoryId: 12, name: "Penetration Tester", description: "Ethical hacking and vulnerability assessment", certificate: "CEH Certification" },
  { id: 52, categoryId: 13, name: "Database Administrator", description: "Database management and optimization", certificate: "DBA Certification" },
  { id: 53, categoryId: 13, name: "Data Analyst", description: "Data analysis and business intelligence reporting", certificate: "Data Analytics Certification" },
  
  // HR department examples
  { id: 54, categoryId: 14, name: "Talent Acquisition Specialist", description: "Recruitment and hiring processes", certificate: "HR Certification" },
  { id: 55, categoryId: 14, name: "HR Business Partner", description: "Strategic HR support for business units", certificate: "SHRM Certification" },
  { id: 56, categoryId: 15, name: "Employee Relations Manager", description: "Managing workplace relationships and conflicts", certificate: "Employee Relations Certification" },
  { id: 57, categoryId: 15, name: "HR Policy Coordinator", description: "Development and implementation of HR policies", certificate: "HR Policy Certification" },
  
  // Project Management examples
  { id: 58, categoryId: 16, name: "Project Manager", description: "Project planning and execution management", certificate: "PMP Certification" },
  { id: 59, categoryId: 16, name: "Scrum Master", description: "Agile project management and team facilitation", certificate: "Scrum Master Certification" },
  { id: 60, categoryId: 17, name: "Program Manager", description: "Multi-project portfolio management", certificate: "Program Management Certification" },
  { id: 61, categoryId: 17, name: "Project Coordinator", description: "Project support and coordination activities", certificate: "Project Coordination Certification" },
  
  // Service Desk examples
  { id: 62, categoryId: 18, name: "Service Desk Analyst", description: "First-line IT support and incident resolution", certificate: "ITIL Foundation" },
  { id: 63, categoryId: 18, name: "Technical Support Specialist", description: "Advanced technical problem resolution", certificate: "Technical Support Certification" },
  { id: 64, categoryId: 19, name: "Remote Support Technician", description: "Remote desktop and system support", certificate: "Remote Support Certification" },
  { id: 65, categoryId: 19, name: "Field Service Technician", description: "On-site hardware and software support", certificate: "Field Service Certification" }
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