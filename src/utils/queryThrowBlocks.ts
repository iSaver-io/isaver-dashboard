export const queryThrowBlocks = async <T>(
  fetch: (from: number, to: number) => Promise<T[]>,
  { fromBlock, toBlock, step = 300_000 }: { fromBlock: number; toBlock: number; step?: number }
) => {
  const promises = [];
  for (let block = fromBlock; block <= toBlock; block += step) {
    const request = fetch(block, block + step);
    promises.push(request);
  }

  const promiseResults = await Promise.all(promises);

  return promiseResults.reduce((acc, result) => [...acc, ...result], []);
};
