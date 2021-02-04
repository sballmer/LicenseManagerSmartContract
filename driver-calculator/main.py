# ------------------------- changeable parameters -------------------------
hostName = "localhost"
serverPort = 3000

use_binance = False # binance test or ropsten
use_working_contract = True

use_separate_gui_for_website = False
# ------------------------- end of changeable parameters ------------------



### import :

# ui
from UiHandler import UI_start, UI_set_btn_callback, UI_set_gui_exit_callback, UI_set_label_text, UI_stop, UI_hide, UI_show, UI_start_calculator

# web server
from WebServer import WEBSERVER_start, WEBSERVER_set_post_callback, WEBSERBER_set_rand, WEBSERVER_stop

# default browser url opener
from webbrowser import open as open_webpage 

# calculator
from calculator import CALC_start_thread, CALC_start, CALC_set_exit_cb, CALC_stop

# custom web browser url opener
# from WebViewer.wxViewer import WEBVIEWER_open, WEBVIEWER_stop
# from WebViewer.chromeSelenium import WEBVIEWER_open, WEBVIEWER_stop

import random, sys

### consts

network = 'binance-test' if use_binance else 'ropsten'
software_contract_adr = ""

if use_binance and use_working_contract:
    software_contract_adr = "0x0440829FeDcf48f26F77c2C2dBb49a14fa286111"
elif (not use_binance) and use_working_contract:
    software_contract_adr = "0x3Eda71840b9750329b20f9864c28088Ff2CFE790"
elif use_binance and (not use_working_contract):
    software_contract_adr = "0x0596762baE34B9A1e16E2c4c56318EdE6867fb63"
else: 
    software_contract_adr = "0xe4bfA4cA25D3C8E88C4E50C7AeF148685a53b988"

url_to_open = "http://" + hostName + ":" + str(serverPort) + "/"
rand_added = '%030x' % random.randrange(16**64) # 64 hex char rand

### func

def cb_license_was_checked(valid):
    if valid:
        print("successfully verified the authencity of the license")
        UI_set_label_text("license is valid")
        UI_set_label_text("License status: valid !")

        CALC_start_thread()
        # UI_start_calculator()
        UI_hide()
        UI_stop()
        # try:
        #     stop_all()
        # except:
        #     pass
        # CALC_start()
    else:
        print("failed to verify license authencity: invalid license")
        UI_set_label_text("license is invalid")
        UI_set_label_text("License status: invalid.\nCLick on the button again to reverify the license.")

def start_license_check():
    print("btn clicked")
    UI_set_label_text("License status: being verified...")
    rand_added = '%030x' % random.randrange(16**64) # regenerate rand
    WEBSERBER_set_rand(rand_added)

    if use_separate_gui_for_website:
        WEBVIEWER_open(url_to_open + rand_added)
    else:
        open_webpage(url_to_open + rand_added)

def stop_all():
    UI_stop()
    WEBSERVER_stop()
    # CALC_stop()

    if use_separate_gui_for_website:
        WEBVIEWER_stop()

if __name__ == "__main__":

    # ui setup
    UI_start()
    UI_set_btn_callback(start_license_check)
    UI_set_label_text("License status: not verified")
    UI_set_gui_exit_callback(stop_all)

    # web server handler
    WEBSERVER_start(hostName, serverPort, software_contract_adr, network)
    WEBSERVER_set_post_callback(cb_license_was_checked)
    WEBSERBER_set_rand(rand_added)

    # calculator setup
    CALC_set_exit_cb(stop_all)
    # CALC_start_thread()