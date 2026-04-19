const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdf = require("pdf-parse");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// Hardcoded skill list
const skillsList = [
    "python",
    "java",
    "javascript",
    "react",
    "node",
    "sql",
    "aws",
    "excel",
    "power bi"
];

function extractSkills(text) {
    text = text.toLowerCase();
    return skillsList.filter(skill => text.includes(skill));
}

app.post("/compare", upload.single("resume"), async (req, res) => {

    try {

        const jobDescription = req.body.jd;
        const filePath = req.file.path;

        let resumeText = "";

try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    resumeText = pdfData.text;
} catch (err) {
    console.log("PDF ERROR:", err.message);

    return res.json({
        matching: [],
        missing: [],
        score: 0,
        error: "Invalid or unsupported PDF file"
    });
}

        const resumeSkills = extractSkills(resumeText);
        const jdSkills = extractSkills(jobDescription);

        const matching = resumeSkills.filter(skill => jdSkills.includes(skill));
        const missing = jdSkills.filter(skill => !resumeSkills.includes(skill));

        let score = 0;
        if (jdSkills.length > 0) {
            score = Math.round((matching.length / jdSkills.length) * 100);
        }

        res.json({
            matching,
            missing,
            score
        });

    } catch(err) {
        console.log(err);
        res.send("Error occurred");
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));