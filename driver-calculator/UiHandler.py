import threading
import tkinter as tk
import tkinter.ttk as ttk
# from calculator import CALC_start_thread, CALC_start, CALC_set_exit_cb, CALC_stop
# from calculator2 import App

global_data = { 'ready': False, 'exit_cb': None, 'start_calculator': False}

class Ui:
    def __init__(self, master=None):
        # build ui
        self.frame_1 = ttk.Frame(master)
        self.button_load_license = ttk.Button(self.frame_1)
        self.button_load_license.config(text='Load License')
        self.button_load_license.pack(side='top')
        self.button_load_license.configure(command=self.cb_button_clicked)

        self.label_license = ttk.Label(self.frame_1)
        self.label_license.config(text='License state: not load for now.')
        self.label_license.pack(side='top')
        self.frame_1.config(height='400', width='400', padding='30')
        self.frame_1.pack(side='top')

        # Main widget
        self.mainwindow = self.frame_1
        self.btn_cb = None

    def cb_button_clicked(self):
        # print("button clicked")

        if self.btn_cb:
            self.btn_cb()
        # open_webpage(url_to_open)
        # self.setLabelText("License is loading..")

    def setBtnCallback(self, cb=None):
        self.btn_cb = cb

    def setLabelText(self, text):
        self.label_license.config(text=text)

    def run(self):
        self.mainwindow.mainloop()

def start_ui_thread(data):
    data['UI_root'] = tk.Tk()
    data['UI_app'] = Ui(data['UI_root'])
    data['ready'] = True
    data['UI_app'].run()

    # if data['start_calculator']:
    #     # CALC_start()
    #     App().start()

    if data['exit_cb']:
        data['exit_cb']()


# ---- EXPORT FUNC
def UI_start():
    ui_thread = threading.Thread(target=start_ui_thread, args=(global_data,))
    ui_thread.start()

def UI_show():
    global_data['UI_root'].deiconify()

def UI_hide():
    global_data['UI_root'].withdraw()

def UI_set_btn_callback(cb):
    while not global_data['ready']: pass
    global_data['UI_app'].setBtnCallback(cb)

def UI_set_gui_exit_callback(cb):
    global_data['exit_cb'] = cb

def UI_set_label_text(text):
    while not global_data['ready']: pass
    global_data['UI_app'].setLabelText(text)

def UI_stop():
    while not global_data['ready']: pass

    try:
        global_data['UI_root'].destroy()
    except:
        pass # goes here if already destroyed gui

    print("license gui was stopped")

def UI_start_calculator():
    global_data['start_calculator'] = True



if __name__ == "__main__":
    UI_start()
    UI_set_label_text('CUSTOM TEXT')

    def customFunc(): print("CLICKED LOL")

    UI_set_btn_callback(customFunc)

    print("DONE")
