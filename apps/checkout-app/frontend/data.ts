import { ChannelFragment } from "@graphql";
import { findById } from "@utils";
import { customizations, paymentMethods, paymentProviders } from "consts";
import {
  ChannelActivePaymentProviders,
  ChannelActivePaymentProvidersByChannel,
  ChannelPaymentOptions,
  UnknownSettingsValues,
} from "types/api";
import {
  Customization,
  CustomizationID,
  CustomizationSettings,
  PaymentMethodID,
  PaymentProvider,
  PaymentProviderID,
  PaymentProviderSettings,
} from "types/common";

export const getCustomizationSettings = (
  settingsValues?: UnknownSettingsValues
): Customization<CustomizationID>[] =>
  customizations.map((customization) => ({
    ...customization,
    settings: customization.settings.map(
      (setting: CustomizationSettings<CustomizationID>) => ({
        ...setting,
        value:
          settingsValues?.[customization.id]?.[setting.id] || setting.value,
      })
    ),
  }));

export const getPaymentProviderSettings = (
  settingsValues?: UnknownSettingsValues
): PaymentProvider<PaymentProviderID>[] =>
  paymentProviders.map((provider) => ({
    ...provider,
    settings: provider.settings.map(
      (setting: PaymentProviderSettings<PaymentProviderID>) => ({
        ...setting,
        value: settingsValues?.[provider.id]?.[setting.id] || setting.value,
      })
    ),
  }));

export const getActivePaymentProvidersByChannel = (
  activePaymentProviders: ChannelActivePaymentProviders,
  channelId: string
): ChannelActivePaymentProvidersByChannel =>
  Object.keys(activePaymentProviders).reduce(
    (providers, paymentProvider) => ({
      ...providers,
      [paymentProvider]:
        activePaymentProviders[channelId][paymentProvider as PaymentMethodID],
    }),
    {} as ChannelActivePaymentProvidersByChannel
  );

export const getChannelPaymentOptionsList = (
  channels: ChannelFragment[],
  activePaymentProviders?: ChannelActivePaymentProviders
): ChannelPaymentOptions[] =>
  channels.map((channel) => ({
    id: channel.id,
    channel: channel,
    paymentOptions: paymentMethods.map((method) => ({
      id: method.id,
      method,
      availableProviders: paymentProviders,
      activeProvider: activePaymentProviders?.[channel.id]?.[method.id]
        ? findById(
            paymentProviders,
            activePaymentProviders[channel.id][method.id]
          ) || null
        : null,
    })),
  }));
export const getChannelPaymentOptions = (
  channels: ChannelFragment[],
  activePaymentProviders?: ChannelActivePaymentProviders,
  channelId?: string
) =>
  getChannelPaymentOptionsList(channels, activePaymentProviders).find(
    (channelPayments) => channelPayments.channel.id === channelId
  );