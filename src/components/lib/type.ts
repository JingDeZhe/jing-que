export type Point = {
  x: number
  y: number
}

export type Piece = {
  id: string
  color: string
  points: Point[]
}

export type Picture = Piece[]

export type Comic = {
  name: string
  pieces: Picture[]
}
