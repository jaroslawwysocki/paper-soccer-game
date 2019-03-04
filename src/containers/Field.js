import React, { useEffect, useContext, useRef } from 'react';
import gameFieldClasses from '../styles/gameField.module.css';
import { GeometricalParameters } from '../context';

const field = () => {
  const geometricalParameters = useContext(GeometricalParameters);
  const fieldDimensions = {
    width: geometricalParameters.numberOfColumns * geometricalParameters.fieldElementSizeInPx,
    height: geometricalParameters.numberOfRowsWithGates * geometricalParameters.fieldElementSizeInPx
  };
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      let canvasCtx = canvas.getContext('2d');
      fillGrid(canvasCtx);
      canvas.addEventListener('click', handleMove);
    }
    return () => canvas.removeEventListener('click', handleMove);
  }, []);

  const fillGrid = canvasCtx => {
    canvasCtx.strokeStyle = 'white';
    for (let i = 0; i < geometricalParameters.numberOfRowsWithGates; i++)
      for (let j = 0; j < geometricalParameters.numberOfColumns; j++)
        if (isGateFragment(i, j)) {
          drawFragment(j, i, canvasCtx);
        } else if (!isGateRow(i)) {
          drawFragment(j, i, canvasCtx);
    }
  }

  const isGateFragment = (rowNumber, columnNumber) => {
    const isColumnNumberInTheMiddle = columnNumber === (geometricalParameters.numberOfColumns / 2) ||
      columnNumber === (geometricalParameters.numberOfColumns / 2 - 1);
    return isGateRow(rowNumber) && isColumnNumberInTheMiddle;
  }

  const isGateRow = rowNumber => {
    return rowNumber === 0 || rowNumber === (geometricalParameters.numberOfRowsWithGates - 1);
  }

  const drawFragment = (columnNumber, rowNumber, canvasCtx) => {
    const gridSize = geometricalParameters.fieldElementSizeInPx;
    const x = columnNumber * gridSize;
    const y = rowNumber * gridSize;
    canvasCtx.strokeRect(x, y, gridSize, gridSize);
  }

  const handleMove = event => {
    const canvas = canvasRef.current;
    if (canvas) {
      const {x, y} = canvas.getBoundingClientRect();
      const xCanvas = event.clientX - x;
      const yCanvas = event.clientY - y;
      const closestGridPoint = findClosestGridIntersectionPoint(xCanvas, yCanvas);
      alert('x = ' + closestGridPoint.x + ', y = ' + closestGridPoint.y);
    }
  }

  const findClosestGridIntersectionPoint = (xCanvas, yCanvas) => {
    return {
      x: findNearestGridCoordinate(xCanvas),
      y: findNearestGridCoordinate(yCanvas)
    };
  }

  const findNearestGridCoordinate = coordinate => {
    const fieldElementSize = geometricalParameters.fieldElementSizeInPx;
    const totalDivision = Math.floor(coordinate / fieldElementSize);
    const smallerCoordinate = totalDivision * fieldElementSize;
    const biggerCoordinate = (totalDivision + 1) * fieldElementSize;
    return (coordinate - smallerCoordinate) < (biggerCoordinate - coordinate)
      ? smallerCoordinate : biggerCoordinate;
  }

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
