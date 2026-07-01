/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExamType } from '../types';
import { 
  GitCommit, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Info,
  Network,
  Share2,
  Bookmark,
  BookOpen
} from 'lucide-react';

interface MindNode {
  id: string;
  label: string;
  x: number; // Percentage coordinate for canvas positioning
  y: number;
  importance: 'high' | 'medium';
  summary: string;
  connections: string[]; // Connected node IDs
  coreGSValue: string;
}

interface MindMapCluster {
  theme: string;
  description: string;
  nodes: MindNode[];
}

const TNPSC_CLUSTERS: MindMapCluster[] = [
  {
    theme: 'Sangam Literaure & Socio-Economic History',
    description: 'Mapping classic Tamil civilization structures through archaeology, geography, and literature.',
    nodes: [
      {
        id: 'node-sangam-central',
        label: 'Five Thinai Landscapes',
        x: 50,
        y: 50,
        importance: 'high',
        summary: 'The unique environmental division of ancient Tamil territory: Kurinji, Mullai, Marutham, Neithal, and Paalai—each with custom deities and economic styles.',
        connections: ['node-keeladi', 'node-sangam-lit'],
        coreGSValue: 'Tamil Heritage (Paper II / Unit 8)'
      },
      {
        id: 'node-keeladi',
        label: 'Keeladi Excavations',
        x: 20,
        y: 45,
        importance: 'high',
        summary: 'Archaeological discoveries confirming highly advanced urban planning, literacy (Tamil-Brahmi script on pottery), and thriving industrial activity dating back to 6th century BCE.',
        connections: ['node-sangam-central'],
        coreGSValue: 'TN Archaeological Discoveries'
      },
      {
        id: 'node-sangam-lit',
        label: 'Ettuthogai & Pathupattu',
        x: 80,
        y: 45,
        importance: 'medium',
        summary: 'The core anthologies of classical Sangam literature portraying life, internal emotions (Akam), external heroism/societal metrics (Puram), and global trade networks.',
        connections: ['node-sangam-central'],
        coreGSValue: 'Tamil Literary History'
      }
    ]
  }
];

