import Feature from '../components/Feature';
import { DataIcon, AIIcon, PlanIcon } from '../components/icons/FeatureIcons';

export default function Features() {
  const features = [
    {
      icon: <DataIcon />,
      title: "Data Collection",
      description: "Easily input growth measurements and health data through our intuitive interface.",
      items: ["Height and weight tracking", "Preliminary evaluation", "Medical history integration", "User-friendly forms"]
    },
    {
      icon: <AIIcon />,
      title: "AI Analysis",
      description: "Our advanced algorithms analyze growth patterns to identify potential stunting risks and development concerns.",
      items: ["Pattern recognition", "Risk assessment", "Growth trajectory prediction", "Comparative analysis"]
    },
    {
      icon: <PlanIcon />,
      title: "Intervention Plans",
      description: "Receive customized recommendations and intervention strategies based on individual needs and risk factors.",
      items: ["Nutrition guidance", "Healthcare recommendations", "Progress monitoring tools", "Adjustable intervention paths"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Features</h1>
      
      <p className="text-xl text-center text-slate-300 max-w-3xl mx-auto mb-12">
        StuntingAI provides comprehensive tools for healthcare professionals to monitor, 
        analyze, and address childhood growth concerns with precision and care.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Feature key={index} {...feature} />
        ))}
      </div>
      
      <div className="bg-slate-800 rounded-xl p-8 mt-12">
        <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
        <p className="text-slate-300 mb-6">
          Our platform is built with cutting-edge technology to ensure accuracy, 
          security, and ease of use for healthcare professionals.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Data Security</h3>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>HIPAA compliant data storage</li>
              <li>End-to-end encryption</li>
              <li>Role-based access controls</li>
              <li>Regular security audits</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">AI Capabilities</h3>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Machine learning algorithms</li>
              <li>Neural network analysis</li>
              <li>Continuous model improvement</li>
              <li>Explainable AI results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}