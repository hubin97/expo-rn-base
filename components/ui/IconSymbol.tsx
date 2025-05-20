// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols 到 Material Icons 的映射关系
 * @see https://developer.apple.com/sf-symbols/ SF Symbols
 * @see https://icons.expo.fyi/MaterialIcons Material Icons
 */
const MAPPING = {
  // 导航和标签栏图标
  'house.fill': 'home',
  'folder.fill': 'folder',
  'globe': 'public',
  'gearshape.fill': 'settings',
  'person.fill': 'person',
  
  // 操作和状态图标
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.up': 'keyboard-arrow-up',
  'chevron.down': 'keyboard-arrow-down',
  'plus': 'add',
  'minus': 'remove',
  'xmark': 'close',
  'checkmark': 'check',
  'star.fill': 'star',
  'heart.fill': 'favorite',
  'bookmark.fill': 'bookmark',
  
  // 媒体控制图标
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'stop.fill': 'stop',
  'forward.fill': 'fast-forward',
  'backward.fill': 'fast-rewind',
  
  // 系统图标
  'wifi': 'wifi',
  'battery.100': 'battery-full',
  'bell.fill': 'notifications',
  'envelope.fill': 'mail',
  'phone.fill': 'phone',
  'message.fill': 'message',
  'camera.fill': 'camera-alt',
  'photo.fill': 'photo',
  'mic.fill': 'mic',
  'location.fill': 'location-on',
  
  // 编辑图标
  'pencil': 'edit',
  'trash.fill': 'delete',
  'square.and.pencil': 'create',
  'doc.fill': 'description',
  'folder.fill.badge.plus': 'create-new-folder',
  
  // 分享和社交图标
  'square.and.arrow.up': 'share',
  'link': 'link',
  'person.2.fill': 'people',
  'person.3.fill': 'group',
  
  // 设置和更多图标
  'ellipsis': 'more-horiz',
  'ellipsis.circle.fill': 'more-vert',
  'gear': 'settings',
  'slider.horizontal.3': 'tune',
  'arrow.clockwise': 'refresh',
  'arrow.counterclockwise': 'undo',
  'arrow.up.arrow.down': 'swap-vert',
  'arrow.left.arrow.right': 'swap-horiz',
} as IconMapping;

/**
 * 统一的图标组件
 * - iOS: 使用 SF Symbols
 * - Android: 使用 Material Icons
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle | ViewStyle>;
  weight?: SymbolWeight;
}) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        weight={weight}
        tintColor={color}
        resizeMode="scaleAspectFit"
        name={name}
        style={[
          {
            width: size,
            height: size,
          },
          style as StyleProp<ViewStyle>,
        ]}
      />
    );
  }
  
  return <MaterialIcons name={MAPPING[name]} size={size} color={color} style={style as StyleProp<TextStyle>} />;
}
