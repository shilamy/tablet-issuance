'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { generateTabletTemplate, generateParticipantTemplate, ImportError } from '@/lib/import';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: unknown[]) => void;
  type: 'tablets' | 'participants';
  importFunction: (csv: string) => { success: boolean; data: unknown[]; errors: ImportError[]; totalRows: number; importedCount: number };
}

export function ImportModal({ isOpen, onClose, onImport, type, importFunction }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    errors: ImportError[];
    totalRows: number;
    importedCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(extension)) {
      toast('Please upload a CSV or Excel file', 'error');
      return;
    }

    setFile(selectedFile);
    setImportResult(null);

    // Read file content for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPreview(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const dt = new DataTransfer();
      dt.items.add(droppedFile);
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
        fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const handleProcessImport = async () => {
    if (!file) {
      toast('Please select a file first', 'warning');
      return;
    }

    setIsProcessing(true);
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importFunction(content);
      setImportResult(result);
      setIsProcessing(false);

      if (result.importedCount > 0) {
        toast(`Successfully imported ${result.importedCount} ${type}!`, 'success');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importResult && importResult.importedCount > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const result = importFunction(content);
        onImport(result.data);
        handleClose();
      };
      reader.readAsText(file!);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setImportResult(null);
    onClose();
  };

  const handleDownloadTemplate = () => {
    const template = type === 'tablets' ? generateTabletTemplate() : generateParticipantTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Template downloaded!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-knbs-100 dark:bg-knbs-900/30 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-knbs-600 dark:text-knbs-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Import {type === 'tablets' ? 'Tablets' : 'Participants'}
              </h2>
              <p className="text-sm text-gray-500">Upload CSV or Excel file</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Download Template */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Need a template?</p>
                  <p className="text-sm text-gray-500">Download our sample CSV template</p>
                </div>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          {/* File Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              file
                ? "border-green-300 bg-green-50 dark:bg-green-950/20"
                : "border-gray-300 dark:border-gray-700 hover:border-knbs-400"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {file ? (
              <div className="space-y-3">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Drop your file here, or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-knbs-600 hover:underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports CSV, XLSX, XLS files
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</p>
              <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap font-mono">
                {preview}
              </pre>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className={cn(
              "rounded-xl p-4 border",
              importResult.success
                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30"
                : importResult.importedCount > 0
                  ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-900/30"
                  : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30"
            )}>
              <div className="flex items-start gap-3">
                {importResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {importResult.importedCount > 0
                      ? `Ready to import ${importResult.importedCount} of ${importResult.totalRows} records`
                      : importResult.success
                        ? 'All records imported successfully!'
                        : 'Import failed - please check your file format'}
                  </p>
                  
                  {importResult.errors.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {importResult.errors.length} error(s) found:
                      </p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        {importResult.errors.slice(0, 5).map((err, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="font-mono text-gray-400">Row {err.row}:</span>
                            <span>{err.message}</span>
                          </li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li className="text-gray-400">
                            ...and {importResult.errors.length - 5} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-bold transition-colors"
          >
            Cancel
          </button>
          
          {!importResult ? (
            <button
              onClick={handleProcessImport}
              disabled={!file || isProcessing}
              className="px-6 py-2.5 bg-knbs-500 hover:bg-knbs-600 disabled:bg-gray-300 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Process Import
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleConfirmImport}
              disabled={importResult.importedCount === 0}
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Import {importResult.importedCount} {type}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
