import { z } from 'zod';

export const wechatMiniConfigGuard = z.object({
  appId: z.string(),
  appSecret: z.string(),
  mode: z.enum(['openid', 'unionid']).default('openid'),
});

export type WechatMiniConfig = z.infer<typeof wechatMiniConfigGuard>;
