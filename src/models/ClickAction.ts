export type ClickAction = [
    rowIndex: number, 
    cellIndex: number, 
    covered: 'undiscovered' | 'flagged' | 'discovered'
];