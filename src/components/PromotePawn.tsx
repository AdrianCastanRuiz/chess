import { Color, Figure } from "../types/types";
import styles from './PromotePawn.module.css';

interface PromotePawnProps {
    turn: Color;
    handlePromotion: any;
}

const PromotePawn = ({
    turn,
    handlePromotion
}: PromotePawnProps) => {
    const whiteFigures = ['♖', '♘', '♗', '♕'];
    const blackFigures = ['♜', '♞', '♝', '♛'];

    return (
        <div className={styles.container}>
            {turn === 'white'
                ? whiteFigures.map((f) => (
                    <span
                        key={f}
                        onClick={() => handlePromotion(f as Figure)}
                        className={styles.figure}
                    >
                        {f}
                    </span>
                ))
                : blackFigures.map((f) => (
                    <span
                        key={f}
                        onClick={() => handlePromotion(f as Figure)}
                        className={styles.figure}
                    >
                        {f}
                    </span>
                ))}
        </div>
    );
};

export default PromotePawn;
