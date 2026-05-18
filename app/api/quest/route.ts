export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: `Turn this into RPG quest: ${body.task}`,
        stream: false,
      }),
    });

    const data = await response.json();

    console.log("OLLAMA RESPONSE:", data); // 👈 important

    return Response.json({
      result: data.response,
    });
  } catch (error) {
    console.log("ERROR:", error);

    return Response.json({
      result: "Error generating quest",
    });
  }
}