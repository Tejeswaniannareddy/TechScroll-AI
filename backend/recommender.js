function cleanString(input, fallback) {

    if (typeof input === "string") {
        return input.trim();
    }

    return fallback;
}


function cleanArray(input) {

    if (!Array.isArray(input)) {
        return [];
    }

    return input
        .filter(
            item =>
                typeof item === "string"
        )
        .map(
            item => item.trim()
        )
        .filter(Boolean)
        .slice(0, 10);
}


function cleanScores(input) {

    if (
        !input ||
        typeof input !== "object" ||
        Array.isArray(input)
    ) {

        return {};

    }


    const scores = {};


    for (
        const scoreName of Object.keys(input)
    ) {

        const scoreNumber =
            Number(
                input[scoreName]
            );


        if (
            Number.isFinite(
                scoreNumber
            )
        ) {

            scores[scoreName] =
                Math.max(
                    0,
                    Math.min(
                        100,
                        scoreNumber
                    )
                );

        }

    }


    return scores;
}


function normalizeResult(raw) {

    if (
        !raw ||
        typeof raw !== "object"
    ) {

        raw = {};

    }


    const categories = [
        "AI",
        "DSA",
        "Java",
        "HLD",
        "Cybersecurity",
        "Cloud",
        "Hardware",
        "Career",
        "Other"
    ];


    const difficulties = [
        "Beginner",
        "Intermediate",
        "Advanced"
    ];


    const confidenceLevels = [
        "High",
        "Medium",
        "Low"
    ];


    const category =
        categories.includes(
            raw.category
        )
            ? raw.category
            : "Other";


    const difficulty =
        difficulties.includes(
            raw.difficulty
        )
            ? raw.difficulty
            : "Intermediate";


    const confidence =
        confidenceLevels.includes(
            raw.confidence
        )
            ? raw.confidence
            : "Medium";


    let hypeRisk =
        Number(
            raw.hypeRisk
        );


    if (
        !Number.isFinite(
            hypeRisk
        )
    ) {

        hypeRisk = 0;

    }


    hypeRisk =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    hypeRisk
                )
            )
        );


    return {

        interestDetected:
            cleanString(
                raw.interestDetected,
                "Software Engineering"
            ),

        why:
            cleanString(
                raw.why,
                "The interaction history indicates a broader technology interest."
            ),

        recommendedTechReel:
            cleanString(
                raw.recommendedTechReel,
                "System Design: Build a URL Shortener"
            ),

        category,

        whyRecommendation:
            cleanString(
                raw.whyRecommendation,
                "This recommendation connects to the broader detected interest."
            ),

        difficulty,

        confidence,

        hypeRisk,

        qualityReason:
            cleanString(
                raw.qualityReason,
                "The recommendation prioritizes useful technical learning."
            ),

        evidence:
            cleanArray(
                raw.evidence
            ),

        interestScores:
            cleanScores(
                raw.interestScores
            )

    };
}


function buildPrompt(reels) {

    return `
You are TechScroll AI.

Analyze a student's COMPLETE short-form Reel
interaction history.

Your goal is to infer their underlying technology
interest and recommend ONE useful technology Reel.

Do NOT use shallow keyword matching.

Analyze:

- semantic meaning
- context
- relationships between topics
- watch percentage
- likes
- saves
- repeated themes
- career signals
- technical depth
- content quality

BUILT-IN TRAP:

If the student watches:

1. Java programming meme
2. Software engineer lifestyle
3. Coding interview joke
4. Laptop comparison

DO NOT recommend another generic Java Reel.

Infer a broader interest such as:

Software Engineering

Then recommend something useful such as:

System Design: Build a URL Shortener

Avoid hype content such as:

"10 AI tools that will get you a job."

Prefer technically useful, educational and
career-relevant content.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "interestDetected": "",
  "why": "",
  "recommendedTechReel": "",
  "category": "",
  "whyRecommendation": "",
  "difficulty": "",
  "confidence": "",
  "hypeRisk": 0,
  "qualityReason": "",
  "evidence": [],
  "interestScores": {}
}

Allowed categories:

AI
DSA
Java
HLD
Cybersecurity
Cloud
Hardware
Career
Other

Allowed difficulty:

Beginner
Intermediate
Advanced

Allowed confidence:

High
Medium
Low

Hype risk:
0 means low hype.
100 means extremely hype-driven.

Interest scores:
Use 0-100.

REEL HISTORY:

${JSON.stringify(
    reels,
    null,
    2
)}

Important:

Consider the COMPLETE interaction history,
not just the current Reel.

A meme may reveal domain affinity without
meaning the student wants more memes.

A saved Reel is a stronger signal than a
casual view.

High watch percentage is a positive signal.

Recommend educational content that remains
engaging as short-form content.
`;
}


export async function getRecommendation(
    reels,
    apiKey
) {

    if (!apiKey) {

        throw new Error(
            "GEMINI_API_KEY is missing."
        );

    }


    if (
        !Array.isArray(reels) ||
        reels.length === 0
    ) {

        throw new Error(
            "No Reel history was provided."
        );

    }


    console.log(
        "Preparing Gemini REST request..."
    );


    const prompt =
        buildPrompt(
            reels
        );


    const model =
        "gemini-3.6-flash";


    const endpoint =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;


    const response =
        await fetch(
            endpoint,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        contents: [
                            {
                                parts: [
                                    {
                                        text:
                                            prompt
                                    }
                                ]
                            }
                        ],

                        generationConfig: {

                            temperature:
                                0.2,

                            responseMimeType:
                                "application/json"

                        }

                    })

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        console.error(
            "Gemini API response:",
            JSON.stringify(
                data
            )
        );


        throw new Error(
            data?.error?.message ||
            `Gemini API failed with HTTP ${response.status}`
        );

    }


    const text =
        data
            ?.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text;


    if (!text) {

        throw new Error(
            "Gemini returned an empty response."
        );

    }


    let parsed;


    try {

        parsed =
            JSON.parse(
                text
            );

    } catch {

        console.error(
            "Gemini raw response:",
            text
        );


        throw new Error(
            "Gemini returned invalid JSON."
        );

    }


    return normalizeResult(
        parsed
    );
}