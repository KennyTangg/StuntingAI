import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NutritionAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
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
    // Always start with loading state
    setIsLoading(true);

    // Check if we have data passed from AssessmentResults
    if (!location.state || !location.state.childData) {
      // If no data, try to get from localStorage
      const storedChildData = localStorage.getItem('childData');
      if (storedChildData) {
        try {
          const parsedChildData = JSON.parse(storedChildData);
          setChildData(parsedChildData);

          // Create a consistent key format that matches the one used in AssessmentResults.jsx
          // Parse age string like "4 years, 2 months" or "1 year, 1 month"
          let ageYears = 0;
          let ageMonths = 0;
          const ageMatch = parsedChildData.age?.match(/(\d+) years?, (\d+) months?/);
          if (ageMatch) {
            ageYears = parseInt(ageMatch[1], 10) || 0;
            ageMonths = parseInt(ageMatch[2], 10) || 0;
          }

          // Parse height string like "102 cm"
          let height = 0;
          const heightMatch = parsedChildData.height?.match(/(\d+\.?\d*) cm/);
          if (heightMatch) {
            height = parseFloat(heightMatch[1]) || 0;
          }

          // Parse weight string like "16.5 kg"
          let weight = 0;
          const weightMatch = parsedChildData.weight?.match(/(\d+\.?\d*) kg/);
          if (weightMatch) {
            weight = parseFloat(weightMatch[1]) || 0;
          }

          const gender = parsedChildData.gender === 'Male' ? 'M' : 'F';
          const childKey = `${parsedChildData.name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}`;
          console.log("Looking for nutrition data with key:", childKey);
          const storedNutritionData = localStorage.getItem(`nutritionData-${childKey}`);

          if (storedNutritionData) {
            try {
              // Use stored nutrition data to prevent fluctuating values
              const parsedNutritionData = JSON.parse(storedNutritionData);
              console.log("Using stored nutrition data to ensure consistency");
              setNutritionData(parsedNutritionData);
              setIsLoading(false);
            } catch (parseError) {
              console.error("Error parsing stored nutrition data:", parseError);
              // Only fetch fresh data if we can't use stored data
              console.log("Fetching fresh nutrition analysis data...");
              fetchNutritionAnalysis(parsedChildData);
            }
          } else {
            // No stored nutrition data, fetch new data
            console.log("No stored nutrition data, fetching fresh data...");
            fetchNutritionAnalysis(parsedChildData);
          }
        } catch (error) {
          console.error("Error parsing stored child data:", error);
          setHasError(true);
          setIsLoading(false);
          // Redirect after a short delay to show the error
          setTimeout(() => {
            navigate('/assessment-results');
          }, 2000);
        }
      } else {
        // If no stored data, redirect to assessment results
        console.error("No child data available");
        setHasError(true);
        setIsLoading(false);
        setTimeout(() => {
          navigate('/assessment-results');
        }, 1000);
      }
      return;
    }

    // Set child data from location state
    setChildData(location.state.childData);

    // Create a consistent key format that matches the one used in AssessmentResults.jsx
    const childData = location.state.childData;

    // Parse age string like "4 years, 2 months" or "1 year, 1 month"
    let ageYears = 0;
    let ageMonths = 0;
    const ageMatch = childData.age?.match(/(\d+) years?, (\d+) months?/);
    if (ageMatch) {
      ageYears = parseInt(ageMatch[1], 10) || 0;
      ageMonths = parseInt(ageMatch[2], 10) || 0;
    }

    // Parse height string like "102 cm"
    let height = 0;
    const heightMatch = childData.height?.match(/(\d+\.?\d*) cm/);
    if (heightMatch) {
      height = parseFloat(heightMatch[1]) || 0;
    }

    // Parse weight string like "16.5 kg"
    let weight = 0;
    const weightMatch = childData.weight?.match(/(\d+\.?\d*) kg/);
    if (weightMatch) {
      weight = parseFloat(weightMatch[1]) || 0;
    }

    const gender = childData.gender === 'Male' ? 'M' : 'F';
    const childKey = `${childData.name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}`;
    console.log("Looking for nutrition data with key:", childKey);
    const storedNutritionData = localStorage.getItem(`nutritionData-${childKey}`);

    if (storedNutritionData) {
      try {
        // Use stored nutrition data to prevent fluctuating values
        const parsedNutritionData = JSON.parse(storedNutritionData);
        console.log("Using stored nutrition data to ensure consistency");
        setNutritionData(parsedNutritionData);
        setIsLoading(false);
      } catch (parseError) {
        console.error("Error parsing stored nutrition data:", parseError);
        // Only fetch fresh data if we can't use stored data
        console.log("Fetching fresh nutrition analysis data...");
        fetchNutritionAnalysis(location.state.childData);
      }
    } else {
      // No stored nutrition data, fetch new data
      console.log("No stored nutrition data, fetching fresh data...");
      fetchNutritionAnalysis(location.state.childData);
    }
  }, [location.state, navigate]);

  // Helper function to calculate estimated adult height based on child's current data
  const calculateEstimatedAdultHeight = (childInfo) => {
    try {
      // Extract height in cm
      let heightCm = 0;
      if (typeof childInfo.height === 'string') {
        const heightMatch = childInfo.height.match(/(\d+\.?\d*)/);
        heightCm = heightMatch ? parseFloat(heightMatch[1]) : 0;
      } else if (typeof childInfo.height === 'number') {
        heightCm = childInfo.height;
      }

      // Extract age in months
      let ageInMonths = 0;
      if (typeof childInfo.age === 'string') {
        const ageYearsMatch = childInfo.age.match(/(\d+)\s*years?/);
        const ageMonthsMatch = childInfo.age.match(/(\d+)\s*months?/);

        const years = ageYearsMatch ? parseInt(ageYearsMatch[1], 10) : 0;
        const months = ageMonthsMatch ? parseInt(ageMonthsMatch[1], 10) : 0;

        ageInMonths = years * 12 + months;
      } else {
        ageInMonths = (childInfo.ageYears || 0) * 12 + (childInfo.ageMonths || 0);
      }

      // If we don't have valid height or age data, return default ranges
      if (heightCm <= 0 || ageInMonths <= 0) {
        return childInfo.gender === "Male" ? "165-180 cm" : "155-170 cm";
      }

      // Calculate estimated adult height based on current percentile
      // This is a simplified calculation and not medically accurate
      let percentileValue = 50; // Default to 50th percentile
      if (childInfo.percentile) {
        if (typeof childInfo.percentile === 'string') {
          const percentileMatch = childInfo.percentile.match(/(\d+)/);
          percentileValue = percentileMatch ? parseInt(percentileMatch[1], 10) : 50;
        } else if (typeof childInfo.percentile === 'number') {
          percentileValue = childInfo.percentile;
        }
      }

      // Adjust base height based on gender
      const isMale = childInfo.gender === "Male";

      // Base adult height ranges (50th percentile)
      const baseAdultHeightMale = 175;
      const baseAdultHeightFemale = 162;

      // Calculate estimated adult height based on current percentile
      // Higher percentile = taller adult height
      const percentileAdjustment = (percentileValue - 50) * 0.3;
      const baseAdultHeight = isMale ? baseAdultHeightMale : baseAdultHeightFemale;
      const estimatedAdultHeight = baseAdultHeight + percentileAdjustment;

      // Create a range of +/- 5cm
      const minHeight = Math.round(estimatedAdultHeight - 5);
      const maxHeight = Math.round(estimatedAdultHeight + 5);

      return `${minHeight}-${maxHeight} cm`;
    } catch (error) {
      console.error("Error calculating estimated adult height:", error);
      return childInfo.gender === "Male" ? "165-180 cm" : "155-170 cm";
    }
  };

  const fetchNutritionAnalysis = async (childInfo) => {
    // Prevent multiple simultaneous API calls
    if (isApiCallInProgress) {
      console.log("API call already in progress, skipping duplicate request");
      return;
    }

    try {
      // Ensure we're in loading state
      setIsLoading(true);
      setHasError(false);
      setIsApiCallInProgress(true);

      // Create a consistent key format that matches the one used in AssessmentResults.jsx
      // This ensures we only re-analyze if the child's data has actually changed

      // Parse age string like "4 years, 2 months" or "1 year, 1 month"
      let ageYears = 0;
      let ageMonths = 0;
      const ageMatch = childInfo.age?.match(/(\d+) years?, (\d+) months?/);
      if (ageMatch) {
        ageYears = parseInt(ageMatch[1], 10) || 0;
        ageMonths = parseInt(ageMatch[2], 10) || 0;
      }

      // Parse height string like "102 cm"
      let height = 0;
      const heightMatch = childInfo.height?.match(/(\d+\.?\d*) cm/);
      if (heightMatch) {
        height = parseFloat(heightMatch[1]) || 0;
      }

      // Parse weight string like "16.5 kg"
      let weight = 0;
      const weightMatch = childInfo.weight?.match(/(\d+\.?\d*) kg/);
      if (weightMatch) {
        weight = parseFloat(weightMatch[1]) || 0;
      }

      const gender = childInfo.gender === 'Male' ? 'M' : 'F';
      const childKey = `${childInfo.name}-${ageYears}-${ageMonths}-${gender}-${height}-${weight}`;
      console.log("Looking for nutrition data with key:", childKey);
      const storedNutritionData = localStorage.getItem(`nutritionData-${childKey}`);

      if (storedNutritionData) {
        try {
          // Use stored nutrition data to prevent fluctuating values
          const parsedNutritionData = JSON.parse(storedNutritionData);
          console.log("Using cached nutrition data to ensure consistency");
          setNutritionData(parsedNutritionData);
          setIsLoading(false);
          setIsApiCallInProgress(false);
          return; // Exit early to prevent multiple API calls
        } catch (parseError) {
          console.error("Error parsing stored nutrition data:", parseError);
          // Continue with API call if parsing fails
        }
      }

      // Only proceed with API call if no valid stored data
      setNutritionData(null);
      console.log("Starting AI nutrition analysis...");
      console.log("Child info for analysis:", childInfo);

      // Create a timeout promise to ensure we don't wait too long
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("AI analysis timeout after 45 seconds")), 45000);
      });

      // Race between the AI analysis and the timeout
      const aiResult = await Promise.race([
        nutritionDataFromAI(childInfo),
        timeoutPromise
      ]);

      // Only proceed if we have valid AI data
      if (aiResult && Object.keys(aiResult).length > 0) {
        console.log("AI nutrition analysis complete");

        // Store nutrition data in localStorage using the consistent key format
        // We already created the childKey above, so we can reuse it
        localStorage.setItem(`nutritionData-${childKey}`, JSON.stringify(aiResult));

        // Set the data and turn off loading state
        setNutritionData(aiResult);
        setIsLoading(false);
        setIsApiCallInProgress(false);
      } else {
        // If AI fails, generate fallback data
        console.error("Failed to get nutrition data from AI, generating fallback data");

        // Create fallback data based on child's age, weight, height
        // Calculate age in months for calorie estimation
        const ageInMonths = typeof childInfo.age === 'string'
          ? (childInfo.age.includes('years')
              ? parseInt(childInfo.age.split('years')[0].trim(), 10) * 12 + parseInt(childInfo.age.split('months')[0].split(',')[1].trim(), 10)
              : 12)
          : (childInfo.ageYears || 0) * 12 + (childInfo.ageMonths || 0);

        // Calculate estimated calorie needs based on age
        // Use a deterministic approach to ensure consistent values
        let baseCalories = 0;
        if (ageInMonths < 12) {
          baseCalories = 800;
        } else if (ageInMonths < 36) {
          baseCalories = 1000;
        } else if (ageInMonths < 60) {
          baseCalories = 1200;
        } else {
          baseCalories = 1400;
        }

        // Create a deterministic seed based on child's name and age to ensure consistency
        const nameSeed = childInfo.name ? childInfo.name.charCodeAt(0) % 10 : 0;
        const ageSeed = ageInMonths % 5;
        const heightSeed = typeof childInfo.height === 'string'
          ? parseInt(childInfo.height.split(' ')[0], 10) % 10
          : (childInfo.height || 0) % 10;

        // Combine seeds to create a consistent offset (-20 to +20 calories)
        const calorieOffset = ((nameSeed + ageSeed + heightSeed) % 5) * 10 - 20;

        // Apply the offset to get a consistent but slightly varied calorie value
        const estimatedCalories = baseCalories + calorieOffset;

        // Create fallback nutrition data
        const fallbackData = {
          dailyCalories: estimatedCalories,
          macronutrients: {
            protein: { percentage: 25, grams: Math.round(estimatedCalories * 0.25 / 4) },
            carbs: { percentage: 50, grams: Math.round(estimatedCalories * 0.5 / 4) },
            fats: { percentage: 25, grams: Math.round(estimatedCalories * 0.25 / 9) }
          },
          keyNutrients: [
            {
              name: "Calcium",
              amount: "800-1000mg",
              foods: ["Milk", "Yogurt", "Cheese", "Fortified plant milk", "Leafy greens"]
            },
            {
              name: "Iron",
              amount: "8-10mg",
              foods: ["Lean meat", "Beans", "Fortified cereals", "Spinach", "Lentils"]
            },
            {
              name: "Vitamin D",
              amount: "600-800 IU",
              foods: ["Fatty fish", "Egg yolks", "Fortified milk", "Mushrooms"]
            },
            {
              name: "Zinc",
              amount: "5-8mg",
              foods: ["Meat", "Shellfish", "Legumes", "Seeds", "Nuts"]
            }
          ],
          mealPlan: [
            {
              meal: "Breakfast",
              options: [
                "Whole grain cereal with milk and sliced banana",
                "Scrambled eggs with spinach and whole grain toast",
                "Greek yogurt with berries and granola"
              ]
            },
            {
              meal: "Morning Snack",
              options: [
                "Apple slices with almond butter",
                "Cheese stick with whole grain crackers",
                "Small yogurt with berries"
              ]
            },
            {
              meal: "Lunch",
              options: [
                "Grilled chicken with brown rice and steamed broccoli",
                "Turkey and cheese sandwich on whole grain bread with carrot sticks",
                "Lentil soup with whole grain roll and side salad"
              ]
            },
            {
              meal: "Afternoon Snack",
              options: [
                "Hummus with vegetable sticks",
                "Trail mix with nuts and dried fruits",
                "Smoothie with yogurt, fruit, and spinach"
              ]
            },
            {
              meal: "Dinner",
              options: [
                "Baked salmon with quinoa and roasted vegetables",
                "Lean beef stir-fry with vegetables and brown rice",
                "Bean and vegetable pasta with side salad"
              ]
            }
          ],
          recommendations: [
            "Ensure regular meal times to establish healthy eating patterns",
            "Include a variety of colorful fruits and vegetables daily",
            "Limit processed foods and added sugars",
            "Encourage adequate hydration throughout the day",
            "Focus on nutrient-dense foods to support growth and development",
            "Include calcium-rich foods for bone development",
            "Ensure adequate protein intake for muscle growth",
            "Include iron-rich foods to prevent anemia"
          ],
          growthTrajectory: {
            currentStatus: `Growth is being monitored. Regular check-ups are recommended.`,
            projection: `Maintain balanced nutrition and monitor growth regularly.`,
            recommendation: `Provide nutrient-rich meals and adequate physical activity to support healthy growth.`,
            estimatedAdultSize: {
              height: calculateEstimatedAdultHeight(childInfo),
              weight: childInfo.gender === "Male" ? "60-75 kg" : "50-65 kg"
            }
          }
        };

        // Store the fallback data using the consistent key format
        // We already created the childKey above, so we can reuse it
        localStorage.setItem(`nutritionData-${childKey}`, JSON.stringify(fallbackData));

        // Set the fallback data
        setNutritionData(fallbackData);
        setIsLoading(false);
        setIsApiCallInProgress(false);

        // Show a warning instead of an error
        setHasError(false);
        console.warn("Using fallback nutrition data");
      }
    } catch (error) {
      console.error("Error fetching nutrition analysis:", error);

      // Generate fallback data with deterministic values
      // Calculate age in months for calorie estimation
      const ageInMonths = typeof childInfo.age === 'string'
        ? (childInfo.age.includes('years')
            ? parseInt(childInfo.age.split('years')[0].trim(), 10) * 12 + parseInt(childInfo.age.split('months')[0].split(',')[1].trim(), 10)
            : 12)
        : (childInfo.ageYears || 0) * 12 + (childInfo.ageMonths || 0);

      // Use a deterministic approach to ensure consistent values
      let baseCalories = 0;
      if (ageInMonths < 12) {
        baseCalories = 800;
      } else if (ageInMonths < 36) {
        baseCalories = 1000;
      } else if (ageInMonths < 60) {
        baseCalories = 1200;
      } else {
        baseCalories = 1400;
      }

      // Create a deterministic seed based on child's name and age
      const nameSeed = childInfo.name ? childInfo.name.charCodeAt(0) % 10 : 0;
      const ageSeed = ageInMonths % 5;

      // Combine seeds to create a consistent offset (-20 to +20 calories)
      const calorieOffset = ((nameSeed + ageSeed) % 5) * 10 - 20;

      // Apply the offset to get a consistent calorie value
      const estimatedCalories = baseCalories + calorieOffset;

      const fallbackData = {
        dailyCalories: estimatedCalories,
        macronutrients: {
          protein: { percentage: 25, grams: Math.round(estimatedCalories * 0.25 / 4) },
          carbs: { percentage: 50, grams: Math.round(estimatedCalories * 0.5 / 4) },
          fats: { percentage: 25, grams: Math.round(estimatedCalories * 0.25 / 9) }
        },
        keyNutrients: [
          {
            name: "Calcium",
            amount: "800-1000mg",
            foods: ["Milk", "Yogurt", "Cheese", "Fortified plant milk", "Leafy greens"]
          },
          {
            name: "Iron",
            amount: "8-10mg",
            foods: ["Lean meat", "Beans", "Fortified cereals", "Spinach", "Lentils"]
          },
          {
            name: "Vitamin D",
            amount: "600-800 IU",
            foods: ["Fatty fish", "Egg yolks", "Fortified milk", "Mushrooms"]
          },
          {
            name: "Zinc",
            amount: "5-8mg",
            foods: ["Meat", "Shellfish", "Legumes", "Seeds", "Nuts"]
          }
        ],
        mealPlan: [
          {
            meal: "Breakfast",
            options: [
              "Whole grain cereal with milk and sliced banana",
              "Scrambled eggs with spinach and whole grain toast",
              "Greek yogurt with berries and granola"
            ]
          },
          {
            meal: "Lunch",
            options: [
              "Grilled chicken with brown rice and steamed broccoli",
              "Turkey and cheese sandwich on whole grain bread with carrot sticks",
              "Lentil soup with whole grain roll and side salad"
            ]
          },
          {
            meal: "Dinner",
            options: [
              "Baked salmon with quinoa and roasted vegetables",
              "Lean beef stir-fry with vegetables and brown rice",
              "Bean and vegetable pasta with side salad"
            ]
          }
        ],
        recommendations: [
          "Ensure regular meal times to establish healthy eating patterns",
          "Include a variety of colorful fruits and vegetables daily",
          "Limit processed foods and added sugars",
          "Encourage adequate hydration throughout the day"
        ],
        growthTrajectory: {
          currentStatus: "Growth data not available",
          projection: "Projection data not available",
          recommendation: "Consult with a healthcare provider for personalized growth recommendations",
          estimatedAdultSize: {
            height: calculateEstimatedAdultHeight(childInfo),
            weight: childInfo.gender === "Male" ? "60-75 kg" : "50-65 kg"
          }
        }
      };

      // Store the fallback data using the consistent key format
      // We already created the childKey above, but in case of error we might need to recreate it

      // Extract age components for the emergency key
      let emergencyAgeYears = 0;
      let emergencyAgeMonths = 0;
      if (typeof childInfo.age === 'string') {
        const emergencyAgeMatch = childInfo.age?.match(/(\d+) years?, (\d+) months?/);
        if (emergencyAgeMatch) {
          emergencyAgeYears = parseInt(emergencyAgeMatch[1], 10) || 0;
          emergencyAgeMonths = parseInt(emergencyAgeMatch[2], 10) || 0;
        }
      }

      // Extract height for the emergency key
      let emergencyHeight = 0;
      if (typeof childInfo.height === 'string') {
        const emergencyHeightMatch = childInfo.height?.match(/(\d+\.?\d*) cm/);
        if (emergencyHeightMatch) {
          emergencyHeight = parseFloat(emergencyHeightMatch[1]) || 0;
        }
      }

      // Extract weight for the emergency key
      let emergencyWeight = 0;
      if (typeof childInfo.weight === 'string') {
        const emergencyWeightMatch = childInfo.weight?.match(/(\d+\.?\d*) kg/);
        if (emergencyWeightMatch) {
          emergencyWeight = parseFloat(emergencyWeightMatch[1]) || 0;
        }
      }

      // Create emergency gender
      const emergencyGender = childInfo.gender === 'Male' ? 'M' : 'F';

      const emergencyChildKey = childInfo.name ?
        `${childInfo.name}-${emergencyAgeYears}-${emergencyAgeMonths}-${emergencyGender}-${emergencyHeight}-${emergencyWeight}` :
        "unknown-child";
      localStorage.setItem(`nutritionData-${emergencyChildKey}`, JSON.stringify(fallbackData));

      // Set the fallback data
      setNutritionData(fallbackData);
      setIsLoading(false);
      setIsApiCallInProgress(false);

      // Show a warning instead of an error
      setHasError(false);
      console.warn("Using emergency fallback nutrition data due to error:", error.message);
    }
  };

  const nutritionDataFromAI = async (childData) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
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
        - estimatedAdultSize: Object with estimated adult height and weight ranges (MUST provide specific numerical ranges in cm for height, like "160-170 cm", NOT generic statements like "depends on genetic factors")

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


    IMPORTANT:
    1. Only return in JSON or if there is no data just make it null
    2. For estimatedAdultSize, ALWAYS provide specific numerical ranges in cm for height (like "160-170 cm") and kg for weight (like "55-65 kg")
    3. NEVER use generic statements like "depends on genetic factors" for height or weight estimates
    `;

    try {
      console.log("Validating child data before sending to AI...");

      // Validate child data before sending to AI
      if (!childData) {
        console.error("Child data is null or undefined");
        return {};
      }

      // Create a more flexible validation that handles different data formats
      const validName = childData.name && typeof childData.name === 'string';
      const validAge = childData.age && typeof childData.age === 'string';
      const validGender = childData.gender && (childData.gender === 'Male' || childData.gender === 'Female');

      // Height and weight can be either strings with units or numbers
      const validHeight = childData.height && (
        (typeof childData.height === 'string' && childData.height.includes('cm')) ||
        (typeof childData.height === 'number' && childData.height > 0)
      );

      const validWeight = childData.weight && (
        (typeof childData.weight === 'string' && childData.weight.includes('kg')) ||
        (typeof childData.weight === 'number' && childData.weight > 0)
      );

      // BMI and percentile are optional but should be valid if present
      const validBmi = !childData.bmi || (
        (typeof childData.bmi === 'string' && !isNaN(parseFloat(childData.bmi))) ||
        (typeof childData.bmi === 'number' && childData.bmi > 0)
      );

      const validPercentile = !childData.percentile || (
        (typeof childData.percentile === 'string') ||
        (typeof childData.percentile === 'number' && childData.percentile >= 0 && childData.percentile <= 100)
      );

      if (!validName || !validAge || !validGender || !validHeight || !validWeight || !validBmi || !validPercentile) {
        console.error("Invalid child data format:", {
          name: validName,
          age: validAge,
          gender: validGender,
          height: validHeight,
          weight: validWeight,
          bmi: validBmi,
          percentile: validPercentile
        });

        // Create a normalized version of the data with defaults for missing values
        const normalizedData = {
          name: validName ? childData.name : "Child",
          age: validAge ? childData.age : "1 years, 0 months",
          gender: validGender ? childData.gender : "Male",
          height: validHeight ? childData.height : "75 cm",
          weight: validWeight ? childData.weight : "10 kg",
          bmi: validBmi && childData.bmi ? childData.bmi : "17.8",
          percentile: validPercentile && childData.percentile ? childData.percentile : "50th"
        };

        console.log("Using normalized data for AI analysis:", normalizedData);
        // Continue with the normalized data instead of recursively calling
        childData = normalizedData;
      }

      console.log("Child data validated, sending request to Gemini API...");

      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/gemini/nutrition`,
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
                temperature: 0.2,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
              },
            }),
            signal: controller.signal
          });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error("API response not OK:", response.status, response.statusText);
          return {};
        }

        const data = await response.json();

        if (!data || !data.candidates || !data.candidates[0] || !data.candidates[0].content ||
            !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] ||
            !data.candidates[0].content.parts[0].text) {
          console.error("Invalid API response structure:", data);
          return {};
        }

        const rawText = data.candidates[0].content.parts[0].text;
        if (!rawText) {
          console.error("Empty response from API");
          return {};
        }

        // Clean up the response - remove any markdown code blocks and extract JSON
        let cleanedText = rawText.replace(/```json\s*|```/g, "").trim();

        // Try to extract JSON if it's embedded in text
        const jsonRegex = /\{[\s\S]*\}/g;
        const jsonMatches = cleanedText.match(jsonRegex);

        if (jsonMatches && jsonMatches.length > 0) {
          // Use the first JSON object found
          cleanedText = jsonMatches[0];
        }

        console.log("Received response from Gemini API, parsing JSON...");
        console.log("Raw JSON to parse:", cleanedText.substring(0, 200) + "...");

        try {
          // Handle potential JSON parsing errors
          let parsedData;
          try {
            parsedData = JSON.parse(cleanedText);
          } catch (jsonError) {
            console.error("JSON parse error:", jsonError);

            // Try to fix common JSON issues
            const fixedJson = cleanedText
              .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
              .replace(/'/g, '"'); // Replace single quotes with double quotes

            try {
              parsedData = JSON.parse(fixedJson);
              console.log("Successfully parsed JSON after fixing format issues");
            } catch (secondError) {
              console.error("Failed to parse JSON even after fixing format:", secondError);
              return {};
            }
          }

          // Validate the parsed data has the expected structure
          if (!parsedData || typeof parsedData !== 'object') {
            console.error("Invalid JSON structure in API response");
            return {};
          }

          // Ensure the response has the expected structure with strict validation
          const validatedData = {
            dailyCalories: typeof parsedData.dailyCalories === 'number' ? parsedData.dailyCalories : 0,
            macronutrients: {
              protein: {
                percentage: parsedData.macronutrients?.protein?.percentage || 0,
                grams: parsedData.macronutrients?.protein?.grams || 0
              },
              carbs: {
                percentage: parsedData.macronutrients?.carbs?.percentage || 0,
                grams: parsedData.macronutrients?.carbs?.grams || 0
              },
              fats: {
                percentage: parsedData.macronutrients?.fats?.percentage || 0,
                grams: parsedData.macronutrients?.fats?.grams || 0
              }
            },
            keyNutrients: Array.isArray(parsedData.keyNutrients) ? parsedData.keyNutrients : [],
            mealPlan: Array.isArray(parsedData.mealPlan) ? parsedData.mealPlan : [],
            recommendations: Array.isArray(parsedData.recommendations) ? parsedData.recommendations : [],
            growthTrajectory: {
              currentStatus: parsedData.growthTrajectory?.currentStatus || "Growth data not available",
              projection: parsedData.growthTrajectory?.projection || "Projection data not available",
              recommendation: parsedData.growthTrajectory?.recommendation ||
                "Consult with a healthcare provider for personalized growth recommendations",
              estimatedAdultSize: {
                height: parsedData.growthTrajectory?.estimatedAdultSize?.height || "Not available",
                weight: parsedData.growthTrajectory?.estimatedAdultSize?.weight || "Not available"
              }
            }
          };

          console.log("Successfully parsed and validated nutrition data");
          return validatedData;
        } catch (err) {
          console.error("Failed to parse Gemini nutrition response:", err);
          console.error("Raw response:", cleanedText);
          return {};
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error("Request timed out after 30 seconds");
        } else {
          console.error("Fetch error:", fetchError);
        }
        return {};
      }
    } catch (error) {
      console.error("Error in nutritionDataFromAI:", error);
      return {};
    }
  };



  return (
    <div className="bg-gradient-to-b from-[#0a1122] to-[#162042] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8 flex space-x-4 sm:space-x-6">
          <button
            onClick={() => {
              // Get the stored child data from localStorage to ensure we have the complete data
              const storedChildData = localStorage.getItem('childData');
              if (storedChildData) {
                try {
                  const parsedChildData = JSON.parse(storedChildData);

                  // Navigate back to assessment results with the complete child data
                  // Add a flag to indicate we're returning from nutrition analysis

                  // Parse age string like "4 years, 2 months" or "1 year, 1 month"
                  let ageYears = 0;
                  let ageMonths = 0;
                  const ageMatch = parsedChildData.age?.match(/(\d+) years?, (\d+) months?/);
                  if (ageMatch) {
                    ageYears = parseInt(ageMatch[1], 10) || 0;
                    ageMonths = parseInt(ageMatch[2], 10) || 0;
                  }

                  // Parse height string like "102 cm"
                  let height = 0;
                  const heightMatch = parsedChildData.height?.match(/(\d+\.?\d*) cm/);
                  if (heightMatch) {
                    height = parseFloat(heightMatch[1]) || 0;
                  }

                  // Parse weight string like "16.5 kg"
                  let weight = 0;
                  const weightMatch = parsedChildData.weight?.match(/(\d+\.?\d*) kg/);
                  if (weightMatch) {
                    weight = parseFloat(weightMatch[1]) || 0;
                  }

                  navigate('/assessment-results', {
                    state: {
                      childInfo: {
                        name: parsedChildData.name,
                        ageYears: ageYears,
                        ageMonths: ageMonths,
                        gender: parsedChildData.gender === 'Male' ? 'M' : 'F',
                        height: height,
                        weight: weight,
                        photo: parsedChildData.photo
                      },
                      fromNutritionPage: true // Flag to indicate we're returning from nutrition page
                    }
                  });
                } catch (error) {
                  console.error("Error parsing stored child data:", error);
                  // Fallback to simple navigation if there's an error
                  navigate('/assessment-results');
                }
              } else {
                // Fallback to simple navigation if there's no stored data
                navigate('/assessment-results');
              }
            }}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-105 bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Assessment
          </button>
        </div>

        {/* Main Content */}
        <main>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
            Nutrition Analysis for {childData.name}
          </h1>

          {isLoading ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-purple-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-900 font-medium text-sm sm:text-base text-center">Analyzing nutritional needs and generating personalized recommendations...</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">This may take a few moments</p>

              <div className="mt-6 w-full max-w-md">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please Wait
                  </h3>
                  <p className="text-xs text-blue-700">
                    Our AI is analyzing {childData.name}'s data to create a personalized nutrition plan.
                    This includes calculating calorie needs, macronutrient distribution, and meal recommendations
                    based on age, gender, height, weight, and growth percentile.
                  </p>
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-xs">
                    <div className="mr-2 h-2 w-2 bg-purple-600 rounded-full animate-pulse"></div>
                    Processing AI Analysis
                  </div>
                </div>
              </div>
            </div>
          ) : hasError && !nutritionData ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center border border-red-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Unable to Generate Nutrition Analysis</h3>
              <p className="text-sm sm:text-base text-gray-900 text-center mb-4 sm:mb-6">We couldn't generate personalized nutrition recommendations at this time. Please try again later.</p>
              <button
                onClick={() => {
                  setHasError(false);
                  fetchNutritionAnalysis(childData);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : nutritionData ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Calorie and Macronutrient Card */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-blue-200 hover:shadow-xl transition-all duration-300 hover:border-blue-300 transform hover:-translate-y-1">
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
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-purple-200 hover:shadow-xl transition-all duration-300 hover:border-purple-300 transform hover:-translate-y-1">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Key Nutrients for Growth
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
                  {nutritionData.keyNutrients.map((nutrient, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 sm:p-5 rounded-lg border-l-4 border-purple-400 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <h3 className="font-semibold text-purple-800 mb-1 sm:mb-2 text-sm sm:text-base">{nutrient.name}</h3>
                      <p className="text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm">
                        <span className="font-medium">Daily need:</span> {nutrient.amount}
                      </p>
                      <div>
                        <p className="text-xs sm:text-sm text-purple-700 mb-1 sm:mb-2">Top food sources:</p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {nutrient.foods.map((food, foodIndex) => (
                            <span key={foodIndex} className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm text-gray-900 shadow-sm border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-300">
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
              <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-indigo-200 hover:shadow-xl transition-all duration-300 hover:border-indigo-300 transform hover:-translate-y-1">
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
                      <h3 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Current Status
                      </h3>
                      <div className="bg-white p-3 rounded-md shadow-sm border border-indigo-100 overflow-hidden hover:shadow-md transition-all duration-300">
                        <p className="text-gray-900 text-xs sm:text-sm break-words">
                          {nutritionData.growthTrajectory?.currentStatus || "Growth is within normal range. BMI is appropriate for age."}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Projection
                      </h3>
                      <div className="bg-white p-3 rounded-md shadow-sm border border-indigo-100 overflow-hidden hover:shadow-md transition-all duration-300">
                        <p className="text-gray-900 text-xs sm:text-sm break-words">
                          {nutritionData.growthTrajectory?.projection || "Maintain current growth pattern with balanced nutrition. Monitor height and weight at regular pediatric check-ups."}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-indigo-800 mb-2 text-sm sm:text-base flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Recommendation
                      </h3>
                      <div className="bg-white p-3 rounded-md shadow-sm border border-indigo-100 overflow-hidden hover:shadow-md transition-all duration-300">
                        <p className="text-gray-900 text-xs sm:text-sm break-words">
                          {nutritionData.growthTrajectory?.recommendation || "Continue providing nutrient-rich meals and adequate physical activity to support steady growth."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Growth Chart Visualization */}
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-indigo-100">
                    <h3 className="font-semibold text-indigo-800 mb-4 text-sm sm:text-base text-center flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Estimated Adult Size
                    </h3>

                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="relative w-full max-w-[160px] mx-auto py-2">
                        {/* Adult figure silhouette */}
                        <svg className="w-full h-auto" viewBox="0 0 100 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50 0C44.5 0 40 4.5 40 10C40 15.5 44.5 20 50 20C55.5 20 60 15.5 60 10C60 4.5 55.5 0 50 0Z" fill="#4F46E5" fillOpacity="0.2"/>
                          <path d="M65 30H35C35 30 30 70 30 120C30 145 35 170 35 170H45C45 170 45 200 45 220C45 240 50 250 50 250C50 250 55 240 55 220C55 200 55 170 55 170H65C65 170 70 145 70 120C70 70 65 30 65 30Z" fill="#4F46E5" fillOpacity="0.2"/>
                          <path d="M50 0C44.5 0 40 4.5 40 10C40 15.5 44.5 20 50 20C55.5 20 60 15.5 60 10C60 4.5 55.5 0 50 0Z" stroke="#4F46E5" strokeWidth="1"/>
                          <path d="M65 30H35C35 30 30 70 30 120C30 145 35 170 35 170H45C45 170 45 200 45 220C45 240 50 250 50 250C50 250 55 240 55 220C55 200 55 170 55 170H65C65 170 70 145 70 120C70 70 65 30 65 30Z" stroke="#4F46E5" strokeWidth="1"/>
                        </svg>
                      </div>

                      {/* Height and Weight indicators as cards below the figure */}
                      <div className="grid grid-cols-2 gap-4 w-full mt-3">
                        {/* Height indicator */}
                        <div className="bg-indigo-50 p-3 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-all duration-300">
                          <div className="text-xs text-indigo-800 font-medium text-center mb-2 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                            Height
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="h-4 w-1 bg-gradient-to-r from-indigo-300 to-indigo-400 rounded-full mr-2"></div>
                            <div className="text-sm text-indigo-900 font-medium">
                              {nutritionData.growthTrajectory?.estimatedAdultSize?.height || "170-175 cm"}
                            </div>
                          </div>
                        </div>

                        {/* Weight indicator */}
                        <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
                          <div className="text-xs text-blue-800 font-medium text-center mb-2 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                            Weight
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="h-4 w-1 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full mr-2"></div>
                            <div className="text-sm text-blue-900 font-medium">
                              {nutritionData.growthTrajectory?.estimatedAdultSize?.weight || "60-68 kg"}
                            </div>
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
                <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-indigo-100 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-semibold text-indigo-800 mb-4 text-sm sm:text-base text-center flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Current Growth Percentile
                  </h3>

                  <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden shadow-inner mb-10">
                    <div className="absolute inset-0 flex">
                      <div className="bg-gradient-to-r from-red-400 to-red-500" style={{ width: '3%' }}></div>
                      <div className="bg-gradient-to-r from-orange-400 to-orange-500" style={{ width: '12%' }}></div>
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: '35%' }}></div>
                      <div className="bg-gradient-to-r from-green-400 to-green-500" style={{ width: '35%' }}></div>
                      <div className="bg-gradient-to-r from-blue-400 to-blue-500" style={{ width: '15%' }}></div>
                    </div>

                    {/* Percentile marker */}
                    <div
                      className="absolute top-0 h-full w-5 bg-white border-2 border-indigo-600 rounded-full transform -translate-x-1/2 flex items-center justify-center shadow-md z-10 animate-pulse"
                      style={{ left: `${parseInt(String(childData.percentile).replace(/[^\d]/g, '')) || 45}%` }}
                    >
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>

                    {/* Percentile labels */}
                    <div className="absolute -bottom-7 left-0 right-0 flex justify-between text-xs text-gray-600 px-1">
                      <span className="bg-white px-1 rounded">0</span>
                      <span className="bg-white px-1 rounded">25</span>
                      <span className="bg-white px-1 rounded">50</span>
                      <span className="bg-white px-1 rounded">75</span>
                      <span className="bg-white px-1 rounded">100</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium shadow-sm">
                      {childData.percentile ? `${childData.percentile}${!childData.percentile.toString().endsWith('th') ? 'th' : ''}` : "45th"} Percentile
                    </span>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">Based on age, height, and weight measurements</p>
                  </div>
                </div>
              </div>

              <section className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8'>
              {/* Meal Plan Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-teal-200 hover:shadow-xl transition-all duration-300 hover:border-teal-300 transform hover:-translate-y-1">
                  <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Suggested Meal Plan
                  </h2>

                  <div className="space-y-3 sm:space-y-4">
                    {nutritionData.mealPlan.map((meal, index) => (
                      <div key={index} className="bg-gradient-to-r from-teal-50 to-teal-100 p-3 sm:p-5 rounded-lg border-l-4 border-teal-400 shadow-md hover:shadow-lg transition-all duration-300">
                        <h3 className="font-semibold text-teal-800 mb-2 sm:mb-3 text-sm sm:text-base">{meal.meal}</h3>
                        <ul className="space-y-1 sm:space-y-2">
                          {meal.options.map((option, optionIndex) => (
                            <li key={optionIndex} className="flex items-start">
                              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-900 text-xs sm:text-sm">{option}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations Card */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-7 card border border-blue-200 hover:shadow-xl transition-all duration-300 hover:border-blue-300 transform hover:-translate-y-1">
                  <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nutrition Recommendations
                  </h2>

                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <ul className="space-y-3 sm:space-y-4">
                      {nutritionData.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="text-gray-900 text-xs sm:text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-10 flex flex-col items-center justify-center border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 flex items-center justify-center bg-blue-50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-900 text-center text-sm sm:text-base font-medium">No nutrition data available. Please try again.</p>
              <button
                onClick={() => {
                  fetchNutritionAnalysis(childData);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Generate Nutrition Analysis
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center text-white fade-in-delay-3 bg-gradient-to-r from-blue-800 to-indigo-900 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-700">
          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg font-medium">Nutrition analysis for {childData.name} generated by StuntingAI</p>
            <p className="mt-1 sm:mt-2 text-blue-200 text-xs sm:text-sm">The information provided is for guidance only and should be reviewed by a healthcare professional.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
