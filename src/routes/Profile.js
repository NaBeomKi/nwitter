import React, { useCallback, useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { authService, dbService } from "firebase";
import { useHistory } from "react-router";
import Nweet from "components/Nweet";
import { updateProfile } from "firebase/auth";

const Profile = ({ refreshUser, userObj }) => {
  const [myNweets, setMyNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = useCallback(async () => {
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
  }, [userObj]);

  useEffect(() => {
    getMyNweets();
  }, [getMyNweets]);

  const onChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onChange={onChange}
          required
        />
        <input type="submit" value="Update Profile" />
      </form>
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
