import { useState, useEffect, useCallback, useMemo } from 'react';
import { TitleBar } from './components/TitleBar';
import { SettingsCard } from './components/SettingsCard';
import { DialogModal } from './components/DialogModal';
import { ConsoleLogViewer } from './components/ConsoleLogViewer';
import { SystemInfoBanner } from './components/SystemInfoBanner';
import { ThemePickerModal } from './components/ThemePickerModal';
import { KeyCheckerModal } from './components/KeyCheckerModal';
import { IsoDownloaderModal } from './components/IsoDownloaderModal';
import { XpActivationModal } from './components/XpActivationModal';
import { defaultEditions } from './data/editions';
import { themes, defaultTheme } from './data/themes';
import { translations } from './translations';
import { worldLanguages } from './data/languages';
import { validateAndRecognizeKey } from './utils/keyValidator';
import { detectHostOperatingSystem, createDetectedInfoFromEdition, DetectedSystemInfo } from './utils/systemDetector';
import {
  LanguageCode,
  ThemeMode,
  ActiveDialog,
  LogEntry,
  SystemEditionItem,
  ThemePreset,
} from './types';
import { isRTL, getLanguageMetadata } from './utils/languageEngine';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('win_activator_lang');
      if (saved) return saved as LanguageCode;
    } catch {
      // ignore
    }
    return 'en';
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(() => {
    try {
      const saved = localStorage.getItem('win_activator_theme_id');
      if (saved) {
        const found = themes.find((t) => t.id === saved);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return defaultTheme;
  });
  const [isAuto, setIsAuto] = useState<boolean>(true);
  const [selectedEditionIndex, setSelectedEditionIndex] = useState<number>(-1);
  const [detectedSystem, setDetectedSystem] = useState<DetectedSystemInfo | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [manualKey, setManualKey] = useState<string>('');
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [progressStepText, setProgressStepText] = useState<string>('');
  const [hotpatchEnabled, setHotpatchEnabled] = useState<boolean>(false);
  const [isActivated, setIsActivated] = useState<boolean>(() => {
    try {
      const hasActivated = localStorage.getItem('win_activator_has_activated');
      const act = localStorage.getItem('win_activator_is_activated');
      return hasActivated === 'true' && act === 'true';
    } catch {
      return false;
    }
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorCode, setErrorCode] = useState<string>('200');
  const [systemMessage, setSystemMessage] = useState<string | undefined>(undefined);

  const t = translations[language] || translations.en;
  const currentEdition: SystemEditionItem | null =
    selectedEditionIndex >= 0 && defaultEditions[selectedEditionIndex]
      ? defaultEditions[selectedEditionIndex]
      : null;

  const addLog = useCallback((text: string, level: LogEntry['level'] = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const id = Math.random().toString(36).substring(2, 9);
    setLogs((prev) => [...prev, { id, time, text, level }]);
  }, []);

  const handleToggleActivated = useCallback(() => {
    setIsActivated((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('win_activator_is_activated', String(next));
        localStorage.setItem('win_activator_has_activated', 'true');
      } catch {
        // ignore
      }
      addLog(
        next
          ? 'Host Windows activation state set to: ACTIVATED (Genuine Permanent License).'
          : 'Host Windows activation state set to: NOT ACTIVATED (Notification / Grace Period).',
        next ? 'success' : 'warn',
      );
      return next;
    });
  }, [addLog]);

  const handleSetDetectedEdition = useCallback(
    (editionName: string, index?: number) => {
      let targetEd = typeof index === 'number' && index >= 0 ? defaultEditions[index] : null;

      if (!targetEd) {
        const foundIdx = defaultEditions.findIndex(
          (e) =>
            e.displayOS.toLowerCase() === editionName.toLowerCase() ||
            e.sku.toLowerCase() === editionName.toLowerCase() ||
            e.displayOS.toLowerCase().includes(editionName.toLowerCase()),
        );
        if (foundIdx >= 0) {
          targetEd = defaultEditions[foundIdx];
        }
      }

      if (targetEd) {
        const newDetected = createDetectedInfoFromEdition(
          targetEd,
          defaultEditions,
          isActivated,
          'Manual Host Profile'
        );
        setDetectedSystem(newDetected);
        addLog(`Host edition profile updated to: ${targetEd.displayOS} (${newDetected.architecture} · NT ${newDetected.kernelVersion})`, 'info');
      } else {
        setDetectedSystem((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            detectedEdition: editionName,
          };
        });
        addLog(`Host edition profile updated to: ${editionName}`, 'info');
      }
    },
    [addLog, isActivated],
  );

  // Theme application and CSS variables
  useEffect(() => {
    try {
      localStorage.setItem('win_activator_theme_id', currentTheme.id);
    } catch {
      // ignore
    }

    const root = document.documentElement;
    if (currentTheme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.style.setProperty('--theme-accent', currentTheme.accentColor);
    root.style.setProperty('--theme-accent-hover', currentTheme.accentHover);
    root.style.setProperty('--theme-card-bg', currentTheme.cardBg);
    root.style.setProperty('--theme-window-bg', currentTheme.windowBg);
    root.style.setProperty('--theme-border', currentTheme.borderCol);
  }, [currentTheme]);

  // Language persistence and RTL layout configuration
  useEffect(() => {
    try {
      localStorage.setItem('win_activator_lang', language);
    } catch {
      // ignore
    }
    const rtl = isRTL(language);
    if (rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  // Automatic Host Windows Version & Edition Detection
  const handleAutoDetect = useCallback(async () => {
    setIsDetecting(true);
    addLog('Initiating automatic Windows version and edition detector...', 'info');
    try {
      const detected = await detectHostOperatingSystem(defaultEditions, { forceHardwareRescan: true });
      setDetectedSystem(detected);
      if (detected.isWindows) {
        const hostEditionName = detected.detectedEdition || detected.osName || 'Windows 11';
        addLog(
          `Detected Windows Host: ${hostEditionName} (${detected.architecture}) · Kernel: NT ${detected.kernelVersion} · Status: ${isActivated ? 'ACTIVATED' : 'NOT ACTIVATED'}`,
          isActivated ? 'success' : 'info',
        );
        // Only set the initial dropdown target SKU if none has been selected yet
        setSelectedEditionIndex((prev) => {
          if (prev < 0 && detected.suggestedEditionIndex >= 0) {
            addLog(
              `Auto-configured initial target activation profile: ${defaultEditions[detected.suggestedEditionIndex]?.displayOS}`,
              'success',
            );
            return detected.suggestedEditionIndex;
          }
          return prev >= 0 ? prev : 0;
        });
      } else {
        addLog(
          `Host OS detected: ${detected.osName} (${detected.detectionMethod}). No default edition forced. Please select your desired Windows edition.`,
          'info',
        );
        setSelectedEditionIndex((prev) => (prev >= 0 ? prev : 0));
      }
    } catch (err) {
      addLog(`Detection error: ${String(err)}`, 'error');
    } finally {
      setIsDetecting(false);
    }
  }, [addLog, isActivated]);

  // Initial startup log & Automatic Detection
  useEffect(() => {
    try {
      // Clear legacy host edition overwrite from prior versions
      localStorage.removeItem('win_activator_host_edition');
    } catch {
      // ignore
    }
    addLog('Windows Activator Version 1 (v1.0.0) initialized.');
    addLog(`Loaded ${defaultEditions.length} activation SKU profiles across Windows 7, 8, 8.1, 10, 11, LTSC, & Server 2005-2025.`);
    addLog(`Supported languages: ${worldLanguages.length.toLocaleString()} living & world languages (ISO 639-3).`);
    addLog('Software Protection Platform Service (sppsvc.exe): Running.');
    handleAutoDetect();
  }, [addLog, handleAutoDetect]);

  const cycleThemeMode = () => {
    setThemeMode((prev) => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  };

  const keyAnalysis = useMemo(() => {
    return validateAndRecognizeKey(manualKey, defaultEditions, currentEdition?.family);
  }, [manualKey, currentEdition?.family]);

  const isKeyValid = useMemo(() => {
    if (isAuto) return currentEdition !== null;
    return keyAnalysis.isValid && keyAnalysis.isRecognized;
  }, [isAuto, currentEdition, keyAnalysis]);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // Run Activation Flow (RunAct) tailored to OS & Method
  const handleActivate = async () => {
    if (isAuto && !currentEdition) {
      addLog('[Error] No Windows edition chosen. Please auto-detect or choose an edition from the catalog.', 'error');
      setErrorCode('0x80070057');
      setSystemMessage('No Windows edition is currently selected. Please click Auto-Detect or choose an edition to proceed with activation.');
      setActiveDialog('error');
      return;
    }

    let activeEdition = currentEdition!;
    let targetKey = currentEdition ? currentEdition.key : '';
    let targetOS = currentEdition ? currentEdition.displayOS : 'Windows';
    let method = currentEdition ? currentEdition.method : 'kms';

    if (!isAuto) {
      if (!keyAnalysis.isValid || !keyAnalysis.isRecognized || !keyAnalysis.matchedEdition) {
        addLog(`[Error] Activation blocked: "${manualKey || 'Empty'}" is not a valid genuine Windows product key.`, 'error');
        setErrorCode('0xC004C003');
        setSystemMessage(`The Microsoft Activation Service rejected the specified product key (${manualKey || 'N/A'}). The key is invalid or unrecognized.`);
        setActiveDialog('error');
        return;
      }

      activeEdition = keyAnalysis.matchedEdition;
      targetKey = keyAnalysis.formattedKey;
      targetOS = activeEdition.displayOS;
      method = activeEdition.method || 'kms';

      if (keyAnalysis.matchedEditionIndex >= 0) {
        setSelectedEditionIndex(keyAnalysis.matchedEditionIndex);
      }
    }

    setIsProcessing(true);
    setActiveDialog('act_prog');
    addLog(`Initiating activation sequence for: ${targetOS} [Method: ${method.toUpperCase()}]`, 'info');

    try {
      if (method === 'hwid') {
        // Step 1: Getting Key via Internet
        setProgressStepText(t.RunAct_Getting_Key);
        addLog(`Querying Digital License Key Broker API for SKU: ${activeEdition.sku}...`);
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
        addLog('Configuring KMS Host: slmgr.vbs /skms kms.windows.internal:1688');
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
      } else if (method === 'wpa_offline') {
        // Windows XP Offline WPA Bypass / Reset Registry Workflow
        setProgressStepText('Windows XP Offline Activation Engine');
        addLog(`Loading Windows XP Product Key: ${targetKey}...`);
        await sleep(650);

        setProgressStepText('Writing WPA Registry Tokens');
        addLog('Modifying HKLM\\Software\\Microsoft\\Windows NT\\CurrentVersion\\WPAEvents...');
        addLog('Writing OOBETimer payload to bypass Windows Product Activation (WPA)...');
        await sleep(800);

        setProgressStepText('Registering Offline Activation State');
        addLog('Invoking %SystemRoot%\\system32\\oobe\\msoobe.exe /a...');
        await sleep(800);

        setIsActivated(true);
        addLog('Activation successful! Windows XP is now permanently activated offline.', 'success');
      } else if (method === 'phone_cid') {
        // Windows XP Telephone Activation / 48-Digit CID Confirmation
        setProgressStepText('Generating 54-Digit Installation ID (IID)');
        addLog(`Initializing Telephone Activation Protocol for ${targetOS}...`);
        await sleep(650);

        setProgressStepText('Computing Confirmation ID (CID)');
        addLog('Calling MS Offline Confirmation Algorithm (XpKeyGen / Phone CID)...');
        await sleep(850);
        addLog('Generated 48-Digit Confirmation ID: 123456-789012-345678-901234-567890-123456-789012-345678', 'info');

        setProgressStepText('Committing Product Activation');
        addLog('Writing Confirmation ID into system licensing store...');
        await sleep(750);

        setIsActivated(true);
        addLog('Activation successful! Windows XP verified via Telephone Confirmation ID.', 'success');
      }

      // If IoT or Embedded, verify unified write filter and licensing lock
      if (activeEdition.family === 'iot') {
        setProgressStepText(t.RunAct_IoT_Lockdown);
        addLog('Checking Unified Write Filter (uwfmgr.exe get-config)...');
        await sleep(500);
        addLog('IoT Embedded policy verified: UWF exclusions established.', 'info');
      }

      setIsActivated(true);
      try {
        localStorage.setItem('win_activator_is_activated', 'true');
        localStorage.setItem('win_activator_has_activated', 'true');
      } catch {
        // ignore
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
    if (isAuto && !currentEdition) {
      addLog('No target Windows edition selected for conversion. Please select an edition or run Auto-Detect.', 'warn');
      return;
    }

    const targetKey = isAuto ? currentEdition!.key : manualKey.trim();
    const targetOS = isAuto ? currentEdition!.displayOS : 'Custom Product Key';

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
    <div
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 text-neutral-900 dark:text-neutral-100 selection:bg-blue-500 selection:text-white transition-all duration-300"
      style={{ background: currentTheme.bgGradient }}
    >
      {/* Desktop Simulated Windows Window */}
      <div
        className="w-full max-w-[1040px] backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 my-3 sm:my-4"
        style={{
          backgroundColor: currentTheme.windowBg,
          borderColor: currentTheme.borderCol,
          borderWidth: 1,
        }}
      >
        {/* Fluent Titlebar */}
        <TitleBar
          language={language}
          onLanguageChange={(newLang) => {
            setLanguage(newLang);
            const meta = getLanguageMetadata(newLang);
            addLog(
              `UI language changed to ${meta.flag} ${meta.nativeName} (${meta.englishName}) [${newLang.toUpperCase()}]`,
              'info',
            );
          }}
          themeMode={themeMode}
          onThemeModeCycle={cycleThemeMode}
          onOpenDialog={(dlg) => setActiveDialog(dlg)}
          showLogs={showLogs}
          onToggleLogs={() => setShowLogs(!showLogs)}
          currentTheme={currentTheme}
          onOpenThemePicker={() => setActiveDialog('theme_picker')}
        />

        {/* Main Content Area */}
        <main className="p-4 sm:p-5 flex flex-col space-y-3 sm:space-y-3.5">
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
            onOpenKeyChecker={() => setActiveDialog('key_checker')}
            onOpenIsoCenter={() => setActiveDialog('iso_downloader')}
            onOpenXpTool={() => setActiveDialog('xp_activation_tool')}
            isProcessing={isProcessing}
            showLogs={showLogs}
            onToggleLogs={() => setShowLogs(!showLogs)}
            detectedSystem={detectedSystem}
            isDetecting={isDetecting}
            onAutoDetect={handleAutoDetect}
            isActivated={isActivated}
            onToggleActivated={handleToggleActivated}
            onSetDetectedEdition={handleSetDetectedEdition}
            onOpenStatus={() => setActiveDialog('slmgr_status')}
          />

          {/* System Status Banner */}
          <SystemInfoBanner
            currentEdition={currentEdition}
            isActivated={isActivated}
            hotpatchEnabled={hotpatchEnabled}
            onOpenStatus={() => setActiveDialog('slmgr_status')}
            onAutoDetect={handleAutoDetect}
            detectedOS={detectedSystem?.detectedEdition || detectedSystem?.osName}
            language={language}
          />

          {/* Collapsible Console Log Panel */}
          {showLogs && (
            <div className="w-full mt-4">
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
        currentEdition={currentEdition || undefined}
        isActivated={isActivated}
      />

      {/* 500 Types of Themes Studio Modal */}
      {activeDialog === 'theme_picker' && (
        <ThemePickerModal
          currentTheme={currentTheme}
          onSelectTheme={(selected) => {
            setCurrentTheme(selected);
            addLog(`Theme changed to: ${selected.name} (${selected.category})`, 'success');
          }}
          onClose={() => setActiveDialog(null)}
        />
      )}

      {/* Product Key Health & Verifier Modal */}
      {activeDialog === 'key_checker' && (
        <KeyCheckerModal
          isOpen={true}
          onClose={() => setActiveDialog(null)}
          language={language}
          onSelectKey={(key, editionIdx) => {
            if (editionIdx !== undefined && editionIdx >= 0) {
              setIsAuto(true);
              setSelectedEditionIndex(editionIdx);
              addLog(`Selected verified SKU: ${defaultEditions[editionIdx]?.displayOS} (${key})`, 'info');
            } else {
              setIsAuto(false);
              setManualKey(key);
              addLog(`Applied custom key: ${key}`, 'info');
            }
          }}
        />
      )}

      {/* Windows ISO Download Center Modal */}
      {activeDialog === 'iso_downloader' && (
        <IsoDownloaderModal
          isOpen={true}
          onClose={() => setActiveDialog(null)}
          selectedTargetOS={currentEdition?.displayOS}
        />
      )}

      {/* Windows XP Activation Studio Modal */}
      {activeDialog === 'xp_activation_tool' && (
        <XpActivationModal
          isOpen={true}
          onClose={() => setActiveDialog(null)}
          onSelectKey={(key, editionName) => {
            if (editionName) {
              setIsAuto(true);
              const foundIdx = defaultEditions.findIndex(
                (e) =>
                  e.displayOS.toLowerCase() === editionName.toLowerCase() ||
                  e.sku.toLowerCase() === editionName.toLowerCase() ||
                  e.displayOS.toLowerCase().includes(editionName.toLowerCase()),
              );
              if (foundIdx >= 0) {
                setSelectedEditionIndex(foundIdx);
                handleSetDetectedEdition(defaultEditions[foundIdx].displayOS, foundIdx);
              } else {
                handleSetDetectedEdition(editionName);
              }
              addLog(`Selected Windows XP edition: ${editionName} with key ${key}`, 'info');
            } else {
              setIsAuto(false);
              setManualKey(key);
              addLog(`Applied Windows XP Key: ${key}`, 'info');
            }
          }}
        />
      )}
    </div>
  );
}
