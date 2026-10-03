import type {
  ScopePolicy,
  AttackSurfaceStats,
  ComponentNode,
  ComponentEdge,
  StaticFinding,
  DynamicEvent,
  FridaHookModule,
  ApiEndpoint,
  AiTriageAssessment,
  EvidenceFolder,
  ReportDraft,
  SubmissionAdapter
} from './types';

export const mockScopePolicy: ScopePolicy = {
  programName: "FinTech Mobile Security Program (HackerOne Authorized)",
  targetDomain: "api.securefinance-app.com",
  platform: "Android APK (v4.8.2)",
  allowed: true,
  outOfScope: [
    "production_accounts (Use staging sandbox test-user-09)",
    "third_party_services (*.stripe.com, *.firebaseio.com)",
    "Denial of Service (DoS / DDoS)",
    "Social engineering / Phishing employees"
  ],
  rateLimitPerMin: 10,
  requiresAuthorization: true,
  rulesOfEngagement: [
    "Always specify X-BugBounty-HackerOne header during API testing",
    "Only test exported components explicitly listed in scope manifesto",
    "Human authorization gate required before transmitting exploit packets"
  ],
  policyJson: JSON.stringify({
    target: "api.securefinance-app.com",
    platform: "android",
    allowed: true,
    out_of_scope: ["production_accounts", "third_party_services"],
    rate_limit: 10,
    requires_authorization: true
  }, null, 2)
};

export const mockAttackSurfaceStats: AttackSurfaceStats = {
  activities: 42,
  services: 8,
  receivers: 17,
  providers: 5,
  deepLinks: 12,
  webviews: 7,
  nativeLibs: 4
};

export const mockComponentNodes: ComponentNode[] = [
  { id: "comp-1", name: "com.securefinance.MainActivity", type: "Activity", exported: true, riskLevel: "Safe", details: "Main Launcher Activity" },
  { id: "comp-2", name: "com.securefinance.AuthDeepLinkActivity", type: "Activity", exported: true, riskLevel: "High", details: "Handles secure://oauth & https://securefinance.com/auth" },
  { id: "comp-3", name: "com.securefinance.InternalWebViewActivity", type: "WebView", exported: true, riskLevel: "High", details: "Renders web pages, setJavaScriptEnabled(true), addJavascriptInterface(new AndroidBridge())" },
  { id: "comp-4", name: "com.securefinance.SyncService", type: "Service", exported: false, riskLevel: "Safe", details: "Background sync service bound with signature permission" },
  { id: "comp-5", name: "com.securefinance.PushReceiver", type: "Receiver", exported: true, riskLevel: "Medium", details: "Receives FCM push intents without signature permission verification" },
  { id: "comp-6", name: "com.securefinance.DBProvider", type: "Provider", exported: true, permission: "com.securefinance.READ_DB", riskLevel: "Medium", details: "Custom ContentProvider exposing encrypted sqlite helper" },
  { id: "comp-7", name: "libcrypto_native.so", type: "NativeLib", exported: false, riskLevel: "Low", details: "JNI binding for proprietary AES token decryption" }
];

export const mockComponentEdges: ComponentEdge[] = [
  { source: "comp-1", target: "comp-2", label: "starts" },
  { source: "comp-2", target: "comp-3", label: "launches deep-link payload into" },
  { source: "comp-3", target: "comp-7", label: "invokes JNI bridge" },
  { source: "comp-5", target: "comp-4", label: "triggers" },
  { source: "comp-3", target: "comp-6", label: "queries local DB" }
];

export const mockStaticFindings: StaticFinding[] = [
  {
    id: "FIND-001",
    category: "WebView Security",
    finding: "Dangerous JavaScript Interface exposed in Exported WebView",
    file: "AndroidManifest.xml / InternalWebViewActivity.java",
    component: "com.securefinance.InternalWebViewActivity",
    confidence: 0.92,
    severity: "High",
    requiresDynamicValidation: true,
    codeSnippet: `webView.getSettings().setJavaScriptEnabled(true);
webView.addJavascriptInterface(new AndroidBridge(this), "AndroidNative");
// Exported in AndroidManifest.xml without intent filter domain validation`,
    remediation: "Remove @JavascriptInterface annotations for unauthenticated web contexts or validate origin domain against whitelist before binding JNI objects."
  },
  {
    id: "FIND-002",
    category: "Component Security",
    finding: "Unprotected Exported BroadcastReceiver accepting arbitrary Intents",
    file: "com.securefinance.PushReceiver",
    component: "com.securefinance.PushReceiver",
    confidence: 0.85,
    severity: "Medium",
    requiresDynamicValidation: true,
    codeSnippet: `<receiver android:name=".PushReceiver" android:exported="true">
    <intent-filter>
        <action android:name="com.securefinance.ACTION_NOTIFY"/>
    </intent-filter>
</receiver>`,
    remediation: "Set android:exported=\"false\" or enforce custom protectionLevel=\"signature\" permissions."
  },
  {
    id: "FIND-003",
    category: "Storage",
    finding: "Hardcoded Encryption Salt & Private Keys in SharedPreferences",
    file: "res/values/strings.xml",
    component: "com.securefinance.utils.CryptoManager",
    confidence: 0.98,
    severity: "Critical",
    requiresDynamicValidation: false,
    codeSnippet: `<string name="aes_key_static">3q2+796Bv9XzLqW2M8P1aQ==</string>
<string name="db_passphrase">SuperSecretPasscode2026!</string>`,
    remediation: "Store cryptographic keys in Android KeyStore system (MasterKey / EncryptedSharedPreferences) rather than static resources."
  },
  {
    id: "FIND-004",
    category: "Network",
    finding: "Cleartext Traffic Allowed & Custom TrustManager Bypassing SSL",
    file: "res/xml/network_security_config.xml",
    component: "NetworkConfig",
    confidence: 0.88,
    severity: "Medium",
    requiresDynamicValidation: true,
    codeSnippet: `<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">staging-api.securefinance-app.com</domain>
    </domain-config>
</network-security-config>`,
    remediation: "Disable cleartextTrafficPermitted in production release builds and enforce strict SSL pinning."
  }
];

