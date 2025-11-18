/**
 * 테스트 코드 생성기 - Meta Prompt Generator v2
 *
 * 실제 실행 가능한 테스트 코드를 자동으로 생성합니다.
 */

interface TestCase {
  name: string;
  type: "unit" | "integration" | "e2e";
  description: string;
  setup?: string[];
  assertions: string[];
  cleanup?: string[];
}

interface TestSuite {
  framework: string;
  language: string;
  testCases: TestCase[];
  coverageTarget: number;
  commands: {
    run: string;
    coverage: string;
    watch?: string;
  };
}

type FrameworkType = "jest" | "vitest" | "flutter_test" | "pytest" | "go_test";

export class TestGenerator {
  // 프레임워크별 테스트 템플릿
  private static templates: Record<FrameworkType, (tc: TestCase) => string> = {
    jest: TestGenerator.generateJestTest,
    vitest: TestGenerator.generateVitestTest,
    flutter_test: TestGenerator.generateFlutterTest,
    pytest: TestGenerator.generatePytestTest,
    go_test: TestGenerator.generateGoTest,
  };

  // Jest 테스트 생성
  private static generateJestTest(testCase: TestCase): string {
    const setupCode = testCase.setup
      ? testCase.setup.map((s) => `    ${s}`).join("\n")
      : "";
    const cleanupCode = testCase.cleanup
      ? testCase.cleanup.map((c) => `    ${c}`).join("\n")
      : "";
    const assertionCode = testCase.assertions
      .map((a) => `    ${a}`)
      .join("\n");

    return `
describe('${testCase.name}', () => {
  ${
    setupCode
      ? `beforeEach(() => {
${setupCode}
  });`
      : ""
  }

  ${
    cleanupCode
      ? `afterEach(() => {
${cleanupCode}
  });`
      : ""
  }

  it('${testCase.description}', () => {
${assertionCode}
  });
});
`.trim();
  }

  // Vitest 테스트 생성
  private static generateVitestTest(testCase: TestCase): string {
    const setupCode = testCase.setup
      ? testCase.setup.map((s) => `    ${s}`).join("\n")
      : "";
    const cleanupCode = testCase.cleanup
      ? testCase.cleanup.map((c) => `    ${c}`).join("\n")
      : "";
    const assertionCode = testCase.assertions
      .map((a) => `    ${a}`)
      .join("\n");

    return `
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('${testCase.name}', () => {
  ${
    setupCode
      ? `beforeEach(() => {
${setupCode}
  });`
      : ""
  }

  ${
    cleanupCode
      ? `afterEach(() => {
${cleanupCode}
  });`
      : ""
  }

  it('${testCase.description}', () => {
${assertionCode}
  });
});
`.trim();
  }

  // Flutter 테스트 생성
  private static generateFlutterTest(testCase: TestCase): string {
    const setupCode = testCase.setup
      ? testCase.setup.map((s) => `    ${s}`).join("\n")
      : "";
    const assertionCode = testCase.assertions
      .map((a) => `    ${a}`)
      .join("\n");

    return `
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('${testCase.name}', () {
    ${
      setupCode
        ? `setUp(() {
${setupCode}
    });`
        : ""
    }

    test('${testCase.description}', () {
${assertionCode}
    });
  });
}
`.trim();
  }

  // Pytest 테스트 생성
  private static generatePytestTest(testCase: TestCase): string {
    const setupCode = testCase.setup
      ? testCase.setup.map((s) => `        ${s}`).join("\n")
      : "";
    const cleanupCode = testCase.cleanup
      ? testCase.cleanup.map((c) => `        ${c}`).join("\n")
      : "";
    const assertionCode = testCase.assertions
      .map((a) => `    ${a}`)
      .join("\n");

    const fixtureCode =
      setupCode || cleanupCode
        ? `
@pytest.fixture
def setup():
${setupCode || "    pass"}
    yield
${cleanupCode || "    pass"}
`
        : "";

    return `
import pytest

${fixtureCode}

class Test${testCase.name.replace(/\s+/g, "")}:
    def test_${testCase.description.toLowerCase().replace(/\s+/g, "_")}(self${
      fixtureCode ? ", setup" : ""
    }):
${assertionCode}
`.trim();
  }

  // Go 테스트 생성
  private static generateGoTest(testCase: TestCase): string {
    const setupCode = testCase.setup
      ? testCase.setup.map((s) => `\t${s}`).join("\n")
      : "";
    const cleanupCode = testCase.cleanup
      ? testCase.cleanup.map((c) => `\t${c}`).join("\n")
      : "";
    const assertionCode = testCase.assertions
      .map((a) => `\t${a}`)
      .join("\n");

    return `
func Test${testCase.name.replace(/\s+/g, "")}(t *testing.T) {
${setupCode}
${cleanupCode ? `\tdefer func() {\n${cleanupCode}\n\t}()` : ""}

${assertionCode}
}
`.trim();
  }

