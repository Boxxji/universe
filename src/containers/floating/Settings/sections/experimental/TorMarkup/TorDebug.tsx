import { useTranslation } from 'react-i18next';

import { Typography } from '@app/components/elements/Typography';

import {
    SettingsGroup,
    SettingsGroupContent,
    SettingsGroupTitle,
    SettingsGroupWrapper,
} from '../../../components/SettingsGroup.styles.ts';
import { useNodeStore } from '@app/store/useNodeStore.ts';

import { invoke } from '@tauri-apps/api/core';
import { useEffect } from 'react';

export const TorDebug = () => {
    const { t } = useTranslation('settings', { useSuspense: false });
    const torEntryGuards = useNodeStore((s) => s.tor_entry_guards);

    useEffect(() => {
        const refreshGuards = () => {
            invoke<string[]>('refresh_tor_entry_guards').catch(() => {});
        };
        refreshGuards();
        const timer = window.setInterval(refreshGuards, 15000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <SettingsGroupWrapper>
            <SettingsGroupTitle>
                <Typography variant="h6">{t('tor-entry-guards')}</Typography>
            </SettingsGroupTitle>
            <SettingsGroup>
                <SettingsGroupContent style={{ fontSize: '11px' }}>
                    {torEntryGuards?.length > 0 ? (
                        <ul>
                            {torEntryGuards.map((eg) => (
                                <li key={eg}>{eg}</li>
                            ))}
                        </ul>
                    ) : (
                        t('no-entry-guard')
                    )}
                </SettingsGroupContent>
            </SettingsGroup>
        </SettingsGroupWrapper>
    );
};
