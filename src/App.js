import React, { useCallback, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ZoomPlugin from 'chartjs-plugin-zoom';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ZoomPlugin
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Data latency monitoring (ms)',
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'x',
      },
      pan: {
        enabled: true,
        modifierKey: 'alt'
      },
    }
  },
};

export const splitArray = (arr, len) => {
  const chunks = [];
  let i = 0;
  const n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }
  return chunks;
};

export const [dataSize, chunkSize] = [216_000, 1000];

const App = () => {
  const [selectedChunk, setSelectedChunk] = useState(0);

  const changeSelectedChunk = useCallback((e) => {
    const { value } = e.target;
    setSelectedChunk(value);
  }, []);

  const labels = useMemo(() => {
    return splitArray([...Array(dataSize).keys()], chunkSize);
  }, []);

  const data = useMemo(() => {
    return {
      labels: labels[selectedChunk],
      datasets: [
        {
          label: 'P1',
          data: labels[selectedChunk].map(() => faker.datatype.float({ min: 0, max: 0 })),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'P2',
          data: labels[selectedChunk].map(() => faker.datatype.float({ min: 1.9, max: 2.8 })),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    }
  }, [labels, selectedChunk]);

  return (<>

    <div style={{ padding: 90 }}>
      Select Chunk: <select onChange={changeSelectedChunk}>
        {([...Array(dataSize / chunkSize).keys()]).map((label) => (<option key={label} value={label}>{label + 1}</option>))}
      </select>
      <div style={{ fontWeight: 'bold', fontSize: 12, margin: '10px 0' }}>
        Guide: Zoom (Mouse Wheel), Pan (keep alt + right-click)
      </div>
      <Line options={options} data={data} />
    </div>
  </>);
}

export default App;