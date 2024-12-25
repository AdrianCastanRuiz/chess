import { Color, Piece, SelectedPiece } from "../types/types";
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
    turn: Color
): boolean => {
    const origin = selectedPiece.index;
    const { figure, color } = selectedPiece.piece;

    if (color !== turn) return false;

    const kingPosition = boardState.findIndex(
        piece => piece?.figure === (turn === 'white' ? '♔' : '♚')
    );

    const isInCheck = isKingInCheck(kingPosition, boardState, turn);

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
            console.log("ola")
            isValidMove = isKingMoveLegal(origin, targetIndex, boardState, color);
            console.log(isValidMove)
            break;

        default:
            return false;
    }

    if (!isValidMove) return false;

    // Si el rey está en jaque, comprobar que el movimiento lo resuelve
    if (isInCheck) {
        console.log("hola")
        const simulatedBoard = [...boardState];
        simulatedBoard[targetIndex] = simulatedBoard[origin];
        simulatedBoard[origin] = null;

        const newKingPosition =
            figure === '♔' || figure === '♚' ? targetIndex : kingPosition;

            console.log(newKingPosition)

        if (isKingInCheck(newKingPosition, simulatedBoard, turn)) {
            return false; // El movimiento no resuelve el jaque
        }
    }

    return true;
};
