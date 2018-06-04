angular.module('quest-edit', ['ngCookies'])
  .controller('questListController', ['$http', '$cookies', function($http, $cookies) {
    var questList = this;

    class quest {
      constructor (args) {
        this.title = args.title;
        this.type = args.type;
        this.edit = args.edit ? args.edit : false;
        this.options = args.options ? args.options : [];
      }

      onType() {
        if ((this.type === 'radio' || this.type === 'radio') && this.options.length == 0) {
          this.options.push('');
        }
      }

      onOption(index) {
        if (this.options.length-1 == index && this.options[this.options.length-1].length != 0) {
          this.options.push('');
        }

        if (this.options[index].length == 0) {
          this.options.splice(index, 1);
        }
      }

      onComplete() {
        if (this.options[this.options.length-1].length == 0) {
          this.options.pop();
        }
        this.edit = false;
      }
    }

    questList.quests = [
      new quest({
        title: '標題（一）',
        type: 'radio',
        edit: true,
        options: [
          '選項（一）',
          '選項（二）'
        ]
      })
      , new quest({
        title: '標題（二）',
        type: 'checkbox',
        edit: false,
        options: [
          '選項（一）',
          '選項（二）'
        ]
      }), new quest({
        title: '標題（三）',
        edit: false,
        type: 'textarea'
      })
    ]

    questList.dialog = {
      title: '正在發布中',
      message: '請稍後...'
    }

    questList.add = function () {
      questList.quests.push(new quest({
        no: questList.quests[questList.quests.length-1].no+1,
        edit: true,
        options: ['']
      }));
    }

    questList.delete = function (index) {
      console.log(`delete ${index}`);
      questList.quests.splice(index, 1);
    }

    questList.send = function () {

      $('#sendDialog').modal({ show: true });

      var quests = questList.quests.map((quest) => {
        return {
          content: quest.title,
          type: quest.type == 'textarea' ? 0 : quest.type == 'radio' ? 1 : quest.type == 'checkbox' ? 2 : 3,
          selection: quest.options
        }
      })

      $http({
        method: 'POST',
        // url: `/questionnaire/api/ba/question/create/A001/${$cookies.get('username')}/${$cookies.get('tokeen')}`,
        url: '/survey',
        data: questList.quests
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

//   {                       
//         "name" : "笨狗吉福飼料",
//         "question" :
//         [
//                 {
//                         "content" : "對狗的感想",
//                         "type" : 0,
//                         "selection" : []
//                 },
//                 {
//                         "content" : "想打牠嗎?",
//                         "type" : 1,
//                         "selection" :
//                         [
//                                 {
//                                         "content" : "想"
//                                 },
//                                 {
//                                         "content" : "不想"
//                                 }
//                         ]
//                 },
//                 {
//                         "content" : "飯",
//                         "type" : 2,
//                         "selection" :
//                         [
//                                 {
//                                         "content" : "潔牙骨"
//                                 },
//                                 {
//                                         "content" : "牛排"
//                                 },
//                                 {
//                                         "content" : "肯德基"
//                                 },
//                                 {
//                                         "content" : "no"
//                                 }
//                         ]
//                 }
//         ]
//
// }
