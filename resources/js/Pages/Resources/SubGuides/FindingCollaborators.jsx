import React from 'react';
import { Users, Search, MessageSquare, Target, CheckCircle, Lightbulb, Zap } from 'lucide-react';

const FindingCollaborators = () => {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    A Researcher's Guide to Finding Collaborators
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Great research is rarely a solo endeavor. Finding the right collaborator—someone whose expertise complements your own and who shares your vision—can be the catalyst for a breakthrough paper or a grant-winning project. But discovering these ideal partners, especially outside your immediate institution or network, has always been a challenge.
                </p>
                <p className="text-gray-700 mt-4">
                    Until now. Welcome to Nexscholar's Collaborator Search, a feature within our AI Matching suite designed exclusively for academicians. This guide will walk you through how to use this powerful tool to find your next great research partner, moving beyond simple keyword searches to discover true conceptual alignment.
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
                {/* Why Use AI */}
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Why Use AI for Collaboration Matching?</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        Traditional databases match you based on keywords. We match you based on ideas. Our semantic search engine, powered by OpenAI embeddings, understands the nuance and context of your research.
                    </p>
                    <div className="bg-blue-100 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                            <strong>💡 The Game-Changer:</strong> But the true game-changer for academicians is our publication-enhanced insights. Our AI doesn't just tell you who is a match; it tells you why, by analyzing their actual published work. It will reference specific papers and research themes from their publication history that align with your search, giving you a powerful, evidence-based starting point for a conversation.
                        </p>
                    </div>
                </section>

                {/* Step-by-Step Guide */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3 leading-tight">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        Finding Your Next Collaborator: A Step-by-Step Guide
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Ready to build your dream team? Here's how to use the Collaborator Search.
                    </p>

                    {/* Hero Image Placeholder */}
                    <div className="bg-gray-100 rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6 lg:mb-8">
                        <img
                            src="/images/resources/2.3.1.png"
                            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                        />
                    </div>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-800 font-bold text-lg">1</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Navigate to AI Matching</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        From your main dashboard, click on the "AI Matching" section. As an academician, your interface is unique—you will see a tab-based system. Select the "Collaborators" tab to begin your search.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-green-800 font-bold text-lg">2</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Describe Your Ideal Partner</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        In the search bar, describe the expertise or research topic you're looking for. For the best results, be descriptive and use natural language.
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                                        <h4 className="font-semibold text-gray-900 mb-2">❌ Instead of:</h4>
                                        <p className="text-gray-700 mb-3">"Data Science"</p>
                                        <h4 className="font-semibold text-gray-900 mb-2">✅ Try This:</h4>
                                        <p className="text-gray-700">"A collaborator with experience in applying machine learning models to longitudinal public health data from Southeast Asia."</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-800 font-bold text-lg">3</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Apply Smart Filters</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Use the available filters to narrow down the results. You can filter potential collaborators by their University Affiliation or their specific Research Expertise/Field to home in on the perfect match.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <span className="text-orange-800 font-bold text-lg">4</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Decode the AI Insights</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        This is where Nexscholar truly shines. For each match, you'll see a personalized insight generated by GPT-4o. Pay close attention to these insights, as they will often highlight specific publications that align with your query.
                                    </p>
                                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                                        <p className="text-green-800 text-sm italic">
                                            "Dr. Chen is a strong potential collaborator. Their recent publication, 'Predictive Modeling of Dengue Outbreaks in Urban Environments,' directly aligns with your interest in public health data. Their expertise in time-series analysis would be a valuable asset."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <span className="text-red-800 font-bold text-lg">5</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect and Collaborate</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Found a promising match? Don't hesitate. Send a connection request directly from the results page. Mention the AI insight in your introductory message—it's a great, data-driven way to start a meaningful conversation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pro-Tips */}
                <section className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Lightbulb className="w-6 h-6 text-amber-600" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">Pro-Tips for the Best Results</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Profile is Your Magnet</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Remember, this works both ways. To attract high-quality collaborators, ensure your own profile is complete and your Google Scholar account is synced. A detailed profile with a full publication list makes you a more discoverable and attractive partner.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Search for Complementary Skills</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Don't just look for a mirror image of your own expertise. The best collaborations often come from interdisciplinary teams. Use the search to find researchers with skills that complement your own.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Organize Your Network</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Once you connect, use the tagging system in "My Network" to label potential collaborators for different projects.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">Build Your Next Breakthrough Team</h2>
                    <p className="text-green-100 mb-6 leading-relaxed">
                        Nexscholar's Collaborator Search is more than a search engine; it's an intelligent discovery tool designed to accelerate research and foster innovation. Your next great research partner is just a search away.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default FindingCollaborators;
