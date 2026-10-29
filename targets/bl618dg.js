/* BL618DG target definition, mirroring bflb_flash/targets/__init__.py. */
(function (root, factory) {
  "use strict";
  const isNode = typeof module !== "undefined" && module.exports;
  const common = isNode ? require("./common.js") : root.BflbFlashTargetCommon;
  const api = factory(common);
  root.BflbFlashTargetBL618DG = api;
  if (isNode) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function (common) {
  "use strict";

  const CONFIG = common.uartConfig({ chip: "bl618dg", flashClock: 0x43, flashClockDelay: 1 });
  const VERSION_IDS = Object.freeze({
    "01d01606": "a0",
    "02d01606": "a1",
    "03d01606": "a2",
  });

  function bytesToHex(bytes) {
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  }

  function detectVersion(bootInfo) {
    const id = bytesToHex(bootInfo.slice(0, 4));
    const version = VERSION_IDS[id];
    if (!version) throw new Error(`不支持的 BL618DG BootROM，芯片标识为 0x${id || "????????"}`);
    return version;
  }

  function flashPinFromBootInfo(bootInfo) {
    if (bootInfo.length < 12) throw new Error("BL618DG BootInfo 长度无效");
    const swUsage = new DataView(bootInfo.buffer, bootInfo.byteOffset + 8, 4).getUint32(0, true);
    return (swUsage >>> 14) & 0x3f;
  }

  function flashConfigFromBootInfo(bootInfo) {
    const flashPin = flashPinFromBootInfo(bootInfo);
    return (0x01 << 24) | (0x01 << 16) | (0x43 << 8) | flashPin;
  }

  return Object.freeze({
    CHIP_NAME: "bl618dg",
    CONFIG,
    VERSION_IDS,
    detectVersion,
    flashConfigFromBootInfo,
    flashPinFromBootInfo,
  });
});
