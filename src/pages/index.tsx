import Image from "next/image";
import { Inter } from "next/font/google";
import React, { Suspense } from "react";
import { endpoints, useGetPokemonByNameQuery, util } from "src/store/services/pokemon";

const inter = Inter({ subsets: ["latin"] });

export interface Pokemon {
  id: number;
  name: string;
}

export const Pokemon = React.memo(function _Pokemon({ id }: { id: string | number }){
  const { data, error, isLoading } = useGetPokemonByNameQuery(id.toString());

  if(isLoading) return (<>{"Loading data..."}</>);

  return (
    <>
      {data && (
        <div className="flex flex-col text-center">
          <span className="font-bold">{data.id}</span>
          {data.name}
          <img
            className="w-32"
            src={data.sprites.other["official-artwork"]["front_default"]}
          />
        </div>
      )}
    </>
  );
});

export default function Home() {
  const [pokemonList, setPokemonList] = React.useState<Array<string>>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value);
      setPokemonList([...pokemonList, inputRef.current.value]);
    }
  };

  React.useEffect(() => {

    const fullPokeList = [];
    for(let i = 1; i <= 30; i++)
      fullPokeList.push(i.toString());
    
    setPokemonList(fullPokeList);
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-25 ${inter.className}`}
    >
      <div className="flex flex-row">
        <input ref={inputRef} type="text" />
        <button onClick={handleSubmit} type="submit">
          Search
        </button>
      </div>

      <div className="flex flex-row flex-1 flex-wrap">
        {pokemonList.map((_item, idx) => {
          console.log(_item);
          return <Pokemon id={_item} key={idx} />;
        })}
      </div>
    </main>
  );
}
