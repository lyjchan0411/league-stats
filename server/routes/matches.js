const express = require("express");
const router = express.Router();
const axios = require("axios");
const { secondsToMinutesAndSeconds } = require("../utilites/time");
const summonerSpells = require("../data/summonerSpells.json");
const runes = require("../data/runes.json");
require("dotenv").config();

const { API_KEY } = process.env;
const matchesHeader = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9,zh-TW;q=0.8,zh-CN;q=0.7,zh;q=0.6",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://developer.riotgames.com",
};

router.get("/", async (req, res) => {
  const puuid = req.query.puuid;
  const fetchMatchIds = async () => {
    let matchIds = await axios
      .get(
        `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=normal&start=0&count=10&api_key=${API_KEY}`,
        { headers: matchesHeader }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return matchIds;
  };

  //Using the summonerSpell ID parameter to filter out summonerSpell information
  const retreiveSummonerSpellInfo = (id) => {
    if (id) {
      let filteredObj = summonerSpells.data.filter(
        (spell) => spell.key == id
      )[0];
      return {
        name: filteredObj.id,
        image: filteredObj.image,
      };
    }
  };

  //Using the rune ID parameter to filter out rune information
  const retreiveRunesInfo = (id) => {
    if (id) {
      let filteredObj = runes.map((rune) => {
        return rune.slots[0].runes.filter((item) => item.id == id)[0];
      });

      filteredObj = filteredObj.filter((item) => item)[0];

      return {
        name: filteredObj.key,
        icon: filteredObj.icon,
        id: id,
      };
    }
  };

  const fetchMatchesSummaries = async (matchIds) => {
    let arr = matchIds.map(async (matchId) => {
      let match = await axios
        .get(
          `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`,
          { headers: matchesHeader }
        )
        .then((res) => {
          let data = res.data;
          let playersArray = data.info.participants.map((player) => {
            return {
              championId: player.championId,
              championName: player.championName,
              summonerName: player.summonerName,
              puuid: player.puuid,
            };
          });

          //Filter for the selectedUser only with puuid
          let selectedUser = data.info.participants.filter(
            (user) => user.puuid === puuid
          )[0];

          //Adding the primary rune information from the Runes JSON and add it to the selectedUser 
          selectedUser.perks.styles[0].selections[0] = {
            ...selectedUser.perks.styles[0].selections[0],
            perkInfo: retreiveRunesInfo(
              selectedUser.perks.styles[0].selections[0].perk
            ),
          };

          //Filtering the Runes JSON to get the specific rune informataion to add it to the selectedUser 
          selectedUser.perks.styles[1] = {
            ...selectedUser.perks.styles[1],
            perkInfo: {
              id: runes.filter(
                (rune) => rune.id == selectedUser.perks.styles[1].style
              )[0].id,
              icon: runes.filter(
                (rune) => rune.id == selectedUser.perks.styles[1].style
              )[0].icon,
            },
          };

          //Data that is being sent as a respond
          let filteredMatchData = {
            matchId: data.metadata.matchId,
            lobbyPlayers: data.metadata.participants,
            gameMode: data.info.gameMode,
            gameCreation: new Date(data.info.gameCreation).toLocaleString(),
            gameDuration: secondsToMinutesAndSeconds(data.info.gameDuration),
            user: {
              ...selectedUser,
              summoner1CastsInfo: retreiveSummonerSpellInfo(
                selectedUser.summoner1Id
              ),
              summoner2CastsInfo: retreiveSummonerSpellInfo(
                selectedUser.summoner2Id
              ),
            },
            lobbyPlayers: playersArray,
            teams: data.info.teams,
          };
          return filteredMatchData;
        })
        .catch((err) => {
          console.log(err);
        });
      return match;
    });
    return Promise.all(arr);
  };

  let matchIds = await fetchMatchIds();
  let matchesSummaries = await fetchMatchesSummaries(matchIds);

  res.json(matchesSummaries);
});

module.exports = router;
