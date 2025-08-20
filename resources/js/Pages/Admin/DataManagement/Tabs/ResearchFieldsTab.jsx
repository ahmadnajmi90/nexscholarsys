import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { router } from '@inertiajs/react';
import FieldOfResearchFormModal from '../Components/FieldOfResearchFormModal';
import ResearchAreaFormModal from '../Components/ResearchAreaFormModal';
import NicheDomainFormModal from '../Components/NicheDomainFormModal';
import ConfirmationModal from '../Components/ConfirmationModal';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

export default function ResearchFieldsTab() {
    // Data states
    const [fields, setFields] = useState([]);
    const [areas, setAreas] = useState([]);
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState({
        fields: true,
        areas: false,
        domains: false
    });
    
    // Selection states
    const [selectedField, setSelectedField] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    
    // Search states
    const [searchQueries, setSearchQueries] = useState({
        fields: '',
        areas: '',
        domains: ''
    });
    
    // Modal states
    const [modalStates, setModalStates] = useState({
        fieldForm: false,
        areaForm: false,
        domainForm: false,
        fieldDelete: false,
        areaDelete: false,
        domainDelete: false
    });
    
    // Current item states
    const [currentField, setCurrentField] = useState(null);
    const [currentArea, setCurrentArea] = useState(null);
    const [currentDomain, setCurrentDomain] = useState(null);
    
    // Form modes
    const [formModes, setFormModes] = useState({
        field: 'create',
        area: 'create',
        domain: 'create'
    });

    useEffect(() => {
        fetchFields();
    }, [searchQueries.fields]);

    useEffect(() => {
        if (selectedField) {
            fetchAreas();
        } else {
            setAreas([]);
            setSelectedArea(null);
        }
    }, [selectedField, searchQueries.areas]);

    useEffect(() => {
        if (selectedArea) {
            fetchDomains();
        } else {
            setDomains([]);
        }
    }, [selectedArea, searchQueries.domains]);

    const fetchFields = async () => {
        setLoading(prev => ({ ...prev, fields: true }));
        try {
            const response = await axios.get('/api/v1/app/fields-of-research', {
                params: {
                    per_page: 100,
                    search: searchQueries.fields || undefined
                }
            });
            setFields(response.data.data);
        } catch (error) {
            console.error('Error fetching fields of research:', error);
            toast.error('Failed to load fields of research');
        } finally {
            setLoading(prev => ({ ...prev, fields: false }));
        }
    };

    const fetchAreas = async () => {
        if (!selectedField) return;
        
        setLoading(prev => ({ ...prev, areas: true }));
        try {
            const response = await axios.get('/api/v1/app/research-areas', {
                params: {
                    field_of_research_id: selectedField.id,
                    per_page: 100,
                    search: searchQueries.areas || undefined
                }
            });
            setAreas(response.data.data);
        } catch (error) {
            console.error('Error fetching research areas:', error);
            toast.error('Failed to load research areas');
        } finally {
            setLoading(prev => ({ ...prev, areas: false }));
        }
    };

    const fetchDomains = async () => {
        if (!selectedArea) return;
        
        setLoading(prev => ({ ...prev, domains: true }));
        try {
            const response = await axios.get('/api/v1/app/niche-domains', {
                params: {
                    research_area_id: selectedArea.id,
                    per_page: 100,
                    search: searchQueries.domains || undefined
                }
            });
            setDomains(response.data.data);
        } catch (error) {
            console.error('Error fetching niche domains:', error);
            toast.error('Failed to load niche domains');
        } finally {
            setLoading(prev => ({ ...prev, domains: false }));
        }
    };

    const handleFieldSelect = (field) => {
        setSelectedField(field);
        setSelectedArea(null);
    };

    const handleAreaSelect = (area) => {
        setSelectedArea(area);
    };

    const handleSearchChange = (type, value) => {
        setSearchQueries(prev => ({ ...prev, [type]: value }));
    };

    // Modal handlers for Field of Research
    const openAddFieldModal = () => {
        setCurrentField(null);
        setFormModes(prev => ({ ...prev, field: 'create' }));
        setModalStates(prev => ({ ...prev, fieldForm: true }));
    };

    const openEditFieldModal = (field) => {
        setCurrentField(field);
        setFormModes(prev => ({ ...prev, field: 'edit' }));
        setModalStates(prev => ({ ...prev, fieldForm: true }));
    };

    const openDeleteFieldModal = (field) => {
        setCurrentField(field);
        setModalStates(prev => ({ ...prev, fieldDelete: true }));
    };

    const closeFieldFormModal = () => {
        setModalStates(prev => ({ ...prev, fieldForm: false }));
        fetchFields();
    };

    const handleDeleteField = () => {
        if (!currentField) return;

        router.delete(`/admin/data-management/fields-of-research/${currentField.id}`, {
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
                setModalStates(prev => ({ ...prev, fieldDelete: false }));

                // Reset selection if the deleted item was selected
                if (selectedField && selectedField.id === currentField.id) {
                    setSelectedField(null);
                }
            },
            onError: (errors) => {
                // Fallback for client-side or network errors
                toast.error('A client-side error occurred. Please try again.');
                console.error(errors);
            }
        });
    };

    // Modal handlers for Research Area
    const openAddAreaModal = () => {
        setCurrentArea(null);
        setFormModes(prev => ({ ...prev, area: 'create' }));
        setModalStates(prev => ({ ...prev, areaForm: true }));
    };

    const openEditAreaModal = (area) => {
        setCurrentArea(area);
        setFormModes(prev => ({ ...prev, area: 'edit' }));
        setModalStates(prev => ({ ...prev, areaForm: true }));
    };

    const openDeleteAreaModal = (area) => {
        setCurrentArea(area);
        setModalStates(prev => ({ ...prev, areaDelete: true }));
    };

    const closeAreaFormModal = () => {
        setModalStates(prev => ({ ...prev, areaForm: false }));
        fetchAreas();
    };

    const handleDeleteArea = () => {
        if (!currentArea) return;

        router.delete(`/admin/data-management/research-areas/${currentArea.id}`, {
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
                setModalStates(prev => ({ ...prev, areaDelete: false }));

                // Reset selection if the deleted item was selected
                if (selectedArea && selectedArea.id === currentArea.id) {
                    setSelectedArea(null);
                }
            },
            onError: (errors) => {
                // Fallback for client-side or network errors
                toast.error('A client-side error occurred. Please try again.');
                console.error(errors);
            }
        });
    };

    // Modal handlers for Niche Domain
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

        router.delete(`/admin/data-management/niche-domains/${currentDomain.id}`, {
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
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Research Fields Hierarchy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fields of Research Column */}
                <div className="border rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Fields of Research</h3>
                        <button
                            onClick={openAddFieldModal}
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
                                value={searchQueries.fields}
                                onChange={(e) => handleSearchChange('fields', e.target.value)}
                                placeholder="Search fields..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    
                    {/* Fields List */}
                    <div className="overflow-y-auto max-h-96">
                        {loading.fields ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : fields.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No fields found</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {fields.map((field) => (
                                    <li
                                        key={field.id}
                                        className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${
                                            selectedField && selectedField.id === field.id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleFieldSelect(field)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="block text-sm font-medium text-gray-900 truncate">
                                                {field.name}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditFieldModal(field);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteFieldModal(field);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                        <span className="block text-xs text-gray-500">
                                            {field.research_areas_count || 0} research areas
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                {/* Research Areas Column */}
                <div className="border rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Research Areas</h3>
                        <button
                            onClick={() => {
                                // Guard clause to prevent opening the modal if no field is selected
                                if (!selectedField) return;
                                openAddAreaModal();
                            }}
                            disabled={!selectedField}
                            className={`inline-flex items-center px-3 py-1 bg-blue-600 border border-transparent rounded-md text-xs text-white uppercase tracking-widest ${!selectedField ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-900'} focus:outline-none focus:border-blue-900 focus:ring ring-blue-300`}
                        >
                            <FaPlus className="mr-1" /> Add Area
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
                                value={searchQueries.areas}
                                onChange={(e) => handleSearchChange('areas', e.target.value)}
                                placeholder="Search areas..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                disabled={!selectedField}
                            />
                        </div>
                    </div>
                    
                    {/* Areas List */}
                    <div className="overflow-y-auto max-h-96">
                        {!selectedField ? (
                            <p className="text-center py-4 text-gray-500">Select a field to view research areas</p>
                        ) : loading.areas ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : areas.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No research areas found</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {areas.map((area) => (
                                    <li
                                        key={area.id}
                                        className={`py-3 px-2 cursor-pointer hover:bg-gray-50 ${
                                            selectedArea && selectedArea.id === area.id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleAreaSelect(area)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="block text-sm font-medium text-gray-900 truncate">
                                                {area.name}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditAreaModal(area);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteAreaModal(area);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                        <span className="block text-xs text-gray-500">
                                            {area.niche_domains_count || 0} niche domains
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                {/* Niche Domains Column */}
                <div className="border rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Niche Domains</h3>
                        <button
                            onClick={() => {
                                // Guard clause to prevent opening the modal if no area is selected
                                if (!selectedArea) return;
                                openAddDomainModal();
                            }}
                            disabled={!selectedArea}
                            className={`inline-flex items-center px-3 py-1 bg-blue-600 border border-transparent rounded-md text-xs text-white uppercase tracking-widest ${!selectedArea ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-900'} focus:outline-none focus:border-blue-900 focus:ring ring-blue-300`}
                        >
                            <FaPlus className="mr-1" /> Add Domain
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
                                disabled={!selectedArea}
                            />
                        </div>
                    </div>
                    
                    {/* Domains List */}
                    <div className="overflow-y-auto max-h-96">
                        {!selectedArea ? (
                            <p className="text-center py-4 text-gray-500">Select a research area to view niche domains</p>
                        ) : loading.domains ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : domains.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No niche domains found</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {domains.map((domain) => (
                                    <li
                                        key={domain.id}
                                        className="py-3 px-2 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="block text-sm font-medium text-gray-900 truncate">
                                                {domain.name}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditDomainModal(domain)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteDomainModal(domain)}
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
            <FieldOfResearchFormModal
                isOpen={modalStates.fieldForm}
                onClose={closeFieldFormModal}
                field={currentField}
                mode={formModes.field}
            />
            
            <ResearchAreaFormModal
                isOpen={modalStates.areaForm}
                onClose={closeAreaFormModal}
                area={currentArea}
                fieldId={selectedField ? selectedField.id : null}
                mode={formModes.area}
            />
            
            <NicheDomainFormModal
                isOpen={modalStates.domainForm}
                onClose={closeDomainFormModal}
                domain={currentDomain}
                areaId={selectedArea ? selectedArea.id : null}
                mode={formModes.domain}
            />
            
            <ConfirmationModal
                isOpen={modalStates.fieldDelete}
                title="Delete Field of Research"
                message={`Are you sure you want to delete "${currentField?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteField}
                onCancel={() => setModalStates(prev => ({ ...prev, fieldDelete: false }))}
            />
            
            <ConfirmationModal
                isOpen={modalStates.areaDelete}
                title="Delete Research Area"
                message={`Are you sure you want to delete "${currentArea?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteArea}
                onCancel={() => setModalStates(prev => ({ ...prev, areaDelete: false }))}
            />
            
            <ConfirmationModal
                isOpen={modalStates.domainDelete}
                title="Delete Niche Domain"
                message={`Are you sure you want to delete "${currentDomain?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteDomain}
                onCancel={() => setModalStates(prev => ({ ...prev, domainDelete: false }))}
            />
        </div>
    );
}