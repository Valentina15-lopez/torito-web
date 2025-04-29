import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [watermark, setWatermark] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [processedPhotos, setProcessedPhotos] = useState([]);

  const handleWatermarkUpload = (e) => {
    setWatermark(e.target.files[0]);
  };

  const handlePhotosUpload = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleSubmit = async () => {
    if (!watermark || photos.length === 0) {
      alert("Por favor, sube una marca de agua y al menos una foto.");
      return;
    }

    const formData = new FormData();
    formData.append("watermark", watermark);
    photos.forEach((photo) => formData.append("photos", photo));

    try {
      const response = await axios.post(
        "http://localhost:5000/process",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProcessedPhotos(response.data.urls);
    } catch (error) {
      console.error("Error al procesar las fotos:", error);
      alert("Hubo un error al procesar las fotos.");
    }
  };

  return (
    <div className="App">
      <h1>Aplicar Marca de Agua</h1>

      <div>
        <h2>Subir Marca de Agua</h2>
        <input type="file" accept="image/*" onChange={handleWatermarkUpload} />
      </div>

      <div>
        <h2>Subir Fotos</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosUpload}
        />
      </div>

      <button onClick={handleSubmit}>Procesar Fotos</button>

      <div>
        <h2>Fotos Procesadas</h2>
        <div className="photos-container">
          {processedPhotos.map((url, index) => (
            <img key={index} src={url} alt={`Foto procesada ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
