const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");

const modernTemplate = require("./templates/modern");
const atsTemplate = require("./templates/ats");

const app = express();
const PORT = process.env.PORT || 5000;
const templatesDir = path.join(__dirname, "templates");
const texPath = path.join(templatesDir, "resume.tex");
const pdfPath = path.join(templatesDir, "resume.pdf");

app.use(cors());
app.use(express.json({ limit: "20mb" }));

function findPdfLatex() {
  const candidates = [
    path.join(
      process.env.LOCALAPPDATA || "",
      "Programs",
      "MiKTeX",
      "miktex",
      "bin",
      "x64",
      "pdflatex.exe"
    ),
    "C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe",
    "pdflatex",
  ];

  for (const candidate of candidates) {
    if (candidate === "pdflatex" || fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function removeOldPhotos() {
  for (const extension of [".jpg", ".jpeg", ".png"]) {
    const oldPhoto = path.join(templatesDir, `profile_photo${extension}`);
    if (fs.existsSync(oldPhoto)) {
      try {
        fs.unlinkSync(oldPhoto);
      } catch (error) {
        console.log("Could not remove old photo:", error.message);
      }
    }
  }
}

function savePhoto(photoData) {
  removeOldPhotos();

  if (!photoData || typeof photoData !== "string") {
    return "";
  }

  let extension;
  if (photoData.startsWith("data:image/png;base64,")) {
    extension = ".png";
  } else if (
    photoData.startsWith("data:image/jpeg;base64,") ||
    photoData.startsWith("data:image/jpg;base64,")
  ) {
    extension = ".jpg";
  } else {
    throw new Error("Invalid profile photo. Please upload JPG, JPEG or PNG.");
  }

  const marker = ";base64,";
  const markerIndex = photoData.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error("Invalid profile photo data.");
  }

  const base64Data = photoData.slice(markerIndex + marker.length);
  const fileName = `profile_photo${extension}`;
  const filePath = path.join(templatesDir, fileName);

  fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
  console.log("Profile photo saved:", filePath);
  return fileName;
}

app.get("/", (req, res) => {
  res.send("Resume Builder Backend Running Successfully");
});

app.post("/generate-resume", (req, res) => {
  console.log("\n=================================");
  console.log("GENERATE RESUME REQUEST");
  console.log("=================================");

  try {
    const data = req.body || {};

    if (!data.formData) {
      return res.status(400).json({
        success: false,
        message: "Personal details are missing.",
      });
    }

    if (!data.template) {
      data.template = "modern";
    }

    console.log("Template:", data.template);

    // Save photo BEFORE generating LaTeX so modern.js can find it.
    data.photoFile = savePhoto(data.photoData);
    console.log("Photo filename:", data.photoFile || "No photo");

    let latexContent;
    if (data.template === "modern") {
      latexContent = modernTemplate(data);
    } else if (data.template === "ats") {
      latexContent = atsTemplate(data);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid resume template selected.",
      });
    }

    fs.writeFileSync(texPath, latexContent, "utf8");
    console.log("LaTeX file created:", texPath);

    const pdflatex = findPdfLatex();
    if (!pdflatex) {
      return res.status(500).json({
        success: false,
        message: "pdflatex was not found. Please install MiKTeX.",
      });
    }

    if (fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (error) {
        console.log("Could not remove old PDF:", error.message);
      }
    }

    const args = [
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-file-line-error",
      "resume.tex",
    ];

    console.log("Using pdflatex:", pdflatex);
    console.log("Running pdflatex...");

    execFile(
      pdflatex,
      args,
      {
        cwd: templatesDir,
        windowsHide: true,
        maxBuffer: 20 * 1024 * 1024,
      },
      (error, stdout, stderr) => {
        console.log("\n========== LATEX OUTPUT ==========");
        console.log(stdout || "");
        console.log("\n========== LATEX ERROR ==========");
        console.log(stderr || "");

        if (error || !fs.existsSync(pdfPath)) {
          const details = stderr || stdout || error?.message || "Unknown LaTeX error.";
          console.error("\n========== PDF GENERATION FAILED ==========");
          console.error(details);
          console.error("===========================================");

          return res.status(500).json({
            success: false,
            message: "PDF generation failed. Check the server terminal for the LaTeX error.",
            error: details,
          });
        }

        console.log("\n=================================");
        console.log("PDF GENERATED SUCCESSFULLY");
        console.log(pdfPath);
        console.log("=================================");

        return res.json({
          success: true,
          message: "PDF generated successfully.",
        });
      }
    );
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while generating resume.",
    });
  }
});

app.get("/download-resume", (req, res) => {
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).send("Resume PDF not found. Generate the resume first.");
  }

  res.download(pdfPath, "Resume.pdf");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n=================================");
  console.log(`Server running on port ${PORT}`);
  console.log("=================================\n");
});
