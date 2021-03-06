var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('username', 'alexleotw');
  res.cookie('token', 'kYNWofGv1ILcS14m');
  res.redirect('/quest_edit.html');
});

router.all('/echo', function(req, res, next) {
  res.json(req.body);
  console.log(req.body);
});

router.post('/survey', (req, res) => {
  console.log(req.get('Content-Type'));
  console.log(JSON.stringify(req.body));
  // res.json({message: '請注意 E-mail 查收'});
  res.json(JSON.parse('{"data":[{"massage":"成功創建問卷,請去信箱領取問卷URL","status":0}],"message":"Success","workID":"A001","status":"00"}'));
})

router.get('/survey/:id', (req, res) => {
  questList.quests = [{
      title: '標題（一）',
      type: 'radio',
      edit: true,
      options: [
        '選項（一）',
        '選項（二）'
      ]
    }, {
      title: '標題（二）',
      type: 'checkbox',
      edit: false,
      options: [
        '選項（一）',
        '選項（二）'
      ]
    }, {
      title: '標題（三）',
      edit: false,
      type: 'textarea'
    }]
})

module.exports = router;
