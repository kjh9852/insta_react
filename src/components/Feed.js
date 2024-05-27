import axios from "axios";
import { useState, useContext } from "react";
import AuthContext from "../store/auth-context";
import styles from "./Feed.module.css";
import { useNavigate, Link } from "react-router-dom";

const Feed = ({
  id,
  url,
  alt,
  year,
  month,
  day,
  thumbnail,
  type,
  feed_style,
  filter,
  slideItem,
}) => {
  const authCtx = useContext(AuthContext);
  const [albumList, setAlbumList] = useState([]);
  const navigate = useNavigate();

  const onDetailHandler = () => {
    authCtx.onDatail(type);
  };

  const content = (
    <div
      onClick={onDetailHandler}
      className={slideItem ? `${slideItem} ${styles.feed}` : styles.feed}
    >
      <Link to={`/feeds/${id}`}>
        <div className={styles.imageContainer}>
          {type === "VIDEO" ? (
            <img src={thumbnail} alt={alt} />
          ) : (
            <img src={url} alt={alt} />
          )}
        </div>
        <div className={styles.subTitle}>
          <span>
            {year && year + "."}
            {month.length === 1 ? "0" + month + "." : month + "."}
            {day.length === 1 ? "0" + day : day}
          </span>
        </div>
      </Link>
    </div>
  );

  return <>{filter && content}</>;
};

export default Feed;
