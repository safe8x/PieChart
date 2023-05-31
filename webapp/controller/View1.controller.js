sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/BindingMode',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/base/util/UriParameters',
    'sap/m/BusyDialog',
    'sap/m/MessageToast',
    './InitPage'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, BindingMode, JSONModel, ChartFormatter, Format, Filter, FilterOperator, UriParameters,BusyDialog, MessageToast,InitPageUtil) {
        "use strict";

        oVizFrame: null;
        vServiceUrl: null;
        oModel: null;
     

        return Controller.extend("piechart.piechart.controller.View1", {
          


            onInit: function () {
                var BusyDialog1 =  new BusyDialog();
                this.vServiceUrl = "/sap/opu/odata/sap/Z_B_DBFAM_VAR_COMPO/";
                this.oModel = new sap.ui.model.odata.v2.ODataModel(this.vServiceUrl, true);
                BusyDialog1.open();
                /*
                // var nomeFile;
                //var complete_url = "https://vhaiaqedci.sap.aliaspa.it:44300/sap/bc/ui2/flp#ZANLAGE-displayWithParams?UtilitiesInstallation=4100755351&sap-xapp-state=ASMUDLH6A5MSGO9UF23VSAON85O3MYPPGNYYAPFU"
                var complete_url = window.location.href;
                              var pieces = complete_url.split("?");
                pieces.forEach(function (item, index) {
                    var params = item.split("&");
                    //if (item.includes("UtilitiesInstallation")) //Da sostituire con il Parametro dell Oggetto sematico
                    if (item.includes("nomeFile")) //Da sostituire con il Parametro dell Oggetto sematico
                    {
                        $.each(params, function (key, value) {
                            var param_value = value.split("=");
                            //console.log( key + ": " + value + " | " + param_value[1] );
                            nomeFile = param_value[1];
                            return false; // breaks
                        });
                    }
                });
*/
                //Gestione del recupero dei Parametri nell'Url tramite oggetto Semantico
                if (this.getOwnerComponent().getComponentData() ) {
                var startupParams = this.getOwnerComponent().getComponentData().startupParameters; // get Startup params from Owner Component
                if (startupParams.filename) {
                    var nomeFile = startupParams.filename[0];                  
                }
            }
                var pieChartModel = new sap.ui.model.json.JSONModel([]);
                this.getView().setModel(pieChartModel, "PieData")

                var filters = new Array(); 
                if (nomeFile) {
                                   // var filterByName = new sap.ui.model.Filter("filename", sap.ui.model.FilterOperator.EQ, "ALIA_EMPOLI_2021-01-01_2021-12-31.TXT");  
                var filterByName = new sap.ui.model.Filter("filename", sap.ui.model.FilterOperator.EQ, nomeFile);  
                filters.push(filterByName);  

                //var filters = new Filter("filename", sap.ui.model.FilterOperator.EQ, nomeFile);
                    
                } else {
                    BusyDialog1.close();  
                    var msg = 'Nessun FileName specificato';
                        MessageToast.show(msg);
                        return '';
                }


                var that = this;
                this.oModel.read("/ZC_PIE_CHART", {
                    async: false,
                    filters: [filters],
                    success: function (oData, response) {
                        //that.getView().setModel(that.oModel, "PieChart");
                        that.getView().getModel("PieData").setData(oData);
                        BusyDialog1.close();
                    },
                    error: function(){
                        BusyDialog1.close();
                        var msg = 'Errore Lettura Entity ZC_PIE_CHART';
                        MessageToast.show(msg);
                    }
                });
                
                var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
                oVizFrame.setVizProperties({
                    legend: {
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    }
                });

                Format.numericFormatter(ChartFormatter.getInstance());
                var oPopOver = this.getView().byId("idPopOver");
                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
                InitPageUtil.initPageSettings(this.getView());
            },
            myOnClickHandler: function (oEvent) {

            }
        });
    });
