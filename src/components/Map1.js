import React from 'react';

const Map1 = () => {
  // 1. EL MARCO DEL CUADRO (La "ventana" que deja ver el mapa)
  const windowStyle = {
    width: '100%',
    maxWidth: '875px',  // Ancho máximo del cuadro
    height: '498px',     // Alto del cuadro
    overflow: 'hidden',  // CRÍTICO: Esto corta todo lo blanco y logos que sobran
    position: 'relative',
    borderRadius: '12px', // Bordes redondeados para que se vea moderno
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', // Sombra para que resalte del fondo
    backgroundColor: '#343a40', // Color de fondo mientras carga
  };

  // 2. EL MAPA ORIGINAL (Desplazado para ocultar la basura)
  const iframeStyle = {
    position: 'absolute',
    top: '-380px',       // Sube el iframe para ocultar la cabecera de la UB
    left: '-125px',       // Lo mueve un poco a la izquierda
    width: '1180px',     // El ancho fijo que requiere el mapa original
    height: '875px',    // Alto de sobra, pero oculto por el windowStyle
    border: 'none',
    // Usamos scale para encoger el mapa gigante y que entre en nuestro cuadro
    transform: 'scale(1)', 
    transformOrigin: 'top left', // El punto de referencia para el scale es la esquina superior izquierda
  };

  return (
    <div style={windowStyle}>
      <iframe
        src="https://www.ub.edu/claustra/spa/Monestirs/atles"
        title="Mapa Paisajes"
        style={iframeStyle}
        scrolling="no"
      />
    </div>
  );
};

export default Map1;