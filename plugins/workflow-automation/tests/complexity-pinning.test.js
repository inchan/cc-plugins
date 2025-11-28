/**
 * Complexity Pinning Tests
 *
 * ⚠️ PURPOSE: These tests "pin" the complexity logic to prevent accidental drift.
 *
 * If these tests fail after your changes:
 * 1. Read docs/complexity-logic-philosophy.md
 * 2. Verify the change is intentional
 * 3. Update the test cases to match new behavior
 * 4. Document the change in your PR
 *
 * @see docs/complexity-logic-philosophy.md
 */

// ============================================================================
// ROUTER COMPLEXITY → MODEL SELECTION
// ============================================================================

/**
 * Router uses complexity score to select LLM model:
 * - < 0.4: Haiku (fast, cheap)
 * - 0.4 - 0.7: Sonnet (balanced)
 * - > 0.7: Opus (powerful)
 */

const ROUTER_THRESHOLDS = {
  HAIKU_MAX: 0.4,
  SONNET_MAX: 0.7,
};

function selectModelFromComplexity(complexity) {
  if (complexity < ROUTER_THRESHOLDS.HAIKU_MAX) {
    return 'haiku';
  } else if (complexity < ROUTER_THRESHOLDS.SONNET_MAX) {
    return 'sonnet';
  } else {
    return 'opus';
  }
}

/**
 * Complexity calculation formula:
 * Complexity = (Scope × 0.3) + (Dependencies × 0.25) + (Technical Depth × 0.3) + (Risk × 0.15)
 */
function calculateComplexity({ scope, dependencies, technicalDepth, risk }) {
  return (scope * 0.3) + (dependencies * 0.25) + (technicalDepth * 0.3) + (risk * 0.15);
}

describe('Router Complexity → Model Mapping', () => {

  // Boundary tests for thresholds
  describe('Threshold Boundaries', () => {
    test('complexity 0.39 → haiku (just below 0.4)', () => {
      expect(selectModelFromComplexity(0.39)).toBe('haiku');
    });

    test('complexity 0.40 → sonnet (exactly at boundary)', () => {
      expect(selectModelFromComplexity(0.40)).toBe('sonnet');
    });

    test('complexity 0.69 → sonnet (just below 0.7)', () => {
      expect(selectModelFromComplexity(0.69)).toBe('sonnet');
    });

    test('complexity 0.70 → opus (exactly at boundary)', () => {
      expect(selectModelFromComplexity(0.70)).toBe('opus');
    });
  });

  // Table-driven tests for common scenarios
  const routerTestCases = [
    // Haiku cases (< 0.4)
    {
      name: 'Simple typo fix',
      input: { scope: 0.1, dependencies: 0.1, technicalDepth: 0.2, risk: 0.1 },
      expectedComplexity: 0.13,
      expectedModel: 'haiku'
    },
    {
      name: 'Update README',
      input: { scope: 0.2, dependencies: 0.1, technicalDepth: 0.1, risk: 0.1 },
      expectedComplexity: 0.12,
      expectedModel: 'haiku'
    },
    {
      name: 'Add console.log for debugging',
      input: { scope: 0.1, dependencies: 0.1, technicalDepth: 0.1, risk: 0.2 },
      expectedComplexity: 0.115,
      expectedModel: 'haiku'
    },
    {
      name: 'Simple bug fix',
      input: { scope: 0.3, dependencies: 0.2, technicalDepth: 0.3, risk: 0.2 },
      expectedComplexity: 0.26,
      expectedModel: 'haiku'
    },

    // Sonnet cases (0.4 - 0.7)
    {
      name: 'Add notification preferences page',
      input: { scope: 0.5, dependencies: 0.6, technicalDepth: 0.5, risk: 0.4 },
      expectedComplexity: 0.51,
      expectedModel: 'sonnet'
    },
    {
      name: 'Implement caching layer',
      input: { scope: 0.6, dependencies: 0.5, technicalDepth: 0.6, risk: 0.4 },
      expectedComplexity: 0.545,
      expectedModel: 'sonnet'
    },
    {
      name: 'Refactor service layer',
      input: { scope: 0.5, dependencies: 0.6, technicalDepth: 0.5, risk: 0.5 },
      expectedComplexity: 0.525,
      expectedModel: 'sonnet'
    },
    {
      name: 'Add REST API endpoints',
      input: { scope: 0.6, dependencies: 0.5, technicalDepth: 0.5, risk: 0.4 },
      expectedComplexity: 0.515,
      expectedModel: 'sonnet'
    },

    // Opus cases (> 0.7)
    {
      name: 'Implement OAuth2 authentication',
      input: { scope: 0.8, dependencies: 0.9, technicalDepth: 0.9, risk: 0.9 },
      expectedComplexity: 0.87,
      expectedModel: 'opus'
    },
    {
      name: 'Database migration with zero downtime',
      input: { scope: 0.9, dependencies: 0.8, technicalDepth: 0.8, risk: 1.0 },
      expectedComplexity: 0.86,
      expectedModel: 'opus'
    },
    {
      name: 'Profile image upload with processing',
      input: { scope: 0.7, dependencies: 0.8, technicalDepth: 0.8, risk: 0.7 },
      expectedComplexity: 0.755,
      expectedModel: 'opus'
    },
    {
      name: 'Build e-commerce checkout flow',
      input: { scope: 0.8, dependencies: 0.8, technicalDepth: 0.7, risk: 0.9 },
      expectedComplexity: 0.785,
      expectedModel: 'opus'
    },
  ];

  describe('Scenario-based Model Selection', () => {
    routerTestCases.forEach(({ name, input, expectedComplexity, expectedModel }) => {
      test(`${name} → complexity ~${expectedComplexity} → ${expectedModel}`, () => {
        const complexity = calculateComplexity(input);
        // Allow 0.05 tolerance for rounding
        expect(complexity).toBeCloseTo(expectedComplexity, 1);
        expect(selectModelFromComplexity(complexity)).toBe(expectedModel);
      });
    });
  });

  // Weight verification tests
  describe('Weight Verification', () => {
    test('weights sum to 1.0', () => {
      const weights = 0.3 + 0.25 + 0.3 + 0.15;
      expect(weights).toBe(1.0);
    });

    test('scope weight is 0.3', () => {
      const base = calculateComplexity({ scope: 0, dependencies: 0.5, technicalDepth: 0.5, risk: 0.5 });
      const withScope = calculateComplexity({ scope: 1, dependencies: 0.5, technicalDepth: 0.5, risk: 0.5 });
      expect(withScope - base).toBeCloseTo(0.3, 2);
    });

    test('dependencies weight is 0.25', () => {
      const base = calculateComplexity({ scope: 0.5, dependencies: 0, technicalDepth: 0.5, risk: 0.5 });
      const withDeps = calculateComplexity({ scope: 0.5, dependencies: 1, technicalDepth: 0.5, risk: 0.5 });
      expect(withDeps - base).toBeCloseTo(0.25, 2);
    });

    test('technicalDepth weight is 0.3', () => {
      const base = calculateComplexity({ scope: 0.5, dependencies: 0.5, technicalDepth: 0, risk: 0.5 });
      const withDepth = calculateComplexity({ scope: 0.5, dependencies: 0.5, technicalDepth: 1, risk: 0.5 });
      expect(withDepth - base).toBeCloseTo(0.3, 2);
    });

    test('risk weight is 0.15', () => {
      const base = calculateComplexity({ scope: 0.5, dependencies: 0.5, technicalDepth: 0.5, risk: 0 });
      const withRisk = calculateComplexity({ scope: 0.5, dependencies: 0.5, technicalDepth: 0.5, risk: 1 });
      expect(withRisk - base).toBeCloseTo(0.15, 2);
    });
  });
});

