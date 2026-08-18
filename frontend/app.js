const API_URL = "https://techscroll-ai.onrender.com";

console.log("TechScroll API:", API_URL);

const reels = [
    {
        title: "Java Developer Meme",
        description:
            "When your Java code works on the first try.",
        transcript:
            "Every software engineer knows this feeling.",
        category: "Programming",
        watchPercentage: 94,
        liked: true,
        saved: false
    },

    {
        title: "Software Engineer Lifestyle",
        description:
            "A day in the life of a backend engineer.",
        transcript:
            "Working with APIs, databases, debugging and deploying services.",
        category: "Career",
        watchPercentage: 91,
        liked: true,
        saved: true
    },

    {
        title: "Coding Interview Joke",
        description:
            "When the interviewer asks about binary trees.",
        transcript:
            "Every developer has experienced a difficult coding interview.",
        category: "DSA",
        watchPercentage: 88,
        liked: true,
        saved: false
    },

    {
        title: "Laptop Comparison",
        description:
            "Comparing CPU, GPU, RAM and SSD performance.",
        transcript:
            "Which laptop should a computer science student buy?",
        category: "Hardware",
        watchPercentage: 83,
        liked: true,
        saved: false
    },

    {
        title: "React vs JavaScript",
        description:
            "Understanding modern frontend development.",
        transcript:
            "Component architecture and JavaScript fundamentals.",
        category: "Programming",
        watchPercentage: 86,
        liked: true,
        saved: true
    },

    {
        title: "AI Coding Agents Explained",
        description:
            "How AI agents can write and test code.",
        transcript:
            "AI agents can reason about tasks and interact with tools.",
        category: "AI",
        watchPercentage: 96,
        liked: true,
        saved: true
    },

    {
        title: "10 AI Tools That Will Get You A Job",
        description:
            "These AI tools guarantee your next software job!",
        transcript:
            "Use these tools and companies will hire you immediately!",
        category: "Hype",
        watchPercentage: 72,
        liked: false,
        saved: false
    },

    {
        title: "System Design Meme",
        description:
            "When your interviewer asks you to design YouTube.",
        transcript:
            "Scaling databases and distributed systems is difficult.",
        category: "HLD",
        watchPercentage: 89,
        liked: true,
        saved: true
    }
];


const icons = [
    "⌘",
    "⚡",
    "◇",
    "▣",
    "◈",
    "✦",
    "!",
    "◎"
];


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function renderReels() {

    const container =
        document.getElementById("reels");

    if (!container) {

        console.error(
            "ERROR: #reels element was not found."
        );

        return;
    }


    container.innerHTML =
        reels.map(
            (reel, index) => `

                <div class="reel">

                    <div class="thumb">
                        ${icons[index]}
                    </div>

                    <div class="reel-content">

                        <h4>
                            ${escapeHTML(reel.title)}
                        </h4>

                        <p>
                            ${escapeHTML(
                                reel.description
                            )}
                        </p>

                        <div class="meta">

                            ${escapeHTML(
                                reel.category
                            )}

                            ·

                            ${reel.watchPercentage}%
                            watched

                            ${
                                reel.liked
                                    ? " · ♥ liked"
                                    : ""
                            }

                            ${
                                reel.saved
                                    ? " · ★ saved"
                                    : ""
                            }

                        </div>

                    </div>

                </div>

            `
        ).join("");
}


function showLoading() {

    const result =
        document.getElementById("result");

    if (!result) return;

    result.innerHTML = `

        <div class="waiting">

            <div class="waiting-icon">
                ✦
            </div>

            <h3>
                AI is analyzing...
            </h3>

            <p>
                Understanding topics, context,
                behavior and hidden interests.
            </p>

        </div>

    `;
}


