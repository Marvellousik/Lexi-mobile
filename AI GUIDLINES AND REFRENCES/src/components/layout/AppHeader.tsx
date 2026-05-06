import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors, typography } from '@/constants/colors';

interface AppHeaderProps {
  onMenuPress: () => void;
  onSettingsPress: () => void;
  onThemeToggle: () => void;
}

export function AppHeader({ onMenuPress, onSettingsPress, onThemeToggle }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* White status bar icons on green background */}
      <StatusBar style="light" backgroundColor={colors.brand.primary} />

      {/* Header extends into status bar area using paddingTop: insets.top */}
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.inner}>
          {/* LEFT — hamburger + logo + wordmark */}
          <View style={styles.left}>
            <TouchableOpacity
              style={styles.hitArea}
              onPress={onMenuPress}
              activeOpacity={0.7}
            >
              {/* Hamburger — 3 lines */}
              <View style={styles.hamburger}>
                <View style={styles.bar} />
                <View style={styles.bar} />
                <View style={styles.bar} />
              </View>
            </TouchableOpacity>

            {/* Logo icon placeholder — replace with <Image> of logo-white.svg */}
            <View style={styles.logoIcon} />

            <Text style={styles.wordmark}>LexiAssist</Text>
          </View>

          {/* RIGHT — settings + moon */}
          <View style={styles.right}>
            <TouchableOpacity style={styles.hitArea} onPress={onSettingsPress} activeOpacity={0.7}>
              {/* Settings gear — replace with icon library */}
              <Text style={styles.iconText}>⚙</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hitArea} onPress={onThemeToggle} activeOpacity={0.7}>
              {/* Moon — replace with icon library */}
              <Text style={styles.iconText}>☾</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand.primary,
    // No shadow — header sits flush, content scrolls under it
  },
  inner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hitArea: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburger: {
    gap: 5,
  },
  bar: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  logoIcon: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    // Replace with: <Image source={require('assets/images/logo-white.png')} style={{ width: 28, height: 28 }} />
  },
  wordmark: {
    ...typography.heading3,
    color: '#FFFFFF',
    fontSize: 18,
  },
  iconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});
