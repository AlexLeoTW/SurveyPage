const questType = {
  TEXTAREA: 0,
  RADIO: 1,
  CHECKBOX: 2,
  properties: {
    0: {name: "textarea", value: 0},
    1: {name: "radio", value: 1},
    2: {name: "checkbox", value: 2}
  }
};

angular.module('quest-edit', ['ngCookies'])
  .controller('questListController', ['$http', '$cookies', function($http, $cookies) {
    var questList = this;

    class quest {
      constructor (args) {
        this.content = args.content;
        this.type = args.type;
        this.edit = args.edit ? args.edit : false;
        this.selection = args.selection ? args.selection : [];
      }

      onType() {
        if ((this.type === questType.RADIO || this.type === questType.CHECKBOX) && this.selection.length == 0) {
          this.selection.push('');
        }
      }

      onSelection(index) {
        if (this.selection.length-1 == index && this.selection[this.selection.length-1].length != 0) {
          this.selection.push('');
        }

        if (this.selection[index].length == 0) {
          this.selection.splice(index, 1);
        }
      }

      onComplete() {
        if (this.selection && this.selection[this.selection.length-1].length == 0) {
          this.selection.pop();
        }
        this.edit = false;
      }
    }

    questList.name = '範例問卷';
    questList.questions = [
      new quest({
        content: '標題（一）',
        type: questType.RADIO,
        edit: true,
        selection: [
          '選項（一）',
          '選項（二）'
        ]
      })
      , new quest({
        content: '標題（二）',
        type: questType.CHECKBOX,
        edit: false,
        selection: [
          '選項（一）',
          '選項（二）'
        ]
      }), new quest({
        content: '標題（三）',
        edit: false,
        type: questType.TEXTAREA
      })
    ]

    questList.dialog = {
      title: '正在發布中',
      message: '請稍後...'
    }

    questList.add = function () {
      questList.questions.push(new quest({
        // no: questList.quests[questList.quests.length-1].no+1,
        edit: true,
        selection: ['']
      }));
    }

    questList.delete = function (index) {
      console.log(`delete ${index}`);
      questList.questions.splice(index, 1);
    }

    questList.send = function () {

      $('#sendDialog').modal({ show: true });

      var quests = questList.questions.map((question) => {
        delete question.edit;
        if (question.type == 0) {
          delete question.selection;
        } else {
          question.selection = question.selection.map((selection) => {
            return { content: selection };
          })
        }
        return question;
      })

      $http({
        method: 'POST',
        // url: `/questionnaire/api/ba/question/create/A001/${$cookies.get('username')}/${$cookies.get('tokeen')}`,
        url: '/survey',
        data: { name: questList.name, question: questList.questions }
      }).then(function successCallback(response) {
          questList.dialog = {
            title: '完成',
            message: response.data.message,
            redirect: '/'
          }
        }, function errorCallback(response) {
          questList.dialog = {
            title: '錯誤',
            message: `${response.status} ${response.statusText}`
          }
        });
    }
  }]);

// {
//   "name": "笨狗吉福飼料",
//   "question": [
//     {
//       "content": "對狗的感想",
//       "type": 0,
//       "selection": []
//     },
//     {
//       "content": "想打牠嗎?",
//       "type": 1,
//       "selection": [
//         {
//           "content": "想"
//         },
//         {
//           "content": "不想"
//         }
//       ]
//     },
//     {
//       "content": "飯",
//       "type": 2,
//       "selection": [
//         {
//           "content": "潔牙骨"
//         },
//         {
//           "content": "牛排"
//         },
//         {
//           "content": "肯德基"
//         },
//         {
//           "content": "no"
//         }
//       ]
//     }
//   ]
// }
