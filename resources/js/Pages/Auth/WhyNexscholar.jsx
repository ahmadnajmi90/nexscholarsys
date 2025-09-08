import { useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';

export default function WhyNexscholar() {
    const { data, setData, post, processing, errors } = useForm({
        main_reason: '',
        features_interested: [],
        additional_info: '',
        step: 0,
    });

    // Define survey steps
    const steps = useMemo(() => ([
        {
            key: 'main_reason',
            type: 'single',
            title: "What's your main reason for joining Nexscholar today?",
            options: [
                { value: 'A', label: 'To find a research supervisor or specific research opportunities.' },
                { value: 'B', label: 'To find students or collaborators for my research.' },
                { value: 'C', label: 'To discover and follow research projects, publications, and grants.' },
                { value: 'D', label: 'To build my academic profile and showcase my work.' },
                { value: 'E', label: 'To network with other researchers and professionals in my field.' },
                { value: 'F', label: 'To stay updated on academic events and news.' },
                { value: 'G', label: "I'm just exploring the platform for now." },
                { value: 'H', label: 'Other.' },
            ],
        },
        {
            key: 'features_interested',
            type: 'multiple',
            title: 'Which Nexscholar features or areas are you most excited to explore?',
            options: [
                { value: 'A', label: 'AI-powered matching (for supervisors, students, or collaborators).' },
                { value: 'B', label: 'Building and managing my detailed academic profile.' },
                { value: 'C', label: 'Accessing the directory of universities, faculties, and researchers.' },
                { value: 'D', label: 'Finding and sharing academic content (e.g., research updates, projects, events).' },
                { value: 'E', label: 'Tools for CV generation or tracking research impact (like Google Scholar integration).' },
                { value: 'F', label: 'General networking and connection features.' },
                { value: 'G', label: "I'm not sure yet." },
            ],
        },
        {
            key: 'additional_info',
            type: 'text',
            title: "Is there anything specific you're hoping to achieve, find, or suggest that wasn't covered above? (Optional)",
        },
    ]), []);

    const current = steps[data.step];
    const isLast = data.step === steps.length - 1;

    const onSelectSingle = (value) => setData('main_reason', value);
    const onToggleMultiple = (value) => {
        const exists = data.features_interested.includes(value);
        setData('features_interested', exists
            ? data.features_interested.filter((v) => v !== value)
            : [...data.features_interested, value]);
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (isLast) {
            post(route('why-nexscholar.store'));
        } else {
            setData('step', data.step + 1);
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        if (data.step > 0) {
            setData('step', data.step - 1);
        }
    };

    // Progress indicators
    const Indicators = () => (
        <div className="flex gap-2 mb-6">
            {steps.map((_, idx) => {
                const active = idx === data.step;
                return (
                    <div
                        key={idx}
                        className={`h-2 flex-1 rounded-full transition-colors ${active ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    />
                );
            })}
        </div>
    );

    // Option card component
    const OptionCard = ({ selected, onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                selected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}
        >
            {children}
        </button>
    );

    return (
        <GuestLayout>
            <Head title="Why Nexscholar?" />

            <form onSubmit={handleNext} className="w-full sm:max-w-2xl mt-6 px-6 py-6 bg-white shadow-md overflow-hidden sm:rounded-2xl relative">
                <Indicators />

                <div className="mb-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
                        {data.step + 1}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                        {current.title}
                    </h2>
                </div>

                {/* Render by type */}
                {current.type === 'single' && (
                    <div className="space-y-3">
                        {current.options.map((opt) => (
                            <OptionCard
                                key={opt.value}
                                selected={data.main_reason === opt.value}
                                onClick={() => onSelectSingle(opt.value)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full border ${data.main_reason === opt.value ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`} />
                                    <span className="text-gray-800">{opt.label}</span>
                                </div>
                            </OptionCard>
                        ))}
                        <InputError message={errors.main_reason} className="mt-2" />
                    </div>
                )}

                {current.type === 'multiple' && (
                    <div className="space-y-3">
                        {current.options.map((opt) => {
                            const selected = data.features_interested.includes(opt.value);
                            return (
                                <OptionCard key={opt.value} selected={selected} onClick={() => onToggleMultiple(opt.value)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-md border ${selected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`} />
                                        <span className="text-gray-800">{opt.label}</span>
                                    </div>
                                </OptionCard>
                            );
                        })}
                        <InputError message={errors.features_interested} className="mt-2" />
                    </div>
                )}

                {current.type === 'text' && (
                    <div>
                        <textarea
                            id="additional_info"
                            rows={6}
                            className="mt-2 block w-full rounded-xl border border-gray-200 p-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.additional_info}
                            onChange={(e) => setData('additional_info', e.target.value)}
                            placeholder="Please share your thoughts..."
                        />
                        <InputError message={errors.additional_info} className="mt-2" />
                    </div>
                )}

                {/* Floating circular Next/Submit button */}
                <div className="mt-10 flex items-center justify-between">
                    {/* Back button for steps > 0 */}
                    {data.step > 0 ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label="Back"
                            title="Back"
                        >
                            {/* arrow-left icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    ) : (
                        <div />
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label={isLast ? 'Submit' : 'Next'}
                        title={isLast ? 'Submit' : 'Next'}
                    >
                        {isLast ? (
                            // check icon
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.07 7.071a1 1 0 01-1.415 0L3.296 9.855a1 1 0 011.415-1.415l3.092 3.092 6.364-6.364a1 1 0 011.537.122z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            // arrow-right icon
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                <path d="M5 12h14" />
                                <path d="M12 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
