import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Uses Gemini to generate a slogan or enhance the banner content.
 */
export const generateCreativeSlogan = async (imageBase64: string): Promise<string> => {
  try {
    const ai = getGeminiClient();
    
    // Remove header if present (e.g., "data:image/png;base64,")
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: 'image/jpeg', // Assuming jpeg/png, API detects mostly
                    data: base64Data
                }
            },
            {
                text: "Analyze this image (likely a logo). Generate a short, cool, geeky 1-line text slogan suitable for a Spring Boot console startup banner. Format it as plain text. Do not include quotes."
            }
        ]
      },
      config: {
          maxOutputTokens: 50,
          temperature: 0.9,
      }
    });

    return response.text?.trim() || "Spring Boot is awesome!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "";
  }
};

/**
 * Uses Gemini to attempt a creative ASCII art generation from Image (Experimental).
 */
export const generateAiAscii = async (imageBase64: string): Promise<string> => {
    try {
        const ai = getGeminiClient();
        const base64Data = imageBase64.split(',')[1] || imageBase64;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Data
                        }
                    },
                    {
                        text: "Convert this image into a simple ASCII art representation suitable for a 'banner.txt' file. Keep the width strictly under 60 characters. Use simple block characters. Do not use markdown code blocks in the output, just the raw text."
                    }
                ]
            }
        });

        // Strip markdown if Gemini ignores instructions
        let text = response.text || "";
        text = text.replace(/```/g, '');
        return text;

    } catch (error) {
        console.error("Gemini AI ASCII Error:", error);
        throw error;
    }
}

/**
 * Uses Gemini to generate styled ASCII text (FIGlet style).
 */
export const generateAsciiFromText = async (text: string, style: string): Promise<string> => {
  try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
              parts: [
                  {
                      text: `Generate an ASCII art banner (FIGlet style) for the text "${text}".
                      Style: ${style}.
                      Requirements:
                      - Max width: 80 characters.
                      - Use plain ASCII characters.
                      - Do NOT use markdown code blocks (no \`\`\`).
                      - The output must be raw text suitable for a Spring Boot banner.txt file.
                      - Only return the art, no conversational text.`
                  }
              ]
          },
          config: {
            temperature: 0.6, // Lower temperature for more consistent font structure
          }
      });

      let result = response.text || "";
      return result.replace(/```/g, ''); // Cleanup just in case
  } catch (error) {
      console.error("Gemini Text to ASCII Error:", error);
      throw error;
  }
}