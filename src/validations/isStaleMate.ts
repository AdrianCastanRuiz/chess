import { BoardState, Color } from "../types/types";
import { isKingInCheck } from "./isKingInCheck";
import { getPossibleTargets } from "./getPossibleTargets";

export const isStaleMate = (
    kingPosition: number,
    boardState: BoardState,
    turn: Color
): boolean => {
    // Si el rey está en jaque, no es ahogado.
    if (isKingInCheck(kingPosition, boardState, turn)) return false;

    // Filtrar las piezas del turno actual.
    const pieces = boardState
        .map((piece, index) => ({ piece, index }))
        .filter(({ piece }) => piece && piece.color === turn);

    // Revisar si hay algún movimiento válido que saque al rey del ahogado.
    for (const { piece, index } of pieces) {
        const possibleTargets = getPossibleTargets(index, piece!, boardState);

        for (const target of possibleTargets) {
            // Clonar el tablero para simular el movimiento.
            const simulatedBoard = [...boardState];
            simulatedBoard[target] = simulatedBoard[index];
            simulatedBoard[index] = null;

            // Calcular nueva posición del rey, en caso de que se haya movido.
            const newKingPosition =
                piece?.figure === "♔" || piece?.figure === "♚" ? target : kingPosition;

            // Si el movimiento deja al rey fuera de peligro, no es ahogado.
            if (!isKingInCheck(newKingPosition, simulatedBoard, turn)) {
                return false;
            }
        }
    }

    // Si no hay movimientos válidos, es ahogado.
    return true;
};
