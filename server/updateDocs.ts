import fs from "fs";
import { requiredDocuments } from "./prisma/data/requiredDocuments";

const updated = requiredDocuments.map(service => {
  let hasPhoto = false;
  const docs = service.documents.map(doc => {
    if (doc.name === "Passport Size Photograph" || doc.name === "Family Photograph" || doc.name === "Marriage Photograph") {
      // Wait, we probably want "Passport Size Photograph" specifically.
      // Let's just enforce "Passport Size Photograph"
      if (doc.name === "Passport Size Photograph") {
        hasPhoto = true;
        return { ...doc, isMandatory: true };
      }
    }
    return doc;
  });

  if (!hasPhoto) {
    docs.push({
      name: "Passport Size Photograph",
      isMandatory: true,
      displayOrder: docs.length + 1
    });
  }
  
  return { ...service, documents: docs };
});

const fileContent = `export const requiredDocuments = ${JSON.stringify(updated, null, 2).replace(/"([^"]+)":/g, '$1:')};\n`;

fs.writeFileSync("./prisma/data/requiredDocuments.ts", fileContent);
console.log("Updated requiredDocuments.ts");
