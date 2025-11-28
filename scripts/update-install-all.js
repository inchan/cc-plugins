#!/usr/bin/env node

/**
 * install-all 플러그인 자동 업데이트 스크립트
 *
 * 기능:
 * - plugins/ 디렉토리의 모든 플러그인 스캔
 * - 각 플러그인의 hooks, skills, commands, agents 추출
 * - install-all/plugin.json 자동 생성/업데이트
 *
 * 사용법:
 *   node scripts/update-install-all.js [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');

// 색상 정의
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// CLI 옵션 파싱
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');

// 경로 설정
const rootDir = path.resolve(__dirname, '..');
const pluginsDir = path.join(rootDir, 'plugins');
const installAllDir = path.join(pluginsDir, 'install-all');
const installAllPluginJson = path.join(installAllDir, '.claude-plugin', 'plugin.json');

/**
 * 플러그인 디렉토리 목록 가져오기
 */
function getPluginDirectories() {
  const items = fs.readdirSync(pluginsDir, { withFileTypes: true });
  return items
    .filter(item => item.isDirectory())
    .filter(item => item.name !== 'install-all') // 자기 자신 제외
    .filter(item => !item.name.startsWith('.')) // 숨김 디렉토리 제외
    .map(item => item.name);
}

/**
 * 플러그인의 plugin.json 읽기
 */
function readPluginJson(pluginName) {
  const pluginJsonPath = path.join(pluginsDir, pluginName, '.claude-plugin', 'plugin.json');

  if (!fs.existsSync(pluginJsonPath)) {
    if (verbose) {
      log(`  ⚠️  plugin.json not found: ${pluginName}`, 'yellow');
    }
    return null;
  }

  try {
    const content = fs.readFileSync(pluginJsonPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`  ❌ Error reading ${pluginName}/plugin.json: ${error.message}`, 'red');
    return null;
  }
}

/**
 * 리소스 경로를 상대 경로로 변환
 */
function toRelativePath(pluginName, resourcePath) {
  // ./ 제거하고 ../ 로 시작하는 경로로 변환
  const cleanPath = resourcePath.replace(/^\.\//, '');
  return `../${pluginName}/${cleanPath}`;
}

/**
 * 모든 플러그인 스캔 및 리소스 수집
 */
function collectResources() {
  const plugins = getPluginDirectories();
  const resources = {
    hooks: [],
    skills: [],
    commands: [],
    agents: []
  };

  log('\n📦 Scanning plugins...', 'cyan');

  for (const pluginName of plugins) {
    if (verbose) {
      log(`\n  🔍 ${pluginName}`, 'blue');
    }

    const pluginJson = readPluginJson(pluginName);
    if (!pluginJson) continue;

    // hooks 수집
    if (pluginJson.hooks && Array.isArray(pluginJson.hooks)) {
      pluginJson.hooks.forEach(hook => {
        const relativePath = toRelativePath(pluginName, hook);
        resources.hooks.push(relativePath);
        if (verbose) {
          log(`    📌 hook: ${relativePath}`, 'dim');
        }
      });
    }

    // skills 수집
    if (pluginJson.skills && Array.isArray(pluginJson.skills)) {
      pluginJson.skills.forEach(skill => {
        const relativePath = toRelativePath(pluginName, skill);
        resources.skills.push(relativePath);
        if (verbose) {
          log(`    🎯 skill: ${relativePath}`, 'dim');
        }
      });
    }

    // commands 수집
    if (pluginJson.commands && Array.isArray(pluginJson.commands)) {
      pluginJson.commands.forEach(command => {
        const relativePath = toRelativePath(pluginName, command);
        resources.commands.push(relativePath);
        if (verbose) {
          log(`    ⚡ command: ${relativePath}`, 'dim');
        }
      });
    }

    // agents 수집
    if (pluginJson.agents && Array.isArray(pluginJson.agents)) {
      pluginJson.agents.forEach(agent => {
        const relativePath = toRelativePath(pluginName, agent);
        resources.agents.push(relativePath);
        if (verbose) {
          log(`    🤖 agent: ${relativePath}`, 'dim');
        }
      });
    }
  }

  return resources;
}

/**
 * install-all plugin.json 생성
 */
function generateInstallAllPluginJson(resources) {
  const pluginJson = {
    name: 'install-all',
    version: '0.0.1',
    description: 'Meta-plugin that aggregates all cc-skills plugins via relative path references',
    author: {
      name: 'inchan',
      url: 'https://github.com/inchan'
    },
    license: 'MIT'
  };

  // 리소스가 있을 때만 필드 추가
  if (resources.hooks.length > 0) {
    pluginJson.hooks = resources.hooks;
  }
  if (resources.skills.length > 0) {
    pluginJson.skills = resources.skills;
  }
  if (resources.commands.length > 0) {
    pluginJson.commands = resources.commands;
  }
  if (resources.agents.length > 0) {
    pluginJson.agents = resources.agents;
  }

  return pluginJson;
}

/**
 * 파일 저장
 */
function savePluginJson(pluginJson) {
  // 디렉토리 생성
  const dir = path.dirname(installAllPluginJson);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`\n📁 Created directory: ${dir}`, 'green');
  }

  // 기존 파일 백업
  if (fs.existsSync(installAllPluginJson) && !dryRun) {
    const backupPath = `${installAllPluginJson}.backup`;
    fs.copyFileSync(installAllPluginJson, backupPath);
    log(`\n💾 Backup created: ${backupPath}`, 'yellow');
  }

  // 파일 저장
  const content = JSON.stringify(pluginJson, null, 2) + '\n';

  if (dryRun) {
    log('\n📄 [DRY RUN] Generated plugin.json:', 'cyan');
    console.log(content);
  } else {
    fs.writeFileSync(installAllPluginJson, content, 'utf8');
    log(`\n✅ Updated: ${installAllPluginJson}`, 'green');
  }
}

/**
 * 통계 출력
 */
function printStats(resources) {
  log('\n📊 Summary:', 'cyan');
  log(`  📌 Hooks:    ${resources.hooks.length}`, 'dim');
  log(`  🎯 Skills:   ${resources.skills.length}`, 'dim');
  log(`  ⚡ Commands: ${resources.commands.length}`, 'dim');
  log(`  🤖 Agents:   ${resources.agents.length}`, 'dim');
  log(`  ━━━━━━━━━━━━━━━━━━━━━━━`, 'dim');
  log(`  📦 Total:    ${resources.hooks.length + resources.skills.length + resources.commands.length + resources.agents.length}`, 'green');
}

/**
 * 메인 실행
 */
function main() {
  log('🚀 install-all Plugin Updater', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');

  if (dryRun) {
    log('🔍 Running in DRY RUN mode (no files will be modified)\n', 'yellow');
  }

  // 리소스 수집
  const resources = collectResources();

  // 통계 출력
  printStats(resources);

  // plugin.json 생성
  const pluginJson = generateInstallAllPluginJson(resources);
  savePluginJson(pluginJson);

  log('\n✨ Done!', 'green');

  if (dryRun) {
    log('\n💡 Run without --dry-run to apply changes', 'yellow');
  }
}

// 실행
main();
