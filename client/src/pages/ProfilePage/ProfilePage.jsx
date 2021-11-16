import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import MatchDetail from "../../components/MatchDetail/MatchDetail";
// import img from "../../../public/img/profileicon/1233.png";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState("");
  const [matchHistories, setMatchHistories] = useState([]);
  const params = useParams();
  const { state } = useLocation();
  const { userInfo } = state;

  console.log(userInfo);

  const displayMatches = () => {
    return matchHistories.map((match) => {
      return (
        <>
          <MatchDetail key={match.matchId} match={match} />
        </>
      );
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/matches", {
        params: {
          puuid: userInfo.puuid,
        },
      })
      .then((res) => {
        setUserProfile(res.data[0].user[0]);
        setMatchHistories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <img
        src={"/img/profileicon/" + userInfo.profileIconId + ".png"}
        alt="user profile icon"
      />
      <div>Hello {userInfo.name}</div>
      <div>{userInfo.summonerLevel}</div>
      {displayMatches()}
    </div>
  );
}
