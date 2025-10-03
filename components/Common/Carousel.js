import { useState, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, Image, View, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Carousel = ({ images }) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % images.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          setActiveIndex(nextIndex);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activeIndex, images.length]);

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  const RenderImage = ({ image }) => (
    <View>
      <Image
        source={image}
        style={{ height: 200, width: screenWidth }}
        resizeMode="contain"
      />
    </View>
  );

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.floor(scrollPosition / screenWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const renderScrollIndicators = () =>
    images.map((_, index) => (
      <View
        key={index}
        style={[carouselStyle.dot, {backgroundColor: activeIndex === index ? '#e32f45' : '#222'}]}
      />
    ));

  return (
    <View style={carouselStyle.carouselContainer}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <RenderImage image={item.link} />}
        ref={flatListRef}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16} 
      />
      <View style={carouselStyle.scrollIndicatorContainer}>
        {renderScrollIndicators()}
      </View>
    </View>
  );
};

const carouselStyle = StyleSheet.create({
  carouselContainer: {
    backgroundColor: '#F2F2F7',
  },
  scrollIndicatorContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    height: 6,
    width: 33,
    borderRadius: 3,
    marginHorizontal: 6,
  },
});

export default Carousel;