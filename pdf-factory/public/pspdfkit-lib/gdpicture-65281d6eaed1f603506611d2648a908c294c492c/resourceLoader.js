let require;const ENVIRONMENT_IS_NODE="string"==typeof globalThis.process?.versions?.node,ENVIRONMENT_IS_DENO="object"==typeof window&&"Deno"in window;export async function initialize(){if(null!=globalThis.process?.versions?.node){const{createRequire:e}=await import("module");require=e(import.meta.url)}}export function fetchResource(e,r){try{if(ENVIRONMENT_IS_NODE){const o=require("node:fs"),t=require("node:path"),{fileURLToPath:i}=require("node:url"),n=`${t.dirname(i(import.meta.url))}/resources/${e}`,s=o.readFileSync(t.normalize(n));globalThis.gdPicture.module.FS.writeFile(`/resources/${r}`,new Uint8Array(s))}else if(ENVIRONMENT_IS_DENO){const o=`${new URL(".",import.meta.url).pathname}/resources/${e}`,t=Deno.readFileSync(o);globalThis.gdPicture.module.FS.writeFile(`/resources/${r}`,new Uint8Array(t))}else{const o=`${globalThis.gdPicture.baseUrl}/resources/${e}`,t=new XMLHttpRequest;t.open("GET",o,!1),t.overrideMimeType("text/plain; charset=x-user-defined"),t.send(),200===t.status?globalThis.gdPicture.module.FS.writeFile(`/resources/${r}`,stringToArrayBuffer(t.response)):console.error(`Could not retrieve resource. Status: ${t.status}`)}}catch(e){console.error(`Could not retrieve resource. Exception: ${e}`)}}function stringToArrayBuffer(e){const r=new ArrayBuffer(e.length),o=new Uint8Array(r);for(let r=0,t=e.length;r<t;r++)o[r]=e.charCodeAt(r);return o}