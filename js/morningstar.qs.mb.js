

// get namespaces
QS_RegisterNameSpaces("QS._morningstar._mb");


//add properties
QS._morningstar._mb = {
    status: "OneDay",
    typedef: ["OneDay", "OneWeek", "OneMonth", "ThreeMonth", "OneYear", "ThreeYear"],
    fontvalue: ["1D", "1W", "1M", "3M", "1Y", "3Y"],
    colorArr: ["#bf0d3f", "#ea5f80", "#f4afbf", "#999", "#aae3c4", "#56c88a", "#00ac4d"],
    numValue:["1.25","1.25","4","8","20","20"],
    links: ["http://quotes.morningstar.com/indexquote/quote.html?t=$MLVL",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MLCR",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MLGR",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MMVL",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MMCR",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MMGR",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MSVL",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MSCR",
            "http://quotes.morningstar.com/indexquote/quote.html?t=$MSGR"
    ],
    attdef: {
        color:[],
        value:[],
        range:[]
    },
    config: [],
    //传入参数type来组装一个json对象
    init: function (type) {
        var proToString = JSON.stringify(QS._morningstar._mb.attdef);
        var properties = "{\"" + type + "\"" + ":" + proToString + "}";
        return JSON.parse(properties);
    },
  

};



// through type gain properties
QS._morningstar._mb.GetConfig = function (type) {
    var keyvalue = "";
    for (var i = 0; i < 6; i++) {
        for (var key in QS._morningstar._mb.config[i]) {
            keyvalue = key;
        }
        if (keyvalue == type) {
            return QS._morningstar._mb.config[i][type];
            break;
        }
    }
    };


//根据获取的rate数据，判断返回的颜色
QS._morningstar._mb.GetColor = function (rangeArr, rate) {
    var colorArr = QS._morningstar._mb.colorArr;;
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


//通过ajax技术，获取data.xml文件中的数据
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

//根据返回的后台数据periodReturn，获取一个九宫格的颜色，并push到colco属性中
QS._morningstar._mb.ColorReturn = function (periodReturn, config) {
    config.color = [];
    for (var i = 0, len = periodReturn.length; i < len; i++) {
        var color = QS._morningstar._mb.GetColor(config.range, periodReturn[i]);
      
        config.color.push(color);
    }
    return config.color;
}


//调用ColorReturn（）方法，获取每个格子对应的颜色，再通过Jquery动态的改变每个格子的背景颜色
QS._morningstar._mb.Show = function (periodReturn, type) {
    var config = QS._morningstar._mb.GetConfig(type);
    var colorValue = QS._morningstar._mb.ColorReturn(periodReturn, config);
    var divArr = $("table[class ='left1'] td[class^='box']");
    for (var i = 0; i < colorValue.length; i++) {
        $(divArr[i]).css("backgroundColor", colorValue[i]);
    }
    for (var j = 0; j < config.value.length; j++) {
        $("#value" + j).html(config.value[j]);
    }
}

//调用ColorReturn（）方法，获取每个格子对应的颜色，再通过Jquery动态的改变每个格子的背景颜色
QS._morningstar._mb.ShowSmall = function (periodReturn, type) {
    var config = QS._morningstar._mb.GetConfig(type);
    if (config) {
        var colorValue = QS._morningstar._mb.ColorReturn(periodReturn, config);

        var divArr = $("table[period='" + type + "'] td[class^='boxs']");
        for (var i = 0; i < divArr.length; i++) {
            $(divArr[i]).css("backgroundColor", colorValue[i]);
        }
        var tableArr = $("table[period='" + type + "'] td[class='boxs']");
        for (var i = 0; i < tableArr.length; i++) {
            $(tableArr[i]).css("backgroundColor", colorValue[i]);
        }
    }
}

//实现定时刷新功能
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


//实现订阅功能，页面一加载，就开始运行，调用show(),showSmall()函数，来显示格子
QS._morningstar._mb.Subscribe = function () {
  
    var me = this;
    var boxs= $("table[class='boxsmall']");
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
                        //console.log(type);
                        QS._morningstar._mb.Show(periodReturn, type);
                    }
                }(periodReturn,type))
            }
        }
    };
    QS._morningstar._mb.GetData(callbackSub);
}


//jquery动态生成一个九宫格
QS._morningstar._mb.createSmallOne = function (len,type,attr1,attr2) {
    var txt = "<table class="+attr1+" period="+type+">";
    for (var i = 0; i < len; i++) {
        txt = txt + "<tr>";
        for (var j = 0; j < len; j++) {
            txt = txt+"<td class="+attr2+"></td>";
        }
        txt = txt + "</tr>";
    }
    txt = txt + "</table>"
    return txt
}


//创建一个2*3的表格，用来存放小九宫格
QS._morningstar._mb.createRight = function (rows, cols) {
    var txt = "<table class='smallone'>";
    for (var i = 0; i < rows; i++) {
        txt = txt + "<tr class='tr1' >";
        for (var j = 0; j < cols; j++) {
            var type = QS._morningstar._mb.typedef[cols * i + j];
            var jsObj = QS._morningstar._mb.init(type);
             QS._morningstar._mb.config.push(jsObj);
             var rang = QS._morningstar._mb.numValue[cols * i + j];
            jsObj[type].range.push(-rang);
            jsObj[type].range.push(+rang);
            jsObj[type].value.push("&lt;-" + rang+"%");
            jsObj[type].value.push("+" + rang + "%&gt;");
        txt = txt + "<td class='td1'>" + QS._morningstar._mb.createSmallOne(3,type , "boxsmall","boxs") + "<span>" + QS._morningstar._mb.fontvalue[3 * i + j] + "</span></td>";
    }
    }
   
    $(".Small").html(txt);
}

//创建一个大的九宫格
QS._morningstar._mb.createLeft = function () {
    var txt = QS._morningstar._mb.createSmallOne(3, QS._morningstar._mb.status, "left1", "box");
    $(".Big").html(txt);
    var tdlen = $("table[class='left1'] td[class='box']");
    var txtt = "";
    for (var i = 0, len = tdlen.length; i < len; i++) {
        txtt = "<a href=" + QS._morningstar._mb.links[i] + "></a>"
       $(txtt).appendTo(tdlen[i]);
     
    }
}


window.onload = function () {
    QS._morningstar._mb.createLeft();
    QS._morningstar._mb.createRight(2, 3);
    QS._morningstar._mb.Subscribe();

    QS._morningstar._mb.Update();
    setInterval(QS._morningstar._mb.Update, 1000);
}


