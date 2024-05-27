import Feed from "./Feed";
import styles from "./Home.module.css";
import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { useNavigate, Link, useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Loading from "./UI/Loading";

const mediaUrl = `/media?fields=id,media_type,media_url,username,caption,permalink,timestamp,thumbnail_url&access_token=`;

const Home = () => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();
  const { yearList } = useParams();

  const getMediaData = useCallback(() => {
    setLoading(true);
    try {
      console.log(
        `https://graph.instagram.com/${authCtx.id}${mediaUrl}${authCtx.token}`
      );
      axios
        .get(
          `https://graph.instagram.com/${authCtx.id}${mediaUrl}${authCtx.token}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(),
          }
        )
        .then((res) => {
          const { data } = res.data;
          console.log(data);
          const newList = [];
          for (const key in data) {
            newList.push({
              id: data[key].id,
              url: data[key].media_url,
              thumbnail_url: data[key].thumbnail_url && data[key].thumbnail_url,
              type: data[key].media_type,
              year: new Date(data[key].timestamp).getFullYear().toString(),
              month: (new Date(data[key].timestamp).getMonth() + 1).toString(),
              day: new Date(data[key].timestamp).getDate().toString(),
            });
          }
          secureLocalStorage.setItem("username", data[0].username);
          setLists(newList);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [authCtx.id, authCtx.token]);

  useEffect(() => {
    if (authCtx.token) {
      getMediaData();
    }
    return () => {
      console.log("end");
    };
  }, [authCtx.token, getMediaData, navigate]);

  return (
    <div className={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.list}>
          {lists.map((list) => (
            <Feed
              slideItem={list.type === "CAROUSEL_ALBUM" ? styles.album : ""}
              type={list.type}
              thumbnail={list.thumbnail_url}
              id={list.id}
              key={list.id}
              url={list.url}
              alt={list.alt}
              year={list.year}
              month={list.month}
              day={list.day}
              filter={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
