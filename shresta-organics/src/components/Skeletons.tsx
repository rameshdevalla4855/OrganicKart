'use client';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center space-x-2">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto" />
        </div>
        <div className="h-12 bg-gray-200 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-gray-50 animate-pulse">
          <td className="px-6 py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="ml-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
          <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-16 ml-auto" /></td>
        </tr>
      ))}
    </>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