const MAP_DATA: Record<ExamType, MindMapCluster[]> = {
  UPSC: [
    {
      theme: 'Climate Change & Socio-Economic Ripple Effects',
      description: 'An interdisciplinary study connecting environmental anomalies to economic stressors, migration, and policy structures.',
      nodes: [
        {
          id: 'node-central',
          label: 'Monsoon Shift',
          x: 50,
          y: 50,
          importance: 'high',
          summary: 'Global warming alters the Indian Ocean Dipole and El Niño events, causing delayed and highly erratic monsoon cycles across central India.',
          connections: ['node-agri', 'node-migr', 'node-inflation'],
          coreGSValue: 'GS Paper III (Environment & Agriculture)'
        },
        {
          id: 'node-agri',
          label: 'Agricultural Distress',
          x: 20,
          y: 30,
          importance: 'high',
          summary: 'Erratic rainfall leads directly to widespread crop failure, soil salinity surges, and reduced ground-water tables in major agricultural beltways.',
          connections: ['node-central', 'node-inflation'],
          coreGSValue: 'GS Paper III (Agriculture Economic Support)'
        },
        {
          id: 'node-inflation',
          label: 'Food Inflation',
          x: 80,
          y: 25,
          importance: 'medium',
          summary: 'Supply shocks in major crops like onion, tomato, and rice lead to domestic price volatility, food protectionist export bans, and central bank intervention.',
          connections: ['node-central', 'node-agri'],
          coreGSValue: 'GS Paper III (Macroeconomics & Inflation)'
        },
        {
          id: 'node-migr',
          label: 'Rural Displacement',
          x: 50,
          y: 15,
          importance: 'medium',
          summary: 'Disrupted agrarian incomes trigger massive seasonal migration of distressed rural laborers towards metropolitan secondary and tertiary service hubs.',
          connections: ['node-central', 'node-policy'],
          coreGSValue: 'GS Paper I (Societal Issues & Urbanization)'
        },
        {
          id: 'node-policy',
          label: 'PM-Fasal Bima Yojana',
          x: 75,
          y: 75,
          importance: 'high',
          summary: 'Government crop insurance system designed to buffer farmers against unforeseen weather-induced yield failures, currently plagued by state payout delays.',
          connections: ['node-central', 'node-migr'],
          coreGSValue: 'GS Paper II & III (Welfare Schemes & Insurance Reforms)'
        }
      ]
    },
    {
      theme: 'Indo-Pacific Geopolitics & Maritime Strategy',
      description: 'Understanding India\'s strategic stance, quad alignments, and coastal defenses.',
      nodes: [
        {
          id: 'node-geo-central',
          label: 'SAGAR Vision',
          x: 50,
          y: 50,
          importance: 'high',
          summary: 'Security and Growth for All in the Region. India\'s primary blueprint to establish trust, maritime safety, and infrastructure leadership in the Indian Ocean.',
          connections: ['node-quad', 'node-string', 'node-choke'],
          coreGSValue: 'GS Paper II (International Relations)'
        },
        {
          id: 'node-quad',
          label: 'QUAD Alliance',
          x: 22,
          y: 35,
          importance: 'high',
          summary: 'Strategic coalition of India, USA, Japan, and Australia aiming to ensure a free, open, and rules-based Indo-Pacific region.',
          connections: ['node-geo-central'],
          coreGSValue: 'GS Paper II (Global Groupings)'
        },
        {
          id: 'node-string',
          label: 'String of Pearls',
          x: 78,
          y: 30,
          importance: 'medium',
          summary: 'Chinese naval encirclement strategy involving strategic port developments (e.g., Gwadar, Hambantota) surrounding India\'s sea lines.',
          connections: ['node-geo-central'],
          coreGSValue: 'GS Paper II (Regional Security)'
        },
        {
          id: 'node-choke',
          label: 'Malacca Chokepoint',
          x: 48,
          y: 82,
          importance: 'medium',
          summary: 'The narrow shipping lane in the South-East which is critical for global supply lanes. India’s Andaman Command acts as a security supervisor here.',
          connections: ['node-geo-central'],
          coreGSValue: 'GS Paper II & I (Geography & Maritime lanes)'
        }
      ]
    }
  ],
  TNPSC_G1: TNPSC_CLUSTERS,
  TNPSC_G2: TNPSC_CLUSTERS,
  TNPSC_G4: TNPSC_CLUSTERS,
};

