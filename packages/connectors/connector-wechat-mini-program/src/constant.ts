import type { ConnectorMetadata } from '@logto/connector-kit';
import { ConnectorConfigFormItemType, ConnectorPlatform } from '@logto/connector-kit';

export const defaultMetadata: ConnectorMetadata = {
  id: 'wechat-mini-program',
  target: 'wechat',
  platform: ConnectorPlatform.Native,
  name: {
    en: 'WeChat',
    'zh-CN': '微信',
    'tr-TR': 'WeChat',
    ko: 'WeChat',
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
    {
      key: 'mockAuthorizationEndpoint',
      label: 'Mock Authorization Endpoint',
      required: true,
      type: ConnectorConfigFormItemType.Text,
      placeholder: '<endpoint>',
    },
  ],
};

export const defaultTimeout = 5000;
