export enum CharSetType {
  STANDARD = 'STANDARD',
  SIMPLE = 'SIMPLE',
  BLOCK = 'BLOCK',
  COMPLEX = 'COMPLEX',
}

export interface AsciiOptions {
  width: number;
  contrast: number;
  inverted: boolean;
  charSet: CharSetType;
  brightness: number;
}

export interface GenerationResult {
  text: string;
  source: 'ALGORITHM' | 'AI';
}

export const CHAR_SETS: Record<CharSetType, string> = {
  [CharSetType.STANDARD]: '@%#*+=-:. ',
  [CharSetType.SIMPLE]: '#. ',
  [CharSetType.BLOCK]: '█▓▒░ ',
  [CharSetType.COMPLEX]: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
};

// Popular fonts from http://patorjk.com/software/taag/
export const FIGLET_FONTS = [
  { name: 'Standard', id: 'Standard' },
  { name: 'ANSI Shadow', id: 'ANSI Shadow' },
  { name: '3D Diagonal', id: '3D Diagonal' },
  { name: 'Big', id: 'Big' },
  { name: 'Slant', id: 'Slant' },
  { name: 'Doom', id: 'Doom' },
  { name: 'Graffiti', id: 'Graffiti' },
  { name: 'Electronic', id: 'Electronic' },
  { name: 'Cyberlarge', id: 'Cyberlarge' },
  { name: 'Banner3', id: 'Banner3' },
  { name: 'Block', id: 'Block' },
  { name: 'Bubble', id: 'Bubble' },
  { name: 'Ivrit', id: 'Ivrit' },
  { name: 'Lean', id: 'Lean' },
  { name: 'Mini', id: 'Mini' },
  { name: 'Script', id: 'Script' },
  { name: 'Shadow', id: 'Shadow' },
  { name: 'Small', id: 'Small' },
  { name: 'Speed', id: 'Speed' },
  { name: 'Star Wars', id: 'Star Wars' },
  { name: 'Stop', id: 'Stop' },
];