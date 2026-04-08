import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { API_BASE } from "../constants";
import toast from "react-hot-toast";

export default function ResumeUpload({ onExtracted, onFormatAnalyzed, onRawText, onFileUploaded, className = "" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState("");

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setProgress(30);
      const token = localStorage.getItem("token");
      
      const { data } = await axios.post(`${API_BASE}/resumes/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 50) / (progressEvent.total || 1)
          );
          setProgress(30 + percentCompleted);
        },
      });

      setProgress(90);

      if (data.success && data.data) {
        if (onFileUploaded) {
          onFileUploaded(file);
        }
        onExtracted(data.data);
        if (onFormatAnalyzed && data.formatAnalysis) {
          onFormatAnalyzed(data.formatAnalysis);
        }
        if (onRawText && data.rawText) {
          onRawText(data.rawText);
          setRawText(data.rawText);
        }
        
        if (data.warning) {
          toast.warning(data.warning, { duration: 6000 });
        } else {
          toast.success("Resume parsed successfully!");
        }
      } else {
        toast.error("Failed to extract data from resume");
      }
    } catch (err) {
      console.error("Upload error:", err);
      let errorMsg = "Failed to upload resume";
      
      if (err.response) {
        // Server responded with error
        errorMsg = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request made but no response
        errorMsg = "No response from server. Please check your connection.";
      } else {
        // Error in request setup
        errorMsg = err.message || "Failed to upload resume";
      }
      
      toast.error(errorMsg, { duration: 5000 });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onExtracted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" 
            : isDragReject
            ? "border-red-500 bg-red-50 dark:bg-red-500/10"
            : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/50 bg-slate-50 dark:bg-slate-900"
          }
          ${uploading ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Parsing your resume...
            </p>
            <div className="w-full max-w-xs mx-auto h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">{progress}%</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isDragActive ? "Drop your resume here" : "Upload your resume"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag & drop a PDF file here, or click to browse
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              Maximum file size: 5MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}
