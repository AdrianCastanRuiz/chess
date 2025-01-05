export type Color = 'white' | 'black';

export type WhiteFigure = '♖' |'♘' | '♗' | '♕' | '♔' | '♙';

export type BlackFigure = '♜'| '♞' | '♝' | '♛' | '♚' | '♟';

export type Figure = WhiteFigure | BlackFigure;

export interface Piece {
    color: Color,
    figure: Figure,
};

export interface SelectedPiece {
    index: number,
    piece: Piece,
};

export type BoardState = (Piece | null)[];

export interface RockStatus {
    left: boolean,
    right: boolean,
};
