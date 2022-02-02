import { Button, Modal, Table } from "react-bootstrap";
import Styles from "./MyVideo.module.css"

function MyVideo(props) {

    return(
        <div>
            <Modal
                {...props}
                size="xl"
                // aria-labelledby="contained-modal-title-vcenter"
                // centered
            >
                <div className={Styles.Myvideobg}>
                    <Modal.Header closeButton >
                        {/* <Modal.Title id="contained-modal-title-vcenter" > */}
                        <div className={Styles.Sh1}>My Video</div>
                        {/* </Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                    <div className={Styles.table}>
                        <Table>
                            <thead className={Styles.tablehead}>
                                <tr>
                                    <th>#</th>
                                    <th>영상</th>
                                    <th>제목</th>
                                </tr>
                            </thead>
                            {/* <tbody className={Styles.tablebody}>
                                <tr>
                                    <th>1</th>
                                    <th><image className={Styles.tableImg} alt="My video"  src=""/></th> */}
                                    {/* <th><video></video></th> */}
                                    {/* <th>던던 댄스 </th>
                                </tr>
                                <tr>
                                    <th>2</th>
                                    <th>종현</th>
                                    <th>02:34</th>
                                </tr>
                                <tr>
                                    <th>3</th>
                                    <th>에스파</th>
                                    <th>Next Level</th>
                                </tr>
                            </tbody> */}
                            <div>
                                <div>
                                    <span>
                                        <image >
                                        </image>
                                    </span>
                                    <span>
                                        <video id="" controls className={Styles.video2}>
                                            <source src='?'></source>
                                        </video>
                                    </span>
                                    <span>
                                        <video id="" controls className={Styles.video3}>
                                            <source src='?'></source>
                                        </video>
                                    </span>
                                </div>
                                <line className={Styles.line}></line>
                                <div>
                                    <span ><p className={Styles.title}>YYYY.MM.DD.hh.mm</p></span>
                                    <span ><p className={Styles.title2}>YYYY.MM.DD.hh.mm</p></span>
                                    <span ><p className={Styles.title3}>YYYY.MM.DD.hh.mm</p></span>
                                </div>

                                <div>
                                    <span>
                                        <video id="" controls className={Styles.video4}>
                                            <source src='?'></source>
                                        </video>
                                    </span>
                                    <span>
                                        <video id="" controls className={Styles.video5}>
                                            <source src='?'></source>
                                        </video>
                                    </span>
                                    <span>
                                        <video id="" controls className={Styles.video6}>
                                            <source src='?'></source>
                                        </video>
                                    </span>
                                </div>
                                <line className={Styles.line2}></line>
                                <div>
                                    <span ><p className={Styles.title4}>YYYY.MM.DD.hh.mm</p></span>
                                    <span ><p className={Styles.title5}>YYYY.MM.DD.hh.mm</p></span>
                                    <span ><p className={Styles.title6}>YYYY.MM.DD.hh.mm</p></span>
                                </div>

                            </div>
                        </Table>
                    </div>
                    </Modal.Body>
                {/* <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer> */}
                </div>
            </Modal>        
        </div>
    )
    
}
export default MyVideo;