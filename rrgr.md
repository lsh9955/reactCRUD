- 예시

/users 경로에 대해서는 유저 목록 페이지를 보여주고, /users/<유저 아이디> 경로에 대해서는 유저 상세 페이지를 보여주려고 한다

App 컴포넌트를 통해 /users 경로에 대해서 Users 컴포넌트로 1차 라우팅하고, Users 컴포넌트를 통해 2차 라우팅을 했다

`App 컴포넌트`

먼저 최상위 컴포넌트인 App에서 각 메뉴의 경로에 대응되는 컴포넌트를 맵핑해주는 기본 라우팅을 구현한다

여기서 /users 경로에는 Users 컴포넌트를 맵핑해주었으며, 이 Users 컴포넌트 내부에서 /users의 하위 경로에 대한 라우팅을 해줄 것임

```jsx
import React from "react";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Users from "./Users";
import NotFound from "./NotFound";

function App() {
  return (
    <Router>
      <header>
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/about">
          <button>About</button>
        </Link>
        <Link to="/users">
          <button>Users</button>
        </Link>
      </header>
      <hr />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/users" component={Users} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
```

Users 컴포넌트
Users 디렉터리를 생성하고, 그 안에 index.js 파일을 생성하고, 다음과 같이 Users 컴포넌트를 작성합니다. Users 컴포넌트는 <Route> 컴포넌트의 component prop의 인자로 넘어갔기 때문에 위에서 설명드린 3개의 props를 가지고 있습니다. 이 중에서 match prop를 읽어, match.path 값을 2개의 내부 <Route> 컴포넌트를 추가할 때 사용합니다.

첫 번째 <Route> 컴포넌트는 /users 경로에 유저 목록 페이지를 위한 <UserList> 컴포넌트를 맵핑하며, 두 번째 <Route> 컴포넌트는 /users/:id 경로에 유저 상세 페이지를 위한 <UserDetail> 컴포넌트를 맵핑합니다.

여기서 첫 번째 <Route> 컴포넌트에 exact prop을 사용한 이유는 /users 경로를 정확히 매칭하고 위함입니다. exact prop 없을 경우, /users로 시작하는 모든 경로가 매칭되어, 유저 상세 페이지가 표시될 때, 유저 목록 페이지도 항상 같이 표시되게 됩니다. (이런 UI를 원할 때는 exactprop을 사용하지 않으면 되겠죠?)

/users/:id 경로에서 :id 부분은 URL 파라미터를 정의할 때 사용하는 React Router의 문법입니다. 경로에 이와 같이 URL 파라미터가 포함된 경우, 패턴 매칭이 되어 /users/1, /users/a 등이 모두 매칭이 되며, 해당 파라미터는 변수화되어 맵핑된 컴포넌트에서 match.params.id와 같이 읽어올 수 있습니다.

import React from "react";
import { Route } from "react-router-dom";
import UserList from "./UserList";
import UserDetail from "./UserDetail";

function Users({ match }) {
return (
<>

<h1>Users</h1>
<Route exact path={match.path} component={UserList} />
<Route path={`${match.path}/:id`} component={UserDetail} />
</>
);
}

export default Users;
UserList 컴포넌트
Users 디렉터리 안에 <UserList> 컴포넌트를 작성합니다. 유저 목록 페이지를 렌더링하는 <UserList> 컴포넌트도 역시 <Route> 컴포넌트의 component prop의 인자로 넘어갔기 때문에 match prop을 가집니다. 여기서는 React Router의 <Link> 컴포넌트를 이용해서, 각 유저의 상세 페이지로 이동하는 링크를 만듭니다.

이동할 경로는 match.url 뒤에 각 유저의 id를 붙여서 <Link> 컴포넌트의 to prop에 넘겨줍니다. match.path 대신에 match.url을 사용해야하는 이유는 링크를 걸 때 경로 문자열이 아닌 경로 패턴을 사용하면 URL 파라미터가 포함될 수 있기 때문입니다. <UserList> 컴포넌트의 경우에는 match.path와 match.url이 모두 /users이기 때문에 문제가 되지는 않지만, 더 하위 컴포넌트에서는 문제가 될 수 있습니다.

import React from "react";
import { Link } from "react-router-dom";
import { users } from "./data.json";

function UserList({ match }) {
return (
<>

<h2>User List</h2>
<ul>
{users.map(({ id, name }) => (
<li key={id}>
<Link to={`${match.url}/${id}`}>{name}</Link>
</li>
))}
</ul>
</>
);
}

export default UserList;
UserDetail 컴포넌트
Users 디렉터리 안에 <UserDetail> 컴포넌트를 작성합니다. 유저 상세 페이지를 렌더링하는 <UserDetail> 컴포넌트에서는 match prop 뿐 만 아니라 history prop도 사용합니다. 먼저 match.params를 통해 경로에 포함되어 있는 URL 파라미터를 읽어 오는데, 경로가 /users/1일 경우, match.params에 {id: "1"}이 할당됩니다. 따라서 match.params.id 값은 1이 되며, 이 값으로 유저를 조회하여 상세 정보를 렌더링합니다.

유저 목록 페이지로 다시 돌아가기 위한 버튼에는 history prop의 goBack() 함수를 사용하였습니다. 참고로, history prop은 브라우저의 이력 정보와 관련 유틸리티 함수를 가지고 있습니다.

import React from "react";
import { users } from "./data.json";

function UserDetail({ match, history }) {
const user = users.find((user) => user.id === match.params.id);
return (
<>

<h2>User Detail</h2>
<dt>id</dt>
<dd>{user.id}</dd>
<dt>name</dt>
<dd>{user.name}</dd>
<button onClick={() => history.goBack()}>Back</button>
</>
);
}

export default UserDetail;
