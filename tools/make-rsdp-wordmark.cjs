/**
 * Draws RSDP Live's wordmark ("RSDP Live!") as an SVG with the letters turned
 * into outlines, so it looks the same with no web font loaded. Output:
 * public/brand/rsdp-live-wordmark.svg. Run only if RSDP Live's logo changes.
 *
 * The wordmark copies RSDP Live's `.logo` style (apps/web/src/styles.css in
 * that repo): Inter, weight 900, letter-spacing -0.02em, "RSDP" in #eef1f4
 * and "Live!" in italic #ef5a4c.
 *
 *   mkdir /tmp/wm && cd /tmp/wm && npm i opentype.js @fontsource/inter
 *   node <repo>/tools/make-rsdp-wordmark.cjs
 *   cp rsdp-live-wordmark.svg <repo>/public/brand/
 */
const ot = require('opentype.js'); const fs = require('fs');
const dir = 'node_modules/@fontsource/inter/files/';
const up = ot.parse(fs.readFileSync(dir+'inter-latin-900-normal.woff').buffer);
const it = ot.parse(fs.readFileSync(dir+'inter-latin-900-italic.woff').buffer);
const size = 100, ls = -0.02*size, y = 100;
let bx=[Infinity,Infinity,-Infinity,-Infinity];
function run(font, text, x) { let d=''; for (const ch of text) { const g=font.charToGlyph(ch); const p=g.getPath(x,y,size); const b=p.getBoundingBox(); bx=[Math.min(bx[0],b.x1),Math.min(bx[1],b.y1),Math.max(bx[2],b.x2),Math.max(bx[3],b.y2)]; d+=p.toPathData(2); x+=g.advanceWidth/font.unitsPerEm*size+ls; } return {d,x}; }
const a = run(up, 'RSDP', 0);
const space = up.charToGlyph(' ').advanceWidth/up.unitsPerEm*size + ls;
const b = run(it, 'Live!', a.x + space);
const [x0,y0,x1,y1]=[Math.floor(bx[0])-1,Math.floor(bx[1])-1,Math.ceil(bx[2])+1,Math.ceil(bx[3])+1];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${x1-x0} ${y1-y0}" role="img" aria-label="RSDP Live!"><title>RSDP Live!</title><path fill="#eef1f4" d="${a.d}"/><path fill="#ef5a4c" d="${b.d}"/></svg>\n`;
fs.writeFileSync('rsdp-live-wordmark.svg', svg); console.log(x0,y0,x1-x0,y1-y0, svg.length);
