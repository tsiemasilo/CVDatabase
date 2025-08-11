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
  { id: 3, name: "Human Resources", description: "Human Resources and people management" },
  { id: 4, name: "PROJECT MANAGEMENT", description: "Project planning, execution, and delivery" },
  { id: 5, name: "Service Desk", description: "IT support and helpdesk services" },
  { id: 6, name: "DEVELOPMENT", description: "Software development and programming services" }
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
  { id: 16, departmentId: 5, name: "Service Management", description: "ITIL service management and processes" },
  { id: 17, departmentId: 6, name: "Web Development", description: "Frontend and backend web applications" },
  { id: 18, departmentId: 6, name: "Mobile Development", description: "iOS and Android applications" },
  { id: 19, departmentId: 6, name: "Software Engineering", description: "Enterprise software development and architecture" }
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
  { id: 33, disciplineId: 17, name: "Frontend Development", description: "User interface and experience development" },
  { id: 34, disciplineId: 17, name: "Backend Development", description: "Server-side application development" },
  { id: 35, disciplineId: 18, name: "Mobile App Development", description: "iOS and Android application development" },
  { id: 36, disciplineId: 19, name: "System Architecture", description: "Enterprise software architecture and design" },
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
  
  // ICT Department Categories (domains 10-13)
  { id: 10, domainId: 10, name: "Network Infrastructure Management", description: "Network design and IT infrastructure" },
  { id: 11, domainId: 11, name: "Software Development and Programming", description: "Application development and programming" },
  { id: 12, domainId: 12, name: "Cybersecurity and Information Protection", description: "Information security and threat management" },
  { id: 13, domainId: 13, name: "Data Management and Analytics", description: "Database administration and data analytics" },
  
  // HR Department Categories (domains 22-27)
  { id: 14, domainId: 22, name: "Talent Acquisition and Recruitment", description: "Recruitment and staffing processes" },
  { id: 15, domainId: 23, name: "Employee Learning and Development", description: "Training and performance management" },
  { id: 16, domainId: 24, name: "Employee Relations and Support", description: "HR policy and employee support" },
  { id: 17, domainId: 26, name: "Compensation and Benefits Administration", description: "Salary management and employee benefits" },
  
  // Project Management Categories (domains 28-32)
  { id: 18, domainId: 28, name: "Project Planning and Initiation", description: "Project initiation and resource planning" },
  { id: 19, domainId: 30, name: "Project Execution and Delivery", description: "Project delivery and quality management" },
  { id: 20, domainId: 32, name: "Portfolio and Program Management", description: "Strategic portfolio and program management" },
  
  // Service Desk Categories (domains 34-38)
  { id: 21, domainId: 34, name: "Service Desk Operations and Support", description: "First-line support and incident management" },
  { id: 22, domainId: 36, name: "Technical Support and Troubleshooting", description: "Advanced troubleshooting and application support" },
  { id: 23, domainId: 38, name: "IT Service Management and SLA", description: "ITIL service management and SLA monitoring" },
  
  // DEVELOPMENT Department Categories (domains 33-36 from DEVELOPMENT disciplines)
  { id: 24, domainId: 33, name: "Frontend Development", description: "User interface and experience development" },
  { id: 25, domainId: 34, name: "Backend Development", description: "Server-side application development" },
  { id: 26, domainId: 35, name: "Mobile Development", description: "Mobile application development" },
  { id: 27, domainId: 36, name: "Software Engineering", description: "Enterprise software architecture and engineering" }
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
  
  // ICT Department Roles
  { id: 46, categoryId: 10, name: "Network Infrastructure Engineer", description: "Enterprise network design and implementation for South African businesses", certificate: "CCNA Certification" },
  { id: 47, categoryId: 10, name: "Network Solutions Architect", description: "Network architecture planning and design for multi-site operations", certificate: "CCIE Certification" },
  { id: 48, categoryId: 10, name: "Infrastructure Systems Administrator", description: "Server and infrastructure management for enterprise environments", certificate: "Infrastructure Management Certification" },
  { id: 49, categoryId: 11, name: "Software Developer", description: "Application development using various programming languages", certificate: "Programming Certification" },
  { id: 50, categoryId: 11, name: "Full Stack Developer", description: "Frontend and backend web application development", certificate: "Full Stack Development Certification" },
  { id: 51, categoryId: 11, name: "Mobile Application Developer", description: "iOS and Android application development", certificate: "Mobile Development Certification" },
  { id: 52, categoryId: 12, name: "Cybersecurity Analyst", description: "Information security monitoring and threat detection", certificate: "Security+ Certification" },
  { id: 53, categoryId: 12, name: "Penetration Testing Specialist", description: "Ethical hacking and vulnerability assessment", certificate: "CEH Certification" },
  { id: 54, categoryId: 12, name: "Information Security Manager", description: "Security policy development and compliance management", certificate: "CISSP Certification" },
  { id: 55, categoryId: 13, name: "Database Administrator", description: "Database management and optimization", certificate: "DBA Certification" },
  { id: 56, categoryId: 13, name: "Data Analyst", description: "Data analysis and business intelligence reporting", certificate: "Data Analytics Certification" },
  { id: 57, categoryId: 13, name: "Business Intelligence Developer", description: "BI solutions development and data warehousing", certificate: "BI Development Certification" },
  
  // HR Department Roles
  { id: 58, categoryId: 14, name: "Talent Acquisition Specialist", description: "Recruitment and hiring processes for South African market", certificate: "HR Certification" },
  { id: 59, categoryId: 14, name: "HR Business Partner", description: "Strategic HR support for business units", certificate: "SHRM Certification" },
  { id: 60, categoryId: 14, name: "Recruitment Consultant", description: "Specialized recruitment for technical and executive roles", certificate: "Recruitment Professional Certification" },
  { id: 61, categoryId: 15, name: "Learning and Development Specialist", description: "Employee training and development programs", certificate: "L&D Professional Certification" },
  { id: 62, categoryId: 15, name: "Performance Management Coordinator", description: "Performance evaluation and improvement processes", certificate: "Performance Management Certification" },
  { id: 63, categoryId: 15, name: "Skills Development Facilitator", description: "Skills Development Act compliance and SETA coordination", certificate: "Skills Development Certification" },
  { id: 64, categoryId: 16, name: "Employee Relations Manager", description: "Managing workplace relationships and Employment Equity compliance", certificate: "Employee Relations Certification" },
  { id: 65, categoryId: 16, name: "HR Policy Coordinator", description: "Development and implementation of HR policies", certificate: "HR Policy Certification" },
  { id: 66, categoryId: 16, name: "Workplace Wellness Coordinator", description: "Employee wellness and mental health programs", certificate: "Wellness Program Certification" },
  { id: 67, categoryId: 17, name: "Compensation and Benefits Analyst", description: "Salary benchmarking and benefits administration", certificate: "Compensation Management Certification" },
  { id: 68, categoryId: 17, name: "Payroll Administrator", description: "Payroll processing and tax compliance", certificate: "Payroll Management Certification" },
  { id: 69, categoryId: 17, name: "Benefits Administration Specialist", description: "Medical aid, provident fund, and employee benefits management", certificate: "Benefits Administration Certification" },
  
  // Project Management Roles
  { id: 70, categoryId: 18, name: "Project Manager", description: "Project planning and execution management using PMI methodology", certificate: "PMP Certification" },
  { id: 71, categoryId: 18, name: "Agile Project Manager", description: "Agile project management and team facilitation", certificate: "Agile Project Management Certification" },
  { id: 72, categoryId: 18, name: "Project Coordinator", description: "Project support and coordination activities", certificate: "Project Coordination Certification" },
  { id: 73, categoryId: 19, name: "Project Delivery Manager", description: "End-to-end project delivery and stakeholder management", certificate: "Project Delivery Certification" },
  { id: 74, categoryId: 19, name: "Change Management Specialist", description: "Organizational change management and transformation", certificate: "Change Management Certification" },
  { id: 75, categoryId: 19, name: "Quality Assurance Manager", description: "Project quality control and process improvement", certificate: "Quality Management Certification" },
  { id: 76, categoryId: 20, name: "Program Manager", description: "Multi-project portfolio management and strategic alignment", certificate: "Program Management Professional Certification" },
  { id: 77, categoryId: 20, name: "Portfolio Manager", description: "Strategic portfolio planning and governance", certificate: "Portfolio Management Certification" },
  { id: 78, categoryId: 20, name: "Project Management Office Lead", description: "PMO setup, governance, and methodology standardization", certificate: "PMO Leadership Certification" },
  
  // Service Desk Roles
  { id: 79, categoryId: 21, name: "Service Desk Analyst Level 1", description: "First-line IT support and incident logging", certificate: "ITIL Foundation" },
  { id: 80, categoryId: 21, name: "Service Desk Team Leader", description: "Service desk team management and escalation coordination", certificate: "ITIL Service Operation" },
  { id: 81, categoryId: 21, name: "Incident Management Specialist", description: "Incident resolution and SLA management", certificate: "Incident Management Certification" },
  { id: 82, categoryId: 22, name: "Technical Support Specialist Level 2", description: "Advanced technical problem resolution and system troubleshooting", certificate: "Technical Support Professional Certification" },
  { id: 83, categoryId: 22, name: "Application Support Analyst", description: "Business application maintenance and user support", certificate: "Application Support Certification" },
  { id: 84, categoryId: 22, name: "Desktop Support Technician", description: "End-user hardware and software support", certificate: "Desktop Support Certification" },
  { id: 85, categoryId: 23, name: "IT Service Manager", description: "ITIL service management and continuous improvement", certificate: "ITIL Expert" },
  { id: 86, categoryId: 23, name: "SLA Management Coordinator", description: "Service level agreement monitoring and reporting", certificate: "SLA Management Certification" },
  { id: 87, categoryId: 23, name: "IT Service Delivery Manager", description: "Service delivery oversight and vendor management", certificate: "Service Delivery Management Certification" },
  
  // Additional ICT Roles to match CV record data
  { id: 88, categoryId: 10, name: "Network Administrator", description: "Enterprise network management and administration", certificate: "CCNA Certification" },
  { id: 89, categoryId: 10, name: "Senior Network Admin", description: "Senior-level network infrastructure management", certificate: "CCNP Certification" },
  { id: 90, categoryId: 10, name: "IT Infrastructure Manager", description: "IT infrastructure planning and management", certificate: "IT Infrastructure Management Certification" },
  { id: 91, categoryId: 10, name: "ICT Operations Manager", description: "ICT operations oversight and strategic planning", certificate: "IT Operations Management Certification" },
  
  // Additional Development Roles to match CV record data
  { id: 92, categoryId: 24, name: "Junior Developer", description: "Entry-level software development position", certificate: "Programming Fundamentals Certification" },
  { id: 93, categoryId: 25, name: "Junior Database Developer", description: "Entry-level database development and administration", certificate: "Database Development Certification" },
  { id: 94, categoryId: 24, name: "Junior Web Developer", description: "Entry-level web application development", certificate: "Web Development Certification" },
  { id: 95, categoryId: 27, name: "Software Developer", description: "Software application development and programming", certificate: "Software Development Professional Certification" },
  { id: 96, categoryId: 24, name: "Full Stack Developer", description: "Full-stack web application development", certificate: "Full Stack Development Certification" },
  
  // Additional Project Management Roles to match CV record data
  { id: 97, categoryId: 18, name: "Senior Project Manager", description: "Senior-level project management and leadership", certificate: "Advanced PMP Certification" },
  
  // Additional SAP Roles to match CV record data
  { id: 98, categoryId: 5, name: "SAP ABAP Developer", description: "SAP ABAP programming and development", certificate: "SAP ABAP Developer Certification" },
  { id: 99, categoryId: 5, name: "SAP Technical Consultant", description: "SAP technical consulting and implementation", certificate: "SAP Technical Consultant Certification" }
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

