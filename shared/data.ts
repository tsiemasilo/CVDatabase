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

export const ROLES: Role[] = [
  { id: 1, department: "Engineering and Technology", role: "Civil Engineer", description: "Design and oversee construction of infrastructure projects including roads, bridges, and water systems." },
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

export const QUALIFICATION_TYPES = [
  "Certificate", "Diploma", "Degree", "Honours", "Masters", "Doctorate", 
  "Professional", "Trade", "Matric", "Short Course", "Other"
];

export const QUALIFICATION_NAMES = [
  "National Senior Certificate", "Bachelor of Commerce", "Bachelor of Science", 
  "Bachelor of Arts", "National Diploma", "Bachelor of Technology", 
  "Master of Business Administration", "Chartered Accountant"
];

export const NQF_LEVELS = ["5", "6", "7", "8", "9", "10"];

export const SAP_K_LEVELS = ["---n/a---", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8"];

export const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];