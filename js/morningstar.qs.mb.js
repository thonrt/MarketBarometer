var MorningStraMarketBarometer = {
    //create json object
     status:"OneDay",
    config: {
        OneDay: {
            color: [],
            value: ["&lt;-1.25%", "+1.25%&gt;"],
            range: [-1.25, 1.25]
        },
        OneWeek: {
            color: [],
            value: ["&lt;-1.25%", "+1.25%&gt;"],
            range: [-1.25, 1.25]
        },
        OneMouth: {
            color: [],
            value: ["&lt;-4%", "+4%&gt;"],
            range: [-4, 4]
        },
        ThreeMouth: {
            color: [],
            value: ["&lt;-8%", "+8%&gt;"],
            range: [-8, 8]
        },
        OneYear: {
            color: [],
            value: ["&lt;-20%", "+20%&gt;"],
            range: [-20, 20]
        },
        ThreeYear: {
            color: [],
            value: ["&lt;-20%", "20%&gt;"],
            range: [-20, 20]
        },
    },


    GetConfig: function (type) {
        return this.config[type];
    },




    GetColor: function (rangeArr, rate) {
        var colorArr = ["#bf0d3f", "#ea5f80", "#f4afbf", "#999", "#aae3c4", "#56c88a", "#00ac4d"];
        var avg = (rangeArr[1] - rangeArr[0]) / 7;
        var compareNum = rangeArr[0];
        var sub ;
        for (var i = 0, len = colorArr.length; i < len; i++) {
            sub = i;
            if (compareNum > rate) {
                break;
            }
            compareNum += avg;
        }
        return colorArr[sub];
    },



    //get background data
    GetData: function (callback) {
        var me = this;
        var url = "http://localhost/MarketBarometer/MarketBarometer.ashx";
        $.ajax({
            dataType: "json",
            url: url,
            data: "",
            success: function (data) {
                if (typeof (callback) === "function") {
                    callback(data);
                }
                if (typeof (callbackSub) === "function") {
                    callbackSub(data);
                }
            }
        });
    },




    // through background data ,return color
    ColorReturn: function (periodReturn, config) {

        config.color = [];
        for (var i = 0, len = periodReturn.length; i < len; i++) {
            var color = this.GetColor(config.range, periodReturn[i]);
            config.color.push(color);
        }
        return config.color;
    },




    //show small
    ShowSmall: function (periodReturn, type) {
        var config = this.GetConfig(type);
        if (config) {
            var colorValue = this.ColorReturn(periodReturn, config);

            var divArr = $("div[period='" + type + "'] div[class^='boxs']");
            for (var i = 0; i < divArr.length; i++) {
                $(divArr[i]).css("backgroundColor", colorValue[i]);
            }
        }
    },



    //show big
    Show: function (periodReturn,type) {
        var config = this.GetConfig(type);
      
        var colorValue = MorningStraMarketBarometer.ColorReturn(periodReturn, config);
        //var divArr = $("div[class ='left1'] div[class^='box']");
        for (var i = 0; i < colorValue.length; i++) {
            document.getElementById("color" + i).style.backgroundColor = colorValue[i];
            //divArr[i] .css("backgroundColor", colorValue[i]);
        }
        for (var j = 0; j < config.value.length; j++) {
            $("#value" + j).innerHTML = config.value[j];

        }

    },


    //periodic refresh
    Update: function () {
        var boxs = document.getElementsByClassName("boxsmall");
        var type = "";
        var callback = function (dataBase) {
            MorningStraMarketBarometer.Show(dataBase.root[MorningStraMarketBarometer.status].split(','), MorningStraMarketBarometer.status);
            for (var i = 0, len = boxs.length; i < len; i++) {
                var box = boxs[i];
                if (box.attributes["period"]) {
                    type = box.attributes["period"].value;
                    var periodReturn = dataBase.root[type].split(',');
                    MorningStraMarketBarometer.ShowSmall(periodReturn, type);
                }
            }
        };
        MorningStraMarketBarometer.GetData(callback);
    },



    Subscribe: function () {
        var me = this;
        var boxs= $("div[class='boxsmall']");
        var type = "";
        var callbackSub = function (dataBase) {
                me.Show(dataBase.root[me.status].split(','), me.status);
            for (var i = 0, len = boxs.length; i < len; i++) {
                var box = boxs[i];
                type = box.attributes["period"].value;
                var periodReturn = dataBase.root[type].split(',');
                me.ShowSmall(periodReturn, type);
                if (box.attributes["period"]) {
                    box.addEventListener("mouseover", function (periodReturn,type) {
                        return function () {
                            me.status = type;
                            me.Show(periodReturn, type);
                        }
                    }(periodReturn,type))
                }
            }
        };
        me.GetData(callbackSub);
    }


};



window.onload = function () {
    MorningStraMarketBarometer.Subscribe();
    //MorningStraMarketBarometer.Update();
    setInterval(MorningStraMarketBarometer.Update, 5000);
}