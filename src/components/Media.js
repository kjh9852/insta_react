import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import FeedList from "./FeedList";
import AuthContext from "../store/auth-context";
import Loading from "./UI/Loading";
import dateList from "./atom/dateList";
import { useNavigate, Link } from "react-router-dom";
import Feed from "./Feed";
import Slide from "./Slide";
import styles from "./Media.module.css";

const mediaUrl = `/media?fields=id,username,timestamp&access_token=`;

const Media = ({ filter }) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const getMediaData = useCallback(async() => {
    setLoading(true);
    try {
      await axios
        .get(
          `https://graph.instagram.com/${authCtx.id}${mediaUrl}${authCtx.token}`
        )
        .then((res) => {
          const { data } = res.data;
          const newList = [];
          for (const key in data) {
            newList.push({
              id: data[key].id,
              year: new Date(data[key].timestamp).getFullYear().toString(),
            });
          }
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
    } else if (!authCtx.token) {
      navigate("/");
    }

    return () => {
      console.log("end");
    };
  }, [authCtx.token, getMediaData, navigate]);

  let itemTime = lists.map((data) => data.year);

  const dateArray = itemTime.reduce((list, item) => {
    return list.includes(item) ? list : [...list, item];
  }, []);
  // 배열 중 같은 날짜가 있으면 하나의 배열로 리턴

  return (
    <div className={styles.container}>
      {loading ? <Loading/> : dateArray.map((date) => (
        <div className={styles.container} key={date}>
          <h1 className={styles.date}>
            <Link to={`../${date}`}>
              <i class="fas fa-external-link-alt"></i>{date}
              </Link>
          </h1>
          <Slide filterYear={date} />
        </div>
      ))}
    </div>
  );
};

export default Media;
