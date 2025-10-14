import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion';
import { Timeline, TimelineItem } from '@/Components/ui/timeline';
import { Spotlight } from '@/Components/ui/spotlight';
import { BentoGrid, BentoCard } from '@/Components/ui/bento-grid';
import { IconCloud } from '@/Components/ui/icon-cloud';
import { AnimatedGradientText } from '@/Components/ui/animated-gradient-text';
import {
    User,
    Users,
    BookOpen,
    Briefcase,
    TrendingUp,
    Settings,
    ArrowRight,
    CheckCircle,
    Star,
    Zap,
    Target,
    Heart,
    Share2,
    Bookmark,
    FileText,
    Calendar,
    BarChart3,
    HelpCircle,
    Home
} from 'lucide-react';

const tutorialSections = [
    {
        id: 'welcome',
        title: 'Welcome to Nexscholar',
        icon: <Star className="w-6 h-6" />,
        description: 'Your comprehensive platform for academic networking and research collaboration',
        content: {
            overview: [
                'Nexscholar is designed specifically for researchers, academics, and students who want to accelerate their academic journey through meaningful connections and collaboration.',
                'Whether you\'re looking for research partners, seeking supervision, or wanting to share your work with the academic community, Nexscholar provides the tools and network to help you succeed.'
            ],
            features: [
                { icon: <Users className="w-5 h-5" />, text: 'Connect with researchers worldwide' },
                { icon: <Briefcase className="w-5 h-5" />, text: 'Access funding opportunities' },
                { icon: <BookOpen className="w-5 h-5" />, text: 'Share and discover research' },
                { icon: <Zap className="w-5 h-5" />, text: 'AI-powered recommendations' }
            ]
        }
    },
    {
        id: 'profile',
        title: 'Building Your Academic Profile',
        icon: <User className="w-6 h-6" />,
        description: 'Create a compelling profile that showcases your expertise and research interests',
        content: {
            steps: [
                {
                    title: 'Choose Your Role',
                    description: 'Select from Academician, Postgraduate, Undergraduate, or Industry Professional to customize your experience.',
                    details: 'Each role type unlocks different features and networking opportunities tailored to your academic level and goals.'
                },
                {
                    title: 'Add Your Information',
                    description: 'Include your research interests, publications, current projects, and academic background.',
                    details: 'The more complete your profile, the better our AI can match you with relevant collaborators and opportunities.'
                },
                {
                    title: 'AI Profile Generation',
                    description: 'Use our advanced AI to automatically populate your profile from various sources.',
                    details: 'Upload your CV, connect your Google Scholar profile, or provide URLs to research papers. Our AI will extract and organize the information for you.'
                }
            ],
            tips: [
                'Keep your research interests updated as they evolve',
                'Link your Google Scholar profile for automatic publication tracking',
                'Add specific keywords that describe your expertise',
                'Include both current and past research projects'
            ]
        }
    },
    {
        id: 'content',
        title: 'Exploring & Sharing Content',
        icon: <Share2 className="w-6 h-6" />,
        description: 'Discover research, share your work, and engage with the academic community',
        content: {
            features: [
                {
                    title: 'Academic Posts',
                    description: 'Share research findings, conference updates, and academic news with your network.',
                    icon: <FileText className="w-5 h-5" />
                },
                {
                    title: 'Research Projects',
                    description: 'Post about ongoing research, seek collaborators, or share completed work.',
                    icon: <Briefcase className="w-5 h-5" />
                },
                {
                    title: 'Events & Conferences',
                    description: 'Discover and share information about academic events, workshops, and conferences.',
                    icon: <Calendar className="w-5 h-5" />
                },
                {
                    title: 'Funding Hub',
                    description: 'Access grants, scholarships, and funding opportunities in one centralized location.',
                    icon: <TrendingUp className="w-5 h-5" />
                }
            ],
            engagement: [
                { icon: <Heart className="w-4 h-4" />, text: 'Like posts to show appreciation' },
                { icon: <Bookmark className="w-4 h-4" />, text: 'Bookmark important content' },
                { icon: <Share2 className="w-4 h-4" />, text: 'Share with your network' },
                { icon: <CheckCircle className="w-4 h-4" />, text: 'Follow researchers you admire' }
            ]
        }
    },
    {
        id: 'collaboration',
        title: 'Collaboration Tools',
        icon: <Users className="w-6 h-6" />,
        description: 'Powerful tools for managing research projects and team collaboration',
        content: {
            tools: [
                {
                    title: 'NexLab',
                    description: 'Organize your research with flexible project management tools.',
                    features: ['Kanban boards', 'List views', 'Calendar integration', 'Timeline tracking']
                },
                {
                    title: 'Task Management',
                    description: 'Break down complex research projects into manageable tasks.',
                    features: ['Task assignment', 'Progress tracking', 'Deadline management', 'File attachments']
                },
                {
                    title: 'Real-time Collaboration',
                    description: 'Work together seamlessly with instant updates and notifications.',
                    features: ['Live updates', 'Comment threads', 'File sharing', 'Activity feeds']
                }
            ],
            workflow: [
                'Create a new project or join an existing one',
                'Add team members and assign roles',
                'Break down research into tasks and milestones',
                'Track progress with visual dashboards',
                'Collaborate in real-time with instant updates'
            ]
        }
    },
    {
        id: 'networking',
        title: 'Networking & AI Matching',
        icon: <Target className="w-6 h-6" />,
        description: 'Find the perfect collaborators with intelligent matching algorithms',
        content: {
            matching: [
                {
                    title: 'Semantic Search',
                    description: 'Find researchers based on research interests, methodologies, and expertise areas.',
                    icon: <Target className="w-5 h-5" />
                },
                {
                    title: 'AI Recommendations',
                    description: 'Receive personalized suggestions for potential collaborators and supervisors.',
                    icon: <Zap className="w-5 h-5" />
                },
                {
                    title: 'Connection Requests',
                    description: 'Send and receive connection requests with personalized messages.',
                    icon: <Users className="w-5 h-5" />
                }
            ],
            insights: [
                'AI analyzes research compatibility and collaboration potential',
                'Detailed explanations of why matches are recommended',
                'Connection strength indicators based on shared interests',
                'Regular updates on new potential collaborators'
            ],
            organization: [
                'Tag connections (e.g., "Students", "Collaborators", "Supervisors")',
                'Create custom tags for different relationship types',
                'Organize your network with folders and categories',
                'Search and filter your connections easily'
            ]
        }
    },
    {
        id: 'analytics',
        title: 'Analytics & Support',
        icon: <BarChart3 className="w-6 h-6" />,
        description: 'Track your impact and get help when you need it',
        content: {
            dashboard: [
                {
                    title: 'Platform Analytics',
                    description: 'Comprehensive insights into platform usage and trends.',
                    icon: <BarChart3 className="w-5 h-5" />
                },
                {
                    title: 'Personal Metrics',
                    description: 'Track your research impact, connections, and engagement.',
                    icon: <TrendingUp className="w-5 h-5" />
                },
                {
                    title: 'Network Growth',
                    description: 'Monitor your network expansion and collaboration activity.',
                    icon: <Users className="w-5 h-5" />
                }
            ],
            recommendations: [
                'Your activity patterns help improve AI matching',
                'Engagement data enhances personalized recommendations',
                'Network analytics inform collaboration opportunities',
                'Research interests tracking improves content suggestions'
            ],
            support: [
                'Access this tutorial anytime from the help menu',
                'Contact support for technical assistance',
                'Browse FAQs for common questions',
                'Join community forums for peer support'
            ]
        }
    }
];

