export class TwodDebug {

  public static log(val: any) {

    if (val?.toString) {
      console.log(val.toString());
    }
    console.log(val);
  }
}