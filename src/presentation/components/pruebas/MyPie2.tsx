import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
// Asegúrate de importar correctamente el componente PanRotateView

export interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DataItem[];
  isSwiping: boolean;
}

export const MyPie2: React.FC<Props> = ({ data, isSwiping }) => {
  const handleSegmentClick = (index: number) => {
    if (!isSwiping) {
      console.log('Sección clickeada:', index);
    }
  };

  const renderSegments = () => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let startAngle = 0;

    return data.map((item, index) => {
      const endAngle = startAngle + (item.value / total) * 360;
      const pathData = describeArc(90, 90, 70, startAngle, endAngle);

      startAngle = endAngle;

      return (
        <TouchableOpacity key={index} onPress={() => handleSegmentClick(index)} >
          <Path d={pathData} fill={item.color} />
        </TouchableOpacity>
      );
    });
  };

  // Función auxiliar para generar la descripción de un arco de círculo
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const startRadians = (startAngle - 90) * Math.PI / 180;
    const endRadians = (endAngle - 90) * Math.PI / 180;
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    const x1 = x + radius * Math.cos(startRadians);
    const y1 = y + radius * Math.sin(startRadians);
    const x2 = x + radius * Math.cos(endRadians);
    const y2 = y + radius * Math.sin(endRadians);

    return `M ${x} ${y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <Svg width="180" height="180">
      <G>
        {renderSegments()}
      </G>
    </Svg>
  );
};
