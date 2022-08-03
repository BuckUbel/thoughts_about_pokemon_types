export function makeArrayUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function transposeMap(array: any[]) {
  return array.map((_, colIndex) => array.map(row => row[colIndex]));
}
