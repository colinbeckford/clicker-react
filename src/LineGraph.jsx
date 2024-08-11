import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const LineGraph = ({ data }) => {
  const transformedData = Object.keys(data).map((judge) =>
    data[judge].map((point) => ({
      second: point.second,
      score: point.score,
      judge: judge,
    }))
  );

  const flattenedData = transformedData.flat();

  const maxSecond = Math.max(
    ...Object.keys(data).flatMap(judge =>
      data[judge].map(point => point.second)
    )
  );
  const increment = 10;
  const maxTickValue = Math.ceil(maxSecond / increment) * increment;
  const xTicks = [];
  for (let i = 0; i <= maxTickValue; i += increment) {
    xTicks.push(i);
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={flattenedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="second"
          ticks={xTicks}
          domain={[0, maxTickValue]}
          tickFormatter={(tick) => tick} 
        />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data).map((judge, index) => (
          <Line
            key={judge}
            type="monotone"
            dataKey="score"
            data={transformedData[index]}
            name={judge}
            stroke={`hsl(${index * 60}, 70%, 50%)`}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph;
