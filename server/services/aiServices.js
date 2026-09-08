const ai = require("@google/generative-ai");

const geminiAi = new ai.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = geminiAi.getGenerativeModel({
    model: "gemini-3.6-flash",
    generationConfig: {
        responseMimeType: "application/json"
    }
});

const subjectGuidance = (subject = "") => {
    const normalizedSubject = subject.toLowerCase();

    if (/math|physics|chemistry|accounting|economics/.test(normalizedSubject)) {
        return "Use worked examples, accurate calculations, guided practice, and independent practice when appropriate.";
    }
    if (/science|biology/.test(normalizedSubject)) {
        return "Prefer concept, explanation, demonstration or experiment, observation, result, conclusion, application, and evaluation when useful.";
    }
    if (/english|language|literature/.test(normalizedSubject)) {
        return "Use vocabulary, model examples, guided practice, student practice, and reading or writing activities when relevant.";
    }
    if (/computer|digital|ict|technology/.test(normalizedSubject)) {
        return "Use concept, teacher demonstration, numbered procedure, practical student activity, and evaluation.";
    }
    if (/social|civic|history|geography/.test(normalizedSubject)) {
        return "Use key concepts, familiar real-life examples, discussion, application, and evaluation.";
    }
    return "Choose a practical structure that fits the topic and avoid adding sections that do not help the teacher teach it.";
};

const buildLessonPrompt = ({ topicTitle, objectives, weekNo, studentLevel, subject, duration }) => `
You are an experienced classroom teacher and curriculum planner. Create a practical lesson plan that a teacher can immediately prepare and teach. Do not write an essay and do not sound like a chatbot.

RELIABLE INPUTS
- Topic: ${topicTitle}
- Topic objectives supplied by the teacher: ${objectives || "Not supplied"}
- Week: ${weekNo || "Not supplied"}
- Learner level: ${studentLevel || "Not supplied"}
- Subject: ${subject || "Not supplied"}
- Duration: ${duration || "Not supplied"}

NON-NEGOTIABLE RULES
1. Return ONLY valid JSON. Do not wrap it in Markdown fences and do not add commentary before or after it.
2. Use only lesson information supplied above. Omit unknown lesson-information fields instead of inventing school, teacher, date, class, subject, or duration details.
3. Adapt vocabulary, examples, task difficulty, and sentence length to the learner level. Never use university-level explanations for primary learners.
4. Keep the amount of content realistic for the duration. If no duration is supplied, do not invent timings.
5. Use natural teacher language such as "Ask the students", "Demonstrate", "Explain", and "Expected response".
6. If a visual or flowchart would help explain a process or structure, you MUST generate a valid, raw Mermaid.js syntax code string. Never write plain english descriptions. You must start the string exactly with a structural declaration (like 'graph TD' or 'graph LR').  For example: 'graph TD; A[Central Concept] --> B[Sub-concept]; A --> C[Another Concept];' Assign this raw syntax string directly to the 'suggestedVisual' field. If no diagram is needed, leave 'suggestedVisual' as an empty string.
Now, your server returns a rich, structured **JSON Object** across the network to React instead of a long raw Markdown string!.
7. Learning objectives must be measurable and use action verbs. Improve vague supplied objectives without changing their intended topic.
8. Include teacher activity and student activity wherever they add teaching value. Include checks for understanding during development, not only at the end.
9. Use realistic, affordable materials. Avoid dangerous activities and specialist equipment unless essential.
10. Evaluation questions must assess the objectives. Keep teacher answers in a separate answerKey array.
11. Do not force irrelevant sections. Use empty arrays or short strings when a section is not useful.

SUBJECT GUIDANCE
${subjectGuidance(subject)}

RETURN THIS EXACT JSON SHAPE
{
  "lessonInfo": { "week": "", "topic": "", "subject": "", "class": "", "duration": "" },
  "objectives": [""],
  "materials": [""],
  "previousKnowledge": "",
  "introduction": { "teacherActivity": "", "studentActivity": "", "expectedResponses": [], "suggestedVisual": "" },
  "lessonDevelopment": [{ "step": 1, "title": "", "teacherActivity": "", "studentActivity": "", "explanation": "", "examples": [], "checkForUnderstanding": [] }],
  "activities": [{ "name": "", "materials": [], "procedure": [], "observation": "", "discussionQuestions": [], "expectedResult": "", "conclusion": "" }],
  "evaluation": { "oralQuestions": [], "shortAnswerQuestions": [], "multipleChoiceQuestions": [], "applicationQuestions": [], "answerKey": [] },
  "summary": [],
  "homework": []
}

Only include useful content. For mathematics, physics, chemistry, accounting, or economics, put correct worked examples in the relevant lesson-development explanation or examples fields and include the final answer. For practical lessons, provide safe numbered procedures and expected observations.
`;

const parseModelJson = (text) => {
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(cleaned.slice(start, end + 1));
        }
        throw new Error("The lesson generator returned an invalid structured lesson.");
    }
};

const generateLessonNote = async (topicTitle, objectives, weekNo, studentLevel, options = {}) => {
    const prompt = buildLessonPrompt({ topicTitle, objectives, weekNo, studentLevel, subject: options.subject, duration: options.duration });
    const response = await model.generateContent(prompt);
    return parseModelJson(response.response.text());
};

module.exports = { generateLessonNote, buildLessonPrompt, parseModelJson };