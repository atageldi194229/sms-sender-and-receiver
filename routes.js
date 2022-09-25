const express = require('express');
const router = express.Router();

const time_to_live = 5 * 60 * 1000;
// const time_to_live = 10 * 1000;

let data = [
    {
        phone: '+99364530230',
        text: 'Hello world',
        time: new Date().getTime(),
    }
];

const check_data = () => {
    try {
        const NOW = new Date().getTime();
        data = data.filter(e => NOW - e.time < time_to_live);
    } catch (err) {
        console.log(err);
    } finally {
        setTimeout(check_data, time_to_live);
    }
}

check_data();

router.post('/message-received', async (req, res) => {
    try {
        data.push({
            phone: req.body.sender,
            text: req.body.text,
            time: new Date().getTime(),
        });
    } catch (err) {
        console.log(err);
    } finally {
        res.send('ok');
    }
});

router.post('/message-exist', async (req, res) => {
    let found = null;
    try {
        const NOW = new Date().getTime();
        
        found = data.find(e =>
            e.phone === req.body.phone &&
            e.text === req.body.text &&
            NOW - e.time < time_to_live
        );

        return res.json({
            found: Boolean(found),
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;