// Certificate mappings for different roles based on department and role
export interface CertificateMapping {
  department: string;
  role: string;
  certificates: string[];
}

export const CERTIFICATE_MAPPINGS: CertificateMapping[] = [
  // SAP Department
  {
    department: "SAP",
    role: "SAP ABAP Developer",
    certificates: [
      "SAP Certified Development Associate - ABAP with SAP NetWeaver",
      "SAP Certified Development Professional - ABAP for SAP HANA",
      "SAP Certified Application Associate - SAP ABAP Development",
      "SAP Certified Development Specialist - ABAP for SAP S/4HANA",
      "SAP Certified Associate - SAP ABAP Development Tools",
      "SAP Certified Professional - SAP ABAP Performance Optimization",
      "SAP Certified Expert - SAP ABAP Development with Eclipse",
      "SAP Certified Specialist - SAP ABAP Web Dynpro",
      "SAP Certified Associate - SAP ABAP Object-Oriented Programming",
      "SAP Certified Professional - SAP ABAP Advanced Programming"
    ]
  },
  {
    department: "SAP",
    role: "SAP Functional Consultant",
    certificates: [
      "SAP Certified Application Associate - SAP S/4HANA for Financial Accounting Associates",
      "SAP Certified Application Associate - SAP S/4HANA Sales",
      "SAP Certified Application Associate - SAP S/4HANA Material Management",
      "SAP Certified Application Associate - SAP S/4HANA Human Resources",
      "SAP Certified Application Associate - SAP S/4HANA Production Planning",
      "SAP Certified Application Associate - SAP S/4HANA Sourcing and Procurement",
      "SAP Certified Application Associate - SAP BusinessObjects Business Intelligence",
      "SAP Certified Application Associate - SAP S/4HANA Project Management",
      "SAP Certified Application Associate - SAP S/4HANA Quality Management",
      "SAP Certified Application Associate - SAP S/4HANA Plant Maintenance"
    ]
  },
  {
    department: "SAP",
    role: "SAP Technical Consultant",
    certificates: [
      "SAP Certified Technology Associate - SAP S/4HANA System Administration",
      "SAP Certified Technology Associate - SAP HANA 2.0 SPS04",
      "SAP Certified Technology Associate - SAP Basis Administration",
      "SAP Certified Technology Associate - SAP NetWeaver Application Server",
      "SAP Certified Technology Associate - SAP S/4HANA Cloud Technical Implementation",
      "SAP Certified Technology Associate - SAP Process Integration",
      "SAP Certified Technology Associate - SAP Cloud Platform Integration",
      "SAP Certified Technology Associate - SAP S/4HANA Embedded Analytics",
      "SAP Certified Technology Associate - SAP HANA Cloud Provisioning",
      "SAP Certified Technology Associate - SAP S/4HANA Migration and Upgrade"
    ]
  },
  // Development Department
  {
    department: "Development",
    role: "Junior Developer",
    certificates: [
      "Microsoft Certified: Azure Fundamentals",
      "AWS Certified Cloud Practitioner",
      "CompTIA IT Fundamentals+",
      "Oracle Certified Associate, Java SE 11 Developer",
      "Microsoft Certified: Programming in C#",
      "Google Cloud Digital Leader",
      "Scrum Foundation Professional Certificate",
      "HTML5 Application Development Fundamentals",
      "Python Institute Certified Entry-Level Python Programmer",
      "JavaScript Developer Certificate"
    ]
  },
  {
    department: "Development",
    role: "Software Developer",
    certificates: [
      "Microsoft Certified: Azure Developer Associate",
      "AWS Certified Developer - Associate",
      "Oracle Certified Professional, Java SE 11 Developer",
      "Microsoft Certified: .NET Developer",
      "Google Cloud Professional Cloud Developer",
      "Certified Scrum Developer (CSD)",
      "MongoDB Certified Developer Associate",
      "React Developer Certification",
      "Node.js Application Developer Certification",
      "Full Stack Web Developer Certificate"
    ]
  },
  {
    department: "Development",
    role: "Senior Developer",
    certificates: [
      "Microsoft Certified: Azure Solutions Architect Expert",
      "AWS Certified Solutions Architect - Professional",
      "Oracle Certified Master, Java SE 11 Developer",
      "Microsoft Certified: DevOps Engineer Expert",
      "Google Cloud Professional Cloud Architect",
      "Certified Scrum Professional Developer (CSP-D)",
      "MongoDB Certified Developer Professional",
      "Kubernetes Certified Application Developer (CKAD)",
      "Docker Certified Associate",
      "Certified Ethical Hacker (CEH)"
    ]
  },
  // ICT Department
  {
    department: "ICT",
    role: "IT Support Technician",
    certificates: [
      "CompTIA A+ Certification",
      "CompTIA Network+ Certification",
      "Microsoft Certified: Modern Desktop Administrator Associate",
      "CompTIA Security+ Certification",
      "ITIL Foundation Certificate",
      "Microsoft 365 Certified: Fundamentals",
      "VMware Certified Professional - Data Center Virtualization",
      "Cisco Certified Network Associate (CCNA)",
      "Apple Certified Support Professional",
      "Linux Professional Institute Certification Level 1"
    ]
  },
  {
    department: "ICT",
    role: "Network Administrator",
    certificates: [
      "Cisco Certified Network Professional (CCNP)",
      "CompTIA Network+ Certification",
      "Microsoft Certified: Azure Administrator Associate",
      "VMware Certified Professional - Network Virtualization",
      "Juniper Networks Certified Associate (JNCIA)",
      "CompTIA Security+ Certification",
      "Palo Alto Networks Certified Network Security Administrator",
      "F5 Certified BIG-IP Administrator",
      "Aruba Certified Switching Professional",
      "Fortinet Network Security Expert (NSE)"
    ]
  },
  {
    department: "ICT",
    role: "Systems Analyst",
    certificates: [
      "CBAP - Certified Business Analysis Professional",
      "PMI Professional in Business Analysis (PMI-PBA)",
      "IIBA Agile Analysis Certification (IIBA-AAC)",
      "Microsoft Certified: Azure Solutions Architect Expert",
      "TOGAF 9 Certified",
      "Certified Information Systems Analyst (CISA)",
      "Six Sigma Green Belt Certification",
      "Lean IT Foundation Certificate",
      "ITIL Expert Certificate",
      "Certified ScrumMaster (CSM)"
    ]
  },
  // HR Department
  {
    department: "Human Resources",
    role: "HR Assistant",
    certificates: [
      "Professional in Human Resources (PHR)",
      "Society for Human Resource Management Certified Professional (SHRM-CP)",
      "Human Resources Information Professional (HRIP)",
      "Certified Compensation Professional (CCP)",
      "Global Professional in Human Resources (GPHR)",
      "Certified Employee Benefit Specialist (CEBS)",
      "Human Resources Business Partner Certificate",
      "Certified Talent Development Professional (CTDP)",
      "Certified Professional in Learning and Performance (CPLP)",
      "HR Analytics Certificate"
    ]
  },
  {
    department: "Human Resources",
    role: "Recruitment Coordinator",
    certificates: [
      "Certified Talent Acquisition Professional (CTAP)",
      "Professional in Human Resources (PHR)",
      "Society for Human Resource Management Certified Professional (SHRM-CP)",
      "Certified Recruitment Professional (CRP)",
      "Global Professional in Human Resources (GPHR)",
      "Certified Employment Interview Professional (CEIP)",
      "LinkedIn Certified Professional - Recruiter",
      "Certified Internet Recruiter (CIR)",
      "Certified Diversity and Inclusion Recruiter (CDIR)",
      "Certified Social Recruiting Strategist (CSRS)"
    ]
  },
  {
    department: "Human Resources",
    role: "HR Business Partner",
    certificates: [
      "Senior Professional in Human Resources (SPHR)",
      "Society for Human Resource Management Senior Certified Professional (SHRM-SCP)",
      "Human Resources Business Partner Certificate",
      "Certified Compensation Professional (CCP)",
      "Global Professional in Human Resources (GPHR)",
      "Certified Benefits Professional (CBP)",
      "Certified Employee Benefit Specialist (CEBS)",
      "Certified Talent Development Professional (CTDP)",
      "Certified Professional in Learning and Performance (CPLP)",
      "HR Analytics and Metrics Certificate"
    ]
  },
  // Project Management Department
  {
    department: "Project Management",
    role: "Project Coordinator",
    certificates: [
      "Project Management Professional (PMP)",
      "Certified Associate in Project Management (CAPM)",
      "PRINCE2 Foundation Certificate",
      "Agile Certified Practitioner (PMI-ACP)",
      "Certified ScrumMaster (CSM)",
      "Microsoft Project Certification",
      "Certified Project Coordinator (CPC)",
      "Project Management Institute Scheduling Professional (PMI-SP)",
      "Project Management Institute Risk Management Professional (PMI-RMP)",
      "ITIL Foundation Certificate"
    ]
  },
  {
    department: "Project Management",
    role: "Project Officer",
    certificates: [
      "Project Management Professional (PMP)",
      "PRINCE2 Practitioner Certificate",
      "Agile Certified Practitioner (PMI-ACP)",
      "Certified ScrumMaster (CSM)",
      "Microsoft Project Advanced Certification",
      "Certified Project Manager (CPM)",
      "Project Management Institute Scheduling Professional (PMI-SP)",
      "Project Management Institute Risk Management Professional (PMI-RMP)",
      "Six Sigma Green Belt Certification",
      "Change Management Certification"
    ]
  },
  {
    department: "Project Management",
    role: "Project Manager",
    certificates: [
      "Project Management Professional (PMP)",
      "PRINCE2 Advanced Practitioner Certificate",
      "Program Management Professional (PgMP)",
      "Agile Certified Practitioner (PMI-ACP)",
      "Certified Scrum Professional (CSP)",
      "Portfolio Management Professional (PfMP)",
      "Project Management Institute Risk Management Professional (PMI-RMP)",
      "Project Management Institute Scheduling Professional (PMI-SP)",
      "Six Sigma Black Belt Certification",
      "Change Management Professional Certification"
    ]
  },
  // Service Desk Department
  {
    department: "Service Desk",
    role: "Service Desk Agent",
    certificates: [
      "ITIL Foundation Certificate",
      "CompTIA A+ Certification",
      "Microsoft Certified: Modern Desktop Administrator Associate",
      "HDI Customer Service Representative (HDI-CSR)",
      "HDI Desktop Support Technician (HDI-DST)",
      "CompTIA Network+ Certification",
      "Microsoft 365 Certified: Fundamentals",
      "ServiceNow Certified System Administrator",
      "Certified Help Desk Professional (CHDP)",
      "Customer Service Excellence Certificate"
    ]
  },
  {
    department: "Service Desk",
    role: "Technical Support Specialist",
    certificates: [
      "CompTIA A+ Certification",
      "CompTIA Network+ Certification",
      "ITIL Foundation Certificate",
      "Microsoft Certified: Azure Administrator Associate",
      "HDI Support Center Analyst (HDI-SCA)",
      "ServiceNow Certified Application Developer",
      "VMware Certified Professional - Data Center Virtualization",
      "Cisco Certified Network Associate (CCNA)",
      "Microsoft 365 Certified: Enterprise Administrator Expert",
      "CompTIA Security+ Certification"
    ]
  },
  {
    department: "Service Desk",
    role: "Service Desk Analyst",
    certificates: [
      "ITIL Expert Certificate",
      "HDI Support Center Analyst (HDI-SCA)",
      "ServiceNow Certified Implementation Specialist",
      "CompTIA A+ Certification",
      "Microsoft Certified: Azure Administrator Associate",
      "Six Sigma Green Belt Certification",
      "COBIT 5 Foundation Certificate",
      "Certified Information Systems Auditor (CISA)",
      "Microsoft 365 Certified: Enterprise Administrator Expert",
      "Change Management Certification"
    ]
  },
  // Finance Department
  {
    department: "Finance",
    role: "Financial Analyst",
    certificates: [
      "Chartered Financial Analyst (CFA)",
      "Financial Risk Manager (FRM)",
      "Certified Financial Planner (CFP)",
      "Chartered Accountant (CA)",
      "Certified Public Accountant (CPA)",
      "Certified Management Accountant (CMA)",
      "Financial Modeling & Valuation Analyst (FMVA)",
      "Certified Investment Management Analyst (CIMA)",
      "Chartered Financial Consultant (ChFC)",
      "Certified Treasury Professional (CTP)"
    ]
  },
  {
    department: "Finance",
    role: "Accountant",
    certificates: [
      "Chartered Accountant (CA)",
      "Certified Public Accountant (CPA)",
      "Certified Management Accountant (CMA)",
      "Certified Internal Auditor (CIA)",
      "Certified Information Systems Auditor (CISA)",
      "Association of Chartered Certified Accountants (ACCA)",
      "Certified Fraud Examiner (CFE)",
      "Enrolled Agent (EA)",
      "QuickBooks ProAdvisor Certification",
      "SAP Financial Accounting Certification"
    ]
  },
  {
    department: "Finance",
    role: "Financial Manager",
    certificates: [
      "Chartered Financial Analyst (CFA)",
      "Certified Public Accountant (CPA)",
      "Chartered Accountant (CA)",
      "Financial Risk Manager (FRM)",
      "Certified Treasury Professional (CTP)",
      "Certified Management Accountant (CMA)",
      "Master of Business Administration (MBA) - Finance",
      "Certified Investment Management Analyst (CIMA)",
      "Chartered Financial Consultant (ChFC)",
      "Project Management Professional (PMP)"
    ]
  },
  // Marketing Department
  {
    department: "Marketing",
    role: "Marketing Assistant",
    certificates: [
      "Google Analytics Certified",
      "Google Ads Certification",
      "Facebook Blueprint Certification",
      "HubSpot Content Marketing Certification",
      "Hootsuite Social Media Marketing Certification",
      "American Marketing Association Professional Certified Marketer",
      "Digital Marketing Institute Certification",
      "Salesforce Marketing Cloud Certification",
      "LinkedIn Marketing Solutions Certification",
      "Mailchimp Email Marketing Certification"
    ]
  },
  {
    department: "Marketing",
    role: "Digital Marketing Specialist",
    certificates: [
      "Google Analytics Certified",
      "Google Ads Certification",
      "Facebook Blueprint Certification",
      "HubSpot Inbound Marketing Certification",
      "Salesforce Marketing Cloud Certification",
      "Adobe Certified Expert - Marketing Cloud",
      "Amazon DSP Certification",
      "Microsoft Advertising Certified Professional",
      "Twitter Flight School Certification",
      "YouTube Creator Academy Certification"
    ]
  },
  {
    department: "Marketing",
    role: "Marketing Manager",
    certificates: [
      "American Marketing Association Professional Certified Marketer",
      "Digital Marketing Institute Professional Diploma",
      "HubSpot Marketing Software Certification",
      "Google Analytics Individual Qualification",
      "Salesforce Marketing Cloud Consultant",
      "Adobe Certified Expert - Marketing Cloud",
      "Certified Marketing Management Professional",
      "Project Management Professional (PMP)",
      "Certified Customer Experience Professional",
      "Master of Business Administration (MBA) - Marketing"
    ]
  },
  // Operations Department
  {
    department: "Operations",
    role: "Operations Assistant",
    certificates: [
      "Certified Associate in Project Management (CAPM)",
      "Six Sigma Yellow Belt",
      "ITIL Foundation Certificate",
      "Lean Foundation Certificate",
      "Supply Chain Operations Reference (SCOR) Model",
      "Microsoft Office Specialist (MOS)",
      "Certified Administrative Professional (CAP)",
      "Business Process Management Professional (BPMP)",
      "Certified Quality Improvement Associate (CQIA)",
      "Process Excellence Network Certification"
    ]
  },
  {
    department: "Operations",
    role: "Operations Specialist",
    certificates: [
      "Six Sigma Green Belt",
      "Lean Six Sigma Green Belt",
      "Project Management Professional (PMP)",
      "Certified Supply Chain Professional (CSCP)",
      "APICS Supply Chain Operations Reference (SCOR)",
      "Certified in Production and Inventory Management (CPIM)",
      "Business Process Management Professional (BPMP)",
      "Certified Quality Engineer (CQE)",
      "ISO 9001:2015 Lead Auditor",
      "Change Management Certification"
    ]
  },
  {
    department: "Operations",
    role: "Operations Manager",
    certificates: [
      "Six Sigma Black Belt",
      "Lean Six Sigma Black Belt",
      "Project Management Professional (PMP)",
      "Certified Supply Chain Professional (CSCP)",
      "Certified in Production and Inventory Management (CPIM)",
      "Certified Professional in Supply Management (CPSM)",
      "Master Black Belt Certification",
      "Certified Quality Manager (CQM)",
      "ISO 9001:2015 Lead Auditor",
      "Master of Business Administration (MBA) - Operations"
    ]
  },
  // Test Department
  {
    department: "Test",
    role: "Test 2",
    certificates: [
      "Test Certificate A",
      "Test Certificate B",
      "Test Certificate C",
      "Advanced Test Certification",
      "Professional Test Credential"
    ]
  }
];