import { useState } from 'react';
import styles from './Board.module.css';
import { BoardState, Color, Piece, RockStatus, SelectedPiece, GameOver } from '../types/types';
import { isLegalMove } from '../validations/index.ts';
import { isKingInCheck } from '../validations/isKingInCheck.ts';
import { isCheckMate } from '../validations/isCheckMate.ts';
import GameOverModal from './GameOverModal.tsx';
import { isStaleMate } from '../validations/isStaleMate.ts';

interface BoardProps {
    turn: Color;
    boardState: (null | Piece)[];
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
    setTurn: React.Dispatch<React.SetStateAction<Color>>;
    resetGame: any

}

const Board = ({ turn, boardState, setBoardState, setTurn, resetGame }: BoardProps) => {

    const [selectedPiece, setSelectedPiece] = useState<null | SelectedPiece>(null);
    const [check, setIsCheck] = useState<'♔' | '♚' | ''>('');
    const [whiteKingMoved, setWhiteKingMoved] = useState<boolean>(false);
    const [blackKingMoved, setBlackKingMoved] = useState<boolean>(false);
    const [whiteRookMoved, setWhiteRookMoved] = useState<RockStatus>({ left: false, right: false });
    const [blackRookMoved, setBlackRookMoved] = useState<RockStatus>({ left: false, right: false });
    const [lastPawnMoved, setLastPawnMoved] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState<GameOver | null>(null);

    const resetValues = () => {
        setSelectedPiece(null);
        setIsCheck('');
        setWhiteKingMoved(false);
        setBlackKingMoved(false);
        setWhiteRookMoved({ left: false, right: false });
        setBlackRookMoved({ left: false, right: false });
        setGameOver(null);
        resetGame()
    }
    const handleSquareClick = (index: number) => {
        const clickedPiece = boardState[index];

        if (clickedPiece && clickedPiece.color === turn) {
            setSelectedPiece({ index, piece: clickedPiece });
            return;
        }

        if (selectedPiece) {
            const origin = selectedPiece.index;
            const target = index;
            const { piece } = selectedPiece;
            const { figure } = piece;

            if (figure === '♔' && !whiteKingMoved) setWhiteKingMoved(true);
            if (figure === '♚' && !blackKingMoved) setBlackKingMoved(true);

            if (figure === '♖') {
                if (selectedPiece.index === 56) setWhiteRookMoved(prev => ({ ...prev, left: true }));
                if (selectedPiece.index === 63) setWhiteRookMoved(prev => ({ ...prev, right: true }));
            }
            if (figure === '♜') {
                if (selectedPiece.index === 0) setBlackRookMoved(prev => ({ ...prev, left: true }));
                if (selectedPiece.index === 7) setBlackRookMoved(prev => ({ ...prev, right: true }));
            }


            if (!isLegalMove
                (
                    selectedPiece,
                    boardState,
                    target,
                    turn,
                    whiteKingMoved,
                    blackKingMoved,
                    whiteRookMoved,
                    blackRookMoved,
                    lastPawnMoved
                )
            ) {
                return;
            }
            const newBoardState = [...boardState];



            if ((figure === '♟' || figure === '♙') && lastPawnMoved && Math.abs(target - lastPawnMoved) === 8 &&
                Math.abs(origin - lastPawnMoved) === 1) {

                newBoardState[lastPawnMoved!] = null;

            }
            newBoardState[selectedPiece.index] = null;
            newBoardState[index] = selectedPiece.piece;


            ((figure === '♙' || figure === '♟') && Math.abs(origin - target) === 16) ?
                setLastPawnMoved(target) : setLastPawnMoved(null);

            if (figure === '♔' && (target === 58 || target === 62) && !whiteKingMoved) {

                if (target === 58) {
                    newBoardState[56] = null;
                    newBoardState[59] = { figure: '♖', color: 'white' };
                } else if (target === 62) {
                    newBoardState[63] = null;
                    newBoardState[61] = { figure: '♖', color: 'white' };
                }
            } else if (figure === '♚' && (target === 2 || target === 6) && !blackKingMoved) {

                if (target === 2) {
                    newBoardState[0] = null;
                    newBoardState[3] = { figure: '♜', color: 'black' };
                } else if (target === 6) {
                    newBoardState[7] = null;
                    newBoardState[5] = { figure: '♜', color: 'black' };
                }
            }

            setBoardState(newBoardState);

            const enemyKingPosition = newBoardState.findIndex(
                piece => piece?.figure === (turn === 'white' ? '♚' : '♔')
            );
            if (isKingInCheck(enemyKingPosition, newBoardState, turn === 'white' ? 'black' : 'white')) {
                if (isCheckMate(enemyKingPosition, newBoardState, turn === 'white' ? 'black' : 'white')) {
                    setGameOver({
                        winner: turn === 'white' ? 'White' : 'Black',
                        reason: "checkmate",
                    })
                }
                setIsCheck(turn === 'white' ? '♚' : '♔');
            } else {
                setIsCheck('');
            }

            if(isStaleMate(enemyKingPosition, newBoardState, turn === 'white' ? 'black' : 'white')) alert("stalemate")

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
                    ${check && piece?.figure === check && selectedPiece?.piece.figure === piece.figure ? styles.kingIsInCheckandSelected : ''}
                `}
                onClick={() => handleSquareClick(i)}

            >

                {piece && (
                    <>
                        <span className={styles.chessIcon}>
                            {piece.figure}
                        </span>
                    </>

                )}
            </div>
        );
    }

    return (
        <>
            <div className={styles.board}>{squares}</div>;
            {gameOver && <GameOverModal winner={gameOver.winner} reason={gameOver.reason} resetValues={resetValues} />}
        </>
    )

};

export default Board;
