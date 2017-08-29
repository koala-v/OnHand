appControllers.controller('GrListCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    '$ionicModal',
    'ionicDatePicker',
    'ApiService',
    'PopupService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $cordovaKeyboard,
        $ionicModal,
        ionicDatePicker,
        ApiService,
        PopupService) {
        $scope.Rcbp1 = {};
        $scope.Rcbp1ForConsinnee = {};
        $scope.Detail = {
            Title: 'New',
            ONHANDNO: '',
            location: '',
            Trucker: '',
            ChargeType: {
                NewItem: 'PP',
            },
            pushPublication: {
                checked: false
            },
            pushHazardous: {
                checked: false
            },
            pushClassified: {
                checked: false
            },
            pushExercise: {
                checked: false
            },
            ONHAND_D: {

                UserID: '',
                ONHAND_date: moment(new Date()).format('YYYY-MM-DD'),
                PICKUP_SUP_datetime: moment(new Date()).format('YYYY-MM-DD'),
            },
            OH_PID_D_S: {

            },
            OH_PID_D: {
                RowNum: 0,
                LineItemNo: 0,
                TRK_BILL_NO: '',
                PACK_TYPE: '',
                PID_NO: '',
                UnNo: '',
                GROSS_LB: 0,
                LENGTH: 0,
                WIDTH: 0,
                HEIGHT: 0
            },
            Add_OH_PID_D: {
                RowNum: 0,
                LineItemNo: 0,
                TRK_BILL_NO: '',
                PACK_TYPE: '',
                PID_NO: '',
                UnNo: '',
                GROSS_LB: 0,
                LENGTH: 0,
                WIDTH: 0,
                HEIGHT: 0
            },
            blnNext: true
        };

        $scope.ChargeType = [{
            text: 'Payment',
            value: 'PP'
        }, {
            text: 'Collect',
            value: 'CC'
        }, {
            text: 'To Follow',
            value: 'TF'
        }];

        $ionicModal.fromTemplateUrl('scan.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        $ionicModal.fromTemplateUrl('PID.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalPID = modal;
        });
        $scope.$on('$destroy', function () {
            $scope.modalPID.remove();
        });

        var CheckPush = function () {
            if ($scope.Detail.ONHAND_D.PUB_YN === 'Y') {
                $scope.Detail.pushPublication.checked = true;
            } else {
                $scope.Detail.pushPublication.checked = false;
            }
            if ($scope.Detail.ONHAND_D.HAZARDOUS_YN === 'Y') {
                $scope.Detail.pushHazardous.checked = true;
            } else {
                $scope.Detail.pushHazardous.checked = false;
            }
            if ($scope.Detail.ONHAND_D.CLSF_YN === 'Y') {
                $scope.Detail.pushClassified.checked = true;
            } else {
                $scope.Detail.pushClassified.checked = false;
            }
            if ($scope.Detail.ONHAND_D.ExerciseFlag === 'Y') {
                $scope.Detail.pushExercise.checked = true;
            } else {
                $scope.Detail.pushExercise.checked = false;
            }
        };
        $scope.pushChange = function () {
            if ($scope.Detail.pushPublication.checked === true) {
                $scope.Detail.ONHAND_D.PUB_YN = 'Y';
            } else {
                $scope.Detail.ONHAND_D.PUB_YN = 'N';
            }
            if ($scope.Detail.pushHazardous.checked === true) {
                $scope.Detail.ONHAND_D.HAZARDOUS_YN = 'Y';
            } else {
                $scope.Detail.ONHAND_D.HAZARDOUS_YN = 'N';
            }
            if ($scope.Detail.pushClassified.checked === true) {
                $scope.Detail.ONHAND_D.CLSF_YN = 'Y';
            } else {
                $scope.Detail.ONHAND_D.CLSF_YN = 'N';
            }
            if ($scope.Detail.pushExercise.checked === true) {
                $scope.Detail.ONHAND_D.ExerciseFlag = 'Y';
            } else {
                $scope.Detail.ONHAND_D.ExerciseFlag = 'N';
            }
        };
        var CheckLocation = function () {
            if ($scope.Detail.ONHAND_D.LOC_CODE === 'L1') {
                $scope.Detail.location = 'Location1';
            } else if ($scope.Detail.ONHAND_D.LOC_CODE === 'L2') {
                $scope.Detail.location = 'Location2';
            } else {
                $scope.Detail.location = '';
            }
        };
        $scope.LocationChange = function () {
            if ($scope.Detail.location === 'Location1') {
                $scope.Detail.ONHAND_D.LOC_CODE = 'L1';
            } else if ($scope.Detail.location === 'Location2') {
                $scope.Detail.ONHAND_D.LOC_CODE = 'L2';
            } else {
                $scope.Detail.ONHAND_D.LOC_CODE = '';
            }
        };
        var CheckTrucker = function () {
            if ($scope.Detail.ONHAND_D.TRK_CODE === 'F') {
                $scope.Detail.Trucker = 'Fedex';
            } else if ($scope.Detail.ONHAND_D.TRK_CODE === 'T') {
                $scope.Detail.Trucker = 'Others';
            } else {
                $scope.Detail.Trucker = '';
            }
        };
        $scope.TruckerChange = function () {
            if ($scope.Detail.Trucker === 'Fedex') {
                $scope.Detail.ONHAND_D.TRK_CODE = 'F';
            } else if ($scope.Detail.Trucker === 'Others') {
                $scope.Detail.ONHAND_D.TRK_CODE = 'T';
            } else {
                $scope.Detail.ONHAND_D.TRK_CODE = '';
            }
        };
        var CheckChargeType = function () {
            if ($scope.Detail.ONHAND_D.TRK_CHRG_TYPE === 'PP') {
                $scope.Detail.ChargeType.NewItem = 'PP';
            } else if ($scope.Detail.ONHAND_D.TRK_CHRG_TYPE === 'CC') {
                $scope.Detail.ChargeType.NewItem = 'CC';
            } else if ($scope.Detail.ONHAND_D.TRK_CHRG_TYPE === 'TF') {
                $scope.Detail.ChargeType.NewItem = 'TF';
            } else {
                $scope.Detail.ChargeType.NewItem = '';
            }
        };
        $scope.Create = function () {
            if (is.undefined($scope.Rcbp1.selected)) {
                $scope.Detail.ONHAND_D.SHP_CODE = "";
            } else {
                $scope.Detail.ONHAND_D.SHP_CODE = $scope.Rcbp1.selected.BusinessPartyCode;
            }
            if (is.undefined($scope.Rcbp1ForConsinnee.selected)) {
                $scope.Detail.ONHAND_D.CNG_CODE = "";
            } else {
                $scope.Detail.ONHAND_D.CNG_CODE = $scope.Rcbp1ForConsinnee.selected.BusinessPartyCode;
            }
            if (is.undefined($scope.Detail.ONHAND_D.CASE_NO)) {
                $scope.Detail.ONHAND_D.CASE_NO = "";
            }
            if (is.undefined($scope.Detail.ONHAND_D.NO_INV_WH)) {
                $scope.Detail.ONHAND_D.NO_INV_WH = "";
            }
            $scope.Detail.ONHAND_D.UserID = sessionStorage.getItem('UserId').toString();
            $scope.Detail.ONHAND_D.TRK_CHRG_TYPE = $scope.Detail.ChargeType.NewItem;
            $scope.LocationChange();
            $scope.TruckerChange();
            $scope.pushChange();
            var arrONHAND_D = [];
            arrONHAND_D.push($scope.Detail.ONHAND_D);
            var jsonData = {
                "UpdateAllString": JSON.stringify(arrONHAND_D)
            };
            var objUri = ApiService.Uri(true, '/api/wms/ONHAND_D/confirm');
            ApiService.Post(objUri, jsonData, true).then(function success(result) {
                $scope.Detail.ONHANDNO = result.data.results;
                $scope.Detail.Title = 'OnhandNo : ' + $scope.Detail.ONHANDNO;
                if (is.not.undefined($scope.Detail.ONHANDNO)) {} else {
                    PopupService.Info(null, 'Confirm Error', '').then(function (res) {});
                }
            });
        };
        $scope.refreshRcbp1 = function (BusinessPartyName) {
            if (is.not.undefined(BusinessPartyName) && is.not.empty(BusinessPartyName)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyName', BusinessPartyName);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Rcbp1s = result.data.results;
                });
            }
        };
        $scope.refreshRcbp1ForConsinnee = function (BusinessPartyName) {
            if (is.not.undefined(BusinessPartyName) && is.not.empty(BusinessPartyName)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyName', BusinessPartyName);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Rcbp1ForConsinnees = result.data.results;
                });
            }
        };

        $scope.OnDatePicker = function () {
            var ipObj1 = {
                callback: function (val) { //Mandatory
                    //  console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    $scope.Detail.ONHAND_D.ONHAND_date = moment(new Date(val)).format('YYYY-MM-DD');
                },
                to: new Date(),
            };
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.OnDatePickerForVendorShipDate = function () {
            var ipObj1 = {
                callback: function (val) { //Mandatory
                    //  console.log('Return value from the datepicker popup is : ' + val, new Date(val));
                    $scope.Detail.ONHAND_D.PICKUP_SUP_datetime = moment(new Date(val)).format('YYYY-MM-DD');
                },
                to: new Date(),
            };
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.findOH_PID_D = function () {
            if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D');
                objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Detail.OH_PID_D_S = result.data.results;
                    if (is.array($scope.Detail.OH_PID_D_S) && is.not.empty($scope.Detail.OH_PID_D_S)) {
                        showPid(0);
                    } else {
                        // PopupService.Info(null, 'This OH_PID_D has no Record Please Add').then(function (res) {
                        //
                        // });
                    }
                    // var results = result.data.results;
                    // var dataResults = new Array();
                    // if (is.not.empty(results)) {
                    //     for (var i = 0; i < results.length; i++) {
                    //         var objOH_PID_D = results[i];
                    //         dataResults = dataResults.concat(objOH_PID_D);
                    //         $scope.Detail.OH_PID_D_S = dataResults;
                    //         $scope.Detail.OH_PID_D_S.SNO = i;
                    //
                    //     }
                    // } else {
                    //     $scope.Detail.OH_PID_D_S = "";
                    // }
                });
            } else {
                PopupService.Info(null, 'Please First Create Onhand').then();
            }
        };

        var showPid = function (row) {
            if (row !== null && $scope.Detail.OH_PID_D_S.length >= row) {
                $scope.Detail.OH_PID_D = {
                    RowNum: $scope.Detail.OH_PID_D_S[row].RowNum,
                    LineItemNo: $scope.Detail.OH_PID_D_S[row].LineItemNo,
                    TRK_BILL_NO: $scope.Detail.OH_PID_D_S[row].TRK_BILL_NO,
                    PACK_TYPE: $scope.Detail.OH_PID_D_S[row].PACK_TYPE,
                    PID_NO: $scope.Detail.OH_PID_D_S[row].PID_NO,
                    UnNo: $scope.Detail.OH_PID_D_S[row].UnNo,
                    GROSS_LB: $scope.Detail.OH_PID_D_S[row].GROSS_LB,
                    LENGTH: $scope.Detail.OH_PID_D_S[row].LENGTH,
                    WIDTH: $scope.Detail.OH_PID_D_S[row].WIDTH,
                    HEIGHT: $scope.Detail.OH_PID_D_S[row].HEIGHT,
                };

            }
            if (is.equal(row, $scope.Detail.OH_PID_D_S.length - 1)) {
                $scope.Detail.blnNext = false;
            } else {
                $scope.Detail.blnNext = true;
            }
        };

        $scope.showPrev = function () {
            var intRow = $scope.Detail.OH_PID_D.RowNum - 1;
            if ($scope.Detail.OH_PID_D_S.length > 0 && intRow > 0 && is.equal($scope.Detail.OH_PID_D_S[intRow - 1].RowNum, intRow)) {
                // $scope.clearInput();
                showPid(intRow - 1);
            } else {
                PopupService.Info(null, 'Already the first one');
            }
        };
        $scope.showNext = function () {
            var intRow = $scope.Detail.OH_PID_D.RowNum + 1;
            if ($scope.Detail.OH_PID_D_S.length > 0 && $scope.Detail.OH_PID_D_S.length >= intRow && is.equal($scope.Detail.OH_PID_D_S[intRow - 1].RowNum, intRow)) {
                // $scope.clearInput();
                showPid(intRow - 1);
            } else {
                PopupService.Info(null, 'Already the last one');
            }
        };
        $scope.DeleteLine = function (LineItemNo) {
            if (LineItemNo > 0) {
                var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/DeleteLineItem');
                objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                objUri.addSearch('LineItemNo', LineItemNo);
                ApiService.Get(objUri, false).then(function success(result) {
                    var results = result.data.results;
                    if (is.not.empty(results)) {
                        $scope.Detail.OH_PID_D = "";
                        $scope.findOH_PID_D();
                    } else {}
                });

            }
        };
        $scope.addLine = function () {
            PopupService.Confirm(null, 'Confirm', 'Are you sure to Add PID?').then(function (res) {
                if (res) {
                    if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                        var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/create');
                        objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                        ApiService.Get(objUri, false).then(function success(result) {
                            var results = result.data.results;
                            if (is.not.empty(results)) {
                                $scope.updateLineItem('add', results);
                                $scope.findOH_PID_D();
                                $scope.closeModalAddPID();
                            } else {}
                        });
                    } else {
                        PopupService.Info(null, 'Please First Create Onhand', '').then(function (res) {});
                    }
                } else {

                }
            });

        };

        $scope.UpdateTotal = function () {
            if ($scope.Detail.OH_PID_D_S.length > 0) {
                var TotalWeight = 0;
                for (var i = 0; i < $scope.Detail.OH_PID_D_S.length; i++) {
                    TotalWeight = TotalWeight + $scope.Detail.OH_PID_D_S[i].GROSS_LB;
                }
                $scope.Detail.ONHAND_D.TotalWeight = TotalWeight;
            }
        };
        $scope.updateLineItem = function (Type, Value) {
            if (Type === 'add') {
                var arrOH_PID_D = [];
                $scope.Detail.Add_OH_PID_D.LineItemNo = Value;
                $scope.Detail.Add_OH_PID_D.ONHAND_NO = $scope.Detail.ONHANDNO;
                arrOH_PID_D.push($scope.Detail.Add_OH_PID_D);
                var jsonData = {
                    "UpdateAllString": JSON.stringify(arrOH_PID_D)
                };
                var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/updateLineItem');
                ApiService.Post(objUri, jsonData, true).then(function success(result) {

                });
            } else {
                var arrOH_PID_D = [];
                var length = 0;
                $scope.Detail.OH_PID_D_S.ONHAND_NO = $scope.Detail.ONHANDNO;
                for (var i = 0; i < $scope.Detail.OH_PID_D_S.length; i++) {
                    length = i;
                    arrOH_PID_D.push($scope.Detail.OH_PID_D_S[i]);
                    var jsonData = {
                        "UpdateAllString": JSON.stringify(arrOH_PID_D)
                    };
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/updateLineItem');
                    ApiService.Post(objUri, jsonData, true).then(function success(result) {

                    });
                }
            }
        };
        $scope.showDate = function (utc) {
            return moment(utc).format('DD-MMM-YYYY');
        };
        $scope.returnMain = function () {
            $state.go('index.main', {}, {
                reload: true
            });
        };

        $scope.openModal = function () {
            if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                $scope.modal.show();
                $scope.findOH_PID_D();
            } else {

                PopupService.Info(null, 'Please First Create Onhand', '').then(function (res) {});
            }

            // $ionicLoading.show();

        };
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.updateLineItem();
            $scope.UpdateTotal();
        };

        $scope.closeModalAddPID = function () {
            $scope.modalPID.hide();
            $scope.findOH_PID_D();
            // $scope.Detail.Add_OH_PID_D="";
        };

        $scope.openModalAddPID = function () {
            if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                $scope.modalPID.show();
            } else {
                // PopupService.Info(null, 'Please First Create Onhand', '').then(function (res) {});
            }
        };
        $scope.returnList = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('grList', {}, {
                    reload: true
                });
            }
        };

        // $scope.GoToDetail = function () {
        //         if ($scope.Detail.ONHANDNO !== "") {
        //             $state.go('grDetail', {
        //                 'OnhandNo': $scope.Detail.ONHANDNO
        //             }, {
        //                 reload: true
        //             });
        //         }else{
        //             PopupService.Alert(null, 'Please First Create Onhand', '').then(function (res) {});
        //         }
        //     };
    }
]);

appControllers.controller('GrDetailCtrl', [
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
        $scope.Detail = {

        };
        $scope.returnList = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('grList', {}, {
                    reload: true
                });
            }
        };
    }
]);
