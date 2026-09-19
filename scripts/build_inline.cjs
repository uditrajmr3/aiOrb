const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('packages/mia_orb/assets/orb_engine.html');
const jsPath = path.resolve('packages/mia_orb/assets/orb_engine.bundle.js');
const outPath = path.resolve('packages/mia_orb/assets/orb_engine_inline.html');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Replace script tag with inlined script
const inlined = html.replace(
  '<script src="orb_engine.bundle.js"></script>',
  () => `<script>\n${js}\n</script>`
);

fs.writeFileSync(outPath, inlined, 'utf8');
console.log('Inlined HTML created successfully! Size:', inlined.length, 'bytes');
