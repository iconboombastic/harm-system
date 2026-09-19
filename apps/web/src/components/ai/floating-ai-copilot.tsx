'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  RefreshCw, 
  Copy, 
  Check, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
  FileSearch,
  Scale,
  Building2,
  HelpCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  sendCopilotMessageAction, 
  ScreenContext, 
  CopilotResponse 
} from '@/lib/actions/ai-copilot';
import { OfficialRegulationLink } from '@/lib/services/regulation-service';
import { dispatchReviewerNote } from '@/lib/actions/notes';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  references?: OfficialRegulationLink[];
  directSearch?: CopilotResponse['directSearch'];
  suggestedAction?: CopilotResponse['suggestedAction'];
  screenTitle?: string;
}

interface FloatingAICopilotProps {
  currentUser?: {
    id?: string;
    name?: string;
    role?: string;
  };
}

export default function FloatingAICopilot({ currentUser }: FloatingAICopilotProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  // Screen Context state
  const [screenContext, setScreenContext] = useState<ScreenContext>({ pathname });
  const [selectedText, setSelectedText] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Live Screen Detection: Listen to URL changes & DOM headers
  useEffect(() => {
    function detectCurrentScreen() {
      // Baca elemen H1 di layar utama jika ada
      const h1El = document.querySelector('main h1') || document.querySelector('h1');
      const pageHeading = h1El?.textContent?.trim() || '';

      // Cek apakah ada nomor HARM di layar
      const harmBadge = document.querySelector('[class*="HARM-"]')?.textContent?.trim() || '';

      // Cek OPD jika ada
      const opdMatch = document.body.innerText.match(/OPD[:\s]+([A-Za-z\s]+)/i);
      const detectedOpd = opdMatch ? opdMatch[1]?.slice(0, 40) : undefined;

      const context: ScreenContext = {
        pathname,
        pageTitle: pageHeading || document.title,
        caseTitle: pageHeading || undefined,
        caseNumber: harmBadge || undefined,
        opdName: detectedOpd,
        selectedText: selectedText || undefined,
      };

      setScreenContext(context);
    }

    detectCurrentScreen();
  }, [pathname, selectedText]);

  // 2. Listen to text selection anywhere on page
  useEffect(() => {
    function handleSelection() {
      const sel = window.getSelection()?.toString().trim();
      if (sel && sel.length > 5 && sel.length < 1000) {
        setSelectedText(sel);
      }
    }

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  // 3. Listen to external document audit events (e.g. from Documents Table)
  useEffect(() => {
    function handleInspectDocEvent(e: any) {
      if (e.detail?.title) {
        setIsOpen(true);
        handleSendMessage(`Periksa draf dokumen "${e.detail.title}" (${e.detail.type || 'Draf Regulasi'}) terhadap hierarki dasar hukum BPK RI & JDIHN`);
      }
    }

    window.addEventListener('harm:inspect-document', handleInspectDocEvent);
    return () => window.removeEventListener('harm:inspect-document', handleInspectDocEvent);
  }, []);

  // 3. Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Halo ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Bapak/Ibu'}! Saya **HARM AI Legal Copilot**, asisten penelaah hukum cerdas Pemerintah Kabupaten Aceh Tamiang.

Saya memantau layar aktif Anda dan terhubung langsung ke **Database Peraturan BPK RI (peraturan.bpk.go.id)** serta **JDIH Nasional (jdihn.go.id)**.

Kapan saja Anda memeriksa draf naskah, saya siap memvalidasi hierarki dasar hukum, mendeteksi pasal bertentangan, dan menyediakan tautan naskah resmi langsung.`,
      timestamp: 'Baru saja',
    },
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await sendCopilotMessageAction({
        message: query.trim(),
        screenContext: {
          ...screenContext,
          selectedText: selectedText || undefined,
        },
      });

      if (res.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.reply,
          timestamp: 'Baru saja',
          references: res.references,
          directSearch: res.directSearch,
          suggestedAction: res.suggestedAction,
          screenTitle: res.detectedTitle,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Mohon maaf, terjadi kendala saat menghubungi basis data peraturan. Silakan coba kembali.',
        timestamp: 'Baru saja',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setSelectedText(''); // Clear selected text once sent
    }
  };

  // Copy clause text
  const handleCopyClause = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // One-click dispatch finding to staff
  const handleDispatchFinding = async (payload: any, id: string) => {
    if (!payload) return;
    try {
      await dispatchReviewerNote({
        targetStaffName: 'M. Yusuf (Legal Drafter)',
        caseTitle: payload.title || screenContext.caseTitle || 'Koreksi Kepatuhan Regulasi (AI Copilot)',
        instruction: payload.instruction || 'Harap tindak lanjuti keselarasan pasal dengan regulasi BPK RI / JDIHN.',
        todos: [
          'Periksa klausul terhadap regulasi BPK RI / JDIHN terkait',
          'Harmonisasikan rumusan pasal dengan UU 12/2011',
          'Unggah draf revisi naskah ke Google Drive Arsip'
        ],
        priority: 'HIGH',
        color: 'rose',
        senderRole: (currentUser?.role as any) || 'ADMIN',
      });
      setDispatchedId(id);
      setTimeout(() => setDispatchedId(null), 3000);
    } catch (e) {
      alert('Gagal mengirimkan disposisi.');
    }
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle screen detection pulse pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 text-slate-200 text-xs px-3.5 py-2 rounded-full border border-slate-700 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="truncate max-w-[200px]">
              {screenContext.caseTitle ? screenContext.caseTitle : 'Layar Terpantau AI'}
            </span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 text-white shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
            title="Buka HARM AI Legal Copilot"
          >
            <Sparkles className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white text-[9px] font-bold text-slate-950 items-center justify-center">
                AI
              </span>
            </span>
          </button>
        </div>
      )}

      {/* 2. CHAT DRAWER / FLOATING COPILOT DIALOG */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col shadow-2xl border border-slate-700/80 bg-slate-950 text-slate-100 backdrop-blur-xl ${
            isExpanded
              ? 'inset-4 md:inset-x-12 md:inset-y-8 rounded-2xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[480px] h-[640px] max-h-[88vh] rounded-2xl'
          }`}
        >
          {/* Top Header Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Scale className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                    HARM AI Legal Copilot
                  </h3>
                  <Badge className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-1.5 py-0">
                    Live
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Terhubung BPK.RI & JDIHN</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title={isExpanded ? 'Perkecil Ukuran' : 'Perbesar Jendela'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Screen Detector Bar */}
          <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 truncate max-w-[80%]">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 shrink-0" />
              <span className="font-semibold text-blue-400 shrink-0">Layar Aktif:</span>
              <span className="truncate text-slate-200">
                {screenContext.caseTitle || screenContext.pageTitle || 'Dasbor Utama'}
              </span>
            </div>
            <button
              onClick={() => handleSendMessage('Periksa dokumen di layar ini secara menyeluruh')}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline shrink-0 flex items-center gap-1"
            >
              <FileSearch className="w-3 h-3" />
              <span>Scan Layar</span>
            </button>
          </div>

          {/* Selected Text Notification Bar (If user highlighted any text) */}
          {selectedText && (
            <div className="px-4 py-2 bg-indigo-950/80 border-b border-indigo-800/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate text-indigo-200">
                <span className="font-bold text-amber-300">Teks Terpilih:</span>
                <span className="truncate italic">"{selectedText.slice(0, 50)}..."</span>
              </div>
              <button
                onClick={() => handleSendMessage(`Periksa klausul terpilih ini terhadap regulasi BPK RI & JDIHN: "${selectedText}"`)}
                className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] shrink-0"
              >
                Uji Klausul Ini &rarr;
              </button>
            </div>
          )}

          {/* Message List Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
                    }`}
                  >
                    {/* Header info if AI detected screen */}
                    {!isUser && msg.screenTitle && (
                      <div className="mb-2.5 pb-2 border-b border-slate-800 text-[11px] text-blue-400 font-semibold flex items-center gap-1.5">
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>Konteks: {msg.screenTitle}</span>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="whitespace-pre-wrap space-y-2">{msg.text}</div>

                    {/* Suggested Action Pill */}
                    {!isUser && msg.suggestedAction && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-2">
                        {msg.suggestedAction.type === 'COPY_CLAUSE' && (
                          <Button
                            size="sm"
                            onClick={() => handleCopyClause(msg.suggestedAction?.payload || '', msg.id)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 font-semibold"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Tersalin!' : msg.suggestedAction.title}</span>
                          </Button>
                        )}

                        {msg.suggestedAction.type === 'DISPATCH_TO_STAFF' && (
                          <Button
                            size="sm"
                            onClick={() => handleDispatchFinding(msg.suggestedAction?.payload, msg.id)}
                            className="h-7 text-xs bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 font-semibold"
                          >
                            {dispatchedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                            <span>{dispatchedId === msg.id ? 'Terkirim ke Staf!' : msg.suggestedAction.title}</span>
                          </Button>
                        )}
                      </div>
                    )}

                    {/* DIRECT OFFICIAL REGULATION REFERENCE LINKS CARDS */}
                    {!isUser && msg.references && msg.references.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Tautan Referensi Resmi Terverifikasi:</span>
                        </div>

                        <div className="space-y-2">
                          {msg.references.map((ref) => {
                            const isBpk = ref.source === 'BPK_RI';
                            const isRevoked = ref.status === 'DICABUT';

                            return (
                              <div
                                key={ref.id}
                                className={`rounded-xl p-3 border text-xs transition flex flex-col justify-between gap-2 ${
                                  isRevoked
                                    ? 'bg-red-950/40 border-red-800/80 text-red-200'
                                    : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-blue-500/80'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <Badge
                                      className={`text-[10px] font-bold ${
                                        isBpk
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                      }`}
                                    >
                                      {ref.sourceName}
                                    </Badge>

                                    {isRevoked ? (
                                      <Badge className="bg-red-500 text-white border-none text-[10px] font-bold">
                                        Dicabut
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                                        Masih Berlaku
                                      </Badge>
                                    )}
                                  </div>

                                  <h5 className="font-bold text-slate-100 text-xs leading-snug">
                                    {ref.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                                    {ref.tentang}
                                  </p>
                                  {ref.keterangan && (
                                    <p className="text-[10px] text-amber-300/90 mt-1 italic">
                                      {ref.keterangan}
                                    </p>
                                  )}
                                </div>

                                {/* DIRECT CLICKABLE LINK BUTTONS: BPK RI & JDIHN */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <a
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-2xs text-center"
                                  >
                                    <span>Database BPK.RI</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>

                                  <a
                                    href={ref.jdihnUrl || `https://jdihn.go.id/search?c=all&q=${encodeURIComponent(ref.nomor)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-2xs text-center"
                                  >
                                    <span>JDIH Nasional</span>
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* DIRECT SEARCH LIVE PORTAL BUTTONS */}
                    {!isUser && msg.directSearch && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold text-sky-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 uppercase tracking-wider">
                            <Search className="w-3.5 h-3.5 text-sky-400" />
                            <span>Pencarian Langsung Basis Data Resmi:</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal italic">
                            "{msg.directSearch.queryText}"
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <a
                            href={msg.directSearch.bpkSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition shadow-2xs"
                          >
                            <span className="truncate">Cari di BPK RI</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-amber-400" />
                          </a>

                          <a
                            href={msg.directSearch.jdihnSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-bold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition shadow-2xs"
                          >
                            <span className="truncate">Cari di JDIHN</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-blue-400" />
                          </a>

                          <a
                            href={msg.directSearch.acehTamiangJdihUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-1.5 py-2 px-2.5 rounded-xl text-[11px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition shadow-2xs"
                          >
                            <span className="truncate">JDIH Kab. Tamiang</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-emerald-400" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-3 bg-slate-900 rounded-xl w-fit border border-slate-800">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Memeriksa database BPK RI & JDIHN...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => handleSendMessage('Periksa draf dokumen ini terhadap standar legal drafting UU 12/2011')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 flex items-center gap-1 text-[11px]"
            >
              <span>🔍 Uji UU 12/2011</span>
            </button>
            <button
              onClick={() => handleSendMessage('Cari aturan BPK RI tentang pajak daerah, retribusi, dan UU HKPD 1/2022')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 flex items-center gap-1 text-[11px]"
            >
              <span>🏛️ Standar BPK RI</span>
            </button>
            <button
              onClick={() => handleSendMessage('Cek apakah ada dasar hukum di konsideran Mengingat yang sudah dicabut?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 flex items-center gap-1 text-[11px]"
            >
              <span>⚠️ Cek UU Kedaluwarsa</span>
            </button>
            <button
              onClick={() => handleSendMessage('Bagaimana kedudukan UU No. 11 Tahun 2006 (UUPA) dalam konsideran peraturan di Aceh Tamiang?')}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 flex items-center gap-1 text-[11px]"
            >
              <span>📜 Rujukan UUPA Aceh</span>
            </button>
          </div>

          {/* Input Box Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 rounded-b-2xl"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik pertanyaan hukum atau instruksi cek layar..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-2.5 h-auto shrink-0 shadow-lg shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {/* Direct Search External Links Row */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" />
              <span>Portal Resmi:</span>
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://peraturan.bpk.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline"
              >
                peraturan.bpk.go.id ↗
              </a>
              <span>•</span>
              <a
                href="https://jdihn.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                jdihn.go.id ↗
              </a>
              <span>•</span>
              <a
                href="https://jdih.acehtamiangkab.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                jdih.acehtamiangkab.go.id ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
