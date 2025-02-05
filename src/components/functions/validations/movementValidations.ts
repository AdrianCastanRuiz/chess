import { BoardState, Color, Piece, RockStatus } from "../../../types/types";
import { isKingInCheck } from "./isKingInCheck";
import { isPathClear } from "./isPathClear";

export const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];

export const isOneStepMove = (
    origin: number,
    target: number
)=>{
    
    const rowOrigin = Math.floor(origin / 8);
    const colOrigin = origin % 8;
    const rowTarget = Math.floor(target / 8);
    const colTarget = target % 8;

    return Math.abs(rowTarget - rowOrigin) <= 1 && Math.abs(colTarget - colOrigin) <= 1;


}

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
    color: Color,
    lastPawnMoved?: number | null,
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
        (captureMoves.includes(target - origin) &&
        (boardState[target]) &&
        boardState[target].color !== color) || 
        (lastPawnMoved && Math.abs(target - lastPawnMoved) === 8)
    ) {
        const originColumn = origin % 8;
        const targetColumn = target % 8;

        if (
            (originColumn === 0 && targetColumn === 7) || 
            (originColumn === 7 && targetColumn === 0)    
        ) {
            return false; 
        }

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
    color: Color,
    whiteKingMoved?: boolean,
    blackKingMoved?: boolean,
    whiteRookMoved?: RockStatus,
    blackRookMoved?: RockStatus,
): boolean => {
   
    if (isOneStepMove(origin, target)) {
        const targetPiece = boardState[target];
        if (targetPiece && targetPiece.color === color) {
            // No puedes moverte a una casilla ocupada por tu propia pieza
            return false;
        }

        // Simular el movimiento y verificar si el rey está en jaque
        const simulatedBoard = [...boardState];
        simulatedBoard[target] = simulatedBoard[origin];
        simulatedBoard[origin] = null;

        if (isKingInCheck(target, simulatedBoard, color)) {
            return false;
        }
        return true;
    }

    // Verificar enroque
    if (color === "white" && !whiteKingMoved) {
        // Enroque largo (blancas)
        if (target === 58 && !whiteRookMoved?.left) {
            if (
                !isPathClear(origin, target - 1, boardState, 0, -1) || 
                isKingInCheck(origin, boardState, color) || 
                isKingInCheck(origin - 1, boardState, color) || 
                isKingInCheck(origin - 2, boardState, color)
            ) {
                return false;
            }
            return true;
        }

        // Enroque corto (blancas)
        if (target === 62 && !whiteRookMoved?.right) {
            if (
                !isPathClear(origin, target + 1, boardState, 0, 1) || 
                isKingInCheck(origin, boardState, color) || 
                isKingInCheck(origin + 1, boardState, color) || 
                isKingInCheck(origin + 2, boardState, color)
            ) {
                return false;
            }
            return true;
        }
    }

    if (color === "black" && !blackKingMoved) {
        // Enroque largo (negras)
        if (target === 2 && !blackRookMoved?.left) {
            if (
                !isPathClear(origin, target - 1, boardState, 0, -1) || 
                isKingInCheck(origin, boardState, color) || 
                isKingInCheck(origin - 1, boardState, color) || 
                isKingInCheck(origin - 2, boardState, color)
            ) {
                return false;
            }
            return true;
        }

        // Enroque corto (negras)
        if (target === 6 && !blackRookMoved?.right) {
            if (
                !isPathClear(origin, target + 1, boardState, 0, 1) || 
                isKingInCheck(origin, boardState, color) || 
                isKingInCheck(origin + 1, boardState, color) || 
                isKingInCheck(origin + 2, boardState, color)
            ) {
                return false;
            }
            return true;
        }
    }

    // Si no es un movimiento válido, retorna falso
    return false;
};