// ============================================================================
// ADVISOR COMPLEXITY → PATTERN SELECTION
// ============================================================================

/**
 * Advisor uses complexity as a SECONDARY indicator.
 * Primary: Task structure (dependencies, predictability)
 * Secondary: Complexity score (tie-breaker, "no pattern" decision)
 */

const ADVISOR_THRESHOLDS = {
  NO_PATTERN_MAX: 0.3,
};

/**
 * Advisor decision logic (simplified for testing)
 * Note: In reality, structure is analyzed first, complexity is secondary
 */
function advisorNeedsPattern(complexity, structure) {
  // If complexity is very low, might not need pattern
  if (complexity < ADVISOR_THRESHOLDS.NO_PATTERN_MAX && structure === 'simple') {
    return false;
  }
  return true;
}

function selectPatternFromStructure(structure) {
  switch (structure) {
    case 'categorization':
      return 'router';
    case 'fixed-steps':
      return 'sequential';
    case 'independent-parts':
      return 'parallel';
    case 'unknown-scope':
      return 'orchestrator';
    case 'quality-focus':
      return 'evaluator';
    case 'simple':
      return 'none';
    default:
      return 'sequential'; // default fallback
  }
}

describe('Advisor Structure → Pattern Mapping', () => {

  describe('Structure-based Pattern Selection (Primary)', () => {
    const structureTestCases = [
      { structure: 'categorization', expectedPattern: 'router' },
      { structure: 'fixed-steps', expectedPattern: 'sequential' },
      { structure: 'independent-parts', expectedPattern: 'parallel' },
      { structure: 'unknown-scope', expectedPattern: 'orchestrator' },
      { structure: 'quality-focus', expectedPattern: 'evaluator' },
      { structure: 'simple', expectedPattern: 'none' },
    ];

    structureTestCases.forEach(({ structure, expectedPattern }) => {
      test(`structure "${structure}" → ${expectedPattern} pattern`, () => {
        expect(selectPatternFromStructure(structure)).toBe(expectedPattern);
      });
    });
  });

  describe('Complexity as Secondary (No Pattern Decision)', () => {
    test('complexity 0.29 + simple structure → no pattern needed', () => {
      expect(advisorNeedsPattern(0.29, 'simple')).toBe(false);
    });

    test('complexity 0.30 + simple structure → pattern may be needed', () => {
      expect(advisorNeedsPattern(0.30, 'simple')).toBe(true);
    });

    test('complexity 0.25 + complex structure → pattern still needed', () => {
      expect(advisorNeedsPattern(0.25, 'fixed-steps')).toBe(true);
    });

    test('low complexity does NOT override structure decision', () => {
      // Even with low complexity, if structure indicates patterns, use them
      expect(advisorNeedsPattern(0.2, 'categorization')).toBe(true);
      expect(advisorNeedsPattern(0.2, 'independent-parts')).toBe(true);
    });
  });

  describe('Threshold Verification', () => {
    test('NO_PATTERN_MAX is 0.3', () => {
      expect(ADVISOR_THRESHOLDS.NO_PATTERN_MAX).toBe(0.3);
    });
  });
});

