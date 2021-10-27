// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import axios from 'axios';

type Data = {
  pokemon?: {}[];
  error?: string;
};

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function initMiddleware(middleware: any) {
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

const serverPokemonCache = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
   // Run cors
   await cors(req, res);
  if (req.method === 'GET') {
    const { query: { name } } = req

    try {
      if (serverPokemonCache.hasOwnProperty(name as string)) {
        // @ts-ignore
        return res.json({pokemon : serverPokemonCache[name]})
      }

      const response = await axios.get<{}[]>(`https://pokeapi.glitch.me/v1/pokemon/${name}`);
      // const data = await response.json();
      console.log('external server called', name)
          
      if (response.status === 200) {
        // @ts-ignore
        serverPokemonCache[name] =  response.data;
        return res.json({pokemon : response.data})
      }
      return res.status(500).json({ error: 'Error fetching Pokemon data from external source' });
    } catch(e) {
      return res.status(500).json({ error: 'Error fetching Pokemon data from external source' });
    }
  }
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