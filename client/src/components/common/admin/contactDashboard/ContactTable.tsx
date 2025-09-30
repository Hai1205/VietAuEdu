import { DataTable } from "@/components/common/admin/DataTable";
import { formatDateAgo } from "@/lib/utils";

interface ContactTableProps {
  contacts: IContact[];
  isLoading: boolean;
  onViewDetails: (contact: IContact) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export function ContactTable({
  contacts,
  isLoading,
  onViewDetails,
}: ContactTableProps) {
  const columns = [
    {
      header: "STT",
      accessor: (contact: IContact, index: number) => index + 1,
    },
    {
      header: "User",
      accessor: (contact: IContact) => contact?.name || "",
    },
    {
      header: "Program",
      accessor: (contact: IContact) => contact?.program || "",
    },
    {
      header: "Submit Date",
      accessor: (contact: IContact) => formatDateAgo(contact?.createdAt || ""),
    },
    {
      header: "Status",
      accessor: (contact: IContact) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${getStatusColor(
              contact?.status || ""
            )}`}
          />
          <span className="capitalize">{contact.status}</span>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={contacts}
      isLoading={isLoading}
      columns={columns}
      actions={[
        {
          label: "View",
          onClick: onViewDetails,
        },
      ]}
    />
  );
}
