import React from 'react';
import { Image } from 'react-native';

const IconProvider = (source:any) => ({
  toReactElement: ({ animation, ...props }:any) => (
    <Image {...props} source={source} />
  ),
});

export const AssetIconsPack = {
  name: 'assets',
  icons: {
    'pokeball': IconProvider(require('../../assets/pokeball.png')),
    'pause': IconProvider(require('../../assets/pause.png')),
    'stop': IconProvider(require('../../assets/stop.png')),
  },
};