const cloudIcons = [
    "user", "users", "book-open", "briefcase", "trending-up", "settings",
    "star", "zap", "target", "heart", "share2", "bookmark", "file-text",
    "calendar", "bar-chart-3", "help-circle", "home", "search", "filter",
    "bell", "message-circle", "thumbs-up", "eye", "download", "upload"
];

export default function TutorialIndex() {
    return (
        <>
            <Head title="How to Use Nexscholar - Tutorial Guide" />

            <div className="min-h-screen">
                <div className="mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-4 lg:py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Spotlight className="mb-6">
                            <AnimatedGradientText className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                                How to Use Nexscholar
                            </AnimatedGradientText>
                        </Spotlight>
                        <p className="text-base text-gray-600 max-w-3xl mx-auto">
                            This comprehensive guide will help you understand Nexscholar's core features and make the most of our platform for your academic journey.
                        </p>
                    </div>

                    {/* Navigation Breadcrumb */}
                    <div className="flex items-center space-x-2 mb-8 text-sm text-gray-600">
                        <Link href="/dashboard" className="hover:text-indigo-600 flex items-center">
                            <Home className="w-4 h-4 mr-1" />
                            Dashboard
                        </Link>
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-indigo-600 font-medium">Tutorial Guide</span>
                    </div>

                    {/* Main Content */}
                    <ScrollArea className="h-[calc(72vh-300px)] md:h-[calc(90vh-300px)] lg:h-[calc(90vh-300px)]">
                        <div className="space-y-8">
                            {tutorialSections.map((section, index) => (
                                <Card key={section.id} className="overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                {section.icon}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg md:text-lg lg:text-xl">{section.title}</CardTitle>
                                                <CardDescription className="text-sm md:text-sm lg:text-lg">{section.description}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6">
                                        {section.id === 'welcome' && (
                                            <div className="space-y-6">
                                                {section.content.overview.map((paragraph, idx) => (
                                                    <p key={idx} className="text-gray-700 leading-relaxed">{paragraph}</p>
                                                ))}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                                    {section.content.features.map((feature, idx) => (
                                                        <div key={idx} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                                            <div className="text-indigo-600">{feature.icon}</div>
                                                            <span className="text-gray-700">{feature.text}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {section.id === 'profile' && (
                                            <div className="space-y-6">
                                                <div className="relative">
                                                    {section.content.steps.map((step, idx) => (
                                                        <TimelineItem 
                                                            key={idx} 
                                                            className={idx === section.content.steps.length - 1 ? "pb-0" : ""}
                                                            isLast={idx === section.content.steps.length - 1}
                                                        >
                                                            <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                                                            <p className="text-gray-700 mb-2">{step.description}</p>
                                                            <p className="text-gray-600 text-sm">{step.details}</p>
                                                        </TimelineItem>
                                                    ))}
                                                </div>

                                                <div className="mt-8">
                                                    <h4 className="font-semibold text-lg mb-4">💡 Pro Tips for a Strong Profile</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {section.content.tips.map((tip, idx) => (
                                                            <div key={idx} className="flex items-start space-x-2">
                                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                                <span className="text-gray-700 text-sm">{tip}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section.id === 'content' && (
                                            <div className="space-y-6">
                                                <BentoGrid className="md:grid-cols-2 lg:grid-cols-4">
                                                    {section.content.features.map((feature, idx) => (
                                                        <BentoCard
                                                            key={idx}
                                                            name={feature.title}
                                                            className="p-4"
                                                            background={<div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />}
                                                        >
                                                            <div className="flex flex-col items-center text-center space-y-2">
                                                                <div className="text-indigo-600">{feature.icon}</div>
                                                                <h4 className="font-medium text-sm">{feature.title}</h4>
                                                                <p className="text-xs text-gray-600">{feature.description}</p>
                                                            </div>
                                                        </BentoCard>
                                                    ))}
                                                </BentoGrid>

                                                <div className="mt-8">
                                                    <h4 className="font-semibold text-lg mb-4">🤝 Engage with Content</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {section.content.engagement.map((item, idx) => (
                                                            <div key={idx} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                                                <div className="text-indigo-600 mb-2">{item.icon}</div>
                                                                <span className="text-xs text-gray-700">{item.text}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section.id === 'collaboration' && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {section.content.tools.map((tool, idx) => (
                                                        <Card key={idx}>
                                                            <CardHeader>
                                                                <CardTitle className="text-lg">{tool.title}</CardTitle>
                                                                <CardDescription>{tool.description}</CardDescription>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <ul className="space-y-2">
                                                                    {tool.features.map((feature, fidx) => (
                                                                        <li key={fidx} className="flex items-center text-sm">
                                                                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                                                            {feature}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>

                                                <div className="mt-8">
                                                    <h4 className="font-semibold text-lg mb-4">🚀 Typical Workflow</h4>
                                                    <div className="space-y-3">
                                                        {section.content.workflow.map((step, idx) => (
                                                            <div key={idx} className="flex items-start space-x-3">
                                                                <Badge variant="outline" className="mt-0.5">{idx + 1}</Badge>
                                                                <span className="text-gray-700">{step}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section.id === 'networking' && (
                                            <div className="space-y-8">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {section.content.matching.map((item, idx) => (
                                                        <Card key={idx} className="text-center">
                                                            <CardContent className="p-6">
                                                                <div className="text-indigo-600 mb-3 mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                    {item.icon}
                                                                </div>
                                                                <h4 className="font-semibold mb-2">{item.title}</h4>
                                                                <p className="text-sm text-gray-600">{item.description}</p>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>

                                                <Accordion type="single" collapsible className="w-full">
                                                    <AccordionItem value="insights">
                                                        <AccordionTrigger className="text-lg font-semibold">
                                                            🧠 AI-Powered Insights
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="space-y-3 pt-2">
                                                                {section.content.insights.map((insight, idx) => (
                                                                    <div key={idx} className="flex items-start space-x-3">
                                                                        <Zap className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-gray-700">{insight}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="organization">
                                                        <AccordionTrigger className="text-lg font-semibold">
                                                            📁 Organize Your Network
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="space-y-3 pt-2">
                                                                {section.content.organization.map((item, idx) => (
                                                                    <div key={idx} className="flex items-start space-x-3">
                                                                        <Bookmark className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-gray-700">{item}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            </div>
                                        )}

                                        {section.id === 'analytics' && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {section.content.dashboard.map((item, idx) => (
                                                        <Card key={idx} className="text-center">
                                                            <CardContent className="p-6">
                                                                <div className="text-indigo-600 mb-3 mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                    {item.icon}
                                                                </div>
                                                                <h4 className="font-semibold mb-2">{item.title}</h4>
                                                                <p className="text-sm text-gray-600">{item.description}</p>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>

                                                <Separator className="my-8" />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="font-semibold text-lg mb-4">🎯 Better Recommendations</h4>
                                                        <div className="space-y-3">
                                                            {section.content.recommendations.map((rec, idx) => (
                                                                <div key={idx} className="flex items-start space-x-3">
                                                                    <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-gray-700 text-sm">{rec}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-lg mb-4">🆘 Get Help</h4>
                                                        <div className="space-y-3">
                                                            {section.content.support.map((item, idx) => (
                                                                <div key={idx} className="flex items-start space-x-3">
                                                                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-gray-700 text-sm">{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                            <div className="text-left">
                                <p className="text-gray-600 mb-2">
                                    <strong>💡 Remember:</strong> You can return to this tutorial anytime via the Tutorial Guide in your Settings menu.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Need more help? Contact our support team or check out our FAQ section.
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row md:justify-end lg:flex-row gap-4 w-full lg:w-auto">
                                <Button asChild className="w-auto md:w-auto lg:w-auto">
                                    <Link href="/dashboard" className="flex items-center justify-center">
                                        <Home className="w-4 h-4 mr-2" />
                                        <span>Back to Dashboard</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild className="w-auto md:w-auto lg:w-auto">
                                    <Link href="/role" className="flex items-center justify-center">
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span>Profile Information Settings</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
