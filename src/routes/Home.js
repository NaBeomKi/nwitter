import React, { useEffect, useState } from "react";
import { dbService } from "firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "nweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const nweetsArray = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNweets(nweetsArray);
      }
    );
  }, []);

  const onChange = (e) => {
    setNweet(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
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
      <ul>
        {nweets.map((nweetObj) => (
          <Nweet
            key={nweetObj.id}
            nweetObj={nweetObj}
            isOwner={userObj.uid === nweetObj.creatorId}
          />
        ))}
      </ul>
    </div>
  );
};

export default Home;
