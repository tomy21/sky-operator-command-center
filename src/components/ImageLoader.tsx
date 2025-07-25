import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

const ImageWithLoader = ({
  src,
  alt,
  width = 420,
  height = 220,
  className = "",
  fallbackSrc = "/images/no-image-found-360x250.png",
  priority = false,
}: ImageWithLoaderProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(false);
    setCurrentSrc(src);
  }, [src]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Memuat gambar...
            </span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="flex flex-col items-center p-4 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Gagal memuat gambar <br /> Tidak ada gambar ditemukan
            </span>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <Image
        src={error ? fallbackSrc : currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-lg object-cover ${
          loading || error ? "opacity-0" : "opacity-100"
        }`}
        style={{ width: "100%", height: "100%" }}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        priority={priority}
      />
    </div>
  );
};

export default ImageWithLoader;
