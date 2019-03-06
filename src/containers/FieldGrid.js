import React, { useEffect, useContext, useRef } from 'react';
import gameFieldClasses from '../styles/gameField.module.css';
import { GeometricalParameters } from '../context';

const FieldGrid = () => {
  const geometricalParameters = useContext(GeometricalParameters);
  const fieldDimensions = {
    width: geometricalParameters.numberOfColumns * geometricalParameters.fieldElementSizeInPx,
    height: geometricalParameters.numberOfRowsWithGates * geometricalParameters.fieldElementSizeInPx
  };
  const fieldCanvasRef = useRef(null);

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

  return (
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
  );
};

export default FieldGrid;
