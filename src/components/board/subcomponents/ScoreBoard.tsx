import { Timer } from "./Timer";
import { RootState } from "../../../state/store";
import { useSelector } from "react-redux";

export function ScoreBoard(props: any) {
    const gameState = useSelector((state: RootState) => state.game.gameState);
    const getClassForScoreBoard = () => {
        return `score-title ${props.remainingMines < 0 ? 'more-flags-error': ''}`;
    }

    return (
        <div className="score-board">
            <Timer toggle={gameState === 'started'} />
            <div className="score-face">
                { gameState === 'started' ? '😄' : gameState === 'won' ? '😎' : '🥴' }</div>
            <div>
                <span className={getClassForScoreBoard()}>Mines left: {props.remainingMines}</span>
            </div>
        </div>
    )
}

