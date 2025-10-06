import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Lightbulb, Plus, Check, ExternalLink, Loader2, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';
import { Link } from '@inertiajs/react';

export default function RecommendedSupervisorsSection({ requestId }) {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [supervisorName, setSupervisorName] = useState('');
  const [suggestedKeywords, setSuggestedKeywords] = useState('');
  const [addingIds, setAddingIds] = useState([]);

  useEffect(() => {
    if (requestId) {
      loadRecommendations();
    }
  }, [requestId]);

  const loadRecommendations = async () => {
    try {
      const response = await axios.get(route('supervision.requests.recommendations', requestId));
      setRecommendations(response.data.data || []);
      setSupervisorName(response.data.supervisor_name || '');
      setSuggestedKeywords(response.data.suggested_keywords || '');
    } catch (error) {
      logError(error, 'RecommendedSupervisorsSection loadRecommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToShortlist = async (academicianId) => {
    setAddingIds(prev => [...prev, academicianId]);
    try {
      await axios.post(route('supervision.recommendations.add-to-shortlist'), {
        request_id: requestId,
        academician_ids: [academicianId],
      });

      // Update local state
      setRecommendations(prev =>
        prev.map(rec =>
          rec.id === academicianId ? { ...rec, in_shortlist: true } : rec
        )
      );

      toast.success('Added to your potential supervisors');
    } catch (error) {
      logError(error, 'RecommendedSupervisorsSection handleAddToShortlist');
      toast.error('Failed to add to shortlist');
    } finally {
      setAddingIds(prev => prev.filter(id => id !== academicianId));
    }
  };

  const handleAddAllToShortlist = async () => {
    const notInShortlist = recommendations.filter(rec => !rec.in_shortlist);
    if (notInShortlist.length === 0) {
      toast('All supervisors are already in your shortlist', { icon: '✓' });
      return;
    }

    const academicianIds = notInShortlist.map(rec => rec.id);
    setAddingIds(academicianIds);

    try {
      const response = await axios.post(route('supervision.recommendations.add-to-shortlist'), {
        request_id: requestId,
        academician_ids: academicianIds,
      });

      // Update local state
      setRecommendations(prev =>
        prev.map(rec =>
          academicianIds.includes(rec.id) ? { ...rec, in_shortlist: true } : rec
        )
      );

      toast.success(response.data.message);
    } catch (error) {
      logError(error, 'RecommendedSupervisorsSection handleAddAllToShortlist');
      toast.error('Failed to add supervisors to shortlist');
    } finally {
      setAddingIds([]);
    }
  };

  if (loading) {
    return (
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-900">
                Recommended Supervisors
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                {supervisorName && `Dr. ${supervisorName} has`} suggested these supervisors who might be a good fit for your research
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleAddAllToShortlist}
            disabled={addingIds.length > 0}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {addingIds.length > 0 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add All to Shortlist
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-3">
          {recommendations.map((supervisor) => (
            <RecommendedSupervisorCard
              key={supervisor.id}
              supervisor={supervisor}
              isAdding={addingIds.includes(supervisor.id)}
              onAddToShortlist={handleAddToShortlist}
            />
          ))}
        </div>

        {suggestedKeywords && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Suggested Search Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords.split(',').map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecommendedSupervisorCard({ supervisor, isAdding, onAddToShortlist }) {
  const avatarUrl = supervisor.profile_picture ? `/storage/${supervisor.profile_picture}` : null;
  const initials = supervisor.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all">
      <Avatar className="h-12 w-12">
        {avatarUrl ? (
          <img src={avatarUrl} alt={supervisor.name} className="h-full w-full object-cover" />
        ) : (
          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-sm font-semibold text-slate-900">{supervisor.name}</h4>
              {supervisor.verified && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
              {supervisor.expertise}
            </p>
            {(supervisor.department || supervisor.university) && (
              <div className="text-xs text-slate-500 mt-1">
                {supervisor.department}
                {supervisor.department && supervisor.university && ' • '}
                {supervisor.university}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {supervisor.in_shortlist ? (
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 shrink-0">
                <Check className="h-3 w-3 mr-1" />
                In Shortlist
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddToShortlist(supervisor.id)}
                disabled={isAdding}
                className="shrink-0"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </>
                )}
              </Button>
            )}

            {supervisor.url && (
              <Link
                href={`/academicians/${supervisor.url}`}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

