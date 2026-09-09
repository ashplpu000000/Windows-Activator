import React, { useState } from 'react';
import {
  X,
  Key,
  Copy,
  Check,
  Phone,
  Terminal,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Download,
} from 'lucide-react';
import {
  generateXpConfirmationId,
  xpActivationMethods,
} from '../utils/xpActivationEngine';

interface XpActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKey?: (key: string, editionName: string) => void;
  onOpenIsoCenter?: (osName?: string) => void;
}

export const xpEditionsList = [
  {
    id: 'xp-pro-sp3-vlk',
    name: 'Windows XP Professional SP3 (Volume License / VLK)',
    key: 'V2C47-MK7JD-3R89F-D2KXW-VPK3J',
    channel: 'Corporate VLK',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1 (Build 2600.xpsp_sp3_qfe)',
    activationRequired: 'NO (Bypassed natively via PID 640)',
    description: 'The definitive, most compatible release of Windows XP. Corporate Volume License editions require zero activation prompts.',
  },
  {
    id: 'xp-pro-sp3-vlk-alt1',
    name: 'Windows XP Professional SP3 (Corporate VLK Alt)',
    key: 'MRX3F-47B9T-2487J-KWKMF-RPWBY',
    channel: 'Corporate VLK',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'NO (PID 640 Volume License)',
    description: 'Secondary verified genuine Corporate VLK key for XP Pro SP3 deployment.',
  },
  {
    id: 'xp-pro-sp3-vlk-alt2',
    name: 'Windows XP Professional SP3 (Corporate VLK Alt 2)',
    key: 'QC986-27D34-6M3TY-JJXP9-TBGMD',
    channel: 'Corporate VLK',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'NO (PID 640 Volume License)',
    description: 'Volume License key for clean slipstreamed XP Professional installations.',
  },
  {
    id: 'xp-pro-sp1-vlk',
    name: 'Windows XP Professional SP1 / SP0 (Historical VLK)',
    key: 'FCKGW-RHQQ2-YXRKT-8TG6W-2B7Q8',
    channel: 'Corporate VLK',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1 (Build 2600.1106)',
    activationRequired: 'NO (SP0/SP1 Volume License)',
    description: 'The historic original Volume License key for early Windows XP and SP1 releases.',
  },
  {
    id: 'xp-pro-x64-vlk',
    name: 'Windows XP Professional x64 Edition (Corporate VLK)',
    key: 'B66VY-4D94T-TPPD4-FACVB-68HVR',
    channel: 'Corporate VLK',
    arch: 'x64 (AMD64)',
    kernel: 'NT 5.2 (Server 2003 codebase Build 3790)',
    activationRequired: 'NO (Corporate VLK)',
    description: '64-bit Windows XP based on the high-performance Windows Server 2003 NT 5.2 kernel.',
  },
  {
    id: 'xp-pro-x64-vlk-alt',
    name: 'Windows XP Professional x64 Edition (VLK Alt)',
    key: 'VCFQD-V9FX9-46WVH-K3CD4-4J3JM',
    channel: 'Corporate VLK',
    arch: 'x64 (AMD64)',
    kernel: 'NT 5.2',
    activationRequired: 'NO (Corporate VLK)',
    description: 'Alternate Corporate VLK key for Windows XP x64 Edition SP2.',
  },
  {
    id: 'xp-pro-retail',
    name: 'Windows XP Professional (Retail)',
    key: 'CD87T-HFP4C-VRP83-3R288-CKB8W',
    channel: 'Retail',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'Standard retail box release of Windows XP Pro. Activates offline via telephone confirmation ID.',
  },
  {
    id: 'xp-pro-oem',
    name: 'Windows XP Professional (OEM / System Builder)',
    key: 'XJM6Q-BQ8HW-T6DFB-N934T-YD4YT',
    channel: 'OEM',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'YES (Activate via Phone CID Generator or OEM SLP)',
    description: 'OEM System Builder license for Dell, HP, Lenovo, and custom desktop installations.',
  },
  {
    id: 'xp-home-retail',
    name: 'Windows XP Home Edition (Retail SP1-SP3)',
    key: 'JQ4T4-8VM63-6WFBQ-KFYC9-QR672',
    channel: 'Retail',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1 (Build 2600)',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'Retail edition of Windows XP Home Edition. Activates via telephone confirmation ID generator.',
  },
  {
    id: 'xp-home-retail-alt',
    name: 'Windows XP Home Edition (Retail Alt)',
    key: 'BQB7T-3C4FF-393QD-RF3W4-GBRQ6',
    channel: 'Retail',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'Retail key for Windows XP Home Edition SP2 / SP3.',
  },
  {
    id: 'xp-home-oem',
    name: 'Windows XP Home Edition (OEM / System Builder)',
    key: 'GW42F-KM4JJ-MV6M3-T362P-R8VDQ',
    channel: 'OEM',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'OEM key for Windows XP Home Edition pre-installed on consumer PCs.',
  },
  {
    id: 'xp-mce-2005',
    name: 'Windows XP Media Center Edition 2005 (MCE 2005)',
    key: 'C4FPJ-HQCG2-CQ889-FC89P-WGYVQ',
    channel: 'OEM / Retail',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1 (Royale Media Center)',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: '2-CD edition featuring the iconic Royale Energy Blue theme and Media Center 10.',
  },
  {
    id: 'xp-mce-2005-alt',
    name: 'Windows XP Media Center Edition 2005 (Alt Key)',
    key: 'RD6W4-36946-83HR2-QDV9C-W32GW',
    channel: 'OEM',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'Genuine OEM key for Windows XP Media Center Edition 2005 Rollup 2.',
  },
  {
    id: 'xp-tablet-2005',
    name: 'Windows XP Tablet PC Edition 2005',
    key: 'XT67V-GY7FW-7833W-MQ9M8-RQRHC',
    channel: 'OEM / Tablet',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1 (Ink & Stylus API)',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'Specialized Windows XP edition with pen digitizer, handwriting recognition, and Ink services.',
  },
  {
    id: 'xp-posready-2009',
    name: 'Windows Embedded POSReady 2009',
    key: 'D8F3H-247K8-Y4R4H-Y34TC-X76B6',
    channel: 'Embedded POS',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1 (Supported until April 2019)',
    activationRequired: 'NO (Embedded Runtime Activation)',
    description: 'The longest-supported official branch of Windows XP, receiving security updates through April 9, 2019.',
  },
  {
    id: 'xp-embedded-sp2',
    name: 'Windows XP Embedded (XPe SP2 / FP2007)',
    key: 'K4PBP-GFF8J-4F7F2-6VTV6-3BF2J',
    channel: 'Embedded Componentized',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'NO (Target Designer Runtime License)',
    description: 'Modular componentized Windows XP for industrial and kiosk hardware.',
  },
  {
    id: 'xp-starter',
    name: 'Windows XP Starter Edition',
    key: 'TBRHT-XPCK9-M8BH7-6MVTX-P4BFF',
    channel: 'Starter',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'Lightweight edition released in 139 emerging countries with simplified UI controls.',
  },
  {
    id: 'winflp-sp2',
    name: 'Windows Fundamentals for Legacy PCs (WinFLP)',
    key: 'M4676-2VW7F-6BCVH-9QPBF-QBRBM',
    channel: 'Corporate VLK',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1 (Thin Client OS)',
    activationRequired: 'NO (Corporate VLK)',
    description: 'Official Microsoft lean thin-client operating system based on Windows XP SP2.',
  },
  {
    id: 'xp-pro-n',
    name: 'Windows XP Professional N (Without Media Player)',
    key: 'M6TF9-8XQ2M-TK322-RG22F-37WY8',
    channel: 'Retail N',
    arch: 'x86 (32-bit)',
    kernel: 'NT 5.1',
    activationRequired: 'YES (Activate via Phone CID Generator below)',
    description: 'European Commission compliant edition without Windows Media Player preinstalled.',
  },
  {
    id: 'xp-itanium-ia64',
    name: 'Windows XP 64-Bit Edition for Intel Itanium',
    key: 'HH7VV-6C4RW-DDB62-3JD64-HQVD8',
    channel: 'Corporate IA-64',
    arch: 'ia64 (Itanium)',
    kernel: 'NT 5.2 (IA-64)',
    activationRequired: 'NO (Corporate VLK)',
    description: 'Specialized 64-bit edition developed for Intel Itanium 1 and Itanium 2 server workstation processors.',
  },
];

