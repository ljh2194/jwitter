import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbInstance";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[]);


  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "로딩 중..."}
      <footer>
        &copy {new Date().getFullYear()}
      </footer>
      </>
  );
}

export default App;
