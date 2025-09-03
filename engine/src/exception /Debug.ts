export class Debug {

  static error(message: string, target?: any) {

    if (target) {
      console.error(`[ERROR] ${message}`, target);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }

  static warn(message: string, target?: any) {
    const timestamp = new Date().toISOString();
    if (target) {
      console.warn(`[${timestamp}] [WARN] ${message}`, target);
    } else {
      console.warn(`[${timestamp}] [WARN] ${message}`);
    }
  }

  static info(message: string, target?: any) {
    const timestamp = new Date().toISOString();
    if (target) {
      console.info(`[${timestamp}] [INFO] ${message}`, target);
    } else {
      console.info(`[${timestamp}] [INFO] ${message}`);
    }
  }

  static debug(message: string, target?: any) {
    const timestamp = new Date().toISOString();
    if (target) {
      console.debug(`[${timestamp}] [DEBUG] ${message}`, target);
    } else {
      console.debug(`[${timestamp}] [DEBUG] ${message}`);
    }
  }
}
