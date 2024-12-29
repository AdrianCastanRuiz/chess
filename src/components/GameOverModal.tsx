import styles from './GameOver.module.css'

interface GameOverProps {
    winner: 'White' | 'Black',
    reason: string,
    resetValues: any,
    }
 const GameOverModal = ({winner, reason, resetValues}: GameOverProps)=> {

    
    return(
        <div className={styles.container}>
            <p>{winner} wins by {reason}</p> 
            <button className={styles.button} onClick={resetValues}>Start new game</button>               
        </div>
    )
}

export default GameOverModal;