export const XpActivationModal: React.FC<XpActivationModalProps> = ({
  isOpen,
  onClose,
  onSelectKey,
  onOpenIsoCenter,
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'keys' | 'scripts' | 'guide'>('phone');
  const [searchKey, setSearchKey] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Phone Confirmation ID Generator State
  const [installationId, setInstallationId] = useState('');
  const [cidResult, setCidResult] = useState<ReturnType<typeof generateXpConfirmationId> | null>(null);
  const [copiedCidGroup, setCopiedCidGroup] = useState<number | 'all' | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2200);
  };

  const handleGenerateCid = () => {
    const res = generateXpConfirmationId(installationId);
    setCidResult(res);
  };

  const fillSampleIid = () => {
    // Standard authentic Windows XP Installation ID sample (9 groups of 6 digits)
    const sample = '012345-678901-234567-890123-456789-012345-678901-234567-890123';
    setInstallationId(sample);
    const res = generateXpConfirmationId(sample);
    setCidResult(res);
  };

  const filteredEditions = xpEditionsList.filter((e) => {
    if (!searchKey) return true;
    const q = searchKey.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.key.toLowerCase().includes(q) ||
      e.channel.toLowerCase().includes(q) ||
      e.arch.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c22] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700/80 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header with Classic Windows XP Bliss / Blue Accents */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/15 backdrop-blur-xs rounded-xl text-white shadow-inner">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Windows XP Complete Activation Studio
                </h2>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-amber-400 text-neutral-900 rounded-md shadow-xs">
                  Every Edition of XP
                </span>
              </div>
              <p className="text-xs text-blue-100/90">
                Corporate VLK Bypass Keys, Offline Telephone Confirmation ID (CID) Generator, WPA Patch & Scripts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Toolbar */}
        <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-[#23232a] flex items-center gap-1.5 overflow-x-auto shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'phone'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Offline Phone CID Generator</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-400 text-neutral-900 rounded-full font-bold">
              100% Genuine
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'keys'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Every Windows XP Edition Keys ({xpEditionsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'scripts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>One-Click WPA & Registry Scripts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Step-by-Step Activation Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: OFFLINE TELEPHONE ACTIVATION (CONFIRMATION ID GENERATOR)           */}
          {/* ========================================================================= */}
          {activeTab === 'phone' && (
            <div className="space-y-6">
              {/* Informational Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs text-neutral-700 dark:text-neutral-300 flex flex-col sm:flex-row items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Offline Telephone Confirmation ID (CID) Generator for Windows XP
                  </h3>
                  <p className="leading-relaxed">
                    Microsoft officially retired the Windows XP activation servers and phone automated system in 2020.
                    Using the authentic reverse-engineered WPA telephone activation algorithm, this tool takes your
                    <strong> 54-digit Installation ID</strong> from <code className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 rounded border border-blue-200 dark:border-neutral-700 font-mono">oobe\msoobe.exe /a</code>
                    and instantly calculates the exact <strong>42-digit Confirmation ID (Groups A to G)</strong> to achieve 100% genuine offline permanent activation.
                  </p>
                </div>
              </div>

              {/* Classic Windows XP Activation UI Simulation Container */}
              <div className="bg-neutral-50 dark:bg-[#18181e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Step 1: Enter your 54-digit Installation ID (IID)
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Located in Windows XP under: Start → Run → <code className="font-mono">oobe\msoobe /a</code> → "Activate by Telephone"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fillSampleIid}
                    className="px-3 py-1.5 bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Test with Sample Installation ID
                  </button>
                </div>

                {/* Input Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Installation ID (54 digits grouped into 9 boxes of 6 digits):
                  </label>
                  <textarea
                    rows={2}
                    value={installationId}
                    onChange={(e) => {
                      setInstallationId(e.target.value);
                      if (cidResult) setCidResult(null);
                    }}
                    placeholder="e.g. 012345-678901-234567-890123-456789-012345-678901-234567-890123 (or paste raw 54 digits)"
                    className="w-full p-3 font-mono text-xs sm:text-sm bg-white dark:bg-[#202028] border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 select-all"
                  />
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      Digits counted: {installationId.replace(/\D/g, '').length} / 54
                    </span>
                    <button
                      type="button"
                      onClick={() => setInstallationId('')}
                      className="text-neutral-400 hover:text-neutral-600 text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateCid}
                    disabled={installationId.replace(/\D/g, '').length === 0}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate 42-Digit Confirmation ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sample = '012345678901234567890123456789012345678901234567890123';
                      setInstallationId(sample);
                      setCidResult(generateXpConfirmationId(sample));
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    Generate Instant Test Key
                  </button>
                </div>

                {/* CID Result Display */}
                {cidResult && (
                  <div className="mt-4 p-5 bg-white dark:bg-[#202028] rounded-xl border border-emerald-300 dark:border-emerald-800/80 space-y-4 shadow-sm animate-in fade-in">
                    {cidResult.isValid ? (
                      <>
                        <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-950 pb-2">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Confirmation ID Successfully Generated!</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(cidResult.formattedCid);
                              setCopiedCidGroup('all');
                              setTimeout(() => setCopiedCidGroup(null), 2000);
                            }}
                            className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedCidGroup === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCidGroup === 'all' ? 'Copied Full CID!' : 'Copy Full 42-Digits'}</span>
                          </button>
                        </div>

                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Type these 6-digit numbers into the corresponding boxes <strong>A through G</strong> on your Windows XP "Activate Windows by Telephone" screen:
                        </p>

                        {/* Visual Windows XP Boxes A through G */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter, idx) => {
                            const grpVal = cidResult.groups[idx] || '000000';
                            return (
                              <div
                                key={letter}
                                className="p-3 bg-neutral-50 dark:bg-[#17171d] rounded-xl border border-neutral-200 dark:border-neutral-700/80 text-center space-y-1 relative group"
                              >
                                <span className="text-[11px] font-bold text-neutral-400 block uppercase">
                                  Box {letter}
                                </span>
                                <span className="font-mono text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 tracking-wider block">
                                  {grpVal}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(grpVal);
                                    setCopiedCidGroup(idx);
                                    setTimeout(() => setCopiedCidGroup(null), 1800);
                                  }}
                                  className="w-full mt-1 py-0.5 text-[10px] font-semibold text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  {copiedCidGroup === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedCidGroup === idx ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>
                            Once entered, click <strong>Next</strong> on Windows XP. You will be greeted with:
                            <em> "You have successfully activated your copy of Windows."</em>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs">
                        <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Invalid Installation ID</p>
                          <p className="mt-0.5 text-neutral-600 dark:text-neutral-400">{cidResult.error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EVERY WINDOWS XP EDITION PRODUCT KEYS (CATALOG)                    */}
          {/* ========================================================================= */}
          {activeTab === 'keys' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                    Windows XP Genuine Product Keys Catalog
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Volume License Keys (VLK) require no activation. Retail and OEM keys activate via Phone CID Generator.
                  </p>
                </div>
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Filter XP edition, key, or architecture..."
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-[#25252b] border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 max-w-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredEditions.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-neutral-50 dark:bg-[#1c1c24] rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2.5 shadow-2xs hover:border-blue-300 dark:hover:border-blue-800 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              item.channel.includes('Corporate') || item.channel.includes('VLK')
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                            }`}
                          >
                            {item.channel}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded">
                            {item.arch}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {item.kernel}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(item.key, item.id)}
                        className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800/80 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                      >
                        {copiedKeyId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKeyId === item.id ? 'Copied' : 'Copy Key'}</span>
                      </button>
                    </div>

                    <div className="p-2 bg-white dark:bg-[#25252f] rounded-lg border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
                      <code className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 select-all tracking-wider">
                        {item.key}
                      </code>
                      {onSelectKey && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectKey(item.key, item.name);
                            onClose();
                          }}
                          className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline ml-2"
                        >
                          Use in Activator
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1 pt-1 border-t border-neutral-200/60 dark:border-neutral-800">
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">WPA Activation:</span>
                      <span>{item.activationRequired}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ONE-CLICK WPA & REGISTRY SCRIPTS                                   */}
          {/* ========================================================================= */}
          {activeTab === 'scripts' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  One-Click Windows XP Activation & Reset Scripts
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Ready-to-execute batch commands and registry files for Windows XP offline activation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {xpActivationMethods.map((meth) => (
                  <div
                    key={meth.id}
                    className="p-4 bg-neutral-50 dark:bg-[#1c1c24] rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                          {meth.name}
                        </h4>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                          Recommended for: {meth.recommendedFor}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {meth.description}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block">
                        Procedure:
                      </span>
                      <ol className="list-decimal list-inside text-[11px] text-neutral-500 dark:text-neutral-400 space-y-0.5 pl-1">
                        {meth.steps.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ol>
                    </div>

                    {meth.commandScript && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-neutral-500">Command / Script:</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(meth.commandScript!, meth.id)}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKeyId === meth.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKeyId === meth.id ? 'Copied' : 'Copy Script'}</span>
                          </button>
                        </div>
                        <pre className="p-2.5 bg-neutral-900 text-neutral-100 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre-wrap select-all">
                          {meth.commandScript}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: STEP-BY-STEP ACTIVATION GUIDE                                      */}
          {/* ========================================================================= */}
          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  How Windows Product Activation (WPA) Works in Windows XP
                </h3>
                <p>
                  Windows XP was the first consumer Windows release to introduce mandatory product activation.
                  The OS creates a hardware hash from 10 hardware components (NIC MAC address, HDD serial, CPU ID, RAM size, CD-ROM, etc.)
                  and encrypts it inside <code className="font-mono bg-white dark:bg-neutral-800 px-1 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">%SystemRoot%\System32\wpa.dbl</code>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-[#1c1c24] rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm block">
                    Method A: Corporate VLK
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    If you are deploying Windows XP Professional or WinFLP, use a Volume License Key (PID 640).
                    Volume License media has activation completely stripped out from OOBE.
                  </p>
                  <code className="block p-2 bg-neutral-900 text-neutral-100 rounded font-mono text-[11px]">
                    V2C47-MK7JD-3R89F-D2KXW-VPK3J
                  </code>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-[#1c1c24] rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm block">
                    Method B: Phone Activation
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    If running Windows XP Home or Retail, open <code className="font-mono">oobe\msoobe /a</code>, choose Telephone Activation,
                    copy your 54-digit Installation ID, and generate your 42-digit Confirmation ID using Tab 1.
                  </p>
                  <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    100% Genuine & Permanent
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-[#1c1c24] rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm block">
                    Method C: ISO Direct Download
                  </span>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Need the clean official installation image? You can download authentic Windows XP Professional SP3 x86 or x64 ISOs directly in the ISO Download Center.
                  </p>
                  {onOpenIsoCenter && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenIsoCenter('Windows XP');
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Open XP ISO Downloads</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 bg-neutral-50 dark:bg-[#18181e] text-xs shrink-0">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Covers Windows XP Pro, Home, MCE 2005, Tablet PC, Starter, POSReady 2009, & WinFLP.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Close Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
