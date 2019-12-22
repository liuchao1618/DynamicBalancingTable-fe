import request from '../utils/request'

// 登录
export function login(params) {
  return request({
    url: '/api/login',
    method: 'POST',
    data: params
  })
}
//获取某pad登录成功过的账号信息
export function phoneList(data) {
  return request({
    url: '/api/device/cache',
    method: 'GET',
    params: data
  })
}

//修改密码
export function editPass(params) {
  return request({
    url: '/api/user/password',
    method: 'PUT',
    data: params
  })
}

//某pad添加登录成功记录
export function addPhoneList(params) {
  return request({
    url: '/api/device/cache',
    method: 'POST',
    data: params
  })
}
//某pad删除登录成功记录
export function delPhoneList(params) {
  return request({
    url: '/api/device/cache',
    method: 'DELETE',
    data: params
  })
}

//获取登录信息
export function loginMsg(data) {
  return request({
    url: '/api/user/myself',
    method: 'GET',
    params: data
  })
}

// 退出登录
export function exitLogin(data) {
  return request({
    url: '/api/logout',
    method: 'GET',
    params: data
  })
}

//获取某个用户的所有记录
export function memberExercise(data) {
  return request({
    url: '/api/record/relevant',
    method: 'GET',
    params: data
  })
}

//保存新记录(主要部分 点击stop后保存)
export function saveRecord(params) {
  return request({
    url: '/api/record/main',
    method: 'POST',
    data: params
  })
}

//获取运动员教练层级信息(新记录选择运动员时使用)
export function checkMember() {
  return request({
    url: '/api/member/topClass',
    method: 'GET'
  })
}
//在新记录上添加运动员信息
export function addSport(params) {
  return request({
    url: '/api/record/member',
    method: 'POST',
    data: params
  })
}

//添加收藏
export function addCollect(params) {
  return request({
    url: '/api/record/favorite',
    method: 'POST',
    data: params
  })
}
//删除收藏
export function delCollect(params) {
  return request({
    url: '/api/record/favorite',
    method: 'DELETE',
    data: params
  })
}

// 获取（教练、运动员）信息
export function memberMessage(data) {
  return request({
    url: '/api/member/members',
    method: 'GET',
    params: data
  })
}

// 获取所有教练姓名
export function trainersName(data) {
  return request({
    url: '/api/member/trainers',
    method: 'GET',
    params: data
  })
}
// 获取所有教练姓名
export function runnersName(data) {
  return request({
    url: '/api/member/runners',
    method: 'GET',
    params: data
  })
}

//添加新运动员
export function addMember(params) {
  return request({
    url: '/api/member',
    method: 'POST',
    data: params
  })
}

//修改运动员
export function editMember(params) {
  return request({
    url: '/api/member',
    method: 'PUT',
    data: params
  })
}

//删除运动员
export function delMember(params) {
  return request({
    url: '/api/member',
    method: 'DELETE',
    data: params
  })
}

//获取单条记录详情
export function trainDetail(data) {
  return request({
    url: '/api/record',
    method: 'GET',
    params: data
  })
}

// // 登录
// export function login(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/login',
//     method: 'POST',
//     data: params
//   })
// }
// //获取某pad登录成功过的账号信息
// export function phoneList(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/device/cache',
//     method: 'GET',
//     params: data
//   })
// }

// //修改密码
// export function editPass(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/user/password',
//     method: 'PUT',
//     data: params
//   })
// }

// //某pad添加登录成功记录
// export function addPhoneList(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/device/cache',
//     method: 'POST',
//     data: params
//   })
// }
// //某pad删除登录成功记录
// export function delPhoneList(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/device/cache',
//     method: 'DELETE',
//     data: params
//   })
// }

// //获取登录信息
// export function loginMsg(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/user/myself',
//     method: 'GET',
//     params: data
//   })
// }

// // 退出登录
// export function exitLogin(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/logout',
//     method: 'GET',
//     params: data
//   })
// }

// //获取某个用户的所有记录
// export function memberExercise(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/record/relevant',
//     method: 'GET',
//     params: data
//   })
// }

// //保存新记录(主要部分 点击stop后保存)
// export function saveRecord(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/record/main',
//     method: 'POST',
//     data: params
//   })
// }

// //获取运动员教练层级信息(新记录选择运动员时使用)
// export function checkMember() {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/member/topClass',
//     method: 'GET'
//   })
// }
// //在新记录上添加运动员信息
// export function addSport(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/record/member',
//     method: 'POST',
//     data: params
//   })
// }

// //添加收藏
// export function addCollect(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/record/favorite',
//     method: 'POST',
//     data: params
//   })
// }
// //删除收藏
// export function delCollect(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/record/favorite',
//     method: 'DELETE',
//     data: params
//   })
// }

// // 获取（教练、运动员）信息
// export function memberMessage(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/member/members',
//     method: 'GET',
//     params: data
//   })
// }

// // 获取所有教练姓名
// export function trainersName(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/member/trainers',
//     method: 'GET',
//     params: data
//   })
// }
// // 获取所有教练姓名
// export function runnersName(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/member/runners',
//     method: 'GET',
//     params: data
//   })
// }

// //添加新运动员
// export function addMember(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/member',
//     method: 'POST',
//     data: params
//   })
// }

// //修改运动员
// export function editMember(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/member',
//     method: 'PUT',
//     data: params
//   })
// }

// //删除运动员
// export function delMember(params) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/member',
//     method: 'DELETE',
//     data: params
//   })
// }

// //获取单条记录详情
// export function trainDetail(data) {
//   return request({
//     url: 'http://www.xnnre.com/balance-web/api/record',
//     method: 'GET',
//     params: data
//   })
// }