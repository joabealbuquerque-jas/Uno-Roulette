export interface Segment {
  id: string;
  text: string;
  icon?: string;
  description: string;
  color: string;
  textColor?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface WheelState {
  isSpinning: boolean;
  rotation: number;
  winner: Segment | null;
}