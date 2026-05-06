import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
// Importa los estilos directamente de la librería base de Leaflet
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Solución para que los íconos de Leaflet se vean correctamente en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapaHistorico = () => {
  const [lugares, setLugares] = useState([]);
  const [añoActual, setAñoActual] = useState(1900);
  const [añoSlider, setAñoSlider] = useState(1900);
  const [rangoAños, setRangoAños] = useState({ min: 1880, max: 2020 });

  // Función para arreglar coordenadas como "-26.816.388" -> -26.816388
  const limpiarCoordenada = (coord) => {
    const partes = String(coord).split('.');
    if (partes.length > 2) {
      return parseFloat(partes[0] + '.' + partes.slice(1).join(''));
    }
    return parseFloat(coord);
  };

  useEffect(() => {
    // Reemplaza esta ruta con la ubicación real de tu CSV público
    // Puede ser la URL de Google Sheets publicada como CSV, o un archivo en tu carpeta 'public'
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsWdVDxBXJLw2nYtX_LCRhHZ5dAHRovoo1nNHBr_yemoi39srAC3aK3sskx03SCw/pub?gid=231327209&single=true&output=csv'; 

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (resultados) => {
        const datosLimpios = resultados.data
          .map(fila => ({
            ...fila,
            fecha: parseInt(fila.fecha),
            latitud: limpiarCoordenada(fila.latitud),
            longitud: limpiarCoordenada(fila.longitud)
          }))
          .filter(fila => !isNaN(fila.latitud) && !isNaN(fila.longitud) && !isNaN(fila.fecha)); // Ignorar filas sin datos válidos

        setLugares(datosLimpios);

        // Calcular el año más antiguo y el más reciente para la barra
        if (datosLimpios.length > 0) {
          const años = datosLimpios.map(d => d.fecha);
          const min = Math.min(...años);
          const max = Math.max(...años);
          setRangoAños({ min, max });
          setAñoActual(max); // Iniciar mostrando todos los puntos
          setAñoSlider(max); // Iniciar el slider en el año más reciente
        }
      }
    });
  }, []);

  // Filtrar los lugares: mostrar solo los que se crearon en o antes del año seleccionado
  const lugaresVisibles = lugares.filter(lugar => lugar.fecha <= añoActual);

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Controles de la Línea de Tiempo */}
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '15px' }}>
        <h3>Evolución Histórica: {añoSlider}</h3> {/* Usamos añoSlider aquí */}
        <input 
          type="range" 
          min={rangoAños.min} 
          max={rangoAños.max} 
          value={añoSlider} // Usamos añoSlider aquí
          
          /* Mientras arrastras: solo actualiza el texto y la barra, el mapa ni se entera */
          onChange={(e) => setAñoSlider(parseInt(e.target.value))}
          
          /* Cuando sueltas el clic (PC): actualiza el mapa de golpe */
          onMouseUp={() => setAñoActual(añoSlider)}
          
          /* Cuando levantas el dedo (Celular): actualiza el mapa de golpe */
          onTouchEnd={() => setAñoActual(añoSlider)}
          
          style={{ width: '100%', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
          <span>{rangoAños.min}</span>
          <span>{rangoAños.max}</span>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer 
        center={[-26.82414, -65.2226]} // Centrado en Tucumán por defecto
        zoom={7} 
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
<MarkerClusterGroup 
           // Opciones para el cluster de marcadores
           spiderfyOnMaxZoom={true} // Al hacer clic en un cluster en el zoom máximo, se expanden los puntos individuales
           spiderfyDistanceMultiplier={2.5} // Distancia entre los puntos al expandir un cluster
           spiderLegPolylineOptions={{ weight: 1.5, color: '#222', opacity: 0.5 }} // Estilo de las líneas que conectan los puntos al expandir el cluster
           showCoverageOnHover={false} // No mostrar el área de cobertura al pasar el mouse
           maxClusterRadius={20} // Radio máximo para agrupar marcadores (en píxeles)
           zoomToBoundsOnClick={false} // Al hacer clic en un cluster, se acerca para mostrar los puntos individuales
           removeOutsideVisibleBounds={true} // Mejora el rendimiento al eliminar marcadores fuera de vista
        >
            {lugaresVisibles.map((lugar) => {
              // 1. Creamos una clave única que NO cambie cuando filtras por fecha
              const claveUnica = lugar['id'] ? lugar['id'] : `${lugar.nombre}-${lugar.fecha}`;

              return (
                // 2. Usamos esa clave única en lugar de "index"
                <Marker key={claveUnica} position={[lugar.latitud, lugar.longitud]}>
                  <Popup>
                    <strong>{lugar.nombre}</strong><br/>
                    <em>Año: {lugar.fecha}</em><br/>
                    {lugar.lugar} - {lugar.direccion}
                  </Popup>
                </Marker>
              );
            })}
        </MarkerClusterGroup>
        
        
        {lugaresVisibles.map((lugar, index) => (
          <Marker key={index} position={[lugar.latitud, lugar.longitud]}>
            <Popup>
              <strong>{lugar.nombre}</strong><br/>
              <em>Año: {lugar.fecha}</em><br/>
              {lugar.lugar} - {lugar.direccion}
            </Popup>
          </Marker>
        ))}
        
      </MapContainer>

    </div>
  );
};

export default MapaHistorico;