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
          wrapper: "bg-surface border border-border rounded-xl",
          th: "bg-surfaceAlt text-textPrimary text-sm font-semibold",
          td: "text-textPrimary text-sm",
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
            <TableRow key={row._id} className="hover:bg-surfaceAlt">
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
