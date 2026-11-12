import path from "node:path";
import { fileURLToPath } from "node:url";
import { createWatchers, buildCSS, buildJS, buildConf } from "chokibasic";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcroot = path.resolve(__dirname, "../src");
const src = path.join(srcroot, "scripts");
const entry = path.join(src, "mbcpie.core.js");
const outfile = path.join(src, "mbcpie.core.min.js");
const yamlconf = path.join(src, "libraries/mbcpie.yaml");
const jsonconf = path.join(src, "libraries/mbcpie.json");

const { close } = createWatchers(
	[
		{
			name: "css",
			patterns: ["src/styles/**/*.scss"],
			callback: async (events) => {
				console.log("[css] batch", events.length, events.map(e => e.file));
				await buildCSS(path.join(srcroot, "styles/main.scss"), path.join(srcroot, "styles/main.min.css"));
			},
		},
		{
			name: "js",
			patterns: ["src/scripts/**/*.js"],
			ignored: ["**/*.min.js"],
			callback: async (events) => {
				console.log("[js] batch", events.length, events.map(e => e.file));
				try { await buildJS(entry, outfile); } catch (err) { console.error("❌ Build error:", err); }
			},
		},
		{
			name: "yaml",
			patterns: ["src/scripts/**/*.yaml"],
			callback: async (events) => {
				console.log("[yaml] batch", events.length, events.map(e => e.file));
				try {
					await buildConf(yamlconf, jsonconf, {});
					await buildJS(entry, outfile);
				} catch (err) { console.error("❌ Build error:", err); }
			},
		},
	],
	{ cwd: process.cwd(), debug: true }
);

process.on("SIGINT", async () => {
	await close();
	process.exit(0);
});
