import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NutritionAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bmi: "",
    percentile: ""
  });

  useEffect(() => {
    // Check if we have data passed from AssessmentResults
    if (!location.state || !location.state.childData) {
      // If no data, try to get from localStorage
      const storedChildData = localStorage.getItem('childData');
      if (storedChildData) {
        try {
          const parsedChildData = JSON.parse(storedChildData);
          setChildData(parsedChildData);

          // Check if we have stored nutrition data for this child
          const childKey = parsedChildData.name;
          const storedNutritionData = localStorage.getItem(`nutritionData-${childKey}`);

          if (storedNutritionData) {
            // Use stored nutrition data
            try {
              const parsedNutritionData = JSON.parse(storedNutritionData);
              setNutritionData(parsedNutritionData);
              setIsLoading(false);
            } catch (error) {
              console.error("Error parsing stored nutrition data:", error);
              fetchNutritionAnalysis(parsedChildData);
            }
          } else {
            // No stored nutrition data, fetch new data
            fetchNutritionAnalysis(parsedChildData);
          }
        } catch (error) {
          console.error("Error parsing stored child data:", error);
          navigate('/assessment-results');
        }
      } else {
        // If no stored data, redirect to assessment results
        navigate('/assessment-results');
      }
      return;
    }

    // Set child data from location state
    setChildData(location.state.childData);

    // Check if we have stored nutrition data for this child
    const childKey = location.state.childData.name;
    const storedNutritionData = localStorage.getItem(`nutritionData-${childKey}`);

    if (storedNutritionData) {
      // Use stored nutrition data
      try {
        const parsedNutritionData = JSON.parse(storedNutritionData);
        setNutritionData(parsedNutritionData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing stored nutrition data:", error);
        fetchNutritionAnalysis(location.state.childData);
      }
    } else {
      // No stored nutrition data, fetch new data
      fetchNutritionAnalysis(location.state.childData);
    }
  }, [location.state, navigate]);

  const fetchNutritionAnalysis = async (childInfo) => {
    try {
      setIsLoading(true);
      setHasError(false);
      const aiResult = await nutritionDataFromAI(childInfo);

      // Only use AI data
      if (aiResult && Object.keys(aiResult).length > 0) {
        // Store nutrition data in localStorage using the child's name as the key
        const childKey = childInfo.name;
        localStorage.setItem(`nutritionData-${childKey}`, JSON.stringify(aiResult));

        setNutritionData(aiResult);
        setIsLoading(false);
      } else {
        // If AI fails, show error state
        console.error("Failed to get nutrition data from AI");
        setHasError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching nutrition analysis:", error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const nutritionDataFromAI = async (childData) => {
    const GEMINI_API_KEY = "AIzaSyDHAtxtF6mHlOq6GgkbKrr1iCusz42WdLE";
    const prompt = `
        You are a pediatric nutritionist AI specialized in creating personalized nutrition plans for children. Your task is to analyze a child's data and provide comprehensive nutrition recommendations to support healthy growth and development.

    You will receive metadata in JSON format containing the child's name, gender, age, height, weight, BMI, and growth percentile. Use this information to create a personalized nutrition plan.

    **Instructions:**
    1. Analyze the child's data to determine their nutritional needs.
    2. Return a comprehensive nutrition analysis in JSON format with the following sections:
      - dailyCalories: Estimated daily calorie needs (as a number)
      - macronutrients: Object with protein, carbs, and fats percentages and gram amounts
      - keyNutrients: Array of important nutrients with name, daily amount, and food sources
      - mealPlan: Array of meal suggestions organized by meal time
      - recommendations: Array of specific nutrition recommendations
      - growthTrajectory: Object with the following:
        - currentStatus: Evaluation based on BMI and growth percentile
        - projection: Short-term growth outlook and key considerations
        - recommendation: Advice to support healthy growth
        - estimatedAdultSize: Object with estimated adult height and weight ranges (based on current percentile and growth trends)

    3. Output must be returned **exclusively in JSON format**. Do not include any additional commentary or disclaimers.

    ---

    **Example Input JSON:**

      {
        "name": "John",
        "age": "4 years, 2 months",
        "gender": "Male",
        "height": "102 cm",
        "weight": "16.5 kg",
        "bmi": "15.9",
        "percentile": "45th"
      }

      **Expected Output JSON Format:**
      {
    "dailyCalories": 1350,
    "macronutrients": {
      "protein": { "percentage": 25, "grams": 84 },
      "carbs": { "percentage": 50, "grams": 169 },
      "fats": { "percentage": 25, "grams": 38 }
    },
    "keyNutrients": [
      {
        "name": "Calcium",
        "amount": "800-1000mg",
        "foods": ["Milk", "Yogurt", "Cheese", "Fortified plant milk", "Leafy greens"]
      },
      {
        "name": "Iron",
        "amount": "8-10mg",
        "foods": ["Lean meat", "Beans", "Fortified cereals", "Spinach", "Lentils"]
      },
      {
        "name": "Vitamin D",
        "amount": "600-800 IU",
        "foods": ["Fatty fish", "Egg yolks", "Fortified milk", "Mushrooms"]
      },
      {
        "name": "Zinc",
        "amount": "5-8mg",
        "foods": ["Meat", "Shellfish", "Legumes", "Seeds", "Nuts"]
      }
    ],
    "mealPlan": [
      {
        "meal": "Breakfast",
        "options": [
          "Whole grain cereal with milk and sliced banana",
          "Scrambled eggs with spinach and whole grain toast",
          "Greek yogurt with berries and granola"
        ]
      },
      {
        "meal": "Morning Snack",
        "options": [
          "Apple slices with almond butter",
          "Cheese stick with whole grain crackers",
          "Small yogurt with berries"
        ]
      },
      {
        "meal": "Lunch",
        "options": [
          "Grilled chicken with brown rice and steamed broccoli",
          "Turkey and cheese sandwich on whole grain bread with carrot sticks",
          "Lentil soup with whole grain roll and side salad"
        ]
      },
      {
        "meal": "Afternoon Snack",
        "options": [
          "Hummus with vegetable sticks",
          "Trail mix with nuts and dried fruits",
          "Smoothie with yogurt, fruit, and spinach"
        ]
      },
      {
        "meal": "Dinner",
        "options": [
          "Baked salmon with quinoa and roasted vegetables",
          "Lean beef stir-fry with vegetables and brown rice",
          "Bean and vegetable pasta with side salad"
        ]
      }
    ],
    "recommendations": [
      "Ensure regular meal times to establish healthy eating patterns",
      "Include a variety of colorful fruits and vegetables daily",
      "Limit processed foods and added sugars",
      "Encourage adequate hydration throughout the day",
      "Focus on nutrient-dense foods to support growth and development",
      "Include calcium-rich foods for bone development",
      "Ensure adequate protein intake for muscle growth",
      "Include iron-rich foods to prevent anemia"
    ],
    "growthTrajectory": {
      "currentStatus": "Growth is within normal range (45th percentile). BMI is appropriate for age.",
      "projection": "Maintain current growth pattern with balanced nutrition. Monitor height and weight at regular pediatric check-ups.",
      "recommendation": "Continue providing nutrient-rich meals and adequate physical activity to support steady growth.",
      "estimatedAdultSize": {
        "height": "170–175 cm",
        "weight": "60–68 kg"
      }
    }
  }


    IMPORTANT: only return in JSON or if there is no data just make it null
    `;

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
      if (!rawText) return {};

      // Clean up the response - remove any markdown code blocks
      const cleanedText = rawText.replace(/```json\s*|```/g, "").trim();

      console.log("Gemini nutrition response:", cleanedText);

      try {
        const parsedData = JSON.parse(cleanedText);

        // Ensure the response has the expected structure
        const validatedData = {
          dailyCalories: parsedData.dailyCalories || 0,
          macronutrients: parsedData.macronutrients || {
            protein: { percentage: 0, grams: 0 },
            carbs: { percentage: 0, grams: 0 },
            fats: { percentage: 0, grams: 0 }
          },
          keyNutrients: parsedData.keyNutrients || [],
          mealPlan: parsedData.mealPlan || [],
          recommendations: parsedData.recommendations || [],
          growthTrajectory: parsedData.growthTrajectory || {
            currentStatus: "Growth data not available",
            projection: "Projection data not available",
            recommendation: "Consult with a healthcare provider for personalized growth recommendations",
            estimatedAdultSize: {
              height: "Not available",
              weight: "Not available"
            }
          }
        };

        return validatedData;
      } catch (err) {
        console.error("Failed to parse Gemini nutrition response:", cleanedText);
        return {};
      }
    } catch (error) {
      console.error(error);
      return {};
    }
  };



  return (
    <div className="bg-gradient-to-b from-[#0a1122] to-[#162042] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8 flex space-x-4 sm:space-x-6">
          <button
            onClick={() => navigate('/assessment-results')}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-105 bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Assessment
          </button>
        </div>

        {/* Main Content */}
        <main>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center">
            Nutrition Analysis for {childData.name}
          </h1>

          {isLoading ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-purple-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 font-medium text-sm sm:text-base text-center">Analyzing nutritional needs and generating personalized recommendations...</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          ) : hasError && !nutritionData ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Unable to Generate Nutrition Analysis</h3>
              <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6">We couldn't generate personalized nutrition recommendations at this time. Please try again later.</p>
              <button
                onClick={() => {
                  setHasError(false);
                  fetchNutritionAnalysis(childData);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : nutritionData ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Calorie and Macronutrient Card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-blue-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Daily Nutritional Needs
                </h2>

                <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
                  {/* Calorie Requirements */}
                  <div className="flex-1">
                    <div className="bg-blue-50 p-4 sm:p-5 rounded-lg shadow-md">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center text-sm sm:text-base">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Estimated Daily Calories
                      </h3>
                      <div className="flex items-center justify-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <span className="text-xl sm:text-3xl font-bold text-white">{nutritionData.dailyCalories}</span>
                        </div>
                      </div>
                      <p className="text-center mt-3 sm:mt-4 text-blue-700 text-sm sm:text-base">calories per day</p>
                    </div>
                  </div>

                  {/* Macronutrients */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      Macronutrient Distribution
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {/* Protein */}
                      <div className="bg-green-50 p-3 sm:p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between mb-1 sm:mb-2">
                          <span className="text-green-800 font-medium text-xs sm:text-sm">Protein</span>
                          <span className="font-bold text-green-900 text-xs sm:text-sm">{nutritionData.macronutrients.protein.percentage}% ({nutritionData.macronutrients.protein.grams}g)</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 sm:h-3 shadow-inner">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 sm:h-3 rounded-full" style={{ width: `${nutritionData.macronutrients.protein.percentage}%` }}></div>
                        </div>
                      </div>

                      {/* Carbs */}
                      <div className="bg-amber-50 p-3 sm:p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between mb-1 sm:mb-2">
                          <span className="text-amber-800 font-medium text-xs sm:text-sm">Carbohydrates</span>
                          <span className="font-bold text-amber-900 text-xs sm:text-sm">{nutritionData.macronutrients.carbs.percentage}% ({nutritionData.macronutrients.carbs.grams}g)</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 sm:h-3 shadow-inner">
                          <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 sm:h-3 rounded-full" style={{ width: `${nutritionData.macronutrients.carbs.percentage}%` }}></div>
                        </div>
                      </div>

                      {/* Fats */}
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between mb-1 sm:mb-2">
                          <span className="text-blue-800 font-medium text-xs sm:text-sm">Fats</span>
                          <span className="font-bold text-blue-900 text-xs sm:text-sm">{nutritionData.macronutrients.fats.percentage}% ({nutritionData.macronutrients.fats.grams}g)</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 sm:h-3 shadow-inner">
                          <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 sm:h-3 rounded-full" style={{ width: `${nutritionData.macronutrients.fats.percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Nutrients Card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-blue-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Key Nutrients for Growth
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                  {nutritionData.keyNutrients.map((nutrient, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 sm:p-5 rounded-lg border-l-4 border-purple-400 shadow-md">
                      <h3 className="font-semibold text-purple-800 mb-1 sm:mb-2 text-sm sm:text-base">{nutrient.name}</h3>
                      <p className="text-gray-700 mb-2 sm:mb-3 text-xs sm:text-sm">
                        <span className="font-medium">Daily need:</span> {nutrient.amount}
                      </p>
                      <div>
                        <p className="text-xs sm:text-sm text-purple-700 mb-1 sm:mb-2">Top food sources:</p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {nutrient.foods.map((food, foodIndex) => (
                            <span key={foodIndex} className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm text-gray-800 shadow-sm border border-purple-200">
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Trajectory Card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-blue-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Growth Trajectory
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Status & Projection */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                      <h3 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Current Status</h3>
                      <p className="text-gray-700 text-xs sm:text-sm bg-white p-3 rounded-md shadow-sm border border-indigo-100">
                        {nutritionData.growthTrajectory?.currentStatus || "Growth is within normal range. BMI is appropriate for age."}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Projection</h3>
                      <p className="text-gray-700 text-xs sm:text-sm bg-white p-3 rounded-md shadow-sm border border-indigo-100">
                        {nutritionData.growthTrajectory?.projection || "Maintain current growth pattern with balanced nutrition. Monitor height and weight at regular pediatric check-ups."}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base">Recommendation</h3>
                      <p className="text-gray-700 text-xs sm:text-sm bg-white p-3 rounded-md shadow-sm border border-indigo-100">
                        {nutritionData.growthTrajectory?.recommendation || "Continue providing nutrient-rich meals and adequate physical activity to support steady growth."}
                      </p>
                    </div>
                  </div>

                  {/* Growth Chart Visualization */}
                  <div className="bg-white p-4 rounded-lg shadow-md border border-indigo-100">
                    <h3 className="font-semibold text-indigo-800 mb-3 text-sm sm:text-base text-center">Estimated Adult Size</h3>

                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="relative w-full max-w-[200px]">
                        {/* Adult figure silhouette */}
                        <svg className="w-full h-auto" viewBox="0 0 100 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50 0C44.5 0 40 4.5 40 10C40 15.5 44.5 20 50 20C55.5 20 60 15.5 60 10C60 4.5 55.5 0 50 0Z" fill="#4F46E5" fillOpacity="0.2"/>
                          <path d="M65 30H35C35 30 30 70 30 120C30 145 35 170 35 170H45C45 170 45 200 45 220C45 240 50 250 50 250C50 250 55 240 55 220C55 200 55 170 55 170H65C65 170 70 145 70 120C70 70 65 30 65 30Z" fill="#4F46E5" fillOpacity="0.2"/>
                          <path d="M50 0C44.5 0 40 4.5 40 10C40 15.5 44.5 20 50 20C55.5 20 60 15.5 60 10C60 4.5 55.5 0 50 0Z" stroke="#4F46E5" strokeWidth="1"/>
                          <path d="M65 30H35C35 30 30 70 30 120C30 145 35 170 35 170H45C45 170 45 200 45 220C45 240 50 250 50 250C50 250 55 240 55 220C55 200 55 170 55 170H65C65 170 70 145 70 120C70 70 65 30 65 30Z" stroke="#4F46E5" strokeWidth="1"/>
                        </svg>

                        {/* Height indicator */}
                        <div className="absolute top-0 right-0 h-full w-6 flex flex-col justify-between">
                          <div className="text-xs text-indigo-800 font-medium">Height</div>
                          <div className="h-full relative mx-2">
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-200 to-indigo-400 rounded-full w-1 mx-auto"></div>
                          </div>
                          <div className="text-xs text-indigo-800 font-medium">
                            {nutritionData.growthTrajectory?.estimatedAdultSize?.height || "170-175 cm"}
                          </div>
                        </div>

                        {/* Weight indicator */}
                        <div className="absolute top-0 left-0 h-full w-6 flex flex-col justify-between">
                          <div className="text-xs text-indigo-800 font-medium">Weight</div>
                          <div className="h-full relative mx-2">
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-400 rounded-full w-1 mx-auto"></div>
                          </div>
                          <div className="text-xs text-indigo-800 font-medium">
                            {nutritionData.growthTrajectory?.estimatedAdultSize?.weight || "60-68 kg"}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">Estimated adult size based on current growth percentile</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Percentile Visualization */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-indigo-100">
                  <h3 className="font-semibold text-indigo-800 mb-3 text-sm sm:text-base">Current Growth Percentile</h3>

                  <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="bg-red-400" style={{ width: '3%' }}></div>
                      <div className="bg-orange-400" style={{ width: '12%' }}></div>
                      <div className="bg-yellow-400" style={{ width: '35%' }}></div>
                      <div className="bg-green-400" style={{ width: '35%' }}></div>
                      <div className="bg-blue-400" style={{ width: '15%' }}></div>
                    </div>

                    {/* Percentile marker */}
                    <div
                      className="absolute top-0 h-full w-4 bg-white border-2 border-indigo-600 rounded-full transform -translate-x-1/2 flex items-center justify-center"
                      style={{ left: `${parseInt(String(childData.percentile).replace(/[^\d]/g, '')) || 45}%` }}
                    >
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>

                    {/* Percentile labels */}
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-600">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {childData.percentile ? `${childData.percentile}${!childData.percentile.toString().endsWith('th') ? 'th' : ''}` : "45th"} Percentile
                    </span>
                  </div>
                </div>
              </div>

              {/* Meal Plan Card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-blue-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Suggested Meal Plan
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {nutritionData.mealPlan.map((meal, index) => (
                    <div key={index} className="bg-gradient-to-r from-teal-50 to-teal-100 p-3 sm:p-5 rounded-lg border-l-4 border-teal-400 shadow-md">
                      <h3 className="font-semibold text-teal-800 mb-2 sm:mb-3 text-sm sm:text-base">{meal.meal}</h3>
                      <ul className="space-y-1 sm:space-y-2">
                        {meal.options.map((option, optionIndex) => (
                          <li key={optionIndex} className="flex items-start">
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 text-xs sm:text-sm">{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-blue-100 hover:shadow-xl transition-all duration-300">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Nutrition Recommendations
                </h2>

                <div className="bg-blue-50 p-4 sm:p-6 rounded-lg shadow-md">
                  <ul className="space-y-3 sm:space-y-4">
                    {nutritionData.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-gray-700 text-xs sm:text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center">
              <p className="text-gray-700 text-center text-sm sm:text-base">No nutrition data available. Please try again.</p>
              <button
                onClick={() => {
                  fetchNutritionAnalysis(childData);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Generate Nutrition Analysis
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center text-white fade-in-delay-3 bg-gradient-to-r from-blue-800 to-indigo-900 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg font-medium">Nutrition analysis for {childData.name} generated by StuntingAI</p>
            <p className="mt-1 sm:mt-2 text-blue-200 text-xs sm:text-sm">The information provided is for guidance only and should be reviewed by a healthcare professional.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
