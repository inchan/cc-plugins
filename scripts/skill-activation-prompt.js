#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var child_process_1 = require("child_process");
// Complexity analysis for default workflow recommendation
function analyzeComplexity(prompt) {
    var lowerPrompt = prompt.toLowerCase();
    var length = prompt.length;
    // Keywords for parallel execution
    var parallelKeywords = ['여러', '동시', '병렬', 'parallel', 'concurrent', '각각', '모두', '전부'];
    var hasParallelIntent = parallelKeywords.some(function (kw) { return lowerPrompt.includes(kw); });
    // Keywords for complex/orchestration
    var complexKeywords = ['복잡', '전체', '통합', '대규모', 'complex', 'full', 'entire', '시스템', '아키텍처'];
    var hasComplexIntent = complexKeywords.some(function (kw) { return lowerPrompt.includes(kw); });
    // Keywords for simple sequential
    var simpleKeywords = ['간단', '단순', '하나', 'simple', 'single', 'quick', '빠르게'];
    var hasSimpleIntent = simpleKeywords.some(function (kw) { return lowerPrompt.includes(kw); });
    // Decision logic
    if (hasSimpleIntent || length < 50) {
        return {
            skill: 'sequential-task-processor',
            reason: '간단한 순차 작업에 적합'
        };
    }
    if (hasParallelIntent) {
        return {
            skill: 'parallel-task-executor',
            reason: '독립 작업 병렬 처리에 최적'
        };
    }
    if (hasComplexIntent || length > 200) {
        return {
            skill: 'dynamic-task-orchestrator',
            reason: '복잡한 프로젝트 조율에 적합'
        };
    }
    // Default
    return {
        skill: 'agent-workflow-manager',
        reason: '자동 워크플로우 분석 및 실행'
    };
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var input, data, prompt_1, originalPrompt, homeDir, globalRulesPath, projectRulesPath, rulesPath, rules, enhancementRulesPath, enhancementRules, matchedSkills, matchedEnhancements, _i, _a, _b, skillName, config, triggers, keywordMatch, intentMatch, _c, _d, _e, ruleName, rule, patternMatch, enhancedPrompt, shouldEnhance, enhanceInstruction, output_1, critical, high, medium, low, allSuggestions_1, suggestions, recommendation, output;
        return __generator(this, function (_f) {
            try {
                input = (0, fs_1.readFileSync)(0, 'utf-8');
                data = JSON.parse(input);
                prompt_1 = data.prompt.toLowerCase();
                originalPrompt = data.prompt;
                // Skip if already enhanced (prevent infinite loop)
                if (process.env.SKIP_PROMPT_ENHANCE === '1' ||
                    prompt_1.includes('[enhanced]') ||
                    prompt_1.includes('__skip_enhance__')) {
                    process.exit(0);
                }
                homeDir = process.env.HOME || process.env.USERPROFILE || '';
                globalRulesPath = (0, path_1.join)(homeDir, '.claude', 'skills', 'skill-rules.json');
                projectRulesPath = (0, path_1.join)(data.cwd, '.claude', 'skills', 'skill-rules.json');
                rulesPath = globalRulesPath;
                if ((0, fs_1.existsSync)(projectRulesPath)) {
                    rulesPath = projectRulesPath;
                }
                else if (!(0, fs_1.existsSync)(globalRulesPath)) {
                    // No rules found anywhere, exit silently
                    process.exit(0);
                }
                rules = JSON.parse((0, fs_1.readFileSync)(rulesPath, 'utf-8'));
                enhancementRulesPath = (0, path_1.join)(data.cwd, '.claude', 'skills', 'prompt-enhancement-rules.json');
                enhancementRules = null;
                if ((0, fs_1.existsSync)(enhancementRulesPath)) {
                    enhancementRules = JSON.parse((0, fs_1.readFileSync)(enhancementRulesPath, 'utf-8'));
                }
                matchedSkills = [];
                matchedEnhancements = [];
                // Check each skill for matches
                for (_i = 0, _a = Object.entries(rules.skills); _i < _a.length; _i++) {
                    _b = _a[_i], skillName = _b[0], config = _b[1];
                    triggers = config.promptTriggers;
                    if (!triggers) {
                        continue;
                    }
                    // Keyword matching
                    if (triggers.keywords) {
                        keywordMatch = triggers.keywords.some(function (kw) {
                            return prompt_1.includes(kw.toLowerCase());
                        });
                        if (keywordMatch) {
                            matchedSkills.push({ name: skillName, matchType: 'keyword', config: config });
                            continue;
                        }
                    }
                    // Intent pattern matching
                    if (triggers.intentPatterns) {
                        intentMatch = triggers.intentPatterns.some(function (pattern) {
                            var regex = new RegExp(pattern, 'i');
                            return regex.test(prompt_1);
                        });
                        if (intentMatch) {
                            matchedSkills.push({ name: skillName, matchType: 'intent', config: config });
                        }
                    }
                }
                // Check enhancement rules
                if (enhancementRules) {
                    for (_c = 0, _d = Object.entries(enhancementRules.enhancementRules); _c < _d.length; _c++) {
                        _e = _d[_c], ruleName = _e[0], rule = _e[1];
                        patternMatch = rule.patterns.some(function (pattern) {
                            return prompt_1.includes(pattern.toLowerCase());
                        });
                        if (patternMatch) {
                            matchedEnhancements.push({
                                ruleName: ruleName,
                                suggestions: rule.suggestions,
                                relatedSkill: rule.relatedSkill,
                                priority: rule.priority
                            });
                        }
                    }
                }
                enhancedPrompt = '';
                shouldEnhance = matchedSkills.length > 0 || matchedEnhancements.length > 0;
                if (shouldEnhance && originalPrompt.length > 10) {
                    try {
                        enhanceInstruction = "prompt-enhancer \uC2A4\uD0AC\uC744 \uC0AC\uC6A9\uD558\uC5EC \uB2E4\uC74C \uD504\uB86C\uD504\uD2B8\uB97C \uAC1C\uC120\uD574\uC8FC\uC138\uC694.\n\uAC1C\uC120\uB41C \uD504\uB86C\uD504\uD2B8\uB9CC \uAC04\uACB0\uD558\uAC8C \uCD9C\uB825\uD558\uC138\uC694. \uC124\uBA85 \uC5C6\uC774 \uAC1C\uC120\uB41C \uD504\uB86C\uD504\uD2B8 \uD14D\uC2A4\uD2B8\uB9CC \uCD9C\uB825.\n\n\uC6D0\uBCF8 \uD504\uB86C\uD504\uD2B8: ".concat(originalPrompt);
                        enhancedPrompt = (0, child_process_1.execSync)("SKIP_PROMPT_ENHANCE=1 claude --print \"".concat(enhanceInstruction.replace(/"/g, '\\"'), "\""), {
                            encoding: 'utf-8',
                            timeout: 30000,
                            cwd: data.cwd,
                            env: __assign(__assign({}, process.env), { SKIP_PROMPT_ENHANCE: '1' })
                        }).trim();
                    }
                    catch (err) {
                        // If enhancement fails, continue without it
                        enhancedPrompt = '';
                    }
                }
                // Generate output if matches found
                if (matchedSkills.length > 0 || matchedEnhancements.length > 0) {
                    output_1 = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
                    output_1 += '🎯 SKILL ACTIVATION CHECK\n';
                    output_1 += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
                    // Group skills by priority
                    if (matchedSkills.length > 0) {
                        critical = matchedSkills.filter(function (s) { return s.config.priority === 'critical'; });
                        high = matchedSkills.filter(function (s) { return s.config.priority === 'high'; });
                        medium = matchedSkills.filter(function (s) { return s.config.priority === 'medium'; });
                        low = matchedSkills.filter(function (s) { return s.config.priority === 'low'; });
                        if (critical.length > 0) {
                            output_1 += '⚠️ CRITICAL SKILLS (REQUIRED):\n';
                            critical.forEach(function (s) { return output_1 += "  \u2192 ".concat(s.name, "\n"); });
                            output_1 += '\n';
                        }
                        if (high.length > 0) {
                            output_1 += '📚 RECOMMENDED SKILLS:\n';
                            high.forEach(function (s) { return output_1 += "  \u2192 ".concat(s.name, "\n"); });
                            output_1 += '\n';
                        }
                        if (medium.length > 0) {
                            output_1 += '💡 SUGGESTED SKILLS:\n';
                            medium.forEach(function (s) { return output_1 += "  \u2192 ".concat(s.name, "\n"); });
                            output_1 += '\n';
                        }
                        if (low.length > 0) {
                            output_1 += '📌 OPTIONAL SKILLS:\n';
                            low.forEach(function (s) { return output_1 += "  \u2192 ".concat(s.name, "\n"); });
                            output_1 += '\n';
                        }
                    }
                    // Add context enhancements
                    if (matchedEnhancements.length > 0) {
                        allSuggestions_1 = new Set();
                        matchedEnhancements.forEach(function (e) {
                            e.suggestions.forEach(function (s) { return allSuggestions_1.add(s); });
                        });
                        if (allSuggestions_1.size > 0) {
                            output_1 += '📝 CONTEXT ENHANCEMENT:\n';
                            suggestions = Array.from(allSuggestions_1).slice(0, 5);
                            suggestions.forEach(function (s) { return output_1 += "  \u2192 ".concat(s, "\n"); });
                            output_1 += '\n';
                        }
                    }
                    // Add enhanced prompt if available
                    if (enhancedPrompt && enhancedPrompt.length > 0) {
                        output_1 += '🚀 ENHANCED PROMPT:\n';
                        output_1 += "".concat(enhancedPrompt, "\n\n");
                        output_1 += 'ACTION: Use the enhanced prompt above\n';
                    }
                    else {
                        output_1 += 'ACTION: Use Skill tool BEFORE responding\n';
                    }
                    output_1 += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
                    console.log(output_1);
                }
                else if (originalPrompt.length > 20) {
                    recommendation = analyzeComplexity(originalPrompt);
                    output = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
                    output += '🎯 SKILL ACTIVATION CHECK\n';
                    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
                    output += '💡 DEFAULT WORKFLOW RECOMMENDATION:\n';
                    output += "  \u2192 ".concat(recommendation.skill, "\n");
                    output += "    (".concat(recommendation.reason, ")\n\n");
                    output += 'TIP: /auto-workflow 커맨드로 자동 분석 실행 가능\n';
                    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
                    console.log(output);
                }
                process.exit(0);
            }
            catch (err) {
                console.error('Error in skill-activation-prompt hook:', err);
                process.exit(1);
            }
            return [2 /*return*/];
        });
    });
}
main().catch(function (err) {
    console.error('Uncaught error:', err);
    process.exit(1);
});
