"use client";

import { SPACE_ID } from "@/CONSTANTS";
import { M, mutators } from "@/replicache/mutators";
import { createContext, PropsWithChildren, useContext } from "react";
import { Replicache } from "replicache";
import { useReplicache } from "replicache-nextjs/lib/frontend";

interface ReplicacheContextInterface {
  rep: Replicache<M> | null;
}

const ReplicacheContext = createContext<ReplicacheContextInterface | undefined>(
  undefined
);

export const useReplicacheContext = () => {
  const context = useContext(ReplicacheContext);

  if (context === undefined) {
    throw new Error(
      "useReplicacheContext must be used within a useReplicacheContextProvider"
    );
  }

  return context;
};

// THIS IS NOT NEEDED I JUST ADDED IT HERE SO I CAN WRAP THE APP AROUND THIS
const ReplicacheContextProvider = (props: PropsWithChildren<{}>) => {
  const rep = useReplicache({ name: SPACE_ID, mutators });

  if (!rep) return null;

  return (
    <ReplicacheContext.Provider value={{ rep }}>
      {props.children}
    </ReplicacheContext.Provider>
  );
};

export default ReplicacheContextProvider;