export default function ConceptMindMapView({ selectedExam }: { selectedExam: ExamType }) {
  const clusters = MAP_DATA[selectedExam] || MAP_DATA['UPSC'];
  const [activeClusterIdx, setActiveClusterIdx] = useState(0);
  
  const currentCluster = clusters[activeClusterIdx] || clusters[0];
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    currentCluster ? currentCluster.nodes[0]?.id : null
  );

  const activeNode = currentCluster?.nodes.find(n => n.id === selectedNodeId) || currentCluster?.nodes[0];

  // Handle switching cluster
  const handleClusterSelect = (idx: number) => {
    setActiveClusterIdx(idx);
    const targetCluster = clusters[idx];
    if (targetCluster && targetCluster.nodes.length > 0) {
      setSelectedNodeId(targetCluster.nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="concept-mindmap-desk">
      
      {/* visual presentation banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden" id="mindmap-header-card">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-60 w-60 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-full text-[11px] font-semibold text-indigo-300 border border-indigo-400/30">
              <Network className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              Interdisciplinary Syllabus Linker
            </span>
            <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight">Concept Mind-Maps</h2>
            <p className="text-xs text-slate-300 max-w-2xl font-sans leading-relaxed">
              Mains questions rarely fit a single category. They demand interdisciplinary connection. Explore these interactive mind-maps to trace how geographical, economic, and policy anomalies feed into each other.
            </p>
          </div>
          
          {/* Cluster selectors list */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 shrink-0 w-full md:w-auto" id="cluster-selector-panel">
            <span className="text-[10px] text-indigo-300 font-mono font-black uppercase tracking-wider block">Select Concept Map</span>
            <div className="flex flex-col gap-1.5">
              {clusters.map((cluster, idx) => (
                <button
                  key={idx}
                  onClick={() => handleClusterSelect(idx)}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs text-left transition-all cursor-pointer ${
                    activeClusterIdx === idx
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {cluster.theme.length > 32 ? `${cluster.theme.substring(0, 32)}...` : cluster.theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {currentCluster ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="mindmap-workbench">
          
          {/* Left panel: Visual Map Node canvas */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[420px]" id="mindmap-nodes-canvas">
            
            {/* Grid backing background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* SVG Link lines between nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" id="mindmap-svg-lines">
              {currentCluster.nodes.map((node) => {
                return node.connections.map((targetId) => {
                  const targetNode = currentCluster.nodes.find(n => n.id === targetId);
                  if (!targetNode || node.id > targetId) return null; // Avoid duplicate lines
                  
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke="rgba(99, 102, 241, 0.25)"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-[dash_10s_linear_infinite]"
                    />
                  );
                });
              })}
            </svg>

            {/* Dynamic Node Elements */}
            {currentCluster.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isCentral = node.id.includes('central');

              return (
                <button
                  key={node.id}
                  id={`node-btn-${node.id}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl font-bold transition-all flex flex-col items-center gap-1 cursor-pointer z-10 ${
                    isSelected
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/25 scale-110 shadow-lg'
                      : isCentral
                      ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40 shadow'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-indigo-400/50 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider font-mono text-indigo-400">
                    {isCentral ? 'Anchor Node' : node.importance === 'high' ? 'GS Core' : 'Concept Point'}
                  </span>
                  <span className="text-xs md:text-sm font-extrabold whitespace-nowrap px-1">{node.label}</span>
                </button>
              );
            })}

            {/* Float helper instructions */}
            <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <Info className="h-3.5 w-3.5 text-indigo-400" />
              <span>Click any node to explore connections</span>
            </div>
          </div>

          {/* Right panel: Active concept detail review */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4" id="mindmap-sidebar-details">
            
            {activeNode ? (
              <div className="space-y-4 animate-fade-in text-xs">
                
                {/* Node Importance Level & Topic Paper */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black font-mono uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    {activeNode.coreGSValue}
                  </span>
                  <span className="text-slate-400 font-mono font-bold">
                    {activeNode.importance === 'high' ? '🔥 High Weight' : '⚖️ Standard weight'}
                  </span>
                </div>

                {/* Node Title */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 font-mono">Active Connection Detail</span>
                  <h3 className="text-lg font-black text-slate-950 font-display flex items-center gap-1.5">
                    <GitCommit className="h-5 w-5 text-indigo-600 shrink-0" />
                    {activeNode.label}
                  </h3>
                </div>

                {/* Main explanation paragraph */}
                <p className="text-slate-600 leading-relaxed font-sans text-xs">
                  {activeNode.summary}
                </p>

                {/* Trace connections */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Concept Linkages:</span>
                  <div className="space-y-1.5">
                    {activeNode.connections.map((connId) => {
                      const linkedNode = currentCluster.nodes.find(n => n.id === connId);
                      if (!linkedNode) return null;
                      return (
                        <div 
                          key={connId}
                          onClick={() => setSelectedNodeId(connId)}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <span className="font-bold text-slate-700">{linkedNode.label}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-indigo-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Layers className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No concept selected</p>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-150">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-semibold">No concept mindmaps loaded for this syllabus.</p>
        </div>
      )}

    </div>
  );
}
