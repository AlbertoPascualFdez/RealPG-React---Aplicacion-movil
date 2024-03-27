export interface Pokemon{
    idEvolChain: number,
    level: number,
    evolutions: EvolutionInfo[],
    evolutionLevels: number[],
    levelExperience: number
}

export interface EvolutionInfo{
    name: string,
    imageUrl: string
}