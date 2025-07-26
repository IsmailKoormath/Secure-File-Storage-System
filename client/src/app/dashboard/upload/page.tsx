"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { uploadFiles } from "@/store/thunks/fileThunks";

interface FileWithProgress {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: any[];
    errors: any[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Generate unique ID for files
  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type === "application/pdf") return "📄";
    if (file.type.startsWith("video/")) return "🎥";
    if (file.type.startsWith("audio/")) return "🎵";
    if (file.type.includes("document") || file.type.includes("word"))
      return "📝";
    if (file.type.includes("spreadsheet") || file.type.includes("excel"))
      return "📊";
    return "📁";
  };

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList) => {
    const newFiles: FileWithProgress[] = Array.from(files).map((file) => ({
      file,
      id: generateFileId(),
      progress: 0,
      status: "pending",
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  // Remove file from list
  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Clear all files
  const clearAllFiles = () => {
    setSelectedFiles([]);
    setUploadResults(null);
  };

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadResults(null);

    // Update all files to uploading status
    setSelectedFiles((prev) =>
      prev.map((f) => ({ ...f, status: "uploading" as const }))
    );

    try {
      const filesToUpload = selectedFiles.map((f) => f.file);
      const result = await dispatch(uploadFiles(filesToUpload)).unwrap();

      // Update file statuses based on results
      setSelectedFiles((prev) =>
        prev.map((fileItem) => {
          const wasUploaded = result.files?.some(
            (uploaded: any) => uploaded.filename === fileItem.file.name
          );
          const hasError = result.errors?.some(
            (error: any) => error.filename === fileItem.file.name
          );

          return {
            ...fileItem,
            status: wasUploaded ? "success" : hasError ? "error" : "error",
            progress: 100,
            error: hasError
              ? result.errors?.find(
                  (e: any) => e.filename === fileItem.file.name
                )?.error
              : undefined,
          };
        })
      );

      setUploadResults({
        success: result.files || [],
        errors: result.errors || [],
      });

      // Auto-redirect if all files uploaded successfully
      if (
        result.files &&
        result.files.length === selectedFiles.length &&
        (!result.errors || result.errors.length === 0)
      ) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      setSelectedFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "error" as const,
          error: error.message || "Upload failed",
        }))
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Files</h1>
        <p className="text-gray-600">
          Select multiple files to upload to your vault
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">📁</span>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? "Drop files here" : "Choose files or drag and drop"}
            </p>
            <p className="text-gray-500 mt-1">
              Support for multiple files up to 10MB each
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            disabled={isUploading}
          >
            <span>📤</span>
            <span>Select Files</span>
          </button>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h2>
            <button
              onClick={clearAllFiles}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              disabled={isUploading}
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {selectedFiles.map((fileItem) => (
              <div
                key={fileItem.id}
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span className="text-2xl flex-shrink-0">
                      {getFileIcon(fileItem.file)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {fileItem.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status indicator */}
                    <div className="flex items-center space-x-2">
                      {fileItem.status === "pending" && (
                        <span className="text-gray-500 text-sm">Ready</span>
                      )}
                      {fileItem.status === "uploading" && (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-blue-600 text-sm">
                            Uploading...
                          </span>
                        </>
                      )}
                      {fileItem.status === "success" && (
                        <>
                          <span className="text-green-600 text-lg">✅</span>
                          <span className="text-green-600 text-sm">
                            Success
                          </span>
                        </>
                      )}
                      {fileItem.status === "error" && (
                        <>
                          <span className="text-red-600 text-lg">❌</span>
                          <span className="text-red-600 text-sm">Failed</span>
                        </>
                      )}
                    </div>

                    {/* Remove button */}
                    {fileItem.status === "pending" && (
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        disabled={isUploading}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </div>

                {/* Error message */}
                {fileItem.error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {fileItem.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading Files...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Upload {selectedFiles.length} Files</span>
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              disabled={isUploading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults && (
        <div className="mt-8 space-y-4">
          {uploadResults.success.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">
                ✅ Successfully uploaded {uploadResults.success.length} files
              </h3>
              <div className="text-sm text-green-700">
                Files are now available in your dashboard.
              </div>
            </div>
          )}

          {uploadResults.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">
                ❌ Failed to upload {uploadResults.errors.length} files
              </h3>
              <div className="text-sm text-red-700 space-y-1">
                {uploadResults.errors.map((error: any, index: number) => (
                  <div key={index}>
                    <strong>{error.filename}:</strong> {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
