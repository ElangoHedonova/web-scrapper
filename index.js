const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const url = "https://finance.yahoo.com/quote/%5EGSPC/history?p=%5EGSPC";

app.get("/", function (req, res) {
  res.json("This is my web scraper");
});

app.get("/api/sp500", (req, res) => {
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const articles = [];

      $("tr", html).each(function () {
        //<-- cannot be a function expression
        // const title = $(this).text();
        // const url = $(this).find("a").attr("href");
        // articles.push({
        //   title,
        //   url,
        // });
        // articles.push({
        //   data: $(this).children().children(),
        // });
        const splittedValue = [];

        $(this)
          .children()
          .children()
          .parent()
          .toString()
          .split("</span>")
          .forEach((el) => {
            const splitted = el.split(`">`);

            splittedValue.push(splitted[2]);
          });
        // console.log(
        //   "HI--------------------------",
        //   $(this).children().children().parent().toString().split("</span>")
        // );
        articles.push({
          date: splittedValue[0],
          open: splittedValue[1],
          high: splittedValue[2],
          low: splittedValue[3],
          close: splittedValue[4],
          adj_close: splittedValue[5],
          volume: splittedValue[6],
        });
      });
      articles.pop();
      articles.shift();
      res.json(articles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
