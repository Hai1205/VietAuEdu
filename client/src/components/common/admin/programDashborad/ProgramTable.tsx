import { DataTable } from "@/components/common/admin/DataTable";

interface ProgramTableProps {
  Programs: IProgram[];
  isLoading: boolean;
  onEdit?: (program: IProgram) => void;
  onDelete?: (programId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "inactive":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const ProgramTable = ({
  Programs,
  isLoading,
  onEdit,
}: ProgramTableProps) => {
  const columns = [
    {
      header: "STT",
      accessor: (_: IProgram, index: number) => index + 1,
    },
    {
      header: "Chương trình",
      accessor: (program: IProgram) => program.title,
    },
    {
      header: "Quốc gia",
      accessor: (program: IProgram) => program.country,
    },
    {
      header: "Thời gian",
      accessor: (program: IProgram) => program.duration,
    },
    {
      header: "Học phí",
      accessor: (program: IProgram) => program.tuition,
    },
    {
      header: "Nổi bật",
      accessor: (program: IProgram) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              program.featured ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="capitalize">{program.featured ? "Có" : "Không"}</span>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      accessor: (program: IProgram) => (
        <div className="inline-flex items-center justify-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${getStatusColor(program.status)}`}
          />
          <span className="capitalize">{program.status}</span>
        </div>
      ),
    },
  ];

  const actions = [];

  if (onEdit) {
    actions.push({
      label: "Chỉnh sửa",
      onClick: onEdit,
    });
  }

  return (
    <DataTable
      data={Programs}
      isLoading={isLoading}
      columns={columns}
      actions={actions}
      emptyMessage="No programs found"
    />
  );
};
