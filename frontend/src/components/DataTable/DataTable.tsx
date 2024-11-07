import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses} from '@mui/material';
import {styled} from "@mui/material/styles";

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


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2196f3",
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function DataTable({ columns, data }: BasicTableProps) {
  // console.log(columns);
  // console.log(data);
  return (
    <TableContainer component={Paper} sx={{boxShadow: 3}}>
      <Table sx={{ minWidth: '650px' }} aria-label="customized table" >
        <TableHead>
          <StyledTableRow>
            {columns.map((column) => (
              <StyledTableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                    <StyledTableCell key={colIndex} align={column.align}>
                      {row[colIndex]}
                    </StyledTableCell>
                ))}
              </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}