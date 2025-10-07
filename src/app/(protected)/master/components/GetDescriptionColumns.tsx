import { Column } from "@/components/tables/CommonTable";
import { Description } from "@/hooks/useDescriptions";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import formatTanggalUTC from "@/utils/formatDate";

// fungsi getDescriptionColumns
export const getDescriptionColumns = (
  descriptions: Description[],
  categories: { id: number; category: string }[],
  descriptionPagination: { currentPage: number; itemsPerPage: number },
  handleEditDescription: (id: number) => void,
  handleDelete: (id: number) => void
): Column<Description>[] => [
  {
    header: "No",
    accessor: "id",
    render: (_value, item) => {
      const index = descriptions.findIndex((desc) => desc.id === item.id);
      return (
        (descriptionPagination.currentPage - 1) *
          descriptionPagination.itemsPerPage +
        index +
        1
      );
    },
  },
  {
    header: "Name",
    accessor: "object",
  },
  {
    header: "Kategori",
    accessor: "id_category",
    render: (value) => {
      const category = categories.find((cat) => cat.id === value);
      return category ? category.category : value;
    },
  },
  {
    header: "Tanggal Dibuat",
    accessor: "createdAt",
    render: (value) => (value ? formatTanggalUTC(value.toString()) : ""),
  },
  {
    header: "Action",
    accessor: "id",
    render: (_value, item) => (
      <div className="flex space-x-2">
        <button
          className="cursor-pointer p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"
          onClick={() => handleEditDescription(item.id)}
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
