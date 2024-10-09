import { fileAsyncTransport, logger } from "react-native-logs";
import * as FileSystem from "expo-file-system";

const fileLogger = logger.createLogger({
    transport: fileAsyncTransport,
    transportOptions: {
        FS: FileSystem,
        fileName: "logs.txt",
    },
});

const consoleLogger = logger.createLogger({
    transportOptions: {
        colors: {
            info: "blueBright",
            warn: "yellowBright",
            error: "redBright",
            debug: "white",
        },
    },
});

/**
 * A logger that logs to both the console and a file
 */
export const log = {
    info: (msg: string) => {
        fileLogger.info(msg);
        consoleLogger.info(msg);
    },
    warn: (msg: string) => {
        fileLogger.warn(msg);
        consoleLogger.warn(msg);
    },
    error: (msg: string) => {
        fileLogger.error(msg);
        consoleLogger.error(msg);
    },
    debug: (msg: string) => {
        fileLogger.debug(msg);
        consoleLogger.debug(msg);
    },
};
