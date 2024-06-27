import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

// Custom Cell Renderer (Display logos based on cell value)
const CompanyLogoRenderer = ({ value }) => (
  <span
    style={{
      display: "flex",
      height: "100%",
      width: "100%",
      alignItems: "center",
  }}
  >
    {value && (
      <img 
      alt={`${value} Flag`}
      src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
      style={{
        display:"block",
        width: "25px",
        height: "auto",
        maxHeight: "50%",
        marginRight: "12px",
        filter: "brightness(1.1)",
      }}
    />
    )}
    
    <p
      style={{
        textOverflow: "ellipsis",
        overflow:"hidden",
        whiteSpace: "nowrap"
      }}
    >
    </p>
 </span>
);
/* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
const MissionResultRenderer = ({ value }) => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      height: "100%",
      alignItems: "center",
    }}
  >
    {
      <img
        alt={`${value}`}
        src={`https://www.ag-grid.com/example-assets/icons/${value ? "tick-in-circle" : "cross-in-circle"}.png`}
        style={{ width: "auto", height: "auto" }}
      />
    }
  </span>
)

/* Format Date Cells */
const dateFormatter = (params) => {
  return new Date(params.value).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Create new GridExample component
const GridExample = () => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState([
    {
      field: "mission",
      width: 150,
      checkboxSelection: true,
    },
    {
      field: "company",
      width: 130,
      cellRenderer: CompanyLogoRenderer,
    },
    {
      field: "location",
      width: 225,
    },
    {
      field: "date",
      valueFormatter: dateFormatter,
    },
    {
      field: "price",
      width: 130,
      valueFormatter: (params) => {
        return "$" + params.value.toLocaleString();
      },
    },
    {
      field: "successful",
      width: 120,
      cellRenderer: MissionResultRenderer,
    },
    { field: "rocket" },
  ]);

  // Fetch json data & update rowData state
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/space-mission-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  // Apply settings across all columns
  const defaultColDef = useMemo(() => ({
    filter: true,
    editable: true,
  }),[]);

  // Container: Defines the grid's theme & dimensions.
  return (
    <div
      className={
        "ag-theme-quartz-dark"
      }
      style={{ width: "100%", height: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        rowSelection="multiple"
        onSelectionChanged={(event) => console.log("Row Selected!")}
        onCellValueChanged={(event) =>
          console.log(`New Cell Value: ${event.value}`)
        }
      />
    </div>
  );
};
const root = createRoot(document.getElementById("root"));
root.render(<GridExample />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
