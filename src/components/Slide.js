import axios from "axios";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import AuthContext from "../store/auth-context";
import Feed from "./Feed";
import Loading from "./UI/Loading";
import { useNavigate } from "react-router-dom";
import styles from "./Slide.module.css";

const mediaUrl = `/media?fields=id,media_type,media_url,username,caption,account_type,permalink,timestamp&access_token=`;

const Slide = ({ filterYear }) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState();
  const [lists, setLists] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [trans, setTrans] = useState(0);
  const [count, setCount] = useState();

  // slide btn
  const onClickL = () => {
    if (trans >= 0) {
      return;
    }
    setTrans((current) => current + 264);
  };

  const onClickR = () => {
    if (trans <= (count - 3) * - 264) {
      return;
    }
    setTrans((current) => current - 264);
  };

  // callback Ref
  const ref = (elem) => {
    if (elem) {
      const Elementcount = elem.childNodes.length;
      setCount(Elementcount);
    }
  };

  // data load
  const getMediaData = useCallback(() => {
    setLoading(true);
    try {
      axios
        .get(
          `https://graph.instagram.com/${authCtx.id}${mediaUrl}${authCtx.token}`
        )
        .then((res) => {
          const { data } = res.data;
          const newList = [];
          for (const key in data) {
            newList.push({
              id: data[key].id,
              url: data[key].media_url,
              type: data[key].media_type,
              year: new Date(data[key].timestamp).getFullYear().toString(),
              month: (new Date(data[key].timestamp).getMonth() + 1).toString(),
              day: new Date(data[key].timestamp).getDate().toString(),
            });
          }
          setUserName(data[0].username);
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

  // 최초 렌더링
  useEffect(() => {
    if (authCtx.token) {
      getMediaData();
    } else if (!authCtx.token) {
      navigate("/");
    }
  }, [authCtx.token, getMediaData, navigate]);

  // fetch data map
  const content = lists.map((list) => (
    <Feed
      slideItem={list.type === "CAROUSEL_ALBUM" ? `${styles.slide__item} ${styles.album}` : styles.slide__item}
      type={list.type}
      id={list.id}
      key={list.id}
      url={list.url}
      alt={list.alt}
      filter={list.year === filterYear ? true : false}
      month={list.month}
      day={list.day}
    />
  ));

  return (
    <div className={styles.container}>
      <div className={styles.feed__show}>
        {loading ? (
          <Loading />
        ) : (
          <div
            className={styles.slide}
            style={{ transform: `translateX(${trans}px)` }}
            ref={ref}
          >
            {content}
          </div>
        )}
      </div>
      {count > 3 &&
      <div className={styles.actions}>
        <button className={styles.leftBtn} onClick={onClickL}>
          <i class="fas fa-caret-square-left"></i>
        </button>
        <button className={styles.rightBtn} onClick={onClickR}>
          <i class="fas fa-caret-square-right"></i>
        </button>
      </div>
       }
    </div>
  );
};

export default Slide;
