// TablePage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // or your routing library
import { Typography } from "@material-tailwind/react";
import DataTable from "../../components/DataTable/DataTable";

interface Table {
  table_name: string;
  table_description?: string;
  column_headers: string[];
  rows: string[][];
}

const TablePage: React.FC = ({table}: {table: Table}) => {
  if (!table) {
    return <div>Table not found.</div>;
  }

  return (
    <div>
      <Typography className="text-xl font-bold">{table.table_name}</Typography>
      {table.table_description && (
        <Typography variant="paragraph" className="mb-4">
          {table.table_description}
        </Typography>
      )}
      <DataTable
        columns={table.column_headers.map((header: string) => ({
          id: header,
          label: header,
        }))}
        data={table.rows}
      />
    </div>
  );
};

export default TablePage;
