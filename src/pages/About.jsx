import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link to="/" className="text-blue-500 hover:text-blue-400 mb-8 inline-block">← Go to home</Link>
      <h1 className="text-4xl font-bold mb-8">About StuntingAI</h1>

      <div className="prose prose-lg prose-invert max-w-none">
        <p>
          StuntingAI is a cutting-edge platform designed to help healthcare professionals identify, 
          monitor, and address childhood growth issues, with a particular focus on stunting prevention.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p>
          Our mission is to leverage artificial intelligence and data analytics to improve childhood 
          health outcomes globally, making advanced growth monitoring tools accessible to healthcare 
          providers everywhere.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Features</h2>
        <p>
          Explore our platform to see how StuntingAI helps healthcare professionals:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Collect and analyze growth data with intuitive tools
          </li>
          <li>
            Identify potential growth issues early with AI-powered analytics
          </li>
          <li>
            Develop personalized intervention plans based on evidence-based practices
          </li>
          <li>
            Track progress and adjust interventions for optimal outcomes
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
        <p>
          StuntingAI was developed by a multidisciplinary team of healthcare professionals, 
          data scientists, and software engineers committed to improving child health outcomes 
          through technology.
        </p>
      </div>
    </div>
  );
}