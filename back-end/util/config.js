module.exports = {
  // sha1用户密码加密字符串
  PWD_ENCODE_STR: "pawn_user_encode_str",
  // token 加密字符串,
  TOKEN_ENCODE_STR: "pawn_token_encode_str",
  // 添加非get请求通过的连接
  URL_YES_PASS: ['/users/login', '/users/register','/users/verifycode']
}