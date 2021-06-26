// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addUrlParam(url: string, param: string, value: any): string {
  let returnUrl = url;
  if (url.indexOf('?') === -1) {
    returnUrl = `${returnUrl}?`;
  } else {
    returnUrl = `${returnUrl}&`;
  }
  returnUrl = `${returnUrl}${param}=${value}`;
  return returnUrl;
}
