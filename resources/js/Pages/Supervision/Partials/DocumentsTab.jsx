import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Loader2, 
  FolderOpen,
  History,
  RotateCcw,
  Edit2,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import Modal from '@/Components/Modal';
import DocumentPreviewModal from '@/Pages/Supervision/Partials/DocumentPreviewModal';
import { logError } from '@/Utils/logError';

const FOLDER_COLORS = {
  'Drafts': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Final Papers': 'bg-green-50 text-green-700 border-green-200',
  'Meeting Notes': 'bg-blue-50 text-blue-700 border-blue-200',
  'Literature': 'bg-purple-50 text-purple-700 border-purple-200',
  'Data': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'General': 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function DocumentsTab({ relationship, onUpdated, isReadOnly = false }) {
  const [documents, setDocuments] = useState({});
  const [availableFolders, setAvailableFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Maximum size for previewing files (15MB)
  const MAX_PREVIEW_SIZE = 15 * 1024 * 1024;

  // Upload form state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDocumentId, setUploadDocumentId] = useState(null);
  const [uploadDocumentName, setUploadDocumentName] = useState('');
  const [uploadFolder, setUploadFolder] = useState('General');
  const [uploadNotes, setUploadNotes] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [relationship?.id]);

  const loadDocuments = async () => {
    if (!relationship?.id) return;
    setIsLoading(true);
    try {
      const response = await axios.get(route('supervision.relationships.documents.index', relationship.id));
      setDocuments(response.data.data.documents_by_folder || {});
      setAvailableFolders(response.data.data.available_folders || []);
      const backendReadOnly = response.data.data.is_read_only || false;
      
      // Expand all folders by default
      const expanded = {};
      Object.keys(response.data.data.documents_by_folder || {}).forEach(folder => {
        expanded[folder] = true;
      });
      setExpandedFolders(expanded);
      
      // Override isReadOnly if backend says so (main supervisor not active)
      if (backendReadOnly && !isReadOnly) {
        // This means main supervisor is not active, force read-only
        console.log('Documents are read-only: main supervisor relationship not active');
      }
    } catch (error) {
      logError(error, 'DocumentsTab loadDocuments');
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB
        toast.error('File size must be less than 50MB');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!uploadDocumentId && !uploadDocumentName.trim()) {
      toast.error('Please provide a document name');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('folder_category', uploadFolder);
      
      if (uploadDocumentId) {
        formData.append('document_id', uploadDocumentId);
      } else {
        formData.append('document_name', uploadDocumentName);
      }
      
      if (uploadNotes.trim()) {
        formData.append('notes', uploadNotes);
      }

      await axios.post(
        route('supervision.relationships.documents.upload', relationship.id),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success(uploadDocumentId ? 'New version uploaded successfully' : 'Document uploaded successfully');
      handleCloseUploadModal();
      loadDocuments();
      onUpdated?.();
    } catch (error) {
      logError(error, 'DocumentsTab handleUpload');
      const message = error?.response?.data?.message || 'Failed to upload document';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadDocumentId(null);
    setUploadDocumentName('');
    setUploadFolder('General');
    setUploadNotes('');
  };

  const handleOpenUploadModal = (documentId = null, folder = 'General', documentName = '') => {
    setUploadDocumentId(documentId);
    setUploadFolder(folder);
    setUploadDocumentName(documentName);
    setShowUploadModal(true);
  };

  const handlePreview = (version, fileName) => {
    // Check if file is previewable (image or PDF under 15MB)
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';
    const isPreviewable = (isImage || isPdf) && version.size < MAX_PREVIEW_SIZE;

    if (isPreviewable) {
      // Use preview route for inline display, download route for downloading
      const previewUrl = route('supervision.document-versions.preview', version.id);
      const downloadUrl = route('supervision.document-versions.download', version.id);
      
      setPreviewFile({
        preview_url: previewUrl,
        download_url: downloadUrl,
        original_name: fileName,
        mime_type: isPdf ? 'application/pdf' : `image/${fileExtension}`,
        size: version.size,
        size_formatted: version.size_formatted || `${(version.size / 1024).toFixed(1)} KB`,
        created_at: version.created_at,
      });
    } else {
      // For non-previewable files, download directly
      window.open(route('supervision.document-versions.download', version.id), '_blank', 'noopener,noreferrer');
    }
  };

  const handleRevertVersion = async (documentId, versionId) => {
    if (!confirm('Are you sure you want to revert to this version?')) return;

    try {
      await axios.post(route('supervision.documents.versions.revert', { document: documentId, version: versionId }));
      toast.success('Reverted to selected version');
      loadDocuments();
      setShowVersionHistory(false);
      onUpdated?.();
    } catch (error) {
      logError(error, 'DocumentsTab handleRevertVersion');
      toast.error('Failed to revert version');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document and all its versions?')) return;

    try {
      await axios.delete(route('supervision.documents.destroy', documentId));
      toast.success('Document deleted');
      loadDocuments();
      onUpdated?.();
    } catch (error) {
      logError(error, 'DocumentsTab handleDeleteDocument');
      toast.error('Failed to delete document');
    }
  };

  const toggleFolder = (folderName) => {
    setExpandedFolders({
      ...expandedFolders,
      [folderName]: !expandedFolders[folderName],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const totalDocuments = Object.values(documents).reduce((sum, docs) => sum + docs.length, 0);

  return (
    <>
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Documents</h2>
              <p className="text-sm text-slate-600 mt-1">
                {totalDocuments} document{totalDocuments !== 1 ? 's' : ''} across {Object.keys(documents).length} folder{Object.keys(documents).length !== 1 ? 's' : ''}
              </p>
            </div>
            {!isReadOnly && (
              <Button onClick={() => handleOpenUploadModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            )}
          </div>

          {/* Empty State */}
          {totalDocuments === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents yet</h3>
              <p className="text-sm text-slate-600 mb-4">
                {isReadOnly ? 'No documents uploaded yet' : 'Upload your first document to start building your research repository'}
              </p>
              {!isReadOnly && (
                <Button onClick={() => handleOpenUploadModal()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              )}
            </div>
          ) : (
            /* Folders with Documents */
            <div className="space-y-4">
              {availableFolders.map((folderName) => {
                const folderDocs = documents[folderName] || [];
                if (folderDocs.length === 0) return null;

                const isExpanded = expandedFolders[folderName];
                const folderColor = FOLDER_COLORS[folderName] || FOLDER_COLORS['General'];

                return (
                  <div key={folderName} className="border border-slate-200 rounded-lg bg-white shadow-sm">
                    {/* Folder Header */}
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <button
                        onClick={() => toggleFolder(folderName)}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                        <FolderOpen className="h-5 w-5 text-slate-600" />
                        <span className="font-semibold text-slate-900">{folderName}</span>
                        <Badge variant="outline" className={folderColor}>
                          {folderDocs.length} file{folderDocs.length !== 1 ? 's' : ''}
                        </Badge>
                      </button>
                      {!isReadOnly && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenUploadModal(null, folderName)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Documents List */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-4 space-y-3">
                        {folderDocs.map((doc) => (
                          <DocumentCard
                            key={doc.id}
                            document={doc}
                            onPreview={handlePreview}
                            onDelete={handleDeleteDocument}
                            onUploadVersion={() => handleOpenUploadModal(doc.id, folderName, doc.name)}
                            onViewVersions={() => {
                              setSelectedDocument(doc);
                              setShowVersionHistory(true);
                            }}
                            isReadOnly={isReadOnly}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onClose={handleCloseUploadModal} maxWidth="2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            {uploadDocumentId ? 'Upload New Version' : 'Upload Document'}
          </h2>

          <div className="space-y-4">
            {!uploadDocumentId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Document Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={uploadDocumentName}
                    onChange={(e) => setUploadDocumentName(e.target.value)}
                    placeholder="e.g., Research Proposal Draft"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Folder <span className="text-red-500">*</span>
                  </label>
                  <Select value={uploadFolder} onValueChange={setUploadFolder}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFolders.map((folder) => (
                        <SelectItem key={folder} value={folder}>
                          {folder}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {uploadDocumentId && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600">
                  Uploading new version for: <span className="font-semibold text-slate-900">{uploadDocumentName}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Folder: {uploadFolder}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-slate-600">
                  Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Version Notes (Optional)
              </label>
              <Textarea
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                placeholder="Add notes about this version..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleCloseUploadModal} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* Version History Modal */}
      {selectedDocument && (
        <Modal 
          show={showVersionHistory} 
          onClose={() => {
            setShowVersionHistory(false);
            setSelectedDocument(null);
          }} 
          maxWidth="2xl"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Version History: {selectedDocument.name}
            </h2>

            <div className="space-y-3">
              {selectedDocument.versions?.map((version) => {
                const isCurrent = version.id === selectedDocument.current_version_id;
                
                return (
                  <div
                    key={version.id}
                    className={`p-4 rounded-lg border ${
                      isCurrent ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-900">
                            Version {version.version_number}
                          </span>
                          {isCurrent && (
                            <Badge className="bg-indigo-600 text-white">Current</Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>Uploaded by: {version.uploader?.full_name || 'Unknown'}</p>
                          <p>Date: {format(new Date(version.created_at), 'dd/MM/yyyy HH:mm')}</p>
                          <p>Size: {version.size_formatted || `${(version.size / 1024).toFixed(1)} KB`}</p>
                          {version.notes && (
                            <p className="mt-2 text-slate-700">
                              <span className="font-medium">Notes:</span> {version.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(version, version.original_name)}
                          title="Preview document"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!isCurrent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevertVersion(selectedDocument.id, version.id)}
                            title="Revert to this version"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}

function DocumentCard({ document, onPreview, onDelete, onUploadVersion, onViewVersions, isReadOnly = false }) {
  const currentVersion = document.current_version;
  const versionCount = document.versions?.length || 0;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="p-2 bg-white rounded-md border border-slate-200">
          <FileText className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 truncate">{document.name}</h4>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>v{currentVersion?.version_number || 1}</span>
            <span>•</span>
            <span>{currentVersion?.uploader?.full_name || currentVersion?.uploader?.name || 'Unknown'}</span>
            <span>•</span>
            <span>{currentVersion?.created_at ? format(new Date(currentVersion.created_at), 'dd/MM/yyyy') : '—'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPreview(currentVersion, currentVersion?.original_name)}
          title="Preview document"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewVersions}
          title="View version history"
        >
          <History className="h-4 w-4" />
          {versionCount > 1 && (
            <span className="ml-1 text-xs">{versionCount}</span>
          )}
        </Button>
        {!isReadOnly && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={onUploadVersion}
              title="Upload new version"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(document.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

