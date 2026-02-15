import React, { useState } from 'react';
import { PHYSICS_TOPICS } from '../../data/physicsData';
import type { PhysicsTopic } from '../../data/physicsData';
import { X, BookOpen, Atom, Globe, Zap, Infinity, ChevronRight, Info, Dna } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface PhysicsAcademyProps {
    onClose: () => void;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    // Split by $ but keep the $ as part of the match
    const parts = text.split(/(\$.*?\$)/g);

    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('$') && part.endsWith('$')) {
                    const math = part.slice(1, -1);
                    return <InlineMath key={i} math={math} />;
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

export const PhysicsAcademy: React.FC<PhysicsAcademyProps> = ({ onClose }) => {
    const [selectedTopicId, setSelectedTopicId] = useState<string>(PHYSICS_TOPICS[0].id);

    const selectedTopic: PhysicsTopic = PHYSICS_TOPICS.find(t => t.id === selectedTopicId) || PHYSICS_TOPICS[0];

    const getIcon = (category: string) => {
        switch (category) {
            case 'Relativity': return <Zap className="w-5 h-5" />;
            case 'Quantum': return <Atom className="w-5 h-5" />;
            case 'Classical': return <Globe className="w-5 h-5" />;
            case 'Cosmology': return <Infinity className="w-5 h-5" />;
            case 'Stellar': return <Globe className="w-5 h-5 rotate-12 text-orange-400" />;
            case 'Astrobiology': return <Dna className="w-5 h-5 text-emerald-400" />;
            default: return <BookOpen className="w-5 h-5" />;
        }
    };

    return (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0a0a1a]/90 border border-blue-500/30 w-[90%] h-[80%] max-w-5xl rounded-2xl flex overflow-hidden shadow-[0_0_50px_rgba(30,58,138,0.3)] animate-slide-up">

                {/* Sidebar */}
                <div className="w-72 border-r border-blue-500/20 bg-blue-900/10 flex flex-col">
                    <div className="p-6 border-b border-blue-500/20">
                        <div className="flex items-center gap-2 text-blue-400 mb-1">
                            <BookOpen className="w-6 h-6" />
                            <span className="text-xs font-bold uppercase tracking-widest">Educational Hub</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Cosmos Academy</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                        {['Classical', 'Relativity', 'Stellar', 'Astrobiology', 'Quantum', 'Cosmology'].map((cat) => {
                            const topicsInCat = PHYSICS_TOPICS.filter(t => t.category === cat);
                            if (topicsInCat.length === 0) return null;

                            return (
                                <div key={cat} className="space-y-1">
                                    <h3 className="px-3 text-[10px] font-bold text-blue-500/60 uppercase tracking-widest mb-1">{cat}</h3>
                                    {topicsInCat.map((topic) => (
                                        <button
                                            key={topic.id}
                                            onClick={() => setSelectedTopicId(topic.id)}
                                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group
                                                ${selectedTopicId === topic.id
                                                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-900/20'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                                        >
                                            <div className={`${selectedTopicId === topic.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`}>
                                                {getIcon(topic.category)}
                                            </div>
                                            <span className="font-medium text-xs tracking-wide truncate">{topic.title}</span>
                                            {selectedTopicId === topic.id && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 bg-black/30 border-t border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">Version 1.0 Alpha</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-transparent to-blue-900/10 overflow-hidden">
                    <div className="p-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-12 pb-12 custom-scrollbar">
                        <div className="animate-fade-in-delayed">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold uppercase tracking-widest border category-badge-${selectedTopic.category}`}>
                                    {selectedTopic.category}
                                </span>
                            </div>

                            <h1 className="text-5xl font-black text-white mb-6 tracking-tighter">
                                {selectedTopic.title}
                            </h1>

                            <div className="p-6 bg-blue-400/5 border-l-4 border-blue-500 rounded-r-xl mb-10">
                                <p className="text-xl text-blue-100 font-medium leading-relaxed italic">
                                    "<FormattedText text={selectedTopic.description} />"
                                </p>
                            </div>

                            <div className="space-y-6">
                                {selectedTopic.details.map((paragraph, idx) => (
                                    <p key={idx} className="text-gray-300 leading-relaxed text-lg font-light">
                                        <FormattedText text={paragraph} />
                                    </p>
                                ))}
                            </div>

                            {/* Formulas Section */}
                            {selectedTopic.formulas && selectedTopic.formulas.length > 0 && (
                                <div className="mt-12 space-y-4">
                                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Technical Formulas</h3>
                                    <div className="space-y-4">
                                        {selectedTopic.formulas.map((formula, idx) => (
                                            <div key={idx} className="formula-block group hover:border-blue-400/60 transition-colors">
                                                <div className="formula-label">{formula.label}</div>
                                                <div className="formula-latex overflow-x-auto pb-2">
                                                    <BlockMath math={formula.latex} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Info className="w-24 h-24" />
                                </div>
                                <h4 className="text-blue-400 font-bold uppercase tracking-tighter text-sm mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Did You Know?
                                </h4>
                                <p className="text-white text-lg font-medium relative z-10 leading-snug">
                                    {selectedTopic.funFact}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
