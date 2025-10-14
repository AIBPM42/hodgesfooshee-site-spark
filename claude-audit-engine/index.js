const express = require('express');
const app = express();
const port = 3000;

// Parse JSON bodies
app.use(express.json());

// Claude webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('\n--- Claude Webhook Triggered ---');

  // Log full payload
  console.dir(req.body, { depth: null, colors: true });

  // Detect trigger comment
  const commentBody = req.body?.comment?.body;
  if (commentBody && commentBody.includes('@claude audit')) {
    console.log('✅ Claude audit trigger detected.');
  } else {
    console.log('⚠️ No Claude trigger found in comment.');
  }

  res.status(200).send('Received');
});

// Catch-all for other POSTs (no wildcard error)
app.post('/test', (req, res) => {
  console.log('\n--- Test POST Received ---');
  console.dir(req.body, { depth: null, colors: true });
  res.status(200).send('Test received');
});

// Start server
app.listen(port, () => {
  console.log(`Claude audit engine running on port ${port}`);
});
