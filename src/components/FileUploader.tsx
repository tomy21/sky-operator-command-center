import { Upload } from "lucide-react";

type FileUploaderProps = {
  rowId: number;
  onFileSelect: (id: number, file: File) => Promise<string>;
};

export function FileUploader({ rowId, onFileSelect }: FileUploaderProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await onFileSelect(rowId, f);
    window.location.reload(); // supaya langsung refresh data table
  };

  return (
    <div>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        id={`file-${rowId}`}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => document.getElementById(`file-${rowId}`)?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 justify-center m-auto"
      >
        <Upload className="w-4 h-4" />
        Pilih File
      </button>
    </div>
  );
}
