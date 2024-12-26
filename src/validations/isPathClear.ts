import { Piece } from "../types/types";

export const isPathClear = (
    origin: number,
    target: number,
    boardState: (Piece | null)[],
    rowDirection: number,
    colDirection: number
): boolean => {
    let currentRow = Math.floor(origin / 8) + rowDirection;
    let currentCol = (origin % 8) + colDirection;

    const rowTarget = Math.floor(target / 8);
    const colTarget = target % 8;

    while (currentRow !== rowTarget || currentCol !== colTarget) {
        const currentIndex = currentRow * 8 + currentCol;
        if (boardState[currentIndex]) {
            return false; 
        }

        currentRow += rowDirection;
        currentCol += colDirection;
    }

    return true; 
};