import React from "react";
import { useState, useCallback } from "react";
import axios from "axios";
import oauth from "axios-oauth-client";
import secureLocalStorage  from  "react-secure-storage";

const AuthContext = React.createContext({
  token: "",
  id: "",
  username : "",
  detail : false,
  itemId: "",
  itemType: "",
  login: (code) => {},
  logout: () => {},
  onDetail: (id) => {},
  onBack: () => {},
});

const clientId = process.env.REACT_APP_CLIENT_ID
const clientSecret = process.env.REACT_APP_CLIENT_SECRET
const redirectUri = window.location.hostname === 'localhost' ? 'https://localhost:3000/' : "https://kjh9852-react-insta.netlify.app/";

export const AuthContextProvider = (props) => {
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [detail, setDetail] = useState(false);
  const [itemId , setItemId] = useState("");
  const [itemType, setItemType] = useState("");
  
  const calculateRemainingTime = () => {
    const currentTime = new Date().getTime();
    const adjustExpirationTiem = new Date().getTime();

    const remainingDuration = adjustExpirationTiem - currentTime;
    
    return remainingDuration;
  };

  const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const stroedUserKey = localStorage.getItem('key');

    
  };

  const PROXY = window.location.hostname === 'localhost' ? '' : '/proxy';

  const loginHandler = useCallback(async (code) => {
    try {
      const url = `${PROXY}/oauth/access_token`;
      const getAuthorizationCode = oauth.client(axios.create(), {
        url,
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      });
      const data = await getAuthorizationCode();

      setAccessToken(data["access_token"]);
      setUserId(data["user_id"]);
      secureLocalStorage.setItem('key', data["user_id"])
      secureLocalStorage.setItem('token', data["access_token"])
      setDetail(false);

      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logoutHandler = () => {
    setAccessToken(null);
    setUserId(null);
    secureLocalStorage.removeItem('token');
    secureLocalStorage.removeItem('key');
  };

  const detailHandler = (type) => {
    setItemType(type);
  };

  const backHandler = () => {
    setDetail(false);
  };
  // useEffect(() => {
  //   const code = new URL(window.location.href).searchParams.get("code");
  //   console.log(code);
  //   if (code) {
  //     loginHandler(code);
  //   }
  //   return () => {
  //     console.log("end");
  //   };
  // }, [loginHandler]);
  console.log(itemType);

  const contextValue = {
    token: secureLocalStorage.getItem('token'),
    id: secureLocalStorage.getItem('key'),
    itemId,
    username: AuthContext.username,
    itemType: itemType,
    login: loginHandler,
    logout: logoutHandler,
    detail: detail,
    onDatail: detailHandler,
    onBack: backHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;