appControllers.controller('GrListCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    '$ionicModal',
    '$ionicPopup',
    '$cordovaBarcodeScanner',
    'ionicDatePicker',
    'ApiService',
    'SqlService',
    'PopupService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $cordovaKeyboard,
        $ionicModal,
        $ionicPopup,
        $cordovaBarcodeScanner,
        ionicDatePicker,
        ApiService,
        SqlService,
        PopupService) {
        var arrRcdg1 = new Array();
        var arrPidUnGrid = new Array();
        $scope.Type = $stateParams.Type;
        $scope.Rcbp1 = {};
        $scope.ShipperAddress = {};
        $scope.ConsigneeAddress = {};
        $scope.Rcbp1ForConsinnee = {};
        $scope.ShiperCode = {};
        $scope.Percent = {
                PercentValue: '',
                percentFlag: false,
            },
            $scope.PercentConSignee = {
                ConSigneePercentValue: '',
                ConSigneepercentFlag: false,
            },
            $scope.Detail = {
                TableTitle: 'Create Onhand',
                Title: 'New',
                ONHANDNO: $stateParams.OnhandNo,
                location: '',
                Trucker: '',
                disabled: false,
                VisibleDetailFlag: 'N',

                ChargeType: {
                    // NewItem: 'PP',
                },
                chkSHP_MODE: {
                    checked: false
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
                    DomesticFlag: 'N',
                    AOG: '',
                    UserID: '',
                    ONHAND_date: moment(new Date()).format('YYYY-MM-DD'),
                    PICKUP_SUP_datetime: '',

                },
                OH_PID_D_S: {},
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
                Rcdg1: {},
                Rcdg1s: {},
                PidUnGrid: {},
                PidUnGrids: {},
                blnNext: true
            };

        $scope.ChargeType = [{
                text: 'Prepaid',
                value: 'PP'
            }, {
                text: 'Collect',
                value: 'CC'
            }, {
                text: 'To Follow',
                value: 'TF'
            }

        ];
        $scope.refreshRcbp1 = function (BusinessPartyName, BusinessPartyCode) {
            if ((is.not.undefined(BusinessPartyName) && is.not.empty(BusinessPartyName)) || (is.not.undefined(BusinessPartyCode) && is.not.empty(BusinessPartyCode))) {
                if ($scope.Percent.PercentValue.length > 0) {
                    BusinessPartyName = $scope.Percent.PercentValue + BusinessPartyName;
                }
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyName', BusinessPartyName);
                objUri.addSearch('BusinessPartyCode', BusinessPartyCode);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Rcbp1s = result.data.results;
                });
            }
        };

        $scope.refreshShiperCode = function (BusinessPartyCode) {
            if (is.not.undefined(BusinessPartyCode) && is.not.empty(BusinessPartyCode)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyCode', BusinessPartyCode);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.ShiperCodes = result.data.results;
                    // $scope.select.search='1';
                });
            }
        };
        $scope.refreshRcbp1ForConsinnee = function (BusinessPartyName, BusinessPartyCode) {
            if (is.not.undefined(BusinessPartyName) && is.not.empty(BusinessPartyName) || (is.not.undefined(BusinessPartyCode) && is.not.empty(BusinessPartyCode))) {
                if ($scope.PercentConSignee.ConSigneePercentValue.length > 0) {
                    BusinessPartyName = $scope.PercentConSignee.ConSigneePercentValue + BusinessPartyName;
                }
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyName', BusinessPartyName);
                objUri.addSearch('BusinessPartyCode', BusinessPartyCode);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Rcbp1ForConsinnees = result.data.results;
                });
            }
        };

        $scope.ShowShipperAddress = function (BusinessPartyCode) {
            if (is.not.undefined(BusinessPartyCode) && is.not.empty(BusinessPartyCode)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyCode', BusinessPartyCode);
                ApiService.Get(objUri, false).then(function success(result) {
                    if (result.data.results.length > 0) {
                        $scope.Detail.ONHAND_D.shipperaddress1 = result.data.results[0].Address1;
                        $scope.Detail.ONHAND_D.ShipperAddress2 = result.data.results[0].Address2;
                        $scope.Detail.ONHAND_D.ShipperAddress3 = result.data.results[0].Address3;
                        $scope.Detail.ONHAND_D.ShipperAddress4 = result.data.results[0].Address4;
                    }
                    // $scope.Detail.ONHAND_D.ShipperAddress
                });
            }

        };

        $scope.ShowConsigneeAddress = function (BusinessPartyCode) {
            if (is.not.undefined(BusinessPartyCode) && is.not.empty(BusinessPartyCode)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyCode', BusinessPartyCode);
                ApiService.Get(objUri, false).then(function success(result) {
                    if (result.data.results.length > 0) {
                        $scope.Detail.ONHAND_D.ConsigneeAddress1 = result.data.results[0].Address1;
                        $scope.Detail.ONHAND_D.ConsigneeAddress2 = result.data.results[0].Address2;
                        $scope.Detail.ONHAND_D.ConsigneeAddress3 = result.data.results[0].Address3;
                        $scope.Detail.ONHAND_D.ConsigneeAddress4 = result.data.results[0].Address4;
                    }
                    // $scope.Detail.ONHAND_D.ShipperAddress
                });
            }

        };

        $scope.InsertPercent = function () {
            if ($scope.Percent.percentFlag === false) {
                $scope.Percent.PercentValue = '%';
                $scope.Percent.percentFlag = true;
            } else {
                $scope.Percent.PercentValue = '';
                $scope.Percent.percentFlag = false;
            }
        };

        $scope.InsertPercentConSignee = function () {
            if ($scope.PercentConSignee.ConSigneepercentFlag === false) {
                $scope.PercentConSignee.ConSigneePercentValue = '%';
                $scope.PercentConSignee.ConSigneepercentFlag = true;
            } else {
                $scope.PercentConSignee.ConSigneePercentValue = '';
                $scope.PercentConSignee.ConSigneepercentFlag = false;
            }
        };

        $scope.getLocation = function () {
            var objUri = ApiService.Uri(true, '/api/wms/LOCATION_K/LOC_CODE');
            objUri.addSearch('LOC_CODE', "");
            ApiService.Get(objUri, false).then(function success(result) {

                var arrlocation_K = new Array();
                if (result.data.results.length > 0) {
                    for (var i = 0; i < result.data.results.length; i++) {
                        arrlocation_K.push(result.data.results[i].LOC_CODE);

                    }
                    $scope.LOCATION_KS = arrlocation_K;
                }
            });
        };
        $scope.getLocation();

        $scope.getTrucker = function () {
            var objUri = ApiService.Uri(true, '/api/wms/rcbp1/All');

            ApiService.Get(objUri, false).then(function success(result) {
                var arrRcbp1 = new Array();
                if (result.data.results.length > 0) {
                    for (var i = 0; i < result.data.results.length; i++) {
                        arrRcbp1.push(result.data.results[i].BusinessPartyCode);

                    }
                    $scope.Rcbp1_S = arrRcbp1;
                }
            });
        };
        $scope.getTrucker();

        $scope.getPackType = function () {
            var objUri = ApiService.Uri(true, '/api/wms/Rcpk');
            // objUri.addSearch('LOC_CODE', "");
            ApiService.Get(objUri, false).then(function success(result) {
                var arrRcpk = new Array();
                if (result.data.results.length > 0) {
                    for (var i = 0; i < result.data.results.length; i++) {
                        arrRcpk.push(result.data.results[i].PackType);
                    }
                    $scope.Rcpk_S = arrRcpk;
                }
            });
        };
        $scope.getPackType();

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
        var checkDomestic = function () {
            if ($scope.Detail.ONHAND_D.SHP_MODE === 'L2' || $scope.Detail.ONHAND_D.SHP_MODE === 'L1') {
                $scope.Detail.ONHAND_D.DomesticFlag = 'Y';
            } else {
                $scope.Detail.ONHAND_D.DomesticFlag = 'N';
            }
            $scope.Detail.disabled = true;
        };

        var CheckAOG = function () {

            if ($scope.Detail.ONHAND_D.DomesticFlag === 'Y') {
                if ($scope.Detail.ONHAND_D.SHP_MODE === 'L1') {
                    $scope.Detail.chkSHP_MODE.checked = true;
                } else {
                    $scope.Detail.chkSHP_MODE.checked = false;
                }
            } else {
                if ($scope.Detail.ONHAND_D.SHP_MODE === 'A1') {
                    $scope.Detail.chkSHP_MODE.checked = true;
                } else {
                    $scope.Detail.chkSHP_MODE.checked = false;
                }
            }

        };
        $scope.AOGChange = function () {
            if ($scope.Detail.chkSHP_MODE.checked === true) {
                $scope.Detail.ONHAND_D.AOG = 'Y';
            } else {
                $scope.Detail.ONHAND_D.AOG = 'N';
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
        $scope.ClearVenderShipDate = function () {
            $scope.Detail.ONHAND_D.PICKUP_SUP_datetime = '';
        };
        $scope.Create = function () {
          var promptPopup = $ionicPopup.show({
              template: '',
              title: 'Create Onhand',
              subTitle: 'Are you sure to Create Onhand?',
              scope: $scope,
              buttons: [{
                  text: 'Cancel'
              }, {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function (e) {

                    if (is.not.undefined($scope.Detail.ChargeType.NewItem)) {
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
                        $scope.Detail.disabled = true;
                        $scope.Detail.ONHAND_D.UserID = sessionStorage.getItem('UserId').toString();
                        $scope.Detail.ONHAND_D.TRK_CHRG_TYPE = $scope.Detail.ChargeType.NewItem;
                        $scope.pushChange();
                        $scope.AOGChange();
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
                    } else {
                        PopupService.Alert(null, 'Must tick ChargeType', '').then(function (res) {});
                    }

                  }
              }]
          });


        };

        $scope.Update = function () {
            if ($scope.Detail.ONHANDNO !== '') {
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
                $scope.Detail.ONHAND_D.ONHAND_NO = $scope.Detail.ONHANDNO;
                $scope.Detail.ONHAND_D.UserID = sessionStorage.getItem('UserId').toString();
                $scope.Detail.ONHAND_D.TRK_CHRG_TYPE = $scope.Detail.ChargeType.NewItem;

                $scope.pushChange();
                $scope.AOGChange();
                var arrONHAND_D = [];
                arrONHAND_D.push($scope.Detail.ONHAND_D);
                var jsonData = {
                    "UpdateAllString": JSON.stringify(arrONHAND_D)
                };
                var objUri = ApiService.Uri(true, '/api/wms/ONHAND_D/update');
                ApiService.Post(objUri, jsonData, true).then(function success(result) {

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
                templateType: 'modal',
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

        // start Enquiry
        var CheckTableTitle = function () {
            if ($scope.Type === 'Enquiry') {
                $scope.Detail.TableTitle = 'Enquiry';
            }
            if ($scope.Type === 'Update') {
                $scope.Detail.Title = 'OnhandNo : ' + $scope.Detail.ONHANDNO;
            }
            $scope.findOnhand($scope.Detail.ONHANDNO);
        };

        $scope.refreshOnhand_D = function (OnhandNo) {
            if (is.not.undefined(OnhandNo) && is.not.empty(OnhandNo)) {
                var objUri = ApiService.Uri(true, '/api/wms/ONHAND_D/OnhandNo');
                objUri.addSearch('strONHAND_NO', OnhandNo);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Onhand_DForOnhandNos = result.data.results;
                });
            }
        };

        $scope.findOnhand = function (ONHANDNO) {
            $scope.Detail.ONHANDNO = ONHANDNO;
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
                        checkDomestic();
                        CheckChargeType();
                        CheckAOG();
                        // checkAOG();
                    } else {
                        PopupService.Info(null, 'Please Enter The Current OhandNo').then();
                    }
                });
            } else {
                $scope.Detail.VisibleDetailFlag = 'N';
                // PopupService.Info(null, 'Please Enter OhandNo').then();
            }
            if (!ENV.fromWeb) {
                $cordovaKeyboard.close();
            }
        };

        CheckTableTitle();
        $scope.findOH_PID_D = function (Type) {
            if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D');
                objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Detail.OH_PID_D_S = result.data.results;
                    if (Type !== 'Update') {
                        if (is.array($scope.Detail.OH_PID_D_S) && is.not.empty($scope.Detail.OH_PID_D_S)) {
                            showPid($scope.Detail.OH_PID_D_S.length - 1, 'Delete');
                        } else {
                            // PopupService.Info(null, 'This OH_PID_D has no Record Please Add').then(function (res) {
                            // });
                        }
                    }
                    $scope.UpdateTotal();
                });
            } else {
                PopupService.Info(null, 'Please First Create Onhand').then();
            }
        };

        $scope.enter = function (ev, type, value) {
            if (is.equal(ev.keyCode, 13)) {
                if (is.equal(type, 'AddPID_NO')) {
                    if ($scope.blnVerifyInput('AddPID_NO', value)) {} else {}
                } else if (is.equal(type, 'PID_NO')) {
                    if ($scope.blnVerifyInput('PID_NO', value)) {} else {}
                }
                if (!ENV.fromWeb) {
                    $cordovaKeyboard.close();
                }
            }
        };

        $scope.blnVerifyInput = function (type, value) {
            var blnPass = true;
            if (is.equal(type, 'AddPID_NO')) {
                if (value.length > 0 && value.length === 8) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/validate');
                    objUri.addSearch('strPID_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            $scope.Detail.Add_OH_PID_D.PID_NO = '';
                            PopupService.Alert(null, 'Pid No : ' + results[0].PID_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });

                } else {
                    PopupService.Alert(null, 'Must be 8 digit').then();
                }
            } else if (is.equal(type, 'PID_NO')) {
                if (value.length > 0 && value.length === 8) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/validate');
                    objUri.addSearch('strPID_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            $scope.Detail.OH_PID_D.PID_NO = '';
                            PopupService.Alert(null, 'Pid No : ' + results[0].PID_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });
                } else {
                    PopupService.Alert(null, 'Must be 8 digit').then();
                }
            } else if (is.equal(type, 'PID_TruckerBill')) {
                if (value.length > 0) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/TruckerBillNo');
                    objUri.addSearch('strTRK_BILL_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            var promptPopup = $ionicPopup.show({
                                template: '',
                                title: 'Trucker Bill',
                                subTitle: 'This Trucker Bill No ' + results[0].TRK_BILL_NO + ' is already under the ' + results[0].ONHAND_NO + ', do you want to continue to add to this Onhand?',
                                scope: $scope,
                                buttons: [{
                                    text: 'No',
                                    onTap: function (e) {
                                        $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                                        // $('#txt-TruckerBill').focus();
                                    }
                                }, {
                                    text: '<b>Yes</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        // $('#txt-PID_NO').focus();
                                    }
                                }]
                            });
                            // $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                            // PopupService.Alert(null, 'Trucker Bill No : ' + results[0].TRK_BILL_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });
                }
            } else if (is.equal(type, 'TruckerBill')) {
                if (value.length > 0) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/TruckerBillNo');
                    objUri.addSearch('strTRK_BILL_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            var promptPopup = $ionicPopup.show({
                                template: '',
                                title: 'Trucker Bill',
                                subTitle: 'This Trucker Bill No ' + results[0].TRK_BILL_NO + ' is already under the ' + results[0].ONHAND_NO + ', do you want to continue to add to this Onhand?',
                                scope: $scope,
                                buttons: [{
                                    text: 'No',
                                    onTap: function (e) {
                                        $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                                        // $('#txt-addTruckerBill').focus();
                                    }
                                }, {
                                    text: '<b>Yes</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        // $('#txt-PID_NO').focus();
                                    }
                                }]
                            });
                        } else {}
                    });
                }
            }
            return blnPass;
        };
        $scope.openCam = function (type) {
            if (!ENV.fromWeb) {
                if (is.equal(type, 'AddPID_NO')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('AddPID_NO', imageData.text)) {
                            $scope.Detail.Add_OH_PID_D.PID_NO = imageData.text.substr(0, 8);
                        }
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'TruckerBill')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('TruckerBill', imageData.text)) {
                            $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = imageData.text;
                        }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'PID_NO')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('PID_NO', imageData.text)) {
                            $scope.Detail.OH_PID_D.PID_NO = imageData.text.substr(0, 8);
                        }
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'PID_TruckerBill')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('PID_TruckerBill', imageData.text)) {
                            $scope.Detail.OH_PID_D.TRK_BILL_NO = imageData.text;
                        }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'Location')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        // if ($scope.blnVerifyInput('PID_TruckerBill', imageData.text)) {
                        $scope.Detail.ONHAND_D.LOC_CODE = imageData.text;
                        // }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                }
            }
        };
        $scope.clearInput = function (type) {
            if (is.equal(type, 'AddPID_NO')) {
                if ($scope.Detail.Add_OH_PID_D.PID_NO.length > 0) {
                    $scope.Detail.Add_OH_PID_D.PID_NO = '';
                    $('#txt-addPID_NO').focus();
                }
            } else if (is.equal(type, 'TruckerBill')) {
                if ($scope.Detail.Add_OH_PID_D.TRK_BILL_NO.length > 0) {
                    $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                    $('#txt-addTruckerBill').focus();
                }
            } else if (is.equal(type, 'PID_NO')) {
                if ($scope.Detail.OH_PID_D.PID_NO.length > 0) {
                    $scope.Detail.OH_PID_D.PID_NO = '';
                    $('#txt-PID_NO').focus();
                }
            } else if (is.equal(type, 'PID_TruckerBill')) {
                if ($scope.Detail.OH_PID_D.TRK_BILL_NO.length > 0) {
                    $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                    $('#txt-TruckerBill').focus();
                }
            }
        };

        $scope.UpdateTotal = function () {
            if ($scope.Detail.OH_PID_D_S.length > 0) {
                var TotalWeight = 0;
                var TotalPCS = 0;
                for (var i = 0; i < $scope.Detail.OH_PID_D_S.length; i++) {
                    TotalWeight = TotalWeight + $scope.Detail.OH_PID_D_S[i].GROSS_LB;
                    TotalPCS = TotalPCS + $scope.Detail.OH_PID_D_S[i].PIECES;
                }
                $scope.Detail.ONHAND_D.TotalWeight = TotalWeight;
                $scope.Detail.ONHAND_D.TotalPCS = TotalPCS;
            }
        };
        var insertPrintValue = function () {
            var objPrint = {
                OnhandNo: $scope.Detail.ONHANDNO,
                Location: $scope.Detail.ONHAND_D.LOC_CODE,
                TOT_PCS: $scope.Detail.ONHAND_D.TotalPCS,
            };
            SqlService.Delete('PrintValue').then(function () {
                SqlService.Insert('PrintValue', objPrint).then(
                    function (res) {}
                );
            });
        };
        $scope.GoToDetail = function (OnhandNo) {
            if (OnhandNo !== null && OnhandNo.length > 0) {
                $state.go('grDetail', {
                    'OnhandNo': OnhandNo,
                    'Type': $scope.Type,
                }, {
                    reload: true
                });
                insertPrintValue();
            } else {
                PopupService.Info(null, 'Please First Enter Onhand', '').then(function (res) {});
            }
        };

        $scope.GoToPid = function () {
            if ($scope.Detail.ONHANDNO.length > 0) {
                var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/CheckAlreadyPid');
                objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                ApiService.Get(objUri, false).then(function success(result) {
                    var ResultPid = result.data.results;
                    if (ResultPid.length > 0) {
                        $state.go('GrPid', {
                            'OnhandNo': $scope.Detail.ONHANDNO,
                            'Type': $scope.Type,
                        }, {
                            reload: true
                        });
                    } else {
                        $state.go('GrAddPid', {
                            'OnhandNo': $scope.Detail.ONHANDNO,
                            'Type': $scope.Type,

                        }, {
                            reload: true
                        });
                    }
                });
            } else {
                PopupService.Info(null, 'Please First Enter Onhand', '').then(function (res) {});
            }
        };
        // End Add Pid Page
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
        $scope.OnhandNo = $stateParams.OnhandNo;
        $scope.Type = $stateParams.Type;
        $scope.Detail = {
            OnhandNo: '',
            Location: '',
            TotalPCS: ''
        };

        $scope.print = function () {
            // if (!ENV.fromWeb) {
            //     // PopupService.Info(null,   $scope.OnhandNo).then();　
            //     var sApp = startApp.set({ /* params */
            //         // "action":"ACTION_MAIN",
            //         // "category":"CATEGORY_DEFAULT",
            //         // "type":"text/css",
            //         "package": "com.sysmagic.onhandlabel",
            //         // "uri":"file://data/index.html",
            //         // "flags":["FLAG_ACTIVITY_CLEAR_TOP","FLAG_ACTIVITY_CLEAR_TASK"],
            //         // "component": ["com.app.name","com.app.name.Activity"],
            //         "intentstart": "MainActivity",
            //     }, { /* extras */
            //         "msg": "1,2,3",
            //
            //         //"extraKey2":"extraValue2"
            //     });
            //
            //     sApp.start(function () { /* success */
            //         // alert("OK");
            //     }, function (error) { /* fail */
            //         alert(error);
            //     });
            //
            // }

            SqlService.Select('PrintValue', '*').then(function (results) {
                var len = results.rows.length;
                if (len > 0) {
                    var PrintValue = results.rows.item(0);
                    $scope.Detail.OnhandNo = PrintValue.OnhandNo;
                    $scope.Detail.Location = PrintValue.Location;
                    $scope.Detail.TotalPCS = PrintValue.TOT_PCS;
                    if ($scope.Detail.OnhandNo.length > 0) {
                        if (!ENV.fromWeb) {　
                            var sApp = startApp.set({ /* params */
                                "package":"com.zebra.kdu",
                                "intentstart": "aa",
                            }, { /* extras */
                                "msg": $scope.OnhandNo + ',' + $scope.Detail.Location + ',' + $scope.Detail.TotalPCS
                            });

                            sApp.start(function () { /* success */
                                // alert("OK");
                            }, function (error) { /* fail */
                                alert(error);
                            });

                        }
                    }
                }
            });

        };

        $scope.returnList = function () {
            if ($scope.Type === 'Enquiry') {
                $scope.Type = 'Enquiry';
            } else {
                $scope.Type = 'Update';
            }
            $state.go('grList', {
                'OnhandNo': $scope.OnhandNo,
                'Type': $scope.Type,
            }, {
                reload: true
            });

        };
    }
]);

