import Image from "next/image";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import { endpoints, useAddPokemonToTeamMutation, useGetPokemonByNameQuery, useGetPokemonTeamQuery, useRemovePokemonFromTeamMutation, util } from "src/store/services/pokemon";

const inter = Inter({ subsets: ["latin"] });


export const Pokemon = React.memo(function _Pokemon({ id, pokemonId }: { id: string, pokemonId: string }) {
  const [skipApi, setSkipApi] = React.useState(true);
  const { data, error, isUninitialized, isLoading, refetch } = useGetPokemonByNameQuery(pokemonId, {skip: skipApi});
  const [ removePokemonTrigger ] = useRemovePokemonFromTeamMutation();

  if (isLoading || isUninitialized) return (<div onClick={() => setSkipApi(_value => !_value)}>{"Loading data..."}</div>);

  const removePokemonFromTeam = () => {
    removePokemonTrigger(id);
  }

  return (
    <>
      {data && (
        <div className="flex w-fit outline outline-1 outline-slate-300 flex-row text-center">
          <div>
            <img
              className="w-16 rounded-full"
              src={data.sprites?.other["official-artwork"]["front_default"]}
            />
          </div>
          <div className="flex flex-1 flex-col align-center justify-center">
            <span className="font-bold">{data.id}</span>
            {data.name}
          </div>
          <div className="flex flex-col flex-none">
            <button onClick={removePokemonFromTeam}>X</button>
            <button onClick={refetch}>o</button>
          </div>
        </div>
      )}
    </>
  );
});

export default function Home() {
  const {data, isLoading, isSuccess} = useGetPokemonTeamQuery(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [addPokemonToTeam] = useAddPokemonToTeamMutation();

  const handleSubmit = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value);
      addPokemonToTeam(inputRef.current.value);  
    }
  };

  console.log(data);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-25 ${inter.className}`}
    >
      <div className="flex flex-row space-x-2">
        <input ref={inputRef} onKeyDown={(event) => {if(event.key === 'Enter') handleSubmit()}} type="text" />
        <button onClick={handleSubmit} type="submit">
          Add to team
        </button>
      </div>

      <div className="my-4 w-full gap-3 flex flex-row flex-0 flex-wrap">
        {isSuccess && data?.map((_item, idx) => {
          console.log(_item);
          return <Pokemon pokemonId={_item.pokemonId} id={_item.id} key={_item.id} />
        })}
      </div>
    </main>
  );
}
