export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
export type FindingStatus = 'needs_validation' | 'validated' | 'false_positive' | 'approved_for_report' | 'submitted';

export interface ScopePolicy {
  programName: string;
  targetDomain: string;
  platform: string;
  allowed: boolean;
  outOfScope: string[];
  rateLimitPerMin: number;
  requiresAuthorization: boolean;
  rulesOfEngagement: string[];
  policyJson: string;
}

export interface AttackSurfaceStats {
  activities: number;
  services: number;
  receivers: number;
  providers: number;
  deepLinks: number;
  webviews: number;
  nativeLibs: number;
}

export interface ComponentNode {
  id: string;
  name: string;
  type: 'Activity' | 'Service' | 'Receiver' | 'Provider' | 'DeepLink' | 'WebView' | 'NativeLib';
  exported: boolean;
  permission?: string;
  details?: string;
  riskLevel: 'High' | 'Medium' | 'Low' | 'Safe';
}

export interface ComponentEdge {
  source: string;
  target: string;
  label: string;
}

export interface StaticFinding {
  id: string;
  category: 'Component Security' | 'WebView Security' | 'Storage' | 'Network' | 'Crypto';
  finding: string;
  file: string;
  component: string;
  confidence: number; // 0 - 1.0
  severity: FindingSeverity;
  requiresDynamicValidation: boolean;
  codeSnippet: string;
  remediation: string;
}

export interface DynamicEvent {
  timestamp: string;
  type: 'intent' | 'logcat' | 'network' | 'webview' | 'sqlite' | 'jni';
  source: string;
  details: string;
  correlatedFindingId?: string;
  severity: 'Info' | 'Warning' | 'Alert';
}

export interface FridaHookModule {
  id: string;
  name: string;
  file: string;
  active: boolean;
  description: string;
  logsCount: number;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  authType: 'OAuth2 Bearer' | 'API Key' | 'None' | 'Session Cookie';
  screen: string;
  riskTag: 'Privileged Action' | 'PII Exposure' | 'Unauthenticated API' | 'Standard';
  samplePayload?: string;
}

export interface AiTriageAssessment {
  findingId: string;
  status: FindingStatus;
  category: string;
  confidence: number;
  securityBoundary: string;
  applicationAssumption: string;
  contradictingEvidence: string;
  reproducible: boolean;
  attackerCapabilityRequired: string;
  concreteImpact: string;
  missingEvidence: string;
  reasoningSummary: string;
}

export interface EvidenceFolder {
  findingId: string;
  folderPath: string;
  files: {
    metadata: string;
    manifestSnippet: string;
    sourceSnippet: string;
    requestDump: string;
    responseDump: string;
    logcatTrace: string;
    screenshotUrl?: string;
    reproductionSteps: string;
    timelineJson: string;
  };
}

export interface ReportDraft {
  findingId: string;
  title: string;
  summary: string;
  affectedComponent: string;
  prerequisites: string;
  reproductionSteps: string[];
  observedBehavior: string;
  expectedBehavior: string;
  securityImpact: string;
  suggestedRemediation: string;
  humanApproved: boolean;
  reviewerNotes?: string;
}

export interface SubmissionAdapter {
  platformId: string;
  platformName: string;
  apiVersion: string;
  authenticated: boolean;
  readyForSubmission: boolean;
}
