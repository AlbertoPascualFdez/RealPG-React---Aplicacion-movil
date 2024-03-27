import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Button, Text } from '@ui-kitten/components';

interface Props{
    visible: boolean,
    msg: string,
    resetToast: () => void,
    time?: number
}
export const Toast = ({ visible, msg, resetToast, time= 3000 }:Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Ocultar el toast automáticamente después de 2 segundos
      const timer = setTimeout(() => {
        hideToast();
      }, time);

      // Limpieza del temporizador en el desmontaje
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    resetToast();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: 'absolute',
        width:"auto",
        bottom: 50,
        alignSelf:"center",
 /*        left: 20,
        right: 20, */
        padding: 15,
        backgroundColor: '#333',
        borderRadius: 10,
        zIndex: 9999,
      }}
    >
      <Text style={{ color: '#fff', textAlign:"center" }}>{msg}</Text>
    </Animated.View>
  );
};