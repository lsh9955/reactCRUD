# 프로젝트 제작을 위한 React 학습

React학습을 하며 필요했던 부분이나 오류, 어려웠던 부분들을 해결했던 것들을 작성하였습니다

### firebase 연동

- firebase.js 파일을 이용하여 storage 접근

```javascript
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
```

- .env를 이용하여 key값 노출 방지
- storage에 접근하고자 하는 파일에서 storage를 불러오기

- storage에 접근하여 이미지를 업로드하는 로직
- React의 버전, firebase 버전에 따라 설정이 조금씩 다르니 주의 - 공식문서를 봐도 오류가 나는 경우가 있었음
- React 17.0.2, firebase 9 버전으로 작성한 예시

![1](https://user-images.githubusercontent.com/72291472/212214194-79eabc6d-d8f8-481f-86d0-029978261dc3.png)
![2](https://user-images.githubusercontent.com/72291472/212214268-f7dc37de-5683-4cfc-ad92-f2e5833ed4bf.png)
![3](https://user-images.githubusercontent.com/72291472/212214688-36081c53-6cbd-4e94-b117-ae299651a174.png)

```jsx
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
    //이미지 파일 정보 가져오기
    const nowImage = e.target.files[0];
    const date = new Date();
    //이미지 파일 이름이 겹치지 않게 하기 위해 현재 시간값을 이름에 추가
    const imgName = nowImage.name + date.toString();
    //storage에 이미지 업로드
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
```

### calllback 함수를 사용하는 경우

- state를 변경 후 변경된 state를 사용하는 경우
- 예시

```jsx
import React, { useState, useEffect, useRef } from "react";
import { storage } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Crud() {
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

  return (
    <div>
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
    </div>
  );
}

export default Crud;
```

- ` onClick={()=>deleteLi(k)}` 을 이용하여 해당 컴포넌트에 해당하는 key 값을 가져올 수 있음

### url 정보 가져오기

- match, useParams 두 가지의 방법이 있음
- match는 route→component, porps는 component→component로 데이터를 전달해 준다

### 오류 해결

- `` You are running `create-react-app` 5.0.0, which is behind the latest release (5.0.1). ``

- 글로벌(전역) 설치를 제거한 후 재설치해야 함

```
npm uninstall -g create-react-app
npm i create-react-app
npx create-react-app my-app
```

### useRef 로 특정 DOM 선택하기

```jsx
import React, { useState, useRef } from "react";

function InputSample() {
  const [inputs, setInputs] = useState({
    name: "",
    nickname: "",
  });
  const nameInput = useRef();

  const { name, nickname } = inputs; // 비구조화 할당을 통해 값 추출

  const onChange = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  const onReset = () => {
    setInputs({
      name: "",
      nickname: "",
    });
    nameInput.current.focus();
  };

  return (
    <div>
      <input
        name="name"
        placeholder="이름"
        onChange={onChange}
        value={name}
        ref={nameInput}
      />
      <input
        name="nickname"
        placeholder="닉네임"
        onChange={onChange}
        value={nickname}
      />
      <button onClick={onReset}>초기화</button>
      <div>
        <b>값: </b>
        {name} ({nickname})
      </div>
    </div>
  );
}

export default InputSample;
```

- useRef()를 이용해 Ref 객체 생성
- Ref객체의 .current값은 DOM을 가리키게 됨

### useEffect cleanup

- cleanup
  - useEffect()에서 parameter로 넣은 함수의 return 함수이다.
  - Component의 unmount이전 / update직전에 어떠한 작업을 수행하고 싶다면 Clean-up함수를 반환해 주어야 한다.
  - 작동 순서
    - re-render -> 이전 effect clean-up -> effect

### useEffect 에서 async await 함수 사용

```javascript
//useEffect 를 async await 로 만든 예

useEffect(async () => {
  const data = await fetchUser(userId);
  setUser(data);
}, [userId]);
```

- async await 함수는 프로미스 객체를 반환 하므로 부수효과 함수가 될 수 없다.
  부수 효과 함수는 함수만 반환 할 수 있으며, 반환된 함수는 부수 효과 함수가 호출되기 직전과 컴포넌트가 사라지기 직전에 호출된다.
- useEffect 훅에서 async await 함수를 사용하는 한 가지 방법은 부수 효과 함수 내에서 async await 함수를 만들어서 호출하는 것

```javascript
useEffect(() => {
  async function fetchAndSetUser() {
    const data = await fetchUser(userId);
    setUser(data);
  }
  fetchAndSetUser();
}, [userId]);
```

- useEffect 내에서 async await 함수를 만들고
- 그 함수를 바로 호출 한다.
