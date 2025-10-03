import { useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function PandaFace() {
  const eyeBallAnimation = useRef(new Animated.Value(8)).current;

  const handlePandaEyes = () => {
    Animated.timing(eyeBallAnimation, {
      toValue: 20,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const handleResetPandaEyes = () => {
    Animated.timing(eyeBallAnimation, {
      toValue: 8,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.panda}>
      <View style={[styles.pandaEar, styles.leftEar]}></View>
      <View style={[styles.pandaEar, styles.rightEar]}></View>
      <View style={styles.pandaFace}>
        <View style={styles.pandaEyes}>
          <View style={[styles.pandaEye, styles.leftEye]}>
            <Animated.View
              style={[styles.eyeLens, { marginTop: eyeBallAnimation }]}
            ></Animated.View>
          </View>
          <View style={[styles.pandaBlush, styles.leftBlush]}></View>

          <View style={[styles.pandaEye, styles.rightEye]}>
            <Animated.View
              style={[styles.eyeLens, { marginTop: eyeBallAnimation }]}
            ></Animated.View>
          </View>
          <View style={[styles.pandaBlush, styles.rightBlush]}></View>
        </View>

        <View style={styles.pandaMouth}>
          <View style={styles.nose}></View>
          <View style={[styles.pandLips, styles.leftLips]}></View>
          <View style={[styles.pandLips, styles.rightLips]}></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panda: {
    width: 350,
    position: 'relative',
    marginLeft: 20,
    marginRight: 20,
  },
  pandaFace: {
    width: 134.4,
    height: 120,
    margin: 'auto',
    borderWidth: 2.5,
    borderColor: '#2e0d30',
    backgroundColor: '#fff',
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderBottomLeftRadius: 89.92,
    borderBottomRightRadius: 89.92,
  },
  pandaEar: {
    width: 40.96,
    height: 40,
    position: 'absolute',
    top: '-6%',
    zIndex: -1,
    borderWidth: 2.88,
    borderColor: '#2e0d30',
    backgroundColor: '#3f3554',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  leftEar: {
    left: '30%',
    transform: [{ rotate: '-38deg' }],
  },
  rightEar: {
    right: '30%',
    transform: [{ rotate: '38deg' }],
  },
  pandaEyes: {
    height: 35,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative',
    top: '20%',
  },
  pandaEye: {
    width: 32,
    height: 34.88,
    borderRadius: 32,
    position: 'relative',
    backgroundColor: '#3f3554',
  },
  leftEye: {
    transform: [{ rotate: '-20deg' }],
  },
  rightEye: {
    transform: [{ rotate: '20deg' }],
  },
  eyeLens: {
    width: 9,
    height: 9,
    margin: 'auto',
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  pandaBlush: {
    width: 21.92,
    height: 16,
    borderRadius: 50,
    backgroundColor: '#ff8bb1',
    position: 'absolute',
    top: '83%',
    zIndex: -1,
  },
  leftBlush: {
    left: 16,
    transform: [{ rotate: '25deg' }],
  },
  rightBlush: {
    right: 16,
    transform: [{ rotate: '-25deg' }],
  },
  pandaMouth: {
    margin: 'auto',
    marginBottom: 18,
    display: 'flex',
    flexDirection: 'row',
  },
  pandLips: {
    width: 20,
    height: 23,
    borderColor: '#3f3554',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  leftLips: {
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  rightLips: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  nose: {
    width: 15,
    height: 15,
    backgroundColor: '#3f3554',
    position: 'absolute',
    top: '-30%',
    left: '10%',
    borderTopLeftRadius: 100,
    transform: [{ rotate: '45deg' }],
  },
});