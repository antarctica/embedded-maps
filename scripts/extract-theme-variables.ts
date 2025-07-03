import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Mapping table: CSS prefix -> Tailwind theme key
const PREFIX_MAPPING: Record<string, string> = {
  '--color-': 'colors',
  '--font-': 'font',
  '--text-': 'text',
  '--font-weight-': 'font-weight',
  '--tracking-': 'tracking',
  '--leading-': 'leading',
  '--breakpoint-': 'breakpoint',
  '--container-': 'container',
  '--spacing-': 'spacing',
  '--radius-': 'radius',
  '--shadow-': 'shadow',
  '--inset-shadow-': 'inset-shadow',
  '--drop-shadow-': 'drop-shadow',
  '--blur-': 'blur',
  '--perspective-': 'perspective',
  '--aspect-': 'aspect',
  '--ease-': 'ease',
  '--animate-': 'animate',
} as const;

interface ExtractedTheme {
  [key: string]: string[];
}

function extractThemeVariables(cssContent: string): ExtractedTheme {
  const extracted: ExtractedTheme = {};

  // Find all @theme blocks (both regular and inline)
  const themeBlockRegex = /@theme[^{]*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  let match;

  while ((match = themeBlockRegex.exec(cssContent)) !== null) {
    const themeContent = match[1];

    // Extract CSS custom property declarations
    const customPropertyRegex = /--([^:]+):\s*[^;]+;/g;
    let propMatch;

    while ((propMatch = customPropertyRegex.exec(themeContent)) !== null) {
      const fullProperty = `--${propMatch[1]}`;

      // Skip any catch-all patterns (ending with *)
      if (fullProperty.endsWith('*')) {
        continue;
      }

      // Find which prefix this property matches
      for (const [prefix, themeKey] of Object.entries(PREFIX_MAPPING)) {
        if (fullProperty.startsWith(prefix)) {
          // Extract the class name (remove prefix)
          const className = fullProperty.substring(prefix.length);

          if (!extracted[themeKey]) {
            extracted[themeKey] = [];
          }

          if (!extracted[themeKey].includes(className)) {
            extracted[themeKey].push(className);
          }
          break;
        }
      }
    }
  }

  // Sort arrays for consistent output
  Object.keys(extracted).forEach((key) => {
    extracted[key].sort();
  });

  return extracted;
}

function generateThemeConfig(extracted: ExtractedTheme): string {
  const configEntries = Object.entries(extracted)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => {
      const formattedValues = values.map((value) => `        '${value}',`).join('\n');

      return `      ${key}: [\n${formattedValues}\n      ],`;
    })
    .join('\n');

  return `// This file is auto-generated. Do not edit manually.
// Run 'npm run extract-theme-variables' to regenerate.

export const generatedThemeConfig = {
  extend: {
    theme: {
${configEntries}
    },
  },
} as const;
`;
}

function main() {
  try {
    // Read the CSS file
    const cssPath = join(process.cwd(), 'src/styles/index.css');
    const cssContent = readFileSync(cssPath, 'utf-8');

    // Extract theme variables from CSS
    const extracted = extractThemeVariables(cssContent);

    // Generate the TypeScript config
    const configContent = generateThemeConfig(extracted);

    // Write the generated file
    const outputPath = join(process.cwd(), 'src/lib/helpers/tailwind-theme.gen.ts');
    writeFileSync(outputPath, configContent, 'utf-8');

    console.log('✅ Theme variables extracted successfully!');
    console.log(`📁 Generated file: ${outputPath}`);
    console.log('\n📊 Extracted variables:');
    Object.entries(extracted).forEach(([key, values]) => {
      console.log(`  ${key}: ${values.length} variables`);
    });
  } catch (error) {
    console.error('❌ Error extracting theme variables:', error);
    process.exit(1);
  }
}

main();
