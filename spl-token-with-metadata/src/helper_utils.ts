import { Keypair } from "@solana/web3.js";
import fs from 'fs';
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";



export function get_SecretKey(filePath: string) {
    const keyData = fs.readFileSync(filePath, 'utf-8');

    let secretKey: Uint8Array;
    try {
        secretKey = Uint8Array.from(JSON.parse(keyData));
    } catch (ex) {
        if (typeof keyData !== 'string')
            secretKey = Buffer.from(keyData)
        else secretKey = bs58.decode(keyData)
    }

    return secretKey;
}


/**
 * 根据文件路径初始化keyPair
 * @param filePath 
 * @returns 
 */
export function init_keypair(filePath: string) {
    let secretKey = get_SecretKey(filePath);
    return Keypair.fromSecretKey(secretKey)
}