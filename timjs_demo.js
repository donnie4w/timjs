// Copyright (c) 2023, donnie <donnie4w@gmail.com>
// All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
//
// github.com/donnie4w/timjs


// demo of timclient in JavaScript

var tc = new timClient(false, "192.168.2.11", 5080);

//ack message from server 服务反馈的信息
tc.ackHandler = function (data) {
    console.log(data);
    let ta = new TimAck();
    ta = JSON.parse(data);
    switch (ta.timType) {
        case STAT.TIMMESSAGE:
            if (ta.ok) { //not ok 表示信息发送失败(注意，信息发送成功是没有ack的，服务器会推送发送用户的信息回来，信息会带上时间与id)
                console.log("send message failed>>", ta.error.code, ":", ta.error.info);
            }
            break;
        case STAT.TIMPRESENCE:
            if (ta.ok) { //not ok，表示状态信息发送失败(注意，状态信息发送成功是没有ack的)
                console.log("send presence failed>>", ta.error.code, ":", ta.error.info);
            }
            break;
        case STAT.TIMLOGOUT: // 强制下线
            console.log("force to logout >>>", myAccount);
            tc.Logout(); // 收到强制下线的指令后，主动退出登录
            break;
        case STAT.TIMAUTH:
            if (ta.ok) { // 登录成功
                myAccount = ta.n;
                console.log("login successful,my node is :", myAccount);
                let ub = new TimUserBean();
                ub.name = "tony";
                ub.nickName = "tony123";
                ub.brithday = "2000-01-20";
                ub.area = "china";
                ub.gender = 1;
                ub.photoTidAlbum = ["https://baidu.com/img/flexible/logo/pc/result.png"];
                tc.ModifyUserInfo(ub); //登录后修改个人资料
                tc.UserInfo([myAccount]);//拉取自己账号信息
                tc.Roster();                                      //Pull the roster 拉取花名册
                tc.UserRoom();                                   // pull the account of group 拉取群账号
                tc.BlockRoomList();                               //blocklist of user group 用户群黑名单
                tc.BlockRosterList();                           //blocklist of user 用户黑名单
                tc.OfflineMsg() //when login successful, get the offline message 登录成功后，拉取离线信息
            } else {
                console.log("login failed:", ta.error.code, ":", ta.error.info);
                tc.Logout();
                console.log("login failed and logout");
            }
            break;
        // 虚拟房间操作回馈信息
        case STAT.TIMVROOM:
            if (ta.ok) {
                switch (ta.t) {
                    case STAT.VRITURLROOM_REGISTER: //注册虚拟房间成功
                        console.log("register vriturl room ok>>", ta.t, " >>", ta.n);
                        break;
                    case STAT.VRITURLROOM_REMOVE: //删除虚拟房间成功
                        console.log("remove vriturl room ok>>", ta.t, " >>", ta.n);
                        break;
                    case STAT.VRITURLROOM_ADDAUTH: //加权成功
                        console.log("add auth to vriturl room ok>>", ta.t, " >>", ta.n);
                        break;
                    case STAT.VRITURLROOM_RMAUTH: //去权成功
                        console.log("cancel auth vriturl room process >>", ta.t, " >>", ta.n);
                        break;
                    case STAT.VRITURLROOM_SUB: //订阅成功
                        console.log("sub vriturl room process >>", ta.t, " >>", ta.n);
                        break;
                    case STAT.VRITURLROOM_SUBCANCEL: //取消订阅成功
                        console.log("sub cancel vriturl room process >>", ta.t, " >>", ta.n);
                        break;
                    default:
                        console.log("vriturl room process ok>>", ta.t, " >>", ta.n);
                }
            } else {
                console.log("vriturl room process failed:", ta.error.code, ":", ta.error.info);
            }
            break;
        /*************************************************************/
        case STAT.TIMBUSINESS: //业务操作回馈
            if (ta.ok) {
                console.log("business process ok:", ta.n);
                switch (ta.t) {
                    case STAT.BUSINESS_REMOVEROSTER: //删除好友成功
                        console.log("romove friend successful:", ta.n);
                        break;
                    case STAT.BUSINESS_BLOCKROSTER: //拉黑好友成功
                        console.log("block  successful:", ta.n);
                        break;
                    case STAT.BUSINESS_NEWROOM: //新建群组成功
                        console.log("new group successful:", ta.n);
                        break;
                    case STAT.BUSINESS_ADDROOM: //
                        console.log("join group successful:", ta.n);
                    case STAT.BUSINESS_PASSROOM: //申请加入群成功
                        console.log("new group successful:", ta.n);
                        break;
                    case STAT.BUSINESS_NOPASSROOM: //申请加入群不成功
                        console.log("reject  group successful:", ta.n);
                        break;
                    case STAT.BUSINESS_PULLROOM: //拉人入群
                        console.log("new group successful:", ta.n);
                        break;
                    case STAT.BUSINESS_KICKROOM: //踢人出群
                        console.log("kick out of group successful:", ta.n);
                        break;
                    case STAT.BUSINESS_BLOCKROOM:
                        console.log("block the group successful:", ta.n)
                        break;
                    case STAT.BUSINESS_LEAVEROOM: //退群
                        console.log("leave group successful:", ta.n);
                        break;
                    case STAT.BUSINESS_CANCELROOM: //注销群
                        console.log("cancel group successful:", ta.n);
                        break;
                    default:
                        console.log("business successful >>", ta);
                }
            } else {
                console.log("business process failed:", ta.error.code, ":", ta.error.info);
            }
            break;
        case STAT.TIMNODES:
            switch (ta.t) {
                case STAT.NODEINFO_MODIFYUSER:
                    console.log("modify userinfo successful");
                    break;
                case STAT.NODEINFO_MODIFYROOM:
                    console.log("modify roominfo successful");
                    break;
            }

    }
};
var myAccount = "";
//TimMessage 处理handler
tc.messageHandler = function (data) {
    let tm = new TimMessage();
    tm = JSON.parse(data);
    console.log(tm);
    //message消息
    if (tm.msType == 1) {
        console.log("this is system message >>", tm);
    } else if (tm.msType == 2) {
        console.log("this is user to user message");
    } else if (tm.msType == 3) {
        console.log("this is room to user message");
    }
    if (tm.msType != 1) {
        switch (tm.odType) {
            case 1: //常规消息
                console.log("chat message >> from>>", tm.fromTid.node, " ,to>>", tm.toTid, ",data>>>", tm.dataString);
                break;
            case 2: //撤回消息
                console.log("revokeMessage>>>", tm.mid);
                break;
            case 3: //阅后即焚
                console.log("burnMessage>>>", tm.mid);
                break;
            case 4: //业务消息
                console.log("business message>>>", tm);
                break;
            case 5: //流数据
                console.log("stream message from>>>", tm.fromTid.node);
                //流数据转字节数组
                console.log(Base64.decodeToByteArray(tm.dataBinary));
                break;
            default: //开发者自定义的消息
                console.log("other message>>>", tm);
        }
    }

};

