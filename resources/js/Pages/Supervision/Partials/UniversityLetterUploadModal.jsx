import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Upload, FileText, Loader2, X, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { logError } from '@/Utils/logError';

export default function UniversityLetterUploadModal({ isOpen, relationship, onClose, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('letter', selectedFile);

      const response = await axios.post(
        route('supervision.relationships.university-letter.upload', relationship.id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('University letter uploaded successfully');
        onUploaded?.();
        handleClose();
      }
    } catch (error) {
      logError(error, 'UniversityLetterUploadModal handleUpload');
      const message = error?.response?.data?.message || 'Failed to upload university letter';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      onClose?.();
    }
  };

  return (
    <Modal show={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Upload University Letter</h2>
          </div>
          <p className="text-sm text-slate-600">
            Upload your official university offer or appointment letter to complete the validation process.
          </p>
        </div>

        <div className="space-y-6">
          {/* Information Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong className="font-semibold">Required Document:</strong>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-xs">
                <li>Official university offer letter or appointment letter</li>
                <li>Must be in PDF format</li>
                <li>Maximum file size: 10MB</li>
                <li>Document should clearly show your supervisor assignment</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* File Upload Area */}
          <div className="space-y-3">
            <Label htmlFor="letter-upload">Upload Document</Label>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : selectedFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="letter-upload"
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-10 w-10 text-green-600" />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-green-900">{selectedFile.name}</p>
                    <p className="text-sm text-green-700">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    disabled={isUploading}
                    className="hover:bg-green-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Drop your PDF file here, or{' '}
                      <label
                        htmlFor="letter-upload"
                        className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                      >
                        browse
                      </label>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF only, max 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Uploading...' : 'Upload Letter'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

