export async function getAIRecommendation(userPrompt, products) {
    const API_KEY = process.env.GEMINI_API_KEY;

    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        const geminiPrompt = `
Here is a list of available products:
${JSON.stringify(products, null, 2)}

Based on the following user request:
"${userPrompt}"

Return only matching products in valid JSON array format.

Example:
[
  {
    "id": "123",
    "name": "Samsung S23 Ultra"
  }
]

Do not return explanations.
Do not return markdown.
Return only raw JSON.
`;

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: geminiPrompt,
                            },
                        ],
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `Gemini API Error (${response.status}): ${
                    data?.error?.message || "Unknown Error"
                }`
            );
        }

        const aiResponseText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const cleanedText = aiResponseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        if (!cleanedText) {
            throw new Error("AI response is empty");
        }

        const parsedProducts = JSON.parse(cleanedText);

        return {
            success: true,
            products: parsedProducts,
        };
    } catch (error) {
        return {
            success: false,
            products: [],
        };
    }
}