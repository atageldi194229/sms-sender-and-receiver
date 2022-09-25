// npm i express cors

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));

const PORT = 8786;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
