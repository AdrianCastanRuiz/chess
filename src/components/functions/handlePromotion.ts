import { Color,Piece,WhiteFigure,BlackFigure,BoardState } from '../../types/types';
import { isKingInCheck } from './validations/isKingInCheck';
import { isCheckMate } from './validations/isCheckMate';
import { isStaleMate } from './validations/isStaleMate';

export const handlePromotion = (
    promotionIndex: number | null,
    boardState: (null | Piece)[],
    turn: Color,
    setBoardState: React.Dispatch<React.SetStateAction<BoardState>>,
    setGameOver: React.Dispatch<React.SetStateAction<string>>,
    setIsCheck: React.Dispatch<React.SetStateAction<'♔' | '♚' | ''>>,
    setPromotionModal: React.Dispatch<React.SetStateAction<boolean>>,
    setPromotionIndex: React.Dispatch<React.SetStateAction<number | null>>,
    setTurn: React.Dispatch<React.SetStateAction<Color>>,
    figure: WhiteFigure | BlackFigure
) => {
    if (promotionIndex === null) return;

    const newBoardState = [...boardState];
    newBoardState[promotionIndex] = { color: turn, figure };
    setBoardState(newBoardState);

    const enemyKingPosition = newBoardState.findIndex(
        (piece) => piece?.figure === (turn === 'white' ? '♚' : '♔')
    );

    if (isKingInCheck(enemyKingPosition, newBoardState, turn === 'white' ? 'black' : 'white')) {
        if (isCheckMate(enemyKingPosition, newBoardState, turn === 'white' ? 'black' : 'white')) {
            setGameOver(`${turn} wins by checkmate.`);
        }
        setIsCheck(turn === 'white' ? '♚' : '♔');
    } else {
        setIsCheck('');
    }

    if (isStaleMate(enemyKingPosition, newBoardState, turn === 'white' ? 'black' : 'white')) {
        setGameOver('Draw due to stalemate.');
    }

    setPromotionModal(false);
    setPromotionIndex(null);
    setTurn(turn === 'white' ? 'black' : 'white');
};
