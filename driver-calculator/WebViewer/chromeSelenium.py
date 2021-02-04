from selenium import webdriver
import chromedriver_binary  # Adds chromedriver binary to path

driver = None

url_test = 'http://localhost:3000/?contract=0x0440829FeDcf48f26F77c2C2dBb49a14fa286111&network=binance'

# --------------- EXPORT FUNC 
def WEBVIEWER_open(url='https://www.google.com'):
    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument("--log-level=OFF")
    options.add_argument("--mute-audio")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-extensions")
    options.add_argument("--app="+url)
    # options.add_argument("--window-size=1200,400 --window-position=10,10 --kiosk ")
    # options.add_argument("--kiosk")
    # options.add_argument("--window-size 800 600")

    driver = webdriver.Chrome(options=options)
    # driver.set_window_size(1200,400)
    driver.get(url)


def WEBVIEWER_stop():
    try:
        driver.close()
        print("Web viewer was stopped")
    except:
        pass # goes here if already closed


if __name__ == '__main__':
    WEBVIEW_open()

    print("webview opened. Press ctrl-c to stop")
    while True: pass