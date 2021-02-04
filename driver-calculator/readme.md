# Driver API (python version)

## Description

This soft launch a fake software (pretending to be solidworks or photoshop or whatev') and verify the license authencity.

## Run (in debug, requires python3 and many lib)

`python3 main.py`

## Compile

### Add content to public/

If you change any content or add files or folder to public/, you will have to compress it using `python3 public2py.py`.
Indeed the files have to be compressed in order to be embedded in the .exe

### Prod (without console)

`pyinstaller --onefile --windowed main.py`

You may find the executable in dist/main.exe (for windows)

### Debug (with console)

`pyinstaller --onefile main.py`

You may find the executable in dist/main.exe (for windows)

## Edit ui

You may use pygubu-designer to edit the UI (find tkinter.ui) and copy paste the code in main.py
