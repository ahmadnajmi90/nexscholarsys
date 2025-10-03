import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  Plus, 
  Save, 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  GripVertical,
  Calendar as CalendarIcon,
  Edit2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import { logError } from '@/Utils/logError';

export default function ResearchTab({ relationship, onUpdated, isReadOnly = false }) {
  const [research, setResearch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [keyFindings, setKeyFindings] = useState('');
  const [literatureNotes, setLiteratureNotes] = useState('');
  const [methodologyNotes, setMethodologyNotes] = useState('');
  const [freeFormContent, setFreeFormContent] = useState('');

  // Milestone state
  const [milestones, setMilestones] = useState([]);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', due_date: '' });
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  useEffect(() => {
    loadResearch();
  }, [relationship?.id]);

  const loadResearch = async () => {
    if (!relationship?.id) return;
    setIsLoading(true);
    try {
      const response = await axios.get(route('supervision.relationships.research.show', relationship.id));
      const data = response.data.data;
      
      setResearch(data);
      setTitle(data.title || '');
      setObjectives(data.objectives || []);
      setProgressPercentage(data.progress_percentage || 0);
      setKeyFindings(data.key_findings || '');
      setLiteratureNotes(data.literature_notes || '');
      setMethodologyNotes(data.methodology_notes || '');
      setFreeFormContent(data.free_form_content || '');
      setMilestones(data.milestones || []);
    } catch (error) {
      logError(error, 'ResearchTab loadResearch');
      toast.error('Failed to load research details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResearch = async () => {
    setIsSaving(true);
    try {
      await axios.put(route('supervision.relationships.research.update', relationship.id), {
        title,
        objectives,
        progress_percentage: progressPercentage,
        key_findings: keyFindings,
        literature_notes: literatureNotes,
        methodology_notes: methodologyNotes,
        free_form_content: freeFormContent,
      });

      toast.success('Research details saved successfully');
      onUpdated?.();
    } catch (error) {
      logError(error, 'ResearchTab handleSaveResearch');
      toast.error('Failed to save research details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddObjective = () => {
    setObjectives([...objectives, '']);
  };

  const handleUpdateObjective = (index, value) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const handleRemoveObjective = (index) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim()) {
      toast.error('Milestone title is required');
      return;
    }

    setIsAddingMilestone(true);
    try {
      const response = await axios.post(
        route('supervision.relationships.milestones.store', relationship.id),
        newMilestone
      );

      setMilestones([...milestones, response.data.data]);
      setNewMilestone({ title: '', description: '', due_date: '' });
      setShowAddMilestone(false);
      toast.success('Milestone added successfully');
      onUpdated?.();
    } catch (error) {
      logError(error, 'ResearchTab handleAddMilestone');
      toast.error('Failed to add milestone');
    } finally {
      setIsAddingMilestone(false);
    }
  };

  const handleToggleMilestone = async (milestone) => {
    try {
      await axios.put(route('supervision.milestones.update', milestone.id), {
        completed: !milestone.completed,
      });

      setMilestones(milestones.map(m => 
        m.id === milestone.id ? { ...m, completed: !m.completed } : m
      ));
      toast.success(`Milestone ${milestone.completed ? 'unmarked' : 'completed'}`);
      onUpdated?.();
    } catch (error) {
      logError(error, 'ResearchTab handleToggleMilestone');
      toast.error('Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await axios.delete(route('supervision.milestones.destroy', milestoneId));
      setMilestones(milestones.filter(m => m.id !== milestoneId));
      toast.success('Milestone deleted');
      onUpdated?.();
    } catch (error) {
      logError(error, 'ResearchTab handleDeleteMilestone');
      toast.error('Failed to delete milestone');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // console.log(milestones)

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header with Save Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Research Management</h2>
            <p className="text-sm text-slate-600 mt-1">Track research progress, milestones, and notes collaboratively</p>
          </div>
          {/* <Button onClick={handleSaveResearch} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button> */}
        </div>

        {/* Research Title */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Research Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your research title..."
            className="text-base"
            disabled={isReadOnly}
          />
        </section>

        {/* Progress Tracking */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-slate-700">Overall Progress</label>
            <span className="text-2xl font-bold text-indigo-600">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="mb-3" />
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={(e) => setProgressPercentage(Number(e.target.value))}
            className="w-full"
            disabled={isReadOnly}
          />
        </section>

        {/* Research Objectives */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Research Objectives</h3>
            {!isReadOnly && (
              <Button size="sm" variant="outline" onClick={handleAddObjective}>
                <Plus className="mr-2 h-4 w-4" />
                Add Objective
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {objectives.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                No objectives added yet. Click "Add Objective" to get started.
              </p>
            ) : (
              objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-2 text-sm font-medium text-slate-500">
                    {index + 1}.
                  </span>
                  <Input
                    value={objective}
                    onChange={(e) => handleUpdateObjective(index, e.target.value)}
                    placeholder="Enter objective..."
                    className="flex-1"
                    disabled={isReadOnly}
                  />
                  {!isReadOnly && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveObjective(index)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Milestones */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Milestones</h3>
            {!isReadOnly && (
              <Button size="sm" variant="outline" onClick={() => setShowAddMilestone(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            )}
          </div>

          {!isReadOnly && showAddMilestone && (
            <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <Input
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                className="mb-3"
              />
              <Textarea
                placeholder="Description (optional)"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                rows={2}
                className="mb-3"
              />
              <Input
                type="date"
                value={newMilestone.due_date}
                onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                className="mb-3"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => {
                  setShowAddMilestone(false);
                  setNewMilestone({ title: '', description: '', due_date: '' });
                }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddMilestone} disabled={isAddingMilestone}>
                  {isAddingMilestone && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {milestones.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                No milestones yet. Add your first milestone to track progress.
              </p>
            ) : (
              milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    milestone.completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => handleToggleMilestone(milestone)}
                    className="flex-shrink-0 mt-1"
                    disabled={isReadOnly}
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium ${milestone.completed ? 'text-green-900 line-through' : 'text-slate-900'}`}>
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      {milestone.due_date && (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          Due: {format(new Date(milestone.due_date), 'dd/MM/yyyy')}
                        </span>
                      )}
                      {milestone.creator && (
                        <span>Created by: {milestone.creator.full_name}</span>
                      )}
                    </div>
                  </div>
                  {!isReadOnly && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Key Findings */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Key Findings</label>
          <Textarea
            value={keyFindings}
            onChange={(e) => setKeyFindings(e.target.value)}
            placeholder="Document your key research findings here..."
            rows={6}
            disabled={isReadOnly}
          />
        </section>

        {/* Literature Review Notes */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Literature Review Notes</label>
          <Textarea
            value={literatureNotes}
            onChange={(e) => setLiteratureNotes(e.target.value)}
            placeholder="Track literature review, key papers, citations..."
            rows={6}
            disabled={isReadOnly}
          />
        </section>

        {/* Methodology Notes */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Methodology Notes</label>
          <Textarea
            value={methodologyNotes}
            onChange={(e) => setMethodologyNotes(e.target.value)}
            placeholder="Document your research methodology, experiments, data collection..."
            rows={6}
            disabled={isReadOnly}
          />
        </section>

        {/* Free-form Content */}
        <section className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">General Notes</label>
          <Textarea
            value={freeFormContent}
            onChange={(e) => setFreeFormContent(e.target.value)}
            placeholder="Add any additional notes, ideas, or observations..."
            rows={8}
            disabled={isReadOnly}
          />
        </section>

        {/* Save Button (Bottom) - Only show if not read-only */}
        {!isReadOnly && (
          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveResearch} disabled={isSaving} size="lg">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save All Changes
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

