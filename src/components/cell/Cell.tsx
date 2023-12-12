import { useDispatch } from 'react-redux';
import { setCell, setNumberOfFlags } from '../../state/game/gameSlice';
import './Cell.css';

function Cell(props: any) {
    const dispatch = useDispatch();

    const getElementForCell = (): string => {
        return props.cell.covered === 'flagged'
          ? '🚩'
          : props.cell.isClicked && props.cell.isMine
            ? '💥'
            : (props.cell.isClicked || props.cell.covered === 'discovered') && !props.cell.isMine
              ? getNumberOfBombsSurrounding()
              : props.cell.covered === 'discovered' && props.cell.isMine
                ? '💣'
                : ' ';
      }

    const getNumberOfBombsSurrounding = () => {
        return props.cell.surroundingMines ? `${props.cell.surroundingMines}` : ' ';
    }

    const getClassForCell = (): string => {
        let classString = 'undiscovered';
        
        if (props.cell.covered === 'flagged') {
          classString = 'flagged';
        } else if (props.cell.covered === 'discovered' && !props.cell.isMine) {
          classString = `discovered${props.cell.surroundingMines ? '-' + props.cell.surroundingMines : ''}`;
    
        } else if (props.cell.isClicked && props.cell.isMine) {
          classString = 'explosion';
        }
        return `Cell ${classString}`;
      }

    const onClick = () => {
        dispatch(setCell([props.rowIndex, props.cellIndex, 'discovered']));
    }

    const onContextClick = (event: any) => {
        event.preventDefault();
        if (props.cell.covered !== 'discovered') {
            dispatch(setCell([props.rowIndex, props.cellIndex, 'flagged']));
            dispatch(setNumberOfFlags(props.cell.covered === 'flagged' ? -1 : 1));
        }
    }

    return (
        <div 
            className={getClassForCell()} 
            onClick={() => onClick()}
            onContextMenu={(e) => onContextClick(e)}
        >
            {getElementForCell()}
        </div>
    )
}

export default Cell;