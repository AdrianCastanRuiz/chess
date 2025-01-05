import { useState } from 'react';
import styles from './Board.module.css';
import { BlackFigure, BoardState, Color, Piece, RockStatus, SelectedPiece, WhiteFigure } from '../types/types';
import { isLegalMove } from './functions/validations/index.ts';
import GameOverModal from './GameOverModal.tsx';
import PromotePawn from './PromotePawn.tsx';
import { enemyKingStatus } from './functions/enemyKingStatus.ts';
import { isOneStepMove } from './functions/validations/movementValidations.ts';
import { castle } from './functions/castle.ts';
import { handleRoockMove } from './functions/handleRoockMove.ts';

interface BoardProps {
    turn: Color;
    boardState: (null | Piece)[];
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>;
    setTurn: React.Dispatch<React.SetStateAction<Color>>;
    resetGame: () => void;
}

const Board = ({ turn, boardState, setBoardState, setTurn, resetGame }: BoardProps) => {
    const [selectedPiece, setSelectedPiece] = useState<null | SelectedPiece>(null);
    const [check, setIsCheck] = useState<'♔' | '♚' | ''>('');
    const [whiteKingMoved, setWhiteKingMoved] = useState<boolean>(false);
    const [blackKingMoved, setBlackKingMoved] = useState<boolean>(false);
    const [whiteRookMoved, setWhiteRookMoved] = useState<RockStatus>({ left: false, right: false });
    const [blackRookMoved, setBlackRookMoved] = useState<RockStatus>({ left: false, right: false });
    const [lastPawnMoved, setLastPawnMoved] = useState<number | null>(null);
    const [promotionModal, setPromotionModal] = useState<boolean>(false);
    const [promotionIndex, setPromotionIndex] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState<string>('');

    const resetValues = () => {
        setSelectedPiece(null);
        setIsCheck('');
        setWhiteKingMoved(false);
        setBlackKingMoved(false);
        setWhiteRookMoved({ left: false, right: false });
        setBlackRookMoved({ left: false, right: false });
        setLastPawnMoved(null);
        setPromotionModal(false);
        setPromotionIndex(null);
        setGameOver('');
        resetGame();
    };

    const handleSquareClick = (index: number) => {
        if (gameOver || promotionModal) return;

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

            if (
                !isLegalMove(
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

            let newBoardState = [...boardState];

            if ((figure === '♖' || figure === '♜')) {
                handleRoockMove(
                    setWhiteRookMoved,
                    setBlackRookMoved,
                    origin
                );

            }



            if (
                (figure === '♟' || figure === '♙') &&
                lastPawnMoved &&
                Math.abs(target - lastPawnMoved) === 8 &&
                Math.abs(origin - lastPawnMoved) === 1
            ) {
                newBoardState[lastPawnMoved!] = null;
            }

            if ((figure === '♟' || figure === '♙') && (Math.floor(target / 8) === 0 || Math.floor(target / 8) === 7)) {
                setPromotionModal(true);
                setPromotionIndex(target);
                return;
            }

            newBoardState[origin] = null;
            newBoardState[target] = selectedPiece.piece;
            if ((figure === '♔' || figure === '♚') && !isOneStepMove(origin, target)) {
                newBoardState = castle(newBoardState, target);
            }

            if ((figure === '♙' || figure === '♟') && Math.abs(origin - target) === 16) {
                setLastPawnMoved(target);
            } else {
                setLastPawnMoved(null);
            }

            setBoardState(newBoardState);

            enemyKingStatus(newBoardState, turn === 'white' ? 'black' : 'white', setGameOver, setIsCheck);

            setSelectedPiece(null);
            setTurn(turn === 'white' ? 'black' : 'white');
        }
    };

    const handlePromotion = (figure: WhiteFigure | BlackFigure) => {

        if (promotionIndex === null || !selectedPiece) return;

        const newBoardState = [...boardState];
        newBoardState[promotionIndex] = { color: turn, figure };
        newBoardState[selectedPiece.index] = null;
        setBoardState(newBoardState);
        setPromotionIndex(null);
        setSelectedPiece(null);
        enemyKingStatus(newBoardState, turn === 'white' ? 'black' : 'white', setGameOver, setIsCheck);
        setPromotionModal(false);
        setTurn(turn === 'white' ? 'black' : 'white');
    };

    const squares = [];
    for (let i = 0; i < 64; i++) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const piece = boardState[i];

        squares.push(
            <div
                id={`square${i}`}
                key={i}
                className={`  
                    ${styles.square} ${(row + col) % 2 === 0 ? styles.black : styles.white} 
                    ${selectedPiece?.index === i ? styles.selected : ''}
                    ${check && piece?.figure === check ? styles.kingIsInCheck : ''}
                `}
                onClick={() => handleSquareClick(i)}
            >
                {piece && <span className={styles.chessIcon}>{piece.figure}</span>}
            </div>
        );
    }

    return (
        <>
            <div className={styles.board}>{squares}</div>
            {gameOver && <GameOverModal description={gameOver} resetValues={resetValues} />}
            {promotionModal && (
                <PromotePawn
                    turn={turn}
                    handlePromotion={handlePromotion}
                />
            )}
        </>
    );
};

export default Board;
