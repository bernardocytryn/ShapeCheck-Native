# ShapeCheck — React Native (Expo)

Aplicativo mobile convertido do projeto React Web original.

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha as chaves:

```
EXPO_PUBLIC_RAPIDAPI_KEY=
EXPO_PUBLIC_MISTRAL_API_KEY=
```

## Executar

```bash
npx expo start
```

## Assets

Adicione as imagens do wizard em `src/assets/`:
- `casa_academia.png`
- `nivel_treino.png`
- `frequencia_treino.png`
- `logoshapecheck.png`

Adicione ícones do Expo em `assets/`:
- `icon.png` (1024x1024)
- `splash.png`
- `adaptive-icon.png`

## Dependências principais

- Expo SDK 53
- React Navigation (stack + bottom tabs)
- AsyncStorage (substitui localStorage)
- react-native-gifted-charts (substitui MUI X Charts)
- react-native-reanimated + gesture-handler (substitui framer-motion)
- expo-camera / expo-image-picker (substitui getUserMedia e input file)
- expo-av (substitui tag video HTML)
