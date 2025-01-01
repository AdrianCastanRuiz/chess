import { BoardState, Color } from "../types/types";
import { isKingInCheck } from "./isKingInCheck";
import { getPossibleTargets } from "./getPossibleTargets";

export const isStaleMate = (
    kingPosition: number,
    boardState: BoardState,
    turn: Color
): boolean => {
    if (isKingInCheck(kingPosition, boardState, turn)) return false;

    const pieces = boardState
        .map((piece, index) => ({ piece, index }))
        .filter(({ piece }) => piece && piece.color === turn);

    for (const { piece, index } of pieces) {
        const possibleTargets = getPossibleTargets(index, piece!, boardState);

        for (const target of possibleTargets) {
            const simulatedBoard = [...boardState];
            simulatedBoard[target] = simulatedBoard[index];
            simulatedBoard[index] = null;

            const newKingPosition =
                piece?.figure === "♔" || piece?.figure === "♚" ? target : kingPosition;

            if (!isKingInCheck(newKingPosition, simulatedBoard, turn)) {
                return false;
            }
        }
    }

    return true;
};
