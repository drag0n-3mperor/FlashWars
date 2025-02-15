import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

export const generateText = async (prompt) => {
  try {
    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return result.choices[0].message?.content;
  } catch (error) {
    console.log(error);
  }
};

export const generateMCQ = async (question) => {
  try {
    return await generateText(
      `${question}. in format of array of { "question":  "Question", "options": [ "Option1", "Option2", "Option3", "Option4" ], "correct_anwer_index": _index }. one correct answer and 3 wrond answers with all answers shuffled and do not json, javscript or anything before the answer, the correct answer index may not 0`
    );
  } catch (error) {
    console.log(error);
  }
};
