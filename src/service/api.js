import { postParam, postBody, getParam, getParam2 } from './axios'

//  登录接口
export const login = (params) => { return postParam('/api/sys/login', params, false) }
//  注册接口
export const register = (params) => { return postBody('/api/api-u/users-anon/register', params, false) }
// 获取当前登录用户信息
export const getCurrentUser = (params) => { return postBody('/api/api-u/users/current', params, true) }

/* 首页 */
//  个人求助列表
export const getPersonList = (params) => { return postParam('/api/api-a/appeal/apply-anon/person', params, false) }
// 个人已完成
export const getPersonCompletedList = (params) => { return postParam('/api/api-a/appeal/apply-anon/personCompleted', params, false) }
// 公益求助列表
export const getPublicList = (params) => { return postParam('/api/api-a/appeal/apply-anon/public', params, false) }
// 公益已完成
export const getPublicCompletedList = (params) => { return postParam('/api/api-a/appeal/apply-anon/publicCompleted', params, false) }
// 公告列表
export const getBulletinList = (params) => { return postParam('/api/api-a/bulletin/bulletin-anon/home', params, false) }
// 最新捐款列表
export const getLatestDontateList = (params) => { return postParam('/api/api-p/record/apply-anon/latestDontate', params, false) }
// 立即支付
export const getPay = (body) => { return postBody('/api/api-p/donate/pay', body, true) }
// 获取支付状态
export const getPayState = (id) => { return getParam2('/api/api-p/donate/pay/state/' + id, id, true) }

/* 用户求助模块 */
// 用户求助申请
export const toApply = (params) => { return postBody('/api/api-a/apply/toApply', params, true) }
// 用户求助详情
export const getPersonDetailById = (id) => { return getParam('/api/api-a/appeal/apply-anon/personDetail/' + id, id, true) }
export const getDontateByUser = (params) => { return postParam('/api/api-p/record/getDontateByUser', params, true) }
export const getApplyByUser = (params) => { return postParam('/api/api-a/apply/getApplyByUser', params, true) }

/* 公益求助模块 */
// 公益求助详情
export const getPublicDetailById = (id) => { return getParam('/api/api-a/appeal/apply-anon/publicDetail/' + id, id, false) }

/* 捐款记录米快 */
// 捐款列表排行榜
export const getDonateBoardList = (params) => { return postParam('/api/api-p/record/donateBoard', params, false) }
// 已完成捐赠
export const getDonatedList = (params) => { return postParam('/api/api-a/appeal/apply-anon/completed', params, false) }

// 后台管理

export const findUserByIdd = (id) => { return getParam('/api/api-u/users/' + id , id, true) }
/**
 * 系统管理
 */
//系统管理-权限列表
export const permissionList = (params) => { return postBody('/api/api-u/permissions/find', params, true) }
//系统管理-角色列表
export const roleList = (params) => { return postBody('/api/api-u/roles/find', params, true) }

/**
 * 用户管理
**/
// 用户管理-获取用户列表
export const userList = (params) => { return postBody('/api/api-u/users/find', params, true) }
// 用户管理-获取管理员列表
export const adminList = (params) => { return postBody('/api/api-u/users/find', params, true) }
// 用户管理-保存（添加编辑）
export const userUpdate = (params) => { return postBody('/api/api-u/users/update', params, true) }
// 禁用用户
export const banUser = (id) => { return getParam('/api/api-u/users/banUser/' + id, id, true) }
// 解禁用户
export const unbanUser = (id) => { return getParam('/api/api-u/users/unBanUser/' + id, id, true) }
// 管理员注册
export const sysRegist = (params) => { return postBody('/api/donate/api/user//admin/regist', params, true) }
//资质审核
export const userQualificate = (params) => { return postBody('/api/api-u/users/userQualificate/', params, true) }
//审核某个
export const getQualificate = (id) => { return getParam('/api/api-u/users/getQualificate/' + id, id, true) }
//审核通过
export const qualificateSuccess = (id) => { return getParam('/api/api-u/users/qualificateSuccess/' + id, id, true) }
//审核拒绝
export const qualificateFail = (id) => { return getParam('/api/api-u/users/qualificateFail/' + id, id, true) }
//获取某用户的所有角色
export const findRoleByUserId = (id) => { return getParam('/api/api-u/users/' + id + '/roles', id, true) }

