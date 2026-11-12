import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDist } from "chokibasic";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIR = process.cwd();
const SRC = path.join(DIR, 'src');
const DIST = path.join(DIR, 'dist');
const BANNER = path.join(__dirname, 'banner.txt');

(async () => {
	try {
		const stats = await exportDist(SRC, DIST, BANNER, { ignore: ["scripts/**/*.json", "scripts/**/*.yaml", "styles/**/*.scss"] });
		console.log(`✅ Export finished.`);
		console.log(`   Files copied : ${stats.copied}`);
		console.log(`   Files ignored : ${stats.skipped}`);
		process.exit(0);
	} catch (err) {
		console.error('❌ Export failed:', err);
		process.exit(1);
	}
})();
