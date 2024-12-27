import { BoardState, Color } from "../types/types";
import { knightMoves } from "./movementValidations";

export const isKingInCheck = (
    kingPosition: number,
    boardState: BoardState,
    color: Color,
): boolean => {


    const enemyColor: Color = color === 'white' ? 'black' : 'white';
    const pawnCaptureOffsets: number[] = color === 'white' ? [-9, -7] : [7, 9];

    for (const offset of pawnCaptureOffsets) {
        const target = kingPosition + offset;

        if (
            target >= 0 &&
            target < 64 &&
            Math.abs(Math.floor(kingPosition / 8) - Math.floor(target / 8)) === 1 &&
            (boardState[target]?.figure === '♙' || boardState[target]?.figure === '♟') &&
            boardState[target]?.color === enemyColor
        ) {
            return true;
        }
    }

    for (const offset of knightMoves) {
        const target = kingPosition + offset;
        if (
            target >= 0 &&
            target < 64 &&
            (boardState[target]?.figure === "♘" || boardState[target]?.figure === "♞") &&
            boardState[target]?.color === enemyColor
        ) {

            return true;
        }
    }

    const directionsStraight = [1, -1, 8, -8];
    for (const direction of directionsStraight) {
        if (isThreatenedInDirection(kingPosition, direction, boardState, enemyColor, ['♖', '♜', '♕', '♛'])) {
                console.log("kingposition:", kingPosition, "amenaza: ",boardState[39], "direction:", direction)
               
            return true;
        }
    }

    const directionsDiagonal = [9, -9, 7, -7];
    for (const direction of directionsDiagonal) {
        if (isThreatenedInDirection(kingPosition, direction, boardState, enemyColor, ['♗', '♝', '♕', '♛'])) {


            return true;
        }
    }

    const kingOffsets = [-9, -8, -7, -1, 1, 7, 8, 9];
    for (const offset of kingOffsets) {
        const target = kingPosition + offset;
        if (
            target >= 0 &&
            target < 64 &&
            Math.abs(Math.floor(kingPosition / 8) - Math.floor(target / 8)) <= 1 &&
            boardState[target]?.figure === (enemyColor === 'white' ? '♔' : '♚') &&
            boardState[target]?.color === enemyColor
        ) {

            return true;
        }
    }

    return false;
};

const isThreatenedInDirection = (
    position: number,
    direction: number,
    boardState: BoardState,
    enemyColor: Color,
    threateningPieces: string[]
): boolean => {
    let current = position + direction;

    while (
        current >= 0 &&
        current < 64 &&
        (
            // Validación para movimientos verticales (8, -8)
            (direction === 8 || direction === -8) ||
            // Validación para movimientos horizontales (1, -1)
            ((direction === 1 || direction === -1) && Math.floor(current / 8) === Math.floor(position / 8)) ||
            // Validación para movimientos diagonales (9, -9, 7, -7)
            Math.abs(Math.floor(current / 8) - Math.floor((current - direction) / 8)) === 1
        )
    ) {
        const piece = boardState[current];
        if (piece) {
            if (piece.color === enemyColor && threateningPieces.includes(piece.figure)) {
                console.log("Amenaza detectada en posición: ", current, " por pieza: ", piece);
                return true;
            }
            break; // Detener búsqueda al encontrar cualquier pieza
        }
        current += direction;
    }
    return false;
};
