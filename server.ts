import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Re-use API Key securely
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // 1. Analyze Startup Idea - Structured JSON Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { idea, brutalMode, personalityType, userProfile } = req.body;

      if (!idea || typeof idea !== 'string') {
        res.status(400).json({ error: "Idea description is required and must be a string." });
        return;
      }

      console.log(`Rating startup idea: "${idea.substring(0, 50)}..." [Brutal Mode: ${brutalMode}, Mentor: ${personalityType}]`);

      const systemInstruction = `You are an elite Silicon Valley startup evaluator, a blend of a top-tier Y-Combinator senior partner, an experienced incubator director, a brutally honest and sharp business mentor, and a viral Product Hunt analyst.
Your task is to analyze the user's startup idea in plain English.
You must construct and return a detailed, realistic JSON assessment matching the required schema.

The user's role: ${userProfile?.role || 'Builder'} with background: ${userProfile?.background || 'None specified'}. Customise any advice to match their skills/background!

Depending on whether 'brutalMode' is true, your feedback should adapt:
- If 'brutalMode' is FALSE: Provide a realistic, critical, highly professional, direct evaluation that is extremely constructive.
- If 'brutalMode' is TRUE (Brutal Honesty / Roast Mode): Provide a savage, painfully realistic, direct roast, pointing out all fundamental flaws, oversaturated assumptions, or "fake AI wrapper" ideas, while still providing high-quality strategic guidance underneath. Keep the roast extremely witty, sharp, and realistic (avoid generic insults, use business-savvy savagery like "Congratulations, you built an Excel sheet with some API wrappers that costs $20/month to run and has zero moat").

Your assessment must contain:
1. 'scores': Object with scores from 1 to 100 on originality, practicality, viability, market timing, customer pain level, competition saturation, scalability, survival chances (expected 1 & 5 year average survival probability), profitability probability, viral potential, execution difficulty, and AI replacement risk.
2. 'roast': Object with:
  - 'brutalRoast': A 2-3 sentence extremely clear, witty, and memorable roast or direct reality-check.
  - 'fundamentalFlaws': Array of 3-5 major flaws or critical market realities that this idea ignores.
3. 'market': Object with TAM estimation, target audience, trend status ('rising', 'stable', 'declining', 'hyped'), category, acquisition difficulty.
4. 'competitors': Array of 3 or 4 top competitors (real or typical category giants/startups), their strength, weakness, pricingModel, and survivalRiskFactor (how severe is the threat for the user).
5. 'monetization': Array of 2-3 different pricing or monetization strategies custom tailored to this idea (e.g. B2B SaaS, usage tiers, freemium, platform fees).
6. 'execution': Object with dynamic 3-phase custom roadmap, mvpFeatures list, suggestedTechStack, and key hiring roles.
7. 'investor': Object with reaction, VC interest probability (0-100), bootstrap friendliness (0-100), fundraising difficulty.

The response MUST be a valid JSON object matching the schema exactly. Return ONLY raw JSON, with no other text.`;

      const prompt = `Startup Idea to Evaluate: "${idea}"\nRequested evaluation style: ${personalityType} (Brutal Honesty Mode is ${brutalMode ? 'ON' : 'OFF'}).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scores: {
                type: Type.OBJECT,
                properties: {
                  overallScore: { type: Type.INTEGER },
                  originality: { type: Type.INTEGER },
                  practicality: { type: Type.INTEGER },
                  viability: { type: Type.INTEGER },
                  marketTiming: { type: Type.INTEGER },
                  painLevel: { type: Type.INTEGER },
                  competitionSaturation: { type: Type.INTEGER },
                  scalability: { type: Type.INTEGER },
                  survivalChances: { type: Type.INTEGER },
                  profitabilityProbability: { type: Type.INTEGER },
                  viralPotential: { type: Type.INTEGER },
                  executionDifficulty: { type: Type.INTEGER },
                  aiReplacementRisk: { type: Type.INTEGER },
                },
                required: [
                  "overallScore", "originality", "practicality", "viability", "marketTiming",
                  "painLevel", "competitionSaturation", "scalability", "survivalChances",
                  "profitabilityProbability", "viralPotential", "executionDifficulty", "aiReplacementRisk"
                ]
              },
              roast: {
                type: Type.OBJECT,
                properties: {
                  brutalRoast: { type: Type.STRING },
                  fundamentalFlaws: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["brutalRoast", "fundamentalFlaws"]
              },
              market: {
                type: Type.OBJECT,
                properties: {
                  estimatedTam: { type: Type.STRING },
                  trendingStatus: { type: Type.STRING }, // 'rising' | 'stable' | 'declining' | 'hyped'
                  targetAudience: { type: Type.STRING },
                  category: { type: Type.STRING },
                  customerAcquisitionDifficulty: { type: Type.STRING } // 'easy' | 'medium' | 'hard' | 'extreme'
                },
                required: ["estimatedTam", "trendingStatus", "targetAudience", "category", "customerAcquisitionDifficulty"]
              },
              competitors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    strength: { type: Type.STRING },
                    weakness: { type: Type.STRING },
                    pricingModel: { type: Type.STRING },
                    survivalRiskFactor: { type: Type.STRING }
                  },
                  required: ["name", "strength", "weakness", "pricingModel", "survivalRiskFactor"]
                }
              },
              monetization: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    strategy: { type: Type.STRING },
                    tierName: { type: Type.STRING },
                    suggestedPricing: { type: Type.STRING },
                    pros: { type: Type.STRING },
                    cons: { type: Type.STRING }
                  },
                  required: ["strategy", "tierName", "suggestedPricing", "pros", "cons"]
                }
              },
              execution: {
                type: Type.OBJECT,
                properties: {
                  mvpFeatures: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  roadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        phase: { type: Type.STRING },
                        timeline: { type: Type.STRING },
                        objectives: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      },
                      required: ["phase", "timeline", "objectives"]
                    }
                  },
                  suggestedTechStack: {
                    type: Type.OBJECT,
                    properties: {
                      frontend: { type: Type.STRING },
                      backend: { type: Type.STRING },
                      database: { type: Type.STRING },
                      hosting: { type: Type.STRING }
                    },
                    required: ["frontend", "backend", "database", "hosting"]
                  },
                  keyHires: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["mvpFeatures", "roadmap", "suggestedTechStack", "keyHires"]
              },
              investor: {
                type: Type.OBJECT,
                properties: {
                  reaction: { type: Type.STRING },
                  vcInterestProbability: { type: Type.INTEGER },
                  bootstrapFriendliness: { type: Type.INTEGER },
                  fundraisingDifficulty: { type: Type.STRING } // 'low' | 'moderate' | 'high' | 'prohibitive'
                },
                required: ["reaction", "vcInterestProbability", "bootstrapFriendliness", "fundraisingDifficulty"]
              }
            },
            required: ["scores", "roast", "market", "competitors", "monetization", "execution", "investor"]
          }
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const parsedData = JSON.parse(text.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Analysis api error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze startup idea. Please verify your GEMINI_API_KEY in the Secrets tab." });
    }
  });

  // 2. Stream Savage Chat - Server-Sent Events (SSE) streaming endpoint
  app.get("/api/savage-chat-stream", async (req, res) => {
    const { idea, brutalMode, personalityType, message } = req.query;

    if (!idea || typeof idea !== 'string') {
      res.status(400).send("Idea query is required");
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      console.log(`Starting real-time evaluation chat stream for idea: "${idea.substring(0, 30)}..."`);
      
      const isBrutal = brutalMode === "true";
      const pType = personalityType || "Cynical VC";

      const systemInstruction = `You are roleplaying as a highly customized Silicon Valley incubator reviewer named: ${pType}.
