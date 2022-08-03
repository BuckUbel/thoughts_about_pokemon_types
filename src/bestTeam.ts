import {makeArrayUnique} from "./helper/default";
import {names as pTypeNames, chartMap as pTypeChartMap} from "./data/data.json";
import {PTeam, PType, PTypeContent} from "./types/PTypeTypes";

function getAllPTypes(): PType[] {
  return pTypeNames.map((name, id) => {
    return {id, name}
  })
}

const pTypeContents: PTypeContent[] = pTypeChartMap.map((pTypeChart, pTypeChartIndex): PTypeContent => {

  let atk = 0;
  let def = 0;
  let value = 0;
  const strengths: PType[] = [];
  const weaknesses: PType[] = [];

  pTypeChart.forEach((typeChartValue, typeChartValueIndex) => {
    atk = atk + typeChartValue;
    if (typeChartValue > 1) {
      strengths.push({id: typeChartValueIndex, name: pTypeNames[typeChartValueIndex]});
    }
    if (typeChartValue < 1) {
      weaknesses.push({id: typeChartValueIndex, name: pTypeNames[typeChartValueIndex]});
    }
  });

  pTypeChartMap.forEach((pTypeChart2) => {
    def = def + pTypeChart2[pTypeChartIndex];
  });

  value = atk - def;

  return {
    value: value,
    id: pTypeChartIndex,
    name: pTypeNames[pTypeChartIndex],
    atk: atk,
    def: def,
    strengths: strengths,
    weaknesses: weaknesses,
  }
}).sort((a, b) => b.value - a.value);

function testValues(testArray: PTypeContent[]): [PType[], PType[]] {

  const allStrengths: { [index: number]: string } = {};
  const allStrengthIds: number[] = [];
  const allWeaknesses: { [index: number]: string } = {};
  const allWeaknessIds: number[] = [];

  testArray.map((v) => {
    v.strengths.forEach((w) => {
      allStrengths[w.id] = w.name;
      allStrengthIds.push(w.id);
    })
    v.weaknesses.forEach((w) => {
      allWeaknesses[w.id] = w.name;
      allWeaknessIds.push(w.id);
    })
  });

  const uniqueAllStrengthIds = allStrengthIds.filter(makeArrayUnique);
  const uniqueAllWeaknessIds = allWeaknessIds.filter(makeArrayUnique);

  const filteredUniqueAllStrengthIds: PType[] = [];
  const filteredUniqueAllWeaknessIds: PType[] = [];

  for (let i = 0; i < pTypeNames.length; i++) {
    if (!uniqueAllStrengthIds.includes(i)) {
      filteredUniqueAllStrengthIds.push({id: i, name: pTypeNames[i]});
    }
    if (!uniqueAllWeaknessIds.includes(i)) {
      filteredUniqueAllWeaknessIds.push({id: i, name: pTypeNames[i]});
    }
  }

  return [filteredUniqueAllStrengthIds, filteredUniqueAllWeaknessIds];
  // console.log(Object.keys(allStrengths).length, allStrengths,
  // filteredUniqueAllStrengthIds); // decrease
  // console.log(Object.keys(allWeaknesses).length, allWeaknesses,
  // filteredUniqueAllWeaknessIds); // increase
}

type bestTeamTypeForm = "strongest" | "lessWeakest" | "bestOfBoth"

export function calcBestTeamTypes(bestTeamTypeForm:bestTeamTypeForm = "bestOfBoth") {

// TODO: Improve algorithm to use not only >1 and <1 - use the factor as real value as *
// TODO: Improve algorithm to check double types
// TODO: Improve algorithm with the most common types
// TODO: Improve algorithm to display the best results with same values (same strengthLength and weaknessLength

  let resultChange = 0;
  const myResults: PTeam[] = [];
  let bestResult: PTeam = {
    team: [],
    strength: [],
    weakness: getAllPTypes()
  };

  for (let a1 = 0; a1 < pTypeNames.length; a1++) {
    for (let a2 = a1; a2 < pTypeNames.length; a2++) {
      for (let a3 = a2; a3 < pTypeNames.length; a3++) {
        for (let a4 = a3; a4 < pTypeNames.length; a4++) {
          for (let a5 = a4; a5 < pTypeNames.length; a5++) {
            for (let a6 = a5; a6 < pTypeNames.length; a6++) {
              let testArray: PTypeContent[] = Object.assign([] as PTypeContent[], [pTypeContents[a1], pTypeContents[a2], pTypeContents[a3], pTypeContents[a4], pTypeContents[a5], pTypeContents[a6]]);
              const stepResult = testValues(testArray);
              const stepStrength = stepResult[0].length
              const stepWeakness = stepResult[1].length
              const leastWeaknessesCondition = bestTeamTypeForm === "lessWeakest" && (bestResult.weakness.length > stepWeakness || stepWeakness === 0);
              const mostStrengthsCondition = bestTeamTypeForm === "strongest" && (bestResult.strength.length < stepStrength);
              const mixtureCondition = bestTeamTypeForm === "bestOfBoth" && (bestResult.strength.length - bestResult.weakness.length < stepStrength - stepWeakness);

              if (leastWeaknessesCondition || mostStrengthsCondition || mixtureCondition) {
                resultChange = resultChange + 1;
                bestResult = {
                  team: [pTypeNames[a1], pTypeNames[a2], pTypeNames[a3], pTypeNames[a4], pTypeNames[a5], pTypeNames[a6]],
                  strength: stepResult[0],
                  weakness: stepResult[1],
                };
                myResults.push(bestResult);
                console.log("Change: ", resultChange);
                console.log("Team: ", bestResult.team);
                console.log("Strength: ", bestResult.strength.length);
                console.log("Weakness: ", bestResult.weakness.length);
              }
            }
          }
        }
      }
    }
  }

  console.log(myResults.sort((a, b) => {
    return b.weakness.length - a.weakness.length
  })[myResults.length - 2]);
}
