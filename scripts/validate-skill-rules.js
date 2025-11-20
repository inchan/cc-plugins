#!/usr/bin/env node
/**
 * skill-rules.json 검증 스크립트
 *
 * 검증 항목:
 * 1. JSON 구문 유효성
 * 2. 필수 필드 존재 여부
 * 3. intentPattern 정규식 유효성
 * 4. 키워드 중복 검사
 * 5. priority/enforcement 값 유효성
 */

const fs = require('fs');
const path = require('path');

const SKILL_RULES_PATH = path.join(__dirname, '../skills/skill-rules.json');

// 유효한 값 정의
const VALID_TYPES = ['domain', 'file', 'tool'];
const VALID_ENFORCEMENTS = ['suggest', 'block', 'warn'];
const VALID_PRIORITIES = ['critical', 'high', 'medium', 'low'];

let errors = [];
let warnings = [];

function logError(message) {
  errors.push(`❌ ERROR: ${message}`);
}

function logWarning(message) {
  warnings.push(`⚠️  WARNING: ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

// 1. JSON 파싱 검증
function validateJsonSyntax() {
  try {
    const content = fs.readFileSync(SKILL_RULES_PATH, 'utf8');
    const data = JSON.parse(content);
    logSuccess('JSON syntax is valid');
    return data;
  } catch (error) {
    logError(`JSON parsing failed: ${error.message}`);
    return null;
  }
}

// 2. 필수 필드 검증
function validateRequiredFields(data) {
  if (!data.skills) {
    logError('Missing required field: "skills"');
    return false;
  }

  let valid = true;
  for (const [skillName, skillConfig] of Object.entries(data.skills)) {
    // type 검증
    if (!skillConfig.type) {
      logError(`[${skillName}] Missing required field: "type"`);
      valid = false;
    } else if (!VALID_TYPES.includes(skillConfig.type)) {
      logError(`[${skillName}] Invalid type: "${skillConfig.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
      valid = false;
    }

    // enforcement 검증
    if (!skillConfig.enforcement) {
      logError(`[${skillName}] Missing required field: "enforcement"`);
      valid = false;
    } else if (!VALID_ENFORCEMENTS.includes(skillConfig.enforcement)) {
      logError(`[${skillName}] Invalid enforcement: "${skillConfig.enforcement}". Must be one of: ${VALID_ENFORCEMENTS.join(', ')}`);
      valid = false;
    }

    // priority 검증
    if (!skillConfig.priority) {
      logError(`[${skillName}] Missing required field: "priority"`);
      valid = false;
    } else if (!VALID_PRIORITIES.includes(skillConfig.priority)) {
      logError(`[${skillName}] Invalid priority: "${skillConfig.priority}". Must be one of: ${VALID_PRIORITIES.join(', ')}`);
      valid = false;
    }

    // description 검증 (권장)
    if (!skillConfig.description) {
      logWarning(`[${skillName}] Missing recommended field: "description"`);
    }
  }

  if (valid) {
    logSuccess('All required fields are present and valid');
  }
  return valid;
}

// 3. 정규식 유효성 검증
function validateRegexPatterns(data) {
  let valid = true;

  for (const [skillName, skillConfig] of Object.entries(data.skills)) {
    // promptTriggers의 intentPatterns 검증
    if (skillConfig.promptTriggers?.intentPatterns) {
      for (const pattern of skillConfig.promptTriggers.intentPatterns) {
        try {
          new RegExp(pattern, 'i');
        } catch (error) {
          logError(`[${skillName}] Invalid regex in intentPatterns: "${pattern}" - ${error.message}`);
          valid = false;
        }
      }
    }

    // fileTriggers의 contentPatterns 검증
    if (skillConfig.fileTriggers?.contentPatterns) {
      for (const pattern of skillConfig.fileTriggers.contentPatterns) {
        try {
          new RegExp(pattern);
        } catch (error) {
          logError(`[${skillName}] Invalid regex in contentPatterns: "${pattern}" - ${error.message}`);
          valid = false;
        }
      }
    }
  }

  if (valid) {
    logSuccess('All regex patterns are valid');
  }
  return valid;
}

// 4. 키워드 중복 검사
function checkKeywordDuplicates(data) {
  const keywordMap = new Map(); // keyword -> [skill names]

  for (const [skillName, skillConfig] of Object.entries(data.skills)) {
    if (skillConfig.promptTriggers?.keywords) {
      for (const keyword of skillConfig.promptTriggers.keywords) {
        const normalizedKeyword = keyword.toLowerCase();
        if (!keywordMap.has(normalizedKeyword)) {
          keywordMap.set(normalizedKeyword, []);
        }
        keywordMap.get(normalizedKeyword).push(skillName);
      }
    }
  }

  // 중복 키워드 찾기
  let hasDuplicates = false;
  for (const [keyword, skills] of keywordMap) {
    if (skills.length > 1) {
      logWarning(`Keyword "${keyword}" is used by multiple skills: ${skills.join(', ')}`);
      hasDuplicates = true;
    }
  }

  if (!hasDuplicates) {
    logSuccess('No duplicate keywords found');
  }
  return !hasDuplicates;
}

// 5. 스킬 수 및 통계
function printStatistics(data) {
  const skills = Object.keys(data.skills);
  const byPriority = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  for (const skillConfig of Object.values(data.skills)) {
    if (skillConfig.priority) {
      byPriority[skillConfig.priority]++;
    }
  }

  console.log('\n📊 Statistics:');
  console.log(`   Total skills: ${skills.length}`);
  console.log(`   By priority: critical(${byPriority.critical}), high(${byPriority.high}), medium(${byPriority.medium}), low(${byPriority.low})`);
}

// 메인 실행
function main() {
  console.log('='.repeat(50));
  console.log('🔍 Validating skill-rules.json');
  console.log('='.repeat(50));
  console.log();

  // JSON 파싱
  const data = validateJsonSyntax();
  if (!data) {
    console.log('\n' + errors.join('\n'));
    process.exit(1);
  }

  // 검증 실행
  validateRequiredFields(data);
  validateRegexPatterns(data);
  checkKeywordDuplicates(data);
  printStatistics(data);

  // 결과 출력
  console.log('\n' + '='.repeat(50));

  if (errors.length > 0) {
    console.log('\n🚨 Errors found:');
    errors.forEach(e => console.log('   ' + e));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log('   ' + w));
  }

  if (errors.length === 0) {
    console.log('\n✅ Validation PASSED');
    if (warnings.length > 0) {
      console.log(`   (${warnings.length} warnings to review)`);
    }
    process.exit(0);
  } else {
    console.log(`\n❌ Validation FAILED (${errors.length} errors)`);
    process.exit(1);
  }
}

main();
