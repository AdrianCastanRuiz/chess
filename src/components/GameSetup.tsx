import { useEffect, useState } from "react";
import Board from "./Board";
import { BoardState, Color } from "../types/types";

const GameSetup = () => {

    const [turn, setTurn] = useState<Color>('white');
    const [boardState, setBoardState] = useState<(BoardState)>(Array(64).fill(null));
    const [resetBoard, setResetBoard] = useState<boolean>(false);
const resetGame = ()=>{
    setResetBoard(!resetBoard);
    setTurn('white');
}

    useEffect(() => {

        const figures = {
            white: [
                '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖',
                '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'
            ],
            black: [
                '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
                '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'
            ]
        };

        const initialBoard = Array(64).fill(null);
        for (let i = 0; i < 8; i++) {
            initialBoard[i] = { figure: figures.black[i], color: 'black' };
            initialBoard[i + 8] = { figure: figures.black[8], color: 'black' };
            initialBoard[i + 48] = { figure: figures.white[8], color: 'white' };
            initialBoard[i + 56] = { figure: figures.white[i], color: 'white' };
        }
        setBoardState(initialBoard);

    }, [resetBoard]);
    return (
        <>

            <Board
                turn={turn}
                boardState={boardState}
                setBoardState={setBoardState}
                setTurn={setTurn}
                resetGame={resetGame}
            />

        </>
    );
};

export default GameSetup;
