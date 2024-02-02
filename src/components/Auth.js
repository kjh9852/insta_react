import React, { useEffect, useContext } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

import Card from "./UI/Card";
import styles from './Auth.module.css';

const Auth = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      authCtx.login(code);
    }
    if(authCtx.token) {
      navigate('/home')
    } else if(!authCtx.token) {
      navigate('/')
    }

    return () => {
      console.log("end");
    };
  }, [authCtx]);

  return (
    <Card>
      <div className={styles.auth}>
        <h1>Instagram Login</h1>
        <Link to="https://api.instagram.com/oauth/authorize?client_id=329023239730678&redirect_uri=https://localhost:3000/&scope=user_profile,user_media&response_type=code">
          {props.login}
        </Link>
      </div>
    </Card>
  );
};

export default Auth;
