# Project
This project was perform during a Blockchain Hackathon during December 2020.
https://hack.encode.club/

# Description

## Idea
During this project we ask ourselves "Is there a software license market ? Is it possible to buy a software license and sell it for the rest of its expiration time ?"
After a few research we found out that no, it doesn't exists and worst, all software have different system that would be terribly long to adapt... 

So we decided to create our licensing system, open-source and compatible with the possibility to re-sell a license after having buying it based on the Ethereum (or any ethereum-like) blockchain.

## Concept
The principle is simple, there is a smart contract with which a company can create a Software (like a virtual software-twin). It's then possible to create licenses and attribute these licenses to different users. Using a special driver (that is embedded in a software) , the user can then use a software that will itself check the license right using the blockchain.

The user have then the rights to put for sale their licenses, and themselves choose the price. Of course if they put a too high price nobody will buy it...

There is a market that analyse the licenses that are for sell and let any user buy the licenses. The payement is securely operated by the smart-contract.

## Security
The licenses and software ownership and administration rights are all operates using the smart-contract. Thus it is not possible for any user to create for himself and for free a license or buy a license at the wrong price or that is not for sale...

Also the license verification uses the blockchain and is so, by design, very secured. No need for powerfull on-premise server security.

## Advantage of this licensing solution

- Open-source system already made and free (no need for a company that would like to setup a licensing system to recreate the wheel)
- Blockchain based system which allow a strong security as well for the license verification or the general Licenses administrion 
- Grant credibility for the company to use open-source and re-usable license for its softwares, and security certifications.
- Gives the software that onboard on this system an access to the license-market website.
- The possibility to buy a cheap license gives the user the oportunity to test the software for a short custom period and/or gives access to expensive softwares at affordable price for user that would maybe have hacked the license due to high price or no-access to short-therm license.

# Subfolders

There is a few subfolder in this project:

- `smart-contract` which is the folder where all the smart-contract blockchain code stand. You will find the abi and the bytecode of all the compiled contract, and a little description of all the functions and features

- `driver-calculator` which contain a python based calculator application. This application embed a blockchain license verification system before starting the app.

- `web-interface` which contain a gatsby platform that allow to buy/sell license and create / manage software licenses.  You may find the latest version online on: https://license-manager.ballmer.co

# Videos

For the hackathon, a few videos have been made:

- How to start the calculator and verify the license: https://youtu.be/LGIfBz3qIwM
- Simulation of a situation where you start the calculator app, the license isn't valid, you then go on the market and buy a compatible license, it then works: https://youtu.be/2qqEDUXCuog
- How to create a software, and to create a license for this software and attribute it to a user: https://youtu.be/MOp2msH_LMQ
- How to put a license for sale: https://youtu.be/-jsT7-NJewM

# Aknowledgement

This project was done by four friends ([Charly Blanc](https://github.com/charly1 "Charly Blanc"), [Cyril Stuber](https://github.com/cystu "Cyril Stuber"), [Julien Chiappinelli](https://github.com/asyx21 "Julien Chiappinelli") and [Stéphane Ballmer](https://github.com/sballmer "Stéphane Ballmer")). All of us have a master degree in Microengineering, EPFL - Lausanne, Switzerland. 

Our passion lead us to choose programming as an important part of our career.

Thrilled by challenges, we attended to the Encode Hack to challenge our programming skills, improve our blockchain knowledge and remember the good old time when we studied together. 