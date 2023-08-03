const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser');

const users = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comments');

const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: false }));

// MongoDB Configuration
mongoose
  .connect('mongodb://localhost:27017/recipe', { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason);
  });
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors());

app.use('/public', express.static('public'));

app.use('/posts', posts);
app.use('/users', users);
app.use('/comments', comments);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port);
});
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error('Something went wrong'));
  });
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
