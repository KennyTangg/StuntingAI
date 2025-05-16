import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataIcon, AIIcon, PlanIcon } from '../components/icons/FeatureIcons';

// Additional icons for the new design
const SecurityIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IntegrationIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const SupportIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MobileIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ReportIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CloudIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

export default function Features() {
  const [activeTab, setActiveTab] = useState('all');

  const mainFeatures = [
    {
      icon: <DataIcon />,
      title: "Data Collection",
      description: "Easily input growth measurements and health data through our intuitive interface.",
      items: ["Height and weight tracking", "Preliminary evaluation", "Medical history integration", "User-friendly forms"],
      category: "core",
      color: "blue"
    },
    {
      icon: <AIIcon />,
      title: "AI Analysis",
      description: "Our advanced algorithms analyze growth patterns to identify potential stunting risks and development concerns.",
      items: ["Pattern recognition", "Risk assessment", "Growth trajectory prediction", "Comparative analysis"],
      category: "core",
      color: "blue"
    },
    {
      icon: <PlanIcon />,
      title: "Intervention Plans",
      description: "Receive customized recommendations and intervention strategies based on individual needs and risk factors.",
      items: ["Nutrition guidance", "Healthcare recommendations", "Progress monitoring tools", "Adjustable intervention paths"],
      category: "core",
      color: "blue"
    }
  ];

  const additionalFeatures = [
    {
      icon: <SecurityIcon />,
      title: "Data Security",
      description: "Enterprise-grade security to protect sensitive patient information.",
      items: ["HIPAA compliant storage", "End-to-end encryption", "Role-based access controls", "Regular security audits"],
      category: "security",
      color: "red"
    },
    {
      icon: <IntegrationIcon />,
      title: "EHR Integration",
      description: "Seamlessly integrate with existing electronic health record systems.",
      items: ["API connectivity", "Data synchronization", "Automated imports", "Custom field mapping"],
      category: "technical",
      color: "amber"
    },
    {
      icon: <SupportIcon />,
      title: "Expert Support",
      description: "Access to our team of healthcare and technical experts for guidance and assistance.",
      items: ["24/7 technical support", "Clinical consultation", "Implementation assistance", "Training resources"],
      category: "support",
      color: "teal"
    },
    {
      icon: <MobileIcon />,
      title: "Mobile Access",
      description: "Access the platform from anywhere with our mobile-responsive design.",
      items: ["Cross-device compatibility", "Offline capabilities", "Synchronized data", "Touch-optimized interface"],
      category: "technical",
      color: "indigo"
    },
    {
      icon: <ReportIcon />,
      title: "Advanced Reporting",
      description: "Generate comprehensive reports and visualizations for better insights.",
      items: ["Customizable dashboards", "Export capabilities", "Trend analysis", "Comparative reporting"],
      category: "core",
      color: "cyan"
    },
    {
      icon: <CloudIcon />,
      title: "Cloud-Based Platform",
      description: "No installation required with our secure cloud-based solution.",
      items: ["Automatic updates", "Scalable infrastructure", "Data backups", "Multi-user access"],
      category: "technical",
      color: "sky"
    }
  ];

  // Combine all features
  const allFeatures = [...mainFeatures, ...additionalFeatures];

  // Filter features based on active tab
  const filteredFeatures = activeTab === 'all'
    ? allFeatures
    : allFeatures.filter(feature => feature.category === activeTab);

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
          <h1 className="text-5xl font-bold text-white mt-6 mb-4">Powerful Features</h1>
          <p className=" text-xl text-blue-100 text-center w-full">
            StuntingAI provides comprehensive tools for healthcare professionals to monitor,
            analyze, and address childhood growth concerns with precision and care.
          </p>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Core Features</h2>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Our platform combines advanced AI technology with user-friendly interfaces to provide
            a complete solution for monitoring and addressing childhood growth issues.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-8 shadow-xl border border-slate-700/50 hover:border-blue-500/30 transition-all group"
            >
              <div className={`w-16 h-16 bg-${feature.color}-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${feature.color}-500/30 transition-all`}>
                <div className={`w-12 h-12 bg-${feature.color}-500 rounded-xl flex items-center justify-center`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-300 mb-6">{feature.description}</p>

              <ul className="space-y-3">
                {feature.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className={`w-5 h-5 text-${feature.color}-500 mr-2 mt-1 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      

      {/* Additional Features Section with Tabs */}
      <div className="bg-slate-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Additional Features</h2>
            <p className="text-slate-300 max-w-3xl mx-auto mb-8">
              Explore all the features that make StuntingAI the leading platform for childhood growth monitoring.
            </p>

            {/* Feature Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                All Features
              </button>
              <button
                onClick={() => setActiveTab('core')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'core' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Core Features
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'technical' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Technical
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'support' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Support
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all shadow-lg"
              >
                <div className="bg-slate-900/80 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 mb-4">{feature.description}</p>

                <ul className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}