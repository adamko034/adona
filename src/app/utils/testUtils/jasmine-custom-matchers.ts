export class JasmineCustomMatchers {
  public static toHaveBeenCalledTimesWith(spy: any, times: number, params: any) {
    expect(spy).toHaveBeenCalledTimes(times);
    expect(spy).toHaveBeenCalledWith(params);
  }
}