Your tone is distinct:
- If 'personalityType' is 'Cynical VC': You've seen 10,000 SaaS pitches and read Peter Thiel's 'Zero to One' five times. You think everything is a copy of something else and want to know why this isn't just an Excel sheet. Witty, tired, sharp.
- If 'personalityType' is 'Silicon Valley Guru': Speak heavily in buzzwords (disrupt, synergetic web3, AI agents, high agency, leverage, sovereign individual). Extremely energetic but secretly vaporous.
- If 'personalityType' is 'Pragmatic Hacker': Cut immediately to the tech and acquisition code. "How do you get your first 10 clients without paid ads? Can one guy build it in two weekends?"

Always respect 'Brutal Roast Mode' is ${isBrutal ? 'ON' : 'OFF'}. If ON, be exceptionally sharp and witty, throwing a savage but business-literate roast of this idea! If OFF, be a highly critical but constructive mentor.

The user has asked you: "${message || 'Let\'s talk about my idea. Roast or review it for me live.'}" in reference to their startup idea: "${idea}".

Provide a quick, highly interactive, conversational answer that streams back directly. Keep it to 150 words max. Speak directly, do not format in verbose headings.`;

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: `Startup idea: "${idea}"\nQuestion/Prompt: "${message || 'How can I make this succeed?'}"`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 1.0,
        }
      });

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          // Format text safe for SSE
          const data = JSON.stringify({ text });
          res.write(`data: ${data}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("SSE stream error:", error);
      const errData = JSON.stringify({ error: error.message || "Failed to establish stream helper" });
      res.write(`data: ${errData}\n\n`);
      res.end();
    }
  });

  // Handle client asset fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched and ready on http://localhost:${PORT}`);
  });
}

startServer();
