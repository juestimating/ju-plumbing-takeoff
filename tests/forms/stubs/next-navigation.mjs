export function redirect(url) {
  const e = new Error("NEXT_REDIRECT");
  e.digest = "NEXT_REDIRECT";
  e.url = url;
  throw e;
}