function showError(message) {

    const result =
        document.getElementById("result");

    if (!result) return;

    result.innerHTML = `

        <div class="waiting">

            <div class="waiting-icon">
                !
            </div>

            <h3>
                Analysis failed
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;
}


function renderResult(result) {

    const interest =
        result.interestDetected ||
        "Software Engineering";

    const recommendation =
        result.recommendedTechReel ||
        "System Design: Build a URL Shortener";

    const category =
        result.category ||
        "HLD";

    const difficulty =
        result.difficulty ||
        "Intermediate";

    const confidence =
        result.confidence ||
        "Medium";

    const hypeRisk =
        Number(result.hypeRisk) || 0;


    const evidence =
        Array.isArray(result.evidence)
            ? result.evidence
            : [];


    const scores =
        result.interestScores || {};


    const resultContainer =
        document.getElementById("result");


    if (!resultContainer) {

        console.error(
            "ERROR: #result element was not found."
        );

        return;
    }


    resultContainer.innerHTML = `

        <div class="output">


            <div class="card">

                <div class="label">
                    CURRENT REEL
                </div>

                <div class="current-title">
                    ${escapeHTML(
                        reels[
                            reels.length - 1
                        ].title
                    )}
                </div>

            </div>


            <div class="interest">

                <div class="label">
                    LATENT INTEREST DETECTED
                </div>

                <h3>
                    ${escapeHTML(interest)}
                </h3>

                <p class="reason">
                    ${escapeHTML(
                        result.why ||
                        "The interaction history indicates a broader technology interest."
                    )}
                </p>


                <div class="evidence">

                    <div class="label">
                        SIGNALS USED
                    </div>

                    ${
                        evidence.length > 0
                            ? evidence
                                .map(
                                    item => `
                                        <span>
                                            ${escapeHTML(
                                                item
                                            )}
                                        </span>
                                    `
                                )
                                .join("")
                            : `
                                <span>
                                    Semantic + behavioral signals
                                </span>
                            `
                    }

                </div>

            </div>


            <div class="recommend">

                <div class="label">
                    RECOMMENDED TECH REEL
                </div>

                <h3>
                    ${escapeHTML(
                        recommendation
                    )}
                </h3>


                <div class="tags">

                    <span class="tag">
                        ${escapeHTML(category)}
                    </span>

                    <span class="tag">
                        ${escapeHTML(difficulty)}
                    </span>

                    <span class="tag">
                        Confidence:
                        ${escapeHTML(confidence)}
                    </span>

                </div>


                <p class="reason">

                    ${escapeHTML(
                        result.whyRecommendation ||
                        "This recommendation expands the detected technology interest."
                    )}

                </p>

            </div>


            <div class="quality-card">

                <div class="quality-header">

                    <div>

                        <div class="label">
                            CONTENT QUALITY GUARD
                        </div>

                        <h3>
                            ${
                                hypeRisk >= 60
                                    ? "Hype detected"
                                    : "High-value content"
                            }
                        </h3>

                    </div>


                    <div class="quality-score">

                        ${100 - hypeRisk}

                        <small>
                            /100
                        </small>

                    </div>

                </div>


                <p class="reason">

                    ${escapeHTML(
                        result.qualityReason ||
                        "The recommendation prioritizes useful technology learning."
                    )}

                </p>


                <div class="quality-bar">

                    <span
                        style="
                            width:${100 - hypeRisk}%;
                        "
                    ></span>

                </div>

            </div>


            <div class="feedback-card">

                <div class="label">
                    ADAPTIVE FEEDBACK
                </div>

                <h3>
                    Was this recommendation useful?
                </h3>


                <div class="feedback-buttons">

                    <button
                        type="button"
                        id="positiveBtn"
                        class="feedback-btn"
                    >
                        👍 Useful
                    </button>


                    <button
                        type="button"
                        id="negativeBtn"
                        class="feedback-btn negative"
                    >
                        👎 Not useful
                    </button>

                </div>


                <div id="feedbackStatus"></div>

            </div>

        </div>

    `;


    if (
        typeof window.renderInterestGraph ===
        "function"
    ) {

        window.renderInterestGraph(
            scores
        );

    }


    updateComparison(
        recommendation
    );


    const positiveBtn =
        document.getElementById(
            "positiveBtn"
        );


    const negativeBtn =
        document.getElementById(
            "negativeBtn"
        );


    if (positiveBtn) {

        positiveBtn.addEventListener(
            "click",
            () => {
                sendFeedback(
                    "positive",
                    interest
                );
            }
        );

    }


    if (negativeBtn) {

        negativeBtn.addEventListener(
            "click",
            () => {
                sendFeedback(
                    "negative",
                    interest
                );
            }
        );

    }
}


function updateComparison(
    recommendation
) {

    const shallow =
        document.getElementById(
            "shallowRecommendation"
        );


    const smart =
        document.getElementById(
            "techRecommendation"
        );


    if (shallow) {

        shallow.textContent =
            "Another generic Java Reel";

    }


    if (smart) {

        smart.textContent =
            recommendation;

    }
}


async function sendFeedback(feedback, interest) {

    const status =
        document.getElementById("feedbackStatus");

    try {

        const response =
            await fetch(
                `${API_URL}/api/feedback`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        feedback,
                        interest
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Feedback request failed."
            );

        }


        if (status) {

            status.innerHTML = `
                <div class="feedback-success">
                    ✓ Interest profile updated
                </div>
            `;

        }


    } catch (error) {

        console.error(
            "Feedback error:",
            error
        );


        if (status) {

            status.innerHTML = `
                <div class="feedback-error">
                    Feedback could not reach the backend.
                </div>
            `;

        }

    }
}


async function analyzeHistory() {

    console.log(
        "Analyze button clicked!"
    );


    const button =
        document.getElementById(
            "analyzeBtn"
        );


    if (!button) {

        console.error(
            "Analyze button not found!"
        );

        return;
    }


    button.disabled = true;

    button.innerHTML =
        "Analyzing...";


    showLoading();


    try {

        console.log(
            "Sending Reel history to backend..."
        );

        console.log(
            "API:",
            `${API_URL}/api/recommend`
        );


        const response =
            await fetch(
                `${API_URL}/api/recommend`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        reels: reels
                    })
                }
            );


        console.log(
            "Backend HTTP status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "Backend response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.error ||
                `Backend returned ${response.status}`
            );

        }


        if (!data.result) {

            throw new Error(
                "Backend returned no AI result."
            );

        }


        renderResult(
            data.result
        );


    } catch (error) {

        console.error(
            "ANALYSIS ERROR:",
            error
        );


        showError(
            error.message
        );


    } finally {

        button.disabled = false;

        button.innerHTML =
            `Analyze My Reel History <b>→</b>`;

    }
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "TechScroll AI frontend loaded!"
        );


        renderReels();


        const button =
            document.getElementById(
                "analyzeBtn"
            );


        if (!button) {

            console.error(
                "ERROR: #analyzeBtn was not found!"
            );

            return;
        }


        button.addEventListener(
            "click",
            analyzeHistory
        );


        console.log(
            "Analyze button connected successfully!"
        );

    }
);