export const mockDynamicEvents: DynamicEvent[] = [
  { timestamp: "18:42:01.102", type: "intent", source: "ADB Launcher", details: "am start -a android.intent.action.VIEW -d 'secure://oauth?redirect=javascript:alert(document.cookie)'", severity: "Alert", correlatedFindingId: "FIND-001" },
  { timestamp: "18:42:01.350", type: "webview", source: "com.securefinance.InternalWebViewActivity", details: "WebView loaded URL: secure://oauth?redirect=javascript:alert(document.cookie)", severity: "Alert", correlatedFindingId: "FIND-001" },
  { timestamp: "18:42:01.410", type: "logcat", source: "AndroidBridge JNI", details: "[AndroidBridge] Native executeCommand() invoked from JS context with arg: 'getUserSessionToken'", severity: "Alert", correlatedFindingId: "FIND-001" },
  { timestamp: "18:42:02.005", type: "network", source: "OkHttp Client", details: "POST https://api.securefinance-app.com/v2/user/session Header: Authorization: Bearer eyJhbGciOi...", severity: "Warning" },
  { timestamp: "18:42:02.190", type: "sqlite", source: "SQLiteDatabase", details: "SELECT token, pin_hash FROM user_credentials WHERE active=1;", severity: "Warning" }
];

export const mockFridaHooks: FridaHookModule[] = [
  { id: "frida-1", name: "Activity & Intent Monitor", file: "frida/intent_monitor.js", active: true, description: "Hooks Intent.getExtras() and startActivity() to inspect incoming payload data.", logsCount: 42 },
  { id: "frida-2", name: "WebView JS Bridge Tracer", file: "frida/webview_monitor.js", active: true, description: "Monitors addJavascriptInterface methods and intercepted evaluateJavascript calls.", logsCount: 128 },
  { id: "frida-3", name: "Crypto & KeyStore Inspector", file: "frida/crypto_monitor.js", active: false, description: "Hooks javax.crypto.Cipher.doFinal() to intercept plaintext key material.", logsCount: 0 },
  { id: "frida-4", name: "Network & SSL Unpinning", file: "frida/network_monitor.js", active: true, description: "Bypasses TrustManager and Conscrypt SSL verification for HTTP proxy inspection.", logsCount: 310 }
];

export const mockApiEndpoints: ApiEndpoint[] = [
  { id: "api-1", path: "/v2/user/profile", method: "GET", authType: "OAuth2 Bearer", screen: "UserProfileFragment", riskTag: "PII Exposure", samplePayload: '{"user_id": 9042, "email": "victim@example.com"}' },
  { id: "api-2", path: "/v2/wallet/transfer", method: "POST", authType: "OAuth2 Bearer", screen: "TransferFundsActivity", riskTag: "Privileged Action", samplePayload: '{"recipient_account": "100293", "amount": 500.00}' },
  { id: "api-3", path: "/v2/config/remote-flags", method: "GET", authType: "None", screen: "SplashActivity", riskTag: "Unauthenticated API", samplePayload: '{"feature_debug_enabled": true}' },
  { id: "api-4", path: "/v2/user/documents/delete", method: "DELETE", authType: "OAuth2 Bearer", screen: "DocumentVaultActivity", riskTag: "Privileged Action", samplePayload: '{"doc_id": "DOC-9921"}' }
];

export const mockAiAssessments: Record<string, AiTriageAssessment> = {
  "FIND-001": {
    findingId: "FIND-001",
    status: "needs_validation",
    category: "WebView JavaScript Execution & Arbitrary JNI Bridge Invocation",
    confidence: 0.91,
    securityBoundary: "Untrusted external deep-link input vs internal Java Native Interface execution context.",
    applicationAssumption: "Application assumes deep-link URLs processed by InternalWebViewActivity originate only from authenticated internal redirects.",
    contradictingEvidence: "Dynamic Frida telemetry confirmed that an arbitrary third-party application can launch 'secure://oauth' with a custom JS scheme payload, triggering AndroidBridge JNI execution without domain validation.",
    reproducible: true,
    attackerCapabilityRequired: "Attacker can trick target user into opening a crafted deep-link (e.g. via SMS, browser, or malicious app on same device).",
    concreteImpact: "High - Exposes user's active OAuth Bearer session token to unauthenticated attacker via local XSS / JNI bridge reflection.",
    missingEvidence: "Verification on physical Android 14 device with SELinux enforcing mode to ensure zero JNI sandboxing block.",
    reasoningSummary: "The static finding identified setJavaScriptEnabled(true) combined with addJavascriptInterface(). Dynamic telemetry confirmed that arbitrary intent extra parameters can inject script strings into the active WebView session. High confidence candidate finding for bug-bounty report."
  }
};

