This file describes the process that was used to produce some of the more unusual assets used in this sim.

TODO: Add info about the piggy bank node creation.

Maps and Temperature Data for the "Temperature" scene of the "Scenes" screen.
=============================================================================

The website where the maps and temperature data was obtains is called the "Climate Data Store" at
https://cds.climate.copernicus.eu/cdsapp#!/home.  I (jbphet) learned just enough about how to use this to get what we
needed.  There is a lot to it, and there may be better and quicker ways to get the information needed, but this got the
job done.

Steps to get set up:
+ Set up Python and pip on your machine if you don't already have it
+ Install the Climate Data Store API for python.  At the time of this writing, directions on how to install this
were found at https://cds.climate.copernicus.eu/api-how-to. 
+ Install the NetCDF software utilities from UniData for manipulating NetCDF (.cd).  I (jbphet) installed the netCDF4
v4.7.0 without DAP (whatever that is) from https://www.unidata.ucar.edu/software/netcdf/docs/winbin.html. 

Steps to create the map images:
+ Create and download the maps using the CDSToolbox and the Python code.  The script for this is `get-nli-map.py`, and
  it is used at the CDS Toolbox website.  The script needs to be run once for each month.
+ Download each image, crop it, make the portions outside the map transparent (Photoshop was used to do this for the
original images)

Steps to get the temperature data:
TODO - finalize this!!!!!!!!!!
+ Download data that matches the map by using the Python code and adjusting the date
+ Run the command `ncdump -v longitude,latitude,t2m download.nc > extracted-data.txt` to pull the data we need from the
downloaded NetCDF file
+ Unfortunately the temperature data, which is the array in the `t2m` variable, is in "packed" format in order to reduce
the file size.  This has be be unpacked, and the process for this is a bit of a pain in the butt.  First, you need to
look at the header by typing `ncdump -h download.nc`.  From the output of this command, extract the scale factor and the
offset and paste them into the NodeJS script `unpack-t2m-temperature.js`.  The extract the `t2m`.... 

