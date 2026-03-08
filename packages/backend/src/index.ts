import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/estimate", async (req, res) => {
  const { brand, model, year, description } = req.body;

  if (!brand || !model || !year || !description) {
    res.status(400).json({ error: "Wszystkie pola są wymagane." });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Jesteś ekspertem od napraw samochodów w Polsce. Na podstawie opisu problemu podanego przez użytkownika oszacuj koszt naprawy w PLN.

Odpowiedz w formacie JSON:
{
  "estimate": "zakres cenowy, np. 500 - 1200 PLN",
  "details": "krótkie wyjaśnienie co trzeba zrobić i dlaczego tyle kosztuje",
  "disclaimer": "krótka informacja że to szacunek"
}

Odpowiadaj TYLKO poprawnym JSON-em, bez dodatkowego tekstu.`,
        },
        {
          role: "user",
          content: `Samochód: ${brand} ${model}, rocznik ${year}\nProblem: ${description}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      res.status(500).json({ error: "Brak odpowiedzi z AI." });
      return;
    }

    const result = JSON.parse(content);
    res.json(result);
  } catch (error) {
    console.error("Błąd wyceny:", error);
    res.status(500).json({ error: "Nie udało się wygenerować wyceny." });
  }
});

app.listen(port, () => {
  console.log(`Backend działa na http://localhost:${port}`);
});