  // 테스트 스위트 생성
  generateTestSuite(
    framework: FrameworkType,
    testCases: TestCase[],
    coverageTarget: number = 80
  ): TestSuite {
    const frameworkConfig: Record<
      FrameworkType,
      { language: string; commands: TestSuite["commands"] }
    > = {
      jest: {
        language: "TypeScript/JavaScript",
        commands: {
          run: "npm test",
          coverage: `npm test -- --coverage --coverageThreshold='{"global":{"lines":${coverageTarget}}}'`,
          watch: "npm test -- --watch",
        },
      },
      vitest: {
        language: "TypeScript/JavaScript",
        commands: {
          run: "npx vitest",
          coverage: `npx vitest --coverage --coverage.thresholds.lines=${coverageTarget}`,
          watch: "npx vitest --watch",
        },
      },
      flutter_test: {
        language: "Dart",
        commands: {
          run: "flutter test",
          coverage:
            "flutter test --coverage && genhtml coverage/lcov.info -o coverage/html",
        },
      },
      pytest: {
        language: "Python",
        commands: {
          run: "pytest",
          coverage: `pytest --cov=. --cov-fail-under=${coverageTarget}`,
          watch: "pytest-watch",
        },
      },
      go_test: {
        language: "Go",
        commands: {
          run: "go test ./...",
          coverage: "go test -cover ./...",
        },
      },
    };

    const config = frameworkConfig[framework];

    return {
      framework,
      language: config.language,
      testCases,
      coverageTarget,
      commands: config.commands,
    };
  }

  // 테스트 코드 생성
  generateTestCode(framework: FrameworkType, testCases: TestCase[]): string {
    const template = TestGenerator.templates[framework];
    if (!template) {
      throw new Error(`지원하지 않는 프레임워크: ${framework}`);
    }

    const testCode = testCases.map((tc) => template(tc)).join("\n\n");

    // 프레임워크별 헤더 추가
    const headers: Record<FrameworkType, string> = {
      jest: `// Jest 테스트 파일
// Generated by Meta Prompt Generator v2

`,
      vitest: `// Vitest 테스트 파일
// Generated by Meta Prompt Generator v2

`,
      flutter_test: `// Flutter 테스트 파일
// Generated by Meta Prompt Generator v2

`,
      pytest: `# Pytest 테스트 파일
# Generated by Meta Prompt Generator v2

`,
      go_test: `// Go 테스트 파일
// Generated by Meta Prompt Generator v2

package main

import (
    "testing"
)

`,
    };

    return headers[framework] + testCode;
  }

  // 공통 테스트 케이스 생성 (CRUD 작업용)
  generateCRUDTests(
    entityName: string,
    framework: FrameworkType
  ): TestCase[] {
    const entityLower = entityName.toLowerCase();

    const testCases: TestCase[] = [
      {
        name: `${entityName} Creation`,
        type: "unit",
        description: `should create a new ${entityLower}`,
        setup: [`const mock${entityName} = createMock${entityName}();`],
        assertions: [
          `const result = await create${entityName}(mock${entityName});`,
          `expect(result.id).toBeDefined();`,
          `expect(result.name).toEqual(mock${entityName}.name);`,
        ],
        cleanup: [`await cleanup${entityName}(result.id);`],
      },
      {
        name: `${entityName} Retrieval`,
        type: "unit",
        description: `should retrieve an existing ${entityLower}`,
        setup: [
          `const created = await create${entityName}(testData);`,
          `const targetId = created.id;`,
        ],
        assertions: [
          `const result = await get${entityName}ById(targetId);`,
          `expect(result).toBeDefined();`,
          `expect(result.id).toEqual(targetId);`,
        ],
      },
      {
        name: `${entityName} Update`,
        type: "unit",
        description: `should update an existing ${entityLower}`,
        setup: [`const original = await create${entityName}(testData);`],
        assertions: [
          `const updateData = { name: 'Updated Name' };`,
          `const result = await update${entityName}(original.id, updateData);`,
          `expect(result.name).toEqual('Updated Name');`,
          `expect(result.updatedAt).toBeGreaterThan(original.updatedAt);`,
        ],
      },
      {
        name: `${entityName} Deletion`,
        type: "unit",
        description: `should delete an existing ${entityLower}`,
        setup: [`const toDelete = await create${entityName}(testData);`],
        assertions: [
          `const result = await delete${entityName}(toDelete.id);`,
          `expect(result.success).toBe(true);`,
          `const notFound = await get${entityName}ById(toDelete.id);`,
          `expect(notFound).toBeNull();`,
        ],
      },
      {
        name: `${entityName} Validation`,
        type: "unit",
        description: `should reject invalid ${entityLower} data`,
        assertions: [
          `const invalidData = { name: '' };`,
          `await expect(create${entityName}(invalidData)).rejects.toThrow();`,
        ],
      },
    ];

    return testCases;
  }

