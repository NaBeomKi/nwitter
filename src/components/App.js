import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "firebase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    // user가 너무 방대해서 이후 변화를 알아차리기 어렵기 때문에 처음부터 user에서 원하는 것들만 뽑아 userObj에 담는 방식,(userObj의 정보를 줄여 React가 변화를 알아차리도록)
    // 다른 방법으로는 Object.assign({}, user)으로 하는 방법도 존재하는데, 실행해 본 결과 updateProfile 부분에서 에러가 발생했음.(원인은 모르겠지만, 알 수 없는 에러가 발생할 확률이 있다.)
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
