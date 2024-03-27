import React, { useState } from 'react';
import { View, PanResponder, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DataItem[];
  size: number;
}

export const DemoPieChart: React.FC<Props> = ({ data, size }) => {
  const [rotation, setRotation] = useState<number>(0);

  const handleMove = (_:any, gestureState:any) => {
    const { moveX, moveY, x0, y0 } = gestureState;
    const angle = Math.atan2(moveY - y0, moveX - x0) * (180 / Math.PI);
    setRotation(angle);
  };

  const handleSegmentClick = (index: number) => {
    console.log('Sección clickeada:', index);
  };

  const renderSegments = () => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let startAngle = rotation;

    return data.map((item, index) => {
      const endAngle = startAngle + (item.value / total) * 360;
      const startRadians = startAngle * (Math.PI / 180);
      const endRadians = endAngle * (Math.PI / 180);
      const x1 = size / 2 + size / 2 * Math.cos(startRadians);
      const y1 = size / 2 + size / 2 * Math.sin(startRadians);
      const x2 = size / 2 + size / 2 * Math.cos(endRadians);
      const y2 = size / 2 + size / 2 * Math.sin(endRadians);
      const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
      const pathData = `
        M ${size / 2} ${size / 2}
        L ${x1} ${y1}
        A ${size / 2} ${size / 2} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      startAngle = endAngle;

      return (
        <TouchableOpacity key={index} onPress={() => handleSegmentClick(index)}>
          <Path d={pathData} fill={item.color} />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {renderSegments()}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});