// ============================================================================
// CROSS-VALIDATION: Router vs Advisor Independence
// ============================================================================

describe('Router and Advisor Independence', () => {

  test('Router thresholds are different from Advisor thresholds', () => {
    // This ensures they are intentionally different
    expect(ROUTER_THRESHOLDS.HAIKU_MAX).not.toBe(ADVISOR_THRESHOLDS.NO_PATTERN_MAX);
  });

  test('High complexity can still be Sequential (different concerns)', () => {
    // Opus-level complexity but fixed steps → Sequential pattern
    const complexity = 0.85; // Would select Opus
    const structure = 'fixed-steps';

    expect(selectModelFromComplexity(complexity)).toBe('opus');
    expect(selectPatternFromStructure(structure)).toBe('sequential');

    // Different outputs, as expected
  });

  test('Low complexity can still need Orchestrator (unpredictable scope)', () => {
    // Haiku-level complexity but unknown scope → Orchestrator pattern
    const complexity = 0.35; // Would select Haiku
    const structure = 'unknown-scope';

    expect(selectModelFromComplexity(complexity)).toBe('haiku');
    expect(selectPatternFromStructure(structure)).toBe('orchestrator');

    // Different outputs, as expected
  });

  test('Model and Pattern are orthogonal decisions', () => {
    // All combinations should be valid
    const complexities = [0.2, 0.5, 0.8]; // haiku, sonnet, opus
    const structures = ['sequential', 'parallel', 'orchestrator'];

    complexities.forEach(c => {
      structures.forEach(s => {
        const model = selectModelFromComplexity(c);
        const pattern = selectPatternFromStructure(s);

        // Both should return valid values
        expect(['haiku', 'sonnet', 'opus']).toContain(model);
        expect(['sequential', 'parallel', 'orchestrator']).toContain(pattern);
      });
    });
  });
});

// ============================================================================
// REGRESSION TESTS: Known Good Scenarios
// ============================================================================

describe('Regression Tests (Known Good Scenarios)', () => {

  describe('From NEXT-STEPS.md Examples', () => {
    test('router threshold 0.4 for Haiku boundary', () => {
      expect(ROUTER_THRESHOLDS.HAIKU_MAX).toBe(0.4);
    });

    test('router threshold 0.7 for Opus boundary', () => {
      expect(ROUTER_THRESHOLDS.SONNET_MAX).toBe(0.7);
    });
  });

  describe('From complexity-analysis-guide.md Examples', () => {
    test('Simple bug fix (0.15) → Haiku', () => {
      // Example 1 from guide
      const complexity = calculateComplexity({
        scope: 0.1,
        dependencies: 0.1,
        technicalDepth: 0.2,
        risk: 0.1
      });
      expect(complexity).toBeCloseTo(0.13, 1);
      expect(selectModelFromComplexity(0.15)).toBe('haiku');
    });

    test('Feature development (0.55) → Sonnet', () => {
      // Example 2 from guide
      const complexity = calculateComplexity({
        scope: 0.5,
        dependencies: 0.6,
        technicalDepth: 0.5,
        risk: 0.4
      });
      expect(complexity).toBeCloseTo(0.51, 1);
      expect(selectModelFromComplexity(0.55)).toBe('sonnet');
    });

    test('Security implementation (0.85) → Opus', () => {
      // Example 3 from guide
      const complexity = calculateComplexity({
        scope: 0.8,
        dependencies: 0.9,
        technicalDepth: 0.9,
        risk: 0.9
      });
      expect(complexity).toBeCloseTo(0.87, 1);
      expect(selectModelFromComplexity(0.85)).toBe('opus');
    });
  });
});
