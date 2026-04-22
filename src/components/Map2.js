import React from 'react';

const Map2 = () => {
  const containerStyle = {
    width: '31vw',    // O el ancho que necesites en tu UI
    height: '37vh',   // O el alto que necesites
    position: 'relative',
    overflow: 'hidden'
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none' // Elimina el borde por defecto del iframe
  };

  return (
    <div style={containerStyle}>
      <iframe
        src="/mapa_monastico.html" // Ruta relativa a la carpeta public
        title="Atlas de Paisajes Monásticos"
        style={iframeStyle}
        scrolling="no"
      />
    </div>
  );
};

export default Map2;
