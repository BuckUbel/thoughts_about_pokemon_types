import {PTypeContentIdMap, PTypeContentsDef} from "./data/prepareData";

export function calcPossibleStarterTypes(onlyNewOnes = false) {
  const starterTypePossibilities: [number, number, number][] = [];
  PTypeContentsDef.forEach((startPType) => {
    const weakIds = startPType.weaknesses.map(t => t.id)
    startPType.strengths.forEach((pType) => {
      PTypeContentIdMap[pType.id].strengths.forEach((pType2) => {
        const pType2StrengthIds = PTypeContentIdMap[pType2.id].strengths.map(t => t.id)

        if (pType2StrengthIds.includes(startPType.id) && weakIds.includes(pType2.id)) {
          let ids: [number, number, number] = [startPType.id, pType.id, pType2.id];
          ids = ids.sort();
          const idString = ids.join("");
          if (starterTypePossibilities.findIndex(pos => pos.join("") === idString) === -1)
            starterTypePossibilities.push(ids);
        }
      })
    })

  })
  let all3Teams = starterTypePossibilities.map(types => types.map(id => PTypeContentIdMap[id].name));
  if (onlyNewOnes) {
    all3Teams = all3Teams.filter((team) => !team.includes("Pflanze") && !team.includes("Wasser") && !team.includes("Feuer"));
  }

  console.log(all3Teams)
  console.log("Count:", all3Teams.length)
}
