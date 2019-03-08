import React, { useState, useEffect, useContext, useRef } from 'react';
import gameFieldClasses from '../styles/gameField.module.css';
import { GeometricalParameters } from '../context';
import FieldGrid from './FieldGrid';

const PaperSoccer = () => {
  const geometricalParameters = useContext(GeometricalParameters);
  const fieldDimensions = {
    width: geometricalParameters.numberOfColumns * geometricalParameters.fieldElementSizeInPx,
    height: geometricalParameters.numberOfRowsWithGates * geometricalParameters.fieldElementSizeInPx
  };
  const gameCanvasRef = useRef(null);
  const startingPoint = {
    x: fieldDimensions.width / 2,
    y: fieldDimensions.height / 2
  };
  const [moves, setMoves] = useState([startingPoint]);
  const [edges, setEdges] = useState([]);
  const [goals, setGoals] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({
    firstPlayer: true,
    secondPlayer: false
  });
  let winner = null;

  useEffect(
    () => {
      initialFieldData()
    },
    [initialFieldData]
  );

  useEffect(
    () => {
      const gameCanvas = gameCanvasRef.current;
      if (gameCanvas) {
        gameCanvas.addEventListener('click', handleMove);
      }
      return () => gameCanvas.removeEventListener('click', handleMove);
    }
  );

  const handleMove = event => {
    const drawMove = (currentPoint, destinationPoint, canvasCtx) => {
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = currentPlayer.firstPlayer ? 'red' : 'yellow';
      canvasCtx.beginPath();
      canvasCtx.moveTo(currentPoint.x, currentPoint.y);
      canvasCtx.lineTo(destinationPoint.x, destinationPoint.y);
      canvasCtx.stroke();
    };

    const canvas = gameCanvasRef.current;
    if (canvas) {
      let canvasCtx = canvas.getContext('2d');
      
      const canvasPoint = getCanvasPoint(event, canvas);
      const currentPoint = getCurrentPoint(); 
      const closestGridPoint = findClosestGridIntersectionPoint(canvasPoint);
      
      const newEdge = {
        x1: currentPoint.x,
        y1: currentPoint.y,
        x2: closestGridPoint.x,
        y2: closestGridPoint.y
      };
      if (isPointChosenCorrectly(closestGridPoint) && isEdgeFree(newEdge)) {
        drawMove(currentPoint, closestGridPoint, canvasCtx);

        const newMoves = [...moves, {
          x: closestGridPoint.x,
          y: closestGridPoint.y
        }];
        setMoves(newMoves);

        const oldEdges = [...edges];
        const newEdges = [...edges, newEdge];
        setEdges(newEdges);

        if (isCurrentMoveAGoal(closestGridPoint)) {
          const winner = currentPlayer.firstPlayer ? '1' : '2';
          alert('Player ' + winner + ' has won!');
        }
        else if (isNoPossibleMoveForCurrentPlayer(oldEdges, closestGridPoint)) {
          setCurrentPlayer({
            firstPlayer: !currentPlayer.firstPlayer,
            secondPlayer: !currentPlayer.secondPlayer
          });
        }
      }
    }
  };

  const isCurrentMoveAGoal = closestGridPoint => {
    const index = goals.findIndex(goal => {
      return (goal.x === closestGridPoint.x) && (goal.y === closestGridPoint.y);
    });
    return index !== -1;
  };

  const isNoPossibleMoveForCurrentPlayer = (edgesTakenBeforeCurrentMove, closestGridPoint) => {
    const index = edgesTakenBeforeCurrentMove.findIndex(edge => {
      return (edge.x1 === closestGridPoint.x &&
          edge.y1 === closestGridPoint.y) ||
          (edge.x2 === closestGridPoint.x &&
          edge.y2 === closestGridPoint.y)
    });
    return index === -1;
  };

  const getCanvasPoint = (event, canvas) => {
    const {x, y} = canvas.getBoundingClientRect();
    return {
      x: event.clientX - x,
      y: event.clientY - y
    };
  };

  const getCurrentPoint = () => {
    const helperArray = [...moves];
    return helperArray[helperArray.length - 1];
  };

  const findClosestGridIntersectionPoint = canvasPoint => {
    return {
      x: findNearestGridCoordinate(canvasPoint.x),
      y: findNearestGridCoordinate(canvasPoint.y)
    };
  };

  const findNearestGridCoordinate = coordinate => {
    const fieldElementSize = geometricalParameters.fieldElementSizeInPx;
    const totalDivision = Math.floor(coordinate / fieldElementSize);
    const smallerGridCoordinate = totalDivision * fieldElementSize;
    const biggerGridCoordinate = (totalDivision + 1) * fieldElementSize;
    return (coordinate - smallerGridCoordinate) < (biggerGridCoordinate - coordinate)
      ? smallerGridCoordinate : biggerGridCoordinate;
  };

  const isPointChosenCorrectly = closestGridPoint => {
    const currentPoint = getCurrentPoint();
    const xDiff = currentPoint.x - closestGridPoint.x;
    const yDiff = currentPoint.y - closestGridPoint.y;
    const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return distance <= (Math.SQRT2 * geometricalParameters.fieldElementSizeInPx);
  };

  const isEdgeFree = newEdge => {
    const index = edges.findIndex(edge => {
      return (edge.x1 === newEdge.x1 &&
          edge.y1 === newEdge.y1 &&
          edge.x2 === newEdge.x2 &&
          edge.y2 === newEdge.y2
        ) || (
          edge.x1 === newEdge.x2 &&
          edge.y1 === newEdge.y2 &&
          edge.x2 === newEdge.x1 &&
          edge.y2 === newEdge.y1
        );
    });
    return index === -1;
  };

  const initialFieldData = () => {
    excludeBordersFromPossibleMoves();
    initialGoals();
  };

  // Strange behaviour - when transformed to 'function excludeBordersFromPossibleMoves()'
  // (for 'was used before defined' error) Chrome was using sooo much CPU.
  // Moreover, it is possible to draw lines on already drawn lines.
  const excludeBordersFromPossibleMoves = () => {
    const excludeTopGate = () => {
      const leftH = {
        x1: fieldDimensions.width / 2,
        y1: 0,
        x2: (fieldDimensions.width / 2) - geometricalParameters.fieldElementSizeInPx,
        y2: 0
      };
      const rightH = {
        x1: fieldDimensions.width / 2,
        y1: 0,
        x2: (fieldDimensions.width / 2) + geometricalParameters.fieldElementSizeInPx,
        y2: 0
      };
      const leftV = {
        x1: (fieldDimensions.width / 2) - geometricalParameters.fieldElementSizeInPx,
        y1: 0,
        x2: (fieldDimensions.width / 2) - geometricalParameters.fieldElementSizeInPx,
        y2: geometricalParameters.fieldElementSizeInPx
      };
      const rightV = {
        x1: (fieldDimensions.width / 2) + geometricalParameters.fieldElementSizeInPx,
        y1: 0,
        x2: (fieldDimensions.width / 2) + geometricalParameters.fieldElementSizeInPx,
        y2: geometricalParameters.fieldElementSizeInPx
      };
      return [leftH, rightH, leftV, rightV];
    };
    const excludeBottomGate = () => {
      const leftH = {
        x1: fieldDimensions.width / 2,
        y1: fieldDimensions.height,
        x2: (fieldDimensions.width / 2) - geometricalParameters.fieldElementSizeInPx,
        y2: fieldDimensions.height
      };
      const rightH = {
        x1: fieldDimensions.width / 2,
        y1: fieldDimensions.height,
        x2: (fieldDimensions.width / 2) + geometricalParameters.fieldElementSizeInPx,
        y2: fieldDimensions.height
      };
      const leftV = {
        x1: (fieldDimensions.width / 2) - geometricalParameters.fieldElementSizeInPx,
        y1: fieldDimensions.height,
        x2: (fieldDimensions.width / 2) - geometricalParameters.fieldElementSizeInPx,
        y2: fieldDimensions.height - geometricalParameters.fieldElementSizeInPx
      };
      const rightV = {
        x1: (fieldDimensions.width / 2) + geometricalParameters.fieldElementSizeInPx,
        y1: fieldDimensions.height,
        x2: (fieldDimensions.width / 2) + geometricalParameters.fieldElementSizeInPx,
        y2: fieldDimensions.height - geometricalParameters.fieldElementSizeInPx
      };
      return [leftH, rightH, leftV, rightV];
    };
    const excludeHorizontalBorder = (yConstant) => {
      const excludedEdges = [];
      for(let i = 0; i < ((geometricalParameters.numberOfColumns / 2) - 1); i++) {
        let x = i * geometricalParameters.fieldElementSizeInPx;
        excludedEdges.push({
          x1: x, y1: yConstant,
          x2: x + geometricalParameters.fieldElementSizeInPx, y2: yConstant
        });
      }
      for(let i = 0; i < ((geometricalParameters.numberOfColumns / 2) - 1); i++) {
        let x = fieldDimensions.width - i * geometricalParameters.fieldElementSizeInPx;
        excludedEdges.push({
          x1: x, y1: yConstant,
          x2: x - geometricalParameters.fieldElementSizeInPx, y2: yConstant
        });
      }
      return excludedEdges;
    };
    const excludeVerticalBorder = (xConstant) => {
      const excludedEdges = [];
      for(let i = 0; i < (geometricalParameters.numberOfRowsWithGates - 2); i++) {
        let y = (i + 1) * geometricalParameters.fieldElementSizeInPx;
        excludedEdges.push({
          x1: xConstant, y1: y,
          x2: xConstant, y2: y + geometricalParameters.fieldElementSizeInPx
        });
      }
      return excludedEdges;
    };

    const excludedTG = excludeTopGate();
    const excludedBG = excludeBottomGate();
    const excludedTB = excludeHorizontalBorder(geometricalParameters.fieldElementSizeInPx);
    const excludedBB = excludeHorizontalBorder(fieldDimensions.height - geometricalParameters.fieldElementSizeInPx);
    const excludedLB = excludeVerticalBorder(0);
    const excludedRB = excludeVerticalBorder(fieldDimensions.width);
    const excludedEdges = [
      ...edges,
      ...excludedTG,
      ...excludedBG,
      ...excludedTB,
      ...excludedBB,
      ...excludedLB,
      ...excludedRB
    ];
    setEdges(excludedEdges);
  };

  const initialGoals = () => {
    const getGateGoals = (yConstant) => {
      const topGateGoals = [];
      for (let i = 0; i < 3; i++) {
        topGateGoals.push({
          x: (fieldDimensions.width / 2) - (1 - i) * geometricalParameters.fieldElementSizeInPx,
          y: yConstant
        });
      }
      return topGateGoals;
    };

    const topGateGoals = getGateGoals(0);
    const bottomGateGoals = getGateGoals(fieldDimensions.height);
    const gameGoals = [
      ...topGateGoals,
      ...bottomGateGoals
    ];
    setGoals(gameGoals);
  };

  return (
    <>
      <FieldGrid />
      <div className={gameFieldClasses.GameDiv}>
        <canvas
          ref={gameCanvasRef}
          width={fieldDimensions.width}
          height={fieldDimensions.height}
          className={gameFieldClasses.Game}
        >
          Here should you see the moves showing up!
        </canvas>
      </div>
    </>
  );
}

export default PaperSoccer;
