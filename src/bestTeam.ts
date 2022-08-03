import {makeArrayUnique} from "./helper/default";
import {names as pTypeNames} from "./data/data.json";
import {PTeam, PType, PTypeContent} from "./types/PTypeTypes";
import {PTypeContents, PTypeContentsDef} from "./data/prepareData";

function getAllPTypes(): PType[] {
  return pTypeNames.map((name, id) => {
    return {id, name}
  })
}

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

type bestTeamTypeFormType = "strongest" | "lessWeakest" | "bestOfBoth"
type readingFormType = "atk" | "def";

export function calcBestTeamTypes(bestTeamTypeForm: bestTeamTypeFormType = "bestOfBoth", readingForm: readingFormType = "def") {

// TODO: Improve algorithm to use not only >1 and <1 - use the factor as real value as *
// TODO: Improve algorithm to check double types
// TODO: Improve algorithm with the most common types
// TODO: Improve algorithm to display the best results with same values (same strengthLength and weaknessLength
  console.log("Calc...")
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
              let testArray: PTypeContent[] = []
              if (readingForm === "def") {
                testArray = Object.assign([] as PTypeContent[], [PTypeContentsDef[a1], PTypeContentsDef[a2], PTypeContentsDef[a3], PTypeContentsDef[a4], PTypeContentsDef[a5], PTypeContentsDef[a6]]);
              }
              if (readingForm === "atk") {
                testArray = Object.assign([] as PTypeContent[], [PTypeContents[a1], PTypeContents[a2], PTypeContents[a3], PTypeContents[a4], PTypeContents[a5], PTypeContents[a6]]);
              }
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
                // console.log("Change: ", resultChange);
                // console.log("Team: ", bestResult.team);
                // console.log("Strength: ", bestResult.strength.length);
                // console.log("Weakness: ", bestResult.weakness.length);
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
