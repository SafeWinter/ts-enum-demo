enum Permission {
  Readable = initPermission(), // 0b001,  // i.e. 2^0 = 1
  Writable = initPermission(1), // 0b010,  // i.e. 2^1 = 2
  Executable = initPermission(2), // 0b100,  // i.e. 2^2 = 4
}

/**
 * Initialize a permission value with left-shift operation
 * @param order the order of the permission
 * @returns the permission value
 */
function initPermission(order: number = 0): number | never {
  if (order < 0) throw new Error("Order must be a non-negative integer");
  if (order > 10) throw new Error("Order must be no greater than 10");
  return 1 << order;
}

/**
 * Add a permission to the permission set
 *
 * @param perms original permission set
 * @param permToAdd permission to add
 * @returns the new permission set
 */
function addPermission(perms: Permission, permToAdd: Permission): Permission {
  return perms | permToAdd;
}

/**
 * Delete a permission from the permission set
 *
 * @param perms original permission set
 * @param permToDel permission to delete
 * @returns the new permission set
 */
function delPermission(perms: Permission, permToDel: Permission): Permission {
  return perms ^ permToDel;
}

/**
 * Get the shared permission between two permission sets
 *
 * @param perm1 the 1st permission set
 * @param perm2 the 2nd permission set
 * @returns the shared permission
 */
function sharedPermission(perm1: Permission, perm2: Permission): Permission {
    return perm1 & perm2;
  }

/**
 * Check if the permission set has the target permission
 *
 * @param perms original permission set
 * @param permTarget target permission to check
 * @returns true if the permission set has the target permission; otherwise false
 */
function hasPermission(perms: Permission, permTarget: Permission): boolean {
  return sharedPermission(perms, permTarget) === permTarget;
}

/**
 * Update the permission set by adding and deleting permissions
 *
 * @param perms original permission set
 * @param permToDel permission to delete
 * @param permToAdd permission to add
 * @returns the new permission set
 */
function updatePermission(
  perms: Permission,
  permToDel: Permission,
  permToAdd: Permission
): number {
  const permDelReal = sharedPermission(perms, permToDel);
  if (hasPermission(perms, permDelReal)) {
    const permPreAdd = delPermission(perms, permDelReal);
    return addPermission(permPreAdd, permToAdd);
  } else {
    return addPermission(perms, permToAdd);
  }
}

// Test cases
let perms = addPermission(Permission.Readable, Permission.Writable);
console.log("perms:", perms.toString(2)); // 011

// Test permission deletion
perms = delPermission(perms, Permission.Writable);
console.log("permsAfterDel:", perms.toString(2)); // 001

// Test permission addition
perms = addPermission(perms, Permission.Executable);
console.log("permsAfterAdd:", perms.toString(2)); // 101

// Test shared permission
console.log("has readable:", hasPermission(perms, Permission.Readable)); // true
console.log("has writable:", hasPermission(perms, Permission.Writable)); // false
console.log("has executable:", hasPermission(perms, Permission.Executable)); // true

// Test permission update
console.log("Before update, perms =", perms.toString(2)); // 101 (i.e. 5)

const pDel = addPermission(Permission.Readable, Permission.Writable); // 011
const pAdd = addPermission(Permission.Executable, Permission.Executable); // 100
console.log("perms to delete =", pDel.toString(2)); // 011 (i.e. 3)
console.log("perms to add =", pAdd.toString(2)); // 110 (i.e. 6)

perms = updatePermission(perms, pDel, pAdd);
console.assert(
  perms === 0b100,
  `updatePermission failed: \nExpected '0b100', but got '0b${perms.toString(
    2
  )}'`
); // passed

console.log("After update perms =", perms.toString(2)); // 110
