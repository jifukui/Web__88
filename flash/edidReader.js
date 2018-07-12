/******************************
 * Kramer Electronics ltd.
 * programer: Leonardo Severini
 * last modification: 01-07-2013
 ********************************/
function EdidReader(fileName)
{
    EdidReader.instance = this;
    EdidReader.showLog = false;

    this.fileName = fileName;
    this.length = 0;
    this.onEdidLoaded = null;
    this.onEdidError = null;
    this.data;
    this.edid;
    this.length = 0;
    this.dataBlocks;
    this.Check=new Array();
    this.edidTable = "";
    ligObject.DVIEdid=true;
    this.load = function ()
    {
        $.ajax({
            url: fileName,
            async: false,
            cache: false,
            dataType: "text",
            success: function (data)
            {
                EdidReader.instance.setEdidData(data);
            }
        });
    };
    this.setEdidData = function (data)
    {
        data = data.toUpperCase();
        dataArray = EdidReader.makeDataToArray(data);
        EdidReader.instance.edid = EdidReader.makeDataChar(dataArray);
        EdidReader.instance.data = dataArray;
        EdidReader.instance.length = EdidReader.getEdidLength(dataArray);
        EdidReader.instance.Check = EdidReader.GetCheck(dataArray);
        var table = EdidReader.getTable(dataArray);
        EdidReader.instance.edidTable = table;
        if (EdidReader.instance.isValidEdid())
        {
            EdidReader.instance.getDataBlocks();
            if (EdidReader.instance.onEdidLoaded != null)
                EdidReader.instance.onEdidLoaded(EdidReader.instance);
        }
        else
        {
            if (EdidReader.instance.onEdidError != null)
                EdidReader.instance.onEdidError();
        }
    };
    this.isValidEdid = function ()
    {
        var valid = true;
        if (this.data[0] != "00" ||
            this.data[1] != "FF" ||
            this.data[2] != "FF" ||
            this.data[3] != "FF" ||
            this.data[4] != "FF" ||
            this.data[5] != "FF" ||
            this.data[6] != "FF" ||
            this.data[7] != "00")
        {
            valid = false;
            return valid;
        }
        if(this.data[0x36]=="00"&&this.data[0x37]=="00")
        {
            valid = false;
            return valid;
        }
        if(parseInt(this.data[127],16)!=EdidReader.instance.Check[0])
        {
            valid = false;
            return valid;
        }
        if(EdidReader.instance.length!=128)
        {
            if(parseInt(this.data[0x82],16)>=1&&parseInt(this.data[0x82],16)<=3||parseInt(this.data[0x82],16)>0x6d)
            {
                valid = false;
                return valid;
            }
            if((parseInt(this.data[0x83],16)&0xf)>7)
            {
                valid = false;
                return valid;
            }
            var i;
            for(i=2;i<=EdidReader.instance.length/128;i++)
            {
                if(parseInt(this.data[i*128-1],16)!=EdidReader.instance.Check[i-1])
                {
                    valid = false;
                    return valid;
                }
            }
        }
        return valid;
    };
//这里获得是的设备的名称
    this.getName = function ()
    {
        // Search for the name
        var indexs = [54, 72, 90, 108];
        var name = "";
        var found = false;
        for (var i = 0; i < indexs.length; i++)
        {
            var ps = indexs[i];
            if (this.data[ps + 0] == "00" &&
                this.data[ps + 1] == "00" &&
                this.data[ps + 2] == "00" &&
                this.data[ps + 3] == "FC")
            {
                for (var n = 0; n < 13; n++)
                {
                    name += String.fromCharCode(this.edid[ps + n + 5]);
                }
                found = true;
                break;
            }
        }
        //如果没有找到设备的名称则将会使用设备厂商名
        if (found == false)
        {
            name = String.fromCharCode(this.edid[8]);
            name += String.fromCharCode(this.edid[9]);
        }
        return name;
    };

    this.getNativeResolution = function ()
    {
        var edid = this.edid;
        var dtd = 54; // # start byte of detailed timing desc.
        var horizontalRes = ((edid[dtd + 4] >> 4) << 8) | edid[dtd + 2];
        var verticalRes = ((edid[dtd + 7] >> 4) << 8) | edid[dtd + 5];
        return { horizontal: horizontalRes, vertical: verticalRes };
    };

    this.getLength = function ()
    {
        return this.length;
    };

    this.getAudioChannels = function ()
    {

        var block = this.getDataBlocksByTag(1);
        var i;
        var len = 0;
        if (block)
        {
            var data = block["block"];
            for(i=1;i<=data.length;i+=3)
            {
                len=(data[i]&parseInt("00000111", 2)) + 1;
                if(len>2)
                {
                    break;
                }
            }
        }
        return len;
    };

    this.getDeepColor = function ()
    {
        var block = this.getDataBlocksByTag(3);
        var support = "";
        if (block)
        {
            var data = block["block"];
            if (data[1] == 3 && data[2] == 12 && data[3] == 0)
            {
                var mask = parseInt("00010000", 2);
                var masked = mask & data[6];
                if (masked == mask)
                    support += "30bit ";

                mask = parseInt("00100000", 2);
                masked = mask & data[6];
                if (masked == mask)
                    support += "36bit ";

                mask = parseInt("01000000", 2);
                masked = mask & data[6];
                if (masked == mask)
                    support += "48bit";
            }
        }
        if (support == "")
            support = "No supported";

        return support;
    };

    this.getDataBlocksByTag = function (tagId)
    {
        for (var i = 0; i < this.dataBlocks.length; i++)
        {
            if (this.dataBlocks[i]["tag"] == tagId)
                return this.dataBlocks[i];
        }
    };

    this.getDataBlocks = function ()
    {
        this.dataBlocks = new Array();
        var edid = this.edid;
        var start = 132;
        var end = edid[130] + start;
        var blocks = new Array();
        var lengs = new Array();
        var tags = new Array();
        var nextLen = start;
        var blockIndex = 0;
        if (EdidReader.showLog)
        {
            console.log("datablock d:" + edid[130]);
        }
        for (var i = start; i < end; i++)
        {
            if (i == nextLen)
            {
                if (EdidReader.showLog)
                {
                    if (blockIndex != 0)
                        console.log("   + Block : " + this.dataBlocks[blockIndex - 1]["block"]);
                }
                tags[blockIndex] = (edid[i] & parseInt("11100000", 2)) >> 5;
                lengs[blockIndex] = edid[i] & parseInt("00011111", 2);
                nextLen += lengs[blockIndex] + 1;
                if(tags[blockIndex]==1)
                {
                    ligObject.DVIEdid=false;
                }
                if (EdidReader.showLog)
                {
                    console.log("datablock #" + (blockIndex + 1) + " Block : 0x" + edid[i].toString(16) + " Tag:" + tags[blockIndex] + " Len:" + lengs[blockIndex]);
                }
                this.dataBlocks[blockIndex] = new Array();
                this.dataBlocks[blockIndex]["tag"] = tags[blockIndex];
                this.dataBlocks[blockIndex]["len"] = lengs[blockIndex];
                this.dataBlocks[blockIndex]["block"] = new Array();
                blockIndex++;
            }
            this.dataBlocks[blockIndex - 1]["block"].push(edid[i]);
        }
    }
}

