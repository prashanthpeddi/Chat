import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgpreview,setImgpreview]=useState(null)

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async() => {
    if (!data.chatId) {
      alert("Please select a user to send the message");
      return;
    }
    if (text.trim() === "" && !img) {
      // alert("Cannot send an empty message");
      return;
    }

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setImgpreview(null)
  };
  const handleImageChange=(event)=>{
    const file=event.target.files[0];
    if(file){
      setImg(file)
      setImgpreview(URL.createObjectURL(file))
    }
  }
  return (
  
    <div className="input">
      {imgpreview && <img src={imgpreview} alt="image-preview" width="30px" className="image-preview"/>}
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
      <label htmlFor="file">
      <img src={Attach} alt="" />
        </label>
     
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleImageChange}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}><img src="https://tse4.mm.bing.net/th?id=OIP.Vv3KWoeZjSkHV2-WAtZ8wgHaGg&pid=Api&P=0&h=180" alt="" /></button>
      </div>
    </div>
  );
};

export default Input;
