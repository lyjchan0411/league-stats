const express = require("express");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();

const { API_KEY } = process.env;
console.log(API_KEY);

const reqHeader = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9,zh-TW;q=0.8,zh-CN;q=0.7,zh;q=0.6",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://developer.riotgames.com",
  "X-Riot-Token": API_KEY,
};

router.get("/", async (req, res) => {
  let requestUser = req.query.userName;
  let userResponse = await axios
    .get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${requestUser}`,
      { headers: reqHeader }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  res.json(userResponse);
});

module.exports = router;
