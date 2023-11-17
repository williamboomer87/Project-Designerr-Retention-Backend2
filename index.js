const serverless = require("serverless-http");
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8080;

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const stripehookRoutes = require('./routes/stripehookRoutes');


app.use('/stripehooks', stripehookRoutes);

// Middleware (webhooks are added before the middleware)
app.use(express.json());

app.use(cors());

// Routes
app.use('/auth', authRoutes);

app.use('/chat', chatRoutes);

app.use('/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });


module.exports.handler = serverless(app);