appControllers.controller('GrPidCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    '$ionicModal',
    '$ionicPopup',
    '$cordovaBarcodeScanner',
    '$ionicPlatform',
    '$ionicHistory',
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
        $ionicPopup,
        $cordovaBarcodeScanner,
        $ionicPlatform,
        $ionicHistory,
        ionicDatePicker,
        ApiService,
        PopupService) {
        var arrRcdg1 = new Array();
        var arrPidUnGrid = new Array();
        $scope.Type = $stateParams.Type;
        $scope.Rcbp1 = {};
        $scope.Rcbp1ForConsinnee = {};
        $scope.ShiperCode = {};
        $scope.Detail = {
            TableTitle: 'Create Onhand',
            Title: 'New',
            ONHANDNO: $stateParams.OnhandNo,
            location: '',
            Trucker: '',
            disabled: true,
            VisibleDetailFlag: 'N',
            ONHAND_D: {
                UserID: '',
            },
            OH_PID_D_S: {},
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
            Rcdg1: {},
            Rcdg1s: {},
            PidUnGrid: {},
            PidUnGrids: {},
            blnNext: true
        };

        $scope.AddUnNo = function () {
            $scope.updateLineItem('Update'); //When Leave Text save  value
            $state.go('GrUnNo', {
                'OnhandNo': $scope.Detail.ONHANDNO,
                'Type': $scope.Type,
                'LineItemNo': $scope.Detail.OH_PID_D.LineItemNo,
            }, {
                reload: true
            });
        };

        $scope.GoToAddPid = function () {

            if ($scope.Detail.ONHANDNO.length > 0) {
                $scope.updateLineItem('Update');
                $state.go('GrAddPid', {
                    'OnhandNo': $scope.Detail.ONHANDNO,
                    'Type': $scope.Type,

                }, {
                    reload: true
                });
            } else {
                PopupService.Info(null, 'Please First Enter Onhand', '').then(function (res) {});
            }
        };

        $scope.returnList = function () {
            $scope.updateLineItem('Update');
            if ($scope.Type === 'Enquiry') {
                $scope.Type = 'Enquiry';
            } else {
                $scope.Type = 'Update';
            }
            $state.go('grList', {
                'OnhandNo': $scope.Detail.ONHANDNO,
                'Type': $scope.Type,
            }, {
                reload: true
            });

        };

        var test = function () {
            console.log('haha');
        };

        $ionicPlatform.ready(function () {
            test();
        });
        $scope.getPackType = function () {
            var objUri = ApiService.Uri(true, '/api/wms/Rcpk');
            // objUri.addSearch('LOC_CODE', "");
            ApiService.Get(objUri, false).then(function success(result) {
                var arrRcpk = new Array();
                if (result.data.results.length > 0) {
                    for (var i = 0; i < result.data.results.length; i++) {
                        arrRcpk.push(result.data.results[i].PackType);
                    }
                    $scope.Rcpk_S = arrRcpk;
                }
            });
        };
        $scope.getPackType();
        $scope.returnMain = function () {
            $state.go('index.main', {}, {
                reload: true
            });
        };
        $scope.findOH_PID_D = function (Type) {
            if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D');
                objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Detail.OH_PID_D_S = result.data.results;
                    if (Type !== 'Update') {
                        if (is.array($scope.Detail.OH_PID_D_S) && is.not.empty($scope.Detail.OH_PID_D_S)) {
                            showPid($scope.Detail.OH_PID_D_S.length - 1, 'Delete');
                        } else {
                            // PopupService.Info(null, 'This OH_PID_D has no Record Please Add').then(function (res) {
                            // });
                        }
                    }
                    $scope.UpdateTotal();
                });
            } else {
                PopupService.Info(null, 'Please First Create Onhand').then();
            }
        };
        $scope.enter = function (ev, type, value) {
            if (is.equal(ev.keyCode, 13)) {
                if (is.equal(type, 'AddPID_NO')) {
                    if ($scope.blnVerifyInput('AddPID_NO', value)) {} else {}
                } else if (is.equal(type, 'PID_NO')) {
                    if ($scope.blnVerifyInput('PID_NO', value)) {} else {}
                }
                if (!ENV.fromWeb) {
                    $cordovaKeyboard.close();
                }
            }
        };
        $scope.blnVerifyInput = function (type, value) {
            var blnPass = true;
            if (is.equal(type, 'AddPID_NO')) {
                if (value.length > 0 && value.length === 8) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/validate');
                    objUri.addSearch('strPID_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            $scope.Detail.Add_OH_PID_D.PID_NO = '';
                            PopupService.Alert(null, 'Pid No : ' + results[0].PID_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });

                } else {
                    PopupService.Alert(null, 'Must be 8 digit').then();
                }
            } else if (is.equal(type, 'PID_NO')) {
                if (value.length > 0 && value.length === 8) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/validate');
                    objUri.addSearch('strPID_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            $scope.Detail.OH_PID_D.PID_NO = '';
                            PopupService.Alert(null, 'Pid No : ' + results[0].PID_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });
                } else {
                    PopupService.Alert(null, 'Must be 8 digit').then();
                }
            } else if (is.equal(type, 'PID_TruckerBill')) {
                if (value.length > 0) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/TruckerBillNo');
                    objUri.addSearch('strTRK_BILL_NO', value);
                    objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            if (results[0].ResultTruckerBillNo !== "" && is.not.undefined(results[0].ResultTruckerBillNo)) {
                                if (results[0].ResultTruckerBillNo === "N") {
                                    PopupService.Info(null, 'Invalid Trucker Bill No ');
                                    $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                                } else {
                                    if (results[0].ReturnTruckerBillNo === 12) {
                                        $scope.Detail.OH_PID_D.TRK_BILL_NO = $scope.Detail.OH_PID_D.TRK_BILL_NO.substring($scope.Detail.OH_PID_D.TRK_BILL_NO.length - 12, $scope.Detail.OH_PID_D.TRK_BILL_NO.length);
                                    } else if (results[0].ReturnTruckerBillNo === 15) {
                                        $scope.Detail.OH_PID_D.TRK_BILL_NO = $scope.Detail.OH_PID_D.TRK_BILL_NO.substring($scope.Detail.OH_PID_D.TRK_BILL_NO.length - 15, $scope.Detail.OH_PID_D.TRK_BILL_NO.length);
                                    }

                                }
                            } else {
                                blnPass = false;
                                var promptPopup = $ionicPopup.show({
                                    template: '',
                                    title: 'Trucker Bill',
                                    subTitle: 'This Trucker Bill No ' + results[0].TRK_BILL_NO + ' is already under the ' + results[0].ONHAND_NO + ', do you want to continue to add to this Onhand?',
                                    scope: $scope,
                                    buttons: [{
                                        text: 'No',
                                        onTap: function (e) {
                                            $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                                        }
                                    }, {
                                        text: '<b>Yes</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {}
                                    }]
                                });
                            }
                        } else {

                        }
                    });
                }
            } else if (is.equal(type, 'TruckerBill')) {
                if (value.length > 0) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/TruckerBillNo');
                    objUri.addSearch('strTRK_BILL_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            var promptPopup = $ionicPopup.show({
                                template: '',
                                title: 'Trucker Bill',
                                subTitle: 'This Trucker Bill No ' + results[0].TRK_BILL_NO + ' is already under the ' + results[0].ONHAND_NO + ', do you want to continue to add to this Onhand?',
                                scope: $scope,
                                buttons: [{
                                    text: 'No',
                                    onTap: function (e) {
                                        $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                                    }
                                }, {
                                    text: '<b>Yes</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {}
                                }]
                            });

                        } else {}
                    });
                }
            }
            return blnPass;
        };
        $scope.openCam = function (type) {
            if (!ENV.fromWeb) {
                if (is.equal(type, 'AddPID_NO')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('AddPID_NO', imageData.text)) {
                            $scope.Detail.Add_OH_PID_D.PID_NO = imageData.text.substr(0, 8);
                        }
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'TruckerBill')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('TruckerBill', imageData.text)) {
                            $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = imageData.text;
                        }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'PID_NO')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('PID_NO', imageData.text)) {
                            $scope.Detail.OH_PID_D.PID_NO = imageData.text.substr(0, 8);
                        }
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'PID_TruckerBill')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('PID_TruckerBill', imageData.text)) {
                            $scope.Detail.OH_PID_D.TRK_BILL_NO = imageData.text;
                        }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'Location')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        // if ($scope.blnVerifyInput('PID_TruckerBill', imageData.text)) {
                        $scope.Detail.ONHAND_D.LOC_CODE = imageData.text;
                        // }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                }
            }
        };
        $scope.clearInput = function (type) {
            if (is.equal(type, 'AddPID_NO')) {
                if ($scope.Detail.Add_OH_PID_D.PID_NO.length > 0) {
                    $scope.Detail.Add_OH_PID_D.PID_NO = '';
                    $('#txt-addPID_NO').focus();
                }
            } else if (is.equal(type, 'TruckerBill')) {
                if ($scope.Detail.Add_OH_PID_D.TRK_BILL_NO.length > 0) {
                    $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                    $('#txt-addTruckerBill').focus();
                }
            } else if (is.equal(type, 'PID_NO')) {
                if ($scope.Detail.OH_PID_D.PID_NO.length > 0) {
                    $scope.Detail.OH_PID_D.PID_NO = '';
                    $('#txt-PID_NO').focus();
                }
            } else if (is.equal(type, 'PID_TruckerBill')) {
                if ($scope.Detail.OH_PID_D.TRK_BILL_NO.length > 0) {
                    $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                    $('#txt-TruckerBill').focus();
                }
            }
        };

        $scope.findOH_PID_D('');

        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.updateLineItem('Update');

        };

        var funIndexOf = function (val, Type, arr) {
            if (Type !== 'undefined' && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (Type === 'del') {
                        if (arr[i].UnNo == val) return i;
                    }
                }
            }
            return -1;
        };

        $scope.funRemove = function (val) {
            var index = funIndexOf(val, 'del', arrPidUnGrid);
            if (index > -1) {
                arrPidUnGrid.splice(index, 1, {
                    UnNo: "",
                    DGClass: "",
                    DGDescription: ""
                });
                $scope.UpdateUnNo(index);
            }
        };
        $scope.UpdateUnNo = function (Index) {
            var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/UpdateUnNo');
            objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
            objUri.addSearch('LineItemNo', $scope.Detail.OH_PID_D.LineItemNo);
            objUri.addSearch('UnNoIndex', Index);
            ApiService.Get(objUri, false).then(function success(result) {
                var results = result.data.results;
                if (is.not.empty(results)) {} else {}
            });

        };
        $scope.DeleteGridLine = function (UnNo) {
            $scope.funRemove(UnNo);
            $scope.Detail.PidUnGrid = arrPidUnGrid;
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
                        $scope.findOH_PID_D('Delete');
                    } else {}
                });
            }
        };
        $scope.updateLineItem = function (Type) {
            var arrOH_PID_D = [];
            var jsonData = '';
            var objUri = '';
            if (Type === 'Update') {
                if ($scope.Detail.OH_PID_D_S.length > 0) {
                    $scope.Detail.OH_PID_D.ONHAND_NO = $scope.Detail.ONHANDNO;
                    $scope.Detail.OH_PID_D.UserID = sessionStorage.getItem('UserId').toString();
                    arrOH_PID_D.push($scope.Detail.OH_PID_D);
                    jsonData = {
                        "UpdateAllString": JSON.stringify(arrOH_PID_D)
                    };
                    objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/updateLineItem');
                    ApiService.Post(objUri, jsonData, true).then(function success(result) {
                        if (is.not.empty(result)) {
                            $scope.findOH_PID_D(Type);
                        }
                    });
                }
            } else {

            }
        };
        var ReturnEmpty = function (Value) {
            if (Value === 0) {
                return '';
            } else {
                return Value;
            }

        };
        var showPid = function (row, Type) {
            if (Type !== 'Delete') {
                $scope.updateLineItem('Update');
            }
            if (row !== null && $scope.Detail.OH_PID_D_S.length >= row) {
                $scope.Detail.OH_PID_D = {
                    RowNum: $scope.Detail.OH_PID_D_S[row].RowNum,
                    LineItemNo: $scope.Detail.OH_PID_D_S[row].LineItemNo,
                    TRK_BILL_NO: $scope.Detail.OH_PID_D_S[row].TRK_BILL_NO,
                    PACK_TYPE: $scope.Detail.OH_PID_D_S[row].PACK_TYPE,
                    PID_NO: $scope.Detail.OH_PID_D_S[row].PID_NO,
                    UnNo: $scope.Detail.OH_PID_D_S[row].UnNo,
                    GROSS_LB: ReturnEmpty($scope.Detail.OH_PID_D_S[row].GROSS_LB),
                    LENGTH: ReturnEmpty($scope.Detail.OH_PID_D_S[row].LENGTH),
                    WIDTH: ReturnEmpty($scope.Detail.OH_PID_D_S[row].WIDTH),
                    HEIGHT: ReturnEmpty($scope.Detail.OH_PID_D_S[row].HEIGHT),
                    UnNo02: $scope.Detail.OH_PID_D_S[row].UnNo02,
                    UnNo03: $scope.Detail.OH_PID_D_S[row].UnNo03,
                    UnNo04: $scope.Detail.OH_PID_D_S[row].UnNo04,
                    UnNo05: $scope.Detail.OH_PID_D_S[row].UnNo05,
                    UnNo06: $scope.Detail.OH_PID_D_S[row].UnNo06,
                    UnNo07: $scope.Detail.OH_PID_D_S[row].UnNo07,
                    UnNo08: $scope.Detail.OH_PID_D_S[row].UnNo08,
                    UnNo09: $scope.Detail.OH_PID_D_S[row].UnNo09,
                    UnNo10: $scope.Detail.OH_PID_D_S[row].UnNo10,
                    Remark: $scope.Detail.OH_PID_D_S[row].Remark,
                };
                getPidUngrid($scope.Detail.OH_PID_D_S[row]);
            }
            $scope.Detail.blnNext = true;
        };
        var getPidUngrid = function (PidRows) {
            arrPidUnGrid = new Array();
            $scope.Detail.PidUnGrids = '';
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo01,
                DGClass: PidRows.DgClass01,
                DGDescription: PidRows.DgDescription01
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo02,
                DGClass: PidRows.DgClass02,
                DGDescription: PidRows.DgDescription02
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo03,
                DGClass: PidRows.DgClass03,
                DGDescription: PidRows.DgDescription03
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo04,
                DGClass: PidRows.DgClass04,
                DGDescription: PidRows.DgDescription04
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo05,
                DGClass: PidRows.DgClass05,
                DGDescription: PidRows.DgDescription05
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo06,
                DGClass: PidRows.DgClass06,
                DGDescription: PidRows.DgDescription06
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo07,
                DGClass: PidRows.DgClass07,
                DGDescription: PidRows.DgDescription07
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo08,
                DGClass: PidRows.DgClass08,
                DGDescription: PidRows.DgDescription08
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo09,
                DGClass: PidRows.DgClass09,
                DGDescription: PidRows.DgDescription09
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrid = {
                UnNo: PidRows.UnNo10,
                DGClass: PidRows.DgClass10,
                DGDescription: PidRows.DgDescription10
            };
            arrPidUnGrid.push($scope.Detail.PidUnGrid);
            $scope.Detail.PidUnGrids = arrPidUnGrid;
        };

        $scope.showPrev = function () {
            var intRow = $scope.Detail.OH_PID_D.RowNum - 1;
            if ($scope.Detail.OH_PID_D_S.length > 0 && intRow > 0 && is.equal($scope.Detail.OH_PID_D_S[intRow - 1].RowNum, intRow)) {
                showPid(intRow - 1, '');
            } else {
                PopupService.Info(null, 'Already the first one');
            }
        };
        $scope.showNext = function () {
            var intRow = $scope.Detail.OH_PID_D.RowNum + 1;
            if ($scope.Detail.OH_PID_D_S.length > 0 && $scope.Detail.OH_PID_D_S.length >= intRow && is.equal($scope.Detail.OH_PID_D_S[intRow - 1].RowNum, intRow)) {
                showPid(intRow - 1, '');
            } else {
                PopupService.Info(null, 'Already the last one');
            }

        };
        // End Pid Page
        // start Add Pid Page
        $scope.UpdateTotal = function () {
            if ($scope.Detail.OH_PID_D_S.length > 0) {
                var TotalWeight = 0;
                var TotalPCS = 0;
                for (var i = 0; i < $scope.Detail.OH_PID_D_S.length; i++) {
                    TotalWeight = TotalWeight + $scope.Detail.OH_PID_D_S[i].GROSS_LB;
                    TotalPCS = TotalPCS + $scope.Detail.OH_PID_D_S[i].PIECES;
                }
                $scope.Detail.ONHAND_D.TotalWeight = TotalWeight;
                $scope.Detail.ONHAND_D.TotalPCS = TotalPCS;
            }
        };

        $scope.GoToDetail = function (OnhandNo) {
            if (OnhandNo !== null && OnhandNo.length > 0) {
                $state.go('grDetail', {
                    'OnhandNo': OnhandNo,
                }, {
                    reload: true
                });

            } else {
                PopupService.Info(null, 'Please First Enter Onhand', '').then(function (res) {});
            }
        };
    }
]);

