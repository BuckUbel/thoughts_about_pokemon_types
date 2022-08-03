import {PType, PTypeContent} from "../types/PTypeTypes";
import {chartMap as pTypeChartMap, names as pTypeNames} from "./data.json";
import {transposeMap} from "../helper/default";

export const PTypeContentIdMap: { [id: number]: PTypeContent } = {}

function getPTypeContents(chartMap: number[][]): PTypeContent[]{
  return chartMap.map((pTypeChart, pTypeChartIndex): PTypeContent => {

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

    chartMap.forEach((pTypeChart2) => {
      def = def + pTypeChart2[pTypeChartIndex];
    });

    value = atk - def;

    const pTypeContent = {
      value: value,
      id: pTypeChartIndex,
      name: pTypeNames[pTypeChartIndex],
      atk: atk,
      def: def,
      strengths: strengths,
      weaknesses: weaknesses,
    }

    PTypeContentIdMap[pTypeChartIndex] = pTypeContent;
    return pTypeContent
  }).sort((a, b) => b.value - a.value);
}

export const PTypeContents = getPTypeContents(pTypeChartMap)
const defPTypeChartMap = transposeMap(pTypeChartMap);
export const PTypeContentsDef = getPTypeContents(defPTypeChartMap)

