import Feed from "./Feed";
import styles from "./FeedList.module.css";
import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { useNavigate, Link, useParams } from "react-router-dom";
import dateList from "./atom/dateList";
import Loading from "./UI/Loading";

const mediaUrl = `/media?fields=id,media_type,media_url,username,caption,permalink,timestamp&access_token=`;

const FeedList = () => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { yearList } = useParams();

  console.log(authCtx);

  const getMediaData = useCallback(() => {
    setLoading(true);
    try {
      console.log(
        `https://graph.instagram.com/${authCtx.id}${mediaUrl}${authCtx.token}`
      );
      axios
        .get(
          `https://graph.instagram.com/${authCtx.id}${mediaUrl}${authCtx.token}`
        )
        .then((res) => {
          const { data } = res.data;
          console.log(data);
          const newList = [];
          for (const key in data) {
            newList.push({
              id: data[key].id,
              url: data[key].media_url,
              type: data[key].media_type,
              year: new Date(data[key].timestamp).getFullYear().toString(),
              date: (new Date(data[key].timestamp).getMonth() + 1).toString(),
              day: new Date(data[key].timestamp).getDate().toString(),
            });
          }
          setLoading(false);
          setUserName(data[0].username);
          setLists(newList);
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
    } else if (!authCtx.token) {
      navigate("/");
    }
    return () => {
      console.log("end");
    };
  }, [authCtx.token, getMediaData, navigate]);

  let itemTime = lists.map((data) => data.year);

  let dateArray = itemTime.reduce((list, item) => {
    return list.includes(item) ? list : [...list, item];
  }, []);

  const content = lists
    .filter((data) => data.year.includes(yearList))
    .map((list) => (
      <Feed
        slideItem={list.type === "CAROUSEL_ALBUM" ? styles.album : ''}
        type={list.type}
        id={list.id}
        key={list.id}
        url={list.url}
        alt={list.alt}
        month={list.date}
        day={list.day}
        filter={true}
      />
    ));

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.container}>
            <h1>{yearList}</h1>
          <ul className={styles.list}>{content}</ul>
          <div className={styles.actions}>
            <Link to="../">
              <button>Back</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedList;
