import { Color, Piece, RockStatus, SelectedPiece } from "../types/types";
import { isKingInCheck } from "./isKingInCheck";
import {
    isBishopMoveLegal,
    isKingMoveLegal,
    isKnightMoveLegal,
    isPawnMoveLegal,
    isQueenMoveLegal,
    isRockMoveLegal
} from "./movementValidations";

export const isLegalMove = (
    selectedPiece: SelectedPiece,
    boardState: (Piece | null)[],
    targetIndex: number,
    turn: Color,
    whiteKingMoved?: boolean,
    blackKingMoved?: boolean,
    whiteRookMoved?: RockStatus,
    blackRookMoved?: RockStatus
): boolean => {
    const origin = selectedPiece.index;
    const { figure, color } = selectedPiece.piece;

    if (color !== turn) return false;

    let isValidMove = false;

    switch (figure) {
        case "♘":
        case "♞":
            isValidMove = isKnightMoveLegal(origin, targetIndex, boardState, color);
            break;

        case "♙":
        case "♟":
            isValidMove = isPawnMoveLegal(origin, targetIndex, boardState, color);
            break;

        case "♗":
        case "♝":
            isValidMove = isBishopMoveLegal(origin, targetIndex, boardState, color);
            break;

        case "♖":
        case "♜":
            isValidMove = isRockMoveLegal(origin, targetIndex, boardState, color);
            break;

        case "♕":
        case "♛":
            isValidMove = isQueenMoveLegal(origin, targetIndex, boardState, color);
            break;

        case "♔":
        case "♚":
            isValidMove = isKingMoveLegal(origin, targetIndex, boardState, color, whiteKingMoved, blackKingMoved, whiteRookMoved, blackRookMoved);
            break;

        default:
            return false;
    }

    if (!isValidMove) return false;


    const simulatedBoard = [...boardState];
    simulatedBoard[targetIndex] = simulatedBoard[origin];
    simulatedBoard[origin] = null;

    const kingPosition = simulatedBoard.findIndex(
        piece => piece?.figure === (turn === 'white' ? '♔' : '♚')
    );



    if (isKingInCheck(kingPosition, simulatedBoard, turn)) {
        return false;
    }


    return true;
};
