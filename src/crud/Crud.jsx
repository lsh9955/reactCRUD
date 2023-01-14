import React, { useState, useEffect, useRef } from "react";
import { storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Crud() {
  const [imgUpload, setImgUpload] = useState("");
  const [todo, setTodo] = useState("");
  const [todoli, setTodoli] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    setTodoli([...todoli, todo]);
    setTodo("");
  };

  const deleteLi = (e) => {
    console.log(e);
  };

  const inputChange = (e) => {
    setTodo(e.target.value);
  };
  const upImg = (e) => {
    const nowImage = e.target.files[0];
    const date = new Date();
    const imgName = nowImage.name + date.toString();
    const storageRef = ref(storage, imgName);
    uploadBytes(storageRef, nowImage).then(() => {
      getDownloadURL(ref(storage, imgName)).then((url) => {
        setImgUpload(url);
      });
    });
  };

  return (
    <div>
      <form action="">
        <input type="text" />
        <input type="file" accept="image/*" onChange={upImg} />
        <input type="submit" />
      </form>
      <form onSubmit={submitHandler}>
        <input type="text" onChange={inputChange} />
        <input type="submit" value="제출" />
      </form>
      <div>
        {todoli.map((a, k) => {
          return (
            <div key={k}>
              {a}
              <button onClick={() => deleteLi(k)}>X</button>
            </div>
          );
        })}
      </div>
      {imgUpload && <img src={imgUpload} alt="업로드이미지" />}
    </div>
  );
}

export default Crud;
