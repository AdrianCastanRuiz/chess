import { useState } from 'react';
import styles from './Board.module.css';
import { BoardState, Color, Piece, SelectedPiece } from '../types/types';
import { isLegalMove } from '../movement-validations/index.ts';

interface BoardProps {
    turn: Color;
    boardState: (null | Piece)[];
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
    setTurn: React.Dispatch<React.SetStateAction<Color>>;
}

const Board = ({ turn, boardState, setBoardState, setTurn }: BoardProps) => {

    const [selectedPiece, setSelectedPiece] = useState<null | SelectedPiece>(null);

    const handleSquareClick = (index: number) => {
        const clickedPiece = boardState[index];

        // Selección de una pieza
        if (clickedPiece && clickedPiece.color === turn) {
            setSelectedPiece({ index, piece: clickedPiece });
            return;
        }

        // Movimiento de una pieza
        if (selectedPiece) {

            const target = index;

            if (!isLegalMove(selectedPiece, boardState, target, turn)) return;

            const newBoardState = [...boardState];
            newBoardState[selectedPiece.index] = null; 
            newBoardState[index] = selectedPiece.piece; 
            setBoardState(newBoardState);
            setSelectedPiece(null); 
            setTurn(turn === 'white' ? 'black' : 'white'); 
        }
    };

    const squares = [];
    for (let i = 0; i < 64; i++) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const piece = boardState[i];

        squares.push(
            <div
                id={"square" + i}
                key={i}
                className={`${styles.square} ${(row + col) % 2 === 0 ? styles.black : styles.white} ${
                    selectedPiece?.index === i ? styles.selected : ''
                }`}
                onClick={() => handleSquareClick(i)}
            >
                {piece && (
                    <span className={styles.chessIcon}>
                        {piece.figure}
                    </span>
                )}
            </div>
        );
    }

    return <div className={styles.board}>{squares}</div>;
};

export default Board;
