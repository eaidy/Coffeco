import { ImageBackground as NativeBackground, ImageBackgroundProps as NativeBackgroundProps } from "react-native";
import { Theme } from "@/themes";
import { createBox } from "@shopify/restyle";

const ImageBackground = createBox<Theme, NativeBackgroundProps>(NativeBackground);
export type ImageBackgroundProps = React.ComponentProps<typeof ImageBackground>

export default ImageBackground;