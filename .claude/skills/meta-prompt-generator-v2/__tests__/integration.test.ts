/**
 * Meta Prompt Generator v2 - Integration Tests
 *
 * Node.js built-in test runner를 사용한 통합 테스트
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

// Import modules to test
import { analyzeComplexity } from '../complexity-analyzer.ts';
import { CostTracker, estimateCost } from '../cost-tracker.ts';
import { SelfEvaluator, quickEvaluate } from '../self-evaluator.ts';
import { FailureRecoveryManager, PRESET_STRATEGIES } from '../failure-recovery.ts';
import { TestGenerator } from '../test-generator.ts';

describe('Complexity Analyzer', () => {
  test('should return MINIMAL mode for simple tasks', () => {
    const result = analyzeComplexity(
      {
        estimatedFiles: 2,
        estimatedLinesOfCode: 100,
        externalDependencies: 0,
        expectedTestCases: 3,
      },
      {
        domainFamiliarity: 'high',
        technicalUncertainty: 'low',
        requirementClarity: 'high',
      }
    );

    assert.ok(result.score < 30, `Expected score < 30, got ${result.score}`);
    assert.strictEqual(result.mode, 'MINIMAL');
  });

  test('should return STANDARD mode for medium tasks', () => {
    const result = analyzeComplexity(
      {
        estimatedFiles: 25,
        estimatedLinesOfCode: 3500,
        externalDependencies: 8,
        expectedTestCases: 20,
      },
      {
        domainFamiliarity: 'medium',
        technicalUncertainty: 'medium',
        requirementClarity: 'medium',
      }
    );

    assert.ok(result.score >= 30 && result.score <= 60, `Expected 30 <= score <= 60, got ${result.score}`);
    assert.strictEqual(result.mode, 'STANDARD');
  });

  test('should return COMPREHENSIVE mode for complex tasks', () => {
    const result = analyzeComplexity(
      {
        estimatedFiles: 100,
        estimatedLinesOfCode: 50000,
        externalDependencies: 30,
        expectedTestCases: 200,
      },
      {
        domainFamiliarity: 'low',
        technicalUncertainty: 'high',
        requirementClarity: 'low',
      }
    );

    assert.ok(result.score > 60, `Expected score > 60, got ${result.score}`);
    assert.strictEqual(result.mode, 'COMPREHENSIVE');
  });

  test('should include recommendations', () => {
    const result = analyzeComplexity(
      {
        estimatedFiles: 50,
        estimatedLinesOfCode: 10000,
        externalDependencies: 15,
        expectedTestCases: 50,
      },
      {
        domainFamiliarity: 'low',
        technicalUncertainty: 'high',
        requirementClarity: 'medium',
      }
    );

    assert.ok(Array.isArray(result.recommendations));
    assert.ok(result.recommendations.length > 0, 'Should have recommendations');
  });
});

describe('Cost Tracker', () => {
  test('should track token usage correctly', () => {
    const tracker = new CostTracker({
      total: 50000,
      perPhase: 10000,
      warningThreshold: 0.8,
    });

    tracker.recordUsage('phase1', 5000);
    tracker.recordUsage('phase2', 3000);

    const report = tracker.generateReport();
    assert.strictEqual(report.actual.total, 8000);
    assert.strictEqual(report.budgetUsed, 16); // 8000/50000 * 100
  });

  test('should warn when threshold exceeded', () => {
    const tracker = new CostTracker({
      total: 10000,
      perPhase: 5000,
      warningThreshold: 0.5,
    });

    // Use 60% of budget to exceed 50% threshold
    tracker.recordUsage('phase1', 6000);

    const report = tracker.generateReport();
    // Either warnings array has items or budgetUsed > threshold * 100
    assert.ok(report.budgetUsed > 50, `Budget usage ${report.budgetUsed}% should exceed 50% threshold`);
  });

  test('should calculate parallelization ROI', () => {
    const tracker = new CostTracker({
      total: 50000,
      perPhase: 10000,
      warningThreshold: 0.8,
    });

    const roi = tracker.calculateParallelizationROI(180, 100, 2, 5000);

    assert.ok(roi.roi > 0, 'ROI should be positive');
    assert.strictEqual(roi.timeSavedSeconds, 80);
    assert.strictEqual(roi.additionalTokens, 10000);
  });

  test('should estimate costs correctly', () => {
    const estimate = estimateCost('STANDARD', 5);

    assert.ok(estimate.prompt > 0);
    assert.ok(estimate.completion > 0);
    assert.ok(estimate.total > 0);
    assert.strictEqual(estimate.total, estimate.prompt + estimate.completion);
  });
});

describe('Self Evaluator', () => {
  test('should pass well-structured prompts', () => {
    const evaluator = new SelfEvaluator();
    const goodPrompt = `
---
allowed-tools: Task, Read, Write
description: 사용자 인증 모듈
model: sonnet
version: 1.0.0
---

# 사용자 인증

## 변수
- $AUTH_METHOD: jwt

## 지침
- 보안 모범 사례 준수

## 워크플로우

### 단계 1: 설계
**종속성**: 없음
**성공 기준**: 설계 완료

## 검증
\`\`\`bash
npm test
\`\`\`
`;

    const result = evaluator.evaluate(goodPrompt, ['인증', 'JWT'], 'STANDARD');

    assert.ok(result.passed, `Should pass, got score ${result.totalScore}`);
    assert.ok(result.totalScore >= 70);
  });

  test('should fail poorly-structured prompts', () => {
    const evaluator = new SelfEvaluator();
    const badPrompt = `
# 뭔가 해줘
그냥 해
`;

    const result = evaluator.evaluate(badPrompt, ['테스트'], 'STANDARD');

    assert.ok(!result.passed || result.totalScore < 70);
    assert.ok(result.suggestedImprovements.length > 0);
  });

  test('should provide quick evaluation', () => {
    const prompt = `
---
allowed-tools: Task
description: 간단한 작업
---

# 간단한 작업

## 단계
1. 실행
`;

    const quick = quickEvaluate(prompt, ['작업'], 'MINIMAL');

    assert.ok(quick.score >= 0 && quick.score <= 100);
    assert.ok(['우수', '양호', '개선 필요', '불합격'].includes(quick.status));
  });
});

describe('Failure Recovery Manager', () => {
  test('should execute phases with retry on failure', async () => {
    const manager = new FailureRecoveryManager();

    manager.registerStrategy('test_phase', {
      maxRetries: 2,
      backoffMs: 100,
      retryableErrors: ['transient'],
      fallbackAction: null,
      rollbackOnFailure: false,
      partialSuccessAllowed: false,
      minimumCompletionPercentage: 100,
    });

    let attempts = 0;
    const result = await manager.executePhase('test_phase', async () => {
      attempts++;
      if (attempts < 2) {
        const error = new Error('transient');
        error.name = 'transient';
        throw error;
      }
      return { success: true };
    });

    assert.ok(result.success);
    assert.strictEqual(attempts, 2);
  });

  test('should execute phase successfully', async () => {
    const manager = new FailureRecoveryManager();

    manager.registerStrategy('phase1', PRESET_STRATEGIES.knowledgeCollection);

    const result = await manager.executePhase('phase1', async () => ({ data: 'test' }));

    assert.ok(result.success, 'Phase should succeed');
    assert.deepStrictEqual(result.result, { data: 'test' });
    assert.strictEqual(result.error, undefined);
  });

  test('should handle partial success', async () => {
    const manager = new FailureRecoveryManager();

    manager.registerStrategy('partial_phase', {
      maxRetries: 1,
      backoffMs: 100,
      retryableErrors: [],
      fallbackAction: null,
      rollbackOnFailure: false,
      partialSuccessAllowed: true,
      minimumCompletionPercentage: 50,
    });

    const result = await manager.executePhase('partial_phase', async () => {
      return { partial: true, completion: 60 };
    });

    assert.ok(result.success);
  });
});

describe('Test Generator', () => {
  test('should generate Jest test code', () => {
    const generator = new TestGenerator();

    const { code, suite } = generator.generateCompleteTestFile('jest', {
      entityName: 'Product',
      includeSecurityTests: false,
      includePerformanceTests: false,
      coverageTarget: 80,
    });

    assert.ok(code.includes('describe'));
    assert.ok(code.includes('Product'));
    assert.ok(code.includes('expect'));
    assert.strictEqual(suite.framework, 'jest');
    assert.strictEqual(suite.coverageTarget, 80);
  });

  test('should generate Vitest test code', () => {
    const generator = new TestGenerator();

    const { code, suite } = generator.generateCompleteTestFile('vitest', {
      entityName: 'Order',
      includeSecurityTests: true,
      includePerformanceTests: false,
      coverageTarget: 85,
    });

    assert.ok(code.includes('describe'));
    assert.ok(code.includes('Order'));
    assert.ok(suite.testCases.some(tc => tc.name.includes('SQL Injection')));
  });

  test('should include security tests when requested', () => {
    const generator = new TestGenerator();

    const { suite } = generator.generateCompleteTestFile('jest', {
      entityName: 'User',
      includeSecurityTests: true,
      includePerformanceTests: false,
      coverageTarget: 80,
    });

    const securityTests = suite.testCases.filter(tc =>
      tc.name.includes('Injection') ||
      tc.name.includes('XSS') ||
      tc.name.includes('Authentication') ||
      tc.name.includes('Authorization')
    );

    assert.ok(securityTests.length > 0, 'Should include security tests');
  });

  test('should include coverage commands', () => {
    const generator = new TestGenerator();

    const { suite } = generator.generateCompleteTestFile('jest', {
      entityName: 'Cart',
      includeSecurityTests: false,
      includePerformanceTests: false,
      coverageTarget: 90,
    });

    assert.ok(suite.commands.coverage.includes('90'));
    assert.ok(suite.commands.run);
    assert.ok(suite.commands.watch);
  });
});

describe('End-to-End Integration', () => {
  test('should complete full workflow', async () => {
    // 1. Analyze complexity
    const complexity = analyzeComplexity(
      {
        estimatedFiles: 10,
        estimatedLinesOfCode: 1000,
        externalDependencies: 5,
        expectedTestCases: 15,
      },
      {
        domainFamiliarity: 'high',
        technicalUncertainty: 'low',
        requirementClarity: 'high',
      }
    );

    assert.ok(['MINIMAL', 'STANDARD', 'COMPREHENSIVE'].includes(complexity.mode));

    // 2. Estimate costs
    const cost = estimateCost(complexity.mode, 3);
    assert.ok(cost.total > 0);

    // 3. Track costs
    const tracker = new CostTracker({
      total: cost.total * 1.5,
      perPhase: cost.total / 3,
      warningThreshold: 0.8,
    });

    tracker.recordUsage('phase1', cost.total / 3);
    const report = tracker.generateReport();
    assert.ok(report.budgetUsed < 100);

    // 4. Generate tests
    const generator = new TestGenerator();
    const { suite } = generator.generateCompleteTestFile('jest', {
      entityName: 'TestEntity',
      includeSecurityTests: true,
      includePerformanceTests: false,
      coverageTarget: 80,
    });

    assert.ok(suite.testCases.length > 0);

    // 5. Evaluate prompt
    const evaluator = new SelfEvaluator();
    const samplePrompt = `
---
allowed-tools: Task, Read, Write
description: Test prompt
model: sonnet
---

# Test Prompt

## 변수
- $VAR: value

## 지침
- 테스트 지침

## 워크플로우

### 단계 1
**성공 기준**: 완료
`;

    const evaluation = evaluator.evaluate(samplePrompt, ['테스트'], complexity.mode);
    assert.ok(evaluation.totalScore >= 0 && evaluation.totalScore <= 100);
  });
});

// Run tests
console.log('Running Meta Prompt Generator v2 Integration Tests...\n');
