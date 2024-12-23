import { Color, Piece, SelectedPiece } from "../types/types";
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
    index: number,
    turn: Color
): boolean => {
    const target = index;
    const origin = selectedPiece.index;
    const { figure, color } = selectedPiece.piece;

    if (color !== turn) return false;

    switch (figure) {
        case "♘": 
        case "♞": 
            return isKnightMoveLegal(origin, target, boardState, color);

        case "♙": 
        case "♟": 
            return isPawnMoveLegal(origin, target, boardState, color);

        case "♗": 
        case "♝": 
            return isBishopMoveLegal(origin, target, boardState, color);

        case "♖": 
        case "♜": 
            return isRockMoveLegal(origin, target, boardState, color);

        case "♕":
        case "♛":
            return isQueenMoveLegal(origin, target, boardState, color);
        
        case "♔":
        case "♚":
            return isKingMoveLegal(origin, target, boardState, color);

        default:
            // Otros movimientos de piezas aún no implementados
            return false;
    }
};
