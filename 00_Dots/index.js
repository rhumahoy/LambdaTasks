const dots = (str) => {
  let result = [str[0]];

  for (let i = 1; i < str.length; i++) {
    const tmp = [...result];
    
    for (let j = 0; j < result.length; j++) {
      tmp.push(result[j] + '.');
    }

    result = tmp.map(l => l + str[i]);
  }

  return result;
}

console.log(dots('abc'));