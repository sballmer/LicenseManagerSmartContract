from tkinter import *
import math

class App:
    def start_license (self):
        self.root = Tk()
        self.root.title('License Check')

        frame = Frame(self.root)

        # self.frame_1 = ttk.Frame(master)
        # self.button_load_license = ttk.Button(self.frame_1)
        # self.button_load_license.config(text='Load License')
        # self.button_load_license.pack(side='top')
        # self.button_load_license.configure(command=self.cb_button_clicked)
        Button(frame,font=('futura', 11, ''),
               padx=0,pady=0, text = 'Load License',
               command = lambda:self.cb_button_clicked_license())#.grid(row = 1 , column = 1)

        frame.config(height='400', width='400') #, padding='30')

        # self.label_license = ttk.Label(self.frame_1)
        # self.label_license.config(text='License state: not load for now.')
        # self.label_license.pack(side='top')
        # self.frame_1.config(height='400', width='400', padding='30')
        # self.frame_1.pack(side='top')

        # # Main widget
        # self.mainwindow = self.frame_1
        # self.btn_cb = None

        self.root.mainloop()

    def cb_button_clicked_license(self):
        print("license button clicked")

    def start_calculator (self):
        self.answerVariableGlobal = ""
        self.answerLabelForSquareRoot = ""
        self.root = Tk()
        self.root.title('Calculator App')
        self.answerEntryLabel = StringVar()
        Label(self.root, font=('futura', 25, 'bold'),textvariable = self.answerEntryLabel,justify = LEFT, height=2, width=7).grid(columnspan=4, ipadx=120)
        self.answerFinalLabel = StringVar()
        Label(self.root, font=('futura', 25, 'bold'),textvariable = self.answerFinalLabel,justify = LEFT, height=2, width=7).grid(columnspan = 4 , ipadx=120)

        buttons = ['AC','√','%','/','7','8','9','*','4','5','6','-','1','2','3','+','','','.','']
        buttonsListTraversalCounter = 0

        for i in range(3,8):
            for j in range(0,4):
                self.createButton(buttons[buttonsListTraversalCounter],i,j)
                buttonsListTraversalCounter = buttonsListTraversalCounter + 1

        Button(self.root,font=('futura', 15, 'bold'),
               padx=16,pady=16, text = "√",
               command = lambda:self.evaluateSquareRoot(),
               height=2, width=9).grid(row = 3 , column = 1, sticky = E)
        Button(self.root,font=('futura', 15, 'bold'),
               padx=16,pady=16, text = "AC",
               command = lambda:self.allClear(),
               height=2, width=9).grid(row = 3 , column = 0 , sticky = E)
        Button(self.root,font=('futura', 15, 'bold'),
               padx=16,pady=16, text = "0",
               command = lambda:self.changeAnswerEntryLabel(0),
               height=2, width=21).grid(row = 7 , column = 0 ,
               columnspan=2 , sticky = E)
        Button(self.root,font=('futura', 15, 'bold'),
               padx=16,pady=16, text = "=",
               command = lambda:self.evaluateAnswer(),
               height=2, width=9).grid(row = 7 , column = 3, sticky = E)

        self.root.mainloop()

    def changeAnswerEntryLabel(self, entry):
        # global self.answerVariableGlobal
        # global self.answerLabelForSquareRoot
        
        self.answerVariableGlobal = self.answerVariableGlobal + str(entry)
        self.answerLabelForSquareRoot = self.answerVariableGlobal
        self.answerEntryLabel.set(self.answerVariableGlobal)

    def clearAnswerEntryLabel(self):
        # global self.answerVariableGlobal
        # global self.answerLabelForSquareRoot

        self.answerLabelForSquareRoot = self.answerVariableGlobal
        self.answerVariableGlobal = ""
        self.answerEntryLabel.set(self.answerVariableGlobal)

    def evaluateSquareRoot(self):
        # global self.answerVariableGlobal
        # global self.answerLabelForSquareRoot    
        try:
            sqrtAnswer = math.sqrt(eval(str(self.answerLabelForSquareRoot)))
            self.clearAnswerEntryLabel()
            self.answerFinalLabel.set(sqrtAnswer)
        except(ValueError,SyntaxError,TypeError, ZeroDivisionError):
            try:
                sqrtAnswer = math.sqrt(eval(str(self.answerVariableGlobal)))
                self.clearAnswerEntryLabel()
                self.answerFinalLabel.set(sqrtAnswer)        
            except(ValueError,SyntaxError,TypeError,ZeroDivisionError):
                self.clearAnswerEntryLabel()
                self.answerFinalLabel.set("Error!")

    def evaluateAnswer(self):
        # global self.answerVariableGlobal
        try:
           eval(self.answerVariableGlobal)
           evaluatedValueAnswerLabelGlobal= str(eval(self.answerVariableGlobal))    # This line should be alligned                 properly without any indentation error
           self.clearAnswerEntryLabel()
           self.answerFinalLabel.set(evaluatedValueAnswerLabelGlobal)

        except(ValueError,SyntaxError,TypeError, ZeroDivisionError):
            self.clearAnswerEntryLabel()
            self.answerFinalLabel.set("Error!")

    def allClear(self):
        # global self.answerVariableGlobal
        # global self.answerLabelForSquareRoot

        self.answerVariableGlobal = ""
        self.answerLabelForSquareRoot = ""
        self.answerEntryLabel.set("")
        self.answerFinalLabel.set("")

    def createButton(self, txt,x,y):
        Button(self.root, font=('futura', 15, 'bold'),
               padx=16,pady=16,text = str(txt),
               command = lambda:self.changeAnswerEntryLabel(txt),
               height = 2, width=9).grid(row = x , column = y, sticky=E)

if __name__ == '__main__':
    # App().start_calculator()
    App().start_license()