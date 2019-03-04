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
    fillGrid();
    console.log('useEffect called...');
  }, []);

  const fillGrid = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      let canvasCtx = canvas.getContext('2d');
      canvasCtx.fillStyle = 'border: 1px solid black';
      for (let i = 0; i < geometricalParameters.numberOfRowsWithGates; i++)
        for (let j = 0; j < geometricalParameters.numberOfColumns; j++)
          if (isGateFragment(i, j)) {
            drawFragment(j, i, canvasCtx);
          } else if (!isGateRow(i)) {
            drawFragment(j, i, canvasCtx);
      }
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
    canvasCtx.fillRect(x, y, gridSize, gridSize);
    canvasCtx.strokeRect(x, y, gridSize, gridSize);
    canvasCtx.clearRect(x, y, gridSize, gridSize);
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
