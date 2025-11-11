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
    <div className="md:mt-6 w-full overflow-x-auto">
      <Table
        aria-label={ariaLabel}
        selectionMode={selectionMode}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onSelectionChange={(keys) => {
          const keyArray = Array.from(keys);
          setSelectedKey?.(keyArray[0]);
        }}
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn
              key={col.key}
              className="text-xs md:text-sm font-bold text-black whitespace-nowrap"
            >
              {col.label}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className="text-xs md:text-sm text-black"
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
