const fs = require('fs');
const path = require('path');

const newName = process.argv[2];
const newDisplayName = process.argv[3] || newName;

if (!newName) {
  console.error('Please provide a new project name.');
  console.error(
    'Usage: node scripts/rename-project.js <NewName> [NewDisplayName]',
    newName,
    newDisplayName,
  );
  process.exit(1);
}

const oldName = 'Stouchi';
const oldNameLower = 'stouchi';
const newNameLower = newName.toLowerCase();

const rootDir = path.resolve(__dirname, '..');

// Helper to update file content
const updateFileContent = (filePath, searchValue, replaceValue) => {
  if (path.basename(filePath) === 'rename-project.js') return; // Don't update self
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const regex = new RegExp(searchValue, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, replaceValue);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated content in ${path.relative(rootDir, filePath)}`);
      }
    } catch {
      // Skip binary or unreadable files
    }
  }
};

// Recursive file walker
const walkDir = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (
        f !== 'node_modules' &&
        f !== '.git' &&
        f !== 'build' &&
        f !== 'dist' &&
        f !== 'Pods'
      ) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
};

console.log(`Renaming project from "${oldName}" to "${newName}"...`);

// 1. Update content in all files
console.log('Updating text in files...');
walkDir(rootDir, filePath => {
  const fileName = path.basename(filePath);
  if (
    /\.(js|jsx|ts|tsx|swift|json|md|html|xml|gradle|plist|pbxproj|storyboard|xcworkspacedata|xcscheme|java|kt|sh|txt|yml|yaml)$/.test(
      filePath,
    ) ||
    fileName === 'Podfile' ||
    fileName === 'Gemfile'
  ) {
    updateFileContent(filePath, oldName, newName);
    updateFileContent(filePath, oldNameLower, newNameLower);
  }
});

// 2. Rename iOS files and directories
console.log('Renaming iOS files and directories...');
const iosDir = path.join(rootDir, 'ios');
if (fs.existsSync(iosDir)) {
  const iosOldDir = path.join(iosDir, oldName);
  const iosNewDir = path.join(iosDir, newName);
  if (fs.existsSync(iosOldDir)) {
    fs.renameSync(iosOldDir, iosNewDir);
    console.log(`Renamed ios/${oldName} to ios/${newName}`);
  }

  const xcodeprojOld = path.join(iosDir, `${oldName}.xcodeproj`);
  const xcodeprojNew = path.join(iosDir, `${newName}.xcodeproj`);
  if (fs.existsSync(xcodeprojOld)) {
    fs.renameSync(xcodeprojOld, xcodeprojNew);
    console.log(`Renamed ios/${oldName}.xcodeproj to ios/${newName}.xcodeproj`);
  }

  const xcworkspaceOld = path.join(iosDir, `${oldName}.xcworkspace`);
  const xcworkspaceNew = path.join(iosDir, `${newName}.xcworkspace`);
  if (fs.existsSync(xcworkspaceOld)) {
    fs.renameSync(xcworkspaceOld, xcworkspaceNew);
    console.log(
      `Renamed ios/${oldName}.xcworkspace to ios/${newName}.xcworkspace`,
    );
  }

  // Rename scheme
  const xcodeprojNewForScheme = path.join(iosDir, `${newName}.xcodeproj`);
  const schemeDir = path.join(xcodeprojNewForScheme, 'xcshareddata/xcschemes');
  const schemeOld = path.join(schemeDir, `${oldName}.xcscheme`);
  const schemeNew = path.join(schemeDir, `${newName}.xcscheme`);
  if (fs.existsSync(schemeOld)) {
    fs.renameSync(schemeOld, schemeNew);
    console.log(`Renamed iOS scheme to ${newName}.xcscheme`);
  }
}

// 3. Rename Android package directories
console.log('Renaming Android package directories...');
const androidBaseDir = path.join(rootDir, 'android/app/src/main/java/com/bk');
if (fs.existsSync(androidBaseDir)) {
  const oldPkgDir = path.join(androidBaseDir, oldNameLower);
  const newPkgDir = path.join(androidBaseDir, newNameLower);
  if (fs.existsSync(oldPkgDir)) {
    fs.renameSync(oldPkgDir, newPkgDir);
    console.log(`Renamed Android package directory to com.bk.${newNameLower}`);
  }
}

console.log('\nRename complete!');
