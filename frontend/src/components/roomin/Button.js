import styles from "./Room.module.css";


function Button ({text, modal}){
        
    return (
        <div >
            <button className={styles.btn, styles.neon}
            >{text}</button>
        </div>
    )

}


export default Button;