import React from "react";
import "./MatchDetail.scss";
import placeholder from "../../assets/img/placeholder.jpg";

export default function MatchDetail({ match }) {
  const creepScorePerMinuteFunction = (gameDuration, totalCS) => {
    let splitTime = gameDuration.split(":");
    let minuteInDecimals = splitTime[1] / 60;
    return parseInt(totalCS) / (parseInt(splitTime[0]) + minuteInDecimals);
  };

  const displayItem = (item) => {
    return (
      <>
        <img
          className="items__item"
          src={item !== 0 ? "/img/item/" + item + ".png" : placeholder}
          alt="item icon"
        />
      </>
    );
  };

  const displayLobbyPlayer = (playerObj) => {
    if (playerObj.puuid !== match.user.puuid) {
      return (
        <div className="team__player-container">
          <img
            className="team__champion-icon"
            src={"/img/champion/" + playerObj.championName + ".png"}
            alt="champion icon"
          />
          <p className="team__player-name">{playerObj.summonerName}</p>
        </div>
      );
    } else {
      return (
        <div className="team__player-container">
          <img
            className="team__champion-icon"
            src={"/img/champion/" + playerObj.championName + ".png"}
            alt="champion icon"
          />
          <p className="team__player-name team__selected-user-name">
            {playerObj.summonerName}
          </p>
        </div>
      );
    }
  };

  const findGreatestKillingSpree = (userObj) => {};

  return (
    <div className="match">
      <div className="game-detail__container">
        <p className="game-detail__game-mode">{match.gameMode}</p>
        <p className="game-detail__result">{match.user.win ? "WIN" : "LOSE"}</p>
        <p className="game-detail__duration">{match.gameDuration}</p>
      </div>
      <div className="user-info__container">
        <img
          className="user-info__champion-icon"
          src={"/img/champion/" + match.user.championName + ".png"}
          alt="champion icon"
        />
        <div className="userSpells__summoner-skills-container">
          <img
            className="userSpells__spell"
            src={"/img/spell/" + match.user.summoner1CastsInfo.image.full}
            alt="spell icon"
          />
          <img
            className="userSpells__spell"
            src={"/img/spell/" + match.user.summoner2CastsInfo.image.full}
            alt="spell icon"
          />
        </div>
        <div className="userRunes__container">
          <img
            className="userPerks__rune"
            src={
              "/img/" + match.user.perks.styles[0].selections[0].perkInfo.icon
            }
            alt="primary rune icon"
          />
          <img
            className="userPerks__rune"
            src={"/img/" + match.user.perks.styles[1].perkInfo.icon}
            alt="secondary rune icon"
          />
        </div>
      </div>
      <div className="user-stat__container">
        <p className="user-stat__score">
          {match.user.kills} / {match.user.deaths} / {match.user.assists}
        </p>
        <p className="user-stat__kda">
          {(
            (match.user.kills + match.user.assists) /
            match.user.deaths
          ).toFixed(2)}{" "}
          KDA
        </p>
        <p className="user-stat__creep-score">
          {match.user.totalMinionsKilled} CS{" "}
          {creepScorePerMinuteFunction(
            match.gameDuration,
            match.user.totalMinionsKilled
          ).toFixed(2)}
        </p>
      </div>
      <div className="items__container">
        <div className="items__item-section">
          {displayItem(match.user.item0)}
          {displayItem(match.user.item1)}
          {displayItem(match.user.item2)}
          {displayItem(match.user.item3)}
          {displayItem(match.user.item4)}
          {displayItem(match.user.item5)}
        </div>
        {/* Trinket */}
        {displayItem(match.user.item6)}
      </div>
      <div className="team__container">
        {displayLobbyPlayer(match.lobbyPlayers[0])}
        {displayLobbyPlayer(match.lobbyPlayers[1])}
        {displayLobbyPlayer(match.lobbyPlayers[2])}
        {displayLobbyPlayer(match.lobbyPlayers[3])}
        {displayLobbyPlayer(match.lobbyPlayers[4])}
      </div>
      <div className="team__container">
        {displayLobbyPlayer(match.lobbyPlayers[5])}
        {displayLobbyPlayer(match.lobbyPlayers[6])}
        {displayLobbyPlayer(match.lobbyPlayers[7])}
        {displayLobbyPlayer(match.lobbyPlayers[8])}
        {displayLobbyPlayer(match.lobbyPlayers[9])}
      </div>
    </div>
  );
}
