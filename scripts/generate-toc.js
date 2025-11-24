#!/usr/bin/env node

/**
 * TOC (Table of Contents) Generator for Markdown Files
 *
 * Usage:
 *   node scripts/generate-toc.js <file-path>
 *   node scripts/generate-toc.js docs/SKILL-DEVELOPMENT-GUIDE.md
 *
 * Features:
 * - Automatically extracts ## headers from Markdown files
 * - Generates numbered TOC with anchor links
 * - Inserts TOC after first header (# title)
 * - Handles Korean and English headings
 * - Preserves existing content
 */

const fs = require('fs');
const path = require('path');

// Convert heading text to GitHub-compatible anchor
function toAnchor(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '') // Keep alphanumeric, spaces, Korean, hyphens
    .trim()
    .replace(/\s+/g, '-');
}

// Extract ## level headers from markdown content
function extractHeaders(content) {
  const lines = content.split('\n');
  const headers = [];

  for (const line of lines) {
    // Match ## headers (but not # or ###)
    const match = line.match(/^## (.+)$/);
    if (match) {
      headers.push(match[1].trim());
    }
  }

  return headers;
}

// Generate TOC markdown
function generateTOC(headers) {
  if (headers.length === 0) {
    return '';
  }

  let toc = '## 목차\n\n';

  headers.forEach((header, index) => {
    const anchor = toAnchor(header);
    toc += `${index + 1}. [${header}](#${anchor})\n`;
  });

  toc += '\n---\n';

  return toc;
}

// Insert or update TOC in markdown file
function insertTOC(content, toc) {
  const lines = content.split('\n');
  let insertIndex = -1;
  let existingTOCStart = -1;
  let existingTOCEnd = -1;

  // Find first # header
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^# /)) {
      insertIndex = i + 1;

      // Skip empty lines after title
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }

      break;
    }
  }

  if (insertIndex === -1) {
    console.error('Error: No # header found in file');
    return content;
  }

  // Check if TOC already exists
  for (let i = insertIndex; i < lines.length; i++) {
    if (lines[i].match(/^## 목차$/)) {
      existingTOCStart = i;

      // Find end of TOC (next ## header or ---)
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].match(/^---$/)) {
          existingTOCEnd = j;
          break;
        }
      }

      break;
    }
  }

  // Insert or replace TOC
  if (existingTOCStart !== -1 && existingTOCEnd !== -1) {
    // Replace existing TOC
    console.log('Replacing existing TOC...');
    const before = lines.slice(0, existingTOCStart);
    const after = lines.slice(existingTOCEnd + 1);
    return [...before, toc, ...after].join('\n');
  } else {
    // Insert new TOC
    console.log('Inserting new TOC...');
    const before = lines.slice(0, insertIndex);
    const after = lines.slice(insertIndex);
    return [...before, '', toc, '', ...after].join('\n');
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node generate-toc.js <file-path>');
    console.error('Example: node generate-toc.js docs/SKILL-DEVELOPMENT-GUIDE.md');
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`Processing: ${filePath}`);

  // Read file
  const content = fs.readFileSync(filePath, 'utf8');
  const lineCount = content.split('\n').length;

  console.log(`File has ${lineCount} lines`);

  // Extract headers
  const headers = extractHeaders(content);
  console.log(`Found ${headers.length} headers (##)`);

  if (headers.length === 0) {
    console.log('No ## headers found. Skipping TOC generation.');
    return;
  }

  // Generate TOC
  const toc = generateTOC(headers);

  // Insert TOC
  const updatedContent = insertTOC(content, toc);

  // Write back to file
  fs.writeFileSync(filePath, updatedContent, 'utf8');

  console.log('✅ TOC generated successfully!');
  console.log('\nGenerated TOC:');
  console.log(toc);
}

main();
