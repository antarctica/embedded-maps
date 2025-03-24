import { dirname, join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HEALTH_FILE = join(__dirname, '../public/meta/health.json');
const PACKAGE_FILE = join(__dirname, '../package.json');

const payload = {
  "status": "pass",
  "version": 0,
  "releaseId": "-",
  "description": "Embeddable maps for visualising simple features on a suitable basemap.",
  "links": {
    "about": "https://gitlab.data.bas.ac.uk/magic/embedded-maps"
  }
}

function updateHealth(): void {
  const output_dir = dirname(HEALTH_FILE);
  if (!existsSync(output_dir)) {
    mkdirSync(output_dir, { recursive: true });
  }

  const packageContents = readFileSync(PACKAGE_FILE, 'utf-8');
  const packageData = JSON.parse(packageContents);
  
  payload.version = packageData.version;
  writeFileSync(HEALTH_FILE, JSON.stringify(payload, null, 2));
}

updateHealth();
