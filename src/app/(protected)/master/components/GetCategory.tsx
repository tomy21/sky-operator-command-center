/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "@/components/tables/CommonTable";
import { Category } from "@/hooks/useCategories";
import formatTanggalUTC from "@/utils/formatDate";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export const getCategoryColumns = (
  categories: Category[],
  categoryPagination: { currentPage: number; itemsPerPage: number },
  handleEditCategory: (id: number) => void,
  handleDelete: (id: number) => void
): Column<Category>[] => [
  {
    header: "No",
    accessor: "id",
    render: (value, item) => {
      const index = categories.findIndex((cat) => cat.id === item.id);
      return (
        (categoryPagination.currentPage - 1) * categoryPagination.itemsPerPage +
        index +
        1
      );
    },
  },
  {
    header: "Kategori",
    accessor: "category",
  },
  {
    header: "Dibuat Oleh",
    accessor: "createdBy",
  },
  {
    header: "Tanggal Dibuat",
    accessor: "createdAt",
    render: (value: any) => (value ? formatTanggalUTC(value.toString()) : ""),
  },
  {
    header: "Aksi",
    accessor: "id",
    render: (value: any, item: Category) => (
      <div className="flex space-x-2">
        <button
          className="cursor-pointer p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"
          onClick={() => handleEditCategory(item.id)}
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={() => handleDelete(item.id)}
          className="cursor-pointer p-2 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    ),
  },
];
