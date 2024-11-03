import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined; // Text alignment
}

type DataRow = (string | number)[];

interface BasicTableProps {
  columns: Column[];
  data: DataRow[];
}


export default function BasicTable({ columns, data }: BasicTableProps) {
  // console.log(columns);
  // console.log(data);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} align={column.align}>
                      {row[colIndex]}
                    </TableCell>
                ))}
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}