appControllers.controller('GrAddPidCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    '$ionicModal',
    '$ionicPopup',
    '$cordovaBarcodeScanner',
    'ionicDatePicker',
    'ApiService',
    'PopupService',
    'SqlService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $cordovaKeyboard,
        $ionicModal,
        $ionicPopup,
        $cordovaBarcodeScanner,
        ionicDatePicker,
        ApiService,
        PopupService,
        SqlService
    ) {
        var arrRcdg1 = new Array();
        var arrPidUnGrid = new Array();
        $scope.Type = $stateParams.Type;
        $scope.Rcbp1 = {};
        $scope.Rcbp1ForConsinnee = {};
        $scope.ShiperCode = {};
        $scope.Detail = {
            TableTitle: 'Create Onhand',
            Title: 'New',
            ONHANDNO: $stateParams.OnhandNo,
            location: '',
            Trucker: '',
            disabled: true,
            VisibleDetailFlag: 'N',
            ONHAND_D: {
                UserID: '',
            },

            OH_PID_D_S: {},
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
                HEIGHT: 0,
                Remark: '',

            },
            Rcdg1: {},
            Rcdg1s: {},
            PidUnGrid: {},
            PidUnGrids: {},
            blnNext: true
        };
        $scope.GoToPid = function () {
            if ($scope.Type === 'Enquiry') {
                $scope.Type = 'Enquiry';
            } else {
                $scope.Type = 'Update';
            }
            $state.go('GrPid', {
                'OnhandNo': $scope.Detail.ONHANDNO,
                'Type': $scope.Type,
            }, {
                reload: true
            });
            DeleteRcdg1();
            DeleteAddPid();
        };
        $scope.getPackType = function () {
            var objUri = ApiService.Uri(true, '/api/wms/Rcpk');
            // objUri.addSearch('LOC_CODE', "");
            ApiService.Get(objUri, false).then(function success(result) {
                var arrRcpk = new Array();
                if (result.data.results.length > 0) {
                    for (var i = 0; i < result.data.results.length; i++) {
                        arrRcpk.push(result.data.results[i].PackType);
                    }
                    $scope.Rcpk_S = arrRcpk;
                    if ($scope.Rcpk_S.length > 0) {
                        if ($scope.Rcpk_S.includes("Carton Box") === true) {
                            $scope.Detail.Add_OH_PID_D.PACK_TYPE = 'Carton Box';
                        }
                    }

                }
            });
        };
        $scope.getPackType();

        $scope.enter = function (ev, type, value) {
            if (is.equal(ev.keyCode, 13)) {
                if (is.equal(type, 'AddPID_NO')) {
                    if ($scope.blnVerifyInput('AddPID_NO', value)) {} else {}
                } else if (is.equal(type, 'PID_NO')) {
                    if ($scope.blnVerifyInput('PID_NO', value)) {} else {}
                }
                if (!ENV.fromWeb) {
                    $cordovaKeyboard.close();
                }
            }
        };

        $scope.blnVerifyInput = function (type, value) {
            var blnPass = true;
            if (is.equal(type, 'AddPID_NO')) {
                if (value.length > 0 && value.length === 8) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/validate');
                    objUri.addSearch('strPID_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            $scope.Detail.Add_OH_PID_D.PID_NO = '';
                            PopupService.Alert(null, 'Pid No : ' + results[0].PID_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });

                } else {
                    PopupService.Alert(null, 'Must be 8 digit').then();
                }
            } else if (is.equal(type, 'PID_NO')) {
                if (value.length > 0 && value.length === 8) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/validate');
                    objUri.addSearch('strPID_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            $scope.Detail.OH_PID_D.PID_NO = '';
                            PopupService.Alert(null, 'Pid No : ' + results[0].PID_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });
                } else {
                    PopupService.Alert(null, 'Must be 8 digit').then();
                }
            } else if (is.equal(type, 'PID_TruckerBill')) {
                if (value.length > 0) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/TruckerBillNo');
                    objUri.addSearch('strTRK_BILL_NO', value);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            blnPass = false;
                            var promptPopup = $ionicPopup.show({
                                template: '',
                                title: 'Trucker Bill',
                                subTitle: 'This Trucker Bill No ' + results[0].TRK_BILL_NO + ' is already under the ' + results[0].ONHAND_NO + ', do you want to continue to add to this Onhand?',
                                scope: $scope,
                                buttons: [{
                                    text: 'No',
                                    onTap: function (e) {
                                        $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                                        // $('#txt-TruckerBill').focus();
                                    }
                                }, {
                                    text: '<b>Yes</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        // $('#txt-PID_NO').focus();
                                    }
                                }]
                            });
                            // $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                            // PopupService.Alert(null, 'Trucker Bill No : ' + results[0].TRK_BILL_NO + '  Already Exists in ' + results[0].ONHAND_NO).then();
                        } else {}
                    });
                }
            } else if (is.equal(type, 'TruckerBill')) {
                if (value.length > 0) {
                    var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/TruckerBillNo');
                    objUri.addSearch('strTRK_BILL_NO', value);
                    objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                    ApiService.Get(objUri, false).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {

                            if (results[0].ResultTruckerBillNo !== "" && is.not.undefined(results[0].ResultTruckerBillNo)) {
                                if (results[0].ResultTruckerBillNo === "N") {
                                    PopupService.Info(null, 'Invalid Trucker Bill No ');
                                    $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                                } else {

                                }

                            } else {
                                blnPass = false;
                                var promptPopup = $ionicPopup.show({
                                    template: '',
                                    title: 'Trucker Bill',
                                    subTitle: 'This Trucker Bill No ' + results[0].TRK_BILL_NO + ' is already under the ' + results[0].ONHAND_NO + ', do you want to continue to add to this Onhand?',
                                    scope: $scope,
                                    buttons: [{
                                        text: 'No',
                                        onTap: function (e) {
                                            $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                                        }
                                    }, {
                                        text: '<b>Yes</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {}
                                    }]
                                });
                            }

                        } else {}
                    });
                }
            }
            return blnPass;
        };
        $scope.openCam = function (type) {
            if (!ENV.fromWeb) {
                if (is.equal(type, 'AddPID_NO')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('AddPID_NO', imageData.text)) {
                            $scope.Detail.Add_OH_PID_D.PID_NO = imageData.text.substr(0, 8);
                        }
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'TruckerBill')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('TruckerBill', imageData.text)) {
                            $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = imageData.text;
                        }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'PID_NO')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('PID_NO', imageData.text)) {
                            $scope.Detail.OH_PID_D.PID_NO = imageData.text.substr(0, 8);
                        }
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'PID_TruckerBill')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        if ($scope.blnVerifyInput('PID_TruckerBill', imageData.text)) {
                            $scope.Detail.OH_PID_D.TRK_BILL_NO = imageData.text;
                        }

                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else if (is.equal(type, 'Location')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        $scope.Detail.ONHAND_D.LOC_CODE = imageData.text;
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                }
            }
        };
        $scope.clearInput = function (type) {
            if (is.equal(type, 'AddPID_NO')) {
                if ($scope.Detail.Add_OH_PID_D.PID_NO.length > 0) {
                    $scope.Detail.Add_OH_PID_D.PID_NO = '';
                    $('#txt-addPID_NO').focus();
                }
            } else if (is.equal(type, 'TruckerBill')) {
                if ($scope.Detail.Add_OH_PID_D.TRK_BILL_NO.length > 0) {
                    $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                    $('#txt-addTruckerBill').focus();
                }
            } else if (is.equal(type, 'PID_NO')) {
                if ($scope.Detail.OH_PID_D.PID_NO.length > 0) {
                    $scope.Detail.OH_PID_D.PID_NO = '';
                    $('#txt-PID_NO').focus();
                }
            } else if (is.equal(type, 'PID_TruckerBill')) {
                if ($scope.Detail.OH_PID_D.TRK_BILL_NO.length > 0) {
                    $scope.Detail.OH_PID_D.TRK_BILL_NO = '';
                    $('#txt-TruckerBill').focus();
                }
            }
        };
        $scope.UpdateTotal = function () {
            if ($scope.Detail.OH_PID_D_S.length > 0) {
                var TotalWeight = 0;
                var TotalPCS = 0;
                for (var i = 0; i < $scope.Detail.OH_PID_D_S.length; i++) {
                    TotalWeight = TotalWeight + $scope.Detail.OH_PID_D_S[i].GROSS_LB;
                    TotalPCS = TotalPCS + $scope.Detail.OH_PID_D_S[i].PIECES;
                }
                $scope.Detail.ONHAND_D.TotalWeight = TotalWeight;
                $scope.Detail.ONHAND_D.TotalPCS = TotalPCS;
            }
        };
        $scope.updateLineItem = function (Type) {
            var arrOH_PID_D = [];
            var jsonData = '';
            var objUri = '';
            if (Type === 'Update') {
                if ($scope.Detail.OH_PID_D_S.length > 0) {
                    $scope.Detail.OH_PID_D.ONHAND_NO = $scope.Detail.ONHANDNO;
                    arrOH_PID_D.push($scope.Detail.OH_PID_D);
                    jsonData = {
                        "UpdateAllString": JSON.stringify(arrOH_PID_D)
                    };
                    objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/updateLineItem');
                    ApiService.Post(objUri, jsonData, true).then(function success(result) {
                        if (is.not.empty(result)) {
                            $scope.findOH_PID_D(Type);
                        }
                    });
                }
            } else {}
        };

        $scope.openModalAddPID = function () {
            if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                $scope.updateLineItem('Update');
                $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = '';
                $scope.Detail.Add_OH_PID_D.PACK_TYPE = '';
                $scope.Detail.Add_OH_PID_D.PID_NO = '';
                $scope.Detail.Add_OH_PID_D.UnNo = '';
                $scope.Detail.Add_OH_PID_D.GROSS_LB = '';
                $scope.Detail.Add_OH_PID_D.LENGTH = '';
                $scope.Detail.Add_OH_PID_D.WIDTH = '';
                $scope.Detail.Add_OH_PID_D.HEIGHT = '';
                $scope.Detail.Add_OH_PID_D.Remark = '';
                $scope.Detail.Rcdg1s = '';
                $scope.Detail.Add_OH_PID_D.UnNo01 = '';
                $scope.Detail.Add_OH_PID_D.UnNo02 = '';
                $scope.Detail.Add_OH_PID_D.UnNo03 = '';
                $scope.Detail.Add_OH_PID_D.UnNo04 = '';
                $scope.Detail.Add_OH_PID_D.UnNo05 = '';
                $scope.Detail.Add_OH_PID_D.UnNo06 = '';
                $scope.Detail.Add_OH_PID_D.UnNo07 = '';
                $scope.Detail.Add_OH_PID_D.UnNo08 = '';
                $scope.Detail.Add_OH_PID_D.UnNo09 = '';
                $scope.Detail.Add_OH_PID_D.UnNo10 = '';
                arrRcdg1 = new Array();
            } else {}
        };
        $scope.openModalAddPID();
        $scope.refreshRcdg1UnNo = function (UnNo) {
            if (is.not.undefined(UnNo) && is.not.empty(UnNo)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcdg1/UnNo');
                objUri.addSearch('UnNo', UnNo);
                objUri.addSearch('UnNoFlag', 'N');
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Rcdg1s = result.data.results;
                });
            }
        };
        $scope.ShowRcdg1 = function (UnNo) {
            var objUri = ApiService.Uri(true, '/api/wms/rcdg1/UnNo');
            objUri.addSearch('UnNo', UnNo);
            objUri.addSearch('UnNoFlag', 'Y');
            ApiService.Get(objUri, false).then(function success(result) {
                $scope.Detail.Rcdg1 = result.data.results[0];
            });
            if (!ENV.fromWeb) {
                $cordovaKeyboard.close();
            }
        };

        var DeleteRcdg1 = function () {
            SqlService.Delete('Imgr2_Putaway').then(function () {});
        };
        var DeleteAddPid = function () {
            SqlService.Delete('addPid').then(function () {});
        };
        $scope.addLine = function () {

            if ($scope.Detail.Add_OH_PID_D.PACK_TYPE.length > 0) {
                PopupService.Confirm(null, 'Confirm', 'Are you sure to Add PID?').then(function (res) {
                    if (res) {
                        if (is.not.undefined($scope.Detail.ONHANDNO) && is.not.empty($scope.Detail.ONHANDNO)) {
                            var arrOH_PID_D = [];
                            $scope.Detail.Add_OH_PID_D.ONHAND_NO = $scope.Detail.ONHANDNO;
                            $scope.Detail.Add_OH_PID_D.UserID = sessionStorage.getItem('UserId').toString();
                            //add UnNo start
                            for (var i = 0; i < $scope.Detail.Rcdg1s.length; i++) {
                                if (i === 0) {
                                    $scope.Detail.Add_OH_PID_D.UnNo01 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 1) {
                                    $scope.Detail.Add_OH_PID_D.UnNo02 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 2) {
                                    $scope.Detail.Add_OH_PID_D.UnNo03 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 3) {
                                    $scope.Detail.Add_OH_PID_D.UnNo04 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 4) {
                                    $scope.Detail.Add_OH_PID_D.UnNo05 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 5) {
                                    $scope.Detail.Add_OH_PID_D.UnNo06 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 6) {
                                    $scope.Detail.Add_OH_PID_D.UnNo07 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 7) {
                                    $scope.Detail.Add_OH_PID_D.UnNo08 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 8) {
                                    $scope.Detail.Add_OH_PID_D.UnNo09 = $scope.Detail.Rcdg1s[i].UnNo;
                                } else if (i === 9) {
                                    $scope.Detail.Add_OH_PID_D.UnNo10 = $scope.Detail.Rcdg1s[i].UnNo;
                                }
                                //add UnNo end

                            }
                            arrOH_PID_D.push($scope.Detail.Add_OH_PID_D);

                            var jsonData = {
                                "UpdateAllString": JSON.stringify(arrOH_PID_D)
                            };
                            var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/create');
                            ApiService.Post(objUri, jsonData, true).then(function success(result) {
                                var results = result.data.results;
                                if (is.not.empty(results)) {
                                    $scope.GoToPid();
                                    DeleteRcdg1();

                                } else {}
                            });

                        } else {
                            PopupService.Info(null, 'Please First Create Onhand', '').then(function (res) {});
                        }
                    } else {}
                });
            } else {
                PopupService.Alert(null, 'Pack Type Must be Enter', '').then(function (res) {});
            }

        };

        var funIndexOf = function (val, Type, arr) {
            if (Type !== 'undefined' && arr.length > 0) {
                for (var i = 0; i < arr.length; i++) {
                    if (Type === 'del') {
                        if (arr[i].UnNo == val) return i;
                    }
                }
            }
            return -1;
        };

        $scope.funRemove = function (val) {
            var index = funIndexOf(val, 'del', arrRcdg1);
            if (index > -1) {
                arrRcdg1.splice(index, 1);
                SqlService.Delete('Imgr2_Putaway', 'UnNo', val).then(function () {});
            }
        };
        $scope.DeleteLine = function (UnNo) {
            $scope.funRemove(UnNo);
            $scope.Detail.Rcdg1s = arrRcdg1;
        };

        $scope.getRcdg1 = function () {
            SqlService.Select('addPid', '*').then(function (results) {
                var len = results.rows.length;
                if (len > 0) {
                    var Rcdg1 = results.rows.item(0);
                    $scope.Detail.Add_OH_PID_D.TRK_BILL_NO = Rcdg1.TRK_BILL_NO;
                    $scope.Detail.Add_OH_PID_D.PACK_TYPE = Rcdg1.PACK_TYPE;
                    $scope.Detail.Add_OH_PID_D.PID_NO = Rcdg1.PID_NO;
                    $scope.Detail.Add_OH_PID_D.GROSS_LB = Rcdg1.GROSS_LB;
                    $scope.Detail.Add_OH_PID_D.LENGTH = Rcdg1.LENGTH;
                    $scope.Detail.Add_OH_PID_D.WIDTH = Rcdg1.WIDTH;
                    $scope.Detail.Add_OH_PID_D.HEIGHT = Rcdg1.HEIGHT;
                    $scope.Detail.Add_OH_PID_D.Remark = Rcdg1.Remark;
                }
            });

            SqlService.Select('Imgr2_Putaway', '*').then(function (results) {
                var len = results.rows.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var Rcdg1 = results.rows.item(i);
                        arrRcdg1.push(Rcdg1);
                    }
                    $scope.Detail.Rcdg1s = arrRcdg1;
                }
            });
        };
        $scope.getRcdg1();
        var insertAddPidTolocal = function () {
            var objaddUnNo = {
                TRK_BILL_NO: $scope.Detail.Add_OH_PID_D.TRK_BILL_NO,
                PACK_TYPE: $scope.Detail.Add_OH_PID_D.PACK_TYPE,
                PID_NO: $scope.Detail.Add_OH_PID_D.PID_NO,
                GROSS_LB: $scope.Detail.Add_OH_PID_D.GROSS_LB,
                LENGTH: $scope.Detail.Add_OH_PID_D.LENGTH,
                WIDTH: $scope.Detail.Add_OH_PID_D.WIDTH,
                HEIGHT: $scope.Detail.Add_OH_PID_D.HEIGHT,
                Remark: $scope.Detail.Add_OH_PID_D.Remark,
            };
            SqlService.Delete('addPid').then(function () {
                SqlService.Insert('addPid', objaddUnNo).then(
                    function (res) {}
                );
            });
        };

        $scope.AddUnNo = function () {
            insertAddPidTolocal();
            $state.go('GrUnNo', {
                'OnhandNo': $scope.Detail.ONHANDNO,
                'Type': $scope.Type,
            }, {
                reload: true
            });

            // var myPopup = $ionicPopup.show({
            //     templateUrl: 'popup-UnNo.html',
            //     title: 'Add UnNo',
            //     scope: $scope,
            //     cssClass: 'my-custom-popup',
            //     buttons: [{
            //         text: 'Cancel',
            //         onTap: function (e) {}
            //     }, {
            //         text: 'Add',
            //         type: 'button-positive',
            //         onTap: function (e) {
            //             if ($scope.Detail.Rcdg1.UnNo !== '' && is.not.undefined($scope.Detail.Rcdg1.UnNo)) {
            //                 arrRcdg1.push($scope.Detail.Rcdg1);
            //                 $scope.Detail.Rcdg1s = arrRcdg1;
            //                 $scope.Detail.Rcdg1 = '';
            //             }
            //         }
            //     }]
            // });

        };

    }
]);

