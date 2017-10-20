appControllers.controller('cycleCountCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    '$cordovaBarcodeScanner',
    '$cordovaToast',
    'PopupService',
    'ApiService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $cordovaKeyboard,
        $cordovaBarcodeScanner,
        $cordovaToast,
        PopupService,
        ApiService) {
        $scope.LOCATION_K = {};
        var arrLocation = new Array();
        $scope.Aeaw1 = {
            MasterJobNo: '',
        };
        $scope.Ae1 = {};
        $scope.Detail = {
            disabled: false,
            Aemt1: {},
            PidS: {},
            Aemt1S: {},
            Location_K: {},
            Scan: {
                PID_NO: ''
            }
        };

        $scope.refreshLocation = function (LOC_CODE) {
            if (is.not.undefined(LOC_CODE) && is.not.empty(LOC_CODE)) {
                var objUri = ApiService.Uri(true, '/api/wms/LOCATION_K/LOC_CODE');
                objUri.addSearch('LOC_CODE', LOC_CODE);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.LOCATION_KS = result.data.results;
                });
            }
        };

        $scope.addLocaiton = function () {
            if (is.not.undefined($scope.LOCATION_K.selected)) {
                if (funIndexOf($scope.LOCATION_K.selected, 'add', arrLocation) < 0) {
                    arrLocation.push($scope.LOCATION_K.selected);
                    $scope.Detail.Location_K = arrLocation;
                }
            }
        };

        $scope.Refresh = function () {
            $scope.Detail.disabled = true;
            $scope.ShowAeaw($scope.Ae1.selected.MAwbNo, $scope.Detail.Location_K);
        };
        $scope.DelAllLocaiton = function () {
            arrLocation = new Array();
            $scope.Detail.Location_K = arrLocation;

        };
        $scope.DelLocaiton = function (LOC_CODE) {
            $scope.funRemove(LOC_CODE);
            $scope.Detail.Location_K = arrLocation;
        };

        var funIndexOf = function (val, Type, arr) {
            if (Type !== 'undefined' && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (Type === 'add') {
                        if (arr[i].LOC_CODE == val.LOC_CODE) return i;
                    } else if (Type === 'del') {
                        if (arr[i].LOC_CODE == val) return i;
                    }
                }
            }
            return -1;
        };

        $scope.funRemove = function (val) {
            var index = funIndexOf(val, 'del', arrLocation);
            if (index > -1) {
                arrLocation.splice(index, 1);
            }
        };
        // Array.prototype.indexOf = function (val, Type) {
        // if(Type !=='undefined' &&  this.length>0 ){
        //   for (var i = 0; i < this.length; i++) {
        //       if (Type === 'add') {
        //           if (this[i].LOC_CODE == val.LOC_CODE) return i;
        //       } else if(Type === 'del'){
        //           if (this[i].LOC_CODE == val) return i;
        //       }
        //   }
        //   }
        //   return -1;
        // };
        // Array.prototype.remove = function (val) {
        //     var index =funIndexOf(val, 'del');
        //     if (index > -1) {
        //         this.splice(index, 1);
        //     }
        // };

        $scope.refreshAeaw = function (MAwbNo) {
            if (is.not.undefined(MAwbNo) && is.not.empty(MAwbNo)) {
                var objUri = ApiService.Uri(true, '/api/wms/awaw1/MAwbNo');
                objUri.addSearch('MAwbNo', MAwbNo);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Aeaw1s = result.data.results;
                    if ($scope.Aeaw1s !== null && $scope.Aeaw1s.length > 0) {
                        $scope.Ae1.selected = $scope.Aeaw1s[0];
                        // $scope.ShowAeaw();
                    } else {
                        $scope.Aeaw1s = [];
                    }
                });
            }
        };

        $scope.ShowAeaw = function (MAwbNo, objLocation) {
            if (is.not.undefined(MAwbNo) && is.not.empty(MAwbNo)) {
                var objUri = ApiService.Uri(true, '/api/wms/awaw1/MasterJobNo');
                objUri.addSearch('MAwbNo', MAwbNo);
                ApiService.Get(objUri, true).then(function success(result) {
                    $scope.Aeaw1 = result.data.results[0];
                    getPid($scope.Aeaw1.MasterJobNo, objLocation);
                });
            } else {
                $scope.Detail.PidS = '';
                $scope.Detail.Aemt1S = '';
            }
            if (!ENV.fromWeb) {
                $cordovaKeyboard.close();
            }
        };

        var getPid = function (MasterJobNo, objLocation) {
            if (MasterJobNo !== '') {
                var strLocation = '';
                for (var i = 0; i < objLocation.length; i++) {
                    strLocation = strLocation + ',' + objLocation[i].LOC_CODE;
                }
                var objUri = ApiService.Uri(true, '/api/wms/awaw1/Pid');
                objUri.addSearch('MasterJobNo', MasterJobNo);
                objUri.addSearch('MAwbNo', $scope.Aeaw1.MAwbNo);
                objUri.addSearch('FromAeawFlag', 'Y');
                objUri.addSearch('LOC_CODE', strLocation);
                ApiService.Get(objUri, true).then(function success(result) {
                    $scope.Detail.PidS = result.data.results;
                    if($scope.Detail.PidS.length>0){
                         getMatch(MasterJobNo,'N');
                    }

                });

            }

        };


        var getMatch =function (MasterJobNo ,Flag){
          objUri = ApiService.Uri(true, '/api/wms/awaw1/Pid');
          objUri.addSearch('MasterJobNo', MasterJobNo);
            objUri.addSearch('MAwbNo', $scope.Aeaw1.MAwbNo);
          objUri.addSearch('FromAeawFlag',Flag);
          if(Flag ==='K'){
            ApiService.Get(objUri, true).then(function success(result) {
                  $scope.Detail.PidS = result.data.results;
            });

          }else if(Flag ==='N')
          {
            ApiService.Get(objUri, true).then(function success(result) {
                    $scope.Detail.Aemt1S = result.data.results;
            });
          }

      };


        $scope.enter = function (ev, type) {
            if (is.equal(ev.keyCode, 13)) {
                if (is.equal(type, 'PID_NO') && is.not.empty($scope.Detail.Scan.PID_NO)) {
                    if (blnVerifyInput('PID_NO')) {}
                }
                if (!ENV.fromWeb) {
                    $cordovaKeyboard.close();
                }
            }
        };

        $scope.openCam = function (type) {
            if (!ENV.fromWeb) {
                if (is.equal(type, 'PID_NO')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        $scope.Detail.Scan.PID_NO = imageData.text;
                        if (blnVerifyInput('PID_NO')) {}
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                }
            }
        };


 var UpdateAEMT1=function(){
   var objUri = ApiService.Uri(true, '/api/wms/Aemt1/Update');
   objUri.addSearch('KeyMAwbNo', $scope.Detail.PidS[0].KeyMAwbNo);
    objUri.addSearch('PID_NO', $scope.Detail.Scan.PID_NO);
      objUri.addSearch('strTallyById', sessionStorage.getItem('UserId').toString());
   ApiService.Get(objUri, false).then(function success(result) {
        getMatch($scope.Aeaw1.MasterJobNo,'N');
          getMatch($scope.Aeaw1.MasterJobNo,'K');
   });

 };
        // var insertAEMT1 = function () {
        //     $scope.Detail.Aemt1.MAwbNo = $scope.Aeaw1.MAwbNo;
        //     $scope.Detail.Aemt1.PID_NO = $scope.Detail.Scan.PID_NO;
        //     $scope.Detail.Aemt1.UserID = sessionStorage.getItem('UserId').toString();
        //     var arrAemt1 = [];
        //     arrAemt1.push($scope.Detail.Aemt1);
        //     var jsonData = {
        //         "UpdateAllString": JSON.stringify(arrAemt1)
        //     };
        //     var objUri = ApiService.Uri(true, '/api/wms/Aemt1/Insert');
        //     ApiService.Post(objUri, jsonData, true).then(function success(result) {
        //         PopupService.Alert(null, 'This PID No is vailed under this MAWB').then(
        //             $scope.ShowAeaw($scope.Detail.Aemt1.MAwbNo, '')
        //         );
        //
        //     });
        //
        // };
        var blnVerifyInput = function (type) {
            var blnPass = true;
            if (is.equal(type, 'PID_NO')) {
                if ($scope.Detail.PidS.length > 0) {
                    for (var i = 0; i < $scope.Detail.PidS.length; i++) {
                        if ($scope.Detail.Scan.PID_NO !== $scope.Detail.PidS[i].PID_NO) {
                            blnPass = false;
                        } else {
                            blnPass = true;
                            break;
                        }
                    }
                } else {
                    blnPass = false;
                }
            }
            if (blnPass) {
                 UpdateAEMT1();
            } else {
                PopupService.Alert(null, 'This PID No is not under this MAWB').then();
            }
            $scope.Detail.Scan.PID_NO = '';
            return blnPass;

        };

        $scope.clearInput = function (type) {
            if (is.equal(type, 'PID_NO')) {
                if ($scope.Detail.Scan.PID_NO.length > 0) {
                    $scope.Detail.Scan.PID_NO = '';
                    $('#txt-PID_NO').focus();
                }
            }
        };

        $scope.showDate = function (utc) {
            return moment(utc).format('DD-MMM-YYYY');
        };
        $scope.GoToDetail = function () {
           if (is.not.undefined($scope.Ae1.selected)){
             if ($scope.Ae1.selected.MAwbNo.length>0 ) {
                 $state.go('cycleCountDetail', {
                     'MAwbNo': $scope.Ae1.selected.MAwbNo
                 }, {
                     reload: true
                 });
             } else {
               PopupService.Info(null, 'Please Enter MAwbNo').then(        );
             }
       } else{
         PopupService.Info(null, 'Please Enter MAwbNo').then( );
           }


        };
        $scope.returnMain = function () {
            $state.go('index.main', {}, {
                reload: true
            });
        };
    }
]);

