import { BoardState, Color, Piece, SelectedPiece } from "../types/types";
import { isLegalMove } from ".";
import { isKingInCheck } from "./isKingInCheck";
import { getPossibleTargets } from "./getPossibleTargets";

export const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

export const isCheckMate = (
    kingPosition: number,
    boardState: BoardState,
    color: Color
): boolean => {
    // Movimientos posibles del rey
    const kingOffsets = [-9, -8, -7, -1, 1, 7, 8, 9];

    // Verificar si el rey puede moverse a una casilla segura
    for (const offset of kingOffsets) {
        const target = kingPosition + offset;

        if (
            target >= 0 &&
            target < 64 &&
            Math.abs(Math.floor(kingPosition / 8) - Math.floor(target / 8)) <= 1
        ) {
            const targetPiece = boardState[target];

            // Verificar que no sea una casilla ocupada por una pieza aliada
            if (targetPiece && targetPiece.color === color) {
                continue;
            }

            // Simular el movimiento del rey
            const simulatedBoard = [...boardState];
            simulatedBoard[target] = simulatedBoard[kingPosition];
            simulatedBoard[kingPosition] = null;

            if (!isKingInCheck(target, simulatedBoard, color)) {
                return false; // El rey puede escapar del jaque
            }
        }
    }

    // Verificar si otras piezas pueden salvar al rey
    for (let i = 0; i < 64; i++) {
        const piece = boardState[i];

        if (piece && piece.color === color && piece.figure !== "♔" && piece.figure !== "♚") {
            const possibleTargets = getPossibleTargets(i, piece, boardState);

            for (const target of possibleTargets) {
                // Simular el movimiento
                if (
                    isLegalMove(
                        { index: i, piece },
                        boardState,
                        target,
                        color
                    )
                ) {
                    const simulatedBoard = [...boardState];
                    simulatedBoard[target] = simulatedBoard[i];
                    simulatedBoard[i] = null;

                    // Verificar si el rey sigue en jaque
                    if (!isKingInCheck(kingPosition, simulatedBoard, color)) {
                        return false; // Otro movimiento salva al rey
                    }
                }
            }
        }
    }

    // Si no hay movimientos legales que salven al rey, es jaque mate
    return true;
};

