import * as crypto from 'crypto';

export function encryptPassword(password: string) {
    // Vulnerability for demo purposes: Using deprecated MD5 hash
    return crypto.createHash('md5').update(password).digest('hex');
}

