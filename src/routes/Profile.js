import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { authService, dbService } from "firebase";
import { useHistory } from "react-router";
import Nweet from "components/Nweet";

const Profile = ({ userObj }) => {
  const [myNweets, setMyNweets] = useState([]);

  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const nweetsArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setMyNweets(nweetsArray);
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
      <ul>
        {myNweets.map((nweetObj) => (
          <Nweet
            key={nweetObj.id}
            nweetObj={nweetObj}
            isOwner={userObj.uid === nweetObj.creatorId}
          />
        ))}
      </ul>
    </>
  );
};

export default Profile;
