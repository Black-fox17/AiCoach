import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WorkoutSession } from '../types';

interface ProgressChartProps {
  data: WorkoutSession[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="accuracy"
            stroke="#8884d8"
            name="Form Accuracy (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="calories"
            stroke="#82ca9d"
            name="Calories Burned"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;