import { LanguageCode } from './types';

export interface Translations {
  OK: string;
  Cancel: string;
  Refuse: string;
  DonateBtn: string;
  Exit: string;
  UpdateNow: string;
  Ignore: string;
  TitleName: string;
  UpdateTitle: string;
  UpgradeFullVersionWindowsTitle: string;
  RebootlessUpdateTitle: string;
  RebootlessUpdateEnableBtn: string;
  RebootlessUpdateRestoreBtn: string;
  RebootlessUpdateStatus: string;
  RebootlessUpdateStatusEnabled: string;
  RebootlessUpdateStatusDefault: string;
  RebootlessUpdateFailed: string;
  CurrentVersion: string;
  LatestVersion: string;
  Select_target_SKU: string;
  Input_target_SKU: string;
  Auto_Mode: string;
  Manual_Mode: string;
  Activate_Button: string;
  Convert_versions: string;
  Upgrade_full_version: string;
  Rebootless_update_management: string;
  Loading: string;
  Activating: string;
  Complete: string;
  CompleteTitle: string;
  ErrorTitle: string;
  ErrorCode: string;
  SysMsg: string;
  Attention: string;
  System_Edition: string;
  RunInstall_Converting: string;
  RunAct_Activating: string;
  RunInstall_Getting_Key: string;
  RunAct_Getting_Key: string;
  RunInstall_Uninstalling_old_Key: string;
  RunAct_Uninstalling_old_Key: string;
  RunAct_Uninstalling_old_Key_Exp: string;
  RunInstall_Installing_Key: string;
  RunAct_Installing_Key: string;
  RunAct_Getting_edition_code_Exp: string;
  RunAct_Prepare_for_the_next_step_Exp: string;
  RunAct_Writing_old_OS: string;
  RunAct_Getting_free_upgrade_permissions: string;
  RunAct_Cleaning_changes: string;
  RunAct_Getting_digital_license: string;
  RunUpgradeFullVersion_Upgrading: string;
  UpgradeFullVersionWindowsText: string;
  RebootlessUpdateText: string;
  HelpText: string;
  DonateTextConverted: string;
  DonateTextActivated: string;
  DonateTextWillActivated: string;
  UpdateText: string;
  ThemeSwitchToolTip: string;
  ThemeMode_System: string;
  ThemeMode_Dark: string;
  ThemeMode_Light: string;
  LanguageName: string;
  LangSwitchToolTip: string;
  DonateToolTip: string;
  HelpToolTip: string;
  LogsToolTip: string;
  Family_All: string;
  Family_Win10_11: string;
  Family_LTSC: string;
  Family_IoT: string;
  Family_Server: string;
  Family_Win8: string;
  Family_Win7: string;
  Filter_Family: string;
  Filter_Search: string;
  Method_HWID: string;
  Method_KMS38: string;
  Method_KMS: string;
  Method_SLIC: string;
  Method_Legacy: string;
  Method_AVMA: string;
  RunAct_Installing_SLIC: string;
  RunAct_Injecting_SLP: string;
  RunAct_KMS38_Ticket: string;
  RunAct_KMS_Connecting: string;
  RunAct_AVMA_Binding: string;
  RunAct_IoT_Lockdown: string;
  Simulated_Environment: string;
  Host_OS_Selector: string;
  Check_Compatibility: string;
  SLMGR_Status_Title: string;
  Errors: Record<string, string>;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    OK: 'OK',
    Cancel: 'Cancel',
    Refuse: 'Refuse',
    DonateBtn: 'Donate',
    Exit: 'Exit',
    UpdateNow: 'Update Now',
    Ignore: 'Ignore',
    TitleName: 'CMWTAT Digital Edition',
    UpdateTitle: 'A new version available!',
    UpgradeFullVersionWindowsTitle: 'Upgrade to full version of Windows',
    RebootlessUpdateTitle: 'Manage hotpatch entitlement',
    RebootlessUpdateEnableBtn: 'Enable entitlement',
    RebootlessUpdateRestoreBtn: 'Restore default',
    RebootlessUpdateStatus: 'Current status: {0}',
    RebootlessUpdateStatusEnabled: 'Entitlement enabled',
    RebootlessUpdateStatusDefault: 'Determined by subscription (default)',
    RebootlessUpdateFailed: 'Operation failed. Please make sure this app is running as administrator.',
    CurrentVersion: 'Current Version',
    LatestVersion: 'Latest Version',
    Select_target_SKU: 'Select target SKU (defaults to current SKU)',
    Input_target_SKU: 'Enter target SKU product key',
    Auto_Mode: 'Auto Mode',
    Manual_Mode: 'Manual Mode',
    Activate_Button: 'Activate',
    Convert_versions: 'Convert versions (Install Key without Activate)',
    Upgrade_full_version: 'Upgrade to full version of Windows',
    Rebootless_update_management: 'Manage hotpatch entitlement',
    Loading: 'Loading',
    Activating: 'Activating',
    Complete: 'Complete',
    CompleteTitle: 'Complete',
    ErrorTitle: 'Error',
    ErrorCode: 'Code: ',
    SysMsg: 'System return:',
    Attention: 'Attention',
    System_Edition: 'System edition',
    RunInstall_Converting: 'Converting',
    RunAct_Activating: 'Activating',
    RunInstall_Getting_Key: 'Getting Key via Internet',
    RunAct_Getting_Key: 'Getting Key via Internet',
    RunInstall_Uninstalling_old_Key: 'Uninstalling old Key',
    RunAct_Uninstalling_old_Key: 'Uninstalling old Key',
    RunAct_Uninstalling_old_Key_Exp: 'Uninstalling old Key (Experimental)',
    RunInstall_Installing_Key: 'Installing Key',
    RunAct_Installing_Key: 'Installing Key',
    RunAct_Getting_edition_code_Exp: 'Getting edition code (Experimental)',
    RunAct_Prepare_for_the_next_step_Exp: 'Prepare for the next step (Experimental)',
    RunAct_Writing_old_OS: 'Writing feature of old Windows version',
    RunAct_Getting_free_upgrade_permissions: 'Getting free upgrade permissions',
    RunAct_Cleaning_changes: 'Cleaning changes',
    RunAct_Getting_digital_license: 'Getting digital license',
    RunUpgradeFullVersion_Upgrading: 'Upgrading',
    UpgradeFullVersionWindowsText:
      'You are currently using the core version of Windows, you can use this feature to upgrade to the full version of Windows.\n(If the operation does not respond it may be that the current version does not support the upgrade or is in the process of upgrading)\n\nNote:\nThis operation is not reversible and once the upgrade is complete you will not be able to roll back to the core version of Windows!\n\nAre you sure you want to perform an upgrade?',
    RebootlessUpdateText:
      'Windows hotpatch update is a special entitlement for users with a Windows subscription license.\n\nNormally, Windows monthly updates require restarting the operating system to complete.\nOnce hotpatching is enabled, Windows can install updates without restarting the system.\n\nThe following cases are excluded:\n• Baseline updates (a quarterly baseline update is usually pushed every 3 months)\n• The current Windows is not on the latest baseline version\n• VBS (Virtualization-based Security) is turned off\n• Running a Windows Insider preview build\n• ARM64 devices that use CHPE without having disabled it',
    HelpText:
      'This application now supports the use of console args to startup!\n\n-a\t--auto\t\tAuto activate.\n-h\t--hide\t\tRun with hide mode (Only be worked with -auto).\n-e\t--expact\tExperimental activation.\n-l\t--log\t\tOutput log to file.\n-?\t--help\t\tShow this help Dialog.',
    DonateTextConverted: 'Congratulation!\n\nWindows has been successfully converted.',
    DonateTextActivated: 'Congratulation!\n\nWindows has been successfully activated.',
    DonateTextWillActivated:
      'Congratulation!\n\nWindows is ready to activate.\nHowever, it seems that Windows cannot connect to the Microsoft Activation Server.\nYour system will be activated automatically the next time the server is connected.',
    UpdateText:
      'We found a new version for CloudMoe Windows 10+ Activation Toolkit Digital Edition.\nPlease update to the latest version to make sure it works.',
    ThemeSwitchToolTip: 'Switch theme (Current: {0})',
    ThemeMode_System: 'System default',
    ThemeMode_Dark: 'Dark',
    ThemeMode_Light: 'Light',
    LanguageName: 'English',
    LangSwitchToolTip: 'Language',
    DonateToolTip: 'Donate',
    HelpToolTip: 'Help & Console Parameters',
    LogsToolTip: 'View Diagnostic Logs',
    Family_All: 'All Editions',
    Family_Win10_11: 'Windows 10 / 11',
    Family_LTSC: 'Windows 10 / 11 LTSC & LTSB',
    Family_IoT: 'Windows IoT & Embedded',
    Family_Server: 'Windows Server (2005 - 2025)',
    Family_Win8: 'Windows 8 / 8.1',
    Family_Win7: 'Windows 7',
    Filter_Family: 'OS Family',
    Filter_Search: 'Search edition or SKU...',
    Method_HWID: 'HWID Digital License',
    Method_KMS38: 'KMS38 (Year 2038)',
    Method_KMS: 'KMS / GVLK',
    Method_SLIC: 'OEM SLIC 2.1 Loader',
    Method_Legacy: 'Legacy Volume PID',
    Method_AVMA: 'Hyper-V AVMA Guest',
    RunAct_Installing_SLIC: 'Installing SLIC 2.1 OEM Certificate',
    RunAct_Injecting_SLP: 'Injecting BIOS SLIC & SLP 2.1 Token',
    RunAct_KMS38_Ticket: 'Generating KMS38 Ticket (Valid to 2038)',
    RunAct_KMS_Connecting: 'Connecting to KMS Server & Binding GVLK',
    RunAct_AVMA_Binding: 'Binding Hyper-V Automatic VM Activation Key',
    RunAct_IoT_Lockdown: 'Checking IoT Write Filters & Embedded Lockdown',
    Simulated_Environment: 'Host Environment',
    Host_OS_Selector: 'Simulate Host Operating System',
    Check_Compatibility: 'System Compatibility & SLMGR Status',
    SLMGR_Status_Title: 'Software Licensing Status (slmgr.vbs /dli)',
    Errors: {
      '-0': 'Activate Windows requires a network to get the product key :)',
      '-1': 'Cannot uninstall old key. :(',
      '-1.1': 'Cannot install key, maybe you chose or entered an incorrect version. :(',
      '-1.2': 'Cannot get edition code. :(',
      '-2': 'Cannot install key, maybe you chose or entered an incorrect version. :(',
      '-3': 'Time out, maybe you chose or entered an incorrect version. :(',
      '-4': 'Activation Failed. :(\nMaybe:\n1. This edition/version of Windows does not support digital license activation.\n2. Unable to connect to Microsoft Windows Activation Server.\n3. Other unexpected problems.\n\nYou can try to wait a minute or try again later.',
    },
  },
  zh: {
    OK: '好',
    Cancel: '取消',
    Refuse: '丑拒',
    DonateBtn: '请作者喝咖啡',
    Exit: '退出',
    UpdateNow: '立即更新',
    Ignore: '忽略',
    TitleName: '云萌 Windows 10+ 数字权利激活工具',
    UpdateTitle: '新版本可用！',
    UpgradeFullVersionWindowsTitle: '升级到完整版 Windows',
    RebootlessUpdateTitle: '热补丁权益管理',
    RebootlessUpdateEnableBtn: '开启权益',
    RebootlessUpdateRestoreBtn: '恢复默认',
    RebootlessUpdateStatus: '当前状态：{0}',
    RebootlessUpdateStatusEnabled: '已开启权益',
    RebootlessUpdateStatusDefault: '根据订阅决定（默认值）',
    RebootlessUpdateFailed: '操作失败，请确认是否以管理员身份运行。',
    CurrentVersion: '当前版本',
    LatestVersion: '最新版本',
    Select_target_SKU: '选择目标 SKU (默认值为当前 SKU)',
    Input_target_SKU: '输入目标 SKU 序列号',
    Auto_Mode: '自动模式',
    Manual_Mode: '手动模式',
    Activate_Button: '激活',
    Convert_versions: '版本无缝转换 (安装产品密钥而不激活)',
    Upgrade_full_version: '升级到完整版 Windows',
    Rebootless_update_management: '热补丁权益管理',
    Loading: '载入中',
    Activating: '激活中',
    Complete: '完成',
    CompleteTitle: '完成',
    ErrorTitle: '错误',
    ErrorCode: '代码：',
    SysMsg: '系统返回：',
    Attention: '注意',
    System_Edition: '系统版本',
    RunInstall_Converting: '转换中',
    RunAct_Activating: '激活中',
    RunInstall_Getting_Key: '通过网络获取密钥',
    RunAct_Getting_Key: '通过网络获取密钥',
    RunInstall_Uninstalling_old_Key: '卸载旧密钥',
    RunAct_Uninstalling_old_Key: '卸载旧密钥',
    RunAct_Uninstalling_old_Key_Exp: '卸载旧密钥（实验性）',
    RunInstall_Installing_Key: '安装密钥',
    RunAct_Installing_Key: '安装密钥',
    RunAct_Getting_edition_code_Exp: '获取版本代码（实验性）',
    RunAct_Prepare_for_the_next_step_Exp: '准备下一步（实验性）',
    RunAct_Writing_old_OS: '写入旧版本 Windows 特性',
    RunAct_Getting_free_upgrade_permissions: '获取免费升级权限',
    RunAct_Cleaning_changes: '清理临时修改',
    RunAct_Getting_digital_license: '获取数字权利凭证',
    RunUpgradeFullVersion_Upgrading: '升级中',
    UpgradeFullVersionWindowsText:
      '您当前使用的是 Windows 核心版，您可以使用此功能升级到完整版 Windows。\n（如果操作没有反应可能是当前版本不支持升级或正在升级过程中）\n\n注意：\n此操作不可逆，一旦升级完成您将无法回退到核心版 Windows！\n\n您确定要执行升级吗？',
    RebootlessUpdateText:
      'Windows 热补丁更新是为拥有 Windows 订阅许可证的用户提供的一项特殊权益。\n\n通常情况下，Windows 每月的质量更新需要重启操作系统才能完成。\n开启热补丁后，Windows 可以在不重启系统的情况下完成更新安装。\n\n以下情况除外：\n• 基线更新（通常每 3 个月推送一次季度基线更新）\n• 当前 Windows 不处于最新的基线版本\n• 关闭了基于虚拟化的安全性 (VBS)\n• 运行 Windows Insider 预览体验版本\n• 使用 CHPE 且未禁用的 ARM64 设备',
    HelpText:
      '本程序现已支持使用控制台启动参数！\n\n-a\t--auto\t\t自动激活。\n-h\t--hide\t\t静默模式运行（仅与 -auto 配合使用）。\n-e\t--expact\t实验性方案激活。\n-l\t--log\t\t输出日志到文件。\n-?\t--help\t\t显示此帮助对话框。',
    DonateTextConverted: '恭喜！\n\nWindows 版本已成功转换。',
    DonateTextActivated: '恭喜！\n\nWindows 已成功激活并获取数字权利。',
    DonateTextWillActivated:
      '恭喜！\n\nWindows 已做好激活准备。\n但是当前似乎无法连接到微软激活服务器，下次联网时系统将自动激活。',
    UpdateText: '检测到云萌 Windows 10+ 数字权利激活工具新版本。\n请更新到最新版本以确保正常工作。',
    ThemeSwitchToolTip: '切换主题（当前：{0}）',
    ThemeMode_System: '跟随系统',
    ThemeMode_Dark: '深色',
    ThemeMode_Light: '浅色',
    LanguageName: '简体中文',
    LangSwitchToolTip: '切换语言',
    DonateToolTip: '请作者喝咖啡',
    HelpToolTip: '帮助与启动参数',
    LogsToolTip: '查看运行日志',
    Family_All: '所有版本',
    Family_Win10_11: 'Windows 10 / 11',
    Family_LTSC: 'Windows 10 / 11 LTSC & LTSB',
    Family_IoT: 'Windows IoT / 嵌入式版本',
    Family_Server: 'Windows Server (2005 - 2025)',
    Family_Win8: 'Windows 8 / 8.1',
    Family_Win7: 'Windows 7',
    Filter_Family: '系统系列',
    Filter_Search: '搜索系统版本或 SKU...',
    Method_HWID: 'HWID 数字权利',
    Method_KMS38: 'KMS38 (有效期至 2038)',
    Method_KMS: 'KMS / GVLK',
    Method_SLIC: 'OEM SLIC 2.1 证书激活',
    Method_Legacy: '传统大客户 Volume PID',
    Method_AVMA: 'Hyper-V AVMA 虚机激活',
    RunAct_Installing_SLIC: '安装 SLIC 2.1 OEM 证书',
    RunAct_Injecting_SLP: '仿真 BIOS SLIC 与 OEM:SLP 令牌',
    RunAct_KMS38_Ticket: '生成 KMS38 票据 (授权至 2038 年)',
    RunAct_KMS_Connecting: '连接 KMS 服务器并绑定 GVLK 密钥',
    RunAct_AVMA_Binding: '绑定 Hyper-V 虚拟机自动激活密钥 (AVMA)',
    RunAct_IoT_Lockdown: '检查统一写入筛选器 (UWF) 与 IoT 嵌入式策略',
    Simulated_Environment: '宿主环境',
    Host_OS_Selector: '模拟宿主操作系统环境',
    Check_Compatibility: '检测系统兼容性与授权状态',
    SLMGR_Status_Title: '软件授权许可状态诊断 (slmgr.vbs /dli)',
    Errors: {
      '-0': '激活 Windows 需要网络连接以获取产品密钥 :)',
      '-1': '无法卸载旧密钥 :(',
      '-1.1': '无法安装密钥，可能选择或输入了不适用的版本 :(',
      '-1.2': '无法获取版本代号 :(',
      '-2': '无法安装密钥，可能没有选择或输入正确的版本 :(',
      '-3': '操作超时，可能没有选择或输入正确的版本 :(',
      '-4': '激活失败 :(\n可能原因：\n1. 当前 Windows 版本不支持数字权利激活。\n2. 无法连接到微软激活服务器。\n3. 其他未知问题。\n\n建议稍候重试。',
    },
  },
  fr: {
    OK: 'Ok',
    Cancel: 'Annuler',
    Refuse: 'Refuser',
    DonateBtn: 'Faire un don',
    Exit: 'Sortir',
    UpdateNow: 'Mettre à jour maintenant',
    Ignore: 'Ignorer',
    TitleName: 'CMWTAT Edition numérique',
    UpdateTitle: 'Une nouvelle version disponible !',
    UpgradeFullVersionWindowsTitle: 'Passer à la version complète de Windows',
    RebootlessUpdateTitle: 'Gérer les droits de correctifs à chaud',
    RebootlessUpdateEnableBtn: 'Activer les droits',
    RebootlessUpdateRestoreBtn: 'Restaurer par défaut',
    RebootlessUpdateStatus: 'État actuel : {0}',
    RebootlessUpdateStatusEnabled: 'Droits activés',
    RebootlessUpdateStatusDefault: "Déterminé par l'abonnement (par défaut)",
    RebootlessUpdateFailed: "Échec de l'opération. Veuillez vérifier que l'application est exécutée en tant qu'administrateur.",
    CurrentVersion: 'Version actuelle',
    LatestVersion: 'Dernière version',
    Select_target_SKU: 'Sélectionnez le SKU cible (actuel par défaut)',
    Input_target_SKU: 'Entrez la clé de produit SKU cible',
    Auto_Mode: 'Mode automatique',
    Manual_Mode: 'Mode manuel',
    Activate_Button: 'Activer',
    Convert_versions: 'Convertir les versions (installer la clé sans activer)',
    Upgrade_full_version: 'Passer à la version complète de Windows',
    Rebootless_update_management: 'Gérer les droits de correctifs à chaud',
    Loading: 'Chargement',
    Activating: 'Activation',
    Complete: 'Terminé',
    CompleteTitle: 'Terminé',
    ErrorTitle: 'Erreur',
    ErrorCode: 'Code : ',
    SysMsg: 'Retour système :',
    Attention: 'Attention',
    System_Edition: 'Édition du système',
    RunInstall_Converting: 'Conversion en cours',
    RunAct_Activating: 'Activation en cours',
    RunInstall_Getting_Key: 'Obtention de la clé via Internet',
    RunAct_Getting_Key: 'Obtention de la clé via Internet',
    RunInstall_Uninstalling_old_Key: "Désinstallation de l'ancienne clé",
    RunAct_Uninstalling_old_Key: "Désinstallation de l'ancienne clé",
    RunAct_Uninstalling_old_Key_Exp: "Désinstallation de l'ancienne clé (Expérimental)",
    RunInstall_Installing_Key: 'Installation de la clé',
    RunAct_Installing_Key: 'Installation de la clé',
    RunAct_Getting_edition_code_Exp: "Obtention du code d'édition (Expérimental)",
    RunAct_Prepare_for_the_next_step_Exp: "Préparation pour l'étape suivante (Expérimental)",
    RunAct_Writing_old_OS: "Écriture des caractéristiques de l'ancienne version",
    RunAct_Getting_free_upgrade_permissions: 'Obtention des autorisations de mise à niveau gratuite',
    RunAct_Cleaning_changes: 'Nettoyage des modifications',
    RunAct_Getting_digital_license: 'Obtention de la licence numérique',
    RunUpgradeFullVersion_Upgrading: 'Mise à niveau en cours',
    UpgradeFullVersionWindowsText:
      'Vous utilisez actuellement la version Core de Windows, vous pouvez utiliser cette fonction pour passer à la version complète de Windows.\n\nRemarque :\nCette opération est irréversible !\n\nÊtes-vous sûr de vouloir effectuer la mise à niveau ?',
    RebootlessUpdateText:
      'La mise à jour de correctifs à chaud Windows est un droit spécial pour les utilisateurs disposant d’une licence d’abonnement Windows.\nElle permet d’installer les mises à jour sans redémarrage.',
    HelpText:
      'Cette application prend en charge les arguments de démarrage en ligne de commande :\n\n-a\t--auto\t\tActivation automatique.\n-h\t--hide\t\tExécuter en mode masqué.\n-e\t--expact\tSchémas expérimentaux.\n-l\t--log\t\tEnregistrer les journaux dans un fichier.\n-?\t--help\t\tAfficher cette boîte de dialogue d’aide.',
    DonateTextConverted: 'Félicitations !\n\nWindows a été converti avec succès.',
    DonateTextActivated: 'Félicitations !\n\nWindows a été activé avec succès.',
    DonateTextWillActivated: 'Félicitations !\n\nWindows est prêt à être activé lors de la prochaine connexion aux serveurs Microsoft.',
    UpdateText: 'Une nouvelle version de CloudMoe Windows Toolkit est disponible.',
    ThemeSwitchToolTip: 'Changer de thème (Actuel : {0})',
    ThemeMode_System: 'Système par défaut',
    ThemeMode_Dark: 'Sombre',
    ThemeMode_Light: 'Clair',
    LanguageName: 'Français',
    LangSwitchToolTip: 'Langue',
    DonateToolTip: 'Faire un don',
    HelpToolTip: 'Aide et paramètres',
    LogsToolTip: 'Journaux de diagnostic',
    Family_All: 'Toutes les éditions',
    Family_Win10_11: 'Windows 10 / 11',
    Family_LTSC: 'Windows 10 / 11 LTSC & LTSB',
    Family_IoT: 'Windows IoT & Embarqué',
    Family_Server: 'Windows Server (2005 - 2025)',
    Family_Win8: 'Windows 8 / 8.1',
    Family_Win7: 'Windows 7',
    Filter_Family: 'Famille d’OS',
    Filter_Search: 'Rechercher une édition ou SKU...',
    Method_HWID: 'Licence numérique HWID',
    Method_KMS38: 'KMS38 (Jusqu’en 2038)',
    Method_KMS: 'KMS / GVLK',
    Method_SLIC: 'Certificat OEM SLIC 2.1',
    Method_Legacy: 'Volume PID hérité',
    Method_AVMA: 'Hyper-V AVMA Virtuel',
    RunAct_Installing_SLIC: 'Installation du certificat OEM SLIC 2.1',
    RunAct_Injecting_SLP: 'Simulation BIOS SLIC et jeton SLP',
    RunAct_KMS38_Ticket: 'Génération du ticket KMS38 (Valable jusqu’en 2038)',
    RunAct_KMS_Connecting: 'Connexion au serveur KMS et liaison GVLK',
    RunAct_AVMA_Binding: 'Liaison de la clé d’activation auto Hyper-V AVMA',
    RunAct_IoT_Lockdown: 'Vérification du filtre UWF et stratégies IoT',
    Simulated_Environment: 'Environnement hôte',
    Host_OS_Selector: 'Simuler le système d’exploitation hôte',
    Check_Compatibility: 'Compatibilité système & statut SLMGR',
    SLMGR_Status_Title: 'État des licences logicielles (slmgr.vbs /dli)',
    Errors: {
      '-0': 'L’activation de Windows nécessite un réseau pour obtenir la clé :)',
      '-1': 'Impossible de désinstaller l’ancienne clé :(',
      '-1.1': 'Impossible d’installer la clé :(',
      '-1.2': 'Impossible d’obtenir le code d’édition :(',
      '-2': 'Impossible d’installer la clé :(',
      '-3': 'Délai d’attente dépassé :(',
      '-4': 'Échec de l’activation :(',
    },
  },
  ja: {
    OK: 'はい',
    Cancel: 'キャンセル',
    Refuse: 'リフューズ',
    DonateBtn: '寄付',
    Exit: '終了',
    UpdateNow: '今すぐアップデート',
    Ignore: '無視する',
    TitleName: '雲萌 10+ デジタルライセンス認証アプリ',
    UpdateTitle: '新しいバージョンがあります！',
    UpgradeFullVersionWindowsTitle: '完全版 Windows へアップグレード',
    RebootlessUpdateTitle: 'ホットパッチ特典の管理',
    RebootlessUpdateEnableBtn: '特典を有効にする',
    RebootlessUpdateRestoreBtn: '既定値に戻す',
    RebootlessUpdateStatus: '現在の状態：{0}',
    RebootlessUpdateStatusEnabled: '特典が有効',
    RebootlessUpdateStatusDefault: 'サブスクリプションに従う（既定値）',
    RebootlessUpdateFailed: '操作に失敗しました。管理者として実行しているか確認してください。',
    CurrentVersion: 'バージョン',
    LatestVersion: 'ラストバージョン',
    Select_target_SKU: '対象 SKU を選択（既定値は現在の SKU）',
    Input_target_SKU: '対象 SKU のプロダクト キーを入力',
    Auto_Mode: 'オートモード',
    Manual_Mode: 'マニュアルモード',
    Activate_Button: '認証',
    Convert_versions: 'エディション変換 (キーをインストールするが、認証しません)',
    Upgrade_full_version: '完全版 Windows へアップグレード',
    Rebootless_update_management: 'ホットパッチ特典の管理',
    Loading: 'ローディング',
    Activating: '認証中',
    Complete: 'コンプリート',
    CompleteTitle: '完了',
    ErrorTitle: 'エラー',
    ErrorCode: 'コード: ',
    SysMsg: 'システム出力:',
    Attention: '注意',
    System_Edition: 'システムエディション',
    RunInstall_Converting: '変換中',
    RunAct_Activating: '認証中',
    RunInstall_Getting_Key: 'インターネット経由でキーを取得中',
    RunAct_Getting_Key: 'インターネット経由でキーを取得中',
    RunInstall_Uninstalling_old_Key: '古いキーをアンインストール中',
    RunAct_Uninstalling_old_Key: '古いキーをアンインストール中',
    RunAct_Uninstalling_old_Key_Exp: '古いキーをアンインストール中（実験的）',
    RunInstall_Installing_Key: 'キーをインストール中',
    RunAct_Installing_Key: 'キーをインストール中',
    RunAct_Getting_edition_code_Exp: 'エディションコードを取得中（実験的）',
    RunAct_Prepare_for_the_next_step_Exp: '次のステップの準備中（実験的）',
    RunAct_Writing_old_OS: '旧 Windows の機能を書き込み中',
    RunAct_Getting_free_upgrade_permissions: '無料アップグレード権限を取得中',
    RunAct_Cleaning_changes: '一時変更をクリーンアップ中',
    RunAct_Getting_digital_license: 'デジタルライセンスを取得中',
    RunUpgradeFullVersion_Upgrading: 'アップグレード中',
    UpgradeFullVersionWindowsText:
      '現在 Windows のコア版を使用しています。この機能を使用して完全版 Windows にアップグレードできます。\n\n注意:\nこの操作は元に戻せません！\nアップグレードを実行しますか？',
    RebootlessUpdateText:
      'Windows ホットパッチ更新は Windows サブスクリプション ライセンスのユーザー向け特典です。\n再起動なしで月例更新プログラムを適用できます。',
    HelpText:
      'このアプリケーションは起動引数をサポートしています！\n\n-a\t--auto\t\t自動認証。\n-h\t--hide\t\t非表示モードで実行。\n-e\t--expact\t実験的認証。\n-l\t--log\t\tログファイルを出力。\n-?\t--help\t\tこのヘルプを表示。',
    DonateTextConverted: 'おめでとうございます！\n\nWindows のエディションが正常に変換されました。',
    DonateTextActivated: 'おめでとうございます！\n\nWindows が正常にライセンス認証されました。',
    DonateTextWillActivated: 'おめでとうございます！\n\nWindows は認証準備が完了しました。次回 Microsoft サーバーに接続した際に自動認証されます。',
    UpdateText: '新しいバージョンが見つかりました。',
    ThemeSwitchToolTip: 'テーマ切り替え（現在: {0}）',
    ThemeMode_System: 'システム既定',
    ThemeMode_Dark: 'ダーク',
    ThemeMode_Light: 'ライト',
    LanguageName: '日本語',
    LangSwitchToolTip: '言語',
    DonateToolTip: '寄付',
    HelpToolTip: 'ヘルプとコマンドライン引数',
    LogsToolTip: '診断ログの表示',
    Family_All: 'すべてのエディション',
    Family_Win10_11: 'Windows 10 / 11',
    Family_LTSC: 'Windows 10 / 11 LTSC & LTSB',
    Family_IoT: 'Windows IoT & 組み込み',
    Family_Server: 'Windows Server (2005 - 2025)',
    Family_Win8: 'Windows 8 / 8.1',
    Family_Win7: 'Windows 7',
    Filter_Family: 'OS ファミリー',
    Filter_Search: 'エディションまたは SKU を検索...',
    Method_HWID: 'HWID デジタルライセンス',
    Method_KMS38: 'KMS38 (2038年まで有効)',
    Method_KMS: 'KMS / GVLK',
    Method_SLIC: 'OEM SLIC 2.1 証明書',
    Method_Legacy: 'レガシー ボリューム PID',
    Method_AVMA: 'Hyper-V AVMA 自動認証',
    RunAct_Installing_SLIC: 'SLIC 2.1 OEM 証明書をインストール中',
    RunAct_Injecting_SLP: 'BIOS SLIC および SLP トークンを適用中',
    RunAct_KMS38_Ticket: 'KMS38 チケットを生成中 (2038年まで)',
    RunAct_KMS_Connecting: 'KMS サーバーに接続し GVLK をバインド中',
    RunAct_AVMA_Binding: 'Hyper-V 仮想マシン自動アクティベーションをバインド中',
    RunAct_IoT_Lockdown: 'IoT 統合書き込みフィルター (UWF) ポリシーを確認中',
    Simulated_Environment: 'シミュレート環境',
    Host_OS_Selector: 'ホスト OS 環境のシミュレーション',
    Check_Compatibility: 'システム互換性とライセンス状態',
    SLMGR_Status_Title: 'ソフトウェアライセンス状態 (slmgr.vbs /dli)',
    Errors: {
      '-0': 'Windows 認証にはプロダクトキー取得のためのインターネット接続が必要です :)',
      '-1': '古いキーをアンインストールできません :(',
      '-1.1': 'キーをインストールできません :(',
      '-1.2': 'エディションコードを取得できません :(',
      '-2': 'キーをインストールできません :(',
      '-3': 'タイムアウトしました :(',
      '-4': '認証に失敗しました :(',
    },
  },
  ru: {
    OK: 'ОК',
    Cancel: 'Отменить',
    Refuse: 'Отказаться',
    DonateBtn: 'Поддержать',
    Exit: 'Выйти',
    UpdateNow: 'Обновить сейчас',
    Ignore: 'Игнорировать',
    TitleName: 'CMWTAT Digital Edition',
    UpdateTitle: 'Доступна новая версия!',
    UpgradeFullVersionWindowsTitle: 'Перейти на полную версию Windows',
    RebootlessUpdateTitle: 'Управление правами на горячие исправления',
    RebootlessUpdateEnableBtn: 'Включить права',
    RebootlessUpdateRestoreBtn: 'Восстановить по умолчанию',
    RebootlessUpdateStatus: 'Текущее состояние: {0}',
    RebootlessUpdateStatusEnabled: 'Права включены',
    RebootlessUpdateStatusDefault: 'Определяется подпиской (по умолчанию)',
    RebootlessUpdateFailed: 'Не удалось выполнить операцию. Убедитесь, что программа запущена от имени администратора.',
    CurrentVersion: 'Текущая версия',
    LatestVersion: 'Последняя версия',
    Select_target_SKU: 'Выберите целевой SKU (по умолчанию текущий)',
    Input_target_SKU: 'Введите ключ продукта целевого SKU',
    Auto_Mode: 'Авто режим',
    Manual_Mode: 'Ручной режим',
    Activate_Button: 'Активировать',
    Convert_versions: 'Конвертировать выпуск (установить ключ без активации)',
    Upgrade_full_version: 'Перейти на полную версию Windows',
    Rebootless_update_management: 'Управление правами на горячие исправления',
    Loading: 'Загрузка',
    Activating: 'Активация',
    Complete: 'Завершено',
    CompleteTitle: 'Завершено',
    ErrorTitle: 'Ошибка',
    ErrorCode: 'Код: ',
    SysMsg: 'Ответ системы:',
    Attention: 'Внимание',
    System_Edition: 'Редакция системы',
    RunInstall_Converting: 'Конвертация',
    RunAct_Activating: 'Активация',
    RunInstall_Getting_Key: 'Получение ключа через Интернет',
    RunAct_Getting_Key: 'Получение ключа через Интернет',
    RunInstall_Uninstalling_old_Key: 'Удаление старого ключа',
    RunAct_Uninstalling_old_Key: 'Удаление старого ключа',
    RunAct_Uninstalling_old_Key_Exp: 'Удаление старого ключа (Экспериментально)',
    RunInstall_Installing_Key: 'Установка ключа',
    RunAct_Installing_Key: 'Установка ключа',
    RunAct_Getting_edition_code_Exp: 'Получение кода редакции (Экспериментально)',
    RunAct_Prepare_for_the_next_step_Exp: 'Подготовка к следующему шагу (Экспериментально)',
    RunAct_Writing_old_OS: 'Запись свойств старой версии Windows',
    RunAct_Getting_free_upgrade_permissions: 'Получение разрешений на бесплатное обновление',
    RunAct_Cleaning_changes: 'Очистка временных изменений',
    RunAct_Getting_digital_license: 'Получение цифровой лицензии',
    RunUpgradeFullVersion_Upgrading: 'Обновление',
    UpgradeFullVersionWindowsText:
      'Вы используете базовую версию Windows. С помощью этой функции вы можете перейти на полную версию Windows.\n\nВнимание:\nЭта операция необратима!\nВы уверены, что хотите выполнить обновление?',
    RebootlessUpdateText:
      'Горячие исправления Windows — специальное право для пользователей с лицензией по подписке.\nОно позволяет устанавливать обновления без перезагрузки системы.',
    HelpText:
      'Программа поддерживает параметры запуска из командной строки:\n\n-a\t--auto\t\tАвтоматическая активация.\n-h\t--hide\t\tСкрытый режим.\n-e\t--expact\tЭкспериментальная активация.\n-l\t--log\t\tЗапись журнала в файл.\n-?\t--help\t\tПоказать эту справку.',
    DonateTextConverted: 'Поздравляем!\n\nРедакция Windows успешно изменена.',
    DonateTextActivated: 'Поздравляем!\n\nWindows успешно активирована цифровой лицензией.',
    DonateTextWillActivated: 'Поздравляем!\n\nWindows готова к активации. Активация произойдет при следующем подключении к серверам Microsoft.',
    UpdateText: 'Найдена новая версия CloudMoe Windows Toolkit.',
    ThemeSwitchToolTip: 'Сменить тему (Текущая: {0})',
    ThemeMode_System: 'По умолчанию',
    ThemeMode_Dark: 'Темная',
    ThemeMode_Light: 'Светлая',
    LanguageName: 'Русский',
    LangSwitchToolTip: 'Язык',
    DonateToolTip: 'Поддержать',
    HelpToolTip: 'Справка и параметры',
    LogsToolTip: 'Журналы диагностики',
    Family_All: 'Все редакции',
    Family_Win10_11: 'Windows 10 / 11',
    Family_LTSC: 'Windows 10 / 11 LTSC & LTSB',
    Family_IoT: 'Windows IoT и Embedded',
    Family_Server: 'Windows Server (2005 - 2025)',
    Family_Win8: 'Windows 8 / 8.1',
    Family_Win7: 'Windows 7',
    Filter_Family: 'Семейство ОС',
    Filter_Search: 'Поиск редакции или SKU...',
    Method_HWID: 'Цифровая лицензия HWID',
    Method_KMS38: 'KMS38 (до 2038 года)',
    Method_KMS: 'KMS / GVLK',
    Method_SLIC: 'Сертификат OEM SLIC 2.1',
    Method_Legacy: 'Устаревший Volume PID',
    Method_AVMA: 'Hyper-V AVMA Автоактивация',
    RunAct_Installing_SLIC: 'Установка сертификата OEM SLIC 2.1',
    RunAct_Injecting_SLP: 'Эмуляция BIOS SLIC и токена OEM:SLP',
    RunAct_KMS38_Ticket: 'Генерация тикета KMS38 (до 2038 года)',
    RunAct_KMS_Connecting: 'Подключение к KMS серверу и привязка GVLK',
    RunAct_AVMA_Binding: 'Привязка ключа автоматической активации ВМ (Hyper-V AVMA)',
    RunAct_IoT_Lockdown: 'Проверка фильтра UWF и ограничений IoT',
    Simulated_Environment: 'Среда хоста',
    Host_OS_Selector: 'Симуляция операционной системы хоста',
    Check_Compatibility: 'Проверить совместимость и статус SLMGR',
    SLMGR_Status_Title: 'Состояние лицензирования системы (slmgr.vbs /dli)',
    Errors: {
      '-0': 'Для активации требуется подключение к сети :)',
      '-1': 'Не удалось удалить старый ключ :(',
      '-1.1': 'Не удалось установить ключ :(',
      '-1.2': 'Не удалось получить код редакции :(',
      '-2': 'Не удалось установить ключ :(',
      '-3': 'Время ожидания истекло :(',
      '-4': 'Активация не удалась :(',
    },
  },
};
