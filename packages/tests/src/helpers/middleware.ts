import {expect} from "vitest";
import { assertTrpcError } from "./error.ts";

export const assertIsInternal = async (method: () => Promise<any>, isLogged: boolean) => {
    try {
        await method();
        expect.fail('should have thrown an error');
    } catch (e) {
        assertTrpcError(e, 'UNAUTHORIZED');
        if (isLogged) {
            expect(e.message).toBe('MISSING_SECRET');
        } else {
            expect(e.message).toBe('AUTHENTICATION_REQUIRED');
        }
    }
}