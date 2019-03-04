import React, { useState, useEffect, useContext, useRef } from 'react';
import gameFieldClasses from '../styles/gameField.module.css';
import { GeometricalParameters } from '../context';

const field = () => {
  const geometricalParameters = useContext(GeometricalParameters);
  const fieldDimensions = {
    width: geometricalParameters.numberOfColumns * geometricalParameters.fieldElementSizeInPx,
    height: geometricalParameters.numberOfRowsWithGates * geometricalParameters.fieldElementSizeInPx
  };
  const canvasRef = useRef(null);
  const startingPoint = {
    x: fieldDimensions.width / 2,
    y: fieldDimensions.height / 2
  };
  const [moves, setMoves] = useState([startingPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      let canvasCtx = canvas.getContext('2d');
      fillGrid(canvasCtx);
      canvas.addEventListener('click', handleMove);
    }
    return () => canvas.removeEventListener('click', handleMove);
  }, []);

  useEffect(() => {
    console.log('Hope sth happens...');
    console.log(moves);
  }, [moves]);

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
    const drawMove = (destinationPoint, canvasCtx) => {
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'red';
      const helperArray = [...moves];
      const currentPoint = helperArray[helperArray.length - 1];
      canvasCtx.beginPath();
      canvasCtx.moveTo(currentPoint.x, currentPoint.y);
      canvasCtx.lineTo(destinationPoint.x, destinationPoint.y);
      canvasCtx.stroke();
    };

    const canvas = canvasRef.current;
    if (canvas) {
      const {x, y} = canvas.getBoundingClientRect();
      const xCanvas = event.clientX - x;
      const yCanvas = event.clientY - y;
      const closestGridPoint = findClosestGridIntersectionPoint(xCanvas, yCanvas);

      let canvasCtx = canvas.getContext('2d');
      drawMove(closestGridPoint, canvasCtx);

      const newMoves = [...moves, {
        x: closestGridPoint.x,
        y: closestGridPoint.y
      }];
      setMoves(newMoves);
    }
  };

  const findClosestGridIntersectionPoint = (xCanvas, yCanvas) => {
    return {
      x: findNearestGridCoordinate(xCanvas),
      y: findNearestGridCoordinate(yCanvas)
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

  return (
    <canvas
      ref={canvasRef}
      width={fieldDimensions.width}
      height={fieldDimensions.height}
      className={gameFieldClasses.GameField}
    >
      Sorry, please update/change your browser to see the proper content.
    </canvas>
  );
}

export default field;
