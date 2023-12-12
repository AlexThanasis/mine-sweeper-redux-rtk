import { CoverType } from "./CoverType";

export interface Cell {
    covered: CoverType;
    isMine: boolean;
    surroundingMines?: number;
    isClicked?: boolean;
}