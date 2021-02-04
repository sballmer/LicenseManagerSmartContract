from tkinter import *
import threading

global_data = {'running':False}
class App:
    def __init__(self):

        self.win = Tk() # This is to create a basic window
        self.win.geometry("312x324")  # this is for the size of the window 
        self.win.resizable(0, 0)  # this is to prevent from resizing the window
        self.win.title("Calculator")
         
        self.expression = ""
         
        # 'StringVar()' :It is used to get the instance of input field
        self.input_text = StringVar()
         
        # Let us creating a frame for the input field
        self.input_frame = Frame(self.win, width=312, height=50, bd=0, highlightbackground="black", highlightcolor="black", highlightthickness=2)
        self.input_frame.pack(side=TOP)
         
        #Let us create a input field inside the 'Frame'
        self.input_field = Entry(self.input_frame, font=('arial', 18, 'bold'), textvariable=self.input_text, width=50, bg="#eee", bd=0, justify=RIGHT)
        self.input_field.grid(row=0, column=0)
        self.input_field.pack(ipady=10) # 'ipady' is internal padding to increase the height of input field
         
        #Let us creating another 'Frame' for the button below the 'input_frame'
        self.btns_frame = Frame(self.win, width=312, height=272.5, bg="grey")
        self.btns_frame.pack()
         
        # first row
        self.btn_clear = Button(self.btns_frame, text = "Clear", fg = "black", width = 32, height = 3, bd = 0, bg = "#eee", cursor = "hand2", command = lambda: self.bt_clear()).grid(row = 0, column = 0, columnspan = 3, padx = 1, pady = 1)
        self.btn_divide = Button(self.btns_frame, text = "/", fg = "black", width = 10, height = 3, bd = 0, bg = "#eee", cursor = "hand2", command = lambda: self.btn_click("/")).grid(row = 0, column = 3, padx = 1, pady = 1)
         
        # second row
        self.btn_seven = Button(self.btns_frame, text = "7", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(7)).grid(row = 1, column = 0, padx = 1, pady = 1)
        self.btn_eight = Button(self.btns_frame, text = "8", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(8)).grid(row = 1, column = 1, padx = 1, pady = 1)
        self.btn_nine = Button(self.btns_frame, text = "9", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(9)).grid(row = 1, column = 2, padx = 1, pady = 1)
        self.btn_multiply = Button(self.btns_frame, text = "*", fg = "black", width = 10, height = 3, bd = 0, bg = "#eee", cursor = "hand2", command = lambda: self.btn_click("*")).grid(row = 1, column = 3, padx = 1, pady = 1)
         
        # third row
        self.btn_four = Button(self.btns_frame, text = "4", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(4)).grid(row = 2, column = 0, padx = 1, pady = 1)
        self.btn_five = Button(self.btns_frame, text = "5", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(5)).grid(row = 2, column = 1, padx = 1, pady = 1)
        self.btn_six = Button(self.btns_frame, text = "6", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(6)).grid(row = 2, column = 2, padx = 1, pady = 1)
        self.btn_minus = Button(self.btns_frame, text = "-", fg = "black", width = 10, height = 3, bd = 0, bg = "#eee", cursor = "hand2", command = lambda: self.btn_click("-")).grid(row = 2, column = 3, padx = 1, pady = 1)

        # fourth row
        self.btn_one = Button(self.btns_frame, text = "1", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(1)).grid(row = 3, column = 0, padx = 1, pady = 1)
        self.btn_two = Button(self.btns_frame, text = "2", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(2)).grid(row = 3, column = 1, padx = 1, pady = 1)
        self.btn_three = Button(self.btns_frame, text = "3", fg = "black", width = 10, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(3)).grid(row = 3, column = 2, padx = 1, pady = 1)
        self.btn_plus = Button(self.btns_frame, text = "+", fg = "black", width = 10, height = 3, bd = 0, bg = "#eee", cursor = "hand2", command = lambda: self.btn_click("+")).grid(row = 3, column = 3, padx = 1, pady = 1)
         
        # fourth row
        self.btn_zero = Button(self.btns_frame, text = "0", fg = "black", width = 21, height = 3, bd = 0, bg = "#fff", cursor = "hand2", command = lambda: self.btn_click(0)).grid(row = 4, column = 0, columnspan = 2, padx = 1, pady = 1)
        self.btn_point = Button(self.btns_frame, text = ".", fg = "black", width = 10, height = 3, bd = 0, bg = "#eee", cursor = "hand2", command = lambda: self.btn_click(".")).grid(row = 4, column = 2, padx = 1, pady = 1)
        self.btn_equals = Button(self.btns_frame, text = "=", fg = "black", width = 10, height = 3, bd = 0, bg = "#eee", cursor = "hand2", command = lambda: self.bt_equal()).grid(row = 4, column = 3, padx = 1, pady = 1)
         
    def start(self):
        self.win.mainloop()

    # 'btn_click' function : 
    # This Function continuously updates the 
    # input field whenever you enters a number
    def btn_click(self, item):
        self.expression = self.expression + str(item)
        self.input_text.set(self.expression)

    # 'bt_clear' function :This is used to clear 
    # the input field
    def bt_clear(self, ): 
        self.expression = "" 
        self.input_text.set("")
     
    # 'bt_equal':This method calculates the expression 
    # present in input field
    def bt_equal(self, ):
        result = str(eval(self.expression)) # 'eval':This function is used to evaluates the string expression directly
        self.input_text.set(result)
        self.expression = ""


def CALC_start():
    global_data['running'] = True
    global_data['app'] = App()
    global_data['app'].start()
    global_data['running'] = False
    if 'exit_cb' in global_data:
        global_data['exit_cb']()

def CALC_start_thread():
    threading.Thread(target=CALC_start).start()

def CALC_set_exit_cb(cb):
    global_data['exit_cb'] = cb

def CALC_stop():
    if global_data['running']:
        try:
            global_data['app'].win.quit()
        except:
            pass
    print("calculator gui was stopped")

if __name__ == '__main__':
    CALC_start()