const svg2img = require('svg2img');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

const files = [
  '3dicons-headphone-dynamic-color.svg',
  '3dicons-heart-dynamic-color.svg',
  '3dicons-notebook-dynamic-color.svg',
  '3dicons-pencil-iso-color.svg',
  '3dicons-target-dynamic-color.svg'
];

console.log("Starting 1080p-grade conversion...");

files.forEach((file) => {
  const svgPath = path.join(assetsDir, file);
  const pngPath = svgPath.replace('.svg', '.png');

  if (fs.existsSync(svgPath)) {
    // 2048 is effectively 4x the previous attempt, ensuring no blur on any screen
    svg2img(svgPath, { 
        width: 2048, 
        height: 2048, 
        preserveAspectRatio: true 
    }, function (error, buffer) {
      if (error) {
        console.error(`Error converting ${file}:`, error);
        return;
      }

      fs.writeFileSync(pngPath, buffer);
      console.log(`Created 1080p-grade PNG: ${path.basename(pngPath)}`);
      
      // Cleanup
      fs.unlinkSync(svgPath); 
    });
  } else {
    console.warn(`Missing SVG for: ${file}. Please restore it first.`);
  }
});const svg2img = require('svg2img');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');

const files = [
  '3dicons-headphone-dynamic-color.svg',
  '3dicons-heart-dynamic-color.svg',
  '3dicons-notebook-dynamic-color.svg',
  '3dicons-pencil-iso-color.svg',
  '3dicons-target-dynamic-color.svg'
];

console.log("Starting 1080p-grade conversion...");

files.forEach((file) => {
  const svgPath = path.join(assetsDir, file);
  const pngPath = svgPath.replace('.svg', '.png');

  if (fs.existsSync(svgPath)) {
    // 2048 is effectively 4x the previous attempt, ensuring no blur on any screen
    svg2img(svgPath, { 
        width: 2048, 
        height: 2048, 
        preserveAspectRatio: true 
    }, function (error, buffer) {
      if (error) {
        console.error(`Error converting ${file}:`, error);
        return;
      }

      fs.writeFileSync(pngPath, buffer);
      console.log(`Created 1080p-grade PNG: ${path.basename(pngPath)}`);
      
      // Cleanup
      fs.unlinkSync(svgPath); 
    });
  } else {
    console.warn(`Missing SVG for: ${file}. Please restore it first.`);
  }
});