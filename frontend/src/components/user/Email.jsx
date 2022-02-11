import axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { actionCreators } from "../../store";
import Styles from "./Mypage.module.css";

function Email({ show, onHide, state, DispatchmodifyEmail }) {
  // console.log(props);

  // const [emailShow, setEmailShow] = React.useState(false);

  //변경할 이메일값 받아오기
  const [newemail, setNewemail] = useState("");
  const getEmail = (e) => {
    setNewemail(e.target.value);
    console.log(newemail);
  };

  //변경한 이메일 값 보내기 & 버튼 누르면 창 닫기도록
  const onChangeEmail = () => {
    axios
      .patch(
        "https://i6a306.p.ssafy.io:8080/api/v1/user/email",
        {
          // changed: newemail,
          changed: newemail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // "Authorization" : token,  // -> 승인. 토큰을 넣어 보내야, 백에서 승인해서 보내줌.
            Authorization: state[0].token, // -> 승인. 토큰을 넣어 보내야, 백에서 승인해서 보내줌.
          },
        }
      )
      .then((res) => {
        DispatchmodifyEmail(newemail);
        onHide();
        console.log(res);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <div>
      <Modal show={show} onHide={onHide} size="sm">
        <div className={Styles.EmailModal}>
          <Modal.Body>
            {/* <div style={{textAlign:'center', padding:'5%'}}> */}
            <div style={{ textAlign: "center" }}>
              E-Mail 수정 :{" "}
              <input name="newemail" onChange={getEmail} placeholder="Email" />
              &nbsp;
              {/* 버튼 누르면 모달 종료 어떻게??*/}
              <button
                style={{ borderRadius: "30vh", backgroundColor: "#ffcd438f" }}
                // onClick={onChangeEmail, props.onHide }
                onClick={onChangeEmail}
              >
                수정
              </button>
              <button
                style={{ borderRadius: "30vh", backgroundColor: "#ffcd438f" }}
                // onClick={onChangeEmail, props.onHide }
                onClick={onHide}
              >
                닫기
              </button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    DispatchmodifyEmail: (newEmail) =>
      dispatch(actionCreators.modifyEmail(newEmail)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Email);
