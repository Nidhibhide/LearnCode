import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  user,
} from "@heroui/react";

function TableComponent({
  columns = [],
  rows = [],
  selectedKey = null,
  setSelectedKey = () => {},
  selectionMode = "single",
  ariaLabel = "Data Table",
}) {
  return (
    <div className="w-auto">
      <Table
        aria-label={ariaLabel}
        selectionMode={selectionMode}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onSelectionChange={(keys) => {
          const keyArray = Array.from(keys);
          setSelectedKey?.(keyArray[0]);
        }}
        classNames={{
          wrapper: "bg-white border border-gray-200 rounded-xl",
          th: "bg-gray-100 text-gray-700 text-sm font-semibold",
          td: "text-gray-800 text-sm",
        }}
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn
              key={col.key}
              className={`text-xs md:text-sm font-bold text-black whitespace-nowrap ${col.width || ""}`}
            >
              {col.label}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className="text-sm md:text-base text-black"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableComponent;
