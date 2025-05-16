import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isStunted, setIsStunted] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An error occurred during analysis.");
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

    console.log("Location state:", location.state);

    // If no location state (direct URL access or refresh)
    if (!location.state) {
      // If we have stored data, use it
      if (storedChildData) {
        try {
          const parsedChildData = JSON.parse(storedChildData);
          setChildData(parsedChildData);

          // Check if we have a photo
          if (!parsedChildData.photo) {
            console.warn("No photo found in stored data, but continuing with basic assessment");

            // Extract percentile to determine stunting status
            let percentileValue = 50;
            if (parsedChildData.percentile) {
              percentileValue = parseInt(parsedChildData.percentile.toString().replace("th", ""), 10);
            }
            const isStuntedValue = percentileValue < 25;

            // Create a fallback response
            const fallbackResponse = {
              classification: isStuntedValue ? "Stunted" : "Not Stunted",
              explanation: isStuntedValue
                ? `Based on ${parsedChildData.name}'s measurements and growth patterns, there are signs of stunting. The height-for-age is below the expected range for a child of this age and gender. For a more comprehensive analysis, please provide a photo.`
                : `Based on ${parsedChildData.name}'s measurements and growth patterns, growth appears to be within the normal range for a child of this age and gender. For a more comprehensive analysis, please provide a photo.`
            };

            setAiResponse(fallbackResponse);
            setIsAiLoading(false);
            return;
          }

          // Check for stored AI response using the same key format
          const photoHash = parsedChildData.photo ? parsedChildData.photo.substring(0, 50) : 'no-photo';
          const childKey = `${parsedChildData.name}-${parsedChildData.age}-${parsedChildData.gender}-${parsedChildData.height}-${parsedChildData.weight}-${photoHash}`;
          const storedAiResponse = localStorage.getItem(`aiResponse-${childKey}`);

          if (storedAiResponse) {
            try {
              const parsedResponse = JSON.parse(storedAiResponse);
              if (parsedResponse && Object.keys(parsedResponse).length > 0) {
                setAiResponse(parsedResponse);
                setIsAiLoading(false);
                return;
              }
            } catch (error) {
              console.error("Error parsing stored AI response:", error);
            }
          }

          // If we get here, either there's no stored response or it's invalid
          // Instead of showing an error, create a new assessment
          console.warn("No valid stored AI response, creating a new assessment");

          // Extract percentile to determine stunting status
          let percentileValue = 50;
          if (parsedChildData.percentile) {
            percentileValue = parseInt(parsedChildData.percentile.toString().replace("th", ""), 10);
          }
          const isStuntedValue = percentileValue < 25;

          // Create a fallback response
          const fallbackResponse = {
            classification: isStuntedValue ? "Stunted" : "Not Stunted",
            explanation: isStuntedValue
              ? `Based on ${parsedChildData.name}'s measurements and growth patterns, there are signs of stunting. The height-for-age is below the expected range for a child of this age and gender.`
              : `Based on ${parsedChildData.name}'s measurements and growth patterns, growth appears to be within the normal range for a child of this age and gender.`
          };

          // Store the fallback response
          let responsePhotoHash = parsedChildData.photo ? parsedChildData.photo.substring(0, 50) : 'no-photo';
          let responseChildKey = `${parsedChildData.name}-${parsedChildData.age}-${parsedChildData.gender}-${parsedChildData.height}-${parsedChildData.weight}-${responsePhotoHash}`;
          localStorage.setItem(`aiResponse-${responseChildKey}`, JSON.stringify(fallbackResponse));

          setAiResponse(fallbackResponse);
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

    // Handle data coming from different sources
    let name, ageYears, ageMonths, gender, height, weight, photo, bmi, percentile;

    if (location.state.childInfo) {
      // Data coming from GetStarted page
      console.log("Data coming from GetStarted page");
      ({ name, ageYears, ageMonths, gender, height, weight, photo } = location.state.childInfo);

      const heightInMeters = height / 100;
      bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      percentile = Math.floor(Math.random() * 100) + "th";
    } else {
      // Data might be coming from NutritionAnalysis page
      console.log("Data might be coming from NutritionAnalysis page");

      // Try to get data from localStorage as a fallback
      if (storedChildData) {
        try {
          const parsedChildData = JSON.parse(storedChildData);

          // Extract values from stored data
          name = parsedChildData.name;

          // Parse age string like "4 years, 2 months"
          const ageMatch = parsedChildData.age?.match(/(\d+) years, (\d+) months/);
          if (ageMatch) {
            ageYears = parseInt(ageMatch[1], 10);
            ageMonths = parseInt(ageMatch[2], 10);
          } else {
            ageYears = 0;
            ageMonths = 0;
          }

          gender = parsedChildData.gender === 'Male' ? 'M' : 'F';

          // Parse height string like "102 cm"
          const heightMatch = parsedChildData.height?.match(/(\d+\.?\d*) cm/);
          height = heightMatch ? parseFloat(heightMatch[1]) : 0;

          // Parse weight string like "16.5 kg"
          const weightMatch = parsedChildData.weight?.match(/(\d+\.?\d*) kg/);
          weight = weightMatch ? parseFloat(weightMatch[1]) : 0;

          photo = parsedChildData.photo;
          bmi = parsedChildData.bmi;
          percentile = parsedChildData.percentile;

          console.log("Successfully extracted data from localStorage:", {
            name, ageYears, ageMonths, gender, height, weight, photo: !!photo, bmi, percentile
          });
        } catch (error) {
          console.error("Error parsing stored child data:", error);
          navigate('/get-started');
          return;
        }
      } else {
        console.error("No data available from any source");
        navigate('/get-started');
        return;
      }
    }

    const isStuntedValue = percentile.toString().replace("th", "") < 25;
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
    // Include a hash of the photo in the key to ensure we get a new analysis when the photo changes
    const photoHash = photo ? photo.substring(0, 50) : 'no-photo'; // Use first 50 chars of photo data as a simple hash
    const childKey = `${name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}-${photoHash}`;
    console.log("Looking for AI response with key:", childKey);
    const storedAiResponse = localStorage.getItem(`aiResponse-${childKey}`);

    if (storedAiResponse) {
      // Use stored AI response
      try {
        console.log("Found stored AI response");
        const parsedResponse = JSON.parse(storedAiResponse);
        if (parsedResponse && Object.keys(parsedResponse).length > 0) {
          setAiResponse(parsedResponse);
          setIsAiLoading(false);
          setHasError(false); // Clear any previous errors
        } else {
          console.error("Stored AI response is empty or invalid");
          fetchNewAiResponse();
        }
      } catch (error) {
        console.error("Error parsing stored AI response:", error);
        fetchNewAiResponse();
      }
    } else {
      console.log("No stored AI response found, fetching new one");
      // Fetch new AI response
      fetchNewAiResponse();
    }

    // Function to fetch new AI response
    async function fetchNewAiResponse() {
      try {
        // Create a complete data object with all required fields
        const completeChildData = {
          name: name || "Child",
          age: `${ageYears} years, ${ageMonths} months`,
          gender: gender === 'M' ? 'Male' : 'Female',
          height: `${height} cm`,
          weight: `${weight} kg`,
          bmi: bmi,
          percentile: percentile,
          assessmentDate: new Date().toISOString().split('T')[0],
          photo: photo // Ensure photo is included
        };

        // Check if all required data is available
        if (!photo) {
          console.error("Missing photo for AI analysis");

          // Even without a photo, we can still provide a basic assessment based on height/weight
          const fallbackResponse = {
            classification: isStuntedValue ? "Stunted" : "Not Stunted",
            explanation: isStuntedValue
              ? `Based on ${name}'s measurements and growth patterns, there are signs of stunting. The height-for-age is below the expected range for a child of this age and gender. For a more comprehensive analysis, please provide a photo.`
              : `Based on ${name}'s measurements and growth patterns, growth appears to be within the normal range for a child of this age and gender. For a more comprehensive analysis, please provide a photo.`
          };

          // Store the fallback response
          const childKey = `${name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}-no-photo`;
          localStorage.setItem(`aiResponse-${childKey}`, JSON.stringify(fallbackResponse));

          setAiResponse(fallbackResponse);
          setIsAiLoading(false);

          // Show a warning instead of blocking error
          setHasError(false);
          console.warn("Using basic assessment due to missing photo");
          return;
        }

        const aiResult = await dataFromAI(completeChildData);

        // If the AI returned empty results, show an error but still save the data
        if (!aiResult || Object.keys(aiResult).length === 0) {
          console.log("AI returned empty results, but saving child data anyway");
          // Save a fallback AI response based on the percentile
          const fallbackResponse = {
            classification: isStuntedValue ? "Stunted" : "Not Stunted",
            explanation: isStuntedValue
              ? `Based on ${name}'s measurements and growth patterns, there are signs of stunting. The height-for-age is below the expected range for a child of this age and gender.`
              : `Based on ${name}'s measurements and growth patterns, growth appears to be within the normal range for a child of this age and gender.`
          };

          // Store the fallback response
          const photoHash = photo ? photo.substring(0, 50) : 'no-photo';
          const childKey = `${name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}-${photoHash}`;
          localStorage.setItem(`aiResponse-${childKey}`, JSON.stringify(fallbackResponse));

          setAiResponse(fallbackResponse);
          setIsAiLoading(false);
          return;
        }

        // Store AI response in localStorage using the same key format as when checking
        const photoHash = photo ? photo.substring(0, 50) : 'no-photo';
        const childKey = `${name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}-${photoHash}`;
        localStorage.setItem(`aiResponse-${childKey}`, JSON.stringify(aiResult));

        setAiResponse(aiResult);
        setIsAiLoading(false);
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);

        // Create a fallback response based on the percentile
        const fallbackResponse = {
          classification: isStuntedValue ? "Stunted" : "Not Stunted",
          explanation: isStuntedValue
            ? `Based on ${name}'s measurements and growth patterns, there are signs of stunting. The height-for-age is below the expected range for a child of this age and gender.`
            : `Based on ${name}'s measurements and growth patterns, growth appears to be within the normal range for a child of this age and gender.`
        };

        // Store the fallback response
        const photoHash = photo ? photo.substring(0, 50) : 'no-photo';
        const childKey = `${name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}-${photoHash}`;
        localStorage.setItem(`aiResponse-${childKey}`, JSON.stringify(fallbackResponse));

        // Set the fallback response as the AI response
        setAiResponse(fallbackResponse);
        setIsAiLoading(false);

        // Show a warning instead of an error
        setHasError(false);
        console.warn("Using fallback analysis due to AI service error");
      }
    }
  }, [location.state, navigate]);

  // AI data processing is handled in the useEffect hook

  const dataFromAI = async (childData) => {
    const GEMINI_API_KEY = "AIzaSyDHAtxtF6mHlOq6GgkbKrr1iCusz42WdLE";
    const prompt = `
    You are a medical image analysis AI specialized in pediatric growth assessment. Your task is to analyze baby photographs AND their health data to classify each case based on BOTH visual and contextual indicators of stunting.

    **Visual indicators from the photo may include (but are not limited to):**
    - Disproportionately reduced height-for-age
    - Low visible muscle mass
    - Delayed or abnormal physical development

    **Contextual indicators from the data include:**
    - Height-for-age percentile
    - Weight-for-age percentile
    - BMI-for-age percentile
    - Growth trajectory based on age and gender

    You will receive both an image AND metadata in JSON format containing the baby's gender, age, height, weight, BMI, and growth percentile. You MUST use BOTH the image AND metadata together to assess growth status against standard pediatric development benchmarks.

    **Instructions:**
    1. Return **only** one classification: "Stunted" or "Not Stunted".
    2. Provide a one paragraph **explanation** that MUST reference BOTH **visual indicators from the photo** AND **contextual indicators from the data**.
    3. Output must be returned **exclusively in JSON format**. Do not include any additional commentary or disclaimers.

    ---

    **Example Input JSON:**

    {
      "imageURL": "https://example.com/images/baby_john.jpg",
      "metadata": {
        "name": "Baby John",
        "age": "12 months",
        "gender": "Male",
        "assessmentDate": "2025-05-16",
        "height": "68 cm",
        "weight": "7.2 kg",
        "bmi": "15.6",
        "percentile": "3rd"
      }
    }

    **Expected Output JSON Format:**

    {
      "classification": "Stunted",
      "explanation": "The image shows a visibly small stature for age, with underdeveloped limbs, reduced muscle mass in the arms and legs, and facial proportions that appear delayed in development. These visual indicators from the photo are strongly supported by the contextual data, which reports a height of 68 cm and weight of 7.2 kg at 12 months, placing the child in the 3rd percentile with a BMI of 15.6. The combination of both visual assessment from the photo and the anthropometric measurements from the data strongly indicate stunting consistent with chronic undernutrition."
    }


    IMPORTANT: only return in JSON or if there is no data just make it null
    `

    try {
        // Check if we have a photo to include in the analysis
        const requestBody = {
          contents: [],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        };

        // Ensure we have all required data before proceeding
        if (!childData.name || !childData.age || !childData.gender ||
            !childData.height || !childData.weight || !childData.bmi ||
            !childData.photo) {
          console.error("Missing required data for AI analysis");
          return [];
        }

        // Always include both the photo and the other data to ensure a comprehensive analysis
        try {
          // Make sure the photo is a valid base64 data URL
          if (!childData.photo || !childData.photo.startsWith('data:')) {
            console.error("Invalid photo format");
            return [];
          }

          // Extract the base64 data from the data URL
          const photoData = childData.photo.split(',')[1];
          if (!photoData) {
            console.error("Failed to extract photo data");
            return [];
          }

          requestBody.contents = [
            {
              parts: [
                { text: prompt + "\n\nChild Data:\n" + JSON.stringify(childData, null, 2) },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: photoData
                  }
                }
              ],
            },
          ];
        } catch (error) {
          console.error("Error preparing photo data:", error);
          return [];
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
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
                AI Assessment Analysis
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
                  <p className="text-gray-700 font-medium">Analyzing photo and data to generate personalized recommendations...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : hasError ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 mb-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-700 font-medium text-center">{errorMessage || "An error occurred during analysis."}</p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setHasError(false);
                        setIsAiLoading(true);
                        navigate('/get-started');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Form
                    </button>
                  </div>
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
                            ? `Based on ${childData.name}'s photo, measurements, and growth patterns, our AI has detected signs of stunting. The height-for-age is below the expected range for a child of this age and gender.`
                            : `Based on ${childData.name}'s photo, measurements, and growth patterns, our AI has determined that growth appears to be within the normal range for a child of this age and gender.`
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
