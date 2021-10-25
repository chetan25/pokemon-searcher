// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}


const categories = [
  "starter",
  "legendary",
  "mythical",
  "ultraBeast",
  "mega"
];

const eggGroups = [
  "Bug",
  "Ditto",
  "Dragon",
  "Fairy",
  "Field",
  "Flying",
  "Grass",
  "Gender unknown",
  "Human-Like",
  "Mineral",
  "Monster",
  "Amorphous",
  "Undiscovered",
  "Water 1",
  "Water 2",
  "Water 3"
];

const types = [
  "Bug",
  "Dark",
  "Dragon",
  "Electric",
  "Fairy",
  "Fighting",
  "Fire",
  "Flying",
  "Ghost",
  "Grass",
  "Ground",
  "Ice",
  "Normal",
  "Poison",
  "Psychic",
  "Rock",
  "Steel",
  "Water"
];