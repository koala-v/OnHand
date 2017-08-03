appControllers.controller('EnquiryListCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    '$cordovaBarcodeScanner',
    '$cordovaToast',
    'ionicDatePicker',
    'ApiService',
    'PopupService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $cordovaKeyboard,
        $cordovaBarcodeScanner,
        $cordovaToast,
        ionicDatePicker,
        ApiService,
        PopupService) {
        $scope.Rcbp1 = {};
        $scope.Rcbp1ForConsinnee = {};
        $scope.Detail = {
            ONHANDNO: '',
            location: '',
            Trucker: '',
            VisibleDetailFlag: 'N',
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
            ONHAND_D: {},
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
        var CheckLocation = function () {
            if ($scope.Detail.ONHAND_D.LOC_CODE === 'L1') {
                $scope.Detail.location = 'Location1';
            } else if ($scope.Detail.ONHAND_D.LOC_CODE === 'L2') {
                $scope.Detail.location = 'Location2';
            } else {
                $scope.Detail.location = '';
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
        $scope.findOnhand = function () {
            if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                var objUri = ApiService.Uri(true, '/api/wms/ONHAND_D');
                objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Detail.ONHAND_D = result.data.results[0];
                    if (is.not.undefined($scope.Detail.ONHAND_D)) {
                        $scope.Detail.VisibleDetailFlag = 'Y';
                        $scope.Detail.ONHAND_D.ONHAND_date = checkDate($scope.Detail.ONHAND_D.ONHAND_date);
                        $scope.Detail.ONHAND_D.PICKUP_SUP_datetime = checkDate($scope.Detail.ONHAND_D.PICKUP_SUP_datetime);
                        $scope.Rcbp1.selected = {
                            BusinessPartyCode: $scope.Detail.ONHAND_D.SHP_CODE,
                            BusinessPartyName: $scope.Detail.ONHAND_D.ShipperName
                        };
                        $scope.Rcbp1ForConsinnee.selected = {
                            BusinessPartyCode: $scope.Detail.ONHAND_D.CNG_CODE,
                            BusinessPartyName: $scope.Detail.ONHAND_D.ConsigneeName
                        };
                        CheckPush();
                        CheckLocation();
                        CheckTrucker();
                        CheckChargeType();
                    } else {
                        PopupService.Info(null, 'Please Enter The Current OhandNo').then();
                    }
                });
            } else {
                $scope.Detail.VisibleDetailFlag = 'N';
                PopupService.Info(null, 'Please Enter OhandNo').then();
            }
        };
        // $scope.findOnhand();
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
        $scope.pushChange = function (Type) {
            if (Type === 1) {
                console.log('Push Notification Change', $scope.Detail.pushPublication.checked);
            } else if (Type === 2) {
                console.log('Push Notification Change', $scope.Detail.pushHazardous.checked);
            } else if (Type === 3) {
                console.log('Push Notification Change', $scope.Detail.pushClassified.checked);
            } else if (Type === 4) {
                console.log('Push Notification Change', $scope.Detail.pushExercise.checked);
            } else {
                console.log();
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
        $scope.EditOff = function () {
            $("input").attr("disabled", true);
        };
        
        $scope.EditOn = function () {
            $("input").attr("disabled", false);
        };
        $scope.showDate = function (utc) {
            return moment(utc).format('DD-MMM-YYYY');
        };
        $scope.returnMain = function () {
            $state.go('index.main', {}, {
                reload: true
            });
        };

    }
]);
