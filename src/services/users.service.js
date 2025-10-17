const User = require('../models/user.model');
const bcrypt = require('bcrypt');

/**
 * ID로 사용자를 조회합니다. (비밀번호 제외)
 * @param {string} userId - 사용자의 ID
 * @returns {Promise<Document|null>} 조회된 사용자 문서 또는 null
 */
async function getUserById(userId) {
  // .select('-password')를 사용하여 비밀번호 필드를 제외하고 조회합니다.
  return User.findById(userId).select('-password');
}

/**
 * 사용자의 프로필 정보(이름)를 수정합니다.
 * @param {string} userId - 수정할 사용자의 ID
 * @param {object} updateData - { name }
 * @returns {Promise<Document|null>} 수정된 사용자 문서
 */
async function updateUserProfile(userId, updateData) {
  const { name } = updateData;
  if (!name) {
    const error = new Error('이름은 비워둘 수 없습니다.');
    error.statusCode = 400;
    throw error;
  }
  
  // new: true 옵션은 업데이트된 후의 문서를 반환하도록 합니다.
  return User.findByIdAndUpdate(userId, { name }, { new: true }).select('-password');
}

/**
 * 로컬 계정 사용자의 비밀번호를 변경합니다.
 * @param {string} userId - 사용자의 ID
 *- @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise<boolean>} 성공 여부
 */
async function changeUserPassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId);

  // 로컬 계정이 아니거나 사용자가 없는 경우
  if (!user || user.provider !== 'local') {
    const error = new Error('비밀번호를 변경할 수 없는 계정입니다.');
    error.statusCode = 400;
    throw error;
  }

  // 현재 비밀번호 확인
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error('현재 비밀번호가 일치하지 않습니다.');
    error.statusCode = 401; // 401 Unauthorized
    throw error;
  }

  // 새 비밀번호 저장 (해싱은 모델의 pre-save hook에서 자동으로 처리)
  user.password = newPassword;
  await user.save();

  return true;
}

/**
 * 사용자 계정을 삭제합니다. (실제로는 비활성화 처리)
 * @param {string} userId - 삭제할 사용자의 ID
 * @returns {Promise<Document|null>} 비활성화된 사용자 문서
 */
async function deleteUserAccount(userId) {
  // 실제 데이터 삭제 대신 isActive 플래그를 false로 변경하여 비활성화합니다.
  // 이렇게 하면 데이터를 보존하면서 사용자는 로그인할 수 없게 됩니다.
  return User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
}

// --- 관리자 전용 기능 ---

/**
 * 모든 사용자 목록을 조회합니다. (관리자용)
 * @returns {Promise<Array<Document>>} 사용자 목록
 */
async function getAllUsers() {
  return User.find({}).select('-password');
}

/**
 * 특정 사용자의 권한을 변경합니다. (관리자용)
 * @param {string} userId - 권한을 변경할 사용자의 ID
 * @param {string} userType - 새로운 권한 ('user' 또는 'admin')
 * @returns {Promise<Document|null>} 권한이 변경된 사용자 문서
 */
async function updateUserType(userId, userType) {
  if (!['user', 'admin'].includes(userType)) {
    const error = new Error('유효하지 않은 사용자 권한입니다.');
    error.statusCode = 400;
    throw error;
  }

  return User.findByIdAndUpdate(userId, { userType }, { new: true }).select('-password');
}


module.exports = {
  getUserById,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
  getAllUsers,
  updateUserType,
};