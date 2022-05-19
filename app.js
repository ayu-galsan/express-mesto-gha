const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const path = require('path');
const { routes } = require('./routes/app');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '62835b6876c4443fda254971',
  };

  next();
});

app.use(routes);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT, () => {
    console.log(`Слушаем ${PORT} порт`);
  });
}

main();
