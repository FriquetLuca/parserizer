/**
 * Return a regex to test for an email address.
 * @source https://github.com/colinhacks/zod/blob/master/src/types.ts
 * @returns A regex to test for an email address.
 */
export const matchEmail = () => /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}/i;
/**
 * Return a regex to test for an IPv4.
 * @source https://github.com/colinhacks/zod/blob/master/src/types.ts
 * @returns A regex to test for an IPv4.
 */
export const matchIPv4 = () => /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))/;
/**
 * Return a regex to test for an IPv6.
 * @source https://github.com/colinhacks/zod/blob/master/src/types.ts
 * @returns A regex to test for an IPv6.
 */
export const matchIPv6 = () => /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))/;
/**
 * Return a regex to test for a cuid.
 * @source https://github.com/colinhacks/zod/blob/master/src/types.ts
 * @returns A regex to test for a cuid.
 */
export const matchcuid = () => /^c[^\s-]{8,}/i;
/**
 * Return a regex to test for a cuid2.
 * @source https://github.com/colinhacks/zod/blob/master/src/types.ts
 * @returns A regex to test for a cuid2.
 */
export const matchcuid2 = () => /^[a-z][a-z0-9]*/;
/**
 * Return a regex to test for a ulid.
 * @source https://github.com/colinhacks/zod/blob/master/src/types.ts
 * @returns A regex to test for a ulid.
 */
export const matchulid = () => /^[0-9A-HJKMNP-TV-Z]{26}/;
