import { z } from 'zod';

import type {
  CreateConnector,
  GetAuthorizationUri,
  GetConnectorConfig,
  GetUserInfo,
  SocialConnector,
} from '@logto/connector-kit';

import { ConnectorError, ConnectorErrorCodes, ConnectorType } from '@logto/connector-kit';

import { defaultMetadata } from './constant.js';

import type { WechatMiniConfig } from './types.js';
import { wechatMiniConfigGuard } from './types.js';
/**
 * WeChat mini program code to session endpoint.
 */
const codeToSessionEndpoint = 'https://api.weixin.qq.com/sns/jscode2session';

/**
 * WeChat code to session response.
 */
const codeToSessionResponse = z.union([
  z.object({
    errcode: z.number(),
    errmsg: z.string(),
  }),
  z.object({
    openid: z.string(),
    unionid: z.string().optional(),
  }),
]);

/**
 * WeChat mini program get user info data.
 */
const userInfoData = z.object({
  code: z.string(),
});

/**
 * WeChat mini program connector get authorization URL.
 */
const getAuthorizationUri: GetAuthorizationUri = async (payload) => payload.redirectUri;

/**
 * Create WeChat mini program `getUserInfo` function.
 */
const getUserInfo =
  (getConfig: GetConnectorConfig): GetUserInfo =>
  async (data: unknown) => {
    const result = userInfoData.safeParse(data);
    if (!result.success) {
      throw new ConnectorError(ConnectorErrorCodes.General, result.error);
    }

    const { code } = result.data;
    const { appId, appSecret, mode } = (await getConfig(defaultMetadata.id)) as WechatMiniConfig;
    const url = `${codeToSessionEndpoint}?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

    const res = await fetch(url, { method: 'GET' }).then(async (res) => res.json());
    const parsed = codeToSessionResponse.parse(res);

    if ('errcode' in parsed && parsed.errcode !== 0) {
      throw new ConnectorError(ConnectorErrorCodes.SocialAuthCodeInvalid, parsed.errmsg);
    }

    const { openid, unionid } = parsed as { openid: string; unionid: string };
    switch (mode) {
      case 'openid': {
        return { id: openid };
      }
      case 'unionid': {
        return { id: unionid };
      }
    }
  };

/**
 * Create WeChat mini program connector.
 */
const createWeChatMiniProgramConnector: CreateConnector<SocialConnector> = async ({
  getConfig,
}) => ({
  type: ConnectorType.Social,
  metadata: defaultMetadata,
  configGuard: wechatMiniConfigGuard,
  getAuthorizationUri: getAuthorizationUri(getConfig),
  getUserInfo: getUserInfo(getConfig),
});

/**
 * Logto WeChat mini program connector entry.
 */
export default createWeChatMiniProgramConnector;
