import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  let navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:8080/users", {
        params: {
          userName: searchValue,
        },
      })
      .then((res) => {
        navigate(`/user/${res.data.name}`, {
          state: { userInfo: res.data },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Search for an user name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
