export default function ThreeDotsLoader() {
  return (
    <div className="text-center py-4 p-6">
      <div className="three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 blink-smooth">
        Memuat data...
      </p>
    </div>
  );
}