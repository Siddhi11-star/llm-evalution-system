const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const distDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read all HTML files in src/pages
const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to find <include src="..."></include> or <include src="..." />
  const includeRegex = /<include\s+src="([^"]+)"\s*(?:><\/include>|\/>)/g;

  let iterations = 0;
  let hasIncludes = true;
  while (hasIncludes && iterations < 5) {
    hasIncludes = false;
    content = content.replace(includeRegex, (fullMatch, srcPath) => {
      hasIncludes = true;
      const componentPath = path.join(srcDir, srcPath);
      if (fs.existsSync(componentPath)) {
        return fs.readFileSync(componentPath, 'utf8');
      } else {
        console.error(`Component not found: ${componentPath}`);
        return `<!-- Component not found: ${srcPath} -->`;
      }
    });
    iterations++;
  }

  const destPath = path.join(distDir, file);
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`Compiled: ${file} -> dist/${file}`);
});
