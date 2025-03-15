/**
 * Script to verify all critical dependencies are installed
 * This will run before the build process and fail if dependencies are missing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json to check if dependencies are properly declared
function readPackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(packageJsonContent);
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    return { dependencies: {}, devDependencies: {} };
  }
}

// List of critical packages that must be available
const CRITICAL_PACKAGES = [
  'resend',  // For email notifications
  '@prisma/client', // For database access
  'next-auth' // For authentication
];

function checkPackages() {
  console.log('Verifying critical dependencies...');
  const packageJson = readPackageJson();
  const allDependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const errorPackages = [];
  const missingFromPackageJson = [];

  for (const pkg of CRITICAL_PACKAGES) {
    // Check if it's declared in package.json
    const isDeclared = pkg in allDependencies;
    if (!isDeclared) {
      missingFromPackageJson.push(pkg);
    }
    
    try {
      // Try requiring the package - this will throw if not installed
      require.resolve(pkg, { paths: [process.cwd()] });
      console.log(`✅ ${pkg} - ${isDeclared ? 'properly declared and installed' : 'installed but NOT DECLARED in package.json'}`);
    } catch (error) {
      errorPackages.push(pkg);
      console.error(`❌ ${pkg} - ${isDeclared ? 'declared but NOT INSTALLED' : 'MISSING from package.json AND not installed'}`);
    }
  }

  // First handle packages missing from package.json
  if (missingFromPackageJson.length > 0) {
    console.warn('\n⚠️ Dependencies missing from package.json:');
    console.warn(missingFromPackageJson.join(', '));
    console.warn('These should be added to package.json with proper versions');
  }
  
  // Handle packages that aren't installed
  if (errorPackages.length > 0) {
    console.error('\n🛑 Missing critical dependencies!');
    console.error(`The following packages are required but not installed: ${errorPackages.join(', ')}`);
    console.error('\nPlease install them using:');
    console.error(`npm install ${errorPackages.join(' ')}`);
    checkCodebaseImports(); // Still run the import check to show all errors at once
    process.exit(1); // Exit with error after showing all issues
  }

  // Run the codebase import check if all packages are installed
  return checkCodebaseImports();
}

function checkCodebaseImports() {
  console.log('\nScanning codebase for missing imports...');
  try {
    // Run TypeScript compiler in noEmit mode to check for type errors
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ No missing imports found in codebase');
    console.log('\n✅ All critical dependencies verified successfully\n');
    return true;
  } catch (error) {
    console.error('\n⚠️ TypeScript errors detected:');
    
    // Extract and format the error message for better readability
    const errorOutput = error.stdout ? error.stdout.toString() : '';
    const stderrOutput = error.stderr ? error.stderr.toString() : '';
    const fullOutput = errorOutput || stderrOutput;
    
    // Look for missing module errors
    const moduleErrors = fullOutput.match(/Cannot find module ['"]([^'"]+)['"]|cannot find module ['"]([^'"]+)['"]|Cannot find name ['"]([^'"]+)['"]|Error: Cannot find module ['"]([^'"]+)['"]|Error: Module not found/gi);
    
    if (moduleErrors && moduleErrors.length > 0) {
      // Extract package names from error messages
      const packageMatches = fullOutput.match(/Cannot find module ['"]([\w@\/-]+)['"]|cannot find module ['"]([\w@\/-]+)['"]|Error: Cannot find module ['"]([\w@\/-]+)['"]|Module not found: ([\w@\/-]+)/gi);
      const packageNames = packageMatches ? packageMatches
        .map(match => {
          // Extract package name from the match
          const nameMatch = match.match(/['"]([\w@\/-]+)['"]/); 
          return nameMatch ? nameMatch[1] : null;
        })
        .filter(name => name && !name.startsWith('.') && !name.startsWith('@src')) : [];
      
      // Show unique missing packages
      const uniquePackages = [...new Set(packageNames)];
      
      if (uniquePackages.length > 0) {
        console.error('\nMissing npm packages:');
        uniquePackages.forEach(pkg => console.error(`- ${pkg}`));
        console.error('\nSuggested fix:');
        console.error(`npm install ${uniquePackages.join(' ')}`);
      } else {
        // Show general error message with relevant parts of error output
        const relevantLines = fullOutput
          .split('\n')
          .filter(line => line.includes('Cannot find') || line.includes('Error:') || line.includes('error TS'))
          .slice(0, 10); // Limit to first 10 errors to avoid overwhelming output
        
        console.error('\nTypeScript errors found:');
        relevantLines.forEach(line => console.error(`- ${line.trim()}`));
        
        if (relevantLines.length === 10) {
          console.error('... (more errors omitted)');
        }
      }
    } else {
      // If no specific module errors were found, show a more general message
      console.error('\nTypeScript compilation failed, but no missing module errors were found.');
      console.error('Please check your TypeScript code for other types of errors.');
    }
    
    // Exit with error
    process.exit(1);
  }
}

try {
  checkPackages();
} catch (error) {
  console.error('\n❌ Dependency verification failed with an unexpected error:');
  console.error(error.message);
  process.exit(1);
}
