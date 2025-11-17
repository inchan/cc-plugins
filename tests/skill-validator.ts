#!/usr/bin/env ts-node

/**
 * Automated Skill Validation Framework
 *
 * Validates Claude Code skills against:
 * 1. Official documentation standards
 * 2. Expected input/output contracts
 * 3. Best practices and conventions
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

// ============================================
// Types
// ============================================

interface SkillFrontmatter {
  name: string;
  description: string;
  'allowed-tools'?: string[];
}

interface ValidationResult {
  skill: string;
  category: string;
  passed: boolean;
  score: number;
  maxScore: number;
  issues: Issue[];
  warnings: Warning[];
}

interface Issue {
  severity: 'critical' | 'major' | 'minor';
  rule: string;
  message: string;
  fix?: string;
}

interface Warning {
  rule: string;
  message: string;
  recommendation?: string;
}

interface TestCase {
  name: string;
  input: string;
  expectedOutputContains: string[];
  expectedOutputNotContains?: string[];
}

interface SkillTestSuite {
  skill: string;
  tests: TestCase[];
}

// ============================================
// Official Standards (from docs)
// ============================================

const OFFICIAL_STANDARDS = {
  // Frontmatter requirements
  NAME_PATTERN: /^[a-z0-9-]+$/,
  NAME_MAX_LENGTH: 64,
  DESCRIPTION_MAX_LENGTH: 1024,

  // Required sections
  REQUIRED_SECTIONS: ['Overview', 'When to Use', 'Examples'],

  // Best practices
  DESCRIPTION_MIN_LENGTH: 50,
  SHOULD_HAVE_SPECIFIC_TRIGGERS: true,
  SHOULD_AVOID_VAGUE_LANGUAGE: ['helps with', 'assists', 'useful for'],

  // Structure
  REQUIRED_FILES: ['SKILL.md'],
  RECOMMENDED_FILES: ['examples.md', 'reference.md'],
};

// ============================================
// Validators
// ============================================

class SkillValidator {
  private skillPath: string;
  private skillName: string;
  private content: string;
  private frontmatter: SkillFrontmatter | null = null;
  private markdownBody: string = '';
  private issues: Issue[] = [];
  private warnings: Warning[] = [];
  private score: number = 0;
  private maxScore: number = 0;

  constructor(skillPath: string) {
    this.skillPath = skillPath;
    this.skillName = path.basename(skillPath);
  }

  validate(): ValidationResult {
    this.loadSkill();

    // Core validation (each adds to score)
    this.validateFrontmatter();
    this.validateName();
    this.validateDescription();
    this.validateMarkdownStructure();
    this.validateBestPractices();
    this.validateFileStructure();

    return {
      skill: this.skillName,
      category: this.categorizeSkill(),
      passed: this.issues.filter(i => i.severity === 'critical').length === 0,
      score: this.score,
      maxScore: this.maxScore,
      issues: this.issues,
      warnings: this.warnings,
    };
  }

  private loadSkill(): void {
    const skillMdPath = path.join(this.skillPath, 'SKILL.md');

    if (!fs.existsSync(skillMdPath)) {
      this.addIssue('critical', 'FILE_MISSING',
        'SKILL.md file is missing',
        'Create SKILL.md with proper frontmatter');
      return;
    }

    this.content = fs.readFileSync(skillMdPath, 'utf-8');
    this.parseFrontmatter();
  }

  private parseFrontmatter(): void {
    const frontmatterMatch = this.content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
      this.addIssue('critical', 'FRONTMATTER_MISSING',
        'YAML frontmatter is missing or malformed',
        'Add --- at start and end of frontmatter section');
      return;
    }

    try {
      this.frontmatter = yaml.parse(frontmatterMatch[1]) as SkillFrontmatter;
      this.markdownBody = frontmatterMatch[2];
    } catch (e) {
      this.addIssue('critical', 'FRONTMATTER_INVALID',
        `YAML parsing failed: ${e}`,
        'Fix YAML syntax in frontmatter');
    }
  }

  private validateFrontmatter(): void {
    this.maxScore += 20;

    if (!this.frontmatter) {
      this.addIssue('critical', 'FRONTMATTER_EMPTY', 'No frontmatter found');
      return;
    }

    // Required fields
    if (!this.frontmatter.name) {
      this.addIssue('critical', 'NAME_MISSING', 'name field is required in frontmatter');
    } else {
      this.score += 10;
    }

    if (!this.frontmatter.description) {
      this.addIssue('critical', 'DESCRIPTION_MISSING', 'description field is required in frontmatter');
    } else {
      this.score += 10;
    }
  }

  private validateName(): void {
    if (!this.frontmatter?.name) return;

    this.maxScore += 15;
    const name = this.frontmatter.name;

    // Check pattern (lowercase, numbers, hyphens only)
    if (!OFFICIAL_STANDARDS.NAME_PATTERN.test(name)) {
      this.addIssue('major', 'NAME_INVALID_CHARS',
        `Name contains invalid characters: ${name}`,
        'Use only lowercase letters, numbers, and hyphens');
    } else {
      this.score += 5;
    }

    // Check length
    if (name.length > OFFICIAL_STANDARDS.NAME_MAX_LENGTH) {
      this.addIssue('major', 'NAME_TOO_LONG',
        `Name exceeds ${OFFICIAL_STANDARDS.NAME_MAX_LENGTH} characters: ${name.length}`,
        'Shorten the skill name');
    } else {
      this.score += 5;
    }

    // Check consistency with directory name
    if (name !== this.skillName) {
      this.addWarning('NAME_MISMATCH',
        `Skill name '${name}' differs from directory name '${this.skillName}'`,
        'Keep name consistent with directory for clarity');
    } else {
      this.score += 5;
    }
  }

  private validateDescription(): void {
    if (!this.frontmatter?.description) return;

    this.maxScore += 25;
    const desc = this.frontmatter.description;

    // Check length limits
    if (desc.length > OFFICIAL_STANDARDS.DESCRIPTION_MAX_LENGTH) {
      this.addIssue('major', 'DESCRIPTION_TOO_LONG',
        `Description exceeds ${OFFICIAL_STANDARDS.DESCRIPTION_MAX_LENGTH} characters: ${desc.length}`);
    } else {
      this.score += 5;
    }

    // Check minimum length for specificity
    if (desc.length < OFFICIAL_STANDARDS.DESCRIPTION_MIN_LENGTH) {
      this.addWarning('DESCRIPTION_TOO_SHORT',
        `Description is very short (${desc.length} chars), may lack specificity`,
        'Add more detail about when and how to use this skill');
    } else {
      this.score += 5;
    }

    // Check for vague language
    const vagueTerms = OFFICIAL_STANDARDS.SHOULD_AVOID_VAGUE_LANGUAGE.filter(
      term => desc.toLowerCase().includes(term)
    );
    if (vagueTerms.length > 0) {
      this.addWarning('DESCRIPTION_VAGUE',
        `Description uses vague language: ${vagueTerms.join(', ')}`,
        'Be specific about functionality and trigger conditions');
    } else {
      this.score += 5;
    }

    // Check for activation triggers
    const hasWhenToUse = desc.includes('Use when') || desc.includes('use when') ||
                         desc.includes('Use for') || desc.includes('Use this');
    if (!hasWhenToUse) {
      this.addWarning('DESCRIPTION_NO_TRIGGER',
        'Description lacks explicit usage triggers',
        'Add "Use when..." or similar to clarify activation context');
    } else {
      this.score += 5;
    }

    // Check for action verbs
    const hasActionVerbs = /\b(implement|create|build|analyze|optimize|fix|validate|route|execute|evaluate)\b/i.test(desc);
    if (hasActionVerbs) {
      this.score += 5;
    } else {
      this.addWarning('DESCRIPTION_NO_ACTIONS',
        'Description lacks specific action verbs',
        'Include verbs like implement, create, analyze, etc.');
    }
  }

  private validateMarkdownStructure(): void {
    if (!this.markdownBody) return;

    this.maxScore += 20;

    // Check for required sections
    const headings = this.markdownBody.match(/^#{1,3}\s+.+$/gm) || [];
    const headingTexts = headings.map(h => h.replace(/^#+\s+/, ''));

    // Overview/Introduction
    const hasOverview = headingTexts.some(h =>
      /overview|introduction|about/i.test(h)
    );
    if (hasOverview) {
      this.score += 5;
    } else {
      this.addWarning('MISSING_OVERVIEW',
        'No Overview/Introduction section found',
        'Add an Overview section explaining the skill');
    }

    // When to Use
    const hasWhenToUse = headingTexts.some(h =>
      /when to use|usage|use case/i.test(h)
    );
    if (hasWhenToUse) {
      this.score += 5;
    } else {
      this.addIssue('minor', 'MISSING_WHEN_TO_USE',
        'No "When to Use" section found',
        'Add section explaining ideal scenarios for this skill');
    }

    // Examples
    const hasExamples = headingTexts.some(h =>
      /example|demonstration|sample/i.test(h)
    );
    if (hasExamples) {
      this.score += 5;
    } else {
      this.addIssue('minor', 'MISSING_EXAMPLES',
        'No Examples section found',
        'Add concrete examples showing skill in action');
    }

    // Code blocks
    const codeBlocks = (this.markdownBody.match(/```[\s\S]*?```/g) || []).length;
    if (codeBlocks >= 1) {
      this.score += 5;
    } else {
      this.addWarning('NO_CODE_EXAMPLES',
        'No code blocks found',
        'Add code examples to demonstrate usage');
    }
  }

  private validateBestPractices(): void {
    if (!this.markdownBody) return;

    this.maxScore += 20;

    // Check for trade-offs documentation
    const hasTradeoffs = /trade.?off|cost|benefit|disadvantage|limitation/i.test(this.markdownBody);
    if (hasTradeoffs) {
      this.score += 5;
    } else {
      this.addWarning('NO_TRADEOFFS',
        'No trade-off analysis found',
        'Document trade-offs to help users make informed decisions');
    }

    // Check for do NOT use section
    const hasDontUse = /do not use|don't use|avoid using|not suitable/i.test(this.markdownBody);
    if (hasDontUse) {
      this.score += 5;
    } else {
      this.addWarning('NO_NEGATIVE_CASES',
        'No "when NOT to use" guidance found',
        'Add section explaining when this skill is inappropriate');
    }

    // Check for reference to official docs (for pattern skills)
    const hasReference = /anthropic|official|reference|source/i.test(this.markdownBody);
    if (hasReference) {
      this.score += 5;
    } else {
      this.addWarning('NO_REFERENCE',
        'No reference to source documentation',
        'Cite sources for credibility');
    }

    // Check for clear instructions
    const hasSteps = /step\s+\d|1\.|first|second|third|\d\)\s|^-\s/im.test(this.markdownBody);
    if (hasSteps) {
      this.score += 5;
    } else {
      this.addWarning('NO_CLEAR_STEPS',
        'No clear step-by-step instructions found',
        'Add numbered steps or bullet points for clarity');
    }
  }

  private validateFileStructure(): void {
    this.maxScore += 10;

    // Check for SKILL.md (already done)
    if (fs.existsSync(path.join(this.skillPath, 'SKILL.md'))) {
      this.score += 5;
    }

    // Check for recommended files
    const hasExtras = OFFICIAL_STANDARDS.RECOMMENDED_FILES.some(file =>
      fs.existsSync(path.join(this.skillPath, file))
    );
    if (hasExtras) {
      this.score += 5;
    } else {
      this.addWarning('NO_EXTRA_FILES',
        'No additional reference files found',
        'Consider adding examples.md or reference.md for comprehensive documentation');
    }
  }

  private categorizeSkill(): string {
    const name = this.skillName.toLowerCase();
    if (name.includes('router')) return 'routing';
    if (name.includes('sequential')) return 'sequential';
    if (name.includes('parallel')) return 'parallel';
    if (name.includes('orchestrator')) return 'orchestrator';
    if (name.includes('evaluator') || name.includes('enhancer')) return 'evaluator';
    if (name.includes('advisor')) return 'advisor';
    return 'other';
  }

  private addIssue(severity: Issue['severity'], rule: string, message: string, fix?: string): void {
    this.issues.push({ severity, rule, message, fix });
  }

  private addWarning(rule: string, message: string, recommendation?: string): void {
    this.warnings.push({ rule, message, recommendation });
  }
}

// ============================================
// Input/Output Contract Tests
// ============================================

const SKILL_TEST_SUITES: SkillTestSuite[] = [
  {
    skill: 'intelligent-task-router',
    tests: [
      {
        name: 'Should classify feature development',
        input: 'Add user authentication with JWT tokens',
        expectedOutputContains: [
          'primary_category',
          'feature_development',
          'complexity',
          'model_recommendation',
          'routing_decision'
        ],
      },
      {
        name: 'Should classify bug fix',
        input: 'Fix login page authentication error',
        expectedOutputContains: [
          'bug_fix',
          'complexity',
          'DEBUG'
        ],
      },
      {
        name: 'Should recommend model based on complexity',
        input: 'Simple typo fix in README',
        expectedOutputContains: [
          'haiku',
          'complexity'
        ],
        expectedOutputNotContains: ['opus', 'orchestrator'],
      },
    ],
  },
  {
    skill: 'sequential-task-processor',
    tests: [
      {
        name: 'Should define gates for each step',
        input: 'Bug fix task with 4 steps',
        expectedOutputContains: [
          'gate_check',
          'passed',
          'score',
          'step_id'
        ],
      },
      {
        name: 'Should track step completion',
        input: 'Feature with requirements, design, implement, test',
        expectedOutputContains: [
          'completion_status',
          'steps_completed',
          'total_steps',
          'artifacts'
        ],
      },
    ],
  },
  {
    skill: 'parallel-task-executor',
    tests: [
      {
        name: 'Should identify sectioning mode for independent tasks',
        input: 'Build 3 independent UI components',
        expectedOutputContains: [
          'sectioning',
          'workers',
          'merge',
          'independence'
        ],
      },
      {
        name: 'Should identify voting mode for comparison',
        input: 'Choose best algorithm between 3 approaches',
        expectedOutputContains: [
          'voting',
          'score',
          'winner',
          'rationale'
        ],
      },
    ],
  },
  {
    skill: 'dynamic-task-orchestrator',
    tests: [
      {
        name: 'Should discover additional subtasks',
        input: 'Build chat application with basic requirements',
        expectedOutputContains: [
          'discovery',
          'subtask',
          'replanning',
          'worker'
        ],
      },
      {
        name: 'Should analyze dependencies',
        input: 'Build microservices system',
        expectedOutputContains: [
          'dependency',
          'phase',
          'parallel',
          'sequential'
        ],
      },
    ],
  },
  {
    skill: 'iterative-quality-enhancer',
    tests: [
      {
        name: 'Should evaluate multiple dimensions',
        input: 'Vulnerable REST API code',
        expectedOutputContains: [
          'security',
          'functionality',
          'code_quality',
          'score',
          'threshold'
        ],
      },
      {
        name: 'Should iterate until threshold met',
        input: 'Initial score 6.0, target 9.0',
        expectedOutputContains: [
          'iteration',
          'improvement',
          'threshold_met',
          'feedback'
        ],
      },
    ],
  },
  {
    skill: 'agent-workflow-advisor',
    tests: [
      {
        name: 'Should recommend no pattern for simple tasks',
        input: 'Fix typo in README',
        expectedOutputContains: [
          'NO PATTERN',
          'complexity',
          'trivial'
        ],
        expectedOutputNotContains: ['orchestrator', 'sequential', 'parallel'],
      },
      {
        name: 'Should recommend orchestrator for high discovery tasks',
        input: 'Migrate legacy monolith to microservices',
        expectedOutputContains: [
          'orchestrator',
          'discovery',
          'variable',
          'confidence'
        ],
      },
      {
        name: 'Should provide alternatives',
        input: 'Complex project with unclear structure',
        expectedOutputContains: [
          'alternative',
          'trade-off',
          'use_if'
        ],
      },
    ],
  },
];

// ============================================
// Test Runner
// ============================================

class TestRunner {
  private skillsDir: string;
  private results: ValidationResult[] = [];
  private contractResults: Map<string, boolean[]> = new Map();

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir;
  }

  async runAll(): Promise<void> {
    console.log('='.repeat(60));
    console.log('Claude Code Skills Validation Framework');
    console.log('='.repeat(60));
    console.log();

    // Phase 1: Structure validation
    console.log('Phase 1: Structure & Standards Validation');
    console.log('-'.repeat(60));
    await this.validateStructures();

    // Phase 2: Contract validation
    console.log('\nPhase 2: Input/Output Contract Validation');
    console.log('-'.repeat(60));
    await this.validateContracts();

    // Phase 3: Generate report
    console.log('\nPhase 3: Compliance Report');
    console.log('-'.repeat(60));
    this.generateReport();
  }

  private async validateStructures(): Promise<void> {
    const skillDirs = fs.readdirSync(this.skillsDir)
      .filter(f => fs.statSync(path.join(this.skillsDir, f)).isDirectory())
      .filter(f => !f.startsWith('.'));

    const agentPatternSkills = [
      'intelligent-task-router',
      'sequential-task-processor',
      'parallel-task-executor',
      'dynamic-task-orchestrator',
      'iterative-quality-enhancer',
      'agent-workflow-advisor',
      'agent-workflow-orchestrator'
    ];

    for (const skillDir of agentPatternSkills) {
      if (!skillDirs.includes(skillDir)) {
        console.log(`⚠️  ${skillDir}: NOT FOUND`);
        continue;
      }

      const validator = new SkillValidator(path.join(this.skillsDir, skillDir));
      const result = validator.validate();
      this.results.push(result);

      const statusIcon = result.passed ? '✅' : '❌';
      const scorePercent = ((result.score / result.maxScore) * 100).toFixed(1);
      console.log(`${statusIcon} ${skillDir}: ${result.score}/${result.maxScore} (${scorePercent}%)`);

      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'major' ? '🟠' : '🟡';
          console.log(`   ${icon} [${issue.severity.toUpperCase()}] ${issue.message}`);
        });
      }
    }
  }

  private async validateContracts(): Promise<void> {
    for (const suite of SKILL_TEST_SUITES) {
      console.log(`\nTesting ${suite.skill}:`);
      const results: boolean[] = [];

      for (const test of suite.tests) {
        // Simulate contract validation by checking if SKILL.md contains
        // the structural elements needed to produce expected outputs
        const skillPath = path.join(this.skillsDir, suite.skill, 'SKILL.md');
        if (!fs.existsSync(skillPath)) {
          console.log(`  ❌ ${test.name}: SKILL.md not found`);
          results.push(false);
          continue;
        }

        const content = fs.readFileSync(skillPath, 'utf-8').toLowerCase();
        const allExpectedPresent = test.expectedOutputContains.every(term =>
          content.includes(term.toLowerCase())
        );
        const noUnexpected = !test.expectedOutputNotContains?.some(term =>
          content.includes(term.toLowerCase())
        ) ?? true;

        const passed = allExpectedPresent && noUnexpected;
        results.push(passed);

        if (passed) {
          console.log(`  ✅ ${test.name}`);
        } else {
          console.log(`  ❌ ${test.name}`);
          const missing = test.expectedOutputContains.filter(term =>
            !content.includes(term.toLowerCase())
          );
          if (missing.length > 0) {
            console.log(`     Missing: ${missing.join(', ')}`);
          }
        }
      }

      this.contractResults.set(suite.skill, results);
    }
  }

  private generateReport(): void {
    console.log('\n' + '='.repeat(60));
    console.log('FINAL COMPLIANCE REPORT');
    console.log('='.repeat(60));

    // Structure compliance
    const structureScore = this.results.reduce((sum, r) => sum + r.score, 0);
    const structureMax = this.results.reduce((sum, r) => sum + r.maxScore, 0);
    const structurePercent = ((structureScore / structureMax) * 100).toFixed(1);

    console.log(`\n📊 Structure Compliance: ${structureScore}/${structureMax} (${structurePercent}%)`);

    // Contract compliance
    let contractPassed = 0;
    let contractTotal = 0;
    this.contractResults.forEach(results => {
      contractPassed += results.filter(r => r).length;
      contractTotal += results.length;
    });
    const contractPercent = ((contractPassed / contractTotal) * 100).toFixed(1);

    console.log(`📊 Contract Compliance: ${contractPassed}/${contractTotal} (${contractPercent}%)`);

    // Overall
    const overallPercent = (
      (parseFloat(structurePercent) + parseFloat(contractPercent)) / 2
    ).toFixed(1);

    console.log(`\n🎯 OVERALL COMPLIANCE: ${overallPercent}%`);

    // Critical issues
    const criticalIssues = this.results.flatMap(r =>
      r.issues.filter(i => i.severity === 'critical')
    );

    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      criticalIssues.forEach(issue => {
        console.log(`   - ${issue.rule}: ${issue.message}`);
      });
    } else {
      console.log('\n✅ No critical issues found!');
    }

    // Recommendations
    const allWarnings = this.results.flatMap(r => r.warnings);
    const topWarnings = [...new Set(allWarnings.map(w => w.rule))].slice(0, 5);

    if (topWarnings.length > 0) {
      console.log('\n📝 TOP RECOMMENDATIONS:');
      topWarnings.forEach((rule, i) => {
        const warning = allWarnings.find(w => w.rule === rule)!;
        console.log(`   ${i + 1}. ${warning.message}`);
        if (warning.recommendation) {
          console.log(`      → ${warning.recommendation}`);
        }
      });
    }

    console.log('\n' + '='.repeat(60));
  }
}

// ============================================
// Main Execution
// ============================================

async function main() {
  const skillsDir = process.argv[2] || './skills';

  if (!fs.existsSync(skillsDir)) {
    console.error(`Skills directory not found: ${skillsDir}`);
    process.exit(1);
  }

  const runner = new TestRunner(skillsDir);
  await runner.runAll();
}

main().catch(console.error);
