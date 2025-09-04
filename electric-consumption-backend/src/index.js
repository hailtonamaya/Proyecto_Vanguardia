require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const cidRouter = require('./routes/cid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/cid', cidRouter);

app.get('/', (req, res) => res.send('StorageCID backend running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
