'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Send, Bot, User as UserIcon, Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeftOpen, Pencil, Check } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Session {
    id: string;
    session_id: string;
    summary: string | null;
    created_at: string;
    updated_at: string;
}

function generateSessionId() {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function AgentTerminal() {
    const [sessionId, setSessionId] = useState(() => generateSessionId());
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
        api: '/api/chat',
        body: { sessionId },
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { ta, locale } = useLanguage();
    const t = ta.chat;
    const isZh = locale.startsWith('zh');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchSessions = useCallback(async () => {
        try {
            const res = await fetch('/api/chat/sessions');
            if (res.ok) setSessions(await res.json());
        } catch (e) {
            console.error('Failed to fetch sessions', e);
        } finally {
            setLoadingSessions(false);
        }
    }, []);

    useEffect(() => { fetchSessions(); }, [fetchSessions]);

    // Refresh sessions after AI response
    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
            fetchSessions();
        }
    }, [messages, fetchSessions]);

    const loadSession = async (sid: string) => {
        try {
            const res = await fetch(`/api/chat/sessions/${sid}`);
            if (res.ok) {
                const data = await res.json();
                setSessionId(sid);
                setMessages(data.messages || []);
            }
        } catch (e) {
            console.error('Failed to load session', e);
        }
    };

    const startNewChat = () => {
        setSessionId(generateSessionId());
        setMessages([]);
    };

    const deleteSession = async (sid: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await fetch('/api/chat/sessions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sid }),
            });
            setSessions(prev => prev.filter(s => s.session_id !== sid));
            if (sessionId === sid) startNewChat();
        } catch (e) {
            console.error('Failed to delete session', e);
        }
    };

    const renameSession = async (sid: string) => {
        if (!editingName.trim()) {
            setEditingId(null);
            return;
        }
        try {
            await fetch('/api/chat/sessions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sid, summary: editingName.trim() }),
            });
            setSessions(prev => prev.map(s =>
                s.session_id === sid ? { ...s, summary: editingName.trim() } : s
            ));
        } catch (e) {
            console.error('Failed to rename session', e);
        }
        setEditingId(null);
    };

    const startEditing = (s: Session, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(s.session_id);
        setEditingName(s.summary || '');
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-4 fade-in">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
                <div className="h-full flex flex-col bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden w-72">
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-400 tracking-wider">
                            {isZh ? '会话记录' : 'CONVERSATIONS'}
                        </h3>
                        <button
                            onClick={startNewChat}
                            className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-colors"
                            title={isZh ? '新对话' : 'New Chat'}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {loadingSessions ? (
                            <div className="text-center text-gray-500 text-xs py-4">
                                {isZh ? '加载中...' : 'Loading...'}
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center text-gray-600 text-xs py-8">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p>{isZh ? '暂无会话记录' : 'No conversations yet'}</p>
                            </div>
                        ) : (
                            sessions.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => loadSession(s.session_id)}
                                    role="button"
                                    tabIndex={0}
                                    className={`w-full text-left p-3 rounded-xl transition-all group flex items-start gap-2 cursor-pointer ${sessionId === s.session_id
                                        ? 'bg-indigo-500/15 border border-indigo-500/30 text-white'
                                        : 'hover:bg-gray-800/50 text-gray-400 border border-transparent'
                                        }`}
                                >
                                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-50" />
                                    <div className="flex-1 min-w-0">
                                        {editingId === s.session_id ? (
                                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                <input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && renameSession(s.session_id)}
                                                    className="text-sm bg-black border border-gray-700 rounded px-1.5 py-0.5 text-white w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); renameSession(s.session_id); }}
                                                    className="p-0.5 hover:bg-indigo-500/20 rounded"
                                                >
                                                    <Check className="w-3 h-3 text-indigo-400" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm truncate font-medium">
                                                    {s.summary || (isZh ? '未命名会话' : 'Untitled')}
                                                </p>
                                                <p className="text-[10px] text-gray-600 mt-0.5">
                                                    {s.updated_at?.slice(0, 10)}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    {editingId !== s.session_id && (
                                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0">
                                            <button
                                                onClick={(e) => startEditing(s, e)}
                                                className="p-1 hover:bg-gray-700 rounded transition-all"
                                            >
                                                <Pencil className="w-3 h-3 text-gray-400" />
                                            </button>
                                            <button
                                                onClick={(e) => deleteSession(s.session_id, e)}
                                                className="p-1 hover:bg-red-500/20 rounded transition-all"
                                            >
                                                <Trash2 className="w-3 h-3 text-red-400" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="bg-black/50 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400"
                        >
                            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                        </button>
                        <Bot className="text-indigo-400 w-5 h-5" />
                        <h2 className="font-semibold text-gray-200 tracking-wide">{t.title}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={startNewChat}
                            className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-1.5"
                        >
                            <Plus className="w-3 h-3" />
                            {isZh ? '新对话' : 'New Chat'}
                        </button>
                        <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{t.sysOnline}</div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto scroll-smooth z-10 relative">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <Bot className="w-16 h-16 mb-4 text-gray-400" />
                            <p className="text-gray-300">{t.agentReady}</p>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm">{t.agentHint}</p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`py-5 px-4 ${message.role === 'user' ? 'bg-transparent' : 'bg-gray-950/40'}`}
                        >
                            {message.role === 'user' ? (
                                /* User: right-aligned bubble */
                                <div className="max-w-3xl mx-auto flex justify-end">
                                    <div className="max-w-[75%] flex items-end gap-3">
                                        <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-sm leading-relaxed whitespace-pre-wrap text-[15px]">
                                            {message.content}
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <UserIcon className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* AI: full-width left-aligned */
                                <div className="max-w-3xl mx-auto flex gap-3">
                                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-gray-500 mb-2">RAYOY AI</div>

                                        {/* Tool invocations */}
                                        {message.toolInvocations?.map((toolInvocation: any) => {
                                            const toolCallId = toolInvocation.toolCallId;
                                            const isResult = 'result' in toolInvocation || toolInvocation.state === 'result';
                                            return (
                                                <div key={toolCallId} className="text-[11px] font-mono mb-2 py-1 px-2.5 bg-gray-800/50 rounded-md border border-gray-700/50 inline-flex items-center gap-1.5 mr-2">
                                                    {!isResult && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />}
                                                    <span className="text-gray-500">
                                                        {isResult ? '✓' : '⟳'} {toolInvocation.toolName}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        <div className="
                                            text-gray-300 leading-7 text-[15px]
                                            [&>*:first-child]:mt-0
                                            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-gray-100 [&_h1]:mt-6 [&_h1]:mb-3
                                            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-100 [&_h2]:mt-5 [&_h2]:mb-2
                                            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-200 [&_h3]:mt-4 [&_h3]:mb-2
                                            [&_p]:my-3 [&_p]:leading-7
                                            [&_strong]:text-white [&_strong]:font-semibold
                                            [&_em]:text-gray-400 [&_em]:italic
                                            [&_ul]:my-3 [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:list-disc
                                            [&_ol]:my-3 [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:list-decimal
                                            [&_li]:text-gray-300 [&_li]:leading-7 [&_li_p]:my-0
                                            [&_code]:text-emerald-400 [&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:font-mono
                                            [&_pre]:bg-gray-900 [&_pre]:border [&_pre]:border-gray-800 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0
                                            [&_blockquote]:border-l-2 [&_blockquote]:border-gray-700 [&_blockquote]:pl-4 [&_blockquote]:my-3 [&_blockquote]:text-gray-400 [&_blockquote]:italic
                                            [&_hr]:border-gray-800 [&_hr]:my-6
                                            [&_a]:text-indigo-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-indigo-300
                                            [&_table]:w-full [&_table]:my-3 [&_table]:text-sm
                                            [&_th]:text-left [&_th]:text-gray-400 [&_th]:font-semibold [&_th]:pb-2 [&_th]:border-b [&_th]:border-gray-800
                                            [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-gray-800/50
                                        ">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="py-6 px-4 bg-gray-950/40">
                            <div className="max-w-3xl mx-auto flex gap-4">
                                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-semibold text-gray-400 mb-1.5">RAYOY AI</div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <span className="text-sm animate-pulse">{t.thinking}</span>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-black/50 border-t border-gray-800 z-10">
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex relative">
                        <input
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm placeholder:text-gray-500"
                            value={input}
                            onChange={handleInputChange}
                            placeholder={t.placeholder}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-2 p-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none z-0 rounded-full" />
            </div>
        </div>
    );
}
