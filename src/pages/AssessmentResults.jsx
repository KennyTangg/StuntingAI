import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isStunted, setIsStunted] = useState(true);
  const [childData, setChildData] = useState({
    name: "Sarah Johnson",
    age: "3 years, 2 months",
    gender: "Female",
    assessmentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    height: "85 cm",
    weight: "12.5 kg",
    bmi: "17.3",
    percentile: "15th"
  });

  useEffect(() => {
    // Update with data passed from GetStarted if available
    if (location.state && location.state.childInfo) {
      const { ageYears, ageMonths, gender, height, weight } = location.state.childInfo;

      // Calculate BMI: weight(kg) / (height(m))²
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

      setChildData({
        ...childData,
        name: "Child",
        age: `${ageYears} years, ${ageMonths} months`,
        gender: gender === 'M' ? 'Male' : 'Female',
        height: `${height} cm`,
        weight: `${weight} kg`,
        bmi: bmi
      });
    }

    // Set current date for the report
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setChildData(prev => ({
      ...prev,
      assessmentDate: today.toLocaleDateString('en-US', options)
    }));
  }, [location.state]);

  const toggleStatus = () => {
    setIsStunted(!isStunted);
  };

  return (
    <div className="bg-[#0a1122] text-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Main Content */}
        <main>
          {/* Child Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 fade-in card">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Child Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="font-medium">{childData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Age:</p>
                    <p className="font-medium">{childData.age}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gender:</p>
                    <p className="font-medium">{childData.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assessment Date:</p>
                    <p className="font-medium">{childData.assessmentDate}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Result Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 fade-in-delay-1 card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Growth Assessment Result</h2>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Result Status */}
              <div className="flex-1">
                <div
                  onClick={toggleStatus}
                  className={`${isStunted
                    ? "bg-yellow-50 border-l-4 border-yellow-400"
                    : "bg-green-50 border-l-4 border-green-500"}
                    p-4 rounded-r-lg cursor-pointer hover:bg-yellow-100 transition-colors`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isStunted ? "text-yellow-400" : "text-green-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className={`text-lg font-medium ${isStunted ? "text-yellow-800" : "text-green-800"}`}>
                        {isStunted ? "Mild Stunting Detected" : "Normal Growth Detected"}
                      </h3>
                      <p className={isStunted ? "text-yellow-700" : "text-green-700"}>
                        {isStunted
                          ? "Your child's height-for-age is below the recommended range for their age group."
                          : "Your child's height-for-age is within the normal range for their age group."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">Growth Percentile</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`progress-bar ${isStunted ? "bg-yellow-400" : "bg-green-500"}`}
                      style={{ width: isStunted ? "15%" : "65%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-gray-600">
                    <span>0%</span>
                    <span>{isStunted ? "15th Percentile" : "65th Percentile"}</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="flex-1">
                <h4 className="font-medium text-gray-700 mb-3">Measurements</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Height</span>
                      <span className="font-medium">{childData.height}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="progress-bar bg-blue-500" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-medium">{childData.weight}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="progress-bar bg-green-500" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">BMI</span>
                      <span className="font-medium">{childData.bmi}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="progress-bar bg-purple-500" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Meal Schedule and Key Foods */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 fade-in-delay-2 card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Nutrition Plan</h2>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Daily Meal Schedule */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Daily Meal Schedule
                </h3>

                <div className="space-y-4">
                  {/* Breakfast */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">7:30 AM</span>
                      <h4 className="font-medium text-blue-800">Breakfast</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Whole grain cereal with milk, scrambled egg with spinach, and sliced banana</p>
                  </div>

                  {/* Morning Snack */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">10:00 AM</span>
                      <h4 className="font-medium text-green-800">Morning Snack</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Apple slices with almond butter and a small yogurt</p>
                  </div>

                  {/* Lunch */}
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">12:30 PM</span>
                      <h4 className="font-medium text-amber-800">Lunch</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Grilled chicken strips, brown rice, steamed broccoli, and sliced avocado</p>
                  </div>

                  {/* Afternoon Snack */}
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">3:30 PM</span>
                      <h4 className="font-medium text-purple-800">Afternoon Snack</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Cheese cubes with whole grain crackers and cherry tomatoes</p>
                  </div>

                  {/* Dinner */}
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">6:00 PM</span>
                      <h4 className="font-medium text-indigo-800">Dinner</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Baked salmon, quinoa, roasted sweet potatoes, and green beans</p>
                  </div>

                  {/* Evening Snack */}
                  <div className="bg-teal-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">7:30 PM</span>
                      <h4 className="font-medium text-teal-800">Evening Snack</h4>
                    </div>
                    <p className="text-gray-700 text-sm">Warm milk with honey and a small banana</p>
                  </div>
                </div>
              </div>

              {/* Key Foods */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Key Foods to Include
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {/* Protein Sources */}
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Protein Sources</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Chicken</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Fish</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Eggs</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Greek Yogurt</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Lentils</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Tofu</span>
                    </div>
                  </div>

                  {/* Calcium-Rich Foods */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Calcium-Rich Foods</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Milk</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Cheese</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Yogurt</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Fortified Plant Milk</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Broccoli</span>
                    </div>
                  </div>

                  {/* Iron-Rich Foods */}
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Iron-Rich Foods</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Lean Beef</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Beans</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Spinach</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Fortified Cereals</span>
                      <span className="bg-white px-2 py-1 rounded-md text-sm text-gray-700 shadow-sm">Dried Fruits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 fade-in-delay-3 card">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="mb-4">We recommend scheduling a follow-up appointment with your pediatrician to discuss these results and create a comprehensive growth plan.</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Schedule Follow-up
                </button>
              </div>
              <div className="flex-1">
                <p className="mb-4">Track your child's progress with our mobile app to monitor growth improvements and dietary adherence.</p>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Download Growth Tracker App
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-white text-sm fade-in-delay-3 bg-blue-800 p-4 rounded-xl">
          <p>This report was generated by GrowthGuard AI on {childData.assessmentDate}</p>
          <p className="mt-1">The information provided is for guidance only and should be reviewed by a healthcare professional.</p>
        </footer>
      </div>
    </div>
  );
}
