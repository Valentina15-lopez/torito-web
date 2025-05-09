import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [originalPhotos, setOriginalPhotos] = useState([]);
  const [processedPhotos, setProcessedPhotos] = useState([]);

  const handleOriginalPhotosUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (const file of files) {
      formData.append("photos", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-originals",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Imágenes originales subidas con éxito.");
      setOriginalPhotos(response.data.urls);
    } catch (error) {
      console.error("Error al subir las imágenes originales:", error);
      alert("Hubo un error al subir las imágenes originales.");
    }
  };

  const handleProcessPhotos = async () => {
    if (originalPhotos.length === 0) {
      alert("Por favor, sube las imágenes originales antes de procesarlas.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/process", {
        originalUrls: originalPhotos,
      });

      setProcessedPhotos(response.data.urls);
      alert("Fotos procesadas con éxito.");
    } catch (error) {
      console.error("Error al procesar las fotos:", error);
      alert("Hubo un error al procesar las fotos.");
    }
  };

  return (
    <div className="App">
      <h1>Gestión de Imágenes</h1>

      <div>
        <h2>Subir Imágenes Originales</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleOriginalPhotosUpload}
        />
      </div>

      <div>
        <h2>Procesar Imágenes</h2>
        <button onClick={handleProcessPhotos}>Procesar Fotos</button>
      </div>

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
