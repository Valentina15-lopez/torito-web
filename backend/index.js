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

// Endpoint para procesar las fotos con la marca de agua
app.post(
  "/process",
  upload.fields([{ name: "watermark", maxCount: 1 }, { name: "photos" }]),
  async (req, res) => {
    try {
      const watermarkFile = req.files["watermark"][0];
      const photos = req.files["photos"];

      if (!watermarkFile || !photos || photos.length === 0) {
        return res
          .status(400)
          .send("Por favor, sube una marca de agua y al menos una foto.");
      }

      // Subir la marca de agua a Cloudinary
      const watermarkResult = await cloudinary.uploader.upload(
        watermarkFile.path,
        {
          folder: "marcas_agua",
          public_id: "marca-agua",
        }
      );

      // Registrar el resultado de la subida de la marca de agua
      console.log(
        "Resultado de la subida de la marca de agua:",
        watermarkResult
      );

      // Verificar que la marca de agua se subió correctamente
      if (!watermarkResult || !watermarkResult.public_id) {
        return res
          .status(500)
          .send("Error al subir la marca de agua a Cloudinary.");
      }

      // Procesar cada foto con la marca de agua
      const processedUrls = [];
      for (const photo of photos) {
        const result = await cloudinary.uploader.upload(photo.path, {
          folder: "fotos_procesadas",
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
        processedUrls.push(result.secure_url);
      }

      // Eliminar archivos temporales
      fs.unlinkSync(watermarkFile.path);
      photos.forEach((photo) => fs.unlinkSync(photo.path));

      res
        .status(200)
        .send({ message: "Fotos procesadas con éxito", urls: processedUrls });
    } catch (error) {
      console.error("Error al procesar las fotos:", error);
      res.status(500).send("Hubo un error al procesar las fotos.");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
