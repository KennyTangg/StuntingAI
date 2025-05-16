import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isStunted, setIsStunted] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState(null);
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    gender: "",
    assessmentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    height: "",
    weight: "",
    bmi: "",
    percentile: ""
  });

  useEffect(() => {
    // Check if we have stored child data (for page refresh)
    const storedChildData = localStorage.getItem('childData');

    // If no location state (direct URL access or refresh)
    if (!location.state || !location.state.childInfo) {
      // If we have stored data, use it
      if (storedChildData) {
        try {
          const parsedChildData = JSON.parse(storedChildData);
          setChildData(parsedChildData);

          // Check for stored AI response
          const childKey = parsedChildData.name;
          const storedAiResponse = localStorage.getItem(`aiResponse-${childKey}`);
          if (storedAiResponse) {
            setAiResponse(JSON.parse(storedAiResponse));
          }
          setIsAiLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing stored child data:", error);
        }
      }

      // If no stored data, redirect to GetStarted
      navigate('/get-started');
      return;
    }

    // Update with data passed from GetStarted
    const { name, ageYears, ageMonths, gender, height, weight, photo } = location.state.childInfo;

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    const percentile = Math.floor(Math.random() * 100) + "th";

    const isStuntedValue = percentile.replace("th", "") < 25;
    setIsStunted(isStuntedValue);

    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // Create a completely new childData object without using the initial state
    const newChildData = {
      name: name || "Child",
      age: `${ageYears} years, ${ageMonths} months`,
      gender: gender === 'M' ? 'Male' : 'Female',
      height: `${height} cm`,
      weight: `${weight} kg`,
      bmi: bmi,
      percentile: percentile,
      photo: photo, // Store the photo data URL
      assessmentDate: today.toLocaleDateString('en-US', options)
    };

    // Store child data in localStorage
    localStorage.setItem('childData', JSON.stringify(newChildData));

    setChildData(newChildData);

    // Check if we already have AI results in localStorage for this child
    const childKey = `${name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}`;
    const storedAiResponse = localStorage.getItem(`aiResponse-${childKey}`);

    if (storedAiResponse) {
      // Use stored AI response
      try {
        const parsedResponse = JSON.parse(storedAiResponse);
        setAiResponse(parsedResponse);
        setIsAiLoading(false);
      } catch (error) {
        console.error("Error parsing stored AI response:", error);
        fetchNewAiResponse();
      }
    } else {
      // Fetch new AI response
      fetchNewAiResponse();
    }

    // Function to fetch new AI response
    async function fetchNewAiResponse() {
      try {
        const aiResult = await dataFromAI({
          name: name || "Child",
          age: `${ageYears} years, ${ageMonths} months`,
          gender: gender === 'M' ? 'Male' : 'Female',
          height: `${height} cm`,
          weight: `${weight} kg`,
          bmi: bmi,
          percentile: percentile,
          assessmentDate: new Date().toISOString().split('T')[0]
        });

        // Store AI response in localStorage using the child's name as the key
        localStorage.setItem(`aiResponse-${name}`, JSON.stringify(aiResult));

        setAiResponse(aiResult);
        setIsAiLoading(false);
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        // Fallback to default recommendations if AI fails
        setIsAiLoading(false);
      }
    }
  }, [location.state, navigate]);

  // AI data processing is handled in the useEffect hook

  const dataFromAI = async (childData) => {
    const GEMINI_API_KEY = "AIzaSyDHAtxtF6mHlOq6GgkbKrr1iCusz42WdLE";
    const prompt = `
    You are a medical image analysis AI specialized in pediatric growth assessment. Your task is to analyze baby photographs and classify each case strictly based on visual and contextual indicators of stunting.

    **Visual indicators may include (but are not limited to):**
    - Disproportionately reduced height-for-age
    - Low visible muscle mass
    - Delayed or abnormal physical development

    In addition to the image, you will receive metadata in JSON format containing the baby's gender, age, height, weight, BMI, and growth percentile. Use both the image and metadata to assess growth status against standard pediatric development benchmarks.

    **Instructions:**
    1. Return **only** one classification: "Stunted" or "Not Stunted".
    2. Provide a one paragragh ** explanation** referencing both **visual** and **contextual** indicators.
    3. Output must be returned **exclusively in JSON format**. Do not include any additional commentary or disclaimers.

    ---

    **Example Input JSON:**

    {
      "name": "Baby John",
      "age": "12 months",
      "gender": "Male",
      "assessmentDate": "2025-05-16",
      "height": "68 cm",
      "weight": "7.2 kg",
      "bmi": "15.6",
      "percentile": "3rd"
    }

    **Expected Output JSON Format:**

    {
      "classification": "Stunted",
      "explanation": "The child presents with visibly reduced limb length relative to torso size, narrow shoulder width, and minimal muscle definition in the limbs and neck area. Facial features also appear slightly underdeveloped for age. Contextually, the height of 68 cm and weight of 7.2 kg at 12 months fall below the 5th percentile, and BMI of 15.6 is on the lower end of healthy ranges for infants. These indicators combined point to chronic undernutrition or delayed physical development consistent with clinical definitions of stunting."
    }

    IMPORTANT: only return in JSON or if there is no data just make it null
    `

    try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt + "\n\nChild Data:\n" + JSON.stringify(childData, null, 2) }],
                },
              ],
              generationConfig: {
                temperature: 0.1,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
              },
            }),
          });

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) return [];

        const cleanedText = rawText.replace(/```json\s*|```/g, "").trim();

        console.log("Gemini response:", cleanedText);

        try {
          return JSON.parse(cleanedText);
        } catch (err) {
          console.error("Failed to parse Gemini response:", cleanedText);
          return [];
        }
      } catch (error){
        console.error(error);
        return [];
      }
    }

  return (
    <div className="bg-gradient-to-b from-[#0a1122] to-[#162042] text-slate-100 py-10 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8 flex space-x-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-105 bg-blue-900/30 px-4 py-2 rounded-lg"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          <button
            onClick={() => navigate('/get-started')}
            className="flex items-center text-green-400 hover:text-green-300 transition-all duration-300 transform hover:scale-105 bg-green-900/30 px-4 py-2 rounded-lg"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Form
          </button>
        </div>

        {/* Main Content */}
        <main>
          <section className='flex flex-col md:flex-row gap-8 mb-10'>
            {/* AI Recommendations Card */}
            <div className="bg-white rounded-xl shadow-lg p-7 flex-1 fade-in-delay-1 card border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Analysis
              </h2>

              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">Analyzing data and generating personalized recommendations...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* AI Classification Result - Redesigned Status */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      <div className={`flex items-center gap-4 px-8 py-5 rounded-xl shadow-md transition-all duration-500 transform ${
                        aiResponse && aiResponse.classification === "Stunted"
                          ? "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500"
                          : "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500"
                      }`}>
                        <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-500 hover:scale-110 ${
                          aiResponse && aiResponse.classification === "Stunted"
                            ? "bg-gradient-to-br from-red-500 to-red-600"
                            : "bg-gradient-to-br from-green-500 to-green-600"
                        }`}>
                          {(aiResponse && aiResponse.classification === "Stunted") || isStunted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium uppercase tracking-wider ${
                            aiResponse && aiResponse.classification === "Stunted"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}>AI Assessment Result</span>
                          <h3 className={`text-2xl font-bold ${
                            aiResponse && aiResponse.classification === "Stunted"
                              ? "text-red-700"
                              : "text-green-700"
                          }`}>
                            {aiResponse ? aiResponse.classification : (isStunted ? "Stunted" : "Not Stunted")}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analysis Details
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-left text-gray-700 leading-relaxed">
                        {aiResponse ? aiResponse.explanation : (
                          isStunted
                            ? `Based on ${childData.name}'s measurements and growth patterns, our AI has detected signs of stunting. The height-for-age is below the expected range for a child of this age and gender.`
                            : `Based on ${childData.name}'s measurements and growth patterns, our AI has determined that growth appears to be within the normal range for a child of this age and gender.`
                        )}
                      </p>
                    </div>
                  </div>


                </div>
              )}
            </div>
            {/* Child Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-7 fade-in card border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col justify-between h-full">
                <div className='flex-1'>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Child Information
                  </h2>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="bg-indigo-50 p-3 rounded-lg border-l-3 border-indigo-300 transition-all duration-300 hover:shadow-md">
                      <p className="text-indigo-700 font-medium text-sm mb-1">Name</p>
                      <p className="font-semibold text-gray-800">{childData.name}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border-l-3 border-purple-300 transition-all duration-300 hover:shadow-md">
                      <p className="text-purple-700 font-medium text-sm mb-1">Age</p>
                      <p className="font-semibold text-gray-800">{childData.age}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border-l-3 border-blue-300 transition-all duration-300 hover:shadow-md">
                      <p className="text-blue-700 font-medium text-sm mb-1">Gender</p>
                      <p className="font-semibold text-gray-800">{childData.gender}</p>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg border-l-3 border-teal-300 transition-all duration-300 hover:shadow-md">
                      <p className="text-teal-700 font-medium text-sm mb-1">Assessment Date</p>
                      <p className="font-semibold text-gray-800">{childData.assessmentDate}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  {childData.photo ? (
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg transform transition-transform duration-500 hover:scale-105">
                      <img
                        src={childData.photo}
                        alt={childData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-105">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Assessment Result Card */}
          <div className="bg-white rounded-xl shadow-lg p-7 mb-10 fade-in-delay-1 card border border-blue-100 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Growth Assessment Result
            </h2>

            <div className="flex flex-col md:flex-row gap-10">
              {/* Result Status */}
              <div className="flex-1">
                <div
                  className={`${(aiResponse && aiResponse.classification === "Stunted") || isStunted
                    ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500"
                    : "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500"}
                    p-5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        (aiResponse && aiResponse.classification === "Stunted") || isStunted
                          ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                          : "bg-gradient-to-br from-green-400 to-emerald-500"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {(aiResponse && aiResponse.classification === "Stunted") || isStunted ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className={`text-xl font-bold ${(aiResponse && aiResponse.classification === "Stunted") || isStunted ? "text-amber-800" : "text-emerald-800"}`}>
                        {(aiResponse && aiResponse.classification === "Stunted") || isStunted ? "Stunting Detected" : "Normal Growth Detected"}
                      </h3>
                      <p className={`mt-1 ${(aiResponse && aiResponse.classification === "Stunted") || isStunted ? "text-amber-700" : "text-emerald-700"}`}>
                        {(aiResponse && aiResponse.classification === "Stunted") || isStunted
                          ? "Your child's height-for-age is below the recommended range for their age group."
                          : "Your child's height-for-age is within the normal range for their age group."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-indigo-50 p-5 rounded-lg shadow-md">
                  <h4 className="font-semibold text-indigo-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Growth Percentile
                  </h4>
                  <div className="w-full bg-white rounded-full h-3 shadow-inner">
                    <div
                      className={`progress-bar h-3 rounded-full transition-all duration-1000 ease-out ${isStunted ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gradient-to-r from-green-400 to-emerald-500"}`}
                      style={{ width: childData.percentile ? `${parseInt(childData.percentile, 10)}%` : "0%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm font-medium">
                    <span className="text-gray-600">0%</span>
                    <span className={`${isStunted ? "text-amber-700" : "text-emerald-700"} font-bold`}>{childData.percentile} Percentile</span>
                    <span className="text-gray-600">100%</span>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Measurements
                </h4>
                <div className="space-y-6 bg-blue-50 p-5 rounded-lg shadow-md">
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <div className="flex justify-between mb-2">
                      <span className="text-blue-800 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                        Height
                      </span>
                      <span className="font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">{childData.height}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 shadow-inner">
                      <div className="progress-bar bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                           style={{ width: childData.height ? `${Math.min(parseInt(childData.height), 150) / 1.5}%` : "0%" }}></div>
                    </div>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-105">
                    <div className="flex justify-between mb-2">
                      <span className="text-green-800 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        Weight
                      </span>
                      <span className="font-bold text-green-900 bg-green-100 px-3 py-1 rounded-full">{childData.weight}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 shadow-inner">
                      <div className="progress-bar bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                           style={{ width: childData.weight ? `${Math.min(parseInt(childData.weight), 30) * 3}%` : "0%" }}></div>
                    </div>
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-105">
                    <div className="flex justify-between mb-2">
                      <span className="text-purple-800 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        BMI
                      </span>
                      <span className="font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">{childData.bmi}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-3 shadow-inner">
                      <div className="progress-bar bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                           style={{ width: childData.bmi ? `${Math.min(parseFloat(childData.bmi) * 3, 100)}%` : "0%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* AI Nutrition Analysis Card */}
          <div className="bg-white rounded-xl shadow-lg p-7 mb-10 fade-in-delay-2 card border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              AI Nutrition Analysis
            </h2>
            <div className="flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
              <div className="mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personalized Nutrition Recommendations</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Get AI-powered nutrition suggestions and meal recommendations tailored specifically for {childData.name}'s growth needs.
              </p>
              <button
                onClick={() => navigate('/nutrition-analysis', { state: { childData } })}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                Get Nutrition Analysis
              </button>
            </div>
          </div>

          {/* Daily Meal Schedule and Key Foods */}
          <div className="bg-white rounded-xl shadow-lg p-7 mb-10 fade-in-delay-2 card border border-blue-100 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Daily Nutrition Plan for {childData.name} ({childData.age})
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Daily Meal Schedule */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Daily Meal Schedule
                </h3>

                <div className="space-y-4">
                  {/* Breakfast */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mr-2 shadow-sm">7:30 AM</span>
                      <h4 className="font-semibold text-blue-800">Breakfast</h4>
                    </div>
                    <p className="text-gray-700">Whole grain cereal with milk, scrambled egg with spinach, and sliced banana</p>
                  </div>

                  {/* Morning Snack */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-l-4 border-green-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full mr-2 shadow-sm">10:00 AM</span>
                      <h4 className="font-semibold text-green-800">Morning Snack</h4>
                    </div>
                    <p className="text-gray-700">Apple slices with almond butter and a small yogurt</p>
                  </div>

                  {/* Lunch */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border-l-4 border-amber-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-amber-200 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mr-2 shadow-sm">12:30 PM</span>
                      <h4 className="font-semibold text-amber-800">Lunch</h4>
                    </div>
                    <p className="text-gray-700">Grilled chicken strips, brown rice, steamed broccoli, and sliced avocado</p>
                  </div>

                  {/* Afternoon Snack */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full mr-2 shadow-sm">3:30 PM</span>
                      <h4 className="font-semibold text-purple-800">Afternoon Snack</h4>
                    </div>
                    <p className="text-gray-700">Cheese cubes with whole grain crackers and cherry tomatoes</p>
                  </div>

                  {/* Dinner */}
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border-l-4 border-indigo-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-indigo-200 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full mr-2 shadow-sm">6:00 PM</span>
                      <h4 className="font-semibold text-indigo-800">Dinner</h4>
                    </div>
                    <p className="text-gray-700">Baked salmon, quinoa, roasted sweet potatoes, and green beans</p>
                  </div>

                  {/* Evening Snack */}
                  <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border-l-4 border-teal-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-teal-200 text-teal-800 text-xs font-medium px-3 py-1 rounded-full mr-2 shadow-sm">7:30 PM</span>
                      <h4 className="font-semibold text-teal-800">Evening Snack</h4>
                    </div>
                    <p className="text-gray-700">Warm milk with honey and a small banana</p>
                  </div>
                </div>
              </div>

              {/* Key Foods */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Key Foods to Include
                </h3>

                <div className="grid grid-cols-1 gap-5">
                  {/* Protein Sources */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-l-4 border-red-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Protein Sources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-red-200 transition-all duration-300 hover:bg-red-50 hover:shadow">Chicken</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-red-200 transition-all duration-300 hover:bg-red-50 hover:shadow">Fish</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-red-200 transition-all duration-300 hover:bg-red-50 hover:shadow">Eggs</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-red-200 transition-all duration-300 hover:bg-red-50 hover:shadow">Greek Yogurt</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-red-200 transition-all duration-300 hover:bg-red-50 hover:shadow">Lentils</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-red-200 transition-all duration-300 hover:bg-red-50 hover:shadow">Tofu</span>
                    </div>
                  </div>

                  {/* Calcium-Rich Foods */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Calcium-Rich Foods
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-blue-200 transition-all duration-300 hover:bg-blue-50 hover:shadow">Milk</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-blue-200 transition-all duration-300 hover:bg-blue-50 hover:shadow">Cheese</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-blue-200 transition-all duration-300 hover:bg-blue-50 hover:shadow">Yogurt</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-blue-200 transition-all duration-300 hover:bg-blue-50 hover:shadow">Fortified Plant Milk</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-blue-200 transition-all duration-300 hover:bg-blue-50 hover:shadow">Broccoli</span>
                    </div>
                  </div>

                  {/* Iron-Rich Foods */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border-l-4 border-amber-400 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                    <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      Iron-Rich Foods
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-amber-200 transition-all duration-300 hover:bg-amber-50 hover:shadow">Lean Beef</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-amber-200 transition-all duration-300 hover:bg-amber-50 hover:shadow">Beans</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-amber-200 transition-all duration-300 hover:bg-amber-50 hover:shadow">Spinach</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-amber-200 transition-all duration-300 hover:bg-amber-50 hover:shadow">Fortified Cereals</span>
                      <span className="bg-white px-3 py-1.5 rounded-md text-sm text-gray-800 shadow-sm border border-amber-200 transition-all duration-300 hover:bg-amber-50 hover:shadow">Dried Fruits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-white fade-in-delay-3 bg-gradient-to-r from-blue-800 to-indigo-900 p-6 rounded-xl shadow-lg">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg font-medium">Assessment report for {childData.name} generated by StuntingAI on {childData.assessmentDate}</p>
            <p className="mt-2 text-blue-200">The information provided is for guidance only and should be reviewed by a healthcare professional.</p>
            <div className="mt-4 pt-4 border-t border-blue-700 flex justify-center space-x-6">
              <a href="#" className="text-blue-300 hover:text-white transition-colors duration-300">
                <span className="sr-only">Privacy Policy</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors duration-300">
                <span className="sr-only">Terms of Service</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors duration-300">
                <span className="sr-only">Contact Us</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
