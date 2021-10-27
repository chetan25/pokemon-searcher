import { rest } from 'msw';

const DUMMY_DATA = [
    {
    "number": "1",
    "name": "Bulbasaur",
    "species": "Seed",
    "types": [
    "Grass",
    "Poison"
    ],
    "abilities": {
    "normal": [
    "Overgrow"
    ],
    "hidden": [
    "Chlorophyll"
    ]
    },
    "eggGroups": [
    "Monster",
    "Grass"
    ],
    "gender": [
    87.5,
    12.5
    ],
    "height": "2'04\"",
    "weight": "15.2 lbs.",
    "family": {
    "id": 1,
    "evolutionStage": 1,
    "evolutionLine": [
    "Bulbasaur",
    "Ivysaur",
    "Venusaur"
    ]
    },
    "starter": true,
    "legendary": false,
    "mythical": false,
    "ultraBeast": false,
    "mega": false,
    "gen": 1,
    "sprite": "https://cdn.traction.one/pokedex/pokemon/1.png",
    "description": "While it is young, it uses the nutrients that are stored in the seeds on its back in order to grow."
    }
];

export const handlers = [
    rest.get('/api/pokemon/:name', (req, res, ctx) => {
        const { name } = req.params;
        console.log('mocked fired')
      // Persist user's authentication in the session
    //   sessionStorage.setItem('is-authenticated', 'true')
      return res(
        ctx.json(DUMMY_DATA),
        ctx.status(200),
      )
    }),
    rest.get('https://pokeapi.glitch.me/v1/pokemonn/:name', (req, res, ctx) => {
        const { name } = req.params;
        console.log('mocked fired')
      // Persist user's authentication in the session
    //   sessionStorage.setItem('is-authenticated', 'true')
      setTimeout(() => {
        return res(
          ctx.json(DUMMY_DATA),
          ctx.status(200),
        )
      }, 200)
    }),
]
