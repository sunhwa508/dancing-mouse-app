export type Expression = 'happy' | 'excited' | 'silly' | 'cool' | 'wink';

export type Pose = {
  name: string;
  armL: number;
  armR: number;
  legL: number;
  legR: number;
  bodyTilt: number;
  bodyY: number;
  tail: string;
  expression: Expression;
  cheer: string;
};

const TAIL_RIGHT = 'M150,150 C175,140 185,120 175,95 C170,82 160,82 158,95';
const TAIL_LEFT = 'M50,150 C25,140 15,120 25,95 C30,82 40,82 42,95';
const TAIL_S = 'M150,155 C175,160 175,135 155,130 C140,127 145,110 165,108';
const TAIL_WIGGLE = 'M150,150 C180,150 175,125 158,120 C145,117 155,100 175,102';
const TAIL_UP = 'M150,148 C170,130 165,100 145,90 C135,85 130,98 138,108';
const TAIL_CURL = 'M50,150 C25,155 18,130 38,118 C50,112 45,98 30,100';
const TAIL_DOWN = 'M150,155 C170,170 180,180 160,185 C148,188 152,170 145,165';
const TAIL_FLICK = 'M50,148 C28,135 22,108 42,95 C55,87 60,100 50,110';

export const poses: Pose[] = [
  {
    name: 'arms-up',
    armL: -140,
    armR: 140,
    legL: -10,
    legR: 10,
    bodyTilt: 0,
    bodyY: 0,
    tail: TAIL_RIGHT,
    expression: 'excited',
    cheer: '신나게 흔들어요!',
  },
  {
    name: 'lean-right',
    armL: -40,
    armR: 70,
    legL: -20,
    legR: 30,
    bodyTilt: 8,
    bodyY: 0,
    tail: TAIL_S,
    expression: 'happy',
    cheer: '리듬을 타볼까요',
  },
  {
    name: 'jump',
    armL: -120,
    armR: 120,
    legL: -45,
    legR: 45,
    bodyTilt: 0,
    bodyY: -18,
    tail: TAIL_UP,
    expression: 'excited',
    cheer: '점프 점프!',
  },
  {
    name: 'lean-left',
    armL: -70,
    armR: 40,
    legL: -30,
    legR: 20,
    bodyTilt: -8,
    bodyY: 0,
    tail: TAIL_CURL,
    expression: 'silly',
    cheer: '왼쪽으로 살랑',
  },
  {
    name: 'kick',
    armL: -60,
    armR: -30,
    legL: -80,
    legR: 10,
    bodyTilt: -4,
    bodyY: 0,
    tail: TAIL_WIGGLE,
    expression: 'cool',
    cheer: '치즈처럼 부드럽게',
  },
  {
    name: 'peace',
    armL: -110,
    armR: 50,
    legL: -8,
    legR: 8,
    bodyTilt: 2,
    bodyY: 0,
    tail: TAIL_LEFT,
    expression: 'wink',
    cheer: '브이! 사진 한 장!',
  },
  {
    name: 'kick-right',
    armL: 30,
    armR: 60,
    legL: -10,
    legR: 80,
    bodyTilt: 4,
    bodyY: 0,
    tail: TAIL_FLICK,
    expression: 'cool',
    cheer: '발 차기 한 방!',
  },
  {
    name: 'spin',
    armL: -160,
    armR: 160,
    legL: -25,
    legR: 25,
    bodyTilt: 0,
    bodyY: -6,
    tail: TAIL_DOWN,
    expression: 'happy',
    cheer: '빙글빙글 회전!',
  },
];
