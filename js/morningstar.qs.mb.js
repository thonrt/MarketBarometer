

// get namespaces
QS_RegisterNameSpaces("QS._morningstar._mb");


//add properties
QS._morningstar._mb = {
    status: "OneDay",
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

};


// through type gain properties
QS._morningstar._mb.GetConfig = function (type) {
    return QS._morningstar._mb.config[type];
    };



QS._morningstar._mb.GetColor = function (rangeArr, rate) {
    var colorArr = ["#bf0d3f", "#ea5f80", "#f4afbf", "#999", "#aae3c4", "#56c88a", "#00ac4d"];
    var avg = (rangeArr[1] - rangeArr[0]) / 7;
    var compareNum = rangeArr[0];
    var sub;
    for (var i = 0, len = colorArr.length; i < len; i++) {
        sub = i;
        if (compareNum > rate) {
            break;
        }
        compareNum += avg;
    }
    return colorArr[sub];
}


QS._morningstar._mb.GetData = function (callback) {
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
}

QS._morningstar._mb.ColorReturn = function (periodReturn, config) {
    config.color = [];
    for (var i = 0, len = periodReturn.length; i < len; i++) {
        var color = QS._morningstar._mb.GetColor(config.range, periodReturn[i]);
        config.color.push(color);
    }
    return config.color;
}

QS._morningstar._mb.Show = function (periodReturn, type) {
    var config = QS._morningstar._mb.GetConfig(type);

    var colorValue = QS._morningstar._mb.ColorReturn(periodReturn, config);
    //var divArr = $("div[class ='left1'] div[class^='box']");
    for (var i = 0; i < colorValue.length; i++) {
        document.getElementById("color" + i).style.backgroundColor = colorValue[i];
        //divArr[i] .css("backgroundColor", colorValue[i]);
    }
    for (var j = 0; j < config.value.length; j++) {
        $("#value" + j).innerHTML = config.value[j];

    }
}

QS._morningstar._mb.ShowSmall = function (periodReturn, type) {
    var config = QS._morningstar._mb.GetConfig(type);
    if (config) {
        var colorValue = QS._morningstar._mb.ColorReturn(periodReturn, config);

        var divArr = $("div[period='" + type + "'] div[class^='boxs']");
        for (var i = 0; i < divArr.length; i++) {
            $(divArr[i]).css("backgroundColor", colorValue[i]);
        }
    }
}

QS._morningstar._mb.Update = function () {
    var boxs = document.getElementsByClassName("boxsmall");
    var type = "";
    var callback = function (dataBase) {
        QS._morningstar._mb.Show(dataBase.root[QS._morningstar._mb.status].split(','), QS._morningstar._mb.status);
        for (var i = 0, len = boxs.length; i < len; i++) {
            var box = boxs[i];
            if (box.attributes["period"]) {
                type = box.attributes["period"].value;
                var periodReturn = dataBase.root[type].split(',');
                QS._morningstar._mb.ShowSmall(periodReturn, type);
            }
        }
    };
    QS._morningstar._mb.GetData(callback);
}



QS._morningstar._mb.Subscribe = function () {
    var me = this;
    var boxs= $("div[class='boxsmall']");
    var type = "";
    var callbackSub = function (dataBase) {
        QS._morningstar._mb.Show(dataBase.root[QS._morningstar._mb.status].split(','), QS._morningstar._mb.status);
        for (var i = 0, len = boxs.length; i < len; i++) {
            var box = boxs[i];
            type = box.attributes["period"].value;
            var periodReturn = dataBase.root[type].split(',');
            QS._morningstar._mb.ShowSmall(periodReturn, type);
            if (box.attributes["period"]) {
                box.addEventListener("mouseover", function (periodReturn,type) {
                    return function () {
                        QS._morningstar._mb.status = type;
                        QS._morningstar._mb.Show(periodReturn, type);
                    }
                }(periodReturn,type))
            }
        }
    };
    QS._morningstar._mb.GetData(callbackSub);
}



window.onload = function () {
    QS._morningstar._mb.Subscribe();
    //MorningStraMarketBarometer.Update();
    setInterval(QS._morningstar._mb.Update, 5000);
}


