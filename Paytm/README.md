# Installation Steps
 1. The *checksum.js* file contains *genchecksum()* and *verifychecksum()* functions. The merchant module should call these methods with the appropriate set of parameters as mentioned in the API document given [here][link1]
 2. Keep all the files in the folder from where you will be calling the *genchecksum()* and *verifychecksum()* methods. 
 3. The *checksum/server.js* file contains set required parameters and code to generate checksum to run the default transaction flow.

   [link1]: https://developer.paytm.com/docs



# For Offline(Wallet Api) Checksum Utility below are the methods:
  1. genchecksumbystring : For generating the checksum
  2. verifychecksumbystring : For verifing the checksum
