import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Pokemon, TeamPokemon } from "src/types/pokemon";
import { v4 as uuid4 } from "uuid";

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  tagTypes: ["Pokemon"],
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonTeam: builder.query<Array<TeamPokemon>, null>({
      query: () => `http://localhost:8000/pokemons`,
      providesTags: (result) => result ? [...result.map((_item) => ({ type: "Pokemon", id: _item.id } as const)), { type: "Pokemon", id: "LIST" }] : [{ type: "Pokemon", id: "LIST" }]
    }),
    addPokemonToTeam: builder.mutation<Array<Pokemon>, string>({
      query: (pokemonId) => (
        {
          url: `http://localhost:8000/pokemons`,
          method: `post`,
          body: {
            id: uuid4(),
            pokemonId: pokemonId,
            dateAdd: Date.now()
          }
        }),
      invalidatesTags: (result, error, id) => [{ type: "Pokemon", id: "LIST" }]
    }),
    removePokemonFromTeam: builder.mutation<any, string>({
      query: (id) => ({
        url: `http://localhost:8000/pokemons/${id}`,
        method: "delete",
      }),
      invalidatesTags: [{type: "Pokemon", id: "LIST"}]
    }),
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery, util, endpoints, useAddPokemonToTeamMutation, useGetPokemonTeamQuery, useRemovePokemonFromTeamMutation } = pokemonApi