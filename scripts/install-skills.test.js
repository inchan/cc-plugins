/**
 * install-skills.js 테스트
 *
 * 실행: node scripts/install-skills.test.js
 */

const path = require('path');
const assert = require('assert');

// 테스트 대상 모듈
const {
  validatePath,
  validateSourcePath,
  mergeSkillRules,
  mergeSettings,
  config
} = require('./install-skills');

// 테스트 결과
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// 테스트 헬퍼
function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
}

// =============================================================================
// validatePath 테스트
// =============================================================================

console.log('\n--- validatePath Tests ---\n');

test('validatePath: global path should be valid', () => {
  const home = process.env.HOME || process.env.USERPROFILE;
  const globalPath = path.join(home, '.claude');
  const result = validatePath(globalPath);
  assert.strictEqual(result, globalPath);
});

test('validatePath: workspace path should be valid', () => {
  const workspacePath = path.join(process.cwd(), '.claude');
  const result = validatePath(workspacePath);
  assert.strictEqual(result, workspacePath);
});

test('validatePath: subpath under .claude should be valid', () => {
  const subPath = path.join(process.cwd(), '.claude', 'skills', 'test');
  const result = validatePath(subPath);
  assert.strictEqual(result, subPath);
});

test('validatePath: invalid path should throw error', () => {
  const invalidPath = '/tmp/malicious';
  assert.throws(() => {
    validatePath(invalidPath);
  }, /허용되지 않은 경로/);
});

test('validatePath: path traversal attack should throw error', () => {
  const home = process.env.HOME || process.env.USERPROFILE;
  const maliciousPath = path.join(home, '.claude', '..', '..', 'etc');
  // Note: path.resolve normalizes the path, so this tests the isAllowed check
  assert.throws(() => {
    validatePath(maliciousPath);
  }, /허용되지 않은 경로/);
});

// =============================================================================
// mergeSkillRules 테스트
// =============================================================================

console.log('\n--- mergeSkillRules Tests ---\n');

test('mergeSkillRules: should preserve existing skills', () => {
  const dest = {
    version: '1.0',
    skills: {
      existingSkill: { type: 'domain' }
    }
  };
  const src = {
    version: '2.0',
    skills: {
      newSkill: { type: 'guardrail' }
    }
  };

  const result = mergeSkillRules(dest, src);

  assert.strictEqual(result.version, '2.0');
  assert.ok(result.skills.existingSkill);
  assert.ok(result.skills.newSkill);
});

test('mergeSkillRules: should update existing skill', () => {
  const dest = {
    skills: {
      skill1: { type: 'domain', priority: 'low' }
    }
  };
  const src = {
    skills: {
      skill1: { type: 'domain', priority: 'high' }
    }
  };

  const result = mergeSkillRules(dest, src);

  assert.strictEqual(result.skills.skill1.priority, 'high');
});

test('mergeSkillRules: should handle empty dest', () => {
  const dest = {};
  const src = {
    version: '1.0',
    skills: {
      skill1: { type: 'domain' }
    }
  };

  const result = mergeSkillRules(dest, src);

  assert.strictEqual(result.version, '1.0');
  assert.ok(result.skills.skill1);
});

test('mergeSkillRules: should handle empty src skills', () => {
  const dest = {
    skills: {
      skill1: { type: 'domain' }
    }
  };
  const src = {
    version: '2.0',
    skills: {}
  };

  const result = mergeSkillRules(dest, src);

  assert.ok(result.skills.skill1);
});

// =============================================================================
// mergeSettings 테스트
// =============================================================================

console.log('\n--- mergeSettings Tests ---\n');

test('mergeSettings: should merge hooks', () => {
  const dest = {
    permissions: { allow: ['Read'] },
    hooks: {
      UserPromptSubmit: [{ matcher: '', hooks: [] }]
    }
  };
  const src = {
    hooks: {
      PostToolUse: [{ matcher: 'Edit', hooks: [] }]
    }
  };

  const result = mergeSettings(dest, src);

  assert.ok(result.permissions);
  assert.ok(result.hooks.UserPromptSubmit);
  assert.ok(result.hooks.PostToolUse);
});

test('mergeSettings: should preserve non-hooks properties', () => {
  const dest = {
    customProperty: 'value',
    hooks: {}
  };
  const src = {
    hooks: {
      Stop: []
    }
  };

  const result = mergeSettings(dest, src);

  assert.strictEqual(result.customProperty, 'value');
});

test('mergeSettings: should handle empty dest hooks', () => {
  const dest = {};
  const src = {
    hooks: {
      UserPromptSubmit: []
    }
  };

  const result = mergeSettings(dest, src);

  assert.ok(result.hooks.UserPromptSubmit);
});

// =============================================================================
// Edge Cases
// =============================================================================

console.log('\n--- Edge Case Tests ---\n');

test('mergeSkillRules: should handle null/undefined gracefully', () => {
  const dest = { skills: null };
  const src = { skills: { skill1: {} } };

  // This should not throw
  const result = mergeSkillRules(dest, src);
  assert.ok(result.skills.skill1);
});

test('mergeSettings: should handle nested hook arrays', () => {
  const dest = {
    hooks: {
      UserPromptSubmit: [
        { matcher: 'a', hooks: [{ type: 'command' }] }
      ]
    }
  };
  const src = {
    hooks: {
      UserPromptSubmit: [
        { matcher: 'b', hooks: [{ type: 'command' }] }
      ]
    }
  };

  const result = mergeSettings(dest, src);

  // src의 hooks가 dest를 덮어씀 (shallow merge)
  assert.strictEqual(result.hooks.UserPromptSubmit.length, 1);
  assert.strictEqual(result.hooks.UserPromptSubmit[0].matcher, 'b');
});

// =============================================================================
// 결과 출력
// =============================================================================

console.log('\n' + '='.repeat(40));
console.log('테스트 결과');
console.log('='.repeat(40));
console.log(`통과: ${results.passed}`);
console.log(`실패: ${results.failed}`);
console.log(`총계: ${results.passed + results.failed}`);

if (results.failed > 0) {
  console.log('\n실패한 테스트:');
  results.tests
    .filter(t => t.status === 'FAIL')
    .forEach(t => console.log(`  - ${t.name}: ${t.error}`));
  process.exit(1);
} else {
  console.log('\n✓ 모든 테스트 통과!\n');
  process.exit(0);
}