appControllers.controller('GrUnNoCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$cordovaKeyboard',
    '$ionicModal',
    '$ionicPopup',
    '$cordovaBarcodeScanner',
    '$rootScope',
    'ionicDatePicker',
    'ApiService',
    'PopupService',
    'SqlService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $cordovaKeyboard,
        $ionicModal,
        $ionicPopup,
        $cordovaBarcodeScanner,
        $rootScope,
        ionicDatePicker,
        ApiService,
        PopupService,
        SqlService) {
        var arrRcdg1 = new Array();
        var arrPidUnGrid = new Array();
        $scope.Type = $stateParams.Type;
        $scope.Rcbp1 = {};
        $scope.Rcbp1ForConsinnee = {};
        $scope.ShiperCode = {};
        $scope.Detail = {
            TableTitle: 'Create Onhand',
            Title: 'New',
            ONHANDNO: $stateParams.OnhandNo,
            LineItemNo: $stateParams.LineItemNo,
            location: '',
            Trucker: '',
            disabled: true,
            VisibleDetailFlag: 'N',
            ONHAND_D: {
                UserID: '',
            },
            OH_PID_D_S: {},
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
            Rcdg1: {},
            Rcdg1s: {},
            PidUnGrid: {},
            PidUnGrids: {},
            blnNext: true
        };
        $scope.addLine = function () {
            if ($scope.Detail.LineItemNo.length > 0) {
                var objUri = ApiService.Uri(true, '/api/wms/OH_PID_D/UpdatePidUnNo');
                objUri.addSearch('UnNo', $scope.Detail.Rcdg1.UnNo);
                objUri.addSearch('strONHAND_NO', $scope.Detail.ONHANDNO);
                objUri.addSearch('LineItemNo', $scope.Detail.LineItemNo);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.GoToPid();
                });

            } else {
                var objRcdg1 = {
                    UnNo: $scope.Detail.Rcdg1.UnNo,
                    DGClass: $scope.Detail.Rcdg1.DGClass,
                    DGDescription: $scope.Detail.Rcdg1.DGDescription,

                };
                console.log(objRcdg1.UnNo);

                SqlService.Insert('Imgr2_Putaway', objRcdg1).then(
                    function (res) {}
                );

                $state.go('GrAddPid', {
                    'OnhandNo': $scope.Detail.ONHANDNO,
                    'Type': $scope.Type,
                }, {
                    reload: true
                });
            }
        };

        $scope.GoToPid = function () {
            if ($scope.Detail.ONHANDNO.length > 0) {
                $state.go('GrPid', {
                    'OnhandNo': $scope.Detail.ONHANDNO,
                    'Type': $scope.Type,
                }, {
                    reload: true
                });
            } else {

            }
        };
        $scope.returnAdd = function () {
            if ($scope.Detail.LineItemNo.length > 0) {
                $scope.GoToPid();
            } else {
                $state.go('GrAddPid', {
                    'OnhandNo': $scope.Detail.ONHANDNO,
                    'Type': $scope.Type,
                }, {
                    reload: true
                });
            }

        };

        $scope.refreshRcdg1UnNo = function (UnNo) {
            if (is.not.undefined(UnNo) && is.not.empty(UnNo)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcdg1/UnNo');
                objUri.addSearch('UnNo', UnNo);
                objUri.addSearch('UnNoFlag', 'N');
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Rcdg1s = result.data.results;
                });
            }
        };
        $scope.ShowRcdg1 = function (UnNo) {
            var objUri = ApiService.Uri(true, '/api/wms/rcdg1/UnNo');
            objUri.addSearch('UnNo', UnNo);
            objUri.addSearch('UnNoFlag', 'Y');
            ApiService.Get(objUri, false).then(function success(result) {
                $scope.Detail.Rcdg1 = result.data.results[0];
            });
            if (!ENV.fromWeb) {
                $cordovaKeyboard.close();
            }
        };

        $scope.AddUnNo = function () {

        };

    }
]);
