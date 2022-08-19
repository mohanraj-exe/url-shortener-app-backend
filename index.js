const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnect = require("./db");
const { ShortUrl } = require('./model/short')
const app = express();

dotenv.config()

// database connection
dbConnect();

// middlewares
app.use(express.json());

app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.get('/get', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.send(shortUrls)
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ fullUrl: req.body.fullUrl })
  res.send("updated")
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.fullUrl)
})

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));