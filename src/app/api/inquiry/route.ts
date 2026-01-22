import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

interface InquiryRequest {
  question: string;
  context?: {
    hotspot?: {
      name: string;
      description: string;
      type: string;
      tier: string;
      countries: string[];
      parties?: string[];
      status?: string;
    };
    country?: {
      code: string;
      name: string;
      region: string;
      capital: string;
      government?: string;
    };
  };
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

const SYSTEM_PROMPT = `You are an expert geopolitical analyst and intelligence briefer for a global situation monitoring dashboard. Your role is to provide:

1. **Accurate, factual information** about global events, conflicts, countries, and geopolitical dynamics
2. **Historical context** - explain the roots and evolution of situations
3. **Key players analysis** - identify the main actors, their motivations, and relationships
4. **Nuanced perspectives** - present multiple viewpoints without political bias
5. **Implications and outlook** - what developments might occur and why

Guidelines:
- Be concise but thorough. Use bullet points for clarity when helpful.
- If discussing active conflicts, acknowledge humanitarian impacts
- When uncertain, say so rather than speculate
- Avoid sensationalism - stick to facts and reasoned analysis
- Reference relevant recent developments when applicable
- For country-specific questions, consider regional context

Your knowledge cutoff is early 2025, but you should note when information might have evolved since then.

Format your responses in clear, readable paragraphs with headers where appropriate. Use markdown sparingly (headers, bold for emphasis, bullet points).`;

export async function POST(request: NextRequest) {
  try {
    const body: InquiryRequest = await request.json();
    const { question, context, history } = body;

    if (!question?.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a helpful mock response if no API key
      return NextResponse.json({
        answer: getMockResponse(question, context)
      });
    }

    // Build context-aware prompt
    let contextPrompt = '';

    if (context?.hotspot) {
      contextPrompt = `\n\nCurrent context - The user is viewing the "${context.hotspot.name}" situation:
- Type: ${context.hotspot.type}
- Risk Level: ${context.hotspot.tier}
- Countries involved: ${context.hotspot.countries.join(', ')}
- Status: ${context.hotspot.status || 'Ongoing'}
${context.hotspot.parties ? `- Key parties: ${context.hotspot.parties.join(', ')}` : ''}
- Description: ${context.hotspot.description}

Consider this context when answering, but don't limit yourself to it if the question is broader.`;
    } else if (context?.country) {
      contextPrompt = `\n\nCurrent context - The user is viewing ${context.country.name}:
- Region: ${context.country.region}
- Capital: ${context.country.capital}
${context.country.government ? `- Government: ${context.country.government}` : ''}

Consider this context when answering, but don't limit yourself to it if the question is broader.`;
    }

    // Build message history
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    if (history && history.length > 0) {
      for (const msg of history) {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // Add current question with context
    messages.push({
      role: 'user',
      content: question + contextPrompt
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages
    });

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text');
    const answer = textContent?.type === 'text' ? textContent.text : 'Unable to generate response.';

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Inquiry API error:', error);

    // Return mock response on error
    return NextResponse.json({
      answer: 'I apologize, but I\'m currently unable to process your question. This could be due to a temporary issue with the AI service. Please try again in a moment.'
    });
  }
}

// Mock response for when API key is not available
function getMockResponse(question: string, context?: InquiryRequest['context']): string {
  const lowerQuestion = question.toLowerCase();

  if (context?.hotspot) {
    return `## ${context.hotspot.name}

This is a ${context.hotspot.type} situation currently classified as ${context.hotspot.tier} risk.

**Overview:**
${context.hotspot.description}

**Key Points:**
- Involves: ${context.hotspot.countries.join(', ')}
${context.hotspot.parties ? `- Main parties: ${context.hotspot.parties.join(', ')}` : ''}
- Current status: ${context.hotspot.status || 'Ongoing'}

**Note:** To get real-time AI-powered analysis, please configure your ANTHROPIC_API_KEY in the environment variables.`;
  }

  if (context?.country) {
    return `## ${context.country.name}

**Country Profile:**
- Region: ${context.country.region}
- Capital: ${context.country.capital}
${context.country.government ? `- Government: ${context.country.government}` : ''}

This country profile provides basic information. For detailed geopolitical analysis, policy insights, and current events context, please configure your ANTHROPIC_API_KEY in the environment variables.`;
  }

  // Generic response
  if (lowerQuestion.includes('conflict') || lowerQuestion.includes('war')) {
    return `**Global Conflict Analysis**

Current major conflict zones include:
- **Ukraine**: Ongoing conflict with Russia since 2022
- **Gaza**: Active military operations and humanitarian crisis
- **Sudan**: Civil war causing significant displacement
- **Yemen**: Long-running conflict with humanitarian implications

For detailed, real-time analysis powered by AI, please configure your ANTHROPIC_API_KEY in the environment variables.`;
  }

  return `Thank you for your question about: "${question}"

To provide comprehensive, AI-powered analysis on global situations, conflicts, and geopolitical dynamics, please configure your ANTHROPIC_API_KEY in the environment variables.

In the meantime, you can:
1. Click on map hotspots to see detailed situation data
2. Click on countries to view their profiles and related news
3. Browse the live news feed for current events

The dashboard provides real-time news and predefined situation data even without AI integration.`;
}
