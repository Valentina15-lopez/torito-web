const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente");
});

// Configuración de Multer para manejar la subida de archivos
const upload = multer({ dest: "uploads/" });

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No se ha subido ninguna imagen.");
    }

    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "imagenes_marca_agua",
      transformation: [
        {
          overlay: "marcas_agua:marca-agua", // Usar el formato correcto para el overlay
          gravity: "south_east",
          opacity: 50,
          width: 0.3,
          crop: "scale",
        },
      ],
    });

    res
      .status(200)
      .send({ message: "Imagen subida con éxito", url: result.secure_url });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).send("Error al procesar la imagen.");
  }
});

// Agregar un nuevo endpoint para subir imágenes originales
app.post("/upload-originals", upload.array("photos"), async (req, res) => {
  try {
    const photos = req.files;

    if (!photos || photos.length === 0) {
      return res.status(400).send("Por favor, sube al menos una foto.");
    }

    const originalUrls = [];

    // Subir cada foto original a Cloudinary
    for (const photo of photos) {
      const result = await cloudinary.uploader.upload(photo.path, {
        folder: "fotos_originales",
      });
      originalUrls.push(result.secure_url);
      fs.unlinkSync(photo.path); // Eliminar archivo temporal
    }

    res
      .status(200)
      .send({
        message: "Imágenes originales subidas con éxito",
        urls: originalUrls,
      });
  } catch (error) {
    console.error("Error al subir las imágenes originales:", error);
    res.status(500).send("Hubo un error al subir las imágenes originales.");
  }
});

// Modificar el endpoint de procesamiento para usar imágenes originales
app.post("/process", async (req, res) => {
  try {
    const { originalUrls } = req.body;

    if (!originalUrls || originalUrls.length === 0) {
      return res
        .status(400)
        .send("Por favor, proporciona las URLs de las imágenes originales.");
    }

    const processedUrls = [];

    // Procesar cada foto original con la marca de agua
    for (const url of originalUrls) {
      const result = await cloudinary.uploader.upload(url, {
        folder: "fotos_procesadas",
        transformation: [
          {
            overlay: "marcas_agua:marca-agua",
            gravity: "south_east",
            opacity: 50,
            width: 0.3,
            crop: "scale",
          },
        ],
      });
      processedUrls.push(result.secure_url);
    }

    res
      .status(200)
      .send({ message: "Fotos procesadas con éxito", urls: processedUrls });
  } catch (error) {
    console.error("Error al procesar las fotos:", error);
    res.status(500).send("Hubo un error al procesar las fotos.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
