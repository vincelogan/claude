import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
const ROOT = join(process.cwd(), 'out');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.json':'application/json', '.woff2':'font/woff2', '.xml':'application/xml' };
async function resolve(p){
  let f = join(ROOT, p);
  try { const s = await stat(f); if (s.isDirectory()) f = join(f,'index.html'); return f; } catch {}
  try { const s = await stat(f+'.html'); if(s.isFile()) return f+'.html'; } catch {}
  try { const s = await stat(join(f,'index.html')); if(s.isFile()) return join(f,'index.html'); } catch {}
  return join(ROOT,'404.html');
}
createServer(async (req,res)=>{
  const url = decodeURIComponent((req.url||'/').split('?')[0]);
  const file = await resolve(url);
  try { const data = await readFile(file); res.writeHead(200,{'content-type':TYPES[extname(file)]||'application/octet-stream'}); res.end(data); }
  catch { res.writeHead(404); res.end('nf'); }
}).listen(4321, ()=>console.log('serving out/ on http://localhost:4321'));
