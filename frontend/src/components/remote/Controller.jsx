import { useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import Effect from "./Effect";
import MusicSearchbar from "./MusicSearchbar";
import MSearchResult from "./M_SearchResult";
import Record from "./Record";
import Styles from "./remote.module.css";
import styles2 from "../roomin/Room.module.css";
import axios from "axios";
import WaitingList from "./WaitingList";
import Swal from "sweetalert2";

function Controller({
  sendYTUrl,
  setOpenFirework,
  setstartDream,
  setstartGoodDay,
  roomseq,
  sendClap,
  sendTambourine,
  sendFire
}) {
  const [show, setShow] = useState(false);

  const startbookList = () => {
    sendYTUrl();
  };

  // 리모콘 끄기
  function hideControl() {
    setShow(false);
  }

  // 노래 검색 기능
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  const [searchitem, setSearchitem] = useState("");
  const [searchresult, setSearchresult] = useState([]);
  const params = {
    key: apiKey,
    part: "snippet",
    // TJ노래방 channelId: "UCZUhx8ClCv6paFW7qi3qljg",
    // JW 노래방 channelId
    channelId: "UC58ttsbMu6kCeWRrEsDI2ww",
    channelType: "any",
    q: searchitem,
    type: "video",
    maxResults: 30,
  };

  const failed = () => {
    Swal.fire({
      icon: "error",
      title: "요청 실패",
      text: "에러가 발생했습니다.",
    });
  };

  const searchMusic = () => {
    console.log("검색어", searchitem);
    axios
      .get("https://www.googleapis.com/youtube/v3/search", { params })
      .then((res) => {
        setSearchresult(res.data.items);
        // console.log(res.data.items);
        console.log(searchresult);
      })
      .catch(() => {
        failed();
      });
  };

  const resetSearch = () => {
    setSearchresult([]);
  };

  return (
    <div>
      <button
        className={styles2.neon}
        onClick={() => {
          setShow(true);
          resetSearch();
        }}
      >
        {" "}
        리모콘{" "}
      </button>

      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        size="xl"
        dialogClassName="modal-90w"
      >
        <div className={Styles.modalposition}>
          <div className={Styles.remotebg}>
            <ModalHeader closeButton></ModalHeader>
            <ModalBody>
              {/* 검색창 */}
              <div className={Styles.searchpage}>
                {/* 검색 */}
                <MusicSearchbar
                  setSearchitem={setSearchitem}
                  searchMusic={searchMusic}
                />
                {/* 검색 결과 */}
                <MSearchResult items={searchresult} roomseq={roomseq} />
              </div>

              {/* 버튼창 */}
              <div className={Styles.remotepage}>
                {/* 기타 효과 - 템포, 에코, 음성, 조명, 필터, 박수 북, 폭죽, 좋아요 등  */}
                <div className={Styles.effectpage}>
                  <Effect
                    setOpenFirework={setOpenFirework}
                    hideControl={hideControl}
                    sendClap={sendClap}
                    sendTambourine={sendTambourine}
                    sendFire={sendFire}
                  />
                </div>
                {/* 노래 관련 버튼 */}
                <div>
                  {/* 북마크 목록 */}
                  <button className={Styles.bookmarklist}>BookMark</button>
                  <button className={Styles.songstart} onClick={startbookList}>
                    시작
                  </button>
                  <button
                    className={Styles.songdelete}
                    onClick={() => {
                      setstartDream(false);
                      setstartGoodDay(false);
                    }}
                  >
                    취소
                  </button>
                  {/* 녹화 시작/중지 */}
                  <Record />
                  {/* 노래 예약, 삭제, 목록 */}
                  <div>
                    {/* <button className={Styles.booklist}>예약 목록</button> */}
                    <WaitingList roomseq={roomseq} />
                    <button className={Styles.book}>예약</button>
                  </div>
                </div>
              </div>
            </ModalBody>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Controller;
