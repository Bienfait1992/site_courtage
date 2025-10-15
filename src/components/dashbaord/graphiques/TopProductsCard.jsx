// 2️⃣ Top produits

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


export const TopProductsCard = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="font-semibold mb-2">Top 5 produits vendus</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="ventes" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
