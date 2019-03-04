import { useState, useEffect } from 'react';

function useCanvasContext(canvasId) {
  const [canvasContext, setCanvasContext] = useState();

  useEffect((canvasId) => {
    console.log(canvasId);
    const canvas = document.getElementById(canvasId);
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.fillStyle = 'rgb(200, 0, 0)';
    canvasCtx.fillRect(10, 10, 50, 50);
    setCanvasContext(canvasCtx);
  }, []);

  return canvasContext;
}

export default useCanvasContext;
