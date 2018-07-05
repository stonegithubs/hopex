import { joinModel, getRes, resOk } from '@utils'
import modelExtend from '@models/modelExtend'
import { getLatestRecord, getEnsureRecord, postLimitOrder, postMarketOrder } from "@services/trade"

export default joinModel(modelExtend, {
  namespace: 'home',
  state: {
    market: 'BTCBCH',// 合约
    // 最新成交
    latest_pageIndex: '1',
    latest_pageSize: '19',
    latest_pageTotal: null,
    latest_records: [],
    // 委托列表
    ensure_records: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    * getLatestRecord({ payload }, { call, put }) {
      const res = getRes(yield call(getLatestRecord))
      if (resOk(res)) {
        console.log(res)
      }
    },
    // 委托列表
    * getEnsureRecord({ payload }, { call, put }) {
      const res = getRes(yield call(getEnsureRecord, {
        "head": {
          "method": "market.active_delegate",
          "msgType": "request",
          "packType": "1",
          "lang": "cn",
          "version": "1.0.0",
          "timestamps": "1439261904",
          "serialNumber": "56",
          "userId": "56",
          "userToken": "56"
        },
        "param": {
          "market": "BTCUSD永续",//合约
          "pageSize": "100",//不能大于101
          "interval": "0"//固定值
        }
      }))
      if (resOk(res)) {
        yield put({
          type: 'changeState',
          payload: { ensure_records: res }
        })
        return res
      }
    },

    // 下单（限价/市价）
    * postSideOrder({ payload = {} }, { call, put }) {
      const { side, method } = payload
      const url = method === 'order.put_limit' ? postLimitOrder : postMarketOrder

      const res = getRes(yield call(url,
        {
          "head": {
            "method": method,
            "msgType": "request",
            "packType": "1",
            "lang": "cn",
            "version": "1.0.0",
            "timestamps": "1439261904",
            "serialNumber": "56",
            "userId": "56",
            "userToken": "56"
          },
          "param": {
            "market": "BTCUSD永续",//合约
            "side": side,//1:sell 2:buy
            "amount": "111",//买卖数量
            "price": "111",//价格
            "takerFee": "0.01",
            "makerFee": "0.01",
            "source": "我是限价单测试"//备注
          }
        }
      ))
      if (resOk(res)) {
        console.log(res)
        yield put({
          type: 'changeState',
          payload: { ensure_records: res }
        })
        return res
      }
    },
  },

  reducers: {},
})