//记录状态订阅者
var submap = {};
//状态消息
tc.presenceHandler = function (data) {
    let tp = new TimPresence()
    tp = JSON.parse(data);
    console.log(tp);
    if (!isEmpty(tp.subStatus)) {
        if (tp.subStatus == 1) {
            tc.PresenceToUser(tp.fromTid.node, 0, "", 2, null, null);
        }
        if (tp.subStatus == 1 || tp.subStatus == 2) {
            if (isEmpty(submap[tp.fromTid.node])) {
                submap[tp.fromTid.node] = 0;
            }
        }
    }
    if ((isEmpty(tp.offline)) && (tp.fromTid.node == myAccount)) {
        tc.BroadPresence(1, 0, "I am busy😄");
    }
    console.log("presence>>>", tp);
};
tc.offlineMsgHandler = function (data) {
    let tml = new TimMessageList();
    tml = JSON.parse(data);
    if (!isEmpty(tml) && !isEmpty(tml.messageList)) {
        for (const tm of tml.messageList) {
            console.log(tm.dataString);
        }
    }
};
tc.offlinemsgEndHandler = function (data) {
    console.log("offlinemsgEndHandler data>>>", data);
    tc.VirtualroomSub("NGhMpCbk2wQ");              //订阅虚拟房间
    tc.BroadPresence(1, 0, "I am busy😄");//when finish offline message recive,subcript and broad the presence
};
tc.pullmessageHandler = function (data) { console.log("pullmessageHandler data>>>", data); };
tc.nodesHandler = function (data) {
    let tn = new TimNodes();
    tn = JSON.parse(data);
    switch (tn.ntype) {
        case STAT.NODEINFO_ROSTER: //花名册返回
            console.log("my roster >>>", tn.nodelist);
            if (!isEmpty(tn.nodelist)) {
                tc.UserInfo(tn.nodelist); //获取用户详细资料
            }
            break;
        case STAT.NODEINFO_ROOM: //用户的群账号返回
            console.log("my groups >>>", tn);
            if (!isEmpty(tn.nodelist)) {
                tc.RoomInfo(tn.nodelist); //获取群详细资料
                tn.nodelist.forEach((node) => {
                    tc.RoomUsers(node); //获取群的成员
                })
            }
            break;
        case STAT.NODEINFO_ROOMMEMBER: //群成员账号返回
            console.log("group member ack >>>", tn);
            break;
        case STAT.NODEINFO_USERINFO: //用户信息返回
            for (const [k, v] of Object.entries(tn.usermap)) {
                console.log(k, ">>", v.name, " ", v.nickName, " ", v.brithday, " ", v.gender, " ", v.cover, " ", v.area, " ", v.photoTidAlbum);
            }
            break;
        case STAT.NODEINFO_ROOMINFO: //群信息返回
            console.log("groupinfo ack >>>")
            for (const [k, v] of Object.entries(tn.roommap)) {
                console.log(k, " >>", v.topic, " ", v.founder, " ", v.managers, " ", v.createtime, " ", v.label);
            }
            break;
        case STAT.NODEINFO_BLOCKROSTERLIST: //用户黑名单
            console.log("block roster list ack >>>", tn.nodelist);
            break;
        case STAT.NODEINFO_BLOCKROOMLIST: //用户拉黑群的群账号
            console.log("block room list ack >>>", tn.nodelist);
            break;
        case STAT.NODEINFO_BLOCKROOMMEMBERLIST: //群拉黑账号名单
            console.log("block room member list ack >>>", tn.nodelist);
            break;
    }
};

//现场流数据（即直播数据，实时语音视频等流数据）
tc.streamHandler = function (data) {
    console.log("steamData>>>>", data)
    let ts = new TimStream();
    ts = JSON.parse(data);
    console.log("stream fromnode>>>", ts.fromNode);
    //dataBinary transform to bytes  dataBinary转换为字节数组
    console.log(Base64.decodeToByteArray(ts.dataBinary));
};

//登录
tc.Login("tim1", "123", "tlnet.top", "web browser", 1);
