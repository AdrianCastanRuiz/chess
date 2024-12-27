import { BoardState, Color, Piece } from "../types/types";


const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];


export const getPossibleTargets = (
    index: number,
    piece: Piece,
    boardState: BoardState
): number[] => {
    const { figure, color } = piece;

    switch (figure) {
        case "♘":
        case "♞":
            return getKnightMoves(index);
        case "♙":
        case "♟":
            return getPawnMoves(index, boardState, color);
        case "♗":
        case "♝":
            return getBishopMoves(index, boardState, color);
        case "♖":
        case "♜":
            return getRookMoves(index, boardState, color);
        case "♕":
        case "♛":
            return getQueenMoves(index, boardState, color);
        default:
            return [];
    }
};

const getKnightMoves = (index: number): number[] => {
    return knightMoves
        .map(offset => index + offset)
        .filter(pos => pos >= 0 && pos < 64);
};

const getPawnMoves = (index: number, boardState: BoardState, color: Color): number[] => {
    const direction = color === 'white' ? -8 : 8;
    const startRow = color === 'white' ? 6 : 1;
    const moves: number[] = [];

    // Avanzar una casilla
    if (!boardState[index + direction]) {
        moves.push(index + direction);
    }

    // Avanzar dos casillas desde la posición inicial
    if (Math.floor(index / 8) === startRow && !boardState[index + direction * 2]) {
        moves.push(index + direction * 2);
    }

    // Capturas diagonales
    [-1, 1].forEach(offset => {
        const target = index + direction + offset;
        if (boardState[target] && boardState[target]?.color !== color) {
            moves.push(target);
        }
    });

    return moves;
};

const getBishopMoves = (index: number, boardState: BoardState, color: Color): number[] => {
    return getDirectionalMoves(index, boardState, color, [9, -9, 7, -7]);
};

const getRookMoves = (index: number, boardState: BoardState, color: Color): number[] => {
    return getDirectionalMoves(index, boardState, color, [1, -1, 8, -8]);
};

const getQueenMoves = (index: number, boardState: BoardState, color: Color): number[] => {
    return getDirectionalMoves(index, boardState, color, [1, -1, 8, -8, 9, -9, 7, -7]);
};

const getDirectionalMoves = (
    index: number,
    boardState: BoardState,
    color: Color,
    directions: number[]
): number[] => {
    const moves: number[] = [];

    for (const direction of directions) {
        let current = index + direction;

        while (current >= 0 && current < 64) {
            const rowDiff = Math.abs(Math.floor(current / 8) - Math.floor((current - direction) / 8));
            if (rowDiff > 1 && (direction === 1 || direction === -1)) break;

            const targetPiece = boardState[current];
            if (targetPiece) {
                if (targetPiece.color !== color) moves.push(current);
                break;
            }

            moves.push(current);
            current += direction;
        }
    }

    return moves;
};