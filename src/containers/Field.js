import React, { useState, useEffect, useContext, useRef } from 'react';
import gameFieldClasses from '../styles/gameField.module.css';
import { GeometricalParameters } from '../context';

const Field = () => {
  const geometricalParameters = useContext(GeometricalParameters);
  const fieldDimensions = {
    width: geometricalParameters.numberOfColumns * geometricalParameters.fieldElementSizeInPx,
    height: geometricalParameters.numberOfRowsWithGates * geometricalParameters.fieldElementSizeInPx
  };
  const fieldCanvasRef = useRef(null);
  const gameCanvasRef = useRef(null);
  const startingPoint = {
    x: fieldDimensions.width / 2,
    y: fieldDimensions.height / 2
  };
  const [moves, setMoves] = useState([startingPoint]);
  const [edges, setEdges] = useState([]);

  useEffect(
    () => {
      const fieldCanvas = fieldCanvasRef.current;
      if (fieldCanvas) {
        let fieldCanvasCtx = fieldCanvas.getContext('2d');
        fillGrid(fieldCanvasCtx);
      }
    },
    [fillGrid]
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

  const fillGrid = canvasCtx => {
    canvasCtx.strokeStyle = 'white';
    for (let i = 0; i < geometricalParameters.numberOfRowsWithGates; i++)
      for (let j = 0; j < geometricalParameters.numberOfColumns; j++)
        if (isGateFragment(i, j)) {
          drawFragment(j, i, canvasCtx);
        } else if (!isGateRow(i)) {
          drawFragment(j, i, canvasCtx);
    }
  };

  const isGateFragment = (rowNumber, columnNumber) => {
    const isColumnNumberInTheMiddle = columnNumber === (geometricalParameters.numberOfColumns / 2) ||
      columnNumber === (geometricalParameters.numberOfColumns / 2 - 1);
    return isGateRow(rowNumber) && isColumnNumberInTheMiddle;
  };

  const isGateRow = rowNumber => {
    return rowNumber === 0 || rowNumber === (geometricalParameters.numberOfRowsWithGates - 1);
  };

  const drawFragment = (columnNumber, rowNumber, canvasCtx) => {
    const gridSize = geometricalParameters.fieldElementSizeInPx;
    const x = columnNumber * gridSize;
    const y = rowNumber * gridSize;
    canvasCtx.strokeRect(x, y, gridSize, gridSize);
  };

  const handleMove = event => {
    const drawMove = (currentPoint, destinationPoint, canvasCtx) => {
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'red';
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

        const newEdges = [...edges, newEdge];
        setEdges(newEdges);
      }
    }
  };

  const getCanvasPoint = (event, canvas) => {
    const {x, y} = canvas.getBoundingClientRect();
    return {
      x: event.clientX - x,
      y: event.clientY - y
    };
  }

  const getCurrentPoint = () => {
    const helperArray = [...moves];
    return helperArray[helperArray.length - 1];
  }

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
  }

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
  }

  return (
    <>
      <div className={gameFieldClasses.FieldDiv}>
        <canvas
          ref={fieldCanvasRef}
          width={fieldDimensions.width}
          height={fieldDimensions.height}
          className={gameFieldClasses.Field}
        >
          Sorry, please update/change your browser to see the proper content.
        </canvas>
      </div>
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

export default Field;
