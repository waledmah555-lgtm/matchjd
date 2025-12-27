import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText?.trim() || !jobDescription?.trim()) {
      return Response.json(
        { error: "Missing resumeText or jobDescription" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
You are MatchJD, a resume alignment engine.

Your task is to rewrite and reorder a candidate’s resume so that it aligns with a given job description, while strictly preserving factual accuracy.

STRICT RULES (NON-NEGOTIABLE):
- Do NOT add any skills, tools, technologies, experiences, metrics, companies, job titles, certifications, or dates that are not explicitly present in the resume.
- Do NOT invent achievements, impact, numbers, or responsibilities.
- Do NOT exaggerate or assume proficiency.
- If a requirement appears in the job description but is NOT present in the resume, do NOT add it.
- Do NOT give advice, commentary, explanations, or suggestions.
- Do NOT mention the job description explicitly in the final resume.
- Output must be professional, neutral, and ATS-friendly.

WHAT YOU MAY DO:
- Reorder sections to emphasize relevance.
- Rephrase existing bullet points for clarity and alignment, without changing meaning.
- Group related skills more clearly.
- Remove redundant or irrelevant content if necessary.
- Improve grammar and formatting.
- Emphasize projects, internships, coursework, and tools for fresher/entry-level candidates.

TARGET AUDIENCE:
- Fresher / entry-level candidates (0–2 years experience)

RESUME STRUCTURE (USE EXACT HEADINGS):
1. Name
2. Contact Information
3. Skills
4. Projects
5. Internships / Training (if present)
6. Education
7. Certifications (if present)

FORMATTING RULES:
- Use simple text headings.
- Use bullet points for responsibilities.
- No tables, no graphics, no icons.
- Keep language concise and factual.
- Use consistent tense and formatting.
- ATS-compatible only.

INPUT RESUME (SOURCE OF TRUTH):
<<<RESUME_TEXT>>>

JOB DESCRIPTION (FOR ALIGNMENT ONLY):
<<<JOB_DESCRIPTION>>>

OUTPUT:
- Return ONLY the rewritten resume content.
- Do NOT include explanations, notes, or warnings.
`
      .replace("<<<RESUME_TEXT>>>", resumeText)
      .replace("<<<JOB_DESCRIPTION>>>", jobDescription);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const result = response?.choices?.[0]?.message?.content || "";

    return Response.json({ result });
  } catch (e) {
    return Response.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
