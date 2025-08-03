const db = require('../controllers/db.controller.js');
const bcrypt = require('bcrypt');
async function addNewVendor(req, res) {
    try{
        //Capture required fields from the request body
    const { first_name, last_name, email, phone_number, product_categories, password } = req.body;
    //Verify that the request body contains all the required fields
    if(!first_name||!last_name||!email||!phone_number||!product_categories||!password){
        return res.status(409).json({success:false, message:'Required fields missing'});
    }
    //Query the vendors tavle to see if the provided email address or phone number from the request body already exists in the vendors table
    const [existing_vendor] = await db.query('SELECT * FROM VENDORS WHERE email = ? OR phone_number = ?', [email, phone_number]);
    //emit response if the email address or phone numbers do exist in the vendors table
    if(existing_vendor.length >0){
        return res.status(409).json({success:false, message:'Vendor already exists', error:error.message});
    }
    //Encrypt the provided password by the request body by 10 rounds
     const hashedPassword = await bcrypt.hash(password, 10);
    //Insert the new vendor into the database
     await db.query('INSERT INTO vendors(first_name, last_name, email, phone_number, product_categories, password)', [first_name, last_name,email,phone_number,product_categories,hashedPassword]);
    //Emit response after a successful creation of new vendor
     res.status(201).json({success:true, message:'New Vendor added successfully', vendor: {
        id: vendors.insertId,
        first_name: vendors.first_name,
        last_name:vendors.last_name,
        email:vendors.email,
        product_categories:vendors.product_categories,
        phone_number:vendors.phone_number,
     }});
     //Catch the error and log it back to the user if anything fails
    } catch(error){
        res.status(500).json({success:false, message:'Error creating new vendor', error:error.message});
    }
}

async function vendorLogin(req, res){
    try{
        const {email, password} = req.body;
        //check if both email and password are provided in the request body
        if(!email||!password){
            return res.status(409).json({success:false, message:'Both email and password are required'});
        }
        //check if vendor email exists in the vendor table
        const [existingVendor] = await db.query('SELECT * FROM vendors WHERE email = ?', [email])
        if(existingVendor.lenght === 0){
            res.status(404).json({success:false, message:'No vendor found with the provided email address', error: error.message});
        }
        //verify the provided password
            const isMatch = await bcrypt.compare(password, vendors.password);
            if (!isMatch) {
              return res.status(400).json({ success: false, message: 'Invalid login credentials' });
            }
            //emit token 
              const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.SECRET_ACCESS_TOKEN);
            // Emit response
            res.status(201).json({success:true, message:'Log in successful', vendor:{
                id: vendors.insertId,
                first_name: vendors.first_name,
                last_name: vendors.last_name,
                email: vendors.email,
                product_categories: vendors.product_categories,
                phone_number: vendors.phone_number,   
            }})
    }catch(error){
        res.status(500).json({success:false, message:'Unknown error occurred while trying to log you in', error:error.message});
    }
}

async function deleteVendor(req, res) {
    try{
        const {id} = req.params;
        //Check if any vendor exists with the provided id
        const [existing] = await db.query('SELECT * FROM vendors where id = ?', [id]);
        if(existing.length ===0){
            res.status(404).json({success:false, message:'No vendor found with the provided id'});
        }
        //Delete vendor
        await db.query('DELETE FROM vendors where id = ?', [id]);
        res.status(201).json({success:true, message:'Vendor deleted successfully'});

    }catch(error){
        res.status(500).json({success:false, message:'Unknown error occurred', error:error.message});
    }
}
// async function updateVendor(req, res) {
    
// }

module.exports = {
    addNewVendor,
     vendorLogin,
     deleteVendor
}