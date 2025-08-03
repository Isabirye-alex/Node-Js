const db = require('../controllers/db.controller.js');
const assignVendorRole = async (req, res) => {
    const { vendorId } = req.params;
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ success: false, message: "Role is required" });
    }

    try {
        // Check if role exists, insert if not
        const [roleResult] = await db.query("SELECT id FROM roles WHERE name = ?", [role]);
        let roleId;

        if (roleResult.length === 0) {
            const [insertResult] = await db.query("INSERT INTO roles (name) VALUES (?)", [role]);
            roleId = insertResult.insertId;
        } else {
            roleId = roleResult[0].id;
        }

        // Assign role to vendor
        await db.query(
            "INSERT IGNORE INTO vendor_roles (vendor_id, role_id) VALUES (?, ?)",
            [vendorId, roleId]
        );

        res.status(200).json({ success: true, message: "Role assigned successfully" });
    } catch (error) {
        console.error("Error assigning role:", error);
        res.status(500).json({ success: false, message: "Failed to assign role", error: error.message });
    }
};

// GET /vendors/:vendorId/roles
const getVendorRoles = async (req, res) => {
    const { vendorId } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT r.name 
             FROM vendor_roles vr 
             JOIN roles r ON vr.role_id = r.id 
             WHERE vr.vendor_id = ?`,
            [vendorId]
        );

        const roles = rows.map(row => row.name);

        res.status(200).json({ success: true, roles });
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ success: false, message: "Failed to fetch roles", error: error.message });
    }
};


