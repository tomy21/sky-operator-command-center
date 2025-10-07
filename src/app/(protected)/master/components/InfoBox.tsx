export default function InfoBox({ activeTab }: { activeTab: string }) {
  if (activeTab === "category") {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
        <h2 className="text-lg font-medium text-blue-700 dark:text-blue-400 mb-2">
          Manajemen Kategori
        </h2>
        <p className="text-blue-600/80 dark:text-blue-300/80">
          Halaman ini digunakan untuk mengelola kategori permasalahan yang dapat
          terjadi di gerbang. Setiap kategori akan menjadi pengelompokan utama
          untuk berbagai jenis permasalahan yang mungkin dihadapi.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
      <h2 className="text-lg font-medium text-green-700 dark:text-green-400 mb-2">
        Manajemen Deskripsi Permasalahan
      </h2>
      <p className="text-green-600/80 dark:text-green-300/80">
        Halaman ini memungkinkan Anda mengelola deskripsi detail dari setiap
        permasalahan. Setiap deskripsi terhubung dengan kategori tertentu dan
        memberikan penjelasan spesifik tentang jenis masalah yang dapat terjadi.
      </p>
    </div>
  );
}
