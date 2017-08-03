appControllers.controller('GrListCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    'ionicDatePicker',
    'ApiService',
    'PopupService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $cordovaKeyboard,
        ionicDatePicker,
        ApiService,
        PopupService) {
        $scope.Rcbp1 = {};
        $scope.Rcbp1ForConsinnee = {};
        $scope.Detail = {
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
              ONHAND_date:moment(new Date()).format('YYYY-MM-DD'),
              PICKUP_SUP_datetime:moment(new Date()).format('YYYY-MM-DD'),
            },
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
          if (is.undefined($scope.Rcbp1.selected)){
            $scope.Detail.ONHAND_D.SHP_CODE ="";
          }else{
                $scope.Detail.ONHAND_D.SHP_CODE =$scope.Rcbp1.selected.BusinessPartyCode;
          }
          if (is.undefined($scope.Rcbp1ForConsinnee.selected)){
            $scope.Detail.ONHAND_D.CNG_CODE ="";
          }else{
                $scope.Detail.ONHAND_D.CNG_CODE =$scope.Rcbp1ForConsinnee.selected.BusinessPartyCode;
          }
          if (is.undefined($scope.Detail.ONHAND_D.CASE_NO)){
            $scope.Detail.ONHAND_D.CASE_NO ="";
          }
          if (is.undefined($scope.Detail.ONHAND_D.NO_INV_WH)){
            $scope.Detail.ONHAND_D.NO_INV_WH ="";
          }
          $scope.Detail.ONHAND_D.UserID= sessionStorage.getItem( 'UserId' ).toString();
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
                PopupService.Info(null, 'Confirm Success', '').then(function (res) {

                });
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
