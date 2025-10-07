/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "@/components/tables/CommonTable";
import { formatTanggalLocal } from "@/utils/formatDate"; // asumsi interface User
import { User } from "@/hooks/useAuth";

interface UserPagination {
  currentPage: number;
  itemsPerPage: number;
}

export const getUsersColumns = (
  users: User[],
  userPagination: UserPagination
): Column<User>[] => [
  {
    header: "No",
    accessor: "id",
    render: (value, item) => {
      const index = users.findIndex((u) => u.id === item.id);
      return (
        (userPagination.currentPage - 1) * userPagination.itemsPerPage +
        index +
        1
      );
    },
  },
  {
    header: "Nama",
    accessor: "name",
  },
  {
    header: "Username",
    accessor: "username",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Role",
    accessor: "role",
    render: (value: string | number) => {
      switch (value) {
        case 1:
          return "Admin";
        case 2:
          return "Super Admin";
        default:
          return "-";
      }
    },
  },
  {
    header: "Terakhir Aktif",
    accessor: "lastActive",
    render: (value: any) => (value ? formatTanggalLocal(value.toString()) : ""),
  },
  {
    header: "Status Panggilan",
    accessor: "inCall",
    render: (value: string | number) => {
      switch (value) {
        case 0:
          return "Tidak Ada";
        case 1:
          return "Daring";
        default:
          return "-";
      }
    },
  },
];
