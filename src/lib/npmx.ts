import * as s from "remix/data-schema";

const PackageMetaSchema = s.object({
  description: s.string(),
  weeklyDownloads: s
    .number()
    .refine(Number.isInteger, "Expected integer"),
});

export type PackageMeta = s.InferOutput<typeof PackageMetaSchema>;

export async function packageMeta(pkg: string, signal?: AbortSignal) {
  const response = await fetch(
    `https://npmx.dev/api/registry/package-meta/${pkg}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch package meta: ${response.status}`);
  }

  return s.parse(PackageMetaSchema, await response.json());
}
