import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "./state/store";
import { setDifficulty, setGameState, setRestart } from './state/game/gameSlice';
import { BoardTypes } from './models/BoardTypes';
import { Difficulty } from './models/Difficulty';
import Board from './components/board/Board';
import './App.css';


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const gameState = useSelector((state: RootState) => state.game.gameState);

  return (
    <div className="App">
      <div className="info-text">Choose a difficulty</div>
      {gameState === 'not-started' && (<div className='btn-container'>
          {BoardTypes.map((boardType, index) => <button className='btn btn-difficulty' key={index} onClick={() => {
            dispatch(setDifficulty(boardType.difficulty as Difficulty));
            dispatch(setGameState('started'));
            }}>{boardType.difficulty as Difficulty}</button>)}
        </div>)}
      {gameState !== 'not-started' && <Board/>}
      {gameState === 'won' && <div className='info info__won' onClick={() => {dispatch(setRestart())}}>You have Won 😎</div>}
      {gameState === 'lost' && <div className='info info__lost' onClick={() => {dispatch(setRestart())}}>You have Lost 😫</div>}
 
    </div>
  );
}

export default App;
