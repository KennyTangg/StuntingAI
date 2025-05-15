import { useState, useEffect } from 'react';

// Import the icon components
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

// Carousel Component
const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = 3;
  
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 'left' : 'right');
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const goToPrevSlide = () => {
    setDirection('right');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const goToNextSlide = () => {
    setDirection('left');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
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
        <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q80,180 160,100 T320,100 T480,100" stroke="#3b82f6" strokeWidth="4" fill="none"/>
          <path d="M0,150 Q80,80 160,150 T320,150 T480,150" stroke="#60a5fa" strokeWidth="4" fill="none"/>
          <circle cx="100" cy="100" r="5" fill="#3b82f6"/>
          <circle cx="200" cy="120" r="5" fill="#3b82f6"/>
          <circle cx="300" cy="90" r="5" fill="#3b82f6"/>
        </svg>
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
        <svg className="w-3/4 h-3/4" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="30" height="60" rx="2" fill="#4ade80" opacity="0.6"/>
          <rect x="50" y="40" width="30" height="40" rx="2" fill="#4ade80" opacity="0.7"/>
          <rect x="90" y="30" width="30" height="50" rx="2" fill="#4ade80" opacity="0.8"/>
          <rect x="130" y="10" width="30" height="70" rx="2" fill="#4ade80" opacity="0.9"/>
          <line x1="0" y1="90" x2="180" y2="90" stroke="#94a3b8" strokeWidth="1"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Progress Tracking",
      description: "Monitor growth improvements over time",
      icon: <ProgressTrackingIcon />,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      chart: (
        <svg className="w-full h-full" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,150 L100,100 L150,120 L200,80 L250,90 L300,60 L350,40" stroke="#a855f7" strokeWidth="3" fill="none"/>
          <circle cx="100" cy="100" r="4" fill="#a855f7"/>
          <circle cx="150" cy="120" r="4" fill="#a855f7"/>
          <circle cx="200" cy="80" r="4" fill="#a855f7"/>
          <circle cx="250" cy="90" r="4" fill="#a855f7"/>
          <circle cx="300" cy="60" r="4" fill="#a855f7"/>
          <circle cx="350" cy="40" r="4" fill="#a855f7"/>
        </svg>
      )
    }
  ];
  
  return (
    <div className="relative h-[400px] overflow-hidden rounded-xl shadow-xl">
      <div className="flex h-full w-full transition-transform duration-500 ease-in-out" 
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="min-w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="card p-6 rounded-xl w-full max-w-md">
              <div className="flex items-center mb-4">
                <div className={`h-16 w-16 rounded-full ${slide.bgColor} flex items-center justify-center mr-4`}>
                  {slide.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{slide.title}</h3>
                  <p className="text-slate-300">{slide.description}</p>
                </div>
              </div>
              <div className="bg-slate-700/50 h-40 rounded-lg overflow-hidden flex items-center justify-center">
                {slide.chart}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${currentSlide === index ? 'bg-white' : 'bg-white opacity-50 hover:opacity-75'}`}
          />
        ))}
      </div>
      
      {/* Carousel Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button 
          onClick={goToPrevSlide}
          className="p-1 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none"
        >
          <PrevIcon />
        </button>
        <button 
          onClick={goToNextSlide}
          className="p-1 rounded-full bg-black/30 text-white hover:bg-black/50 focus:outline-none"
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
};

export default Carousel;




