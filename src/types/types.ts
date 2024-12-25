export type Color = 'white' | 'black';
export type WhiteFigure = '♖' |'♘' | '♗' | '♕' | '♔' | '♙';
export type BlackFigure = '♜'| '♞' | '♝' | '♛' | '♚' | '♟';
export interface Piece {
    color: Color,
    figure: WhiteFigure | BlackFigure,
};
export interface SelectedPiece {
    index: number,
    piece: Piece,
}
export type BoardState = (Piece | null)[];
export interface RockStatus {
    left: boolean,
    right: boolean,
}
