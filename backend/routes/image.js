const cloudinary = require('cloudinary');
const router = require('express').Router();

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

/* delete a specific image */
router.route('/:public_id').delete((req, res) => {
  const { public_id } = req.params;

  cloudinary.uploader
    .destroy(public_id)
    .then(() => res.status(200).send(`Deleted file with id: ${public_id}`))
    .catch(err => res.status(400).send(err.message));
});

module.exports = router;
