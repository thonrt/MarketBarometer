QS_RegisterNameSpaces("QS._morningstar._mb");


QS._morningstar._mb = {
    status: "OneDay",
    typedef: ["OneDay", "OneWeek", "OneMonth", "ThreeMonth", "OneYear", "ThreeYear"],
    fontvalue: ["1D", "1W", "1M", "3M", "1Y", "3Y"],
    colorArr: ["#bf0d3f", "#ea5f80", "#f4afbf", "#999", "#aae3c4", "#56c88a", "#00ac4d"],
    numValue: ["1.25", "1.25", "4", "8", "20", "20"],
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
        color: [],
        value: [],
        range: []
    },
    config: [],
    init: function (type) {
        var proToString = JSON.stringify(QS._morningstar._mb.attdef);
        var properties = "{\"" + type + "\"" + ":" + proToString + "}";

        return JSON.parse(properties);
    },


};

//jquery动态生成一个九宫格
QS._morningstar._mb.createSmallOne = function (len, type, attr1, attr2) {
    var txt = "<table class=" + attr1 + " period=" + type + ">";
    for (var i = 0; i < len; i++) {
        txt = txt + "<tr>";
        for (var j = 0; j < len; j++) {
            txt = txt + "<td class=" + attr2 + "></td>";
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
            jsObj[type].range.push(rang);
            jsObj[type].value.push("&lt;-" + rang + "%");
            jsObj[type].value.push("+" + rang + "%&gt;");
            txt = txt + "<td class='td1'>" + QS._morningstar._mb.createSmallOne(3, type, "boxsmall", "boxs") + "<span>" + QS._morningstar._mb.fontvalue[3 * i + j] + "</span></td>";
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
}

