import { useEffect } from 'react';
import './Board.css';
import { Cell as CellModel } from '../../models/Cell';
import { BoardTypes } from '../../models/BoardTypes';
import Cell from '../cell/Cell';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { setBoard, setGameState, setNumberOfMines } from '../../state/game/gameSlice';
import { Difficulty } from '../../models/Difficulty';
import { ScoreBoard } from './subcomponents/ScoreBoard';

function Board() {
    const dispatch = useDispatch();
    const difficulty = useSelector((state: RootState) => state.game.difficulty);
    const gameBoard = useSelector((state: RootState) => state.game.board);
    const flags = useSelector((state: RootState) => state.game.flags);
    const mines = useSelector((state: RootState) => state.game.mines);

    useEffect(() => {
        if (difficulty) {
            dispatch(setBoard(createBoard(difficulty)));
            dispatch(setNumberOfMines(BoardTypes.find(type => type.difficulty === difficulty)?.mines || 0));
        }
    }, [difficulty]);

    useEffect(() => {
        if (gameBoard?.length !== undefined && isGameWon(flags, mines, gameBoard!)) {
            dispatch(setGameState('won'));
        }
    }, [gameBoard]);
    
    const isGameWon = (flags: number, mines: number, gameBoard: CellModel[][]): boolean => {
      return gameBoard && flags === mines && gameBoard!.flat().filter((cell: CellModel) => cell.covered === 'flagged').every((cell: CellModel) => cell.isMine);
    }

    const createBoard = (difficulty: Difficulty): CellModel[][] => {
        const selectedDifficulty = BoardTypes.find(diff => diff.difficulty === difficulty);
        return creatingNumbersForEmptyCell(Array(selectedDifficulty!.mines)
            .fill(undefined)
            .map(u => {return { isMine: true, covered: 'undiscovered' };})
            .concat(Array(selectedDifficulty!.width * selectedDifficulty!.height - selectedDifficulty!.mines)
            .fill(undefined)
            .map(_ => {return { isMine: false, covered: 'undiscovered' };}))
            .sort(() => Math.random() - 0.5)
            .reduce((rows: any, key: any, i: number) => (i % selectedDifficulty!.width === 0 ? rows.push([key]) : rows[rows.length-1].push(key)) && rows, []));
    };

    const creatingNumbersForEmptyCell = (gameBoard: CellModel[][]): CellModel[][] => {
      gameBoard.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
        if (!cell.isMine) {
            const surroundingCellsTemp = [
              rowIndex - 1 >= 0 && colIndex - 1 >= 0 && gameBoard[rowIndex - 1][colIndex - 1]?.isMine,
              rowIndex - 1 >= 0 && gameBoard[rowIndex - 1][colIndex]?.isMine, 
              rowIndex - 1 >= 0 && colIndex < row.length && gameBoard[rowIndex - 1][colIndex + 1]?.isMine, 
              colIndex - 1 >= 0 && gameBoard[rowIndex][colIndex - 1]?.isMine, 
              colIndex < row.length &&  gameBoard[rowIndex][colIndex + 1]?.isMine, 
              rowIndex < gameBoard.length - 1 && colIndex - 1 >= 0 && gameBoard[rowIndex + 1][colIndex - 1]?.isMine, 
              rowIndex < gameBoard.length - 1 && gameBoard[rowIndex + 1][colIndex]?.isMine,
              rowIndex < gameBoard.length - 1 && colIndex < row.length && gameBoard[rowIndex + 1][colIndex + 1]?.isMine
            ].filter(isMine => isMine).length;
          cell.surroundingMines = surroundingCellsTemp;
        }
      }
      ))
      return gameBoard;
    }

    return (
        <>
          <ScoreBoard remainingMines={mines - flags} />
          <div className="board">
          {gameBoard && gameBoard.length > 0 && gameBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                  {row && row.length > 0 && row.map((cell, cellIndex) => <Cell 
                      key={rowIndex * 10 + cellIndex}
                      cell={cell}
                      rowIndex={rowIndex}
                      cellIndex={cellIndex}
                      ></Cell> )}
                  </div>
              ))}
          </div>
        </>
    )
}

export default Board;