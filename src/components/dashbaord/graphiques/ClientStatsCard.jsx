// ClientStatsCard.jsx
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";



// 3️⃣ Statistiques clients (Pie)
export const ClientStatsCard = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="font-semibold mb-2">Segments clients</h3>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);