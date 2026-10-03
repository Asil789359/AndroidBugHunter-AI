import { useState } from 'react';
import {
  ShieldCheck,
  FileCode,
  Network,
  Terminal,
  Activity,
  Server,
  BrainCircuit,
  FolderArchive,
  Send,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronRight,
  Shield,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';

import {
  mockScopePolicy,
  mockAttackSurfaceStats,
  mockComponentNodes,
  mockComponentEdges,
  mockStaticFindings,
  mockDynamicEvents,
  mockFridaHooks,
  mockApiEndpoints,
  mockAiAssessments,
  mockEvidenceFolder,
  mockReportDraft,
  mockAdapters
} from './mockData';
import type { FindingSeverity, DynamicEvent, FridaHookModule } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedFindingId, setSelectedFindingId] = useState<string>('FIND-001');
  const [humanApproved, setHumanApproved] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [fridaHooksState, setFridaHooksState] = useState<FridaHookModule[]>(mockFridaHooks);
  const [activeEndpointFilter, setActiveEndpointFilter] = useState<string>('All');
  const [dynamicEventsList] = useState<DynamicEvent[]>(mockDynamicEvents);

  const activeFinding = mockStaticFindings.find(f => f.id === selectedFindingId) || mockStaticFindings[0];
  const activeAiAssessment = mockAiAssessments[activeFinding.id] || mockAiAssessments['FIND-001'];

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1500);
  };

  const toggleFridaHook = (id: string) => {
    setFridaHooksState(prev =>
      prev.map(h => h.id === id ? { ...h, active: !h.active } : h)
    );
  };

  const getSeverityBadge = (sev: FindingSeverity) => {
    switch (sev) {
      case 'Critical':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">Critical</span>;
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Medium</span>;
      case 'Low':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Low</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">Info</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                AndroidBugHunter AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded uppercase">
                v2.4 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Human-in-the-Loop Authorized Security Analysis System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Target:</span>
            <span className="font-mono text-cyan-300 font-medium">api.securefinance-app.com</span>
            <span className="ml-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">SCOPE AUTHORIZED</span>
          </div>

          <button
            onClick={triggerAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing APK...' : 'Run Pipeline Analysis'}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col p-3 gap-1 shrink-0">
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Pipeline Architecture
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>1. Scope & Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('attack_surface')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'attack_surface'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4 text-blue-400" />
            <span>2 & 3. Attack Surface Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('static_scanner')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'static_scanner'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>4. Static Vuln Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('dynamic_frida')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dynamic_frida'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>5 & 6. Dynamic & Frida Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('api_scanner')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'api_scanner'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4 text-pink-400" />
            <span>7. API Security Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_triage')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ai_triage'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <span>8. AI Vulnerability Analyst</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence_report')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'evidence_report'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-emerald-400" />
            <span>9 & 10. Evidence & Report</span>
          </button>

          <button
            onClick={() => setActiveTab('submission_gate')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'submission_gate'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>11. Human Gate & Submit</span>
          </button>

          <div className="mt-auto p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Policy Gate</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3 h-3" /> ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Automated payload generation restricted. All findings require human sign-off before transmission.
            </p>
          </div>
        </aside>

        {/* Workspace Content Panel */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-6">
          {/* TAB 1: Dashboard & Scope */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Program Scope & Security Policy Gate</h2>
                  <p className="text-sm text-slate-400">Step 1: Machine-readable policy enforcement before reconnaissance execution.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Scope Validated & Signed
                </span>
              </div>

              {/* Policy Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" /> Policy Configuration (Machine Readable)
                    </h3>
                    <span className="text-xs font-mono text-slate-500">scope-engine/policy.json</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Target Platform</span>
                      <span className="font-mono text-slate-200 font-semibold">{mockScopePolicy.platform}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Target Host API</span>
                      <span className="font-mono text-cyan-300 font-semibold">{mockScopePolicy.targetDomain}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Max Authorized Rate Limit</span>
                      <span className="font-mono text-amber-400 font-semibold">{mockScopePolicy.rateLimitPerMin} req/min</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Authorization Enforcement</span>
                      <span className="font-mono text-emerald-400 font-semibold">HEADER VERIFIED (Strict)</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-2">Explicitly Out-of-Scope Rules:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {mockScopePolicy.outOfScope.map((rule, idx) => (
                        <div key={idx} className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-2">JSON Rules of Engagement:</span>
                    <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                      {mockScopePolicy.policyJson}
                    </pre>
                  </div>
                </div>

                {/* Scope Stats Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" /> Target APK Attack Surface
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Exported Activities</span>
                        <span className="font-mono font-bold text-cyan-300">{mockAttackSurfaceStats.activities}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Background Services</span>
                        <span className="font-mono font-bold text-slate-200">{mockAttackSurfaceStats.services}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Broadcast Receivers</span>
                        <span className="font-mono font-bold text-slate-200">{mockAttackSurfaceStats.receivers}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Content Providers</span>
                        <span className="font-mono font-bold text-slate-200">{mockAttackSurfaceStats.providers}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Registered Deep Links</span>
                        <span className="font-mono font-bold text-amber-400">{mockAttackSurfaceStats.deepLinks}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">WebViews Installed</span>
                        <span className="font-mono font-bold text-red-400">{mockAttackSurfaceStats.webviews}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1.5">
                        <span className="text-slate-400">Native Libraries (.so)</span>
                        <span className="font-mono font-bold text-purple-400">{mockAttackSurfaceStats.nativeLibs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setActiveTab('attack_surface')}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      View Attack Surface Graph <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: Attack Surface Graph */}
          {activeTab === 'attack_surface' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Android Attack-Surface Graph</h2>
                  <p className="text-sm text-slate-400">Steps 2 & 3: Manifest indexing and relational dependency graph linking components to deep-links and JNI.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-mono">
                    Graph Engine: Neo4j / PostgreSQL Graph Vector
                  </span>
                </div>
              </div>

              {/* Graph Visualizer Placeholder / Interactive Layout */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" /> Relational Component Map
                  </h3>
                  <span className="text-xs text-slate-400">Click a component node to view decompiled metadata</span>
                </div>

                {/* Interactive Node Graph Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockComponentNodes.map(node => (
                    <div
                      key={node.id}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        node.riskLevel === 'High'
                          ? 'bg-red-950/20 border-red-500/40 hover:border-red-400'
                          : node.riskLevel === 'Medium'
                          ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          node.type === 'WebView' ? 'bg-red-500/20 text-red-300' :
                          node.type === 'Activity' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {node.type}
                        </span>
                        {node.exported && (
                          <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                            Exported
                          </span>
                        )}
                      </div>
                      <h4 className="font-mono text-xs font-bold text-slate-200 break-all">{node.name}</h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{node.details}</p>
                    </div>
                  ))}
                </div>

                {/* Graph Edges Trace */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identified Reachability Chains</h4>
                  <div className="space-y-2">
                    {mockComponentEdges.map((edge, idx) => {
                      const src = mockComponentNodes.find(n => n.id === edge.source);
                      const tgt = mockComponentNodes.find(n => n.id === edge.target);
                      return (
                        <div key={idx} className="flex items-center gap-3 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                          <span className="text-cyan-400 font-semibold">{src?.name.split('.').pop()}</span>
                          <span className="text-slate-500">───({edge.label})───►</span>
                          <span className="text-purple-400 font-semibold">{tgt?.name.split('.').pop()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Static Vulnerability Engine */}
          {activeTab === 'static_scanner' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Static Vulnerability Analysis Engine</h2>
                  <p className="text-sm text-slate-400">Step 4: JADX & apktool AST pattern scanner for components, storage, crypto & NetworkSecurityConfig.</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
                  Rule Engine: 142 Active Heuristic Checks
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Findings List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Static Matches ({mockStaticFindings.length})</h3>
                  {mockStaticFindings.map(finding => (
                    <div
                      key={finding.id}
                      onClick={() => setSelectedFindingId(finding.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedFindingId === finding.id
                          ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{finding.id}</span>
                        {getSeverityBadge(finding.severity)}
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 mb-1">{finding.finding}</h4>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{finding.component}</p>
                      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Confidence: {(finding.confidence * 100).toFixed(0)}%</span>
                        {finding.requiresDynamicValidation && (
                          <span className="text-amber-400 flex items-center gap-1 font-semibold">
                            <Activity className="w-3 h-3" /> Dynamic Required
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Finding Inspector Detail */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-cyan-400 font-bold">{activeFinding.id}</span>
                        {getSeverityBadge(activeFinding.severity)}
                        <span className="text-xs font-mono text-slate-400">Category: {activeFinding.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-100">{activeFinding.finding}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('dynamic_frida')}
                      className="px-3 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs rounded-lg transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Validate via Dynamic Engine
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 block">Decompiled AST Code Match:</span>
                    <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                      {activeFinding.codeSnippet}
                    </pre>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-400 block">Remediation Recommendation:</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{activeFinding.remediation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5 & 6: Dynamic & Frida Analysis Engine */}
          {activeTab === 'dynamic_frida' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Dynamic Analysis & Frida Instrumentation Engine</h2>
                  <p className="text-sm text-slate-400">Steps 5 & 6: Isolated Android emulator event collector & targeted Frida hook telemetry.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Emulator API 34 Attached
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Frida Modules Controller */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Terminal className="w-4 h-4 text-purple-400" /> Frida Instrumentation Hooks
                  </h3>
                  <div className="space-y-3">
                    {fridaHooksState.map(hook => (
                      <div key={hook.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{hook.name}</span>
                          <button
                            onClick={() => toggleFridaHook(hook.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                              hook.active
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {hook.active ? 'HOOKED' : 'INACTIVE'}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">{hook.description}</p>
                        <div className="text-[10px] font-mono text-slate-500 flex justify-between pt-1">
                          <span>{hook.file}</span>
                          <span>{hook.logsCount} events captured</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Dynamic Event Telemetry Log */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" /> Live Event Telemetry Stream
                    </h3>
                    <span className="text-xs font-mono text-slate-500">adb logcat & frida console</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-3 max-h-[420px] overflow-y-auto">
                    {dynamicEventsList.map((evt, idx) => (
                      <div key={idx} className="border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">{evt.timestamp}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${
                            evt.severity === 'Alert' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {evt.type}
                          </span>
                        </div>
                        <div className="text-cyan-300 font-semibold text-[11px]">{evt.source}</div>
                        <div className="text-slate-300 break-all text-[11px]">{evt.details}</div>
                        {evt.correlatedFindingId && (
                          <div className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold pt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Correlated with {evt.correlatedFindingId}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: API Security Engine */}
          {activeTab === 'api_scanner' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">API Security Engine & Traffic Proxy</h2>
                  <p className="text-sm text-slate-400">Step 7: APK URL extraction, Burp/Proxy endpoint mapping & authz vulnerability correlation.</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
                  Proxy Interceptor: Active (HTTP/2 TLS Termination)
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Server className="w-4 h-4 text-pink-400" /> Discovered Client API Endpoints ({mockApiEndpoints.length})
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Filter Risk:</span>
                    {['All', 'Privileged Action', 'PII Exposure', 'Unauthenticated API'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActiveEndpointFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          activeEndpointFilter === filter
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {mockApiEndpoints
                    .filter(ep => activeEndpointFilter === 'All' || ep.riskTag === activeEndpointFilter)
                    .map(endpoint => (
                      <div key={endpoint.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                              endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                              endpoint.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className="font-mono text-sm font-bold text-slate-200">{endpoint.path}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/30">
                            {endpoint.riskTag}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-500 block">Auth Scheme</span>
                            <span className="font-mono text-cyan-300">{endpoint.authType}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Mapped Screen/Activity</span>
                            <span className="font-mono text-slate-300">{endpoint.screen}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Proxy State</span>
                            <span className="font-mono text-emerald-400 font-semibold">Captured in Session</span>
                          </div>
                        </div>

                        {endpoint.samplePayload && (
                          <pre className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-400 overflow-x-auto">
                            {endpoint.samplePayload}
                          </pre>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AI Vulnerability Analyst */}
          {activeTab === 'ai_triage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">AI Vulnerability Analyst & Triage Engine</h2>
                  <p className="text-sm text-slate-400">Step 8: LLM multi-factor security boundary & hypothesis validation engine.</p>
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono">
                  Model: Gemini 3.6 Structured Reasoner
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-sm text-slate-200">Structured AI Triage Vector for {activeFinding.id}</h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    Confidence: {(activeAiAssessment.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-semibold block">1. Security Boundary</span>
                    <p className="text-slate-300">{activeAiAssessment.securityBoundary}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-semibold block">2. Application Assumption</span>
                    <p className="text-slate-300">{activeAiAssessment.applicationAssumption}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-semibold block">3. Contradicting Dynamic Evidence</span>
                    <p className="text-slate-300">{activeAiAssessment.contradictingEvidence}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-semibold block">4. Required Attacker Capability</span>
                    <p className="text-slate-300">{activeAiAssessment.attackerCapabilityRequired}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">5. Concrete Security Impact & Severity Verdict</span>
                  <p className="text-xs text-orange-300 font-medium">{activeAiAssessment.concreteImpact}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">AI Reasoning Summary:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeAiAssessment.reasoningSummary}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('evidence_report')}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    Proceed to Evidence & Draft Report <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9 & 10: Evidence & Report Generator */}
          {activeTab === 'evidence_report' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Evidence Folder & Report Draft Generator</h2>
                  <p className="text-sm text-slate-400">Steps 9 & 10: Structural evidence package compilation and draft Markdown/HTML report generation.</p>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
                  Folder: {mockEvidenceFolder.folderPath}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evidence Artifacts List */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <FolderArchive className="w-4 h-4 text-emerald-400" /> Evidence Artifacts
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 truncate">
                      📄 metadata.json
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 truncate">
                      📄 manifest_snippet.xml
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 truncate">
                      📄 source_decompiled.java
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 truncate">
                      📄 request_dump.txt
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 truncate">
                      📄 logcat_trace.txt
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 truncate">
                      🖼️ proof_screenshot.png
                    </div>
                  </div>
                </div>

                {/* Report Draft View */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
                  <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Draft Report</span>
                      <h3 className="text-base font-bold text-slate-100">{mockReportDraft.title}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('submission_gate')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                    >
                      Forward to Human Review Gate <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">Summary</span>
                      <p className="text-slate-300 leading-relaxed">{mockReportDraft.summary}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">Steps to Reproduce</span>
                      <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-cyan-300">
                        {mockReportDraft.reproductionSteps.map((step, idx) => (
                          <p key={idx}>{step}</p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold text-slate-400 block mb-1">Observed Behavior</span>
                        <p className="text-slate-300">{mockReportDraft.observedBehavior}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400 block mb-1">Expected Behavior</span>
                        <p className="text-slate-300">{mockReportDraft.expectedBehavior}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: Human Review Gate & Authorized Submission */}
          {activeTab === 'submission_gate' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Human Review Gate & Submission Adapter</h2>
                  <p className="text-sm text-slate-400">Step 11: Mandatory human authorization before platform submission.</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-mono flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Mandatory Approval Enforced
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h4 className="font-bold text-amber-300">Human Approval Protocol</h4>
                    <p className="text-amber-200/80 leading-relaxed">
                      This system enforces an absolute security gate: no report or packet can be submitted automatically.
                      As a human security researcher, you must review the evidence artifacts and explicitly check off approval.
                    </p>
                  </div>
                </div>

                {/* Pre-Submission Checks */}
                <div className="space-y-3 border-y border-slate-800 py-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Automated Pre-Flight Gate Verification</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Target in Scope
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Program Active
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Finding Category Allowed
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Evidence Present
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> No Duplicate Found
                    </div>
                    <div className={`p-3 bg-slate-950 border rounded-lg flex items-center gap-2 font-bold ${
                      humanApproved ? 'border-emerald-500/40 text-emerald-400' : 'border-amber-500/40 text-amber-400'
                    }`}>
                      {humanApproved ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {humanApproved ? 'Human Approved' : 'Awaiting Approval'}
                    </div>
                  </div>
                </div>

                {/* Submission Platform Selection */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Submission Adapter</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockAdapters.map(adapter => (
                      <div key={adapter.platformId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{adapter.platformName}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{adapter.apiVersion}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Auth API Token</span>
                          <span className={adapter.authenticated ? 'text-emerald-400' : 'text-red-400'}>
                            {adapter.authenticated ? 'Valid' : 'Missing'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Human Toggle & Submit Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={humanApproved}
                      onChange={(e) => setHumanApproved(e.target.checked)}
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-200 font-semibold">
                      I have reviewed the evidence folder and authorize final report transmission.
                    </span>
                  </label>

                  <button
                    disabled={!humanApproved || submissionSuccess}
                    onClick={() => setSubmissionSuccess(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submissionSuccess ? 'Report Submitted Successfully!' : 'Execute Authorized Submission'}
                  </button>
                </div>

                {submissionSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Report submitted to HackerOne API endpoint. Ticket ID: #H1-994182. Status: Under Initial Program Triage.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
