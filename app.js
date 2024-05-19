const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const studentsRoute = require('./routes/students.route');
app.use('/students', studentsRoute);
