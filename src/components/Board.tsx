import { useState } from 'react';
import styles from './Board.module.css';
import { BoardState, Color, Piece, RockStatus, SelectedPiece } from '../types/types';
import { isLegalMove } from '../movement-validations/index.ts';
import { isKingInCheck } from '../movement-validations/isKingInCheck.ts';

interface BoardProps {
    turn: Color;
    boardState: (null | Piece)[];
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
    setTurn: React.Dispatch<React.SetStateAction<Color>>;
}

const Board = ({ turn, boardState, setBoardState, setTurn }: BoardProps) => {
    const [selectedPiece, setSelectedPiece] = useState<null | SelectedPiece>(null);
    const [check, setIsCheck] = useState<'♔' | '♚' | '' >('');
    const [whiteKingMoved, setWhiteKingMoved] = useState<boolean>(false);
    const [blackKingMoved, setBlackKingMoved] = useState<boolean>(false);

    const [whiteRookMoved, setWhiteRookMoved] = useState<RockStatus>({ left: false, right: false });
    const [blackRookMoved, setBlackRookMoved] = useState<RockStatus>({ left: false, right: false });

    const handleSquareClick = (index: number) => {
        const clickedPiece = boardState[index];
    
        if (clickedPiece && clickedPiece.color === turn) {
            setSelectedPiece({ index, piece: clickedPiece });
            return;
        }
    
        if (selectedPiece) {
            const target = index;
            const { piece } = selectedPiece;
            const { figure } = piece;
    
            // Actualizar si el rey se mueve
            if (figure === '♔' && !whiteKingMoved) setWhiteKingMoved(true);
            if (figure === '♚' && !blackKingMoved) setBlackKingMoved(true);
    
            // Actualizar si las torres se mueven
            if (figure === '♖') {
                if (selectedPiece.index === 56) setWhiteRookMoved(prev => ({ ...prev, left: true }));
                if (selectedPiece.index === 63) setWhiteRookMoved(prev => ({ ...prev, right: true }));
            }
            if (figure === '♜') {
                if (selectedPiece.index === 0) setBlackRookMoved(prev => ({ ...prev, left: true }));
                if (selectedPiece.index === 7) setBlackRookMoved(prev => ({ ...prev, right: true }));
            }
    
            // Verificar si el movimiento es legal
            if (!isLegalMove(selectedPiece, boardState, target, turn, whiteKingMoved, blackKingMoved, whiteRookMoved, blackRookMoved)) {
                return;
            }
    
            const newBoardState = [...boardState];
            newBoardState[selectedPiece.index] = null;
            newBoardState[index] = selectedPiece.piece;
    
            // Manejar el movimiento de la torre durante el enroque
            if (figure === '♔' && (target === 58 || target === 62) && !whiteKingMoved) {
                // Enroque blanco
                if (target === 58) { // Enroque largo
                    newBoardState[56] = null; // Torre izquierda
                    newBoardState[59] = { figure: '♖', color: 'white' }; // Nueva posición
                } else if (target === 62) { // Enroque corto
                    newBoardState[63] = null; // Torre derecha
                    newBoardState[61] = { figure: '♖', color: 'white' }; // Nueva posición
                }
            } else if (figure === '♚' && (target === 2 || target === 6) && !blackKingMoved) {
                // Enroque negro
                if (target === 2) { // Enroque largo
                    newBoardState[0] = null; // Torre izquierda
                    newBoardState[3] = { figure: '♜', color: 'black' }; // Nueva posición
                } else if (target === 6) { // Enroque corto
                    newBoardState[7] = null; // Torre derecha
                    newBoardState[5] = { figure: '♜', color: 'black' }; // Nueva posición
                }
            }
    
            setBoardState(newBoardState);
    
            // Verificar si el rey enemigo está en jaque
            const enemyKingPosition = newBoardState.findIndex(
                piece => piece?.figure === (turn === 'white' ? '♚' : '♔')
            );
            if (isKingInCheck(enemyKingPosition, newBoardState, turn === 'white' ? 'black' : 'white')) {
                setIsCheck(turn === 'white' ? '♚' : '♔');
            } else {
                setIsCheck('');
            }
    
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
                className={`  
                    ${styles.square} ${(row + col) % 2 === 0 ? styles.black : styles.white} 
                    ${selectedPiece?.index === i ? styles.selected : ''}
                    ${check && piece?.figure === check ? styles.kingIsInCheck : ''}
                `}
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
