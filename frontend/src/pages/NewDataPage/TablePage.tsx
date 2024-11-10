import {Typography} from "@material-tailwind/react";
import DataTable from "../../components/DataTable/DataTable";
import {Alert} from "@mui/material";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import Stack from "@mui/material/Stack";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface Table {
    index: number;
  table_name: string;
  table_description?: string;
  column_headers: string[];
  rows: string[][];
}

interface TablePageProps {
  table: Table;
}

const TablePage: React.FC<TablePageProps> = ({table}: {table: Table}) => {
    if (!table) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Typography className="text-lg text-gray-600">
                    Select a table from the sidebar to view data
                </Typography>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center p-10">
            <Typography className="text-3xl font-bold mb-4">{table.table_name}</Typography>
            {table.table_description && (
                <Alert severity="info" icon={<AutoAwesomeOutlinedIcon/>} className="mb-4" sx={{
                    borderRadius: 4,
                    width : "100%",
                    boxShadow: 1,
                }}>
                    <Stack spacing={2}>
                        <Typography variant="h6" className="font-medium">
                            AI-Generated Table Description
                        </Typography>
                        <Typography variant="paragraph" className="text-black">
                            {table.table_description}
                        </Typography>
                    </Stack>
                </Alert>
            )}
            <DataTable
                columns={table.column_headers.map((header: string) => ({
                    id: header,
                    label: header,
                }))}
                data={table.rows}
            />
            <Alert variant="outlined" icon={<PriorityHighIcon/>} severity="warning" className="m-4" sx={{
                    width : "100%",
                }}>
                Only the first 100 rows are displayed.
            </Alert>
        </div>
    );
};


export default TablePage;
