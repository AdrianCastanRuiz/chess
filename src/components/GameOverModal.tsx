import { Color } from "../types/types"
import styles from './GameOver.module.css'

interface GameOverProps {
    winner: Color,
    reason: string,
    setGameOver: any
    }
 const GameOverModal = ({winner, reason, setGameOver}: GameOverProps)=> {
    return(
        <div className={styles.container}>
            <p>{winner} wins by {reason}</p> 
            <button onClick={()=>setGameOver(null)}>Start new game</button>               
        </div>
    )
}

export default GameOverModal;