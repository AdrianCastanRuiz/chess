import { BoardState, Color } from "../../types/types";
import { isCheckMate } from "./validations/isCheckMate";
import { isKingInCheck } from "./validations/isKingInCheck";
import { isStaleMate } from "./validations/isStaleMate";

export const enemyKingStatus = (
    boardState: BoardState,
    color: Color,
    setGameOver: React.Dispatch<React.SetStateAction<string>>,
    setIsCheck: React.Dispatch<React.SetStateAction<'♔' | '♚' | ''>>,

) => {

    const kingPosition = boardState.findIndex(
        (piece) => piece?.figure === (color === 'white' ? '♔' : '♚')
    );

    if (isKingInCheck(kingPosition, boardState, color)) {
        if (isCheckMate(kingPosition, boardState, color)) {
            setGameOver(`${color} wins by checkmate.`);
        }
        setIsCheck(color === 'white' ? '♔' : '♚');
    } else {
        setIsCheck('');
    }

    if (isStaleMate(kingPosition, boardState, color)) {
        setGameOver('Draw due to stalemate.');
    }
}