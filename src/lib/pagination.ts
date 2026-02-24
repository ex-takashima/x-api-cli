export interface PaginatedResult<T> {
  data: T[];
  meta?: {
    nextToken?: string;
    resultCount?: number;
  };
}

export async function collectPages<T>(
  fetcher: (nextToken?: string) => Promise<PaginatedResult<T>>,
  maxItems: number,
): Promise<T[]> {
  const items: T[] = [];
  let nextToken: string | undefined;

  while (items.length < maxItems) {
    const result = await fetcher(nextToken);

    if (result.data) {
      items.push(...result.data);
    }

    nextToken = result.meta?.nextToken;
    if (!nextToken || !result.data?.length) break;
  }

  return items.slice(0, maxItems);
}
