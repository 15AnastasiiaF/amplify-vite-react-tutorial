import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource"
import { env } from '$amplify/env/say-hello'; 
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY, 
});

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
    // arguments typed from `.arguments()`
    const { name } = event.arguments

    console.log(`Environment variable NAME: ${env.NAME}`);
    console.log("Environment variable NAME:", env.OPENAI_API_KEY);

    const prompt = `Generate a greeting for ${name}`;
    const response = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [{ role: "user", content: prompt }],
    });
    console.log("OpenAI response:", response.choices[0].message.content?.trim());  

    return response.choices[0].message.content?.trim() || '';

    // return typed from `.returns()`
    return `Hello, ${name}!`
  }