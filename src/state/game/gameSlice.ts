import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameStateType } from "../../models/GameStateType";
import { Difficulty } from "../../models/Difficulty";
import { Cell as CellModel } from "../../models/Cell";
import { ClickAction } from "../../models/ClickAction";

interface GameState {
  gameState: GameStateType;
  difficulty: Difficulty;
  board: CellModel[][] | null;
  flags: number;
  mines: number;
  }
  
  const initialState: GameState = {
    gameState: 'not-started',
    difficulty: 'easy',
    board: null,
    flags: 0,
    mines: 0
  };
  
  const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
      setGameState: (state, action: PayloadAction<GameStateType>) => {
        console.log(action.payload);
        
        state.gameState = action.payload;
      },
      setDifficulty: (state, action: PayloadAction<Difficulty>) => {
        state.difficulty = action.payload;
      },
      setBoard: (state, action: PayloadAction<CellModel[][]>) => {
        state.board = action.payload;
      },
      setCell: (state, action: PayloadAction<ClickAction>) => {
        if (state.gameState === 'lost' || state.gameState === 'won') {
          return;
        }
        const [rowInd, cellInd, covered] = action.payload;
        const copyOfBoard = JSON.parse(JSON.stringify(state.board));

        if (covered === 'flagged') {
          copyOfBoard[rowInd][cellInd].covered === 'flagged' ? copyOfBoard[rowInd][cellInd].covered = 'undiscovered' : copyOfBoard[rowInd][cellInd].covered = covered;
        } else {
          copyOfBoard[rowInd][cellInd].covered = covered;
          copyOfBoard[rowInd][cellInd].isClicked = true;
          
          if (copyOfBoard[rowInd][cellInd].isMine) {
            state.gameState = 'lost';
          }
        }
        checkSurroundingEmptyCells(rowInd, cellInd, copyOfBoard);
        state.board = copyOfBoard;
      },
      setNumberOfMines: (state, action: PayloadAction<number>) => {
        state.mines = action.payload;
      },
      setNumberOfFlags: (state, action: PayloadAction<number>) => {
        state.flags += action.payload;
      },
      setRestart: (state) => {
        state.gameState = 'not-started';
        state.difficulty = 'easy';
        state.board = null;
        state.flags = 0;
        state.mines = 0
      }
    },
  });

  // later it can be moved into the setCell function body
  const isGameWon = (flags: number, mines: number, gameBoard: CellModel[][]): boolean => {
    return flags === mines && gameBoard!.flat().filter((cell: CellModel) => cell.covered === 'flagged').every((cell: CellModel) => cell.isMine);
  }

  const checkSurroundingEmptyCells = (rowIndex: number, colIndex: number, board: CellModel[][]): void => {
    // const directions = [[-1, 0], [1, 0]];
    if (!board) {
        return;
    }
    
    if (rowIndex - 1 >= 0 && board[rowIndex - 1][colIndex].covered === 'undiscovered' && !board[rowIndex - 1][colIndex].isMine && board[rowIndex - 1][colIndex].surroundingMines === 0) {
      board[rowIndex - 1][colIndex].covered = 'discovered';
      checkSurroundingEmptyCells(rowIndex - 1, colIndex, board);
    }
    if (rowIndex + 1 < board.length && board[rowIndex + 1][colIndex].covered === 'undiscovered' && !board[rowIndex + 1][colIndex].isMine && board[rowIndex + 1][colIndex].surroundingMines === 0) {
      board[rowIndex + 1][colIndex].covered = 'discovered';
      checkSurroundingEmptyCells(rowIndex + 1, colIndex, board);
    }

    if (colIndex - 1 >= 0 && board[rowIndex][colIndex - 1].covered === 'undiscovered' && !board[rowIndex][colIndex - 1].isMine && board[rowIndex][colIndex - 1].surroundingMines === 0) {
      board[rowIndex][colIndex - 1].covered = 'discovered';
      checkSurroundingEmptyCells(rowIndex, colIndex - 1, board);
    }

    if (colIndex + 1 < board[rowIndex].length && board[rowIndex][colIndex + 1].covered === 'undiscovered' && !board[rowIndex][colIndex + 1].isMine && board[rowIndex][colIndex + 1].surroundingMines === 0) {
      board[rowIndex][colIndex + 1].covered = 'discovered';
      checkSurroundingEmptyCells(rowIndex, colIndex + 1, board);
    }
  }
  
  export const { setDifficulty, setGameState, setBoard, setCell, setNumberOfMines, setNumberOfFlags, setRestart } = gameSlice.actions;
  
  export default gameSlice.reducer;