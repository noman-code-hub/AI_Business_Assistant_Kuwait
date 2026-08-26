export function getHeader(req: { header: (name: string) => string | undefined }, name: string) {
  return req.header(name)?.trim() || undefined;
}
