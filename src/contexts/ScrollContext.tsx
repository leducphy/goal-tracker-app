import React from "react";
import { Animated } from "react-native";

interface ScrollContextType {
  scrollY: Animated.Value;
  setScrolling: (isScrolling: boolean) => void;
}

// Create a context to track scrolling state globally
export const ScrollContext = React.createContext<ScrollContextType>({
  scrollY: new Animated.Value(0),
  setScrolling: () => {},
});

export default ScrollContext;