EdidReader.instance;
//将数据转换为按16位组合的数组
EdidReader.makeDataToArray = function (data)
{
    var par = 0;
    var newData = "";
    for (var i = 0; i < data.length; i++)
    {
        if (par == 2)
        {
            newData += " ";
            par = 0;
        }
        newData += data[i];
        par++;
    }
    return newData.split(' ');
};
//将16位组合的数组转换为16进制数的数组
EdidReader.makeDataChar = function (dataArray)
{
    var iarray = new Array();

    for (var i = 0; i < dataArray.length; i++)
    {
        iarray[i] = parseInt(dataArray[i], 16);
    }
    return iarray;
};

EdidReader.getTable = function (dataArray)
{
    var table = "<table>";
    table += "<tr>";
    for (var i = 0; i < dataArray.length; i++)
    {
        if (i % 16 == 0)
        {
            table += "</tr>";
            table += "<tr>";
        }

        table += "<td>" + dataArray[i] + "</td>";
    }
    table += "</td>";
    table += "</table>";
    return table;
};

EdidReader.getEdidLength = function (dataArray)
{
    switch (parseInt(dataArray[126]))
    {
        case 0: return 128 * 1;
        case 1: return 128 * 2;
        case 2: return 128 * 3;
        case 3: return 128 * 4;
        case 4: return 128 * 5;
        case 5: return 128 * 6;
        case 6: return 128 * 7;
        case 7: return 128 * 8;
        default: return 128;
    }
};
EdidReader.GetCheck=function (dataArray) {
    var CheckNum=new Array();
    var i,n,sum;
    for(i=0;i<EdidReader.instance.length/128;i++)
    {
        sum=0;
        for(n=0;n<127;n++)
        {
            sum+=parseInt(dataArray[128*i+n],16);
        }
        sum%=256;
        sum=0x100-sum;
        CheckNum[i]=sum;
    }
    return CheckNum;
};
//@ sourceURL=edidReader.js