appControllers.controller('cycleCountDetailCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$http',
    '$timeout',
    '$ionicHistory',
    '$ionicLoading',
    '$ionicPopup',
    '$ionicModal',
    '$cordovaKeyboard',
    '$cordovaToast',
    '$cordovaBarcodeScanner',
    'SqlService',
    'ApiService',
    'PopupService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $http,
        $timeout,
        $ionicHistory,
        $ionicLoading,
        $ionicPopup,
        $ionicModal,
        $cordovaKeyboard,
        $cordovaToast,
        $cordovaBarcodeScanner,
        SqlService,
        ApiService,
        PopupService) {
        var popup = null;
         var  dataResults =new Array();
        $scope.MAwbNo=$stateParams.MAwbNo;
        $scope.Detail = {
            Aemt1S: {
            },
        };
        $scope.returnList = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('cycleCountList', {}, {
                    reload: false
                });
            }
        };
        var GetAemt1 = function (TrxNo) {

            var objUri = ApiService.Uri(true, '/api/wms/Aemt1/select');
            objUri.addSearch('MAwbNo', $scope.MAwbNo);
            ApiService.Get(objUri, true).then(function success(result) {
                  $scope.Detail.Aemt1S = result.data.results;
                if ($scope.Detail.Aemt1S.length>0) {

                } else {
                    PopupService.Info(null, 'The MAwbNo Not Record', '').then(function (res) {
                        $scope.returnList();
                    });
                }

            });
        };
        GetAemt1($scope.MAwbNo);
    }
]);
