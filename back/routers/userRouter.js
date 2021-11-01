const express = require('express');
const router = express.Router();
router.use(express.json())

router.post('/', (request, response) => {
    const user = request.headers.username
    return response.send(JSON.stringify({ "usermane": user }))
})

module.exports = router