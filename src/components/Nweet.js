import React, { memo, useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "firebase";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = memo(({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
      if (nweetObj.attachmentUrl) {
        const attachmentRef = ref(storageService, nweetObj.attachmentUrl);
        await deleteObject(attachmentRef);
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (e) => {
    setNewNweet(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // async-await을 안써도 가능한데, 그 이유는 snapshot으로 변화를 감시하고 있기 때문에
    await updateDoc(doc(dbService, `nweets/${nweetObj.id}`), {
      text: newNweet,
    });
    toggleEditing();
  };

  return (
    <li key={nweetObj.id} className="nweet">
      {editing ? (
        isOwner && (
          <>
            <form onSubmit={onSubmit} className="container nweetEdit">
              <input
                type="text"
                value={newNweet}
                onChange={onChange}
                required
                placeholder="Edit your nweet"
              />
              <input type="submit" value="Update" className="formBtn" />
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
              Cancle
            </span>
          </>
        )
      ) : (
        <>
          <span>
            {nweetObj.text} -------created at:{" "}
            {nweetObj.attachmentUrl && (
              <img src={nweetObj.attachmentUrl} alt="" />
            )}
            {new Date(nweetObj.createdAt)
              .toISOString()
              .slice(0, -1)
              .replace("T", " ")}
          </span>
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </li>
  );
});

export default Nweet;
