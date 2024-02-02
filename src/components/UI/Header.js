import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Header = () => {
  let last_scroll_pos = 0;
  let ticking = false;
  const [chaning, setChaning] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [userName, setUserName] = useState();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const doSomething = (scroll) => {
    if (scroll >= 10) {
      setChaning(true);
      setScrolling(true);
    } else {
      setChaning(false);
      setScrolling(false);
    }
  };

  window.addEventListener("scroll", (e) => {
    last_scroll_pos = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        doSomething(last_scroll_pos);
        ticking = false;
      });
      ticking = true;
    }
  });

  const onMouseOverOut = () => {
    if (scrolling) {
      return;
    }
    setChaning((current) => !current);
  };

  const logoutHandler = () => {
    secureLocalStorage.removeItem("username");
    setUserName();
    authCtx.logout();
    navigate("/");
    setChaning(false);
  };

  useEffect(() => {
    setTimeout(() => {
      const name = secureLocalStorage.getItem("username");
      if (name) {
        setUserName(name);
      }
    }, [1500]);
    return () => {
      setChaning(false);
    };
  }, []);

  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        onMouseOver={onMouseOverOut}
        onMouseOut={onMouseOverOut}
        style={
          chaning
            ? {
                backgroundColor: "#fdb8ff",
                boxShadow:
                  "rgba(241, 0, 221, 0.25) 0px 5px 8px 0px,rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
              }
            : { backgroundColor: "transparent" }
        }
      >
        <Link to="../"><h1><i class="fab fa-slack-hash"></i>Feeds</h1></Link>
        <span>{userName && "Hello " + userName}</span>
        {authCtx.token && <button onClick={logoutHandler}>Logout</button>}
      </nav>
      <div className={styles.null}></div>
    </header>
  );
};

export default Header;
