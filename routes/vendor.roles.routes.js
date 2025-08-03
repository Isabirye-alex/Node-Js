const express = require("express");
const router = express.Router();

router.post("/vendors/:vendorId/roles", assignVendorRole);
router.get("/vendors/:vendorId/roles", getVendorRoles);

module.exports = router;
