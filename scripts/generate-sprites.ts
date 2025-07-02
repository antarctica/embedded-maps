import { load } from 'cheerio';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { type Config, optimize } from 'svgo';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = join(__dirname, '../public/icons');

const OUTPUT_FILE = join(__dirname, '../public/svg/sprites.svg');
const OUTPUT_DIR = dirname(OUTPUT_FILE);

const TYPES_OUTPUT_FILE = join(__dirname, '../src/lib/types/Icons.gen.ts');
const TYPES_OUTPUT_DIR = dirname(TYPES_OUTPUT_FILE);

// Ensure all required directories exist
function ensureDirectoriesExist(): void {
  const directories = [ICONS_DIR, OUTPUT_DIR, TYPES_OUTPUT_DIR];

  directories.forEach((dir) => {
    if (!existsSync(dir)) {
      console.debug(`Creating directory: ${dir}`);
      mkdirSync(dir, { recursive: true });
    }
  });
}

const svgoConfig: Config = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'cleanupAttrs',
    'removeEmptyAttrs',
    'removeEmptyText',
    'removeEmptyContainers',
    'sortAttrs',
  ],
};

function generateTypeDefinition(iconNames: string[]): void {
  const typeContent = `// This file is auto-generated. Do not edit manually.
export type IconName =
${iconNames.map((name) => `  | '${name}'`).join('\n')};
`;

  writeFileSync(TYPES_OUTPUT_FILE, typeContent);
  console.debug(`Generated type definition with ${iconNames.length} icon names`);
}

function generateSprites(): void {
  // Ensure all required directories exist before proceeding
  ensureDirectoriesExist();

  const spriteContent = `
    <svg
      display="none"
      width="0"
      height="0"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs></defs>
    </svg>`;

  const $ = load(spriteContent, { xmlMode: true });
  const $defs = $('defs');

  // Check if icons directory exists and has files
  if (!existsSync(ICONS_DIR)) {
    console.debug('No icons directory found. Creating empty sprite sheet.');
    writeFileSync(OUTPUT_FILE, $.html());
    generateTypeDefinition([]);
    return;
  }

  const files = readdirSync(ICONS_DIR).filter((file) => file.endsWith('.svg'));
  const iconNames: string[] = [];

  files.forEach((file) => {
    const content = readFileSync(join(ICONS_DIR, file), 'utf-8');
    const optimizedSvg = optimize(content, svgoConfig);

    if ('data' in optimizedSvg) {
      const $icon = load(optimizedSvg.data, { xmlMode: true });
      const $svg = $icon('svg');
      const viewBox = $svg.attr('viewBox');

      if (viewBox) {
        const symbolId = `icon-${file.replace('.svg', '')}`;
        const $symbol = $(`<symbol id="${symbolId}" viewBox="${viewBox}"></symbol>`);

        $svg.children().each((_, el) => {
          $symbol.append($(el));
        });

        $defs.append($symbol);
        iconNames.push(symbolId);
      }
    }
  });

  writeFileSync(OUTPUT_FILE, $.html());
  console.debug(`Generated sprite sheet with ${files.length} icons`);

  // Generate the TypeScript type definition
  generateTypeDefinition(iconNames);
}

generateSprites();
