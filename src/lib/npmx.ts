import * as Effect from "mini-effect";
import * as Fetch from "mini-effect/fetch";
import * as Schema from "mini-effect/schema";

const PackageMetaSchema = Schema.object({
  description: Schema.string(),
  weeklyDownloads: Schema.pipe(Schema.number(), Schema.integer()),
});

export type PackageMeta = Schema.InferOutput<typeof PackageMetaSchema>;

const PackageMetaUnavailable = Effect.failure("PackageMetaUnavailable");

export const packageMeta = (pkg: string) =>
  Fetch.request(`https://npmx.dev/api/registry/package-meta/${pkg}`)
    .pipe(Fetch.json, Schema.validate(PackageMetaSchema))
    .pipe(
      Effect.catchTags({
        FailedToFetch: (cause) =>
          Effect.fail(new PackageMetaUnavailable({ cause })),
        FailedToRead: (cause) =>
          Effect.fail(new PackageMetaUnavailable({ cause })),
        FailedToValidate: (cause) =>
          Effect.fail(new PackageMetaUnavailable({ cause })),
      }),
    );
