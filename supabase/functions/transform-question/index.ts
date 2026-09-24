import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? 'http://localhost:8080';
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, difficulty, type } = await req.json();

    if (!question || !['medium', 'hard'].includes(difficulty) || !['code', 'multiple-choice', 'text-input'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid transformation request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    let systemPrompt = '';
    
    if (difficulty === 'medium') {
      if (type === 'code') {
        systemPrompt = `You are an expert at creating engaging real-world scenario-based coding questions.
Convert the given coding challenge into a realistic workplace or everyday scenario that requires the same solution.

Create a compelling story where a developer or professional needs to solve this exact problem.
Include context about WHY they need this function and WHO is asking for it.

IMPORTANT: Return ONLY a JSON object with this exact structure:
{
  "scenario": "A 2-3 sentence story setting up the real-world context (e.g., 'You work at an e-commerce company. Your manager asks you to...')",
  "instructions": "The same technical instructions but with story context woven in",
  "title": "A descriptive title that reflects the scenario (e.g., 'Sales Revenue Calculator')"
}

Examples:
- Array sum → "Calculate total daily sales for a store manager"
- String manipulation → "Format customer names for email system"
- Data filtering → "Filter valid orders for shipping department"

Do not include any markdown, code blocks, or additional text.`;
      } else {
        systemPrompt = `You are an expert at creating engaging scenario-based questions. 
Convert the given straightforward question into a story-based scenario that tests the same concept.
The scenario should be realistic, relatable, and engaging while maintaining the same difficulty level.
Include a brief context/scenario (2-3 sentences) followed by the question.

IMPORTANT: Return ONLY a JSON object with this exact structure:
{
  "scenario": "the scenario/story context here",
  "question": "the rephrased question here",
  "options": ["option1", "option2", "option3", "option4"] (only for multiple choice)
}

Do not include any markdown, code blocks, or additional text.`;
      }
    } else if (difficulty === 'hard') {
      systemPrompt = `You are an expert at creating advanced challenging questions.
Transform the given question into a more complex version that:
1. Tests deeper understanding and edge cases
2. Adds constraints or time complexity considerations
3. Requires multi-step reasoning
4. Tests practical application in complex scenarios

IMPORTANT: Return ONLY a JSON object with this exact structure:
{
  "scenario": "the enhanced scenario with constraints here",
  "question": "the more challenging question here",
  "options": ["option1", "option2", "option3", "option4"] (only for multiple choice),
  "additionalConstraints": "any time limits or special conditions"
}

Do not include any markdown, code blocks, or additional text.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Original Question:\n${JSON.stringify(question)}\n\nQuestion Type: ${type}\n\nTransform this into ${difficulty} difficulty format.` 
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const transformedContent = data.choices[0].message.content;
    
    // Parse the JSON response
    let transformedQuestion;
    try {
      // Remove markdown code blocks if present
      const cleanContent = transformedContent.replace(/```json\n?|\n?```/g, '').trim();
      transformedQuestion = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', transformedContent);
      console.error('Parse error:', parseError);
      throw new Error('Invalid response format from AI');
    }

    return new Response(
      JSON.stringify({ transformedQuestion }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in transform-question function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
