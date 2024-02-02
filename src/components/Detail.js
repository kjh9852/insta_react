import React, { useState, useContext, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, EffectCards } from "swiper/modules";
import Loading from "./UI/Loading";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "./DetailSwiper.css";
import styles from "./Detail.module.css";
import axios from "axios";
import AuthContext from "../store/auth-context";
import { useNavigate, useParams } from "react-router-dom";

const Detail = (props) => {
  const [loading, setLoading] = useState();
  const [albumList, setAlbumList] = useState([]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const onBackHandler = () => {
    authCtx.onBack();
    navigate("/home");
  };

  console.log(authCtx);

  const onFeedDetail = useCallback(() => {
    setLoading(true);
    const id = params.feedId;
    const detailUrl =
      authCtx.itemType === "CAROUSEL_ALBUM"
        ? `https://graph.instagram.com/${id}/children?fields=media_url,media_type&access_token=${authCtx.token}`
        : `https://graph.instagram.com/${id}/?fields=media_url,media_type&access_token=${authCtx.token}`;

    console.log(detailUrl);

    axios.get(detailUrl).then((res) => {
      const itemList = [];
      const datas = res.data.data;
      const { data } = res;
      console.log(data);
      if (datas) {
        for (const key in datas) {
          itemList.push({
            id: datas[key].id,
            url: datas[key].media_url,
            type: datas[key].media_type,
          });
        }
      } else {
        itemList.push({
          id: data.id,
          url: data.media_url,
          type: data.media_type,
        });
      }
      setLoading(false);
      setAlbumList(itemList);
      console.log(itemList);
    });
  }, [authCtx.token, authCtx.itemType, params.feedId]);

  useEffect(() => {
    onFeedDetail();
  }, [onFeedDetail]);

  let content;

  if (albumList.length > 0 && !loading) {
    content = albumList.map((list) => (
      <SwiperSlide key={list.id}>
        {list.type === "IMAGE" && (
          <img src={list.type === "IMAGE" && list.url} alt="" />
        )}
        {list.type === "VIDEO" && (
          <video controls>
            <source src={list.type === "VIDEO" && list.url} type="video/mp4" />
          </video>
        )}
      </SwiperSlide>
    ));
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section>
          <Swiper
            className={styles.detail}
            effect={"cards"}
            grabCursor={true}
            modules={[Navigation, Pagination, A11y, EffectCards]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            {content}
          </Swiper>
          <div className={styles.actions}>
            <button onClick={onBackHandler}>Back</button>
          </div>
        </section>
      )}
    </>
  );
};

export default Detail;
