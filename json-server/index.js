/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const cors = require('cors');
const fakeRecords = require('./generate');
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const jwt = require('jsonwebtoken');

const TOKEN_SECRET =
  '5c42f5c67156dce3fc61deda797c467d813aefeab0ac5e5bc888' +
  'a201b2abc1d63b94ad99631a293780f6c666d69125c2b1976dd7c76e9810b2c7d7c1ce95bed7';

let records = fakeRecords().records;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/v1/login/password', (req, res) => {
  const { phone, password } = req.body;
  if (
    !phone ||
    !password ||
    typeof phone !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.sendStatus(400);
  }
  const token = generateAccessToken({ phone: phone });
  res.json(token);
});

app.post('/api/v1/login/sms', (req, res) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== 'string') {
    return res.sendStatus(400);
  }
  res.status(200).json('ok');
});

app.post('/api/v1/login/sms/verify', (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string' || code.length !== 4) {
    return res.sendStatus(400);
  }
  res.json(generateAccessToken({ code }));
});

app.get('/api/v1/records', verifyAuth, (req, res) => {
  const { from, to, sorting, q, direction } = req.query;
  console.log({ from, to, sorting, q, direction });
  let result = records;
  if (direction && direction !== 'ALL') {
    result = result.filter(({ direction: d }) => d === direction);
  }
  if (q) {
    result = result.filter(
      ({ collocutor: { phone }, record: { transcriptions } }) => {
        const queryPhoneDigits = q.replace(/\D/g, '');
        if (
          queryPhoneDigits &&
          phone.replace(/\D/g, '').includes(queryPhoneDigits)
        ) {
          return true;
        }
        return transcriptions.some(({ text }) => text.includes(q));
      }
    );
  }
  res.json(result);
});

app.get('/api/v1/records/:id', verifyAuth, (req, res) => {
  const record = records.find(({ id }) => id === parseInt(req.params.id, 10));
  res.json(record);
});

app.delete('/api/v1/records/:id', verifyAuth, (req, res) => {
  const deletedRecord = records.find(({ id }) => id === parseInt(req.params.id, 10));
  records = records.filter(v => v !== deletedRecord);
  res.json(deletedRecord);
});

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.listen(3001, () => {
  console.log('===============');
});

function verifyAuth(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    console.log(err, user);
    if (err) return res.status(403).json(err);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, TOKEN_SECRET, { expiresIn: '24h' });
}
