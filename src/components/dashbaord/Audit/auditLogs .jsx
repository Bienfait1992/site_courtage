import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const AuditLogs = ({ logs = [] }) => {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrer logs
  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV natif
  const exportCSV = (data, filename = "audit_logs.csv") => {
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join(",");
    const rows = data
      .map((obj) => Object.values(obj).map(val => `"${val}"`).join(","))
      .join("\n");
    const csvContent = [header, rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    link.click();
  };

  // Export PDF simple (HTML + print)
  const exportPDF = (data) => {
    if (data.length === 0) return;
    const newWindow = window.open();
    newWindow.document.write("<html><body><h3>Audit Logs</h3><table border='1' style='border-collapse: collapse;'>");
    newWindow.document.write("<tr>");
    Object.keys(data[0]).forEach((key) => {
      newWindow.document.write(`<th style="padding:5px;">${key}</th>`);
    });
    newWindow.document.write("</tr>");
    data.forEach((row) => {
      newWindow.document.write("<tr>");
      Object.values(row).forEach((val) => {
        newWindow.document.write(`<td style="padding:5px;">${val}</td>`);
      });
      newWindow.document.write("</tr>");
    });
    newWindow.document.write("</table></body></html>");
    newWindow.document.close();
    newWindow.print();
  };

  // Données pour le graphique camembert
  const chartData = ["connexion", "modification", "suppression"].map((type) => ({
    type,
    count: filteredLogs.filter((log) => log.action === type).length,
  }));

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h3 className="font-semibold mb-4">Audit Logs</h3>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Recherche utilisateur ou entité"
          className="border rounded p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="">Toutes les actions</option>
          <option value="connexion">Connexion</option>
          <option value="modification">Modification</option>
          <option value="suppression">Suppression</option>
        </select>

        <button
          onClick={() => exportCSV(filteredLogs)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportPDF(filteredLogs)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export PDF
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Utilisateur</th>
                <th className="p-2 border">Entité</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log, idx) => (
                <tr key={idx} className="text-center">
                  <td className="p-2 border">{log.action}</td>
                  <td className="p-2 border">{log.userName}</td>
                  <td className="p-2 border">{log.entity}</td>
                  <td className="p-2 border">{new Date(log.date).toLocaleString()}</td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-2">Aucun log trouvé</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${
                  page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Graphique camembert */}
        <div className="w-full lg:w-1/3 bg-white rounded shadow p-4">
          <h4 className="font-semibold mb-2">Répartition des actions</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
