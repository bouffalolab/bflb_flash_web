# bflb_flash_web

Pure static Web Serial flasher for Bouffalo chips. It mirrors the target
configuration and UART protocol used by `tools/bflb_flash` and supports
`BL602`, `BL616`, `BL616CL`, and `BL618DG`.

Serve this directory from localhost and open it in desktop Chrome or Edge:

```sh
python3 -m http.server 8000 --directory tools/bflb_flash_web
```

The page writes the selected `whole.bin` at flash address `0x00000000`, performs
an XIP SHA-256 verification, and can reset the board after a successful write.
Enable “Erase 全部 Flash” to erase the entire detected Flash before writing,
including all existing data outside the firmware range. It is off by default;
otherwise only the firmware range is erased.
The BL602 helper loader and flash parameter files are served from the
corresponding `targets/bl602/` directory. Select a chip explicitly or let the
BootROM identify it automatically.
BL618DG uses the target-specific Flash clock and parameter file in
`targets/bl618dg/`.
