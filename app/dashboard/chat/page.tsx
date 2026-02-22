'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon } from 'lucide-react';

export default function AgentTerminal() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl fade-in relative">
            <div className="bg-black/50 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <Bot className="text-indigo-400 w-5 h-5" />
                    <h2 className="font-semibold text-gray-200 tracking-wide">Strategic Agent Terminal</h2>
                </div>
                <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">SYS_ONLINE</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth z-10 relative">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Bot className="w-16 h-16 mb-4 text-gray-400" />
                        <p className="text-gray-300">Agent Alpha is ready.</p>
                        <p className="text-sm text-gray-500 mt-2 max-w-sm">Ask about your current cycle, business timing, or request a Bazi reading.</p>
                    </div>
                )}

                {messages.map((message) => (
                    <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role !== 'user' && (
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-5 h-5 text-indigo-400" />
                            </div>
                        )}

                        <div className={`px-5 py-4 rounded-2xl max-id-80% ${message.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                            : 'bg-black border border-gray-800 text-gray-300 rounded-bl-none prose prose-invert max-w-none break-words shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                            }`}>
                            {/* If the model is using a tool, show a status indicator */}
                            {message.toolInvocations?.map((toolInvocation: any) => {
                                const toolCallId = toolInvocation.toolCallId;
                                const isResult = 'result' in toolInvocation || toolInvocation.state === 'result';

                                return (
                                    <div key={toolCallId} className="text-[10px] font-mono mb-3 py-1.5 px-3 bg-indigo-950/30 rounded-lg border border-indigo-500/30 flex items-center gap-2">
                                        {!isResult && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
                                        <span className={isResult ? "text-indigo-300" : "text-indigo-400"}>
                                            {isResult
                                                ? `✓ EXECUTED: ${toolInvocation.toolName.toUpperCase()}`
                                                : `RUNNING ALGORITHM: ${toolInvocation.toolName.toUpperCase()}...`}
                                        </span>
                                    </div>
                                );
                            })}

                            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                        </div>

                        {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1 border border-gray-700">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="px-5 py-4 rounded-2xl bg-black border border-gray-800 text-gray-500 rounded-bl-none flex space-x-2 items-center">
                            <span className="text-xs font-mono animate-pulse">THINKING...</span>
                            <div className="flex gap-1 ml-2">
                                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-black/50 border-t border-gray-800 z-10">
                <form onSubmit={handleSubmit} className="flex relative">
                    <input
                        className="w-full bg-black border border-gray-700 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm placeholder:text-gray-500"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Query the cycle (e.g., 'Should I launch my product next week?')"
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

            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none z-0 rounded-full" />
        </div>
    );
}
