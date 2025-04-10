require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fetch = require("node-fetch");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ROOT = process.env.CLOUDINARY_PARENT_FOLDER || "projects";
const LOCAL_PROJECTS_DIR = "projects";

async function syncProjects() {
  const { folders } = await cloudinary.api.sub_folders(ROOT);

  for (const folder of folders) {
    const projectSlug = folder.name;
    const fullPath = `${ROOT}/${projectSlug}`;
    const localPath = path.join(LOCAL_PROJECTS_DIR, projectSlug);

    if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });

    // 1. 🔍 Get index.txt
    const rawFiles = await cloudinary.search
      .expression(`resource_type:raw AND folder:${fullPath}`)
      .max_results(10)
      .execute();

    const indexFile = rawFiles.resources.find(file =>
      file.public_id.endsWith("index.txt")
    );


    if (indexFile) {
      const res = await fetch(indexFile.secure_url);
      const content = await res.text();
      fs.writeFileSync(path.join(localPath, "index.md"), content);
    } else {
      console.warn(`⚠️ No exact 'index.txt' found in ${fullPath}`);
      console.log("🧪 Found raw files:", rawFiles.resources.map(f => f.public_id));
    }


    // 2. 🖼️ Get image files
    const imageFiles = await cloudinary.search
      .expression(`resource_type:image AND folder:${fullPath}`)
      .max_results(100)
      .execute();

    const images = imageFiles.resources.map(file => file.secure_url);
    const imagesJsonPath = path.join(localPath, "images.json");
    fs.writeFileSync(imagesJsonPath, JSON.stringify(images, null, 2));

    // 3. 🧠 Generate .11tydata.js file
    const dataFilePath = path.join(localPath, `${projectSlug}.11tydata.js`);
    const jsContent = `const fs = require("fs");
const path = require("path");

module.exports = () => {
  const filePath = path.join(__dirname, "images.json");
  const images = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  return { images };
};
`;

    fs.writeFileSync(dataFilePath, jsContent);
    console.log(`✅ Synced project: ${projectSlug}`);
  }
}

syncProjects().catch(err => {
  console.error("❌ Error syncing projects:", err);
});
