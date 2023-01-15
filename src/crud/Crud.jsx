import React, { useState, useEffect } from "react";

import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios'


function Crud() {
  //하나의 Todo
  //content에 들어갈 내용
  //화면에 랜더링되는 todo 리스트
  //이미지 업로드 상태 표시
  const [todo, setTodo] = useState({ "imgURL":"",
  "content":""});
  const [totext,setTotext] = useState("")
  const [todoli, setTodoli] = useState([]);
  const [imgUpload,setImgUpload] = useState(2)
  
  useEffect(()=>{
    /** 기존 db에 있던 내용을 처음에 가져옴
     */
    const getList = async () => {
      const beforeList = await axios.get('https://jsontodo.herokuapp.com/todojson')
      setTodoli(beforeList.data)
    }
    getList()
  },[])

  const submitHandler = e => {
    e.preventDefault();
    /** db에 이미지, content로 이루어진 새 todo를 post
     */
    const postList = async () => {
      await axios.post('https://jsontodo.herokuapp.com/todojson',{...todo,"content":totext })
      const getList = async () => {
        const beforeList = await axios.get('https://jsontodo.herokuapp.com/todojson')
        setTodoli(beforeList.data)
      }
      getList()
    }
    postList();
    //todo초기화 및 이미지 업로드 상태 초기화
    setTodo({ "imgURL":"",
    "content":""})
    setImgUpload(2)

  };
    /** 삭제 버튼을 누른 해당 todo를 db에서 삭제
     */
  const deleteLi = removeTodo => {
    const removedList = todoli.filter(param=>param.id!==removeTodo)
    setTodoli(removedList)
    const deleteList = async () => {
      await axios.delete(`https://jsontodo.herokuapp.com/todojson/${removeTodo}`)
    }
    deleteList();
  };
    /** content에 추가할 input값
     */
  const inputChange = e => {
    setTotext(e.target.value);
  };
    /** Firebase에 이미지 업로드 후 url을 반환하는 함수
     */
  const upImg = e => {
    //input에 받은 이미지 파일
    const nowImage = e.target.files[0];
    //이미지 이름을 다르게 생성하기 위해, 현재 시간을 이미지 이름에 추가하여 업로드
    const date = new Date();
    const imgName = nowImage.name + date.toString();
    const storageRef = ref(storage, imgName);
    //아래 promise로 작성된 함수를 async/await으로 변환
    const setUpload = async () => {
      setImgUpload(1)
      await uploadBytes(storageRef, nowImage);
      /** 기존 db에 있던 내용을 처음에 가져옴
     */
      const outputURL = await getDownloadURL(ref(storage, imgName));
      setImgUpload(0)
      setTodo({...todo, "imgURL":outputURL})
    };
    setUpload();
    //기존에 공식문서에서 promise로 작성된 함수
    // uploadBytes(storageRef, nowImage).then(() => {
    //   getDownloadURL(ref(storage, imgName)).then(url => {
    //     setImgUpload(url);
    //   });
    // });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={upImg} />
        {imgUpload===0?"업로드가 완료되었습니다":imgUpload===1?"업로드 중입니다":""}
      <form onSubmit={submitHandler}>
        <input type="text" onChange={inputChange} />
        <input type="submit" value="제출" />
      </form>
      <div>
        {todoli.map((a, k) => {
          return (
            <div key={String(a.id)+a.content}>
              {a.content}
              {<img src={a.imgURL} alt='todo이미지'/>}
              <button onClick={() => deleteLi(a.id)}>X</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Crud;
