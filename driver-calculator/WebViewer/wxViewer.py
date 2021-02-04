import wx 
import wx.html2 
import threading

global_data={}

class MyBrowser(wx.Frame): 
    def __init__(self, *args, **kwds): 
        wx.Frame.__init__(self, None, -1, size=(1200,900), style=wx.DEFAULT_FRAME_STYLE | wx.NO_BORDER ^ wx.SYSTEM_MENU)
        self.browser = wx.html2.WebView.New(self) 
        self.browser.EnableAccessToDevTools(False)
        self.browser.EnableContextMenu(False)
        self.ShowFullScreen(False)

def web_thread_start(data_struct, url):
    data_struct['app'] = wx.App() 
    data_struct['dialog'] = MyBrowser(None, -1) 
    data_struct['dialog'].browser.LoadURL(url) 
    data_struct['dialog'].Show() 
    data_struct['app'].MainLoop() 

# --------------- EXPORT FUNC 
def WEBVIEWER_open(url='https://www.google.com'):
    web_thread = threading.Thread(target=web_thread_start, args=(global_data,url,))
    web_thread.start()

def WEBVIEWER_stop():
    try:
        # global_data['dialog'].Close()
        global_data['dialog'].Destroy()
        print("Web viewer was stopped")
    except:
        pass # goes here if already destroyed


if __name__ == '__main__':
    WEBGUI_open()