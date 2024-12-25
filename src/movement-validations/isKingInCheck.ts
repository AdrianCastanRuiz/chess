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
            console.log("amenaza peon")
            return true;
        }
    }

    // Verificar amenazas de caballos
    for (const offset of knightMoves) {
        const target = kingPosition + offset;
        if (
            target >= 0 &&
            target < 64 &&
            (boardState[target]?.figure === "♘" || boardState[target]?.figure === "♞") &&
            boardState[target]?.color === enemyColor
        ) {
            console.log("amenaza caballo")

            return true;
        }
    }

    // Verificar amenazas en líneas rectas (torre o dama)
    const directionsStraight = [1, -1, 8, -8];
    for (const direction of directionsStraight) {
        if (isThreatenedInDirection(kingPosition, direction, boardState, enemyColor, ['♖', '♜', '♕', '♛'])) {
            console.log("amenaza torre o dama")

            return true;
        }
    }

    // Verificar amenazas en diagonales (alfil o dama)
    const directionsDiagonal = [9, -9, 7, -7];
    for (const direction of directionsDiagonal) {
        if (isThreatenedInDirection(kingPosition, direction, boardState, enemyColor, ['♗', '♝', '♕', '♛'])) {
            console.log("amenaza alfil o dama")

            return true;
        }
    }

    // Verificar amenaza del otro rey
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
            console.log("amenaza el otro rey")

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
            direction === 8 || direction === -8 || // Movimiento vertical
            (Math.floor(current / 8) === Math.floor(position / 8) && (direction === 1 || direction === -1)) || // Movimiento horizontal en la misma fila
            Math.abs(Math.floor(current / 8) - Math.floor((current - direction) / 8)) === 1 // Movimiento diagonal
        )
    ) {

        const piece = boardState[current];
        if (piece) {
            if (piece.color === enemyColor && threateningPieces.includes(piece.figure)) {
                return true;
            }
            break; // Si hay una pieza bloqueando, detenemos la búsqueda
        }
        current += direction;
    }
    return false;
};
