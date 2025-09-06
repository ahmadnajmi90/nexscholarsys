import React from 'react';
import { FileText, Target, Search, Lightbulb, CheckCircle, Brain, Database, Zap, RefreshCw } from 'lucide-react';

const WritingResearchStatement = () => {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    Beyond Keywords: How to Write a Research Interest Statement for Our Semantic Search AI
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Have you ever searched for a supervisor using broad terms like "biology" or "engineering," only to be flooded with hundreds of irrelevant results? Traditional keyword searching often fails to grasp the nuance of specialized academic research.
                </p>
                <p className="text-gray-700 mt-4">
                    At Nexscholar, we do things differently. Our platform is powered by a semantic search engine that thinks less like a dictionary and more like a knowledgeable colleague. It understands the meaning and context behind your research, not just the keywords.
                </p>
                <p className="text-gray-700 mt-2">
                    This guide will teach you how to "speak the AI's language"—how to describe your research interests in a way that leverages the full power of our system to find hyper-relevant supervisors, collaborators, and opportunities.
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* What is Semantic Search */}
                <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        What is Semantic Search? (And Why It's a Game-Changer)
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Imagine you're interested in using machine learning to study ancient texts. A keyword search might only find supervisors who list both "machine learning" and "ancient texts."
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Semantic search is smarter. It understands that a professor specializing in "computational linguistics," "digital humanities," or "natural language processing for historical data" is also a fantastic potential match, even if they don't use your exact phrasing.
                    </p>
                    <div className="bg-purple-100 rounded-lg p-4">
                        <p className="text-purple-800 text-sm">
                            <strong>💡 Our AI Advantage:</strong> Powered by advanced OpenAI embedding models, our system reads your profile for conceptual understanding. This allows it to connect you with researchers whose work is conceptually related to yours, opening up a world of possibilities you might have otherwise missed.
                        </p>
                    </div>
                </section>

                {/* How Our AI Builds Research DNA */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <Database className="w-6 h-6 text-blue-600" />
                        How Our AI Builds Your "Research DNA"
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        To find your perfect match, our AI doesn't just look at one field on your profile. Instead, it builds a comprehensive "Research DNA" or a digital fingerprint of your academic identity by combining several key pieces of information:
                    </p>

                    <div className="grid md:grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Target className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-blue-900">Structured Fields</h3>
                            </div>
                            <p className="text-gray-700 text-sm">
                                <strong>Most Important!</strong> This is the backbone of your profile. When you select your interests from our three-tier system (Field &gt; Area &gt; Niche Domain), you give our AI a precise, structured foundation to build upon.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200">
                            <div className="flex items-center gap-3 mb-3">
                                <FileText className="w-5 h-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Profile Bio</h3>
                            </div>
                            <p className="text-gray-700 text-sm">
                                The AI reads your bio to understand the narrative of your research journey and the story that connects your skills and interests.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Lightbulb className="w-5 h-5 text-purple-600" />
                                <h3 className="text-lg font-semibold text-purple-900">Position & Department</h3>
                            </div>
                            <p className="text-gray-700 text-sm">
                                This provides crucial context about your current work and academic environment.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Zap className="w-5 h-5 text-orange-600" />
                                <h3 className="text-lg font-semibold text-orange-900">Combined Intelligence</h3>
                            </div>
                            <p className="text-gray-700 text-sm">
                                The AI combines all this text into a rich, detailed summary before creating its vector embedding.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                            <strong>💡 Why This Matters:</strong> A complete profile is so powerful because it gives our AI the full context needed to make intelligent, nuanced matches.
                        </p>
                    </div>
                </section>

                {/* Practical Tips */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Practical Tips for a Powerful Research Statement
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Now, let's get practical. Here are four tips to make your research statement powerful and AI-friendly.
                    </p>

                    <div className="space-y-6">
                        {/* Tip 1 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-800 font-bold text-lg">1</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Maximize Your Structured Fields</h3>
                                    <p className="text-gray-700 mb-4">
                                        Don't just pick one broad field. The more specific you are here, the smarter our AI can be.
                                    </p>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-green-900 mb-2">✅ Do: Drill down to the Niche Domain level</h4>
                                        <p className="text-green-800 text-sm mb-3">Select multiple relevant domains if your work is interdisciplinary.</p>
                                        <div className="bg-green-100 rounded-lg p-3">
                                            <p className="text-green-900 text-xs font-medium mb-2">Example:</p>
                                            <p className="text-green-800 text-sm">
                                                Instead of just selecting "Biological Sciences," choose "Biological Sciences &gt; Genetics &gt; Gene Editing" and "Biological Sciences &gt; Molecular Biology &gt; CRISPR Technology."
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tip 2 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-800 font-bold text-lg">2</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Use Natural, Descriptive Language</h3>
                                    <p className="text-gray-700 mb-4">
                                        Write your bio and research summary in full, natural sentences. This provides the rich context our AI thrives on.
                                    </p>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">❌ Instead of:</h4>
                                        <p className="text-blue-800 text-sm italic mb-3">"Machine Learning, NLP, Python."</p>
                                        <h4 className="font-semibold text-blue-900 mb-2">✅ Try This:</h4>
                                        <p className="text-blue-800 text-sm">
                                            "My research focuses on applying machine learning techniques, specifically in Natural Language Processing, to analyze sentiment in historical texts. I primarily use Python and its associated libraries for my work."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tip 3 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-800 font-bold text-lg">3</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect the Dots in Your Bio</h3>
                                    <p className="text-gray-700 mb-4">
                                        Explain the relationship between your different skills and interests. This helps the AI understand the unique interconnection of your work.
                                    </p>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-purple-900 mb-2">Example:</h4>
                                        <p className="text-purple-800 text-sm">
                                            "I leverage my background in bioinformatics and skills in statistical analysis to explore new methods for drug discovery within the field of oncology."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tip 4 */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-800 font-bold text-lg">4</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Keep It Fresh and Up-to-Date</h3>
                                    <p className="text-gray-700 mb-4">
                                        As your research evolves, so should your profile. An updated profile ensures your matches from our AI are always relevant to your current focus and future aspirations.
                                    </p>
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <p className="text-orange-800 text-sm">
                                            <strong>💡 Remember:</strong> Regular profile updates = Better AI matches over time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Before & After Comparison */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <RefreshCw className="w-6 h-6 text-indigo-600" />
                        Putting It All Together: A Before & After Example
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Here's how these tips can transform a profile from "good" to "great" for our AI.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Aspect
                                    </th>
                                    <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-red-700">
                                        ❌ Before (Weak Profile)
                                    </th>
                                    <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-green-700">
                                        ✅ After (Powerful Profile)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                                        Structured Fields
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-red-800">
                                        "Computer Science"
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-green-800">
                                        "Computer Science &gt; Artificial Intelligence &gt; Natural Language Processing"<br />
                                        "Linguistics &gt; Computational Linguistics &gt; Sentiment Analysis"
                                    </td>
                                </tr>
                                <tr className="bg-gray-25">
                                    <td className="border border-gray-200 px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">
                                        Bio
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-red-800 italic">
                                        "Interested in AI and linguistics."
                                    </td>
                                    <td className="border border-gray-200 px-6 py-4 text-sm text-green-800">
                                        "I am a postgraduate researcher specializing in Natural Language Processing. My current work involves developing novel algorithms to perform sentiment analysis on multilingual social media data from Malaysia, bridging the gap between computational linguistics and modern AI."
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm">
                            <strong>🎯 Result:</strong> The "After" profile will receive far more accurate and insightful matches from supervisors and potential collaborators.
                        </p>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">
                        Ready to Find Your Perfect Match?
                    </h2>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                        A detailed, contextual, and well-structured profile is the key to unlocking the best connections on Nexscholar.
                    </p>
                    <p className="text-blue-200 mb-6">
                        Take a few minutes to refine your research interests and bio today. You'll be amazed at the quality of the connections that our AI can discover for you.
                    </p>
                    <button
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
                        onClick={() => window.location.href = '/role'}
                    >
                        <Target className="w-5 h-5" />
                        Identify your profile health
                    </button>
                </section>
            </div>
        </div>
    );
};

export default WritingResearchStatement;
