import { dbService } from "firebase";
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";

const Home = () => {
  const [nweet, setNweet] = useState("");

  const onChange = (e) => {
    setNweet(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      nweet,
      createdAt: Date.now(),
    });
    setNweet("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength="120"
          value={nweet}
          onChange={onChange}
        />
        <input type="submit" value="Nweet" />
      </form>
    </div>
  );
};

export default Home;
