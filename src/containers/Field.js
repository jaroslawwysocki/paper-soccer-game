import React, { useState, useEffect, useContext } from 'react';
import gameFieldClasses from '../styles/gameField.module.css';
// import useCanvasContext from '../custom-hooks/useCanvasContext';
import { GeometricalParameters } from '../context';

const field = () => {
  const geometricalParameters = useContext(GeometricalParameters);
  const [fieldDimensions, setFieldDimensions] = useState({
    width: 0,
    height: 0
  });
  const gameFieldId = "gameField";
  // const canvasContext = useCanvasContext(gameFieldId);

  useEffect(() => {
    const width = geometricalParameters.numberOfColumns * geometricalParameters.fieldElementSizeInPx;
    const height = geometricalParameters.numberOfRows * geometricalParameters.fieldElementSizeInPx;
    setFieldDimensions({width, height});
  }, []);

  return (
    <canvas
      id={gameFieldId}
      width={fieldDimensions.width}
      height={fieldDimensions.height}
      className={gameFieldClasses.GameField}
    >
      Sorry, please update/change your browser to see the proper content.
    </canvas>
  );
}

export default field;
