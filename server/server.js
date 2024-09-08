require('dotenv').config();
const express = require('express');
const connectDb = require('./utils/db');
const cors = require('cors');
// const errorMiddleware = require('./middlewares/error-middleware');

// const authRoute = require('./router/auth-router');
// const contactRoute = require('./router/contact-user');
// const adminRoute = require('./router/admin-router');


const path = require('path')

const Port = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://margdakshi.vercel.app'],
  methods: 'GET, POST, PUT, DELETE, PATCH, HEAD',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// app.use('/api/auth', authRoute);
// app.use('/api/form', contactRoute);
// app.use('/api/admin', adminRoute);



app.get('/', (req, res) => {
  res.send('Hello Ptu');
});


connectDb()
  .then(() => {
    app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });