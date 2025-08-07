import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  preview: string | null;
  onPreviewChange: (preview: string | null) => void;
}

export const ImageUpload = ({ preview, onPreviewChange }: ImageUploadProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className={`flex-1 ${preview ? "h-40" : "h-auto"}`}>
        <div
          className={`flex items-center justify-center border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors ${
            preview ? "h-full" : "p-4"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              Kéo thả hoặc click để tải ảnh lên
            </span>
          </div>
        </div>
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
            onClick={() => onPreviewChange(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
