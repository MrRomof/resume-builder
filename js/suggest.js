// ============================================================
//  Ready-made options (suggestions), per-section writing tips
//  and the general resume guide. Add more freely.
//  SUGGEST[key][lang] = [{ name, items: [...] }]
// ============================================================

// Group that is the same in both languages (tool names)
const same = (name, items) => ({ fa: { name: name.fa, items }, en: { name: name.en, items } });
// Group with translated items
const both = (name, fa, en) => ({ fa: { name: name.fa, items: fa }, en: { name: name.en, items: en } });
const byLang = groups => ({ fa: groups.map(g => g.fa), en: groups.map(g => g.en) });
const flat = (fa, en) => ({ fa: [{ name: '', items: fa }], en: [{ name: '', items: en }] });

const SUGGEST = {
  skills: byLang([
    same(L('زبان‌های برنامه‌نویسی', 'Programming languages'), ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust', 'PHP', 'Kotlin', 'Swift', 'Dart', 'Ruby', 'R', 'SQL', 'Bash']),
    same(L('فرانت‌اند', 'Frontend'), ['HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap', 'React', 'Next.js', 'Vue.js', 'Nuxt', 'Angular', 'Svelte', 'Redux', 'Vite', 'Webpack', 'Responsive Design', 'Web Accessibility']),
    same(L('بک‌اند', 'Backend'), ['Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Laravel', 'Spring Boot', 'ASP.NET Core', 'Ruby on Rails', 'REST API', 'GraphQL', 'gRPC', 'Microservices', 'RabbitMQ', 'Kafka']),
    same(L('موبایل', 'Mobile'), ['Android', 'iOS', 'Flutter', 'React Native', 'Jetpack Compose', 'SwiftUI', 'Kotlin Multiplatform', 'Firebase']),
    same(L('پایگاه داده', 'Databases'), ['PostgreSQL', 'MySQL', 'SQL Server', 'Oracle', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite']),
    same(L('زیرساخت و ابری', 'DevOps & cloud'), ['Git', 'Docker', 'Kubernetes', 'Linux', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Terraform', 'Ansible', 'AWS', 'Azure', 'Google Cloud', 'Nginx', 'Prometheus', 'Grafana']),
    same(L('داده و هوش مصنوعی', 'Data & AI'), ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'LLMs', 'Prompt Engineering', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Data Visualization', 'Statistics', 'Power BI', 'Tableau', 'Apache Spark', 'ETL']),
    same(L('تست و کیفیت', 'Testing & QA'), ['Unit Testing', 'Jest', 'Cypress', 'Playwright', 'Selenium', 'Postman', 'JMeter', 'Test Automation', 'Manual Testing']),
    same(L('شبکه و امنیت', 'Networking & security'), ['CCNA', 'Network+', 'MikroTik', 'Windows Server', 'Active Directory', 'VMware', 'Firewall', 'Network Security', 'Penetration Testing', 'SIEM', 'ISO 27001']),
    both(L('طراحی', 'Design'),
      ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro', 'CorelDRAW', 'Canva', 'Blender', 'Cinema 4D', 'طراحی رابط کاربری (UI)', 'تحقیقات تجربه کاربری (UX)', 'وایرفریم', 'پروتوتایپ', 'سیستم طراحی', 'موشن گرافیک', 'برندینگ', 'تایپوگرافی'],
      ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro', 'CorelDRAW', 'Canva', 'Blender', 'Cinema 4D', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Motion Graphics', 'Branding', 'Typography']),
    same(L('مهندسی و فنی', 'Engineering'), ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'Abaqus', 'MATLAB', 'Simulink', 'Revit', 'ETABS', 'SAP2000', 'SAFE', 'Civil 3D', 'Tekla', 'Primavera P6', 'MS Project', 'PLC', 'Siemens TIA Portal', 'Altium Designer', 'Proteus', 'LabVIEW', 'Aspen HYSYS', 'ArcGIS']),
    both(L('مدیریت پروژه و محصول', 'Project & product'),
      ['مدیریت پروژه', 'مدیریت محصول', 'اسکرام (Scrum)', 'اجایل (Agile)', 'کانبان', 'Jira', 'Trello', 'Confluence', 'نقشه راه محصول', 'تحلیل کسب‌وکار', 'مستندسازی نیازمندی‌ها', 'Google Analytics', 'تست A/B', 'مدیریت ذی‌نفعان'],
      ['Project Management', 'Product Management', 'Scrum', 'Agile', 'Kanban', 'Jira', 'Trello', 'Confluence', 'Product Roadmapping', 'Business Analysis', 'Requirements Gathering', 'Google Analytics', 'A/B Testing', 'OKRs', 'Stakeholder Management']),
    both(L('بازاریابی و فروش', 'Marketing & sales'),
      ['دیجیتال مارکتینگ', 'سئو (SEO)', 'تبلیغات گوگل (Google Ads)', 'تبلیغات شبکه‌های اجتماعی', 'بازاریابی محتوا', 'ایمیل مارکتینگ', 'کپی‌رایتینگ', 'مدیریت شبکه‌های اجتماعی', 'تحقیقات بازار', 'برندینگ', 'فروش B2B', 'فروش تلفنی', 'مذاکره و فروش', 'مدیریت ارتباط با مشتری (CRM)', 'پشتیبانی مشتری'],
      ['Digital Marketing', 'SEO', 'SEM', 'Google Ads', 'Meta Ads', 'Content Marketing', 'Email Marketing', 'Copywriting', 'Social Media Management', 'Market Research', 'Branding', 'B2B Sales', 'Lead Generation', 'Negotiation', 'CRM (Salesforce / HubSpot)', 'Customer Success', 'Customer Support']),
    both(L('مالی و حسابداری', 'Finance & accounting'),
      ['حسابداری مالی', 'حسابداری صنعتی', 'تهیه صورت‌های مالی', 'تحلیل مالی', 'بودجه‌بندی', 'حسابرسی', 'قوانین مالیاتی', 'حقوق و دستمزد', 'بیمه و تأمین اجتماعی', 'خزانه‌داری', 'نرم‌افزار سپیدار', 'نرم‌افزار همکاران سیستم', 'نرم‌افزار راهکاران', 'نرم‌افزار محک', 'نرم‌افزار هلو', 'اکسل پیشرفته'],
      ['Financial Accounting', 'Cost Accounting', 'Financial Statements', 'Financial Analysis', 'Financial Modeling', 'Budgeting & Forecasting', 'Auditing', 'Taxation', 'IFRS', 'Payroll', 'Accounts Payable / Receivable', 'QuickBooks', 'SAP FI/CO', 'Advanced Excel']),
    both(L('منابع انسانی و اداری', 'HR & office'),
      ['جذب و استخدام', 'مصاحبه شغلی', 'آموزش کارکنان', 'ارزیابی عملکرد', 'قانون کار', 'امور اداری', 'دبیرخانه و مکاتبات اداری', 'بایگانی', 'ورود اطلاعات', 'ICDL', 'Word', 'Excel', 'PowerPoint', 'Outlook', 'تایپ ده‌انگشتی'],
      ['Recruiting', 'Interviewing', 'Onboarding', 'Training & Development', 'Performance Management', 'Employee Relations', 'Labor Law', 'HRIS', 'Office Administration', 'Data Entry', 'Microsoft Office', 'Word', 'Excel', 'PowerPoint', 'Outlook', 'Google Workspace', 'Touch Typing']),
    both(L('سلامت و درمان', 'Healthcare'),
      ['مراقبت از بیمار', 'کمک‌های اولیه', 'احیای قلبی‌ریوی (CPR)', 'تزریقات', 'پرستاری', 'داروشناسی', 'ثبت پرونده پزشکی', 'سیستم اطلاعات بیمارستانی (HIS)', 'کار با تجهیزات پزشکی', 'آزمایشگاه', 'رادیولوژی'],
      ['Patient Care', 'First Aid', 'CPR / BLS', 'Nursing', 'Pharmacology', 'Medical Records', 'EHR / EMR', 'Phlebotomy', 'Medical Equipment', 'Laboratory Techniques', 'Clinical Research']),
    both(L('آموزش', 'Education'),
      ['طرح درس', 'مدیریت کلاس', 'تدریس آنلاین', 'طراحی آموزشی', 'ارزشیابی آموزشی', 'تدریس خصوصی', 'آموزش زبان', 'تولید محتوای آموزشی'],
      ['Lesson Planning', 'Classroom Management', 'Online Teaching', 'Instructional Design', 'Curriculum Development', 'Assessment', 'Tutoring', 'Language Teaching', 'E-learning (Moodle)']),
    both(L('نویسندگی، ترجمه و حقوق', 'Writing, translation & legal'),
      ['ترجمه انگلیسی به فارسی', 'ترجمه فارسی به انگلیسی', 'ویراستاری', 'نمونه‌خوانی', 'تولید محتوا', 'نویسندگی فنی', 'زیرنویس', 'تنظیم قرارداد', 'تحقیقات حقوقی', 'حقوق تجارت'],
      ['Translation', 'Editing', 'Proofreading', 'Content Writing', 'Technical Writing', 'Creative Writing', 'Subtitling', 'Contract Drafting', 'Legal Research', 'Commercial Law']),
    both(L('خدمات، عملیات و فروشگاه', 'Operations, retail & hospitality'),
      ['خدمات مشتری', 'صندوق‌داری', 'مدیریت انبار', 'لجستیک', 'زنجیره تأمین', 'خرید و تدارکات', 'کنترل کیفیت', 'ایمنی و بهداشت (HSE)', 'تولید ناب (Lean)', 'باریستا', 'آشپزی حرفه‌ای', 'برگزاری رویداد'],
      ['Customer Service', 'Cash Handling', 'POS Systems', 'Inventory Management', 'Logistics', 'Supply Chain', 'Procurement', 'Quality Control', 'HSE', 'Lean / Six Sigma', 'Barista', 'Food Safety', 'Event Planning']),
  ]),
  soft: flat(
    ['کار تیمی', 'حل مسئله', 'مدیریت زمان', 'ارتباط مؤثر', 'تفکر انتقادی', 'خلاقیت', 'رهبری', 'انعطاف‌پذیری', 'مسئولیت‌پذیری', 'یادگیری سریع', 'مدیریت استرس', 'کار تحت فشار', 'مذاکره', 'ارائه و سخنرانی', 'دقت و نظم', 'هوش هیجانی', 'حل تعارض', 'تصمیم‌گیری', 'منتورینگ', 'خودانگیختگی', 'مشتری‌مداری', 'انجام هم‌زمان چند کار'],
    ['Teamwork', 'Problem Solving', 'Time Management', 'Communication', 'Critical Thinking', 'Creativity', 'Leadership', 'Adaptability', 'Accountability', 'Fast Learner', 'Stress Management', 'Working Under Pressure', 'Negotiation', 'Public Speaking', 'Attention to Detail', 'Emotional Intelligence', 'Conflict Resolution', 'Decision Making', 'Mentoring', 'Self-motivation', 'Customer Focus', 'Multitasking']),
  languages: flat(
    ['فارسی', 'انگلیسی', 'عربی', 'ترکی استانبولی', 'ترکی آذربایجانی', 'کردی', 'آلمانی', 'فرانسوی', 'اسپانیایی', 'ایتالیایی', 'روسی', 'چینی', 'ژاپنی', 'کره‌ای', 'هندی', 'اردو', 'پرتغالی', 'هلندی', 'سوئدی', 'ارمنی'],
    ['Persian (Farsi)', 'English', 'Arabic', 'Turkish', 'Azerbaijani', 'Kurdish', 'German', 'French', 'Spanish', 'Italian', 'Russian', 'Chinese (Mandarin)', 'Japanese', 'Korean', 'Hindi', 'Urdu', 'Portuguese', 'Dutch', 'Swedish', 'Armenian']),
  interests: flat(
    ['کتاب‌خوانی', 'ورزش', 'فوتبال', 'والیبال', 'کوهنوردی', 'دوچرخه‌سواری', 'شنا', 'یوگا', 'عکاسی', 'سفر', 'موسیقی', 'نوازندگی', 'سینما', 'تئاتر', 'شطرنج', 'نقاشی', 'خوشنویسی', 'آشپزی', 'باغبانی', 'فعالیت‌های متن‌باز', 'بازی‌های رایانه‌ای', 'وبلاگ‌نویسی', 'کار داوطلبانه'],
    ['Reading', 'Sports', 'Football', 'Volleyball', 'Hiking', 'Cycling', 'Swimming', 'Yoga', 'Photography', 'Travel', 'Music', 'Playing guitar', 'Movies', 'Theater', 'Chess', 'Painting', 'Calligraphy', 'Cooking', 'Gardening', 'Open Source', 'Gaming', 'Blogging', 'Volunteering']),
  jobs: byLang([
    both(L('نرم‌افزار و فناوری اطلاعات', 'Software & IT'),
      ['توسعه‌دهنده فرانت‌اند', 'توسعه‌دهنده بک‌اند', 'توسعه‌دهنده فول‌استک', 'توسعه‌دهنده موبایل', 'توسعه‌دهنده اندروید', 'توسعه‌دهنده iOS', 'مهندس نرم‌افزار', 'برنامه‌نویس پایتون', 'برنامه‌نویس جاوا', 'برنامه‌نویس PHP', 'برنامه‌نویس دات‌نت', 'توسعه‌دهنده بازی', 'مهندس دواپس', 'مهندس تست نرم‌افزار (QA)', 'کارشناس شبکه', 'کارشناس امنیت اطلاعات', 'مدیر سیستم', 'کارشناس پشتیبانی فنی (IT)', 'معمار نرم‌افزار', 'مدیر فنی (CTO)'],
      ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'Android Developer', 'iOS Developer', 'Software Engineer', 'Senior Software Engineer', 'Python Developer', 'Java Developer', 'PHP Developer', '.NET Developer', 'Game Developer', 'DevOps Engineer', 'Site Reliability Engineer', 'QA Engineer', 'Network Engineer', 'Cybersecurity Analyst', 'System Administrator', 'IT Support Specialist', 'Software Architect', 'Engineering Manager', 'CTO']),
    both(L('داده و هوش مصنوعی', 'Data & AI'),
      ['تحلیلگر داده', 'دانشمند داده', 'مهندس داده', 'مهندس یادگیری ماشین', 'پژوهشگر هوش مصنوعی', 'کارشناس هوش تجاری (BI)', 'مدیر پایگاه داده'],
      ['Data Analyst', 'Data Scientist', 'Data Engineer', 'Machine Learning Engineer', 'AI Researcher', 'BI Analyst', 'Database Administrator']),
    both(L('طراحی و هنر', 'Design & creative'),
      ['طراح رابط و تجربه کاربری (UI/UX)', 'طراح محصول', 'طراح گرافیک', 'موشن دیزاینر', 'تصویرساز', 'طراح سه‌بعدی', 'عکاس', 'تدوینگر', 'طراح داخلی', 'طراح لباس'],
      ['UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Motion Designer', 'Illustrator', '3D Artist', 'Photographer', 'Video Editor', 'Interior Designer', 'Fashion Designer']),
    both(L('مهندسی', 'Engineering'),
      ['مهندس عمران', 'مهندس سازه', 'مهندس معمار', 'مهندس مکانیک', 'مهندس برق', 'مهندس الکترونیک', 'مهندس کنترل و ابزار دقیق', 'مهندس صنایع', 'مهندس شیمی', 'مهندس نفت', 'مهندس مواد و متالورژی', 'مهندس کشاورزی', 'مهندس محیط زیست', 'مهندس پزشکی', 'نقشه‌کش', 'کارشناس دفتر فنی', 'سرپرست کارگاه', 'کارشناس HSE'],
      ['Civil Engineer', 'Structural Engineer', 'Architect', 'Mechanical Engineer', 'Electrical Engineer', 'Electronics Engineer', 'Control & Instrumentation Engineer', 'Industrial Engineer', 'Chemical Engineer', 'Petroleum Engineer', 'Materials Engineer', 'Agricultural Engineer', 'Environmental Engineer', 'Biomedical Engineer', 'CAD Technician', 'Site Supervisor', 'HSE Officer']),
    both(L('مدیریت و محصول', 'Management & product'),
      ['مدیر محصول', 'مالک محصول (Product Owner)', 'مدیر پروژه', 'اسکرام مستر', 'تحلیلگر کسب‌وکار', 'مدیر عملیات', 'مدیرعامل', 'مدیر واحد', 'مشاور مدیریت', 'کارشناس برنامه‌ریزی و کنترل پروژه'],
      ['Product Manager', 'Product Owner', 'Project Manager', 'Scrum Master', 'Business Analyst', 'Operations Manager', 'CEO', 'Department Manager', 'Management Consultant', 'Project Controls Specialist']),
    both(L('بازاریابی و فروش', 'Marketing & sales'),
      ['کارشناس دیجیتال مارکتینگ', 'کارشناس سئو', 'کارشناس تولید محتوا', 'کارشناس شبکه‌های اجتماعی', 'کارشناس تبلیغات', 'مدیر بازاریابی', 'کارشناس فروش', 'کارشناس فروش تلفنی', 'بازاریاب', 'کارشناس بازرگانی', 'کارشناس خرید', 'مدیر فروش', 'کارشناس ارتباط با مشتری'],
      ['Digital Marketing Specialist', 'SEO Specialist', 'Content Creator', 'Social Media Manager', 'Performance Marketer', 'Marketing Manager', 'Sales Representative', 'Inside Sales Representative', 'Account Manager', 'Business Development Manager', 'Purchasing Specialist', 'Sales Manager', 'Customer Success Manager']),
    both(L('مالی و حسابداری', 'Finance & accounting'),
      ['حسابدار', 'حسابدار ارشد', 'کارشناس مالی', 'مدیر مالی', 'حسابرس', 'کارشناس مالیاتی', 'کارشناس حقوق و دستمزد', 'کارشناس بیمه', 'تحلیلگر مالی', 'کارشناس بانکی', 'کارشناس بورس و سرمایه‌گذاری', 'خزانه‌دار'],
      ['Accountant', 'Senior Accountant', 'Financial Specialist', 'Finance Manager', 'Auditor', 'Tax Specialist', 'Payroll Specialist', 'Insurance Specialist', 'Financial Analyst', 'Bank Officer', 'Investment Analyst', 'Treasurer']),
    both(L('منابع انسانی و اداری', 'HR & office'),
      ['کارشناس منابع انسانی', 'کارشناس جذب و استخدام', 'مدیر منابع انسانی', 'کارشناس آموزش', 'کارشناس اداری', 'منشی', 'مسئول دفتر', 'کارمند دبیرخانه', 'اپراتور ورود اطلاعات', 'کارشناس پشتیبانی مشتری', 'اپراتور مرکز تماس'],
      ['HR Specialist', 'Recruiter', 'HR Manager', 'Training Specialist', 'Office Administrator', 'Secretary', 'Executive Assistant', 'Office Manager', 'Data Entry Clerk', 'Customer Support Specialist', 'Call Center Agent']),
    both(L('سلامت و درمان', 'Healthcare'),
      ['پزشک عمومی', 'پزشک متخصص', 'دندانپزشک', 'پرستار', 'ماما', 'داروساز', 'کارشناس آزمایشگاه', 'کارشناس رادیولوژی', 'فیزیوتراپیست', 'روانشناس', 'کارشناس تغذیه', 'تکنسین داروخانه', 'منشی مطب'],
      ['General Practitioner', 'Physician', 'Dentist', 'Nurse', 'Midwife', 'Pharmacist', 'Lab Technician', 'Radiology Technologist', 'Physiotherapist', 'Psychologist', 'Dietitian', 'Pharmacy Technician', 'Medical Receptionist']),
    both(L('آموزش و پژوهش', 'Education & research'),
      ['معلم', 'دبیر', 'مدرس زبان انگلیسی', 'مدرس دانشگاه', 'مربی', 'پژوهشگر', 'دستیار پژوهشی', 'طراح آموزشی', 'مشاور تحصیلی'],
      ['Teacher', 'High School Teacher', 'English Teacher', 'University Lecturer', 'Trainer', 'Researcher', 'Research Assistant', 'Instructional Designer', 'Academic Advisor']),
    both(L('رسانه، نویسندگی و ترجمه', 'Media, writing & translation'),
      ['مترجم', 'ویراستار', 'روزنامه‌نگار', 'نویسنده محتوا', 'کپی‌رایتر', 'گوینده', 'خبرنگار'],
      ['Translator', 'Editor', 'Journalist', 'Content Writer', 'Copywriter', 'Voice-over Artist', 'Reporter']),
    both(L('تولید، عملیات و لجستیک', 'Operations & logistics'),
      ['کارشناس لجستیک', 'انباردار', 'کارشناس زنجیره تأمین', 'کارشناس کنترل کیفیت (QC)', 'کارشناس تضمین کیفیت (QA)', 'سرپرست تولید', 'اپراتور تولید', 'تکنسین فنی', 'تکنسین برق', 'راننده', 'پیک'],
      ['Logistics Specialist', 'Warehouse Keeper', 'Supply Chain Specialist', 'Quality Control Inspector', 'Quality Assurance Specialist', 'Production Supervisor', 'Production Operator', 'Technician', 'Electrician', 'Driver', 'Courier']),
    both(L('خدمات و فروشگاه', 'Retail & hospitality'),
      ['صندوقدار', 'فروشنده', 'کارمند فروشگاه', 'باریستا', 'آشپز', 'پذیرشگر هتل', 'راهنمای تور', 'کارشناس املاک'],
      ['Cashier', 'Sales Associate', 'Store Clerk', 'Barista', 'Chef / Cook', 'Hotel Receptionist', 'Tour Guide', 'Real Estate Agent']),
    both(L('حقوقی', 'Legal'), ['وکیل', 'کارشناس حقوقی', 'مشاور حقوقی', 'کارشناس قراردادها'], ['Lawyer', 'Legal Specialist', 'Legal Advisor', 'Contract Specialist']),
    both(L('دانشجو و تازه‌کار', 'Students & entry level'), ['کارآموز', 'دانشجو', 'کارجوی تازه‌کار'], ['Intern', 'Student', 'Junior / Entry-level', 'Graduate Trainee']),
  ]),
  degrees: flat(
    ['دیپلم', 'کاردانی', 'کارشناسی', 'کارشناسی ارشد', 'دکتری', 'پسادکتری'],
    ['High School Diploma', 'Associate Degree', 'B.Sc. ', 'B.A. ', 'M.Sc. ', 'M.A. ', 'MBA', 'Ph.D. ']),
  military: flat(['پایان خدمت', 'معافیت دائم', 'معافیت تحصیلی', 'در حال خدمت', 'مشمول'], ['Completed', 'Permanently exempt', 'Educational exemption', 'Currently serving']),
  marital: flat(['مجرد', 'متأهل'], ['Single', 'Married']),
  gender: flat(['زن', 'مرد'], ['Female', 'Male']),
  nationality: flat(['ایرانی', 'افغانستانی'], ['Iranian', 'Afghan']),
  license: flat(['پایه یک', 'پایه دو', 'موتورسیکلت', 'ندارم'], ['Yes', 'No']),
  workmode: flat(['تمام‌وقت', 'پاره‌وقت', 'دورکاری', 'حضوری', 'هیبریدی (ترکیبی)', 'پروژه‌ای'], ['Full-time', 'Part-time', 'Remote', 'On-site', 'Hybrid', 'Freelance / Contract']),
};

// Writing tips shown from each section's 💡 button
const TIPS = {
  about: L(
    ['۳ تا ۵ خط کافی است؛ این اولین چیزی است که کارفرما می‌خواند.', 'بگویید چه کاره‌اید، چند سال تجربه دارید و در چه چیزی قوی هستید.', 'یک دستاورد مشخص با عدد بیاورید.', 'برای هر آگهی، این بخش را با همان شغل هماهنگ کنید.', 'از جمله‌های کلی مثل «فردی سخت‌کوش و منظم» پرهیز کنید؛ نشان دهید، نگویید.'],
    ['3–5 lines is enough — it is the first thing a recruiter reads.', 'Say what you do, how many years of experience you have and what you are best at.', 'Include one concrete, measurable achievement.', 'Tailor it to each job you apply for.', 'Avoid clichés like “hard-working team player” — show, don’t tell.']),
  experience: L(
    ['از جدیدترین شغل شروع کنید (ترتیب معکوس زمانی).', 'برای هر شغل ۲ تا ۵ مورد کوتاه بنویسید که هر کدام با «•» شروع شود.', 'دستاورد بنویسید، نه شرح وظایف: به‌جای «مسئول فروش» بنویسید «افزایش ۲۰٪ فروش در ۶ ماه».', 'با یک فعل قوی شروع کنید: «طراحی و پیاده‌سازی…»، «راه‌اندازی…»، «کاهش…»، «افزایش…»، «رهبری…»، «بهینه‌سازی…».', 'هر جا ممکن است از عدد استفاده کنید: درصد، مبلغ، تعداد کاربر، زمان.', 'سوابق خیلی قدیمی یا بی‌ربط را کوتاه کنید یا حذف کنید.', 'عنوان شغل و تاریخ‌ها باید با پروفایل لینکدین شما یکی باشد.'],
    ['List your most recent job first (reverse-chronological).', 'Write 2–5 short bullet points per role, each starting with “•”.', 'Show achievements, not duties: instead of “Responsible for sales”, write “Grew sales 20% in 6 months”.', 'Start with a strong verb: Led, Built, Designed, Launched, Improved, Reduced, Increased, Automated, Delivered, Optimized.', 'Use numbers wherever you can: %, $, users, time saved.', 'Shorten or drop very old or unrelated jobs.', 'Keep titles and dates consistent with your LinkedIn profile.']),
  internship: L(
    ['برای دانشجوها و تازه‌کارها بسیار ارزشمند است.', 'بنویسید چه کاری انجام دادید و چه نتیجه‌ای داشت، حتی اگر کوچک بود.'],
    ['Very valuable for students and recent graduates.', 'Say what you actually did and the result, even if it was small.']),
  education: L(
    ['آخرین مدرک را اول بنویسید.', 'معدل را فقط اگر خوب است بیاورید.', 'اگر سابقه کاری کم دارید، پروژه‌های درسی، پایان‌نامه و افتخارات را اضافه کنید.', 'اگر سال‌ها تجربه کاری دارید، این بخش را کوتاه نگه دارید.'],
    ['Put your most recent degree first.', 'Only include your GPA if it is strong.', 'Little work experience? Add coursework projects, thesis and honors.', 'With many years of experience, keep this section short.']),
  projects: L(
    ['برای برنامه‌نویس‌ها، طراح‌ها و تازه‌کارها بسیار مهم است.', 'لینک نمونه‌کار یا گیت‌هاب را بگذارید.', 'بگویید مسئله چه بود، شما چه کردید، با چه ابزاری و نتیجه چه شد.'],
    ['Essential for developers, designers and career starters.', 'Add a link to the live project or repository.', 'Explain the problem, what you did, the tools and the outcome.']),
  skills: L(
    ['۸ تا ۱۵ مهارتِ مرتبط با همان شغل کافی است.', 'کلیدواژه‌های آگهی شغلی را (اگر واقعاً بلدید) با همان نوشتار بیاورید؛ نرم‌افزارهای غربالگری رزومه دنبال آن‌ها می‌گردند.', 'همه مهارت‌ها را «حرفه‌ای» نزنید؛ واقعی بودن اعتماد می‌سازد.', 'مهارت‌های نرم را در بخش جدا بیاورید.'],
    ['8–15 skills relevant to the job are enough.', 'Mirror keywords from the job ad (if you really have them) — applicant tracking systems scan for them.', 'Don’t rate everything “Expert” — honest levels build trust.', 'Keep soft skills in their own section.']),
  languages: L(
    ['سطح را صادقانه بزنید؛ در مصاحبه سنجیده می‌شود.', 'اگر مدرک دارید (مثل آیلتس یا تافل) در گواهینامه‌ها یا کنار نام زبان بیاورید.'],
    ['Be honest about levels — they get tested in interviews.', 'If you have a test score (IELTS, TOEFL…), add it next to the language or in Certifications.']),
  softskills: L(['فقط چند مورد که واقعاً شما را توصیف می‌کند؛ بهتر است در سوابق شغلی هم نمونه‌اش دیده شود.'], ['Pick a few that truly describe you — ideally backed by examples in your experience.']),
  interests: L(['اختیاری است؛ اگر جا کم دارید حذفش کنید.', 'موارد خاص و مرتبط با شغل (مثل فعالیت متن‌باز) بیشتر به چشم می‌آیند.'], ['Optional — drop it if you need space.', 'Specific or job-related interests (like open source) stand out more.']),
  certificates: L(['فقط گواهینامه‌های معتبر و مرتبط را بیاورید.', 'نام صادرکننده و تاریخ را ذکر کنید.'], ['Only list credible, relevant certifications.', 'Include the issuer and date.']),
  courses: L(['دوره‌های مرتبط و جدید را بیاورید، نه همه دوره‌ها را.'], ['List recent, relevant courses — not every course you took.']),
  awards: L(['بگویید جایزه برای چه بود و رقابت چقدر بزرگ بود (مثلاً «رتبه اول بین ۲۰۰ تیم»).'], ['Say what it was for and how competitive it was (e.g. “1st of 200 teams”).']),
  publications: L(['به سبک استناد علمی بنویسید و لینک (DOI) بدهید.'], ['Use a consistent citation style and include a link or DOI.']),
  volunteer: L(['کار داوطلبانه هم تجربه است؛ مخصوصاً وقتی سابقه کاری کم دارید.'], ['Volunteering counts as experience — especially early in your career.']),
  references: L(['قبل از نوشتن نام کسی، از او اجازه بگیرید.', 'اگر جا کم دارید، بنویسید «در صورت درخواست ارائه می‌شود».'], ['Ask people before listing them.', 'Short on space? Write “Available on request”.']),
  customText: L(['عنوان واضح و استاندارد انتخاب کنید تا خواننده و نرم‌افزارها راحت بفهمند.'], ['Use a clear, standard title so people and software understand it.']),
  customList: L(['عنوان واضح و استاندارد انتخاب کنید تا خواننده و نرم‌افزارها راحت بفهمند.'], ['Use a clear, standard title so people and software understand it.']),
};

// General guide shown in the Review tab
const GUIDE = L(
  ['کارفرما معمولاً چند ثانیه اول را صرف نگاه کلی می‌کند؛ نام، عنوان شغلی و خلاصه باید واضح باشند.',
   'برای کمتر از ۱۰ سال سابقه، یک صفحه بهترین است.',
   'برای هر آگهی یک کپی از رزومه بسازید (تب «رزومه‌ها») و آن را با همان شغل هماهنگ کنید.',
   'برای سایت‌های کاریابی و شرکت‌های بزرگ که رزومه را با نرم‌افزار غربال می‌کنند، قالب «ساده (ATS)» مطمئن‌تر است.',
   'در رزومه‌های ایرانی عکس و وضعیت نظام وظیفه رایج است؛ برای شرکت‌های خارجی معمولاً عکس، سن و وضعیت تأهل را نمی‌آورند.',
   'ایمیل حرفه‌ای (نام شما) بگذارید و آدرس کامل منزل لازم نیست؛ شهر کافی است.',
   'اطلاعات رزومه باید با لینکدین و پروفایل‌های کاریابی شما یکی باشد.',
   'قبل از ارسال، رزومه را یک بار با فاصله بخوانید یا به کسی بدهید تا غلط‌ها را پیدا کند.',
   'نام فایل را حرفه‌ای بگذارید؛ مثلاً «Ali-Rezaei-Resume.pdf».',
   'هیچ‌وقت اطلاعات نادرست ننویسید.'],
  ['Recruiters skim the top first — your name, title and summary must be clear.',
   'With under ~10 years of experience, one page is best.',
   'Make a copy for each job (Resumes tab) and tailor it to that role.',
   'For job portals and large companies that screen with software (ATS), the “Simple (ATS)” template is the safest.',
   'In the US, UK and Canada, leave out photo, age, marital status and gender.',
   'Use a professional email (your name). City and country are enough — no full address.',
   'Keep your resume consistent with your LinkedIn profile.',
   'Proofread after a break, or ask someone else to read it.',
   'Name the file professionally, e.g. “Ali-Rezaei-Resume.pdf”.',
   'Never include anything untrue.']);
