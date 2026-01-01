import { Segment } from './types';

// Uno Official Colors
export const COLORS = {
  RED: '#FF5555',
  BLUE: '#5555FF',
  GREEN: '#55AA55',
  YELLOW: '#FFAA00',
  BLACK: '#000000', // Wild
};

export const DEFAULT_SEGMENTS: Segment[] = [
  { id: '1', text: '+2 Cartas', icon: '✌️', description: 'O próximo jogador compra 2 cartas e perde a vez.', color: COLORS.RED },
  { id: '2', text: 'Pular Vez', icon: '🚫', description: 'O próximo jogador perde a vez.', color: COLORS.BLUE },
  { id: '3', text: 'Inverter', icon: '🔄', description: 'A ordem do jogo inverte.', color: COLORS.GREEN },
  { id: '4', text: 'Coringa', icon: '🎨', description: 'Escolha a próxima cor do jogo.', color: COLORS.BLACK },
  { id: '5', text: '+4 Cartas', icon: '🍀', description: 'O próximo compra 4 cartas, perde a vez e você escolhe a cor.', color: COLORS.YELLOW },
  { id: '6', text: 'Troca Cor', icon: '🃏', description: 'Descarte uma carta de qualquer cor.', color: COLORS.BLACK },
];

export const MIN_SEGMENTS = 5;