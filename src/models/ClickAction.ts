import { CoverType } from "./CoverType";

export type ClickAction = [
    rowIndex: number, 
    cellIndex: number, 
    covered: CoverType
];