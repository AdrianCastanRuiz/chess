import { BoardState, Color, Piece } from "../types/types";
import { isKingInCheck } from "./isKingInCheck";
import { isPathClear } from "./isPathClear";

export const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

export const isKnightMoveLegal = (
    origin: number,
    target: number,
    boardState: BoardState,
    color: Color
): boolean => {
    const legalTargets = knightMoves
        .map(offset => origin + offset)
        .filter(pos => pos >= 0 && pos < 64);

    if (legalTargets.includes(target)) {
        const targetPiece = boardState[target];

        return !targetPiece || targetPiece.color !== color;
    }

    return false;
};

export const isPawnMoveLegal = (
    origin: number,
    target: number,
    boardState: BoardState,
    color: Color
): boolean => {
    const direction = color === 'white' ? -8 : 8;
    const startRow = color === 'white' ? 6 : 1;

    if (target === origin + direction && !boardState[target]) {
        return true;
    }

    if (
        Math.floor(origin / 8) === startRow &&
        target === origin + direction * 2 &&
        !boardState[target] &&
        !boardState[origin + direction]
    ) {
        return true;
    }

    const captureMoves = [direction - 1, direction + 1];
    if (
        captureMoves.includes(target - origin) &&
        boardState[target] &&
        boardState[target].color !== color
    ) {
        return true;
    }

    return false;
};

export const isRockMoveLegal = (
    origin: number,
    target: number,
    boardState: BoardState,
    color: Color
): boolean => {
    const rowOrigin = Math.floor(origin / 8);
    const colOrigin = origin % 8;

    const rowTarget = Math.floor(target / 8);
    const colTarget = target % 8;

    const isHorizontalMove = rowOrigin === rowTarget && colOrigin !== colTarget;
    const isVerticalMove = colOrigin === colTarget && rowOrigin !== rowTarget;

    if (!isHorizontalMove && !isVerticalMove) return false;

    const rowDirection = isVerticalMove ? (rowTarget > rowOrigin ? 1 : -1) : 0;
    const colDirection = isHorizontalMove ? (colTarget > colOrigin ? 1 : -1) : 0;

    if (!isPathClear(origin, target, boardState, rowDirection, colDirection)) {
        return false;
    }

    const targetPiece = boardState[target];
    if (targetPiece && targetPiece.color === color) {
        return false;
    }

    return true;
};

export const isBishopMoveLegal = (
    origin: number,
    target: number,
    boardState: BoardState,
    color: Color
): boolean => {
    const rowOrigin = Math.floor(origin / 8);
    const colOrigin = origin % 8;

    const rowTarget = Math.floor(target / 8);
    const colTarget = target % 8;

    if (Math.abs(rowTarget - rowOrigin) !== Math.abs(colTarget - colOrigin)) {
        return false;
    }

    const rowDirection = rowTarget > rowOrigin ? 1 : -1;
    const colDirection = colTarget > colOrigin ? 1 : -1;

    if (!isPathClear(origin, target, boardState, rowDirection, colDirection)) {
        return false;
    }

    const targetPiece = boardState[target];
    if (targetPiece && targetPiece.color === color) {
        return false;
    }

    return true;
};

export const isQueenMoveLegal = (
    origin: number,
    target: number,
    boardState: BoardState,
    color: Color
): boolean => {
    const rowOrigin = Math.floor(origin / 8);
    const colOrigin = origin % 8;

    const rowTarget = Math.floor(target / 8);
    const colTarget = target % 8;

    const isDiagonalMove =
        Math.abs(rowTarget - rowOrigin) === Math.abs(colTarget - colOrigin);

    const isHorizontalMove = rowOrigin === rowTarget && colOrigin !== colTarget;
    const isVerticalMove = colOrigin === colTarget && rowOrigin !== rowTarget;

    if (!isDiagonalMove && !isHorizontalMove && !isVerticalMove) {
        return false;
    }

    const rowDirection = rowTarget > rowOrigin ? 1 : rowTarget < rowOrigin ? -1 : 0;
    const colDirection = colTarget > colOrigin ? 1 : colTarget < colOrigin ? -1 : 0;

    if (!isPathClear(origin, target, boardState, rowDirection, colDirection)) {
        return false;
    }

    const targetPiece = boardState[target];
    if (targetPiece && targetPiece.color === color) {
        return false;
    }

    return true;
};

export const isKingMoveLegal = (
    origin: number,
    target: number,
    boardState: BoardState,
    color: Color
): boolean => {
    const rowOrigin = Math.floor(origin / 8);
    const colOrigin = origin % 8;

    const rowTarget = Math.floor(target / 8);
    const colTarget = target % 8;

    const isOneStepMove =
        Math.abs(rowTarget - rowOrigin) <= 1 && Math.abs(colTarget - colOrigin) <= 1;

    if (!isOneStepMove) return false;

    const targetPiece = boardState[target];
    if (targetPiece && targetPiece.color === color) return false;

    const simulatedBoard = [...boardState];
    simulatedBoard[target] = simulatedBoard[origin];
    simulatedBoard[origin] = null;

    if (isKingInCheck(target, simulatedBoard, color)) return false;
   
    return true;
}




