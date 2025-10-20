/**
 * Migration script to move old files to backup
 * Run this to clean up the old structure
 */

import fs from 'fs';
import path from 'path';

const oldFiles = [
  'background.js',
  'content.js', 
  'popup.html',
  'popup.js'
];

const backupDir = 'backup';

// Create backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Move old files to backup
oldFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.renameSync(file, path.join(backupDir, file));
    console.log(`Moved ${file} to backup/`);
  }
});

console.log('Migration complete. Old files moved to backup/ directory.');
