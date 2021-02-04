# http server
from http.server import BaseHTTPRequestHandler, HTTPServer

# multi thread
from socketserver import ThreadingMixIn
import threading

# http data stuff
from mimelib import url as mime
from urllib.parse import urlparse
import json
from compressed_public import data as public_files
from public2py import decompress_data


global_data = { 'cb' : None, 'rand' : "" }
class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path) # parse url, query and all url possible stuff
        file = 'file.notexists'

        if url.path == '/':
            pass # deactivated path

        elif url.path == '/' + self.server.rand:
            file = 'public/html/index.html'

        elif url.path == '/public/js/consts.js':
            self.send_response(200)
            self.send_header('Content-type', "application/javascript")
            self.end_headers()
            self.wfile.write(('CONSTS_contract_adr="' + self.server.contract_adr + '";\nCONSTS_network="' + self.server.network + '";\n').encode('UTF-8'))
            return;

        elif url.path[:7] == '/public':
            file = url.path[1:]

        if file in public_files:
            self.send_response(200)
            self.send_header('Content-type', mime(file).mime_type)
            self.end_headers()
            self.wfile.write(decompress_data(public_files[file]))

        else:
            self.send_response(404)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(decompress_data(public_files['public/html/404.html']))

    def do_POST(self):
        url = urlparse(self.path) # parse url, query and all url possible stuff
        post_data = None

        if url.path == '/' + self.server.rand + '/check_owner':
            try:
                content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
                post_data = json.loads(self.rfile.read(content_length)) # <--- Gets the data itself
            except: # might fail due to wrong json
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status":"incorrect data format"}')

            if post_data and 'is_valid' in post_data:
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status":"ok"}')

                if self.server.cb:
                    self.server.cb(True if post_data['is_valid'] else False)
                else:
                    if post_data['is_valid']:
                        print("successfully verified the authencity of the license")
                    else:
                        print("failed to verify license authencity: invalid license")
            else:
                # invalid data type
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(b'{"status":"incorrect data format"}')

        else:
            self.send_response(404)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"not found"}')

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""


# ---- EXPORT FUNC
def WEBSERVER_start(hostName="localhost", serverPort=3000, contract_adr="0x0440829FeDcf48f26F77c2C2dBb49a14fa286111", network='binance-test'):
    global_data['hostName'] = hostName
    global_data['serverPort'] = serverPort
    global_data['contract_adr'] = contract_adr
    global_data['network'] = network

    global_data['server'] = ThreadedHTTPServer((hostName, serverPort), MyServer)
    global_data['server'].cb = None
    global_data['server'].contract_adr = contract_adr
    global_data['server'].network = network
    web_thread = threading.Thread(target=global_data['server'].serve_forever)
    web_thread.start()

    print("Server start host on http://" + hostName + ":" + str(serverPort) + "/")

def WEBSERBER_set_rand(rand_str):
    global_data['rand'] = rand_str
    global_data['server'].rand = rand_str

def WEBSERVER_set_post_callback(cb):
    global_data['server'].cb = cb

def WEBSERVER_stop():
    global_data['server'].shutdown()
    global_data['server'].server_close()

    print("web server was stopped")


if __name__ == "__main__":

    # start webserver
    WEBSERVER_start("localhost", 3000)

    # define callback
    def custom_callback(result=False): print("post lol", result)

    # set callback
    WEBSERVER_set_post_callback(custom_callback)

    # a little print
    print("Server started, press ctrl-c to stop")

    # the server is running on another thread so we can wait unti ctrl-c
    while True: pass

    # after a ctrl-c
    print("Stopping server hosting")
    WEBSERVER_stop()
