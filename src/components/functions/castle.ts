import { BoardState } from "../../types/types";

export const castle = (
    boardState: BoardState,
    target: number,
): BoardState => {

    const newBoardState = [...boardState];

    switch (target) {
        case 2:
            newBoardState[3] = boardState[0];
            newBoardState[0] = null;
            break;
        case 6:
            newBoardState[5] = boardState[7];
            newBoardState[7] = null;
            break;
        case 58:
            newBoardState[59] = boardState[56];
            newBoardState[56] = null;
            break;
        case 62:
            newBoardState[61] = boardState[63];
            newBoardState[63] = null;
    }

    return newBoardState;

};