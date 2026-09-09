import React from 'react';
import { Loader2, Terminal, CheckCircle2 } from 'lucide-react';
import { ActiveDialog, LanguageCode, SystemEditionItem } from '../types';
import { translations } from '../translations';
import appLogo from '../assets/images/app-logo.png';

interface DialogModalProps {
  activeDialog: ActiveDialog;
  language: LanguageCode;
  onClose: () => void;
  progressStepText: string;
  hotpatchEnabled: boolean;
  onToggleHotpatch: () => void;
  onConfirmUpgradeFull: () => void;
  errorMessage?: string;
  errorCode?: string;
  systemMessage?: string;
  currentEdition?: SystemEditionItem;
  isActivated?: boolean;
}

export const DialogModal: React.FC<DialogModalProps> = ({
  activeDialog,
  language,
  onClose,
  progressStepText,
  hotpatchEnabled,
  onToggleHotpatch,
  onConfirmUpgradeFull,
  errorMessage,
  errorCode = '200',
  systemMessage,
  currentEdition,
  isActivated = false,
}) => {
  if (!activeDialog) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[460px] bg-white dark:bg-[#2b2b2b] text-neutral-900 dark:text-neutral-100 rounded-xl shadow-2xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Progress Dialogs (Wait or ActProg) */}
        {(activeDialog === 'wait' || activeDialog === 'act_prog') && (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-5">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin stroke-[2.5]" />
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {progressStepText || (activeDialog === 'wait' ? t.Loading : t.Activating)}
            </p>
          </div>
        )}

        {/* Complete Dialog (Activated / Converted) */}
        {(activeDialog === 'complete_donate' || activeDialog === 'complete') && (
          <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={appLogo}
                  alt="App Logo"
                  className="h-7 w-auto object-contain rounded drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]"
                />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{t.CompleteTitle}</span>
                </h3>
              </div>
            </div>
            <div className="px-6 py-4 overflow-y-auto text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line space-y-3">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t.DonateTextActivated}</p>
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 space-y-1 font-mono">
                <div>[✓] Status: Permanently Activated</div>
                <div>[✓] Method: {currentEdition ? currentEdition.method.toUpperCase() : 'HWID'}</div>
                <div>[✓] Target: {currentEdition ? currentEdition.displayOS : 'Windows'}</div>
              </div>
            </div>
            <div className="px-6 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
              >
                {t.OK}
              </button>
            </div>
          </div>
        )}

        {/* Error Dialog */}
        {activeDialog === 'error' && (
          <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-red-600 dark:text-red-400 flex items-center space-x-2">
                <span>{t.ErrorTitle}</span>
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line space-y-2 max-h-[300px]">
              <p>{errorMessage || t.Errors[errorCode] || 'Unknown error occurred.'}</p>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono pt-2 border-t border-neutral-200 dark:border-neutral-700">
                {t.ErrorCode} {errorCode}
                {systemMessage && (
                  <div className="mt-1 p-2 bg-neutral-100 dark:bg-neutral-900 rounded font-mono text-[11px] whitespace-pre-wrap">
                    {systemMessage}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                {t.OK}
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Full Version Dialog */}
        {activeDialog === 'upgrade_full' && (
          <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t.UpgradeFullVersionWindowsTitle}
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line space-y-3 max-h-[360px]">
              <p>{t.UpgradeFullVersionWindowsText}</p>
            </div>
            <div className="px-6 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end space-x-2">
              <button
                onClick={onConfirmUpgradeFull}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
              >
                {t.OK}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-medium transition-colors"
              >
                {t.Cancel}
              </button>
            </div>
          </div>
        )}

        {/* Manage Rebootless Update (Hotpatch Entitlement) Dialog */}
        {activeDialog === 'rebootless_update' && (
          <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t.RebootlessUpdateTitle}
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line space-y-3 max-h-[360px]">
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-xs font-medium">
                {t.RebootlessUpdateStatus.replace(
                  '{0}',
                  hotpatchEnabled
                    ? t.RebootlessUpdateStatusEnabled
                    : t.RebootlessUpdateStatusDefault,
                )}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t.RebootlessUpdateText}
              </p>
            </div>
            <div className="px-6 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end space-x-2">
              <button
                onClick={onToggleHotpatch}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs"
              >
                {hotpatchEnabled ? t.RebootlessUpdateRestoreBtn : t.RebootlessUpdateEnableBtn}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-medium transition-colors"
              >
                {t.Cancel}
              </button>
            </div>
          </div>
        )}

        {/* Help / Startup Arguments Dialog */}
        {activeDialog === 'help' && (
          <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <WindowsOrbitLogo className="h-7 w-auto rounded drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  {t.HelpToolTip}
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400">Windows Activator v1.0</span>
            </div>
            <div className="px-6 py-4 overflow-y-auto text-xs text-neutral-700 dark:text-neutral-300 space-y-3 font-mono">
              <pre className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-x-auto whitespace-pre leading-relaxed">
                {t.HelpText}
              </pre>
              <div className="text-neutral-500 dark:text-neutral-400 font-sans space-y-1">
                <p className="font-semibold text-neutral-700 dark:text-neutral-200">
                  Windows Activator Engine:
                </p>
                <p>• Digital License (HWID) activation for Windows 10/11.</p>
                <p>• Seamless version conversion without reinstallation.</p>
                <p>• Long-Term Offline KMS (LTOK) activation through year 2038.</p>
              </div>
            </div>
            <div className="px-6 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                {t.OK}
              </button>
            </div>
          </div>
        )}

        {/* Update Dialog */}
        {activeDialog === 'update' && (
          <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t.UpdateTitle}
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto text-sm text-neutral-700 dark:text-neutral-300 space-y-3">
              <p className="whitespace-pre-line text-xs">{t.UpdateText}</p>
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-xs space-y-1">
                <div>{t.CurrentVersion}: 1.0.0.0 (Version 1)</div>
                <div>{t.LatestVersion}: 1.0.0.0 (Up to date)</div>
              </div>
            </div>
            <div className="px-6 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                {t.OK}
              </button>
            </div>
          </div>
        )}

        {/* SLMGR License Status Dialog */}
        {activeDialog === 'slmgr_status' && currentEdition && (
          <div className="flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                {t.SLMGR_Status_Title}
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto space-y-3">
              <div className="p-3 bg-neutral-950 text-emerald-400 font-mono text-[11px] rounded-lg border border-neutral-800 shadow-inner overflow-x-auto leading-relaxed whitespace-pre font-mono">
{`Microsoft (R) Windows Script Host Version 5.812
Copyright (C) Microsoft Corporation. All rights reserved.

Name: Windows(R), ${currentEdition.displayOS}
Description: Windows Operating System, ${
  currentEdition.method === 'hwid'
    ? 'RETAIL channel (ClipUp HWID)'
    : currentEdition.method === 'kms38'
    ? 'VOLUME_KMS38 channel (Ticket offline)'
    : currentEdition.method === 'kms'
    ? 'VOLUME_KMSCLIENT channel'
    : currentEdition.method === 'oem_slic'
    ? 'OEM_SLP channel (ACPI SLIC 2.1)'
    : currentEdition.method === 'avma'
    ? 'VIRTUAL_MACHINE_AVMA channel'
    : 'VOLUME_LEGACY_PID channel'
}
Partial Product Key: ${currentEdition.key.slice(-5)}
License Status: ${isActivated ? 'Licensed (Permanent/Active)' : 'Notification Mode (Unlicensed)'}
NT Kernel Version: ${currentEdition.ntKernel || 'NT 10.0'}
Build Number: ${currentEdition.buildNumber || '26100.1742'}
SKU ID: ${currentEdition.sku}
Release Era: ${currentEdition.releaseYear || 'All'}
${
  currentEdition.method === 'kms'
    ? '\nVolume activation expiration: 259200 minute(s) (180 days)\nKMS Server: kms.windows.internal:1688\nKMS PID: 06401-00206-271-000003-03-1033-9200.0000-2452024'
    : currentEdition.method === 'kms38'
    ? '\nVolume activation expiration: 2038-01-19 03:14:07 UTC\nClipSVC Offline Ticket Hash: SHA256-VALIDATED'
    : currentEdition.method === 'hwid'
    ? '\nDigital License State: GenuineTicket.xml bound to hardware hash\nActivation ID: 00000000-0000-0000-0000-' + currentEdition.sku.padStart(12, '0')
    : currentEdition.method === 'oem_slic'
    ? '\nACPI Table: SLIC 2.1 marker present in BIOS (OEMID: DELL, TableID: CLOUDSLP)\nOEM Digital Certificate: DELL-OEM-SLIC-2.1.xrm-ms valid'
    : currentEdition.method === 'avma'
    ? '\nHyper-V AVMA Host: Authenticated via Hyper-V VMBus\nParent Virtualization Host: Windows Server Datacenter'
    : '\nLegacy Volume Licensing: PidGen 2.0 Validated\nDigitalProductId: Injected in registry'
}`}
              </div>
            </div>
            <div className="px-6 py-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
              >
                {t.OK}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
