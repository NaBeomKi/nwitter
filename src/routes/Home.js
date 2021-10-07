import React, { useEffect, useRef, useState } from "react";
import { dbService, storageService } from "firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const fileInput = useRef();

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
    let attachmentUrl = null;

    if (attachment) {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetObj);

    setNweet("");
    onClearAttachment();
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const {
        currentTarget: { result },
      } = event;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
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
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="Preview" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
