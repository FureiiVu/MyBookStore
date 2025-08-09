import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface ImageUploadProps {
  preview: string | null;
  onPreviewChange: (preview: string | null) => void;
  onFileChange?: (file: File | null) => void;
}

export const ImageUpload = ({
  preview,
  onPreviewChange,
  onFileChange,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      onPreviewChange(url);
      onFileChange?.(file);
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onPreviewChange(null);
    onFileChange?.(null);
  };

  return (
    <div className="flex items-start gap-4">
      <div className={`flex-1 ${preview ? "h-40" : "h-auto"}`}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className={`flex items-center justify-center border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
            preview ? "h-full" : "p-4"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Click để tải ảnh lên</span>
          </div>
        </label>
      </div>
      {preview && (
        <div className="w-32 h-40 relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
