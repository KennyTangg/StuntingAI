import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon components
const PrevIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
  </svg>
);

const NextIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
  </svg>
);

// Feature Icons
const DataIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const AIIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const PlanIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

// Carousel Slide Icons
const EarlyDetectionIcon = () => (
  <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PersonalizedPlansIcon = () => (
  <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ProgressTrackingIcon = () => (
  <svg className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();

  // Carousel Component
  const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    useEffect(() => {
      const interval = setInterval(() => {
        goToNextSlide();
      }, 5000);

      return () => clearInterval(interval);
    }, []);

    const goToSlide = (index) => {
      setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const slides = [
      {
        id: 1,
        title: "Early Detection",
        description: "Identify growth issues before they become severe",
        icon: <EarlyDetectionIcon />,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        chart: (
          <img src="./early detection img.png" alt="Chart preview" className="w-full h-full object-cover" />
        )
      },
      {
        id: 2,
        title: "Personalized Plans",
        description: "Custom nutrition and care recommendations",
        icon: <PersonalizedPlansIcon />,
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
        chart: (
          <img src="./diet plan img.jpg" alt="Chart preview" className="w-full h-full object-cover" />
        )
      },
      {
        id: 3,
        title: "Growth Projection",
        description: "Growth projection over time",
        icon: <ProgressTrackingIcon />,
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        chart: (
          <img src="./growth projection img.jpg" alt="Chart preview" className="w-full h-full object-cover" />
        )
      }
    ];

    return (
      <div className="relative h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-xl shadow-xl">
        <div className="flex h-full w-full transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="card p-4 sm:p-6 rounded-xl w-full max-w-md">
                <div className="flex flex-col sm:flex-row items-center mb-4">
                  <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-full ${slide.bgColor} flex items-center justify-center mb-3 sm:mb-0 sm:mr-4`}>
                    {slide.icon}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold">{slide.title}</h3>
                    <p className="text-slate-300 text-sm sm:text-base">{slide.description}</p>
                  </div>
                </div>
                <div className="bg-slate-700/50 h-32 sm:h-40 rounded-lg overflow-hidden flex items-center justify-center">
                  {slide.chart}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${currentSlide === index ? 'bg-white' : 'bg-white opacity-50 hover:opacity-75'}`}
            />
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
          <button
            onClick={goToPrevSlide}
            className="p-1 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none"
            aria-label="Previous slide"
          >
            <PrevIcon />
          </button>
          <button
            onClick={goToNextSlide}
            className="p-1 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none"
            aria-label="Next slide"
          >
            <NextIcon />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#0a1122] py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Monitor and Prevent<br />
              <span className="text-blue-500">Child Stunting</span><br />
              with AI Technology
            </h1>
            <p className="text-slate-300 mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
              Our advanced AI platform helps healthcare providers identify,
              track, and prevent stunting in children through early detection
              and personalized intervention plans.
            </p>
            <button
              onClick={() => navigate('/get-started')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg w-full sm:w-auto"
            >
              Get Started
            </button>
          </div>

          <div className="w-full md:w-1/2 relative mt-6 md:mt-0">
            <Carousel />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How StuntingAI Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform combines advanced AI algorithms with healthcare expertise to provide
              comprehensive growth monitoring solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-[#111827]/70 rounded-xl p-5 sm:p-6 shadow-lg border border-slate-700/50 hover:border-blue-500/30 transition-all text-left">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <DataIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Data Collection</h3>
              <p className="text-slate-300 mb-4 text-sm sm:text-base">
                Easily input growth measurements and health data through our intuitive interface.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm sm:text-base">Height and weight analysis</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm sm:text-base">Preliminary evaluation</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#111827]/70 rounded-xl p-5 sm:p-6 shadow-lg border border-slate-700/50 hover:border-blue-500/30 transition-all text-left">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <AIIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-slate-300 mb-4 text-sm sm:text-base">
                Our advanced algorithms analyze growth patterns to identify potential stunting risks and development concerns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm sm:text-base">Pattern recognition</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm sm:text-base">Growth trajectory prediction</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#111827]/70 rounded-xl p-5 sm:p-6 shadow-lg border border-slate-700/50 hover:border-blue-500/30 transition-all text-left sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <PlanIcon />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Intervention Plans</h3>
              <p className="text-slate-300 mb-4 text-sm sm:text-base">
                Receive customized recommendations and intervention strategies based on individual needs and risk factors.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm sm:text-base">Nutrition guidance</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 text-sm sm:text-base">Healthcare recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-900 py-10 sm:py-12 md:py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Make a Difference?</h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-6 sm:mb-8">
            Join healthcare providers worldwide who are using StuntingAI to improve child health
            outcomes and prevent stunting.
          </p>
          <button
            onClick={() => navigate('/get-started')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg w-full sm:w-auto"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </>
  );
}

