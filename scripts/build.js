import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCSS, buildJS, buildConf } from "chokibasic";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcroot = path.resolve(__dirname, "../src");
const src = path.join(srcroot, "scripts");

(async () => {
	try {
		await buildCSS(path.join(srcroot, "styles/main.scss"), path.join(srcroot, "styles/main.min.css"));
		await buildConf(path.join(src, "libraries/mbcpie.yaml"), path.join(src, "libraries/mbcpie.json"), {});
		await buildJS(path.join(src, "mbcpie.core.js"), path.join(src, "mbcpie.core.min.js"));
		console.log("✅ Build finished successfully!");
	} catch (error) {
		console.error("❌ Build error:", error);
		process.exit(1);
	}
})();
