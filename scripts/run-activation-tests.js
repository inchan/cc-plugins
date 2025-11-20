#!/usr/bin/env node
/**
 * 스킬 활성화 테스트 자동화 스크립트
 *
 * 테스트 프롬프트를 skill-rules.json의 키워드/패턴과 매칭하여
 * 예상대로 스킬이 활성화되는지 검증합니다.
 */

const fs = require('fs');
const path = require('path');

const SKILL_RULES_PATH = path.join(__dirname, '../skills/skill-rules.json');

// 테스트 케이스 정의
const TEST_CASES = [
  // 1. skill-developer
  { id: '1.1', prompt: '새로운 스킬을 만들어줘', expected: 'skill-developer' },
  { id: '1.2', prompt: 'skill-rules.json 수정 방법 알려줘', expected: 'skill-developer' },

  // 2. meta-prompt-generator-v2
  { id: '2.1', prompt: '슬래시 커맨드 생성해줘', expected: 'meta-prompt-generator-v2' },
  { id: '2.2', prompt: '프롬프트 만들어줘', expected: 'meta-prompt-generator-v2' },

  // 3. backend-dev-guidelines
  { id: '3.1', prompt: '새 API 엔드포인트 추가해줘', expected: 'backend-dev-guidelines' },
  { id: '3.2', prompt: 'Express 라우트 구현해줘', expected: 'backend-dev-guidelines' },

  // 4. frontend-dev-guidelines
  { id: '4.1', prompt: 'React 컴포넌트 만들어줘', expected: 'frontend-dev-guidelines' },
  { id: '4.2', prompt: 'MUI Grid 레이아웃 구현해줘', expected: 'frontend-dev-guidelines' },

  // 5. route-tester
  { id: '5.1', prompt: 'API 라우트 테스트해줘', expected: 'route-tester' },
  { id: '5.2', prompt: '인증된 엔드포인트 검증해줘', expected: 'route-tester' },

  // 6. error-tracking
  { id: '6.1', prompt: 'Sentry 에러 트래킹 추가해줘', expected: 'error-tracking' },
  { id: '6.2', prompt: '에러 핸들링 구현해줘', expected: 'error-tracking' },

  // 7. prompt-enhancer
  { id: '7.1', prompt: '요구사항 상세화해줘', expected: 'prompt-enhancer' },
  { id: '7.2', prompt: '프로젝트 컨텍스트 분석해줘', expected: 'prompt-enhancer' },

  // 8. agent-workflow-manager
  { id: '8.1', prompt: '전체 워크플로우 실행해줘', expected: 'agent-workflow-manager' },
  { id: '8.2', prompt: '작업 자동화해줘', expected: 'agent-workflow-manager' },

  // 9. agent-workflow-advisor
  { id: '9.1', prompt: '어떤 패턴을 써야 할까?', expected: 'agent-workflow-advisor' },
  { id: '9.2', prompt: '워크플로우 추천해줘', expected: 'agent-workflow-advisor' },

  // 10. intelligent-task-router
  { id: '10.1', prompt: '작업 분류해줘', expected: 'intelligent-task-router' },
  { id: '10.2', prompt: '라우팅 설정해줘', expected: 'intelligent-task-router' },

  // 11. parallel-task-executor
  { id: '11.1', prompt: '병렬로 처리해줘', expected: 'parallel-task-executor' },
  { id: '11.2', prompt: '동시에 실행해줘', expected: 'parallel-task-executor' },

  // 12. dynamic-task-orchestrator
  { id: '12.1', prompt: '복잡한 프로젝트 처리해줘', expected: 'dynamic-task-orchestrator' },
  { id: '12.2', prompt: '전체 스택 개발해줘', expected: 'dynamic-task-orchestrator' },

  // 13. sequential-task-processor
  { id: '13.1', prompt: '단계별로 처리해줘', expected: 'sequential-task-processor' },
  { id: '13.2', prompt: '순차적으로 실행해줘', expected: 'sequential-task-processor' },

  // 14. iterative-quality-enhancer
  { id: '14.1', prompt: '코드 품질 개선해줘', expected: 'iterative-quality-enhancer' },
  { id: '14.2', prompt: '최적화 반복해줘', expected: 'iterative-quality-enhancer' },

  // 15. dual-ai-loop
  { id: '15.1', prompt: 'codex로 구현해줘', expected: 'dual-ai-loop' },
  { id: '15.2', prompt: 'AI 협업으로 처리해줘', expected: 'dual-ai-loop' },

  // 16. reflection-review
  { id: '16.1', prompt: '코드 피드백 생성해줘', expected: 'reflection-review' },
  { id: '16.2', prompt: '자기비판 리뷰해줘', expected: 'reflection-review' },
];

