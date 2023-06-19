const AccessRoles = {
  isMarketer: `113`,
  isRachel: `113#114`,
  isJoe: `113#115`,
  isAchola: `112#700#117#116`,
  isNancy: `112#305#117#116#113#770`,
  isKasili: `112#114#700`,
  isOperations1: "112#116#303#305",
  isOperations2: "112#304",
  isOperations3: "112#305",
  isDriver: "driver69",
  isHOL: "headOfLogistics",
  isAnalyst: "112#420#69"
};

AccessRoles.separateAccessRoles = function (accessRole) {
  return accessRole.trim().split("#");
};

AccessRoles.checkAccess = function (accessRole, targetRole) {
  const separatedRoles = AccessRoles.separateAccessRoles(accessRole);
  const targetRoles = AccessRoles.separateAccessRoles(targetRole);
  return targetRoles.every((role) => separatedRoles.includes(role));
};



module.exports = AccessRoles;
