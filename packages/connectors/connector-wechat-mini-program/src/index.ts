import { z } from 'zod';

import type {
  CreateConnector,
  GetConnectorConfig,
  GetAuthorizationUri,
  GetUserInfo,
  SocialConnector,
} from '@logto/connector-kit';
import { ConnectorError, ConnectorErrorCodes, ConnectorType } from '@logto/connector-kit';

import { defaultMetadata } from './constant.js';
import type { WechatMiniProgramConfig } from './types.js';
import { wechatMiniProgramConfigGuard } from './types.js';
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

const getAuthorizationUri: GetAuthorizationUri =
  (getConfig: GetConnectorConfig): GetAuthorizationUri =>
  async ({ state, redirectUri }) => {
    const config = await getConfig(defaultMetadata.id);
    const queryParameters = new URLSearchParams({
      redirect_uri: encodeURI(redirectUri), // The variable `redirectUri` should match {appId, appSecret}
      state: state
    });

    return `${config.mockAuthorizationEndpoint}?${queryParameters.toString()}`;
  };

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
    const { appId, appSecret, mode } = (await getConfig(defaultMetadata.id)) as WechatMiniProgramConfig;
    const url = `${codeToSessionEndpoint}?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

    const res = await fetch(url, { method: 'GET' }).then(async (res) => res.json());
    const parsed = codeToSessionResponse.parse(res);

    if ('errcode' in parsed && parsed.errcode !== 0) {
      throw new ConnectorError(ConnectorErrorCodes.SocialAuthCodeInvalid, parsed.errmsg);
    }

    const { openid, unionid, session_key } = parsed as { openid: string; unionid: string, session_key: string };
    switch (mode) {
      case 'openid': {
        return { id: openid, session_key: session_key};
      }
      case 'unionid': {
        return { id: unionid, session_key: session_key };
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
  configGuard: wechatMiniProgramConfigGuard,
  getAuthorizationUri: getAuthorizationUri(getConfig),
  getUserInfo: getUserInfo(getConfig),
});

/**
 * Logto WeChat mini program connector entry.
 */
export default createWeChatMiniProgramConnector;
