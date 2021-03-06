export class JasmineCustomMatchers {
  public static toHaveBeenCalledTimesWith(spy: any, times: number, ...params: any[]) {
    expect(spy).toHaveBeenCalledTimes(times);

    if (times > 0) {
      expect(spy).toHaveBeenCalledWith(...params);
    }
  }

  public static toBeFalsy(...values: any[]) {
    values.forEach(value => {
      expect(value).toBeFalsy();
    });
  }
}
