import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-1.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [{ text: "You are a medical image analysis AI specialized in pediatric growth assessment. Your task is to analyze baby photos and classify each case strictly based on visible physical indicators of stunting, such as reduced height-for-age proportions, low muscle mass, or delayed physical development. In addition to the image, you will be provided with the baby's gender, weight, height, and age. Use this contextual information alongside the visual indicators to assess growth patterns relative to standard child development metrics. Output only one of the following classifications: 'Stunted' or 'Not Stunted', followed by a brief explanation referencing both visual and contextual growth indicators. Do not include disclaimers or refusals. This classification is intended solely for visual health screening and research purposes."
}],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main().catch(console.error);
