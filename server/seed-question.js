const mongoose = require("mongoose");
const Question = require("./models/question-model");

// Load environment variables
require("dotenv").config();
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    const questions = [
      // Programming Domain (10 Questions)
      {
        domain: "Programming",
        questionText: "What is the output of `console.log(typeof null)`?",
        options: ["null", "object", "undefined", "string"],
        correctAnswer: "object",
      },
      {
        domain: "Programming",
        questionText: "Which loop is guaranteed to execute at least once?",
        options: ["for", "while", "do-while", "foreach"],
        correctAnswer: "do-while",
      },
      {
        domain: "Programming",
        questionText:
          "What keyword declares a variable with block scope in JavaScript?",
        options: ["var", "let", "const", "global"],
        correctAnswer: "let",
      },
      {
        domain: "Programming",
        questionText: "What does `===` operator check in JavaScript?",
        options: ["Value only", "Type only", "Value and type", "Reference"],
        correctAnswer: "Value and type",
      },
      {
        domain: "Programming",
        questionText: "Which method reverses an array in place?",
        options: ["sort()", "reverse()", "shift()", "pop()"],
        correctAnswer: "reverse()",
      },
      {
        domain: "Programming",
        questionText: "What is a closure in JavaScript?",
        options: [
          "A loop",
          "A function with access to outer scope",
          "An array method",
          "A class",
        ],
        correctAnswer: "A function with access to outer scope",
      },
      {
        domain: "Programming",
        questionText: "What does the `async` keyword do?",
        options: [
          "Makes a function synchronous",
          "Returns a Promise",
          "Blocks execution",
          "None",
        ],
        correctAnswer: "Returns a Promise",
      },
      {
        domain: "Programming",
        questionText: "Which is not a primitive data type in JavaScript?",
        options: ["Number", "String", "Object", "Boolean"],
        correctAnswer: "Object",
      },
      {
        domain: "Programming",
        questionText: "What does `NaN` stand for?",
        options: ["Not a Number", "New and Null", "No Action", "None"],
        correctAnswer: "Not a Number",
      },
      {
        domain: "Programming",
        questionText: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: "push()",
      },

      // Data Science Domain (10 Questions)
      {
        domain: "Data Science",
        questionText: "What does Pandas primarily do in Python?",
        options: [
          "Web scraping",
          "Data manipulation",
          "Machine learning",
          "Networking",
        ],
        correctAnswer: "Data manipulation",
      },
      {
        domain: "Data Science",
        questionText: "What is a common measure of central tendency?",
        options: ["Mean", "Variance", "Standard Deviation", "Skewness"],
        correctAnswer: "Mean",
      },
      {
        domain: "Data Science",
        questionText: "What Python library is used for data visualization?",
        options: ["NumPy", "Matplotlib", "SciPy", "Pandas"],
        correctAnswer: "Matplotlib",
      },
      {
        domain: "Data Science",
        questionText: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Query Language",
          "System Query Logic",
          "Structured Quick Language",
        ],
        correctAnswer: "Structured Query Language",
      },
      {
        domain: "Data Science",
        questionText: "Which statistical measure describes data spread?",
        options: ["Median", "Mode", "Variance", "Midpoint"],
        correctAnswer: "Variance",
      },
      {
        domain: "Data Science",
        questionText: "What is the purpose of a confusion matrix?",
        options: [
          "Data cleaning",
          "Model evaluation",
          "Feature selection",
          "Data transformation",
        ],
        correctAnswer: "Model evaluation",
      },
      {
        domain: "Data Science",
        questionText:
          "Which Python library is known for numerical computation?",
        options: ["Pandas", "NumPy", "Seaborn", "Scikit-learn"],
        correctAnswer: "NumPy",
      },
      {
        domain: "Data Science",
        questionText: "What does overfitting mean in machine learning?",
        options: [
          "Model fits data too well",
          "Model is too simple",
          "Model ignores noise",
          "Model predicts perfectly",
        ],
        correctAnswer: "Model fits data too well",
      },
      {
        domain: "Data Science",
        questionText: "What type of data is 'Age'?",
        options: ["Nominal", "Ordinal", "Interval", "Ratio"],
        correctAnswer: "Ratio",
      },
      {
        domain: "Data Science",
        questionText: "What is a primary key in a database?",
        options: [
          "Unique identifier",
          "Foreign key",
          "Index",
          "Duplicate field",
        ],
        correctAnswer: "Unique identifier",
      },

      // Web Development Domain (10 Questions)
      {
        domain: "Web Development",
        questionText: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "HighTech Markup Language",
          "HyperTool Multi Language",
          "Home Text Markup Language",
        ],
        correctAnswer: "HyperText Markup Language",
      },
      {
        domain: "Web Development",
        questionText: "Which CSS property aligns text horizontally?",
        options: ["text-align", "font-align", "align-text", "position"],
        correctAnswer: "text-align",
      },
      {
        domain: "Web Development",
        questionText: "What is the purpose of `<!DOCTYPE html>`?",
        options: [
          "Declares HTML version",
          "Comments code",
          "Links styles",
          "Defines metadata",
        ],
        correctAnswer: "Declares HTML version",
      },
      {
        domain: "Web Development",
        questionText: "Which HTML tag defines a paragraph?",
        options: ["<p>", "<div>", "<span>", "<para>"],
        correctAnswer: "<p>",
      },
      {
        domain: "Web Development",
        questionText: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Creative Style System",
          "Computer Style Sheets",
          "Cascading Script Syntax",
        ],
        correctAnswer: "Cascading Style Sheets",
      },
      {
        domain: "Web Development",
        questionText: "Which property sets the background color in CSS?",
        options: ["color", "background-color", "bg-color", "background"],
        correctAnswer: "background-color",
      },
      {
        domain: "Web Development",
        questionText: "What HTTP method is used to retrieve data?",
        options: ["POST", "GET", "PUT", "DELETE"],
        correctAnswer: "GET",
      },
      {
        domain: "Web Development",
        questionText: "Which JavaScript method fetches data from a server?",
        options: ["fetch()", "get()", "request()", "ajax()"],
        correctAnswer: "fetch()",
      },
      {
        domain: "Web Development",
        questionText: "What is the default port for HTTP?",
        options: ["80", "443", "8080", "3000"],
        correctAnswer: "80",
      },
      {
        domain: "Web Development",
        questionText: "Which tag embeds JavaScript in HTML?",
        options: ["<script>", "<js>", "<code>", "<javascript>"],
        correctAnswer: "<script>",
      },

      // Machine Learning Domain (10 Questions)
      {
        domain: "Machine Learning",
        questionText: "What is supervised learning?",
        options: [
          "Learning without labels",
          "Learning with labeled data",
          "Learning from clusters",
          "Learning from rules",
        ],
        correctAnswer: "Learning with labeled data",
      },
      {
        domain: "Machine Learning",
        questionText: "Which algorithm is used for classification?",
        options: [
          "Linear Regression",
          "Logistic Regression",
          "K-Means",
          "DBSCAN",
        ],
        correctAnswer: "Logistic Regression",
      },
      {
        domain: "Machine Learning",
        questionText: "What does overfitting mean?",
        options: [
          "Model fits noise",
          "Model is too simple",
          "Model generalizes well",
          "Model ignores data",
        ],
        correctAnswer: "Model fits noise",
      },
      {
        domain: "Machine Learning",
        questionText: "What is a feature in ML?",
        options: [
          "A model",
          "An input variable",
          "An output",
          "A loss function",
        ],
        correctAnswer: "An input variable",
      },
      {
        domain: "Machine Learning",
        questionText: "Which library is popular for ML in Python?",
        options: ["Pandas", "NumPy", "Scikit-learn", "Matplotlib"],
        correctAnswer: "Scikit-learn",
      },
      {
        domain: "Machine Learning",
        questionText: "What is the purpose of a validation set?",
        options: [
          "Train the model",
          "Test the model",
          "Tune hyperparameters",
          "Clean data",
        ],
        correctAnswer: "Tune hyperparameters",
      },
      {
        domain: "Machine Learning",
        questionText: "What does 'epoch' mean in neural networks?",
        options: [
          "One pass through data",
          "One neuron",
          "One layer",
          "One prediction",
        ],
        correctAnswer: "One pass through data",
      },
      {
        domain: "Machine Learning",
        questionText: "Which is an unsupervised learning method?",
        options: ["Linear Regression", "Decision Trees", "K-Means", "SVM"],
        correctAnswer: "K-Means",
      },
      {
        domain: "Machine Learning",
        questionText: "What is gradient descent used for?",
        options: ["Data cleaning", "Optimization", "Clustering", "Prediction"],
        correctAnswer: "Optimization",
      },
      {
        domain: "Machine Learning",
        questionText: "What does 'bias' mean in ML?",
        options: [
          "Error from simplicity",
          "Error from complexity",
          "Random error",
          "Prediction error",
        ],
        correctAnswer: "Error from simplicity",
      },

      // Soft Skills Domain (10 Questions)
      {
        domain: "Soft Skills",
        questionText: "What is a key component of active listening?",
        options: ["Interrupting", "Eye contact", "Multitasking", "Ignoring"],
        correctAnswer: "Eye contact",
      },
      {
        domain: "Soft Skills",
        questionText: "How should you handle conflict in a team?",
        options: [
          "Avoid it",
          "Blame others",
          "Discuss calmly",
          "Escalate immediately",
        ],
        correctAnswer: "Discuss calmly",
      },
      {
        domain: "Soft Skills",
        questionText: "What is emotional intelligence?",
        options: [
          "Technical skill",
          "Managing emotions",
          "Programming ability",
          "Physical strength",
        ],
        correctAnswer: "Managing emotions",
      },
      {
        domain: "Soft Skills",
        questionText: "What does effective communication require?",
        options: ["Clarity", "Speed", "Silence", "Ambiguity"],
        correctAnswer: "Clarity",
      },
      {
        domain: "Soft Skills",
        questionText: "What is a sign of good teamwork?",
        options: ["Competition", "Collaboration", "Isolation", "Criticism"],
        correctAnswer: "Collaboration",
      },
      {
        domain: "Soft Skills",
        questionText: "How should you give feedback?",
        options: ["Vaguely", "Constructively", "Rudely", "Silently"],
        correctAnswer: "Constructively",
      },
      {
        domain: "Soft Skills",
        questionText: "What is time management?",
        options: [
          "Procrastination",
          "Prioritizing tasks",
          "Ignoring deadlines",
          "Multitasking",
        ],
        correctAnswer: "Prioritizing tasks",
      },
      {
        domain: "Soft Skills",
        questionText: "What does adaptability mean?",
        options: [
          "Resistance to change",
          "Flexibility",
          "Rigidity",
          "Consistency",
        ],
        correctAnswer: "Flexibility",
      },
      {
        domain: "Soft Skills",
        questionText: "What is a leadership quality?",
        options: ["Micromanagement", "Empathy", "Arrogance", "Indecision"],
        correctAnswer: "Empathy",
      },
      {
        domain: "Soft Skills",
        questionText: "What helps in building trust?",
        options: ["Dishonesty", "Transparency", "Secrecy", "Competition"],
        correctAnswer: "Transparency",
      },

      // Cybersecurity Domain (10 Questions)
      {
        domain: "Cybersecurity",
        questionText: "What is phishing?",
        options: [
          "A type of malware",
          "Email scam",
          "Network attack",
          "Hardware theft",
        ],
        correctAnswer: "Email scam",
      },
      {
        domain: "Cybersecurity",
        questionText: "What does HTTPS stand for?",
        options: [
          "HyperText Transfer Protocol Secure",
          "HighTech Transfer Protocol",
          "HyperText Transport System",
          "None",
        ],
        correctAnswer: "HyperText Transfer Protocol Secure",
      },
      {
        domain: "Cybersecurity",
        questionText: "What is a firewall used for?",
        options: [
          "Data storage",
          "Network security",
          "Speed enhancement",
          "Software testing",
        ],
        correctAnswer: "Network security",
      },
      {
        domain: "Cybersecurity",
        questionText: "What is a common encryption standard?",
        options: ["AES", "HTML", "JPEG", "CSS"],
        correctAnswer: "AES",
      },
      {
        domain: "Cybersecurity",
        questionText: "What does VPN stand for?",
        options: [
          "Virtual Private Network",
          "Very Public Network",
          "Virtual Protocol Node",
          "None",
        ],
        correctAnswer: "Virtual Private Network",
      },
      {
        domain: "Cybersecurity",
        questionText: "What is a brute force attack?",
        options: [
          "Social engineering",
          "Password guessing",
          "Data deletion",
          "Network overload",
        ],
        correctAnswer: "Password guessing",
      },
      {
        domain: "Cybersecurity",
        questionText: "What protects against malware?",
        options: ["Antivirus", "Browser", "Firewall", "Router"],
        correctAnswer: "Antivirus",
      },
      {
        domain: "Cybersecurity",
        questionText: "What is two-factor authentication?",
        options: [
          "Single password",
          "Two passwords",
          "Password + second method",
          "Biometrics only",
        ],
        correctAnswer: "Password + second method",
      },
      {
        domain: "Cybersecurity",
        questionText: "What does DDoS stand for?",
        options: [
          "Distributed Denial of Service",
          "Direct Data Operations",
          "Dynamic Domain System",
          "None",
        ],
        correctAnswer: "Distributed Denial of Service",
      },
      {
        domain: "Cybersecurity",
        questionText: "What is a common cybersecurity threat?",
        options: ["Spam", "Phishing", "Pop-ups", "Ads"],
        correctAnswer: "Phishing",
      },

      // Project Management Domain (10 Questions)
      {
        domain: "Project Management",
        questionText: "What is the purpose of a Gantt chart?",
        options: [
          "Budget tracking",
          "Timeline visualization",
          "Risk analysis",
          "Team hierarchy",
        ],
        correctAnswer: "Timeline visualization",
      },
      {
        domain: "Project Management",
        questionText: "What does Agile emphasize?",
        options: [
          "Rigid planning",
          "Iterative development",
          "Waterfall steps",
          "Fixed scope",
        ],
        correctAnswer: "Iterative development",
      },
      {
        domain: "Project Management",
        questionText: "What is a project stakeholder?",
        options: [
          "Team member only",
          "Anyone affected by the project",
          "Client only",
          "Manager only",
        ],
        correctAnswer: "Anyone affected by the project",
      },
      {
        domain: "Project Management",
        questionText: "What does PMP stand for?",
        options: [
          "Project Management Professional",
          "Program Management Plan",
          "Project Master Plan",
          "None",
        ],
        correctAnswer: "Project Management Professional",
      },
      {
        domain: "Project Management",
        questionText: "What is risk management?",
        options: [
          "Ignoring risks",
          "Identifying and mitigating risks",
          "Budget allocation",
          "Team assignment",
        ],
        correctAnswer: "Identifying and mitigating risks",
      },
      {
        domain: "Project Management",
        questionText: "What is the critical path in a project?",
        options: [
          "Shortest path",
          "Longest path",
          "Easiest path",
          "Fastest path",
        ],
        correctAnswer: "Longest path",
      },
      {
        domain: "Project Management",
        questionText: "What does Scrum use for planning?",
        options: ["Sprints", "Phases", "Milestones", "Tasks"],
        correctAnswer: "Sprints",
      },
      {
        domain: "Project Management",
        questionText: "What is a project deliverable?",
        options: ["A meeting", "A tangible outcome", "A budget", "A timeline"],
        correctAnswer: "A tangible outcome",
      },
      {
        domain: "Project Management",
        questionText: "What does 'scope creep' mean?",
        options: [
          "Scope reduction",
          "Uncontrolled scope expansion",
          "Scope planning",
          "Scope completion",
        ],
        correctAnswer: "Uncontrolled scope expansion",
      },
      {
        domain: "Project Management",
        questionText: "What is a key role of a project manager?",
        options: ["Coding", "Coordination", "Testing", "Marketing"],
        correctAnswer: "Coordination",
      },

      // Cloud Computing Domain (10 Questions)
      {
        domain: "Cloud Computing",
        questionText: "What is AWS?",
        options: [
          "A programming language",
          "A cloud service provider",
          "A database system",
          "A web framework",
        ],
        correctAnswer: "A cloud service provider",
      },
      {
        domain: "Cloud Computing",
        questionText: "What does IaaS stand for?",
        options: [
          "Infrastructure as a Service",
          "Internet as a Service",
          "Integration as a Service",
          "Information as a Service",
        ],
        correctAnswer: "Infrastructure as a Service",
      },
      {
        domain: "Cloud Computing",
        questionText: "Which is a benefit of cloud computing?",
        options: [
          "Higher costs",
          "Scalability",
          "Local storage",
          "Manual updates",
        ],
        correctAnswer: "Scalability",
      },
      {
        domain: "Cloud Computing",
        questionText: "What is a virtual machine?",
        options: [
          "Physical server",
          "Simulated computer",
          "Database",
          "Network protocol",
        ],
        correctAnswer: "Simulated computer",
      },
      {
        domain: "Cloud Computing",
        questionText: "What does SaaS provide?",
        options: [
          "Software over the internet",
          "Hardware rentals",
          "Network security",
          "Data storage",
        ],
        correctAnswer: "Software over the internet",
      },
      {
        domain: "Cloud Computing",
        questionText: "Which company offers Azure?",
        options: ["Google", "Amazon", "Microsoft", "IBM"],
        correctAnswer: "Microsoft",
      },
      {
        domain: "Cloud Computing",
        questionText: "What is a public cloud?",
        options: [
          "Private network",
          "Shared resources",
          "Local server",
          "Hybrid system",
        ],
        correctAnswer: "Shared resources",
      },
      {
        domain: "Cloud Computing",
        questionText: "What does PaaS stand for?",
        options: [
          "Platform as a Service",
          "Program as a Service",
          "Protocol as a Service",
          "Private as a Service",
        ],
        correctAnswer: "Platform as a Service",
      },
      {
        domain: "Cloud Computing",
        questionText: "What is cloud elasticity?",
        options: [
          "Fixed capacity",
          "Dynamic scaling",
          "Static storage",
          "Manual resizing",
        ],
        correctAnswer: "Dynamic scaling",
      },
      {
        domain: "Cloud Computing",
        questionText: "What is a hybrid cloud?",
        options: [
          "Public only",
          "Private only",
          "Public and private mix",
          "Local only",
        ],
        correctAnswer: "Public and private mix",
      },

      // DevOps Domain (10 Questions)
      {
        domain: "DevOps",
        questionText: "What does CI/CD stand for?",
        options: [
          "Continuous Integration/Continuous Deployment",
          "Code Inspection/Code Delivery",
          "Continuous Improvement/Code Design",
          "None",
        ],
        correctAnswer: "Continuous Integration/Continuous Deployment",
      },
      {
        domain: "DevOps",
        questionText: "What is Docker used for?",
        options: [
          "Database management",
          "Containerization",
          "Networking",
          "Testing",
        ],
        correctAnswer: "Containerization",
      },
      {
        domain: "DevOps",
        questionText: "What is the purpose of Jenkins?",
        options: [
          "Code editing",
          "Automation server",
          "Data storage",
          "Web hosting",
        ],
        correctAnswer: "Automation server",
      },
      {
        domain: "DevOps",
        questionText: "What does IaC stand for?",
        options: [
          "Infrastructure as Code",
          "Integration as Code",
          "Internet as Code",
          "Information as Code",
        ],
        correctAnswer: "Infrastructure as Code",
      },
      {
        domain: "DevOps",
        questionText: "What is a key DevOps principle?",
        options: [
          "Manual processes",
          "Collaboration",
          "Isolation",
          "Slow deployment",
        ],
        correctAnswer: "Collaboration",
      },
      {
        domain: "DevOps",
        questionText: "What is Kubernetes used for?",
        options: [
          "Container orchestration",
          "Code writing",
          "Database design",
          "Network security",
        ],
        correctAnswer: "Container orchestration",
      },
      {
        domain: "DevOps",
        questionText: "What does Git manage?",
        options: ["Databases", "Version control", "Servers", "Cloud storage"],
        correctAnswer: "Version control",
      },
      {
        domain: "DevOps",
        questionText: "What is a pipeline in DevOps?",
        options: [
          "Code editor",
          "Build process",
          "Network route",
          "Storage system",
        ],
        correctAnswer: "Build process",
      },
      {
        domain: "DevOps",
        questionText: "What is Ansible used for?",
        options: [
          "Web development",
          "Configuration management",
          "Data analysis",
          "Graphic design",
        ],
        correctAnswer: "Configuration management",
      },
      {
        domain: "DevOps",
        questionText: "What is the goal of monitoring in DevOps?",
        options: [
          "Slow deployment",
          "Track performance",
          "Code obfuscation",
          "Manual testing",
        ],
        correctAnswer: "Track performance",
      },

      // UI/UX Design Domain (10 Questions)
      {
        domain: "UI/UX Design",
        questionText: "What does UI stand for?",
        options: [
          "User Interface",
          "Unique Interaction",
          "User Integration",
          "Unified Interface",
        ],
        correctAnswer: "User Interface",
      },
      {
        domain: "UI/UX Design",
        questionText: "What does UX focus on?",
        options: [
          "Visual design",
          "User experience",
          "Code efficiency",
          "Hardware",
        ],
        correctAnswer: "User experience",
      },
      {
        domain: "UI/UX Design",
        questionText: "What is a wireframe?",
        options: [
          "Final design",
          "Blueprint of UI",
          "Code structure",
          "Database schema",
        ],
        correctAnswer: "Blueprint of UI",
      },
      {
        domain: "UI/UX Design",
        questionText: "What is a key principle of good design?",
        options: ["Complexity", "Consistency", "Randomness", "Overload"],
        correctAnswer: "Consistency",
      },
      {
        domain: "UI/UX Design",
        questionText: "What tool is popular for UI design?",
        options: ["Figma", "Excel", "Git", "Docker"],
        correctAnswer: "Figma",
      },
      {
        domain: "UI/UX Design",
        questionText: "What is usability testing?",
        options: [
          "Code review",
          "User feedback",
          "Performance testing",
          "Security audit",
        ],
        correctAnswer: "User feedback",
      },
      {
        domain: "UI/UX Design",
        questionText: "What does a persona represent?",
        options: ["Real user", "Fictional user", "Developer", "Client"],
        correctAnswer: "Fictional user",
      },
      {
        domain: "UI/UX Design",
        questionText: "What is the goal of color theory in design?",
        options: [
          "Random colors",
          "Aesthetic harmony",
          "Complexity",
          "Monochrome",
        ],
        correctAnswer: "Aesthetic harmony",
      },
      {
        domain: "UI/UX Design",
        questionText: "What is a prototype?",
        options: [
          "Final product",
          "Interactive model",
          "Code base",
          "Static image",
        ],
        correctAnswer: "Interactive model",
      },
      {
        domain: "UI/UX Design",
        questionText: "What does accessibility mean in design?",
        options: [
          "Exclusive design",
          "Inclusive design",
          "Complex design",
          "Fast design",
        ],
        correctAnswer: "Inclusive design",
      },

      // Database Management Domain (10 Questions)
      {
        domain: "Database Management",
        questionText: "What is a relational database?",
        options: ["Flat file", "Table-based", "Graph-based", "Key-value"],
        correctAnswer: "Table-based",
      },
      {
        domain: "Database Management",
        questionText: "What does SQL SELECT do?",
        options: ["Delete data", "Retrieve data", "Update data", "Insert data"],
        correctAnswer: "Retrieve data",
      },
      {
        domain: "Database Management",
        questionText: "What is a primary key?",
        options: ["Unique identifier", "Foreign key", "Index", "Duplicate"],
        correctAnswer: "Unique identifier",
      },
      {
        domain: "Database Management",
        questionText: "What does NoSQL mean?",
        options: ["No SQL", "Not only SQL", "New SQL", "None"],
        correctAnswer: "Not only SQL",
      },
      {
        domain: "Database Management",
        questionText: "What is normalization?",
        options: [
          "Adding data",
          "Reducing redundancy",
          "Increasing size",
          "Deleting data",
        ],
        correctAnswer: "Reducing redundancy",
      },
      {
        domain: "Database Management",
        questionText: "What is a foreign key?",
        options: [
          "Primary key",
          "Reference to another table",
          "Unique value",
          "Index",
        ],
        correctAnswer: "Reference to another table",
      },
      {
        domain: "Database Management",
        questionText: "What does ACID stand for?",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Access, Control, Integrity, Data",
          "Action, Commit, Index, Delete",
          "None",
        ],
        correctAnswer: "Atomicity, Consistency, Isolation, Durability",
      },
      {
        domain: "Database Management",
        questionText: "What is MongoDB?",
        options: ["Relational DB", "NoSQL DB", "File system", "Web server"],
        correctAnswer: "NoSQL DB",
      },
      {
        domain: "Database Management",
        questionText: "What is an index used for?",
        options: [
          "Data storage",
          "Query optimization",
          "Data deletion",
          "Security",
        ],
        correctAnswer: "Query optimization",
      },
      {
        domain: "Database Management",
        questionText: "What does JOIN do in SQL?",
        options: [
          "Split tables",
          "Combine tables",
          "Delete rows",
          "Update data",
        ],
        correctAnswer: "Combine tables",
      },

      // Blockchain Domain (10 Questions)
      {
        domain: "Blockchain",
        questionText: "What is a blockchain?",
        options: [
          "Central database",
          "Distributed ledger",
          "Web server",
          "Cloud storage",
        ],
        correctAnswer: "Distributed ledger",
      },
      {
        domain: "Blockchain",
        questionText: "What is Bitcoin?",
        options: [
          "Programming language",
          "Cryptocurrency",
          "Database",
          "Framework",
        ],
        correctAnswer: "Cryptocurrency",
      },
      {
        domain: "Blockchain",
        questionText: "What is a smart contract?",
        options: [
          "Legal document",
          "Self-executing code",
          "Network protocol",
          "User agreement",
        ],
        correctAnswer: "Self-executing code",
      },
      {
        domain: "Blockchain",
        questionText: "What does 'mining' mean in blockchain?",
        options: [
          "Data extraction",
          "Transaction validation",
          "Code writing",
          "Server setup",
        ],
        correctAnswer: "Transaction validation",
      },
      {
        domain: "Blockchain",
        questionText: "What is Ethereum known for?",
        options: [
          "Smart contracts",
          "Fast websites",
          "Data storage",
          "Encryption",
        ],
        correctAnswer: "Smart contracts",
      },
      {
        domain: "Blockchain",
        questionText: "What is a hash in blockchain?",
        options: [
          "Random number",
          "Unique digital fingerprint",
          "Database key",
          "User ID",
        ],
        correctAnswer: "Unique digital fingerprint",
      },
      {
        domain: "Blockchain",
        questionText: "What does 'decentralized' mean?",
        options: [
          "Single control",
          "No central authority",
          "Local storage",
          "Central server",
        ],
        correctAnswer: "No central authority",
      },
      {
        domain: "Blockchain",
        questionText: "What is a node in blockchain?",
        options: ["User", "Network participant", "Database", "Server"],
        correctAnswer: "Network participant",
      },
      {
        domain: "Blockchain",
        questionText: "What is proof of work?",
        options: [
          "Code review",
          "Consensus mechanism",
          "Data backup",
          "User login",
        ],
        correctAnswer: "Consensus mechanism",
      },
      {
        domain: "Blockchain",
        questionText: "What is a wallet in blockchain?",
        options: [
          "Physical wallet",
          "Digital key storage",
          "Database",
          "Cloud service",
        ],
        correctAnswer: "Digital key storage",
      },
    ];

    // Clear existing questions (optional, comment out to append)
    await Question.deleteMany({});

    // Insert new questions
    await Question.insertMany(questions);
    console.log("Questions seeded successfully");
    mongoose.connection.close();
  })
  .catch((err) => console.error("Error seeding database:", err));
