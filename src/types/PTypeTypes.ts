
export interface PType {
  id: number;
  name: string
}

export interface PTypeContent extends PType {
  id: number,
  name: string,
  value: number,
  atk: number,
  def: number,
  strengths: PType[],
  weaknesses: PType[],
}

export interface PTeam {
  team: string[],
  strength: PType[],
  weakness: PType[],
}
