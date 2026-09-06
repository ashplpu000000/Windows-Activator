import { useState, useEffect, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { SettingsCard } from './components/SettingsCard';
import { DialogModal } from './components/DialogModal';
import { ConsoleLogViewer } from './components/ConsoleLogViewer';
import { SystemInfoBanner } from './components/SystemInfoBanner';
import { defaultEditions } from './data/editions';
import { translations } from './translations';
import {
  LanguageCode,
  ThemeMode,
  ActiveDialog,
  LogEntry,
  SystemEditionItem,
} from './types';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isAuto, setIsAuto] = useState<boolean>(true);
  const [selectedEditionIndex, setSelectedEditionIndex] = useState<number>(0);
  const [manualKey, setManualKey] = useState<string>('');
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [progressStepText, setProgressStepText] = useState<string>('');
  const [hotpatchEnabled, setHotpatchEnabled] = useState<boolean>(false);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorCode, setErrorCode] = useState<string>('200');
  const [systemMessage, setSystemMessage] = useState<string | undefined>(undefined);

  const t = translations[language];
  const currentEdition: SystemEditionItem = defaultEditions[selectedEditionIndex] || defaultEditions[0];

  const addLog = useCallback((text: string, level: LogEntry['level'] = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const id = Math.random().toString(36).substring(2, 9);
    setLogs((prev) => [...prev, { id, time, text, level }]);
  }, []);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const isDark =
        themeMode === 'dark' || (themeMode === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    apply();
    mediaQuery.addEventListener('change', apply);
    return () => mediaQuery.removeEventListener('change', apply);
  }, [themeMode]);

  // Initial startup log
  useEffect(() => {
    addLog('CMWTAT Digital Edition Toolkit v3.1.0 initialized.');
    addLog('Detected system environment: Multi-OS Architecture Simulator');
    addLog(`Loaded ${defaultEditions.length} activation SKU profiles across Windows 7, 8, 8.1, 10, 11, LTSC, & Server 2005-2025.`);
    addLog('Software Protection Platform Service (sppsvc.exe): Running.');
  }, [addLog]);

  const cycleThemeMode = () => {
    setThemeMode((prev) => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  };

  const isKeyValid = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(
    manualKey.trim(),
  );

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Run Activation Flow (RunAct) tailored to OS & Method
  const handleActivate = async () => {
    const targetKey = isAuto ? currentEdition.key : manualKey.trim();
    const targetOS = isAuto ? currentEdition.displayOS : 'Custom Product Key';
    const method = isAuto ? currentEdition.method : 'hwid';

    setIsProcessing(true);
    setActiveDialog('act_prog');
    addLog(`Initiating activation sequence for: ${targetOS} [Method: ${method.toUpperCase()}]`, 'info');

    try {
      if (method === 'hwid') {
        // Step 1: Getting Key via Internet
        setProgressStepText(t.RunAct_Getting_Key);
        addLog(`Querying CloudMoe Digital Key Broker API for SKU: ${currentEdition.sku}...`);
        await sleep(750);
        addLog(`Assigned HWID Activation Key: ${targetKey}`, 'info');

        // Step 2: Uninstalling Old Key
        setProgressStepText(t.RunAct_Uninstalling_old_Key);
        addLog('Invoking Software Licensing Manager: slmgr.vbs /upk');
        await sleep(650);
        addLog('Uninstalled previous product key successfully.', 'success');

        // Step 3: Installing Key
        setProgressStepText(t.RunAct_Installing_Key);
        addLog(`Invoking Software Licensing Manager: slmgr.vbs /ipk ${targetKey}`);
        await sleep(800);
        addLog(`Installed product key ${targetKey} successfully.`, 'success');

        // Step 4: Free Upgrade Permissions
        setProgressStepText(t.RunAct_Getting_free_upgrade_permissions);
        addLog('Acquiring free upgrade ticket and downlevel activation permissions...');
        await sleep(600);

        // Step 5: Writing Feature of Old Windows Version
        setProgressStepText(t.RunAct_Writing_old_OS);
        addLog('Writing downlevel activation state to system registry...');
        await sleep(650);

        // Step 6: Getting Digital License (ClipUp)
        setProgressStepText(t.RunAct_Getting_digital_license);
        addLog('Invoking Client License Platform: ClipUp.exe -o -v -t');
        await sleep(850);
        addLog('Gathered GenuineTicket.xml hardware fingerprint payload.', 'success');

        // Step 7: Activating via slmgr /ato
        setProgressStepText(t.RunAct_Activating);
        addLog('Calling slmgr.vbs /ato to register HWID with Microsoft Activation Server...');
        await sleep(950);

        setIsActivated(true);
        addLog('Activation successful! Digital License (HWID) permanently bound to hardware.', 'success');
      } else if (method === 'kms38') {
        // KMS38 Workflow (Windows 10/11 LTSC / Windows Server 2016-2022)
        setProgressStepText(t.RunAct_Getting_Key);
        addLog(`Loading KMS38 GVLK Key for ${targetOS}: ${targetKey}...`);
        await sleep(650);

        setProgressStepText(t.RunAct_Uninstalling_old_Key);
        addLog('slmgr.vbs /upk');
        await sleep(600);

        setProgressStepText(t.RunAct_Installing_Key);
        addLog(`slmgr.vbs /ipk ${targetKey}`);
        await sleep(750);
        addLog('Installed KMS GVLK key.', 'success');

        setProgressStepText(t.RunAct_KMS38_Ticket);
        addLog('Generating KMS38 offline ticket with expiration: 2038-01-19 03:14:07 UTC...');
        await sleep(800);

        addLog('Injecting offline GenuineTicket into C:\\ProgramData\\Microsoft\\Windows\\ClipSVC\\GenuineTickets...');
        await sleep(600);

        setProgressStepText(t.RunAct_Activating);
        addLog('Restarting sppsvc.exe service to commit KMS38 permanent ticket...');
        await sleep(800);
        addLog('slmgr.vbs /ato');
        await sleep(700);

        setIsActivated(true);
        addLog('Activation successful! KMS38 license established through January 19, 2038.', 'success');
      } else if (method === 'kms') {
        // KMS GVLK Workflow (Windows Server 2008-2025, Windows 8/8.1, Windows 7 Pro/Ent)
        setProgressStepText(t.RunAct_Getting_Key);
        addLog(`Loading Microsoft Official GVLK Product Key: ${targetKey}...`);
        await sleep(600);

        setProgressStepText(t.RunAct_Uninstalling_old_Key);
        addLog('slmgr.vbs /upk');
        await sleep(550);

        setProgressStepText(t.RunAct_Installing_Key);
        addLog(`slmgr.vbs /ipk ${targetKey}`);
        await sleep(700);
        addLog('Installed Volume GVLK successfully.', 'success');

        setProgressStepText(t.RunAct_KMS_Connecting);
        addLog('Configuring KMS Host: slmgr.vbs /skms kms.cloudmoe.com:1688');
        await sleep(750);
        addLog('Setting KMS activation interval: slmgr.vbs /sai 120 /sri 10080');
        await sleep(500);

        setProgressStepText(t.RunAct_Activating);
        addLog('Contacting KMS Host for license grant: slmgr.vbs /ato');
        await sleep(900);

        setIsActivated(true);
        addLog('Activation successful! Volume license active (180 days periodic auto-renewal).', 'success');
      } else if (method === 'oem_slic') {
        // Windows 7 OEM SLIC 2.1 Workflow
        setProgressStepText(t.RunAct_Injecting_SLP);
        addLog('Reading ACPI table from BIOS memory...');
        await sleep(650);
        addLog('Detected SLIC 2.1 Table: OEMID="DELL  ", TableID="CLOUDSLP", PubKey Length=156 bytes.', 'info');

        setProgressStepText(t.RunAct_Installing_SLIC);
        addLog('Installing OEM Digital Certificate: slmgr.vbs /ilc DELL-OEM-SLIC-2.1.xrm-ms');
        await sleep(800);
        addLog('Certificate installed and bound to Software Licensing Service.', 'success');

        setProgressStepText(t.RunAct_Installing_Key);
        addLog(`Installing OEM:SLP Product Key: slmgr.vbs /ipk ${targetKey}`);
        await sleep(800);
        addLog('OEM:SLP product key installed successfully.', 'success');

        setProgressStepText(t.RunAct_Activating);
        addLog('Verifying SLIC marker and digital signature hash: slmgr.vbs /xpr');
        await sleep(800);

        setIsActivated(true);
        addLog('Activation successful! Windows 7 OEM:SLP license is permanently activated offline.', 'success');
      } else if (method === 'legacy_vl') {
        // Windows Server 2003 R2 / 2005 Volume License
        setProgressStepText(t.RunAct_Getting_Key);
        addLog(`Validating Volume License Key: ${targetKey} via PidGen.dll...`);
        await sleep(600);

        setProgressStepText(t.RunAct_Installing_Key);
        addLog('Writing DigitalProductId to HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion...');
        await sleep(750);

        setProgressStepText(t.RunAct_Activating);
        addLog('Verifying WPA token with oobe/msoobe /a...');
        await sleep(800);

        setIsActivated(true);
        addLog('Activation successful! Windows Server 2003/2005 Volume License validated.', 'success');
      } else if (method === 'avma') {
        // Hyper-V Automatic Virtual Machine Activation (AVMA) for Windows Server 2012 R2 - 2025
        setProgressStepText(t.RunAct_Getting_Key);
        addLog(`Querying Hyper-V integration services & AVMA bus for host token...`);
        await sleep(650);

        setProgressStepText(t.RunAct_Uninstalling_old_Key);
        addLog('slmgr.vbs /upk');
        await sleep(550);

        setProgressStepText(t.RunAct_AVMA_Binding);
        addLog(`Installing Hyper-V AVMA Key: slmgr.vbs /ipk ${targetKey}`);
        await sleep(800);
        addLog('AVMA Key installed. Hyper-V VMBus channel established.', 'success');

        setProgressStepText(t.RunAct_Activating);
        addLog('Exchanging license ticket with Hyper-V Virtualization Root: slmgr.vbs /ato');
        await sleep(900);

        setIsActivated(true);
        addLog('Activation successful! Guest VM automatically activated via Hyper-V AVMA.', 'success');
      }

      // If IoT or Embedded, verify unified write filter and licensing lock
      if (currentEdition.family === 'iot') {
        setProgressStepText(t.RunAct_IoT_Lockdown);
        addLog('Checking Unified Write Filter (uwfmgr.exe get-config)...');
        await sleep(500);
        addLog('IoT Embedded policy verified: UWF exclusions established.', 'info');
      }

      setActiveDialog('complete');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Activation exception: ${msg}`, 'error');
      setErrorCode('-4');
      setSystemMessage(msg);
      setActiveDialog('error');
    } finally {
      setIsProcessing(false);
      setProgressStepText('');
    }
  };

  // Run Version Conversion Flow (RunInstall)
  const handleConvert = async () => {
    const targetKey = isAuto ? currentEdition.key : manualKey.trim();
    const targetOS = isAuto ? currentEdition.displayOS : 'Custom Product Key';

    setIsProcessing(true);
    setActiveDialog('act_prog');
    addLog(`Initiating SKU Edition Conversion to: ${targetOS}`, 'info');

    try {
      setProgressStepText(t.RunInstall_Getting_Key);
      addLog(`Retrieving default retail key for ${targetOS}...`);
      await sleep(700);

      setProgressStepText(t.RunInstall_Uninstalling_old_Key);
      addLog('slmgr.vbs /upk');
      await sleep(600);

      setProgressStepText(t.RunInstall_Installing_Key);
      addLog(`slmgr.vbs /ipk ${targetKey}`);
      await sleep(850);

      addLog(`Converted OS SKU successfully to: ${targetOS}`, 'success');
      setActiveDialog('complete');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog(`Conversion exception: ${msg}`, 'error');
      setErrorCode('-2');
      setSystemMessage(msg);
      setActiveDialog('error');
    } finally {
      setIsProcessing(false);
      setProgressStepText('');
    }
  };

  // Upgrade to Full Version
  const handleConfirmUpgradeFull = async () => {
    setActiveDialog('act_prog');
    setProgressStepText(t.RunUpgradeFullVersion_Upgrading);
    addLog('Executing Windows edition upgrade: sc start sppsvc, sc start wuauserv...');

    await sleep(800);
    addLog('ChangePK.exe /ProductKey VK7JG-NPHTM-C97JM-9MPGT-3V66T');
    await sleep(1000);
    addLog('Core edition package upgrade finished successfully.', 'success');

    setSelectedEditionIndex(0); // Pro
    setActiveDialog(null);
  };

  // Toggle Hotpatch (Rebootless Update)
  const handleToggleHotpatch = () => {
    const nextState = !hotpatchEnabled;
    setHotpatchEnabled(nextState);
    addLog(
      `Registry policy AllowRebootlessUpdates modified to: ${nextState ? '1 (Enabled)' : '0 (Default)'}`,
      'success',
    );
    setActiveDialog(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f2f2f7] to-[#e5e5ea] dark:from-[#191919] dark:to-[#121212] flex items-center justify-center p-2 sm:p-4 text-neutral-900 dark:text-neutral-100 selection:bg-blue-500 selection:text-white">
      {/* Desktop Simulated Windows Window */}
      <div className="w-full max-w-[620px] bg-[#fbfbfb]/95 dark:bg-[#202020]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col transition-colors my-2">
        {/* Fluent Titlebar */}
        <TitleBar
          language={language}
          onLanguageChange={setLanguage}
          themeMode={themeMode}
          onThemeModeCycle={cycleThemeMode}
          onOpenDialog={(dlg) => setActiveDialog(dlg)}
          showLogs={showLogs}
          onToggleLogs={() => setShowLogs((prev) => !prev)}
        />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 flex flex-col">
          {/* Settings Card for Selection & Actions */}
          <SettingsCard
            language={language}
            isAuto={isAuto}
            onSetAuto={setIsAuto}
            editions={defaultEditions}
            selectedEditionIndex={selectedEditionIndex}
            onSelectEdition={(idx) => {
              setSelectedEditionIndex(idx);
              addLog(`Switched target SKU to: ${defaultEditions[idx]?.displayOS}`);
            }}
            manualKey={manualKey}
            onManualKeyChange={setManualKey}
            isKeyValid={isKeyValid}
            onActivate={handleActivate}
            onConvert={handleConvert}
            onOpenUpgradeFull={() => setActiveDialog('upgrade_full')}
            onOpenHotpatch={() => setActiveDialog('rebootless_update')}
            isProcessing={isProcessing}
          />

          {/* System Status Banner */}
          <SystemInfoBanner
            currentEdition={currentEdition}
            isActivated={isActivated}
            hotpatchEnabled={hotpatchEnabled}
            onOpenStatus={() => setActiveDialog('slmgr_status')}
          />

          {/* Collapsible Console Log Panel */}
          {showLogs && (
            <div className="w-full max-w-[540px] mx-auto mt-4">
              <ConsoleLogViewer
                logs={logs}
                onClear={() => setLogs([])}
                isOpen={showLogs}
                onClose={() => setShowLogs(false)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Fluent Dialog Modals */}
      <DialogModal
        activeDialog={activeDialog}
        language={language}
        onClose={() => setActiveDialog(null)}
        progressStepText={progressStepText}
        errorCode={errorCode}
        systemMessage={systemMessage}
        onConfirmUpgradeFull={handleConfirmUpgradeFull}
        hotpatchEnabled={hotpatchEnabled}
        onToggleHotpatch={handleToggleHotpatch}
        currentEdition={currentEdition}
        isActivated={isActivated}
      />
    </div>
  );
}
