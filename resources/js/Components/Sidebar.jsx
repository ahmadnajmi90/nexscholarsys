import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Users,
    BookOpen,
    Search,
    Handshake,
    Building2,
    BarChart3,
    Calendar,
    Vote,
    User,
    Settings,
    BookOpenCheck,
    BookOpenText,
    Bot,
    Bookmark,
    Shield,
    Database,
    LogOut,
    GraduationCap,
    UserCheck,
    Building,
    Home,
    DollarSign,
    FolderOpen,
    User2,
    Sparkles,
    BookUser,
    Library,
    ChevronLeft,
    MessageSquare,
} from 'lucide-react';
import { LayoutGrid } from 'lucide-react';
import useRoles from '@/Hooks/useRoles';

const Sidebar = ({ activeSection, isOpen, onToggleSidebar }) => {
    const { isAdmin, isPostgraduate, isUndergraduate, isFacultyAdmin, isAcademician, canPostEvents, canPostProjects, canPostGrants, canCreatePosts, canCreateFacultyAdmin, canAssignAbilities } = useRoles();
    const { auth, pendingRequestCount } = usePage().props;
    const user = auth.user;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05 // The delay between each child animating in
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const renderQuickAccessItems = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <>
                        <motion.div variants={itemVariants}>
                            <Link href={route('dashboard')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Home className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Dashboard</span>
                            </Link>
                        </motion.div>
                        {isAdmin && (
                            <>
                                <motion.div variants={itemVariants}>
                                    <Link href={route('roles.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                        <Settings className="text-gray-600 mb-2 w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-700 truncate w-full">Roles & Permissions</span>
                                    </Link>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Link href={route('faculty-admins.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                        <Building2 className="text-gray-600 mb-2 w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-700 truncate w-full">Faculty Admin</span>
                                    </Link>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Link href={route('admin.profiles.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                        <Users className="text-gray-600 mb-2 w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-700 truncate w-full">Profile Management</span>
                                    </Link>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Link href={route('admin.data-management.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                        <Database className="text-gray-600 mb-2 w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-700 truncate w-full">Data Management</span>
                                    </Link>
                                </motion.div>
                            </>
                        )}
                        {isFacultyAdmin && (
                            <>
                                <motion.div variants={itemVariants}>
                                    <Link href={route('faculty-admin.academicians')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                        <Shield className="text-gray-600 mb-2 w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-700 truncate w-full">Verify Academicians</span>
                                    </Link>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Link href={route('faculty-admin.directory')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                        <Users className="text-gray-600 mb-2 w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-700 truncate w-full">Academicians Directory</span>
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </>
                );

            case 'features':
                return (
                    <>
                        <motion.div variants={itemVariants}>
                            <Link href={route('ai.matching.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Bot className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">AI Matching</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href={route('postgraduate-recommendations.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Sparkles className="w-5 h-5 text-gray-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Postgraduate Recommendations</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href={route('bookmarks.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Bookmark className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">My Bookmarks</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href={route('project-hub.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <LayoutGrid className="w-5 h-5 text-gray-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Scholar Lab</span>
                            </Link>
                        </motion.div>
                    </>
                );

            case 'networking':
                return (
                    <>
                        <motion.div variants={itemVariants}>
                            <Link href={route('connections.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center relative">
                                <Users className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">My Network</span>
                                {pendingRequestCount > 0 && (
                                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                        {pendingRequestCount}
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href={route('messaging.inbox')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <MessageSquare className="w-5 h-5 text-gray-600 mb-2" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Messages</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href="/postgraduates" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <GraduationCap className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Postgraduate</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href="/undergraduates" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <BookUser className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Undergraduate</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href="/academicians" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Library className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Academician</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href="/universities" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Building className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">University</span>
                            </Link>
                        </motion.div>
                    </>
                );

            case 'content':
                return (
                    <>
                        {/* Grant Management */}
                        <motion.div variants={itemVariants}>
                            <Link href="/funding" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <DollarSign className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">View Funding</span>
                            </Link>
                        </motion.div>
                        {canPostGrants && (
                            <motion.div variants={itemVariants}>
                                <Link href={route('funding.admin.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                    <DollarSign className="text-gray-600 mb-2 w-5 h-5" />
                                    <span className="text-sm font-medium text-gray-700 truncate w-full">Manage Funding</span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Project Management */}
                        <motion.div variants={itemVariants}>
                            <Link href="/projects" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <FolderOpen className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">View Project</span>
                            </Link>
                        </motion.div>
                        {canPostProjects && (
                            <motion.div variants={itemVariants}>
                                <Link href={route('post-projects.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                    <FolderOpen className="text-gray-600 mb-2 w-5 h-5" />
                                    <span className="text-sm font-medium text-gray-700 truncate w-full">Manage Projects</span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Event Management */}
                        <motion.div variants={itemVariants}>
                            <Link href="/events" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Calendar className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">View Event</span>
                            </Link>
                        </motion.div>
                        {canPostEvents && (
                            <motion.div variants={itemVariants}>
                                <Link href={route('post-events.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                    <Calendar className="text-gray-600 mb-2 w-5 h-5" />
                                    <span className="text-sm font-medium text-gray-700 truncate w-full">Manage Event</span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Post Management */}
                        <motion.div variants={itemVariants}>
                            <Link href="/posts" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <FileText className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">View Post</span>
                            </Link>
                        </motion.div>
                        {canCreatePosts && (
                            <motion.div variants={itemVariants}>
                                <Link href={route('create-posts.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                    <FileText className="text-gray-600 mb-2 w-5 h-5" />
                                    <span className="text-sm font-medium text-gray-700 truncate w-full">Manage Post</span>
                                </Link>
                            </motion.div>
                        )}
                    </>
                );

            case 'settings':
                return (
                    <>
                        <motion.div variants={itemVariants}>
                            <Link href={route('profile.edit')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <Settings className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">General Account Setting</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href={route('role.edit')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <User2 className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Personal Information</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href={route('tutorial.index')} className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center">
                                <BookOpenCheck className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Tutorial Guide</span>
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link href={route('logout')} method="post" as="button" className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-50 shadow-lg p-3 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-1 flex flex-col items-center justify-center text-center w-full">
                                <LogOut className="text-gray-600 mb-2 w-5 h-5" />
                                <span className="text-sm font-medium text-gray-700 truncate w-full">Log Out</span>
                            </Link>
                        </motion.div>
                    </>
                );

            default:
                return null;
        }
    };

    const getSectionTitle = () => {
        switch (activeSection) {
            case 'dashboard': return 'Dashboard';
            case 'features': return 'Features';
            case 'networking': return 'Networking';
            case 'content': return 'Content';
            case 'settings': return 'Settings';
            default: return 'Navigation';
        }
    };

    const getSectionDescription = () => {
        switch (activeSection) {
            case 'dashboard': return 'Access your main dashboard and administrative tools.';
            case 'features': return 'Explore AI-powered features and academic tools.';
            case 'networking': return 'Connect with other academics and researchers.';
            case 'content': return 'Manage your content, grants, projects, and events.';
            case 'settings': return 'Update your profile and account settings.';
            default: return 'Navigate through different sections of the platform.';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed left-16 top-0 h-full w-64 bg-gray-100 z-10">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-100">
                    <a href={route('welcome')} className="text-lg font-semibold text-indigo-700">
                        Nexscholar
                    </a>
                    <button
                        onClick={onToggleSidebar}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="p-4 bg-gray-100 border-b border-gray-200">
                    {user && (
                        <>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center border-1 border-white shadow-lg">
                                    <img
                                        src={
                                            user.academician
                                                ? (user.academician.profile_picture
                                                    ? `/storage/${user.academician.profile_picture}`
                                                    : "/storage/profile_pictures/default.jpg")
                                                : user.postgraduate
                                                    ? (user.postgraduate.profile_picture
                                                        ? `/storage/${user.postgraduate.profile_picture}`
                                                        : "/storage/profile_pictures/default.jpg")
                                                    : user.undergraduate
                                                        ? (user.undergraduate.profile_picture
                                                            ? `/storage/${user.undergraduate.profile_picture}`
                                                            : "/storage/profile_pictures/default.jpg")
                                                        : "/storage/profile_pictures/default.jpg"
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.academician
                                            ? user.academician.full_name
                                            : user.postgraduate
                                                ? user.postgraduate.full_name
                                                : user.undergraduate
                                                    ? user.undergraduate.full_name
                                                    : isAdmin
                                                        ? "Admin"
                                                        : isFacultyAdmin
                                                            ? user.full_name
                                                        : "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {isAdmin ? 'Administrator' : isFacultyAdmin ? 'Faculty Admin' : isAcademician ? 'Academician' : isPostgraduate ? 'Postgraduate' : isUndergraduate ? 'Undergraduate' : 'User'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Stats Grid */}
                            {isAcademician && user.academician && user.academician.total_publications!==0 && user.academician.scholar_profile!==null && (
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-gray-50 rounded-lg py-2 pr-2 text-center">
                                    <div className="text-lg font-bold text-gray-900">{user.academician.total_publications}</div>
                                    <div className="text-xs text-gray-500">Publications</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 text-center">
                                    <div className="text-lg font-bold text-gray-900">{user.academician.scholar_profile.total_citations}</div>
                                    <div className="text-xs text-gray-500">Citations</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 text-center">
                                    <div className="text-lg font-bold text-gray-900">{user.academician.scholar_profile.h_index}</div>
                                    <div className="text-xs text-gray-500">h-index</div>
                                </div>
                            </div>
                            )}
                        </>
                    )}
                </div>

                {/* Quick Access Section */}
                <div className="flex-1 overflow-y-auto p-4">
                    <motion.h3 className="text-sm font-medium text-gray-700 mb-4" variants={itemVariants}>{getSectionTitle()}</motion.h3>
                    
                    <motion.div
                        key={activeSection} // This is essential to re-trigger the animation
                        className="grid grid-cols-2 gap-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {renderQuickAccessItems()}
                    </motion.div>
                </div>

                {/* Description Section */}
                <div className="p-4 border-t border-gray-200">
                    <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-3 border border-white border-opacity-50">
                        <p className="text-xs text-gray-600 leading-relaxed">
                            {getSectionDescription()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
