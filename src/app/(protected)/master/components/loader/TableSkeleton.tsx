const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2"
      ></div>
    ))}
  </div>
);

const TabContentLoader = () => (
  <div className="text-center py-8">
    <div className="three-body">
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mt-4">Memuat data...</p>
  </div>
);

export { TableSkeleton, TabContentLoader };