// 스킬 매칭 함수
function matchSkill(prompt, skillRules) {
  const matches = [];
  const promptLower = prompt.toLowerCase();

  for (const [skillName, config] of Object.entries(skillRules.skills)) {
    let score = 0;
    const matchReasons = [];

    // 키워드 매칭
    if (config.promptTriggers?.keywords) {
      for (const keyword of config.promptTriggers.keywords) {
        if (promptLower.includes(keyword.toLowerCase())) {
          score += 10;
          matchReasons.push(`keyword: "${keyword}"`);
        }
      }
    }

    // 인텐트 패턴 매칭
    if (config.promptTriggers?.intentPatterns) {
      for (const pattern of config.promptTriggers.intentPatterns) {
        try {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(prompt)) {
            score += 20;
            matchReasons.push(`pattern: "${pattern}"`);
          }
        } catch (e) {
          // 정규식 오류 무시
        }
      }
    }

    if (score > 0) {
      matches.push({
        skill: skillName,
        score,
        priority: config.priority,
        reasons: matchReasons
      });
    }
  }

  // 점수 순 정렬 (동점이면 priority로)
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return matches;
}

// 메인 실행
function main() {
  console.log('='.repeat(60));
  console.log('🧪 스킬 활성화 테스트 실행');
  console.log('='.repeat(60));
  console.log();

  // skill-rules.json 로드
  let skillRules;
  try {
    skillRules = JSON.parse(fs.readFileSync(SKILL_RULES_PATH, 'utf8'));
  } catch (error) {
    console.error(`❌ Failed to load skill-rules.json: ${error.message}`);
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;
  const failures = [];
  const details = [];

  // 각 테스트 케이스 실행
  for (const testCase of TEST_CASES) {
    const matches = matchSkill(testCase.prompt, skillRules);
    const topMatch = matches[0]?.skill || null;
    const isPass = topMatch === testCase.expected;

    if (isPass) {
      passed++;
      console.log(`✅ [${testCase.id}] "${testCase.prompt.substring(0, 30)}..." → ${topMatch}`);
    } else {
      failed++;
      const actual = topMatch || '(no match)';
      console.log(`❌ [${testCase.id}] "${testCase.prompt.substring(0, 30)}..." → ${actual} (expected: ${testCase.expected})`);
      failures.push({
        ...testCase,
        actual,
        allMatches: matches.slice(0, 3)
      });
    }

    details.push({
      id: testCase.id,
      prompt: testCase.prompt,
      expected: testCase.expected,
      actual: topMatch,
      passed: isPass,
      allMatches: matches.slice(0, 3)
    });
  }

  // 결과 요약
  console.log();
  console.log('='.repeat(60));
  console.log('📊 테스트 결과 요약');
  console.log('='.repeat(60));
  console.log(`   총 테스트: ${TEST_CASES.length}`);
  console.log(`   통과: ${passed} (${(passed/TEST_CASES.length*100).toFixed(1)}%)`);
  console.log(`   실패: ${failed} (${(failed/TEST_CASES.length*100).toFixed(1)}%)`);

  // 실패 케이스 상세
  if (failures.length > 0) {
    console.log();
    console.log('❌ 실패 케이스 상세:');
    console.log('-'.repeat(60));
    for (const f of failures) {
      console.log(`\n[${f.id}] "${f.prompt}"`);
      console.log(`   예상: ${f.expected}`);
      console.log(`   실제: ${f.actual}`);
      if (f.allMatches.length > 0) {
        console.log(`   전체 매칭:`);
        for (const m of f.allMatches) {
          console.log(`     - ${m.skill} (score: ${m.score}, priority: ${m.priority})`);
        }
      }
    }
  }

  // 결과 파일 저장
  const resultPath = path.join(__dirname, '../tests/activation-test-results.json');
  fs.writeFileSync(resultPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: TEST_CASES.length,
      passed,
      failed,
      passRate: (passed/TEST_CASES.length*100).toFixed(1) + '%'
    },
    details,
    failures
  }, null, 2));
  console.log(`\n📁 상세 결과 저장: ${resultPath}`);

  // 종합 판정
  console.log();
  console.log('='.repeat(60));
  const passRate = passed / TEST_CASES.length * 100;
  if (passRate >= 80) {
    console.log(`✅ 테스트 PASSED (${passRate.toFixed(1)}% >= 80%)`);
    process.exit(0);
  } else if (passRate >= 60) {
    console.log(`⚠️  테스트 PARTIAL PASS (${passRate.toFixed(1)}% >= 60%)`);
    process.exit(0);
  } else {
    console.log(`❌ 테스트 FAILED (${passRate.toFixed(1)}% < 60%)`);
    process.exit(1);
  }
}

main();