/**
 * 权限管理
 */
//权限删除
export const delPermission = (id) => { return getParam('/api/api-u/permissions/delete/' + id, id, true) }
//权限修改
export const permissionSave = (params) => { return postBody('/api/api-u/permissions/modify', params, true) }
//权限添加
export const permissionAdd = (params) => { return postBody('/api/api-u/permissions/add', params, true) }
//根据id获取权限
export const findById = (id) => { return getParam('/api/api-u/permissions/findById/' + id, id, true) }
//获取某角色的所有权限
export const findPerByRoleId = (id) => { return getParam('/api/api-u/roles/' + id + '/permissions', id, true) }
//给用户分配角色
export const distributeRoles = (params) => { return postBody('/api/api-u/users/distributeRoles', params, true) }
/**
 * 角色管理
 */
//角色删除
export const delRole = (id) => { return getParam('/api/api-u/roles/delete/' + id, id, true) }
export const roleUpdate = (params) => { return postBody('/api/api-u/roles/update', params, true) }
//角色添加
export const addRole = (params) => { return postBody('/api/api-u/roles/add', params, true) }
//角色权限分配
export const distribuePer = (params) => { return postBody('/api/api-u/roles/distributePer', params, true) }
export const findRoleById = (id) => { return getParam('/api/api-u/roles/' + id, id, true) }
/**
 * 公益项目管理
 */
export const getPublicVerified = (params) => { return postParam('/api/api-a/appeal/publicVerified', params, true) }
export const getPublicUnVerified = (params) => { return postParam('/api/api-a/appeal/publicUnVerified', params, true) }
/**
 * 个人求助管理
 */
export const getPersonVerified = (params) => { return postParam('/api/api-a/appeal/personVerified', params, true) }
export const getPersonUnVerified = (params) => { return postParam('/api/api-a/appeal/personUnVerified', params, true) }
export const applyUpdate = (params) => { return postBody('/api/api-a/apply/update', params, true) }
export const applyDel = (id) => { return getParam('/api/api-a/apply/delete/' + id, id, true) }
export const getAppealById = (id) => { return getParam('/api/api-a/appeal/apply/getAppealById/' + id, id, true) }

/**
 * 上线、下线(申请、拒绝)
 */
//上线
export const approve = (id) => { return getParam('/api/api-a/apply/approve/' + id, id, true) }
//下线
export const deny = (id) => { return getParam('/api/api-a/apply/deny/' + id, id, true) }
/**
 * 捐款管理
 */
export const donateList = (params) => { return postParam('/api/api-p/record/list', params, true) }
export const donateCount = (params) => { return postParam('/api/api-a/appeal/donateCount', params, true) }
/**
 * 公告管理
 */
export const bulletinList = (params) => { return postParam('/api/api-a/bulletin/list', params, true) }
// 批量删除
export const deleteBulletin = (params) => { return postBody('/api/api-a/bulletin/delete', params, true) }
// 修改公告
export const bulletinUpdate = (params) => { return postBody('/api/api-a/bulletin/save', params, true) }
export const bulletinAdd = (params) => { return postBody('/api/api-a/bulletin/add', params, true) }
export const bulletinOffline = (id) => { return getParam('/api/api-a/bulletin/offineBulletin/' + id, id, true) }
export const bulletinOnline = (id) => { return getParam('/api/api-a/bulletin/onlineBulletin/' + id, id, true) }
export const getBulletinByid = (id) => { return getParam('/api/api-a/bulletin/bulletin-anon/get/' + id, id, true) }

// 统计图
export const getLastWeek = (id) => { return getParam('/api/api-a/apply/apply-anon/getLastWeek/' + id, id, false) }
// 支付
export const getLastWeekPay = (id) => { return getParam('/api/api-p/donate/pay-anon/getLastWeek/' + id, id, false) }
//轮播图
export const getCarouselImg = (id) => { return getParam('/api/api-a/appeal/apply-anon/pageDetail/' + id, id, false) }
