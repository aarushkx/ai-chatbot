import axios from "axios";

export async function sendChatMessage(input) {
    const response = await axios({
        url: `${import.meta.env.VITE_GEMINI_API_URL}${
            import.meta.env.VITE_GEMINI_API_KEY
        }`,
        method: "POST",
        data: {
            contents: [{ parts: [{ text: input }] }],
        },
    });
    return response.data.candidates[0].content.parts[0].text;
}