export const mockEvidenceFolder: EvidenceFolder = {
  findingId: "FIND-001",
  folderPath: "findings/FIND-001/",
  files: {
    metadata: "FIND-001_metadata.json (Severity: High, Conf: 91%, Target: authorized_scope)",
    manifestSnippet: `<activity android:name="com.securefinance.InternalWebViewActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="secure" android:host="oauth"/>
    </intent-filter>
</activity>`,
    sourceSnippet: `// JADX Decompiled InternalWebViewActivity.java
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    String targetUrl = getIntent().getDataString();
    this.mWebView.getSettings().setJavaScriptEnabled(true);
    this.mWebView.addJavascriptInterface(new AndroidBridge(this), "AndroidNative");
    this.mWebView.loadUrl(targetUrl); // Unsanitized URL pass
}`,
    requestDump: `GET /v2/user/session HTTP/1.1
Host: api.securefinance-app.com
Authorization: Bearer eyJhbGciOiJKV1QiLCJhbGci...
X-BugBounty-HackerOne: authorized_hunter_id_4492`,
    responseDump: `HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store

{"status":"success","user_id":9042,"session_token":"SESS_EXP_998124"}`,
    logcatTrace: `18:42:01.350 W/InternalWebView: Loading untrusted URL from intent scheme
18:42:01.410 I/AndroidBridge: Native executeCommand() called from WebView thread`,
    screenshotUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    reproductionSteps: `1. Install target APK v4.8.2 on test Android emulator (API 34).
2. Execute ADB command: adb shell am start -a android.intent.action.VIEW -d "secure://oauth?redirect=javascript:AndroidNative.executeCommand('getSession')"
3. Observe logcat trace indicating session token reflection in WebView console log.`,
    timelineJson: JSON.stringify([
      { t: "18:40:00", step: "Static Analysis indexed exported WebView" },
      { t: "18:42:01", step: "Frida script intercepted Intent broadcast" },
      { t: "18:42:05", step: "AI Triage Engine synthesized evidence vector" }
    ], null, 2)
  }
};

export const mockReportDraft: ReportDraft = {
  findingId: "FIND-001",
  title: "Improper Validation in Exported WebView Component Exposes Sensitive OAuth Session Tokens via JNI Bridge Injection",
  summary: "An exported Activity (`com.securefinance.InternalWebViewActivity`) configures an unsafe JavaScript interface (`AndroidBridge`) while processing arbitrary external deep-link schemes (`secure://oauth`). An unauthenticated attacker can construct a malicious link that forces the WebView to execute arbitrary JavaScript, allowing exfiltration of active user credentials.",
  affectedComponent: "com.securefinance.InternalWebViewActivity",
  prerequisites: "User has target APK installed and active authenticated session.",
  reproductionSteps: [
    "1. Connect test Android device or emulator via ADB.",
    "2. Issue the following intent launch command:\n   adb shell am start -a android.intent.action.VIEW -d \"secure://oauth?redirect=javascript:alert(AndroidNative.executeCommand('getToken'))\"",
    "3. Observe that the exported WebView launches without domain origin checks and executes the JavaScript payload in the privilege context of the native app."
  ],
  observedBehavior: "The application opens the deep link URL directly inside the WebView with `JavaScriptEnabled(true)` and native JNI bindings active, allowing remote untrusted JavaScript to invoke internal methods.",
  expectedBehavior: "Exported activities should validate that incoming deep-link parameters match trusted domain origins before enabling JavaScript interfaces or loading external URLs.",
  securityImpact: "High - Allows an attacker to steal active session tokens or perform actions on behalf of the user when the victim opens a malicious link.",
  suggestedRemediation: "1. Enforce strict URL domain whitelisting before calling `loadUrl()` in `InternalWebViewActivity`.\n2. Avoid using `addJavascriptInterface()` unless required, or restrict usage to trusted local HTML assets.",
  humanApproved: false,
  reviewerNotes: "Requires human authorization check to verify target domain rule-of-engagement headers before final submission."
};

export const mockAdapters: SubmissionAdapter[] = [
  { platformId: "hackerone", platformName: "HackerOne API Adapter", apiVersion: "v1", authenticated: true, readyForSubmission: true },
  { platformId: "bugcrowd", platformName: "Bugcrowd API Adapter", apiVersion: "v2", authenticated: true, readyForSubmission: true },
  { platformId: "intigriti", platformName: "Intigriti Submissions Adapter", apiVersion: "v1.2", authenticated: false, readyForSubmission: false }
];
