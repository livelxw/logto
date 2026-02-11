import type { ConnectorMetadata } from '@logto/connector-kit';
import { ConnectorConfigFormItemType, ConnectorPlatform } from '@logto/connector-kit';

export const defaultMetadata: ConnectorMetadata = {
  id: 'wechat-mini',
  target: 'wechat-mini',
  platform: ConnectorPlatform.Universal,
  name: {
    en: 'WeChat mini program',
    'zh-CN': '微信小程序',
    'tr-TR': 'WeChat mini program',
    ko: 'WeChat mini program',
  },
  logo: './logo.svg',
  logoDark: null,
  description: {
    en: 'WeChat is a cross-platform instant messaging app.',
    'zh-CN': '微信是一款跨平台的即时通讯软件。',
    'tr-TR': 'WeChat, çoklu platformda kullanılabilen bir anlık mesajlaşma uygulamasıdır.',
    ko: 'WeChat은 크로스 플랫폼 메시징 앱입니다.',
  },
  readme: './README.md',
  formItems: [
    {
      key: 'appId',
      label: 'App ID',
      required: true,
      type: ConnectorConfigFormItemType.Text,
      placeholder: '<app-id>',
    },
    {
      key: 'appSecret',
      label: 'App Secret',
      required: true,
      type: ConnectorConfigFormItemType.Text,
      placeholder: '<app-secret>',
    },
    {
      key: 'mode',
      label: 'Identifier Mode',
      required: false,
      type: ConnectorConfigFormItemType.Select,
      selectItems: [
        {
          title: 'Open ID',
          value: 'openid',
        },
        {
          title: 'Union ID',
          value: 'unionid',
        },
      ],
      defaultValue: 'openid',
    },
  ],
};

export const defaultTimeout = 5000;
