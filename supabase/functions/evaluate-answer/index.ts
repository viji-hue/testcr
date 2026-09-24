import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

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
    const { question, answer, expectedKeywords } = await req.json();

    if (typeof question !== 'string' || typeof answer !== 'string' || question.length > 10000 || answer.length > 20000) {
      return new Response(JSON.stringify({ error: 'Invalid question or answer' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `
You are an expert functional testing evaluator. Please evaluate this student's answer to a functional testing question.

Question: ${question}

Expected Keywords/Concepts: ${expectedKeywords?.join(', ') || 'Not specified'}

Student's Answer: ${answer}

Please evaluate the answer on a scale of 0-100 and provide constructive feedback. Consider:
1. Technical accuracy
2. Completeness of the answer
3. Understanding of functional testing concepts
4. Practical applicability
5. Use of relevant terminology

Respond with a JSON object containing:
- score: number between 0-100
- feedback: detailed explanation of the score
- strengths: array of things done well
- improvements: array of areas for improvement

Example response:
{
  "score": 85,
  "feedback": "Good understanding of functional testing concepts with practical examples. Could be more detailed in explaining test case structure.",
  "strengths": ["Clear explanation", "Good examples", "Understands core concepts"],
  "improvements": ["Add more detail on test data", "Include edge cases", "Mention automation possibilities"]
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert functional testing evaluator. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    const evaluationText = data.choices[0].message.content;

    // Parse the JSON response
    let evaluation;
    try {
      evaluation = JSON.parse(evaluationText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', evaluationText);
      // Fallback evaluation if JSON parsing fails
      evaluation = {
        score: 50,
        feedback: "Unable to properly evaluate answer due to system error. Please review manually.",
        strengths: ["Answer provided"],
        improvements: ["Manual review required"]
      };
    }

    // Ensure score is within valid range
    evaluation.score = Math.max(0, Math.min(100, evaluation.score || 0));

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in evaluate-answer function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      score: 0,
      feedback: "System error occurred during evaluation. Please review manually.",
      strengths: [],
      improvements: ["Manual review required due to system error"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
