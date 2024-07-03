
/**
 * 休眠毫秒
 * @param ms 
 * @returns 
 */
export function sleep_millisecond(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
