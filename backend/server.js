import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
    getRecommendation
} from "./recommender.js";


dotenv.config();


const app = express();

const PORT =
    process.env.PORT || 5000;

const GEMINI_API_KEY =
    process.env.GEMINI_API_KEY;


const feedbackHistory = [];


/* =========================================
   MIDDLEWARE
========================================= */

app.use(
    cors({
        origin: true,
        methods: [
            "GET",
            "POST",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type"
        ]
    })
);


app.use(
    express.json({
        limit: "2mb"
    })
);


/* =========================================
   LOGGER
========================================= */

app.use(
    (req, res, next) => {

        const start =
            Date.now();

        res.on(
            "finish",
            () => {

                const duration =
                    Date.now() - start;

                console.log(
                    `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
                );

            }
        );

        next();
    }
);


/* =========================================
   ROOT
========================================= */

app.get(
    "/",
    (req, res) => {

        res.json({

            name: "TechScroll AI",

            status: "online",

            version: "2.1.0",

            ai:
                Boolean(GEMINI_API_KEY),

            message:
                "TechScroll AI backend is running."

        });

    }
);


/* =========================================
   HEALTH
========================================= */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            status: "healthy",

            ai:
                Boolean(GEMINI_API_KEY),

            feedbackCount:
                feedbackHistory.length,

            timestamp:
                new Date().toISOString()

        });

    }
);


/* =========================================
   RECOMMEND
========================================= */

app.post(
    "/api/recommend",
    async (req, res) => {

        console.log("");
        console.log(
            "================================"
        );
        console.log(
            "Recommendation request received"
        );


        try {

            const reels =
                req.body?.reels;


            if (
                !Array.isArray(reels) ||
                reels.length === 0
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "Reel history is required."

                    });

            }


            if (!GEMINI_API_KEY) {

                console.error(
                    "GEMINI_API_KEY is missing."
                );


                return res
                    .status(500)
                    .json({

                        success: false,

                        error:
                            "AI service is not configured."

                    });

            }


            console.log(
                `Analyzing ${reels.length} Reels...`
            );


            const result =
                await getRecommendation(
                    reels,
                    GEMINI_API_KEY
                );


            console.log(
                "Interest:",
                result.interestDetected
            );


            console.log(
                "Recommendation:",
                result.recommendedTechReel
            );


            return res.json({

                success: true,

                result

            });


        } catch (error) {

            console.error(
                "Recommendation error:",
                error.message
            );


            return res
                .status(500)
                .json({

                    success: false,

                    error:
                        error.message ||
                        "Recommendation failed."

                });

        }

    }
);


/* =========================================
   FEEDBACK
========================================= */

app.post(
    "/api/feedback",
    (req, res) => {

        try {

            const {
                feedback,
                interest
            } = req.body;


            if (
                feedback !== "positive" &&
                feedback !== "negative"
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        error:
                            "Feedback must be positive or negative."

                    });

            }


            feedbackHistory.push({

                feedback,

                interest:
                    interest ||
                    "Unknown",

                timestamp:
                    new Date().toISOString()

            });


            return res.json({

                success: true,

                message:
                    "Feedback recorded.",

                feedbackCount:
                    feedbackHistory.length

            });


        } catch (error) {

            console.error(
                "Feedback error:",
                error
            );


            return res
                .status(500)
                .json({

                    success: false,

                    error:
                        "Could not save feedback."

                });

        }

    }
);


/* =========================================
   404
========================================= */

app.use(
    (req, res) => {

        res
            .status(404)
            .json({

                success: false,

                error:
                    "Route not found."

            });

    }
);


/* =========================================
   ERROR HANDLER
========================================= */

app.use(
    (error, req, res, next) => {

        console.error(
            "Unhandled error:",
            error
        );


        if (res.headersSent) {
            return next(error);
        }


        res
            .status(500)
            .json({

                success: false,

                error:
                    "Internal server error."

            });

    }
);


/* =========================================
   START
========================================= */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "          TECHSCROLL AI"
        );
        console.log(
            "========================================"
        );

        console.log(
            `PORT: ${PORT}`
        );

        console.log(
            `Gemini: ${
                GEMINI_API_KEY
                    ? "CONFIGURED"
                    : "MISSING"
            }`
        );

        console.log(
            "========================================"
        );
        console.log("");

    }
);