import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { router } from '@inertiajs/react';
import SkillsDomainFormModal from '../Components/SkillsDomainFormModal';
import SkillsSubdomainFormModal from '../Components/SkillsSubdomainFormModal';
import SkillFormModal from '../Components/SkillFormModal';
import ConfirmationModal from '../Components/ConfirmationModal';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

export default function SkillsTaxonomyTab() {
    // Data states
    const [domains, setDomains] = useState([]);
    const [subdomains, setSubdomains] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState({
        domains: true,
        subdomains: false,
        skills: false
    });
    
    // Selection states
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [selectedSubdomain, setSelectedSubdomain] = useState(null);
    
    // Search states
    const [searchQueries, setSearchQueries] = useState({
        domains: '',
        subdomains: '',
        skills: ''
    });
    
    // Modal states
    const [modalStates, setModalStates] = useState({
        domainForm: false,
        subdomainForm: false,
        skillForm: false,
        domainDelete: false,
        subdomainDelete: false,
        skillDelete: false
    });
    
    // Current item states
    const [currentDomain, setCurrentDomain] = useState(null);
    const [currentSubdomain, setCurrentSubdomain] = useState(null);
    const [currentSkill, setCurrentSkill] = useState(null);
    
    // Form modes
    const [formModes, setFormModes] = useState({
        domain: 'create',
        subdomain: 'create',
        skill: 'create'
    });

    useEffect(() => {
        fetchDomains();
    }, [searchQueries.domains]);

    useEffect(() => {
        if (selectedDomain) {
            fetchSubdomains();
        } else {
            setSubdomains([]);
            setSelectedSubdomain(null);
        }
    }, [selectedDomain, searchQueries.subdomains]);

    useEffect(() => {
        if (selectedSubdomain) {
            fetchSkills();
        } else {
            setSkills([]);
        }
    }, [selectedSubdomain, searchQueries.skills]);

    const fetchDomains = async () => {
        setLoading(prev => ({ ...prev, domains: true }));
        try {
            const response = await axios.get('/api/v1/app/skills-domains', {
                params: {
                    per_page: 100,
                    search: searchQueries.domains || undefined
                }
            });
            setDomains(response.data.data);
        } catch (error) {
            console.error('Error fetching skills domains:', error);
            toast.error('Failed to load skills domains');
        } finally {
            setLoading(prev => ({ ...prev, domains: false }));
        }
    };

    const fetchSubdomains = async () => {
        if (!selectedDomain) return;
        
        setLoading(prev => ({ ...prev, subdomains: true }));
        try {
            const response = await axios.get('/api/v1/app/skills-subdomains', {
                params: {
                    skills_domain_id: selectedDomain.id,
                    per_page: 100,
                    search: searchQueries.subdomains || undefined,
                    with_domain: true
                }
            });
            setSubdomains(response.data.data);
        } catch (error) {
            console.error('Error fetching skills subdomains:', error);
            toast.error('Failed to load skills subdomains');
        } finally {
            setLoading(prev => ({ ...prev, subdomains: false }));
        }
    };

    const fetchSkills = async () => {
        if (!selectedSubdomain) return;
        
        setLoading(prev => ({ ...prev, skills: true }));
        try {
            const response = await axios.get('/api/v1/app/skills', {
                params: {
                    skills_subdomain_id: selectedSubdomain.id,
                    per_page: 100,
                    search: searchQueries.skills || undefined,
                    with_hierarchy: true
                }
            });
            setSkills(response.data.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
            toast.error('Failed to load skills');
        } finally {
            setLoading(prev => ({ ...prev, skills: false }));
        }
    };

    const handleDomainSelect = (domain) => {
        setSelectedDomain(domain);
        setSelectedSubdomain(null);
    };

    const handleSubdomainSelect = (subdomain) => {
        setSelectedSubdomain(subdomain);
    };

    const handleSearchChange = (type, value) => {
        setSearchQueries(prev => ({ ...prev, [type]: value }));
    };

    // Modal handlers for Skills Domain
    const openAddDomainModal = () => {
        setCurrentDomain(null);
        setFormModes(prev => ({ ...prev, domain: 'create' }));
        setModalStates(prev => ({ ...prev, domainForm: true }));
    };

    const openEditDomainModal = (domain) => {
        setCurrentDomain(domain);
        setFormModes(prev => ({ ...prev, domain: 'edit' }));
        setModalStates(prev => ({ ...prev, domainForm: true }));
    };

    const openDeleteDomainModal = (domain) => {
        setCurrentDomain(domain);
        setModalStates(prev => ({ ...prev, domainDelete: true }));
    };

    const closeDomainFormModal = () => {
        setModalStates(prev => ({ ...prev, domainForm: false }));
        fetchDomains();
    };

    const handleDeleteDomain = () => {
        if (!currentDomain) return;

        router.delete(`/admin/data-management/skills-domains/${currentDomain.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Check for success OR error flash messages from the server response
                if (page.props?.flash?.success) {
                    toast.success(page.props.flash.success);
                }
                if (page.props?.flash?.error) {
                    toast.error(page.props.flash.error);
                }

                // Always close the modal after the action
                setModalStates(prev => ({ ...prev, domainDelete: false }));

                // Reset selection if the deleted item was selected
                if (selectedDomain && selectedDomain.id === currentDomain.id) {
                    setSelectedDomain(null);
                }
                
                // Refresh the domains list
                fetchDomains();
            },
            onError: (errors) => {
                // Fallback for client-side or network errors
                toast.error('A client-side error occurred. Please try again.');
                console.error(errors);
            }
        });
    };

    // Modal handlers for Skills Subdomain
    const openAddSubdomainModal = () => {
        setCurrentSubdomain(null);
        setFormModes(prev => ({ ...prev, subdomain: 'create' }));
        setModalStates(prev => ({ ...prev, subdomainForm: true }));
    };

    const openEditSubdomainModal = (subdomain) => {
        setCurrentSubdomain(subdomain);
        setFormModes(prev => ({ ...prev, subdomain: 'edit' }));
        setModalStates(prev => ({ ...prev, subdomainForm: true }));
    };

    const openDeleteSubdomainModal = (subdomain) => {
        setCurrentSubdomain(subdomain);
        setModalStates(prev => ({ ...prev, subdomainDelete: true }));
    };

    const closeSubdomainFormModal = () => {
        setModalStates(prev => ({ ...prev, subdomainForm: false }));
        fetchSubdomains();
    };

    const handleDeleteSubdomain = () => {
        if (!currentSubdomain) return;

        router.delete(`/admin/data-management/skills-subdomains/${currentSubdomain.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Check for success OR error flash messages from the server response
                if (page.props?.flash?.success) {
                    toast.success(page.props.flash.success);
                }
                if (page.props?.flash?.error) {
                    toast.error(page.props.flash.error);
                }

                // Always close the modal after the action
                setModalStates(prev => ({ ...prev, subdomainDelete: false }));

                // Reset selection if the deleted item was selected
                if (selectedSubdomain && selectedSubdomain.id === currentSubdomain.id) {
                    setSelectedSubdomain(null);
                }
                
                // Refresh the subdomains list
                fetchSubdomains();
            },
            onError: (errors) => {
                // Fallback for client-side or network errors
                toast.error('A client-side error occurred. Please try again.');
                console.error(errors);
            }
        });
    };

    // Modal handlers for Skill
    const openAddSkillModal = () => {
        setCurrentSkill(null);
        setFormModes(prev => ({ ...prev, skill: 'create' }));
        setModalStates(prev => ({ ...prev, skillForm: true }));
    };

    const openEditSkillModal = (skill) => {
        setCurrentSkill(skill);
        setFormModes(prev => ({ ...prev, skill: 'edit' }));
        setModalStates(prev => ({ ...prev, skillForm: true }));
    };

    const openDeleteSkillModal = (skill) => {
        setCurrentSkill(skill);
        setModalStates(prev => ({ ...prev, skillDelete: true }));
    };

    const closeSkillFormModal = () => {
        setModalStates(prev => ({ ...prev, skillForm: false }));
        fetchSkills();
    };

    const handleDeleteSkill = () => {
        if (!currentSkill) return;

        router.delete(`/admin/data-management/skills/${currentSkill.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                // Check for success OR error flash messages from the server response
                if (page.props?.flash?.success) {
                    toast.success(page.props.flash.success);
                }
                if (page.props?.flash?.error) {
                    toast.error(page.props.flash.error);
                }

                // Always close the modal after the action
                setModalStates(prev => ({ ...prev, skillDelete: false }));
                
                // Refresh the skills list
                fetchSkills();
            },
            onError: (errors) => {
                // Fallback for client-side or network errors
                toast.error('A client-side error occurred. Please try again.');
                console.error(errors);
            }
        });
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Skills Taxonomy Hierarchy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Skills Domains Column */}
                <div className="border rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Skills Domains</h3>
                        <button
                            onClick={openAddDomainModal}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 border border-transparent rounded-md text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300"
                        >
                            <FaPlus className="mr-1" /> Add
                        </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQueries.domains}
                                onChange={(e) => handleSearchChange('domains', e.target.value)}
                                placeholder="Search domains..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    
                    {/* Domains List */}
                    <div className="overflow-y-auto max-h-96">
                        {loading.domains ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : domains.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No domains found</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {domains.map((domain) => (
                                    <li
                                        key={domain.id}
                                        className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${
                                            selectedDomain && selectedDomain.id === domain.id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleDomainSelect(domain)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="block text-sm font-medium text-gray-900 truncate">
                                                {domain.name}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditDomainModal(domain);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteDomainModal(domain);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                        <span className="block text-xs text-gray-500">
                                            {domain.subdomains_count || 0} subdomains
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                {/* Skills Subdomains Column */}
                <div className="border rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Skills Subdomains</h3>
                        <button
                            onClick={() => {
                                // Guard clause to prevent opening the modal if no domain is selected
                                if (!selectedDomain) return;
                                openAddSubdomainModal();
                            }}
                            disabled={!selectedDomain}
                            className={`inline-flex items-center px-3 py-1 bg-blue-600 border border-transparent rounded-md text-xs text-white uppercase tracking-widest ${!selectedDomain ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-900'} focus:outline-none focus:border-blue-900 focus:ring ring-blue-300`}
                        >
                            <FaPlus className="mr-1" /> Add Subdomain
                        </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQueries.subdomains}
                                onChange={(e) => handleSearchChange('subdomains', e.target.value)}
                                placeholder="Search subdomains..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                disabled={!selectedDomain}
                            />
                        </div>
                    </div>
                    
                    {/* Subdomains List */}
                    <div className="overflow-y-auto max-h-96">
                        {!selectedDomain ? (
                            <p className="text-center py-4 text-gray-500">Select a domain to view subdomains</p>
                        ) : loading.subdomains ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : subdomains.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No subdomains found</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {subdomains.map((subdomain) => (
                                    <li
                                        key={subdomain.id}
                                        className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${
                                            selectedSubdomain && selectedSubdomain.id === subdomain.id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleSubdomainSelect(subdomain)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="block text-sm font-medium text-gray-900 truncate">
                                                {subdomain.name}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditSubdomainModal(subdomain);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteSubdomainModal(subdomain);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                        <span className="block text-xs text-gray-500">
                                            {subdomain.skills_count || 0} skills
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                {/* Skills Column */}
                <div className="border rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Skills</h3>
                        <button
                            onClick={() => {
                                // Guard clause to prevent opening the modal if no subdomain is selected
                                if (!selectedSubdomain) return;
                                openAddSkillModal();
                            }}
                            disabled={!selectedSubdomain}
                            className={`inline-flex items-center px-3 py-1 bg-blue-600 border border-transparent rounded-md text-xs text-white uppercase tracking-widest ${!selectedSubdomain ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-900'} focus:outline-none focus:border-blue-900 focus:ring ring-blue-300`}
                        >
                            <FaPlus className="mr-1" /> Add Skill
                        </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQueries.skills}
                                onChange={(e) => handleSearchChange('skills', e.target.value)}
                                placeholder="Search skills..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                disabled={!selectedSubdomain}
                            />
                        </div>
                    </div>
                    
                    {/* Skills List */}
                    <div className="overflow-y-auto max-h-96">
                        {!selectedSubdomain ? (
                            <p className="text-center py-4 text-gray-500">Select a subdomain to view skills</p>
                        ) : loading.skills ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : skills.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No skills found</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {skills.map((skill) => (
                                    <li
                                        key={skill.id}
                                        className="py-3 px-2 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium text-gray-900 truncate">
                                                    {skill.name}
                                                </span>
                                                {skill.description && (
                                                    <span className="block text-xs text-gray-500 mt-1">
                                                        {skill.description}
                                                    </span>
                                                )}
                                                <span className="block text-xs text-gray-400 mt-1">
                                                    {skill.users_count || 0} users
                                                </span>
                                            </div>
                                            <div className="flex space-x-2 ml-2">
                                                <button
                                                    onClick={() => openEditSkillModal(skill)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteSkillModal(skill)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            <SkillsDomainFormModal
                isOpen={modalStates.domainForm}
                onClose={closeDomainFormModal}
                domain={currentDomain}
                mode={formModes.domain}
            />
            
            <SkillsSubdomainFormModal
                isOpen={modalStates.subdomainForm}
                onClose={closeSubdomainFormModal}
                subdomain={currentSubdomain}
                domainId={selectedDomain ? selectedDomain.id : null}
                selectedDomain={selectedDomain}
                mode={formModes.subdomain}
            />
            
            <SkillFormModal
                isOpen={modalStates.skillForm}
                onClose={closeSkillFormModal}
                skill={currentSkill}
                subdomainId={selectedSubdomain ? selectedSubdomain.id : null}
                selectedSubdomain={selectedSubdomain}
                mode={formModes.skill}
            />
            
            <ConfirmationModal
                isOpen={modalStates.domainDelete}
                title="Delete Skills Domain"
                message={`Are you sure you want to delete "${currentDomain?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteDomain}
                onCancel={() => setModalStates(prev => ({ ...prev, domainDelete: false }))}
            />
            
            <ConfirmationModal
                isOpen={modalStates.subdomainDelete}
                title="Delete Skills Subdomain"
                message={`Are you sure you want to delete "${currentSubdomain?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteSubdomain}
                onCancel={() => setModalStates(prev => ({ ...prev, subdomainDelete: false }))}
            />
            
            <ConfirmationModal
                isOpen={modalStates.skillDelete}
                title="Delete Skill"
                message={`Are you sure you want to delete "${currentSkill?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteSkill}
                onCancel={() => setModalStates(prev => ({ ...prev, skillDelete: false }))}
            />
        </div>
    );
}