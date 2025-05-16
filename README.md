**APAC Solution Challenge May 2025**

Theme: [Healthcare]

Requirement: Using Gemini / Gemma

Team: Banana [BINUS International, Jakarta]

* William
* Kenny
* Tiffany
* Michael

# Project Overview

## Stunting AI

*Monitor and prevent child stunting with AI technology*

### Problem statement

Child stunting due to malnutrition leads to long-term physical and cognitive issues. Diagnosis is often delayed due to lack of accessible tools. Prevent the growth stunting of a baby due to malnutrition by scanning whether a baby is stunted or not.

### Solution summary

A fast-deploy, AI-assisted screening tool that helps caregivers or health workers input basic data and get an instant risk evaluation using Gemini/Gemma.

# Tech Stack

Web app.

* Frontend: **React + Vite**
* Styling: **Vanilla CSS**
* Linting: **ESLint**
* Deployment: **Vercel**
* AI: **Gemini API wrapper**

# Features / Functionality

* Easy navigation
* Phone compatibility

# Usage Instructions (Live)

1. Go to [https://stunting-ai.vercel.app/](https://stunting-ai.vercel.app/ "Go to website")
2. Click "Get Started"
3. Fill out the form
4. Click "Continue to Assessment" and get results

# Local setup

```
git clone https://github.com/yourusername/stunting-ai.git
cd stunting-ai
npm install
```

Create a `.env` file:

```
VITE_GEMINI_API_KEY=your_key_here
```

Run the app locally:

```
npm run dev
```

# Demos
<table>
  <tr>
    <th>
      <source media="(prefers-color-scheme: dark)" srcset="documentation/Image1_HomeScreen.jpg">
      <source media="(prefers-color-scheme: light)" srcset="documentation/Image1_HomeScreen.jpg">
      <img src="documentation/Image1_HomeScreen.jpg"> 
    </th>
    <th>
      <source media="(prefers-color-scheme: dark)" srcset="documentation/Image2_Form.jpg">
      <source media="(prefers-color-scheme: light)" srcset="documentation/Image2_Form.jpg">
      <img src="documentation/Image2_Form.jpg"> 
    </th>
    <th>
      <source media="(prefers-color-scheme: dark)" srcset="documentation/Image3_Results.jpg">
      <source media="(prefers-color-scheme: light)" srcset="documentation/Image3_Results.jpg">
      <img src="documentation/Image3_Results.jpg"> 
    </th>
  </tr>
</table>

# Limitations

* No database - it's all stateless
* Gemini output depends heavily on form quality
* Not a substitute for real medical evaluation

# Future Upgrades

* Add image-based height/weight input
* Save past assessments via login
* Link to medical databases / WHO child growth standards
* Multilingual support for broader reach

# License & Attribution

* MIT License
* AI via Gemini API
* Canva
### Picture references:
* Food picture - https://www.pregnancy.com.au/3-easy-baby-food-recipes-you-can-make-at-home/
* Taller and shorter person - https://cdn.prod.website-files.com/5ee7039040ea6efb80d7521c/5fd999586cf6d03d6bbc39e3_Of-Ages-and-Stages-1400x700.jpg
* Not stunted baby - https://www.thebump.com/a/baby-milestones
* Stunted baby - https://www.adelaidenow.com.au/lifestyle/health/generations-of-stunted-babies-tragedy-of-malnourished-children-in-syria-and-around-the-world/news-story/8f1ba403832f82ce42d0956a0c371644

