import { useState } from "react";
import Image from "next/image";

export function PreviewableImage({ imageUrl }: { imageUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        className="relative w-28 h-28 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          src={imageUrl}
          alt="bukti pembayaran"
          className="w-full h-full object-cover rounded-lg border"
          width={112}
          height={112}
        />
      </div>

      {/* Modal preview */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <Image
              src={imageUrl}
              alt="bukti pembayaran full"
              className="w-auto h-auto max-h-[90vh] rounded-lg shadow-lg"
              width={800}
              height={800}
            />
          </div>
        </div>
      )}
    </>
  );
}
