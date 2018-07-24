import { _, joinModel } from '@utils'
import modelExtend from '@models/modelExtend'

export default joinModel(modelExtend, {
  namespace: 'modal',
  state: {
    name: '',
    state: true,
  },

  effects: {
    * startInit({ payload = {} }, { call, put, select }) {

    },
  },
  reducers: {},
})
