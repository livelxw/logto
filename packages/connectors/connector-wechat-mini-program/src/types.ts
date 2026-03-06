import { z } from 'zod';

export const wechatMiniProgramConfigGuard = z.object({
  appId: z.string(),
  appSecret: z.string(),
  mode: z.enum(['openid', 'unionid']).default('openid'),
  mockAuthorizationEndpoint: z.string()
});

export type WechatMiniProgramConfig = z.infer<typeof wechatMiniProgramConfigGuard>;
