import React from "react";
import { IcInbox } from "../assets/icons.jsx";

/* Reusable data table.
   columns: [{ key, label, render?(row), align?, mono? }]
   rows:    array of objects
   rowClass?: (row) => string  (e.g. to flag discrepancy rows red)
*/
export default function DataTable({ columns, rows, rowClass, emptyLabel = "No records to show" }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="empty">
        <IcInbox />
        <div className="t">{emptyLabel}</div>
      </div>
    );
  }
  // console.log("heeiiii   ",rows, "  col ", columns);
  
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align || "left" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
          
            
            <tr key={row.id || i} className={rowClass ? rowClass(row) : ""}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{ textAlign: c.align || "left" }}
                  className={c.mono ? "cell-num" : ""}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
