import React, { useState, useEffect, useContext } from 'react';
import gameFieldClasses from '../styles/gameField.module.css';
import { GeometricalParameters } from '../context';

const field = () => {
  const geometricalParameters = useContext(GeometricalParameters);
  const [fieldDimensions, setFieldDimensions] = useState({
    width: 0,
    height: 0
  });
  const canvasRef = React.createRef();

  // TODO: passing [] as a second parameter to useEffect should generate behaviour
  // as with componentDidMount. However, grid is not rendered then. Why?
  useEffect(() => {
    const width = geometricalParameters.numberOfColumns * geometricalParameters.fieldElementSizeInPx;
    const height = geometricalParameters.numberOfRowsWithGates * geometricalParameters.fieldElementSizeInPx;
    setFieldDimensions({width, height});
    fillGrid();
  });

  const fillGrid = () => {
    let canvas = canvasRef.current;
    if (canvas) {
      let canvasCtx = canvas.getContext('2d');
      for (let i = 0; i < geometricalParameters.numberOfRowsWithGates; i++) {
        for (let j = 0; j < geometricalParameters.numberOfColumns; j++) {
          if (isGateRow(i)) {
            drawGateRow(j, i, canvasCtx);
          } else {
            drawFieldRow(j, i, canvasCtx);
          }
        }
      }
    }
  }

  const isGateRow = rowNumber => {
    return rowNumber === 0 ||
      rowNumber === (geometricalParameters.numberOfRowsWithGates - 1);
  }

  const drawGateRow = () => {

  }

  const drawFieldRow = (columnNumber, rowNumber, canvasCtx) => {
    const gridSize = geometricalParameters.fieldElementSizeInPx;
    const x = columnNumber * gridSize;
    const y = rowNumber * gridSize;
    canvasCtx.fillStyle = 'border: 1px solid black';
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
