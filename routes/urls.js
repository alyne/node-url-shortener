const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');
const utils = require('../utils/utils');
require('dotenv').config({ path: '../config/.env' });

// Short URL Generator
router.post('/short', async (req, res) => {
  const { origUrl: origUrlFromReq, text } = req.body;

  const isSlackRequest = !!text;

  const origUrl = text || origUrlFromReq;

  console.log('origUrlFromReq', origUrlFromReq);
  console.log('text', text);
  console.log('origUrl', origUrl);

  const respond = (res, fullUrlObj = {}) => {
    if (isSlackRequest) {
      // res.send(fullUrlObj.shortUrl);

      res.json({
        blocks: [
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Short Url*:\n ${fullUrlObj.shortUrl}`
              },
              {
                type: 'mrkdwn',
                text: `*Long Url*:\n ${fullUrlObj.origUrl}`
              }
            ]
          }
        ]
      });
    } else {
      res.json(fullUrlObj);
    }
  };

  const base = process.env.BASE;

  const urlId = shortid.generate();
  if (utils.validateUrl(origUrl)) {
    try {
      let url = await Url.findOne({ origUrl });
      if (url) {
        respond(res, url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          origUrl,
          shortUrl,
          urlId,
          date: new Date()
        });

        await url.save();
        respond(res, url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
});

module.exports = router;
