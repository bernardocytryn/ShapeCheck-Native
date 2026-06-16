import { Image, View, StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "../../../theme/colors";

const ImagemPasso = ({ imagemSource }) => {
  const { width } = useWindowDimensions();
  const imageWidth = Math.min(width - 48, 410);
  const imageHeight = imageWidth * (233 / 410);

  if (!imagemSource) {
    return (
      <View
        style={[
          styles.imagem,
          styles.placeholder,
          { width: imageWidth, height: imageHeight },
        ]}
      />
    );
  }

  return (
    <Image
      style={[styles.imagem, { width: imageWidth, height: imageHeight }]}
      source={imagemSource}
      resizeMode="cover"
      accessibilityLabel="imagem-pergunta"
    />
  );
};

const styles = StyleSheet.create({
  imagem: {
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 8,
  },
  placeholder: {
    backgroundColor: colors.card2,
  },
});

export default ImagemPasso;
