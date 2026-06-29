// Renders a JSON-LD <script> for structured data (SEO rich results).
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input is interpolated raw.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
