import { Link } from 'react-router-dom';

// Icons for features section
const DataIcon = () => (
  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const PlanIcon = () => (
  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const TrackIcon = () => (
  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function About() {
  // Team members data
  const teamMembers = [
    {
      name: "Kenny Tang",
      role: "Full stack and lead developer",
      image: "https://avatars.githubusercontent.com/u/176812628?v=4",
      bio: "Technology enthusiast"
    },
    {
      name: "William Rusmana",
      role: "Front end developer",
      image: "https://avatars.githubusercontent.com/u/93782439?v=4",
      bio: "Aspiring computer science student"
    },
    {
      name: "Michael",
      role: "Designer",
      image: "https://avatars.githubusercontent.com/u/181051398?v=4",
      bio: "Passionate about design and user experience."
    },
    {
      name: "Tiffany",
      role: "Back end developer",
      image: "https://avatars.githubusercontent.com/u/61628016?v=4",
      bio: "Loves coding and solving complex problems."
    }
  ];

  // Features data
  const features = [
    {
      icon: <DataIcon />,
      title: "Data Collection",
      description: "Collect and analyze growth data with intuitive tools designed for healthcare professionals."
    },
    {
      icon: <AnalyticsIcon />,
      title: "AI Analytics",
      description: "Identify potential growth issues early with our advanced AI-powered analytics system."
    },
    {
      icon: <PlanIcon />,
      title: "Intervention Plans",
      description: "Develop personalized intervention plans based on evidence-based practices and individual needs."
    },
    {
      icon: <TrackIcon />,
      title: "Progress Tracking",
      description: "Track progress over time and adjust interventions for optimal health outcomes."
    }
  ];

  // Timeline data
  const timeline = [
    {
      year: "2020",
      title: "Research Begins",
      description: "Initial research on AI applications for child growth monitoring."
    },
    {
      year: "2021",
      title: "Prototype Development",
      description: "First prototype of StuntingAI platform developed and tested."
    },
    {
      year: "2022",
      title: "Pilot Program",
      description: "Successful pilot program with 5 healthcare facilities."
    },
    {
      year: "2023",
      title: "Official Launch",
      description: "StuntingAI platform officially launched for healthcare providers."
    }
  ];

  return (
    <div className="bg-[#0a1122] min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-[#0a1122] overflow-hidden">
        <div className="absolute inset-0">
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path
              fill="none"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="2"
              d="M0,100 C150,200 350,0 500,100 C650,200 700,0 900,100 C1050,200 1350,0 1440,100 V0 H0 Z"
            />
            <path
              fill="none"
              stroke="rgba(59, 130, 246, 0.15)"
              strokeWidth="2"
              d="M0,200 C150,100 350,300 500,200 C650,100 700,300 900,200 C1050,100 1350,300 1440,200"
            />
          </svg>
        </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-14 w-full">
          <div className="w-full text-left">
            <Link to="/" className="text-blue-400 hover:text-blue-300 mb-8 inline-flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
            <h1 className="text-5xl font-bold text-white mt-6 mb-4">About StuntingAI</h1>
            <p className="text-xl text-blue-100 w-full text-center">
              A gemini powered platform designed to help anyone anywhere in the world to
               diagnose stunting in children and provide personalized diet plans to cure stunting during the early childhood stages.
            </p>
          </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/30 rounded-2xl p-8 md:p-12 shadow-xl border border-blue-900/20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-slate-300 text-lg">
                Our mission is to leverage artificial intelligence and data analytics to cure and alliviate
                stunting in children worldwide, especially in our home country where apporximately 1 in 5 children are stunted.
              </p>
              <p className="text-slate-300 text-lg mt-4">
                We believe that early detection and intervention are key to preventing stunting and
                ensuring healthy development for all children worldwide.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-blue-600 rounded-full opacity-30"></div>
                <div className="absolute inset-8 bg-blue-700 rounded-full opacity-40"></div>
                <div className="absolute inset-12 bg-blue-800 rounded-full opacity-50 flex items-center justify-center">
                  <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-blue-500/30 transition-all"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-slate-300">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}