
const PORT = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const API_KEY = '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';

app.listen(PORT, () => {
  console.log("Server started");
});

app.post('/completions', async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.messages}],
      max_tokens: 100,
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