  // 보안 테스트 케이스 생성
  generateSecurityTests(framework: FrameworkType): TestCase[] {
    return [
      {
        name: "SQL Injection Prevention",
        type: "unit",
        description: "should prevent SQL injection attacks",
        assertions: [
          `const maliciousInput = "'; DROP TABLE users; --";`,
          `const result = await searchUsers(maliciousInput);`,
          `expect(result).toBeDefined();`,
          `// 테이블이 여전히 존재하는지 확인`,
          `const tableExists = await checkTableExists('users');`,
          `expect(tableExists).toBe(true);`,
        ],
      },
      {
        name: "XSS Prevention",
        type: "unit",
        description: "should sanitize HTML input",
        assertions: [
          `const xssInput = '<script>alert("xss")</script>';`,
          `const result = sanitizeInput(xssInput);`,
          `expect(result).not.toContain('<script>');`,
          `expect(result).not.toContain('</script>');`,
        ],
      },
      {
        name: "Authentication Required",
        type: "integration",
        description: "should reject unauthenticated requests",
        assertions: [
          `const response = await request.get('/api/protected');`,
          `expect(response.status).toBe(401);`,
        ],
      },
      {
        name: "Authorization Check",
        type: "integration",
        description: "should enforce authorization rules",
        setup: [`const regularUser = await createUser({ role: 'user' });`],
        assertions: [
          `const response = await request`,
          `  .delete('/api/admin/resource')`,
          `  .set('Authorization', getToken(regularUser));`,
          `expect(response.status).toBe(403);`,
        ],
      },
    ];
  }

  // 성능 테스트 케이스 생성
  generatePerformanceTests(framework: FrameworkType): TestCase[] {
    return [
      {
        name: "Response Time",
        type: "e2e",
        description: "should respond within acceptable time",
        assertions: [
          `const start = Date.now();`,
          `await request.get('/api/data');`,
          `const duration = Date.now() - start;`,
          `expect(duration).toBeLessThan(200); // 200ms 이하`,
        ],
      },
      {
        name: "Concurrent Requests",
        type: "e2e",
        description: "should handle concurrent requests",
        assertions: [
          `const requests = Array(10).fill(null).map(() => request.get('/api/data'));`,
          `const results = await Promise.all(requests);`,
          `results.forEach(res => {`,
          `  expect(res.status).toBe(200);`,
          `});`,
        ],
      },
      {
        name: "Large Data Set",
        type: "integration",
        description: "should handle large data sets efficiently",
        assertions: [
          `const largeDataSet = generateTestData(10000);`,
          `const start = Date.now();`,
          `const result = await processData(largeDataSet);`,
          `const duration = Date.now() - start;`,
          `expect(result.length).toBe(10000);`,
          `expect(duration).toBeLessThan(5000); // 5초 이하`,
        ],
      },
    ];
  }

  // 완전한 테스트 파일 생성
  generateCompleteTestFile(
    framework: FrameworkType,
    options: {
      entityName?: string;
      includeSecurityTests?: boolean;
      includePerformanceTests?: boolean;
      customTestCases?: TestCase[];
      coverageTarget?: number;
    }
  ): { code: string; suite: TestSuite } {
    const testCases: TestCase[] = [];

    // CRUD 테스트 추가
    if (options.entityName) {
      testCases.push(...this.generateCRUDTests(options.entityName, framework));
    }

    // 보안 테스트 추가
    if (options.includeSecurityTests) {
      testCases.push(...this.generateSecurityTests(framework));
    }

    // 성능 테스트 추가
    if (options.includePerformanceTests) {
      testCases.push(...this.generatePerformanceTests(framework));
    }

    // 커스텀 테스트 추가
    if (options.customTestCases) {
      testCases.push(...options.customTestCases);
    }

    const code = this.generateTestCode(framework, testCases);
    const suite = this.generateTestSuite(
      framework,
      testCases,
      options.coverageTarget || 80
    );

    return { code, suite };
  }
}

// 사용 예시
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new TestGenerator();

  const { code, suite } = generator.generateCompleteTestFile("jest", {
    entityName: "User",
    includeSecurityTests: true,
    includePerformanceTests: false,
    coverageTarget: 85,
  });

  console.log("생성된 테스트 코드:");
  console.log(code);
  console.log("\n테스트 스위트 정보:");
  console.log(JSON.stringify(suite, null, 2));
}
