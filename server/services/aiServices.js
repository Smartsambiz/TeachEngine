const ai = require("@google/generative-ai");


const geminiAi = new ai.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = geminiAi.getGenerativeModel({
    model: "gemini-3.6-flash",
});

const generateLessonNote = async(topicTitle, description, weekNo, studentLevel)=>{
    const prompt = `You are an expert curriculum assistant and school teacher. 
Write a professional, comprehensive lesson note for the topic: "${topicTitle}" (Description: "${description}") taught in week ${weekNo}.

CRUCIAL TARGET AUDIENCE RULE: The target students are in standard: "${studentLevel}". 
You MUST tailor the complexity of your explanations, vocabulary, analogies, and mathematical/scientific depth so it is completely age-appropriate, clear, and easy to understand for a student at the "${studentLevel}" level. Do not use overly complex academic jargon if the level is low.

VISUAL AIDS & DIAGRAMS RULE: If this specific topic would benefit from a visual learning aid (such as scientific processes, structural cycles, anatomy maps, mathematical shapes, timeline progressions, or organizational flowcharts), you MUST explicitly generate a code-based diagram right inside the "Content Body" section.
- You must write the diagram inside a standard Markdown block starting exactly with: \`\`\`mermaid
- Use valid Mermaid.js structural syntax (like "graph TD" for top-down flowcharts, "sequenceDiagram", or basic geometric flowchart node connections).
- Keep node labels short, clear, and explicitly tailored to what the students are learning.
- Directly beneath the mermaid code block, provide a brief bulleted description explaining what the diagram illustrates so the teacher has a quick context helper.

You MUST format your response using clean Markdown (#, ##, -).
Include sections for: 1. Objectives, 2. Materials, 3. Content Body, 4. Evaluation.`;

    const response = await model.generateContent(prompt);

    return response.response.text();
};

module.exports = {
    generateLessonNote
}