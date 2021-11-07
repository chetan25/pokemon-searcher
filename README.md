---
title: Pokémon Search.
excerpt: This is a simple Pokémon search app that uses free Rest API to get data.
Tools: ['NEXT JS', 'React', 'XState', 'Typescript', 'MSW', 'Model Based Testing']
---

# Pokémon Searcher
Search a Pokémon and get the vital facts about it. 

*** Note - We are using a amazing free API service https://pokeapi.glitch.me/v1/pokemon  ***

### How the app works

This is a simple app where a user types the Pokémon name in order to get the details. We have mapped certain states in this workflow and added some UI features for it. The State management is done using `XState`, since it lets us map the finite state in a very descriptive manner. Plus the XState visualizer is an amazing tool. 


#### Local Development
- For local development we are using MSW in order to mock the API response and not send unnecessary data to the rest API.
- MSW is an amazing tool that can be used for local development and testing.
  
#### Production 
- Here we are using the live API service "https://pokeapi.glitch.me/v1/pokemon".
- In order to limit the same request to the API we have added some local cache in the NextJS BE, that is a simple Object Hash Map.

#### User Workflow 
- User enters the name of the Pokémon and hits submit.
- We validate the input, simply by checking the length and then fire the request.
- If show a placeholder for the time the request is in flight and then depending on the response show results or error.

#### Testing 
- We have used model based testing approach since it works well with our XState state model. 
- In this approach we use the state model and try to run through all the possible paths of the state graph.


##### Learning from Model Based Testing
  Since it was a new concept, so the start was pretty rough. But eventually things started to make more sense. Here are the few things I learned -

  - We need a separate test machine instance to build up our test model. 
  - This instance is separate than the instance we use in our component.
  - We just need to make sure the machine definition is the same.
  - To start we need to define the event config object that would hold all the possible events the can occur in our machine. 
  - Basically in this  event config we are manually triggering the events.
  - Then we need the test cases for all the states we want to test.
  - These are basically UI assertions that we want to make.
  - We add the testing meta data manually to the machine instance, just to keep the testing details separate.
  - Since the directed state graph could go for infinite combination if we don't have a end state, we use filters to limit the combination.
  - Most importantly we need to remember `effects don't run in test` so we need don't need to mock our API calls, but we do need to resolve the actions in those effects for proper state transitions.
  - 

