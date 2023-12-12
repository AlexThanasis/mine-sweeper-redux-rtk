export interface Cell {
    covered: 'undiscovered' | 'flagged' | 'discovered';
    isMine: boolean;
    surroundingMines?: number;
    isClicked?: boolean;
}