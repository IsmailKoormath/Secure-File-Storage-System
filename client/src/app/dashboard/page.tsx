"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchFiles, deleteFile } from "@/store/thunks/fileThunks";
import ConfirmModal from "@/components/ConfirmModal";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { files, loading, error } = useSelector(
    (state: RootState) => state.files
  );
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<{
    id: string;
    filename: string;
  } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    const filterParam = activeFilter === "all" ? undefined : activeFilter;
    dispatch(fetchFiles(filterParam));
  }, [dispatch, activeFilter]);

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    setDeletingFileId(fileToDelete.id);
    try {
      await dispatch(deleteFile(fileToDelete.id)).unwrap();
      setFileToDelete(null);
    } catch (error) {
      console.error("Failed to delete file:", error);
    } finally {
      setDeletingFileId(null);
    }
  };

  const openDeleteModal = (fileId: string, filename: string) => {
    setFileToDelete({ id: fileId, filename });
  };

  const closeDeleteModal = () => {
    setFileToDelete(null);
  };

  // File type filters configuration
  const fileFilters = [
    { key: "all", label: "All Files", icon: "📁", mimeType: "" },
    { key: "image", label: "Images", icon: "🖼️", mimeType: "image" },
    {
      key: "application/pdf",
      label: "PDFs",
      icon: "📄",
      mimeType: "application/pdf",
    },
    {
      key: "application",
      label: "Documents",
      icon: "📝",
      mimeType: "application",
    },
    { key: "video", label: "Videos", icon: "🎥", mimeType: "video" },
    { key: "audio", label: "Audio", icon: "🎵", mimeType: "audio" },
  ];

  const handleFilterChange = (filterKey: string) => {
    setActiveFilter(filterKey);
  };

  const getFilteredFilesCount = () => {
    return files.length;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return "🖼️";
      case "mp4":
      case "mov":
      case "avi":
        return "🎥";
      case "mp3":
      case "wav":
      case "flac":
        return "🎵";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "zip":
      case "rar":
        return "🗃️";
      default:
        return "📁";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Files</h1>
            <p className="text-gray-600 mt-1">
              {getFilteredFilesCount()}{" "}
              {getFilteredFilesCount() === 1 ? "file" : "files"}
              {activeFilter !== "all" &&
                ` • Filtered by ${
                  fileFilters.find((f) => f.key === activeFilter)?.label
                }`}
            </p>
          </div>
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <span>➕</span>
            <span>Upload Files</span>
          </Link>
        </div>

        {/* File Type Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {fileFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeFilter === filter.key
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-200 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100 hover:text-gray-900"
                }`}
                disabled={loading}
              >
                <span className="text-lg">{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            {activeFilter === "all"
              ? "Loading files..."
              : `Loading ${fileFilters
                  .find((f) => f.key === activeFilter)
                  ?.label.toLowerCase()}...`}
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 text-lg mr-2">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {files.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">
              {fileFilters.find((f) => f.key === activeFilter)?.icon || "📁"}
            </span>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {activeFilter === "all"
              ? "No files yet"
              : `No ${fileFilters
                  .find((f) => f.key === activeFilter)
                  ?.label.toLowerCase()} found`}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeFilter === "all"
              ? "Upload your first file to get started"
              : `Try uploading some ${fileFilters
                  .find((f) => f.key === activeFilter)
                  ?.label.toLowerCase()} or change the filter`}
          </p>
          {activeFilter === "all" ? (
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              <span>➕</span>
              <span>Upload Files</span>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleFilterChange("all")}
                className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                <span>📁</span>
                <span>View All Files</span>
              </button>
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <span>➕</span>
                <span>Upload Files</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file: any) => (
            <div
              key={file._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden group"
            >
              {/* File Preview */}
              <div className="aspect-video bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {file.url &&
                file.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="text-4xl opacity-60">
                    {getFileIcon(file.filename)}
                  </div>
                )}

              </div>

              {/* File Info */}
              <div className="p-4">
                <h3
                  className="font-medium text-gray-900 truncate mb-2"
                  title={file.filename}
                >
                  {file.filename}
                </h3>

                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span>
                      {file.size ? formatFileSize(file.size) : "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Uploaded:</span>
                    <span>
                      {new Date(file.uploadedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 py-2 px-3 rounded-md hover:bg-blue-50"
                    >
                      <span>🔗</span>
                      <span>Open</span>
                    </a>
                    <button
                      onClick={() => openDeleteModal(file._id, file.filename)}
                      className="inline-flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200 py-2 px-3 rounded-md hover:bg-red-50"
                      disabled={deletingFileId === file._id}
                    >
                      {deletingFileId === file._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <span>🗑️</span>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!fileToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteFile}
        title="Delete File"
        message={`Are you sure you want to delete "${fileToDelete?.filename}"?`}
        confirmText="🗑️ Delete"
        cancelText="Cancel"
        isLoading={!!deletingFileId}
        variant="danger"
      />
    </div>
  );
}
