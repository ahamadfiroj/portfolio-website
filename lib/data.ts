export const personalInfo = {
  name: "Firoj Ahamad",
  title: "Senior Software Engineer (Frontend)",
  email: "famd786@gmail.com",
  phone: "+919005214654",
  location: "Gurugram, Haryana",
  github: "https://github.com/ahamadfiroj",
  linkedin: "https://www.linkedin.com/in/firoj-ahamad-90921b114/",
  bio: "Frontend Developer with 4 years of experience building scalable, high-performance applications using React.js, JavaScript, and TypeScript. Contributed to platforms like Travelplusapp.com, Fabhotels.com, and 8+ internal projects, with expertise in UI development, performance optimization, and API integration.",
  resumeUrl: "https://drive.google.com/uc?export=download&id=1zS_g5f5KWZwxQYRNhTv07wi0AkoedidD" // Replace with your actual cloud resume URL
};

export const skills = {
  frontend: [
    { name: "React.js", level: 95 },
    { name: "JavaScript", level: 95 },
    { name: "TypeScript", level: 90 },
    { name: "HTML5", level: 95 },
    { name: "CSS3", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "React Router", level: 90 },
    { name: "Vite", level: 85 },
  ],
  stateManagement: [
    { name: "Redux Toolkit", level: 95 },
    { name: "Redux Thunk", level: 90 },
    { name: "Redux Saga", level: 90 },
    { name: "Context API", level: 85 },
  ],
  styling: [
    { name: "Styled Components", level: 90 },
    { name: "SASS", level: 85 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Tailwind UI", level: 85 },
    { name: "Material UI", level: 85 },
    { name: "Internal Storybook Library", level: 90 },
  ],
  backend: [
    { name: "Node.js", level: 80 },
    { name: "Express.js", level: 80 },
    { name: "RESTful APIs", level: 85 },
    { name: "API Integration", level: 90 },
  ],
  tools: [
    "Git", "GitHub", "Cursor IDE", "Claude Code AI", "Webpack", "Babel",
    "Axios", "ESLint", "Prettier", "Jenkins", "GCP", "AWS", "Postman", "Storybook",
    "Slack", "Zoho Email", "ClickUp"
  ]
};

export const projects = [
  {
    id: 1,
    title: "TravelPlusApp.com",
    description: "B2B Travel and Expense Management Platform for Corporate Solutions",
    longDescription: "TravelPlusApp.com is a B2B project used for travel and expense management for corporates. It integrates with all travel systems like hotel booking, flight booking, bus booking, cab booking and train booking. The platform provides an employee web app for trip raising and also admin management concept for bookings approval and to create bookings. Developed using micro frontend architecture to integrate employee web app and admin web app seamlessly.",
    technologies: ["React.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Redux", "Redux-Thunk", "Redux-Saga", "Tailwind CSS", "Node.js", "Express.js", "Styled Components", "Internal Storybook UI Library", "Sentry Integration", "Event Handling", "Micro Frontend"],
    image: "/project1.jpg",
    liveUrl: "https://www.travelplusapp.com/",
    category: "own",
    features: [
      "Integrated with all travel systems: hotel, flight, bus, cab, and train booking",
      "Employee web app for trip raising and management",
      "Admin management for booking approvals and creation",
      "Micro frontend architecture for employee and admin web apps integration",
      "Corporate travel and expense management",
      "Sentry integration for comprehensive logs and debugging",
      "Internal Storybook UI library for consistent components",
      "Advanced event handling for seamless user experience"
    ]
  },
  {
    id: 2,
    title: "WorkWithX.com",
    description: "Social Media Job Search Platform (Similar to LinkedIn)",
    longDescription: "WorkWithX.com is a social media job search project similar to LinkedIn. It is designed for collaborating between job seekers and recruiters, providing a comprehensive platform for professional networking and job matching. The platform facilitates seamless interaction between candidates and hiring managers.",
    technologies: ["React.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Redux", "Redux Toolkit", "Vite", "Tailwind CSS", "Node.js", "Express.js", "Styled Components", "Internal Storybook UI Library", "Sentry Integration"],
    image: "/project2.jpg",
    liveUrl: "https://www.workwithx.com/",
    category: "own",
    features: [
      "Social media job search platform similar to LinkedIn",
      "Collaboration platform for job seekers and recruiters",
      "Professional networking and profile management",
      "Advanced job posting and search functionality",
      "Built with Vite for optimized development experience",
      "Redux Toolkit for efficient state management",
      "Internal Storybook UI library for component consistency",
      "Sentry integration for comprehensive logs and debugging"
    ]
  },
  {
    id: 3,
    title: "FabHotels.com",
    description: "B2C Hotel Booking Platform for Indian and International Cities",
    longDescription: "FabHotels.com is a B2C project used for hotel booking. This portal is used for hotel bookings for customers all over Indian cities and international cities. The platform provides comprehensive hotel booking services with advanced search, filtering, and booking management capabilities, built using micro frontend architecture.",
    technologies: ["React.js", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Node.js", "Express.js", "Styled Components", "Internal Storybook UI Library", "Sentry Integration", "Event Handling", "Micro Frontend"],
    image: "/project3.jpg",
    liveUrl: "https://www.fabhotels.com/",
    category: "own",
    features: [
      "B2C hotel booking platform for customers",
      "Hotel bookings across all Indian cities and international cities",
      "Comprehensive booking management system",
      "Micro frontend architecture for scalable development",
      "Next.js for server-side rendering and SEO optimization",
      "Advanced event handling for smooth user interactions",
      "Internal Storybook UI library for design consistency",
      "Sentry integration for detailed logs and debugging"
    ]
  },
  {
    id: 4,
    title: "Internal Admin Projects",
    description: "Comprehensive Admin and Management Systems for Enterprise Operations",
    longDescription: "Developed multiple internal admin and management systems to streamline enterprise operations across various domains. These projects encompass user management, booking systems, communication portals, and financial management tools, all built using modern React technology and role-based access control.",
    technologies: ["React.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Redux", "Redux Toolkit", "Node.js", "Express.js", "Role Management", "API Integration", "Email Templates", "Payment Integration", "Configuration Management"],
    image: "/project4.jpg",
    category: "own",
    features: [
      "User Management System developed with modern React technology",
      "Hotel Conference Booking platform for corporate events",
      "Corporate Hotel Booking system for business travel",
      "Corporate Flight, Bus, and Train booking integration",
      "Invoice Admin Portal for financial management",
      "Sales Portal for company onboarding management",
      "Client Communication Portal for seamless interaction",
      "External Hotel Settlement system with hotel configuration, payouts, booking prevention, and sourcing integration based on role management",
      "Hotelier Portal for hotel partner management",
      "Invoice Template system with email invoice and voucher generation",
      "FTL (Full Truck Load) template integration for logistics"
    ]
  }
];

export const experience = [
  {
    title: "FE(Senior Software Engineer)",
    company: "Fabhotels.com",
    period: "April 2022 – Present",
    location: "Gurugram, India",
    description: "Led end-to-end development of React applications for Hotel, Operations, and B2C Pods, delivering significant improvements in business metrics and user experience.",
    achievements: [
      "Delivered 15–20% increase in bookings and 12–16% boost in user satisfaction through scalable architectures, responsive UI, and TypeScript integration",
      "Modernized legacy React 16 + Redux-Thunk (JavaScript) codebase to React 18 with TypeScript, Redux Toolkit, and Redux-Saga",
      "Leveraged Cursor IDE and Claude Code AI to accelerate delivery, reduce technical debt, and improve maintainability",
      "Developed reusable Storybook component library for streamlining development workflows",
      "Designed and integrated Node.js + Express middleware for API proxying, logging, and secure error handling",
      "Developed, consumed, and optimized RESTful APIs, reducing response times significantly",
      "Collaborated with backend teams on API design, scalability, and performance tuning using Slack for communication",
      "Implemented CI/CD pipelines using Jenkins, Google Cloud Platform (GCP), and Amazon Web Services (AWS)",
      "Managed project workflows and task coordination using ClickUp for efficient team collaboration",
      "Utilized Zoho Email and Slack for seamless team communication and client coordination"
    ]
  },
  {
    title: "Frontend Engineer (Internship)",
    company: "Fabhotels.com",
    period: "October 2021 – April 2022",
    location: "Gurgaon, India",
    description: "Built strong foundation in React.js ecosystem while contributing to UI development, bug fixes, and code optimization.",
    achievements: [
      "Gained expertise in React.js, JavaScript, HTML5, and CSS3 through hands-on development",
      "Contributed to UI development, bug fixes, and code optimization initiatives",
      "Collaborated with senior developers to enhance features and adopt industry best practices",
      "Participated in code reviews and learned modern development workflows",
      "Assisted in component development and styling improvements"
    ]
  },
  {
    title: "SME (Freelancer)",
    company: "Chegg India Pvt. Ltd.",
    period: "July 2018 – October 2021",
    location: "Delhi, India",
    description: "Served as Subject Matter Expert providing Engineering solutions while transitioning into frontend development during the pandemic.",
    achievements: [
      "Provided expert Engineering solutions on Chegg platform",
      "Strengthened problem-solving skills through complex technical challenges",
      "Transitioned into front-end development during pandemic period",
      "Developed strong analytical and communication skills",
      "Maintained high rating and positive feedback from students"
    ]
  }
];

export const education = [
  {
    degree: "M.Tech",
    institution: "Jamia Millia Islamia",
    location: "New Delhi",
    year: "2020",
    grade: "GPA: 7.6"
  },
  {
    degree: "B.Tech",
    institution: "AKTU",
    location: "Lucknow, Uttar Pradesh",
    year: "2017",
    grade: "67%"
  }
];

export const testimonials = [
  {
    name: "Engineering Manager",
    role: "Senior Engineering Manager",
    company: "FabHotels",
    text: "Firoj's ability to modernize legacy codebases and deliver measurable business impact is exceptional. His work increased our bookings by 15-20% and significantly improved user satisfaction."
  },
  {
    name: "Technical Lead",
    role: "Full Stack Lead",
    company: "FabHotels",
    text: "Firoj's expertise in React ecosystem and modern development practices, combined with his proficiency in AI-assisted development tools, makes him a valuable asset to any development team."
  }
];