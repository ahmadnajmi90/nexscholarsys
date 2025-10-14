import { createClient } from '@supabase/supabase-js';

// Supabase configuration for NetworkMap feature
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper functions for NetworkMap data
export const networkMapAPI = {
  // Fetch all universities
  async getUniversities() {
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .order('researchers', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Fetch all researchers
  async getResearchers() {
    const { data, error } = await supabase
      .from('researchers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Fetch all community projects
  async getProjects() {
    const { data, error } = await supabase
      .from('community_projects')
      .select('*')
      .order('title');
    
    if (error) throw error;
    return data;
  },

  // Fetch all industry partners
  async getIndustryPartners() {
    const { data, error } = await supabase
      .from('industry_partners')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Fetch researcher network (collaborations)
  async getResearcherNetwork(researcherId) {
    const { data, error } = await supabase
      .from('researcher_networks')
      .select('*')
      .eq('researcher_id', researcherId);
    
    if (error) throw error;
    return data;
  },

  // Fetch paper collaborations
  async getPaperCollaborations(researcherId) {
    const { data, error } = await supabase
      .from('paper_collaborations')
      .select('*')
      .eq('researcher_id', researcherId);
    
    if (error) throw error;
    return data;
  },

  // Fetch project collaborations
  async getProjectCollaborations(researcherId) {
    const { data, error } = await supabase
      .from('project_collaborations')
      .select('*')
      .eq('researcher_id', researcherId);
    
    if (error) throw error;
    return data;
  },

  // Fetch researcher by ID
  async getResearcherById(researcherId) {
    const { data, error } = await supabase
      .from('researchers')
      .select('*')
      .eq('id', researcherId)
      .single();
    
    if (error) throw error;
    return data;
  },
};

