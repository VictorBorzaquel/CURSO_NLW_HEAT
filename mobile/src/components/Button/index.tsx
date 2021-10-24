import React from 'react';
import { 
  ActivityIndicator,
  ColorValue, 
  Text, 
  TouchableOpacity, 
  TouchableOpacityProps
} from 'react-native';
import { styles } from './styles';
import { AntDesign } from '@expo/vector-icons';

type Props = TouchableOpacityProps & {
  title: string;
  color: ColorValue;
  backgroundColor: ColorValue;
  icon?: React.ComponentProps<typeof AntDesign>['name'];
  isLoading?: boolean;
}

export function Button({
  color, 
  title, 
  backgroundColor, 
  icon, 
  isLoading, 
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      {...rest} 
      style={[styles.button, { backgroundColor }]}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      
      {isLoading
        ? <ActivityIndicator color={color} />
        : (
          <>
            {!!icon && <AntDesign name={icon} size={24} style={styles.icon} />}
            <Text style={[styles.title, { color }]}>{title}</Text>
          </>
        )
      }
    </TouchableOpacity>
  );
}
