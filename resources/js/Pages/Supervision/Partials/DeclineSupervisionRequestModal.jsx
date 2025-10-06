import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Checkbox } from '@/Components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { XCircle, User2, Lightbulb, AlertCircle, Loader2, Search, Users, Building2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';
import { usePage } from '@inertiajs/react';

const REJECTION_REASONS = [
  { value: 'expertise_outside', label: 'Research topic is outside my expertise' },
  { value: 'capacity_full', label: 'I have reached my supervision capacity' },
  { value: 'methodology_mismatch', label: 'Methodology does not align with my research' },
  { value: 'language_communication', label: 'Language or communication concerns' },
  { value: 'timing_conflicts', label: 'Timing or schedule conflicts' },
  { value: 'additional_qualifications', label: 'Student needs additional qualifications' },
  { value: 'other', label: 'Other reason' },
];

export default function DeclineSupervisionRequestModal({ isOpen, request, onClose, onRejected }) {
  const { auth } = usePage().props;
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [recommendAlternatives, setRecommendAlternatives] = useState(false);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recommendation state
  const [activeTab, setActiveTab] = useState('connections');
  const [myConnections, setMyConnections] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingConnections, setIsLoadingConnections] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const student = request?.student || {};
  const studentName = student.full_name || 'Student';
  const avatarUrl = student.profile_picture ? `/storage/${student.profile_picture}` : null;
  const program = request?.postgraduate_program?.name || 'PhD Computer Science Program';
  const researchTopic = request?.proposal_title || 'Research Topic';
  const researchKeywords = request?.research_keywords || [];
  const supervisorName = auth?.user?.academician?.full_name || 'Supervisor';

  // Load supervisor's connections when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSupervisorConnections();
      if (researchKeywords.length > 0) {
        setSuggestedKeywords(researchKeywords.join(', '));
      }
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!recommendAlternatives || activeTab !== 'search') return;
    
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchAcademicians(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, recommendAlternatives, activeTab]);

  const loadSupervisorConnections = async () => {
    setIsLoadingConnections(true);
    try {
      const response = await axios.get(route('supervision.recommendations.supervisor-connections'));
      setMyConnections(response.data.data || []);
    } catch (error) {
      logError(error, 'DeclineSupervisionRequestModal loadSupervisorConnections');
      toast.error('Failed to load your connections');
    } finally {
      setIsLoadingConnections(false);
    }
  };

  const searchAcademicians = async (query) => {
    setIsSearching(true);
    try {
      const response = await axios.get(route('supervision.recommendations.search-academicians'), {
        params: { q: query, limit: 20 }
      });
      setSearchResults(response.data.data || []);
    } catch (error) {
      logError(error, 'DeclineSupervisionRequestModal searchAcademicians');
    } finally {
      setIsSearching(false);
    }
  };

  const canSubmit = reason !== '';

  const handleSupervisorToggle = (supervisor) => {
    setSelectedSupervisors(prev => {
      const exists = prev.find(s => s.id === supervisor.id);
      if (exists) {
        return prev.filter(s => s.id !== supervisor.id);
      } else {
        return [...prev, supervisor];
      }
    });
  };

  // Get current list based on active tab
  const getCurrentSupervisorList = () => {
    if (activeTab === 'connections') {
      return myConnections;
    }
    return searchResults;
  };

  const getMessagePreview = () => {
    const reasonText = REJECTION_REASONS.find(r => r.value === reason)?.label || '';
    const supervisorNames = selectedSupervisors.map(s => s.name).join(', ');
    
    return `Dear ${studentName},

Thank you for your interest in working with me on your ${program} research. After carefully reviewing your proposal titled "${researchTopic}", I regret to inform you that I will not be able to supervise your research at this time.

Reason: ${reasonText}

${feedback ? `\n${feedback}\n` : ''}
${recommendAlternatives && selectedSupervisors.length > 0 ? `\nI recommend reaching out to the following supervisors who might be a better fit for your research:\n${supervisorNames}\n` : ''}
${suggestedKeywords ? `\nSuggested keywords for your supervisor search: ${suggestedKeywords}\n` : ''}
I wish you the best of luck in finding a suitable supervisor for your research.

Best regards,
${supervisorName}`;
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        reason,
        feedback: feedback.trim() || null,
        recommend_alternatives: recommendAlternatives,
        recommended_supervisors: recommendAlternatives ? selectedSupervisors.map(s => s.id) : [],
        suggested_keywords: suggestedKeywords.trim() || null,
      };

      await axios.post(route('supervision.requests.reject', request.id), payload);
      
      toast.success('Rejection sent to student');
      onRejected?.();
      onClose?.();
    } catch (error) {
      logError(error, 'DeclineSupervisionRequestModal handleSubmit');
      const message = error?.response?.data?.message || 'Failed to decline supervision request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form
      setReason('');
      setFeedback('');
      setRecommendAlternatives(false);
      setSelectedSupervisors([]);
      setSuggestedKeywords('');
      onClose?.();
    }
  };

  return (
    <Modal show={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold">Decline Supervision Request</h2>
          </div>
          <p className="text-sm text-slate-600">
            Provide feedback to {studentName} and optionally suggest alternative supervisors.
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Request Summary */}
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Request Summary</h3>
              
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={studentName} className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm">
                      {studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{studentName}</div>
                  <div className="text-xs text-slate-500">{program}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Research Topic</div>
                  <div className="text-sm text-slate-900 mt-1">{researchTopic}</div>
                </div>
                
                {researchKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {researchKeywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Reason for Declining */}
            <section className="space-y-3">
              <Label htmlFor="reason">
                Reason for Declining <span className="text-red-500">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            {/* Additional Feedback */}
            <section className="space-y-3">
              <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Any constructive feedback about the proposal or suggestions for improvement..."
                className="resize-none"
              />
            </section>

            {/* Recommend Alternative Supervisors */}
            <section className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="recommend"
                  checked={recommendAlternatives}
                  onCheckedChange={setRecommendAlternatives}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="recommend" className="text-sm font-medium cursor-pointer">
                    Recommend alternative supervisors
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">
                    Help the student by suggesting other supervisors who might be a better fit
                  </p>
                </div>
              </div>

              {recommendAlternatives && (
                <div className="space-y-4 pl-7">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Recommended Supervisors</Label>
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="connections" className="gap-2">
                          <Users className="h-4 w-4" />
                          My Connections ({myConnections.length})
                        </TabsTrigger>
                        <TabsTrigger value="search" className="gap-2">
                          <Building2 className="h-4 w-4" />
                          Search All
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="connections" className="space-y-2 mt-3">
                        {isLoadingConnections ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                          </div>
                        ) : myConnections.length === 0 ? (
                          <div className="text-center py-8 text-sm text-slate-500">
                            <Users className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                            <p>No academician connections found.</p>
                            <p className="text-xs mt-1">Try searching for supervisors in the "Search All" tab.</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {myConnections.map((supervisor) => (
                              <SupervisorCard
                                key={supervisor.id}
                                supervisor={supervisor}
                                isSelected={!!selectedSupervisors.find(s => s.id === supervisor.id)}
                                onToggle={() => handleSupervisorToggle(supervisor)}
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="search" className="space-y-2 mt-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            type="text"
                            placeholder="Search by name, department, or expertise..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {isSearching ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                          </div>
                        ) : searchResults.length === 0 && searchQuery.trim().length >= 2 ? (
                          <div className="text-center py-8 text-sm text-slate-500">
                            <Search className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                            <p>No supervisors found matching "{searchQuery}"</p>
                          </div>
                        ) : searchResults.length === 0 ? (
                          <div className="text-center py-8 text-sm text-slate-500">
                            <Search className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                            <p>Start typing to search for supervisors...</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {searchResults.map((supervisor) => (
                              <SupervisorCard
                                key={supervisor.id}
                                supervisor={supervisor}
                                isSelected={!!selectedSupervisors.find(s => s.id === supervisor.id)}
                                onToggle={() => handleSupervisorToggle(supervisor)}
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>

                  {selectedSupervisors.length > 0 && (
                    <div className="rounded-lg bg-indigo-50 p-3 border border-indigo-200">
                      <div className="text-xs font-medium text-indigo-900 mb-1">
                        {selectedSupervisors.length} supervisor(s) selected
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSupervisors.map(s => (
                          <Badge key={s.id} variant="secondary" className="text-xs">
                            {s.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Suggested Keywords for Supervisor Search</Label>
                    <Textarea
                      id="keywords"
                      rows={2}
                      value={suggestedKeywords}
                      onChange={(e) => setSuggestedKeywords(e.target.value)}
                      placeholder="e.g., Machine Learning, Natural Language Processing, Computer Vision..."
                      className="resize-none"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Message Preview */}
            {reason && (
              <section className="space-y-3">
                <Label>Message Preview</Label>
                <p className="text-xs text-slate-500">This message will be sent to the student:</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans">
                    {getMessagePreview()}
                  </pre>
                </div>
              </section>
            )}

            {/* Confirmation Alert */}
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-900">
                <strong className="font-semibold">Confirm Rejection</strong>
                <p className="mt-1">
                  This action will decline the supervision request and notify the student. The request will be moved to "Rejected" status and cannot be undone.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Rejection & Notify Student
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Supervisor Card Component
function SupervisorCard({ supervisor, isSelected, onToggle }) {
  const avatarUrl = supervisor.profile_picture ? `/storage/${supervisor.profile_picture}` : null;
  const initials = supervisor.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
      .slice(0, 2);
  
    return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? 'border-indigo-300 bg-indigo-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      onClick={onToggle}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="mt-1"
      />
      <Avatar className="h-10 w-10">
        {avatarUrl ? (
          <img src={avatarUrl} alt={supervisor.name} className="h-full w-full object-cover" />
        ) : (
          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-sm font-medium text-slate-900 truncate">
            {supervisor.name}
          </div>
          {supervisor.verified && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
              Verified
            </Badge>
          )}
          {supervisor.is_connection && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
              Connected
            </Badge>
          )}
        </div>
        <div className="text-xs text-slate-500 line-clamp-1">
          {supervisor.expertise}
        </div>
        {(supervisor.faculty || supervisor.university) && (
          <div className="text-xs text-slate-400 truncate">
            {supervisor.faculty && supervisor.university 
              ? `${supervisor.faculty} • ${supervisor.university}`
              : supervisor.faculty || supervisor.university}
          </div>
        )}
      </div>
    </div>
  );
}

