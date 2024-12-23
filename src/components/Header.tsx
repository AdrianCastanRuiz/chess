import chessImg from "../assets/chessIMG.png"
import styles from "./Header.module.css"

const Header = ()=>{
    return(

        <div className={styles.container}>
            <h1 className={styles.h1}>Chess <img className={styles.img} src={chessImg} /></h1>
        </div>

    )
}

export default Header;