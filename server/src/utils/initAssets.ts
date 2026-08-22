import fs from "fs";
import path from "path";

export function ensureAssets() {
  const serverAssetsDir = path.resolve(__dirname, "../../assets");
  const clientAssetsDir = path.resolve(__dirname, "../../../client/public/assets");

  if (!fs.existsSync(serverAssetsDir)) {
    fs.mkdirSync(serverAssetsDir, { recursive: true });
  }
  if (!fs.existsSync(clientAssetsDir)) {
    fs.mkdirSync(clientAssetsDir, { recursive: true });
  }

  const brainDir = "C:/Users/nitin/.gemini/antigravity/brain/304d0472-0595-4acf-85ad-5596b1bbec3b";
  const logoSource = path.join(brainDir, "hp_govt_emblem_1785735095261.png");
  const photoSource = path.join(brainDir, "applicant_passport_photo_1785735119336.png");

  const serverLogo = path.join(serverAssetsDir, "hp-govt-logo.png");
  const clientLogo = path.join(clientAssetsDir, "hp-govt-logo.png");
  const serverPhoto = path.join(serverAssetsDir, "default-photo.png");
  const clientPhoto = path.join(clientAssetsDir, "default-photo.png");

  try {
    if (fs.existsSync(logoSource)) {
      if (!fs.existsSync(serverLogo)) fs.copyFileSync(logoSource, serverLogo);
      if (!fs.existsSync(clientLogo)) fs.copyFileSync(logoSource, clientLogo);
    }
    if (fs.existsSync(photoSource)) {
      if (!fs.existsSync(serverPhoto)) fs.copyFileSync(photoSource, serverPhoto);
      if (!fs.existsSync(clientPhoto)) fs.copyFileSync(photoSource, clientPhoto);
    }
  } catch (err) {
    console.warn("Asset copy fallback:", err);
  }
}
